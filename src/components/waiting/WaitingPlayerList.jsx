const WaitingPlayerList = ({ players, hostId }) => (
  <div className="flex-1 overflow-y-auto mb-6 pr-1">
    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4 ml-1">JUGADORES CONECTADOS</h3>
    <div className="space-y-1">
      {players.map((p, i) => (
        <div key={p.id} className="p-3 border-b border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="font-mono text-secondary text-sm opacity-50">
            {(i + 1).toString().padStart(2, '0')}
          </div>
          <span className="font-bold text-white uppercase tracking-wider flex-1 group-hover:text-accent-toxic transition-colors">{p.name}</span>
          {p.id === hostId && (
            <span className="text-[10px] font-bold bg-white text-black px-2 py-0.5 uppercase tracking-widest">HOST</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default WaitingPlayerList;
