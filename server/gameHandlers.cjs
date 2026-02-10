/**
 * Game logic handlers for HDP (Hasta Donde Puedas)
 * Replaces previous Mono/Spyfall logic
 */
const fs = require('fs');
const path = require('path');
const { shuffleArray, countBlanks } = require('./utils.cjs');

// Load Card Data
const cartasPath = path.join(__dirname, '../src/data/cartas.json');

let manualNegras = [];
let manualBlancas = [];
let cartasData = { THEMES: {} };

try {
  cartasData = JSON.parse(fs.readFileSync(cartasPath, 'utf8'));
  // Extract cards from the new structure: THEMES.basico.NEGRAS and THEMES.basico.BLANCAS
  manualNegras = cartasData.THEMES.basico.NEGRAS || [];
  manualBlancas = cartasData.THEMES.basico.BLANCAS || [];
  console.log(`Loaded ${manualNegras.length} black cards and ${manualBlancas.length} white cards.`);
} catch (err) {
  console.error("Error loading card data:", err);
}

function setupGameHandlers(socket, roomManager) {

  socket.on('startGame', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.hostId === socket.id && room.players.length >= 3) {
      room.status = 'playing';

      // Initialize Decks
      const activePlayers = room.players.filter(p => p.connected !== false);

      // Construct Decks based on selected themes
      let gameNegras = [];
      let gameBlancas = [];

      const selectedThemes = room.settings.selectedThemes || ['basico'];
      console.log(`Building deck from themes: ${selectedThemes.join(', ')}`);

      selectedThemes.forEach(themeName => {
        // 1. Check Built-in Themes
        if (cartasData.THEMES[themeName]) {
          if (cartasData.THEMES[themeName].NEGRAS) gameNegras.push(...cartasData.THEMES[themeName].NEGRAS);
          if (cartasData.THEMES[themeName].BLANCAS) gameBlancas.push(...cartasData.THEMES[themeName].BLANCAS);
        }
        // 2. Check Contributed Themes
        else {
          // Contributed themes are stored in room.contributedThemes
          // The themeName might be complex string "contributed:Name:Id" or just "Name"
          // We need to match it.
          // If it's a simple name "My List" (from local selection which wasn't effectively contributed properly but might be in contributedThemes if we are lucky or if logic changed), check by name.
          // But usually contributed themes are toggled via the complex key.
          // Let's check both or find partial match?

          // In ThemeSelector: `contributed:${theme.name}:${theme.contributorId}`
          // So themeName in selectedThemes would be that string.

          let found = false;
          if (themeName.startsWith('contributed:')) {
            const parts = themeName.split(':');
            const name = parts[1];
            const contributorId = parts[2];
            const contrib = room.contributedThemes.find(t => t.name === name && t.contributorId === contributorId);
            if (contrib) {
              if (contrib.black) gameNegras.push(...contrib.black);
              if (contrib.white) gameBlancas.push(...contrib.white);
              found = true;
            }
          }

          if (!found) {
            // Try finding by exact name in contributed themes (fallback)
            const contrib = room.contributedThemes.find(t => t.name === themeName);
            if (contrib) {
              if (contrib.black) gameNegras.push(...contrib.black);
              if (contrib.white) gameBlancas.push(...contrib.white);
            }
          }
        }
      });

      // Fallback if empty (e.g. invalid themes)
      if (gameNegras.length === 0) gameNegras = [...manualNegras];
      if (gameBlancas.length === 0) gameBlancas = [...manualBlancas];

      // Deduplicate using Set
      gameNegras = [...new Set(gameNegras)];
      gameBlancas = [...new Set(gameBlancas)];

      // Shuffle
      gameNegras = shuffleArray(gameNegras);
      gameBlancas = shuffleArray(gameBlancas);

      room.gameData = {
        state: 'playing', // playing -> voting -> results
        decks: {
          negras: gameNegras,
          blancas: gameBlancas
        },
        hands: {}, // playerId -> [cards]
        scores: {}, // playerId -> number
        currentBlackCard: null,
        table: [], // { submissionId, playerId, cards: [text] }
        votes: {}, // playerId -> submissionId
        roundWinnerIds: [],
        czarIndex: 0 // Track who is the Czar (Reader)
      };

      // Initialize Scores and Hands
      activePlayers.forEach(p => {
        room.gameData.scores[p.playerId] = 0;
        room.gameData.hands[p.playerId] = [];
        // Deal 10 cards
        for (let i = 0; i < 10; i++) {
          if (room.gameData.decks.blancas.length > 0) {
            room.gameData.hands[p.playerId].push(room.gameData.decks.blancas.pop());
          }
        }
      });

      startNewRound(room);
      roomManager.emitToRoom(roomId, 'gameStarted', getPublicGameData(room));
      emitHandUpdates(room, roomManager);
    }
  });

  socket.on('submitCards', ({ roomId, cards }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.gameData && room.gameData.state === 'playing') {
      const player = room.players.find(p => p.id === socket.id);
      if (!player) return;

      // Check if player already submitted
      if (room.gameData.table.some(entry => entry.playerId === player.playerId)) {
        return;
      }

      // Check if card count matches black card requirement
      const required = countBlanks(room.gameData.currentBlackCard);
      if (cards.length !== required) {
        return; // Invalid submission
      }

      // Remove cards from hand
      const hand = room.gameData.hands[player.playerId];
      const newHand = hand.filter(c => !cards.includes(c));

      // Verify player actually had these cards (simple security)
      if (hand.length - newHand.length !== required) {
        console.warn(`Player ${player.name} tried to play cards they don't have.`);
        return;
      }
      room.gameData.hands[player.playerId] = newHand;

      // Update this player's hand immediately
      emitHandUpdates(room, roomManager);

      const submissionId = generateSubmissionId();
      room.gameData.table.push({
        submissionId: submissionId,
        playerId: player.playerId,
        cards: cards
      });

      // Send private confirmation so client knows their submission ID
      socket.emit('submissionAccepted', { submissionId });

      // Check if all active players submitted
      const activePlayers = room.players.filter(p => p.connected !== false);
      const submissions = room.gameData.table.length;

      console.log(`Submissions: ${submissions}, Active Players: ${activePlayers.length}`);

      if (submissions >= activePlayers.length) {
        console.log('All players submitted.');

        // Check Game Type
        if (room.settings.type === 'in_person') {
          console.log('In Person Mode: Switching to READING phase.');
          room.gameData.state = 'reading';
          // Shuffle table for anonymity before reading
          shuffleArray(room.gameData.table);
        } else {
          console.log('Chat Mode: Switching to VOTING phase.');
          room.gameData.state = 'voting';
          // Shuffle table for anonymity
          shuffleArray(room.gameData.table);
        }
      } else {
        console.log('Waiting for more submissions...');
      }

      roomManager.emitToRoom(room.id, 'gameDataUpdated', getPublicGameData(room));
    }
  });

  socket.on('submitVote', ({ roomId, submissionId }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.gameData && room.gameData.state === 'voting') {
      const player = room.players.find(p => p.id === socket.id);
      if (!player) return;

      // Check if player already voted
      if (room.gameData.votes[player.playerId]) {
        return;
      }

      // NO SELF VOTING Check
      const targetSubmission = room.gameData.table.find(s => s.submissionId === submissionId);
      if (!targetSubmission) return; // Invalid submission ID

      if (targetSubmission.playerId === player.playerId) {
        socket.emit('error', { message: "No podés votarte a vos mismo, che." });
        return;
      }

      // Record Vote
      room.gameData.votes[player.playerId] = submissionId;

      // Check if all active players voted
      const activePlayers = room.players.filter(p => p.connected !== false);
      const voteCount = Object.keys(room.gameData.votes).length;

      if (voteCount >= activePlayers.length) {
        processRoundResults(room);
      }

      roomManager.emitToRoom(room.id, 'gameDataUpdated', getPublicGameData(room));
    }
  });

  socket.on('startVoting', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.gameData && room.gameData.state === 'reading') {
      // Allow Czar or Host to start voting
      // ideally check if socket.id is Czar, but for flexibility Host is ok too
      // Let's implement strict Czar check if possible, or lax. 
      // Lax for now to avoid stuck games.

      console.log(`Starting voting phase for room ${roomId}`);
      room.gameData.state = 'voting';
      roomManager.emitToRoom(roomId, 'gameDataUpdated', getPublicGameData(room));
    }
  });

  socket.on('nextRound', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.hostId === socket.id && room.gameData && room.gameData.state === 'results') {
      startNewRound(room);
      roomManager.emitToRoom(roomId, 'gameDataUpdated', getPublicGameData(room));
      emitHandUpdates(room, roomManager);
    }
  });

  socket.on('resetGame', ({ roomId }) => {
    const room = roomManager.getRoom(roomId);
    if (room && room.hostId === socket.id) {
      room.gameData = null;
      room.status = 'waiting';
      roomManager.emitToRoom(roomId, 'gameReset', room);
      roomManager.broadcastRoomList();
    }
  });
}

