import { Users, MessageSquare } from '../Icons';

const RoomStats = ({ currentPlayers, maxPlayers, gameType }) => (
  <div className="bg-surface p-4 border-y border-white/5 mb-8 text-center">
    <div className="flex items-center justify-center gap-6 text-white font-mono font-bold text-sm">
      <div className="flex items-center gap-2">
        <Users size={16} className="text-accent-toxic" />
        <span>{currentPlayers}/{maxPlayers === 2 ? '∞' : maxPlayers}</span>
      </div>
      <div className="w-px h-4 bg-white/20"></div>
      <div className="flex items-center gap-2">
        {gameType === 'chat' ? <MessageSquare size={16} className="text-accent-electric" /> : <Users size={16} className="text-accent-electric" />}
        <span className="uppercase tracking-wider">{gameType === 'chat' ? 'CHAT' : 'PRESENCIAL'}</span>
      </div>
    </div>
  </div>
);

export default RoomStats;
