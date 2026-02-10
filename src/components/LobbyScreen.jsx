import { useState, useEffect } from 'react';
import { ArrowLeft, Users } from './Icons';
import JoinGameForm from './lobby/JoinGameForm';
import GameCodeInput from './lobby/GameCodeInput';
import GameListSection from './lobby/GameListSection';

const OnlineLobbyScreen = ({ setScreen, onlineGames = [], lanGames = [],
  joinOnlineGame, playerName,
  setPlayerName, roomIdFromUrl, clearRoomId, socket, getRandomName, localIp }) => {
  const [roomStatus, setRoomStatus] = useState(null);
  const [checkingRoom, setCheckingRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [lanGamesExpanded, setLanGamesExpanded] = useState(true);
  const [onlineGamesExpanded, setOnlineGamesExpanded] = useState(true);

  const targetRoomId = roomIdFromUrl || selectedRoomId;

  // Request LAN games when connected
  useEffect(() => {
    if (socket) {
      socket.emit('requestLanGames', { localIp });
    }
  }, [socket, localIp]);

  // Check room status when targetRoomId changes
  useEffect(() => {
    if (targetRoomId && socket) {
      setCheckingRoom(true);
      socket.emit('checkRoom', { roomId: targetRoomId });

      const handleRoomStatus = (status) => {
        setRoomStatus(status);
        setCheckingRoom(false);
      };

      socket.on('roomStatus', handleRoomStatus);

      return () => {
        socket.off('roomStatus', handleRoomStatus);
      };
    } else {
      setRoomStatus(null);
    }
  }, [targetRoomId, socket]);

  const safeLanGames = Array.isArray(lanGames) ? lanGames : [];
  const lanGameIds = new Set(safeLanGames.map(g => g.id));
  const safeOnlineGames = (Array.isArray(onlineGames) ? onlineGames : [])
    .filter(g => !lanGameIds.has(g.id));
  const showDirectJoin = !!roomIdFromUrl || !!selectedRoomId;



  return (
    <div className="p-6 relative z-10 h-full flex flex-col max-w-lg md:max-w-6xl mx-auto w-full">
      <div className="relative mb-8 flex items-center justify-center border-b border-surfaceHighlight pb-4">
        <button
          onClick={() => {
            if (showDirectJoin) {
              if (roomIdFromUrl && clearRoomId) {
                clearRoomId();
              } else {
                setSelectedRoomId(null);
              }
            } else {
              setScreen('home');
              window.history.pushState(null, '', '/');
            }
          }}
          className="absolute left-0 p-2 text-secondary hover:text-white transition-all active:scale-95"
          title="Volver"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white tracking-widest uppercase font-mono">
          {showDirectJoin ? 'UNIRSE' : 'LOBBY'}
        </h1>
      </div>

      {showDirectJoin ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <JoinGameForm
            checkingRoom={checkingRoom}
            roomStatus={roomStatus}
            targetRoomId={targetRoomId}
            playerName={playerName}
            setPlayerName={setPlayerName}
            joinOnlineGame={joinOnlineGame}
            getRandomName={getRandomName}
          />
        </div>
      ) : (
        <>
          {/* Game Code Input - Fixed at top, always visible */}
          <GameCodeInput onJoin={setSelectedRoomId} />

          {/* Scrollable game lists */}
          <div className="flex-1 mb-6 overflow-y-auto space-y-4 pr-1">
            {/* LAN Games Section */}
            <GameListSection
              title="LAN Games"
              subtitle={`${safeLanGames.length} nearby`}
              icon={<Users size={20} />}
              games={safeLanGames}
              isExpanded={lanGamesExpanded}
              onToggle={() => setLanGamesExpanded(!lanGamesExpanded)}
              onJoin={setSelectedRoomId}
              headerClassName="text-accent-toxic"
            />

            {/* All Online Games Section */}
            <GameListSection
              title="Online Games"
              icon={<Users size={20} />}
              games={safeOnlineGames}
              isExpanded={onlineGamesExpanded}
              onToggle={() => setOnlineGamesExpanded(!onlineGamesExpanded)}
              onJoin={setSelectedRoomId}
            />
          </div>

          <button
            onClick={() => setScreen('online_create')}
            className="w-full bg-surfaceHighlight text-white py-4 font-bold text-lg 
            border border-white/10 hover:border-accent-toxic hover:text-accent-toxic hover:bg-void 
            transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            <Users size={20} />
            Crear Partida
          </button>
        </>
      )}
    </div>
  );
};

export default OnlineLobbyScreen;