// --- Helpers ---

function startNewRound(room) {
  room.gameData.state = 'playing';
  room.gameData.table = [];
  room.gameData.votes = {};
  room.gameData.votes = {};
  room.gameData.roundWinnerIds = [];

  // Rotate Czar
  const activePlayers = room.players.filter(p => p.connected !== false);
  if (activePlayers.length > 0) {
    room.gameData.czarIndex = (room.gameData.czarIndex + 1) % activePlayers.length;
  }

  // Pick Black Card
  if (room.gameData.decks.negras.length === 0) {
    console.log('Black deck empty, recycling...');
    const selectedThemes = room.settings.selectedThemes || ['basico'];
    let newNegras = [];

    selectedThemes.forEach(themeName => {
      if (cartasData.THEMES[themeName]) {
        if (cartasData.THEMES[themeName].NEGRAS) newNegras.push(...cartasData.THEMES[themeName].NEGRAS);
      } else {
        // Check contributed
        if (themeName.startsWith('contributed:')) {
          const parts = themeName.split(':');
          const contrib = room.contributedThemes.find(t => t.name === parts[1] && t.contributorId === parts[2]);
          if (contrib && contrib.black) newNegras.push(...contrib.black);
        } else {
          const contrib = room.contributedThemes.find(t => t.name === themeName);
          if (contrib && contrib.black) newNegras.push(...contrib.black);
        }
      }
    });

    // Deduplicate and Shuffle
    newNegras = shuffleArray([...new Set(newNegras)]);
    room.gameData.decks.negras = newNegras;
  }

  room.gameData.currentBlackCard = room.gameData.decks.negras.pop() || "Se acabaron las cartas negras.";

  // Replenish Hands (up to 10)
  activePlayers.forEach(p => {
    const hand = room.gameData.hands[p.playerId];
    while (hand.length < 10) {
      if (room.gameData.decks.blancas.length === 0) {
        console.log('White deck empty, recycling...');
        const selectedThemes = room.settings.selectedThemes || ['basico'];
        let newBlancas = [];

        selectedThemes.forEach(themeName => {
          if (cartasData.THEMES[themeName]) {
            if (cartasData.THEMES[themeName].BLANCAS) newBlancas.push(...cartasData.THEMES[themeName].BLANCAS);
          } else {
            // Check contributed
            if (themeName.startsWith('contributed:')) {
              const parts = themeName.split(':');
              const contrib = room.contributedThemes.find(t => t.name === parts[1] && t.contributorId === parts[2]);
              if (contrib && contrib.white) newBlancas.push(...contrib.white);
            } else {
              const contrib = room.contributedThemes.find(t => t.name === themeName);
              if (contrib && contrib.white) newBlancas.push(...contrib.white);
            }
          }
        });

        // Deduplicate
        newBlancas = [...new Set(newBlancas)];

        // Filter out cards currently in anyone's hand to avoid duplicates in play
        const allHands = Object.values(room.gameData.hands).flat();
        newBlancas = newBlancas.filter(c => !allHands.includes(c));

        // Shuffle
        room.gameData.decks.blancas = shuffleArray(newBlancas);

        if (room.gameData.decks.blancas.length === 0) break; // Still empty? Stop.
      }

      hand.push(room.gameData.decks.blancas.pop());
    }
  });
}

