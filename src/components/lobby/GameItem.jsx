import { Users, MessageSquare } from '../Icons';

const GameItem = ({ game, onJoin }) => {
  return (
    <button
      onClick={() => {
        if (game.status === 'waiting') {
          onJoin(game.id);
        }
      }}
      disabled={game.status !== 'waiting'}
      className={`w-full text-left bg-surface p-4 border border-white/10 flex items-center justify-between group transition-all cursor-pointer ${game.status === 'waiting'
        ? 'hover:border-accent-toxic hover:bg-surfaceHighlight'
        : 'opacity-50 cursor-not-allowed'
        }`}
    >
      <div>
        <h3 className={`font-bold text-lg ${game.status === 'waiting' ? 'text-white group-hover:text-accent-toxic' : 'text-secondary'} transition-colors`}>{game.name}</h3>
        <div className="flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-wider text-secondary mt-1">
          <span className="flex items-center gap-1">
            <Users size={12} /> {game.players}/{game.maxPlayers == 2 ? '∞' : game.maxPlayers}
          </span>
          <span className="flex items-center gap-1">
            {game.type === 'chat' ? <MessageSquare size={12} /> : <Users size={12} />}
            {game.type === 'chat' ? 'CHAT' : 'PRESENCIAL'}
          </span>
        </div>
      </div>
      <div className={`px-3 py-1 font-bold uppercase text-[10px] tracking-widest border ${game.status === 'waiting'
        ? 'bg-transparent text-accent-toxic border-accent-toxic'
        : 'bg-white/10 text-secondary border-transparent'
        }`}>
        {game.status === 'waiting' ? 'UNIRSE' : 'JUGANDO'}
      </div>
    </button>
  );
};

export default GameItem;
