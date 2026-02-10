const { setupGameHandlers } = require('../server/gameHandlers.cjs');
const { generateRoomCode } = require('../server/utils.cjs');

// Mock dependencies
const mockIo = {
  sockets: {
    sockets: new Map()
  },
  to: (roomId) => ({
    emit: (event, data) => {
      console.log(`[ROOM ${roomId}] ${event}:`, JSON.stringify(data).substring(0, 100) + "...");
    }
  }),
  emit: () => { }
};

class MockSocket {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.handlers = {};
    mockIo.sockets.sockets.set(id, this);
  }

  on(event, handler) {
    this.handlers[event] = handler;
  }

  emit(event, data) {
    console.log(`[SOCKET ${this.name}] ${event}:`, JSON.stringify(data).substring(0, 100) + "...");
  }
}

// Minimal RoomManager Mock
const rooms = {};
const roomManager = {
  io: mockIo,
  getRoom: (id) => rooms[id],
  emitToRoom: (id, event, data) => mockIo.to(id).emit(event, data),
  broadcastRoomList: () => { }
};

// Setup Test
const roomId = "TEST";
const p1 = new MockSocket("s1", "Player1");
const p2 = new MockSocket("s2", "Player2");
const p3 = new MockSocket("s3", "Player3");

const room = {
  id: roomId,
  hostId: p1.id,
  players: [
    { id: p1.id, playerId: "p1", name: "Player1", connected: true },
    { id: p2.id, playerId: "p2", name: "Player2", connected: true },
    { id: p3.id, playerId: "p3", name: "Player3", connected: true }
  ],
  gameData: null
};
rooms[roomId] = room;

// Initialize Handlers
setupGameHandlers(p1, roomManager);
setupGameHandlers(p2, roomManager);
setupGameHandlers(p3, roomManager);

// --- TEST SCENARIO ---
async function runTest() {
  console.log(">>> STARTING GAME <<<");
  p1.handlers['startGame']({ roomId });

  if (!room.gameData) {
    console.error("Game did not start!");
    return;
  }

  const blackCard = room.gameData.currentBlackCard;
  console.log("Black Card:", blackCard);
  const required = (blackCard.match(/_+/g) || []).length || 1;
  console.log("Required cards:", required);

  console.log(">>> PLAYING CARDS <<<");
  // Player 1 plays
  const hand1 = room.gameData.hands["p1"];
  const cards1 = hand1.slice(0, required);
  p1.handlers['submitCards']({ roomId, cards: cards1 });

  // Player 2 plays
  const hand2 = room.gameData.hands["p2"];
  const cards2 = hand2.slice(0, required);
  p2.handlers['submitCards']({ roomId, cards: cards2 });

  // Player 3 plays
  const hand3 = room.gameData.hands["p3"];
  const cards3 = hand3.slice(0, required);
  p3.handlers['submitCards']({ roomId, cards: cards3 });

  // Check state
  if (room.gameData.state !== 'voting') {
    console.error("State should be voting but is:", room.gameData.state);
  } else {
    console.log("State is Voting. Submissions:", room.gameData.table.length);
  }

  console.log(">>> VOTING <<<");
  const submissions = room.gameData.table;
  const sub1 = submissions.find(s => s.playerId === "p1");
  const sub2 = submissions.find(s => s.playerId === "p2");
  const sub3 = submissions.find(s => s.playerId === "p3");

  // P1 tries to vote for self (should fail)
  console.log("TEST: P1 self-vote attempt");
  p1.handlers['submitVote']({ roomId, submissionId: sub1.submissionId });

  // P1 votes for P2
  console.log("TEST: P1 votes for P2");
  p1.handlers['submitVote']({ roomId, submissionId: sub2.submissionId });

  // P2 votes for P1
  console.log("TEST: P2 votes for P1");
  p2.handlers['submitVote']({ roomId, submissionId: sub1.submissionId });

  // P3 votes for P2 (P2 wins)
  console.log("TEST: P3 votes for P2");
  p3.handlers['submitVote']({ roomId, submissionId: sub2.submissionId });

  if (room.gameData.state === 'results') {
    console.log("State is Results. Winner IDs:", room.gameData.roundWinnerIds);
    console.log("Scores:", room.gameData.scores);
    if (room.gameData.scores["p2"] === 1) { // 2 votes / 2 max votes? No.
      // Logic: P2 got 2 votes, P1 got 1 vote. P2 wins.
      // Points: 1/n winners. n=1. Points=1.
      console.log("SUCCESS: Scoring seems correct.");
    } else {
      console.log("CHECK SCORING: P2 Score is", room.gameData.scores["p2"]);
    }
  } else {
    console.error("State should be results but is:", room.gameData.state);
  }

  console.log(">>> NEXT ROUND <<<");
  p1.handlers['nextRound']({ roomId });

  if (room.gameData.state === 'playing') {
    console.log("SUCCESS: New round started.");
  } else {
    console.error("Failed to start next round.");
  }
}

runTest().catch(console.error);