function processRoundResults(room) {
  room.gameData.state = 'results';

  // Tally votes
  const counts = {}; // submissionId -> count
  Object.values(room.gameData.votes).forEach(subId => {
    counts[subId] = (counts[subId] || 0) + 1;
  });

  // Find Winner(s)
  let maxVotes = 0;
  Object.values(counts).forEach(c => {
    if (c > maxVotes) maxVotes = c;
  });

  const winningSubmissionIds = Object.keys(counts).filter(id => counts[id] === maxVotes);

  // Award Points
  if (winningSubmissionIds.length > 0) {
    const points = 1 / winningSubmissionIds.length;
    winningSubmissionIds.forEach(subId => {
      const submission = room.gameData.table.find(s => s.submissionId === subId);
      if (submission) {
        room.gameData.scores[submission.playerId] = (room.gameData.scores[submission.playerId] || 0) + points;
        room.gameData.roundWinnerIds.push(submission.playerId);
      }
    });
  }
}

function getPublicGameData(room) {
  if (!room.gameData) return null;

  // Clone to avoid mutating internal state
  const sendData = {
    state: room.gameData.state,
    scores: room.gameData.scores,
    currentBlackCard: room.gameData.currentBlackCard,
    currentBlackCard: room.gameData.currentBlackCard,
    roundWinnerIds: room.gameData.roundWinnerIds,
    czarId: room.players[room.gameData.czarIndex]?.playerId // Expose Czar ID
  };

  // State specific filtering
  if (room.gameData.state === 'playing') {
    // Hide table contents, just show count or nothing? 
    // Usually existing implementations show who played.
    sendData.table = room.gameData.table.map(entry => ({
      submissionId: entry.submissionId,
      playerId: entry.playerId, // Show who played so we know who we are waiting for
      status: 'submitted',
      cards: [] // Hide cards
    }));
  } else if (room.gameData.state === 'reading') {
    // Show cards (anonymous) for reading
    sendData.table = room.gameData.table.map(entry => ({
      submissionId: entry.submissionId,
      cards: entry.cards
      // No playerId
    }));
  } else if (room.gameData.state === 'voting') {
    // Show cards, Hide playerIds (Anonymity)
    sendData.table = room.gameData.table.map(entry => ({
      submissionId: entry.submissionId,
      cards: entry.cards
      // No playerId
    }));
    // Show who has voted
    sendData.voters = Object.keys(room.gameData.votes);
  } else if (room.gameData.state === 'results') {
    // Show everything
    sendData.table = room.gameData.table;
    sendData.votes = room.gameData.votes;
  }

  return sendData;
}

function emitHandUpdates(room, roomManager) {
  const activePlayers = room.players.filter(p => p.connected !== false);
  activePlayers.forEach(p => {
    const hand = room.gameData.hands[p.playerId];
    // This assumes roomManager.io is available, which it should be if passed correctly.
    // However, roomManager.io might not have direct .sockets.sockets.get helper in all versions or mock.
    // Standard Socket.IO v4: io.sockets.sockets.get(socketId)
    // Error handling if socket not found (disconnected)
    const socket = roomManager.io.sockets.sockets.get(p.id);
    if (socket) {
      socket.emit('handUpdated', hand);
    }
  });
}

function generateSubmissionId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = { setupGameHandlers };
