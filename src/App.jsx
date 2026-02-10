import { useState, useEffect } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import OnlineLobbyScreen from './components/LobbyScreen';
import OnlineCreateScreen from './components/CreateScreen';
import OnlineWaitingRoom from './components/WaitingRoom';
import OnlinePlayingScreen from './components/PlayingScreen';

import { useSessionId } from './hooks/useSessionId';
import { useLocalIp } from './hooks/useLocalIp';
import { useOnlineGame } from './hooks/useOnlineGame';
import { useAppRouting } from './hooks/useAppRouting';
import { getRandomName } from './utils/randomName';

function App() {
  const [screen, setScreen] = useState('home');

  // Persist playerName
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('playerName') || '';
  });

  useEffect(() => {
    if (playerName) {
      localStorage.setItem('playerName', playerName);
    }
  }, [playerName]);

  // Hooks
  const mySessionId = useSessionId();
  const localIp = useLocalIp();

  const onlineGame = useOnlineGame(setScreen, mySessionId, localIp, playerName);

  // Routing hook consumes state
  useAppRouting(screen, setScreen, onlineGame.roomId, onlineGame.setRoomId, onlineGame.roomData);


  const resetGame = () => {
    if (screen.startsWith('online_')) {
      if (onlineGame.isHost && onlineGame.socket) {
        onlineGame.resetOnlineGame();
      }
    }
  };

  return (
    <div className="min-h-screen bg-void text-primary font-sans selection:bg-accent-toxic selection:text-black flex flex-col">
      <div className="w-full mx-auto flex-1 flex flex-col relative">
        {/* Ambient Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-accent-electric/10 blur-[100px] rounded-full pointer-events-none"></div>

        {screen === 'home' && <HomeScreen setScreen={setScreen} />}

        {screen === 'online_lobby' && (
          <OnlineLobbyScreen
            setScreen={setScreen}
            onlineGames={onlineGame.onlineGames}
            lanGames={onlineGame.lanGames}
            joinOnlineGame={onlineGame.joinOnlineGame}
            playerName={playerName}
            setPlayerName={setPlayerName}
            roomIdFromUrl={onlineGame.roomId}
            clearRoomId={() => onlineGame.setRoomId(null)}
            socket={onlineGame.socket}
            getRandomName={getRandomName}
            localIp={localIp}
          />
        )}

        {screen === 'online_create' && (
          <OnlineCreateScreen
            setScreen={setScreen}
            newGameSettings={onlineGame.newGameSettings}
            setNewGameSettings={onlineGame.setNewGameSettings}
            onlineGames={onlineGame.onlineGames}
            setOnlineGames={onlineGame.setOnlineGames}
            createOnlineGame={onlineGame.createOnlineGame}
            playerName={playerName}
            setPlayerName={setPlayerName}
            getRandomName={getRandomName}
          />
        )}

        {screen === 'online_waiting' && onlineGame.roomData && (
          <OnlineWaitingRoom
            roomData={onlineGame.roomData}
            isHost={onlineGame.isHost}
            leaveRoom={onlineGame.leaveRoom}
            startGame={onlineGame.startOnlineGame}
            updateRoomSettings={onlineGame.updateRoomSettings}
            contributeTheme={onlineGame.contributeTheme}
          />
        )}

        {screen === 'online_playing' && onlineGame.roomData && (
          <OnlinePlayingScreen
            roomData={onlineGame.roomData}
            playerName={playerName}
            playerId={mySessionId}
            isHost={onlineGame.isHost}
            resetGame={onlineGame.resetOnlineGame}
            submitCards={onlineGame.submitCards}
            submitVote={onlineGame.submitVote}
            leaveRoom={onlineGame.leaveRoom}
            myHand={onlineGame.myHand}
            mySubmissionId={onlineGame.mySubmissionId}
          />
        )}
      </div>
    </div>
  );
}

export default App;
