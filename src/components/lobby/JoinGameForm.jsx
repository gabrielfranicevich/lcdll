import { useEffect, useRef } from 'react';
import { Users, MessageSquare } from '../Icons';

const JoinGameForm = ({
  checkingRoom,
  roomStatus,
  targetRoomId,
  playerName,
  setPlayerName,
  joinOnlineGame,
  getRandomName
}) => {
  const inputRef = useRef(null);

  // Focus input when showing the join form
  useEffect(() => {
    if (roomStatus && roomStatus.room && !checkingRoom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [roomStatus, checkingRoom]);

  if (checkingRoom) {
    return (
      <div className="text-center text-white font-mono animate-pulse">
        VERIFICANDO SALA...
      </div>
    );
  }

  if (roomStatus && !roomStatus.exists) {
    return (
      <div className="bg-surface p-6 border-2 border-accent-blood text-center shadow-brutal shadow-accent-blood/20">
        <div className="text-6xl mb-4 grayscale">❌</div>
        <h2 className="text-2xl font-bold text-accent-blood mb-2 uppercase">{roomStatus.error}</h2>
        <p className="text-secondary mb-4 font-mono">Sala "{targetRoomId}" no encontrada</p>
      </div>
    );
  }

  if (roomStatus && roomStatus.full) {
    return (
      <div className="bg-surface p-6 border-2 border-accent-blood text-center shadow-brutal shadow-accent-blood/20">
        <div className="text-6xl mb-4 grayscale">🚫</div>
        <h2 className="text-2xl font-bold text-accent-blood mb-2 uppercase">{roomStatus.error}</h2>
        <p className="text-secondary mb-4 font-mono">Sala llena</p>
      </div>
    );
  }

  if (roomStatus && roomStatus.room) {
    const handleJoin = () => {
      let finalName = playerName.trim();
      if (!finalName) {
        finalName = getRandomName();
        setPlayerName(finalName);
      }
      joinOnlineGame(targetRoomId, finalName);
    };

    return (
      <div className="bg-surface p-8 border border-surfaceHighlight w-full text-center relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-accent-toxic/5 -rotate-45 transform origin-bottom-left pointer-events-none"></div>

        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
          {roomStatus.room.roomName}
        </h2>

        <div className="flex justify-center gap-6 text-secondary font-mono text-sm mb-8 border-b border-white/5 pb-4">
          <span className="flex items-center gap-2">
            <Users size={14} className="text-accent-toxic" />
            {roomStatus.room.players.length}/{roomStatus.room.settings.players === 2 ? '∞' : roomStatus.room.settings.players}
          </span>
          <span className="flex items-center gap-2">
            {roomStatus.room.settings.type === 'chat' ? <MessageSquare size={14} className="text-accent-electric" /> : <Users size={14} className="text-accent-electric" />}
            {roomStatus.room.settings.type === 'chat' ? 'CHAT' : 'PRESENCIAL'}
          </span>
        </div>

        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-xs font-bold text-accent-toxic uppercase tracking-widest ml-1">NOMBRE DE JUGADOR</label>
            <input
              ref={inputRef}
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Escribe tu nombre..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJoin();
                }
              }}
              className="w-full p-4 bg-void border-2 border-surfaceHighlight focus:border-accent-toxic focus:outline-none text-white font-bold text-lg text-center placeholder-gray-700 transition-colors"
            />
          </div>

          <button
            onClick={handleJoin}
            className="w-full bg-white text-black py-4 font-black text-xl uppercase tracking-widest hover:bg-accent-toxic transition-colors shadow-brutal hover:shadow-brutal-hover active:translate-y-1 active:shadow-none"
          >
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default JoinGameForm;
