import { Play } from '../Icons';

const StartGameButton = ({ isHost, onStart, playerCount }) => {
  if (isHost) {
    return (
      <button
        onClick={onStart}
        disabled={playerCount < 3}
        className="w-full bg-white text-black py-4 font-black text-xl uppercase tracking-widest 
        hover:bg-accent-toxic transition-colors shadow-brutal hover:shadow-brutal-hover 
        active:translate-y-1 active:shadow-none 
        disabled:bg-surface disabled:text-secondary disabled:border-2 disabled:border-white/20 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:translate-y-0
        flex items-center justify-center gap-3"
      >
        <Play size={24} />
        EMPEZAR PARTIDA
      </button>
    );
  }

  return (
    <div className="text-center text-secondary font-mono text-sm animate-pulse py-5 uppercase tracking-widest">
      ESPERANDO AL ANFITRÓN...
    </div>
  );
};

export default StartGameButton;
