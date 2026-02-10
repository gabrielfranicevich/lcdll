const ResultsView = ({ gameData, roomData, isHost, onNextRound }) => {
  const winnerIds = gameData.roundWinnerIds || [];
  const table = gameData.table || [];
  const scores = gameData.scores || {};

  // Get winner submissions
  const winningSubmissions = table.filter(submission =>
    winnerIds.includes(submission.playerId)
  );

  // Sort players by score
  const sortedPlayers = [...roomData.players].sort((a, b) => {
    const scoreA = scores[a.playerId] || 0;
    const scoreB = scores[b.playerId] || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center relative py-6">
        <div className="absolute inset-0 bg-accent-toxic/5 blur-xl"></div>
        <h2 className="text-2xl font-black text-accent-toxic relative z-10 uppercase tracking-[0.2em] transform -skew-x-12">
          {winnerIds.length > 1 ? '¡EMPATE TÉCNICO!' : '¡GANADOR DE LA RONDA!'}
        </h2>
      </div>

      {/* Winning Submission(s) */}
      <div className="space-y-6">
        {winningSubmissions.map((submission) => {
          const player = roomData.players.find(p => p.playerId === submission.playerId);
          return (
            <div key={submission.submissionId} className="flex flex-col items-center">

              {/* Winner Card */}
              {/* Winner Card */}
              <div className="bg-paper text-ink p-4 rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full max-w-md relative mb-6 group animate-bounce-subtle">
                <div className="absolute -top-3 -right-3 bg-accent-toxic text-black font-black text-xs px-2 py-1 uppercase tracking-widest transform rotate-12 shadow-sm z-10">
                  +1 PUNTO
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {submission.cards.map((card, idx) => (
                      <div key={idx} className="font-bold text-lg leading-snug font-helvetica mb-1 last:mb-0">
                        {card}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-end pt-1">
                    {/* Watermark removed */}
                    <span className="text-[10px] font-bold tracking-widest opacity-50 uppercase text-accent-toxic">GANADOR</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">JUGADA POR</p>
                <p className="text-white font-black text-2xl uppercase tracking-wider">{player?.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scoreboard */}
      <div className="bg-surface border border-white/10 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-electric/5 -rotate-45 transform origin-bottom-left pointer-events-none"></div>
        <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 border-b border-white/10 pb-2">PUNTAJES</h3>
        <div className="space-y-1">
          {sortedPlayers.map((player, index) => {
            const score = scores[player.playerId] || 0;
            const isWinner = winnerIds.includes(player.playerId);
            const isLeader = index === 0;

            return (
              <div
                key={player.playerId}
                className={`flex justify-between items-center p-3 transition-colors ${isWinner
                  ? 'bg-accent-toxic/10 border-l-2 border-accent-toxic'
                  : 'hover:bg-white/5 border-l-2 border-transparent'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-sm ${isLeader ? 'text-accent-toxic font-bold' : 'text-secondary/50'}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <span className={`font-bold uppercase tracking-wider ${isWinner ? 'text-white' : 'text-secondary'}`}>
                    {player.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isWinner && <span className="text-lg">👑</span>}
                  <span className={`font-mono font-bold ${isWinner ? 'text-accent-toxic' : 'text-white'}`}>
                    {score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Round Button */}
      {isHost && (
        <div className="text-center pt-4">
          <button
            onClick={onNextRound}
            className="w-full bg-white text-black py-4 font-black text-xl uppercase tracking-widest 
            hover:bg-accent-toxic transition-colors shadow-brutal hover:shadow-brutal-hover 
            active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"
          >
            SIGUIENTE RONDA
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsView;
