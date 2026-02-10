import { useState, useEffect, useRef } from 'react';
import BlackCardDisplay from './BlackCardDisplay';

const VotingView = ({ gameData, myId, mySubmissionId, onSubmitVote }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [previewCards, setPreviewCards] = useState([]);
  const [myVotedSubmissionId, setMyVotedSubmissionId] = useState(null); // Track locally for highlight

  // Server sends 'voters' array during voting, not 'votes' object (for anonymity)
  const hasVoted = gameData.voters?.includes(myId) || false;

  const hoverTimeout = useRef(null);

  // Reset selection when voting phase starts
  useEffect(() => {
    setSelectedSubmission(null);
    setPreviewCards([]);
    setMyVotedSubmissionId(null); // Reset on new voting phase
  }, [gameData.state]);

  const handleSubmit = () => {
    if (selectedSubmission) {
      setMyVotedSubmissionId(selectedSubmission); // Store locally before sending
      onSubmitVote(selectedSubmission);
      setSelectedSubmission(null);
    }
  };

  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleHover = (cards, e) => {
    // Selection has precedence - don't update preview if something is selected
    if (selectedSubmission) return;

    // Layout Loop Protection (same as CardHand)
    if (e) {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const prevX = lastMousePos.current.x;
      const prevY = lastMousePos.current.y;

      const dist = Math.hypot(currentX - prevX, currentY - prevY);

      // Ignore if effectively static (layout shift detection)
      if (dist < 5) return;

      lastMousePos.current = { x: currentX, y: currentY };
    }

    // Clear any pending timeout
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    // Set new timeout for 10ms
    hoverTimeout.current = setTimeout(() => {
      setPreviewCards(cards);
    }, 10);
  };

  const handleFocus = (cards) => {
    // Selection has precedence - don't update preview if something is selected
    if (selectedSubmission) return;

    // Clear any pending timeout
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    // Immediate update for keyboard
    setPreviewCards(cards);
  };

  const handleLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setPreviewCards([]);
  };

  const table = gameData.table || [];
  const voterCount = gameData.voters?.length || 0; // Use voters array length

  return (
    <div className="flex flex-col md:flex-row h-full md:gap-8 max-w-6xl mx-auto w-full pb-20">
      {/* Black Card Section */}
      <div className="flex-none md:w-1/3 pt-2 md:pt-10">
        <div className="md:sticky md:top-6 md:max-h-[85vh] md:overflow-y-auto custom-scrollbar pr-1 space-y-4">
          <BlackCardDisplay
            text={gameData.currentBlackCard}
            filledBlanks={previewCards.length > 0 ? previewCards : []}
          />

          <div className="text-center">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2 text-shadow-glow">
              {hasVoted ? 'ESPERANDO...' : 'VOTÁ LA MEJOR'}
            </h3>
            <div className="inline-block bg-white/10 px-3 py-1 rounded-full border border-white/5">
              <p className="text-accent-electric text-xs font-mono font-bold">
                {voterCount} VOTO{voterCount !== 1 ? 'S' : ''} REGISTRADO{voterCount !== 1 ? 'S' : ''}
              </p>
            </div>
          </div>

          {/* Confirmation Button */}
          {!hasVoted && (
            <button
              onClick={handleSubmit}
              disabled={!selectedSubmission}
              className={`
              w-full py-4 text-sm font-black uppercase tracking-[0.2em] transition-all
              border-2 rounded-lg
              ${selectedSubmission
                  ? 'bg-accent-toxic text-black border-accent-toxic shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] hover:-translate-y-1 active:translate-y-0'
                  : 'bg-surface/50 text-white/40 border-white/20 cursor-not-allowed'
                }
            `}
            >
              {selectedSubmission ? 'CONFIRMAR VOTO' : 'SELECCIONÁ UNA JUGADA'}
            </button>
          )}
        </div>
      </div>

      {/* Voting List Section */}
      <div className="flex flex-col md:pr-2 pt-2 md:pt-10 pb-4">
        <div className="flex flex-col gap-3 pr-2">
          {table.map((submission) => {
            const isSelected = selectedSubmission === submission.submissionId;
            const isMySubmission = submission.playerId === myId || submission.submissionId === mySubmissionId;
            const myVoteSubmissionId = gameData.votes?.[myId];
            const isMyVote = hasVoted && myVoteSubmissionId === submission.submissionId;

            return (
              <button
                key={submission.submissionId}
                onClick={() => !hasVoted && !isMySubmission && setSelectedSubmission(submission.submissionId)}
                onMouseEnter={(e) => handleHover(submission.cards, e)}
                onMouseMove={(e) => handleHover(submission.cards, e)}
                onFocus={() => handleFocus(submission.cards)}
                disabled={hasVoted || isMySubmission}
                className={`
                        relative text-left flex items-start p-3 rounded-lg transition-all group
                        ${isSelected
                    ? 'bg-paper text-ink ring-2 ring-accent-toxic shadow-[0_0_20px_rgba(204,255,0,0.3)] z-10 translate-x-2'
                    : isMySubmission
                      ? 'bg-surface/50 text-white/30 border border-dashed border-white/10 cursor-not-allowed grayscale'
                      : isMyVote
                        ? 'bg-surfaceHighlight text-white ring-2 ring-accent-electric shadow-[0_0_15px_rgba(0,136,255,0.4)] z-10 opacity-100 scale-[1.02]'
                        : hasVoted
                          ? 'bg-paper text-ink opacity-40 blur-[1px]'
                          : 'bg-paper text-ink hover:translate-x-1 hover:shadow-lg hover:z-10'
                  }
                      `}
              >
                <div className="flex-1 space-y-1 pr-6">
                  {submission.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="text-sm font-bold leading-snug font-helvetica"
                    >
                      {card}
                    </div>
                  ))}
                </div>

                <div className="absolute top-2 right-2 flex flex-col items-end">
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-accent-toxic shadow-sm animate-pulse"></div>
                  )}
                </div>

                {isMySubmission && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
                    <span className="text-[10px] font-bold bg-black/80 text-white px-2 py-1 uppercase tracking-widest border border-white/20 transform rotate-[-2deg]">
                      TU JUGADA
                    </span>
                  </div>
                )}

                {isMyVote && (
                  <div className="absolute -top-2 -right-1 z-20">
                    <span className="text-[10px] font-bold bg-accent-electric text-black px-2 py-1 uppercase tracking-widest shadow-lg transform rotate-2 animate-bounce">
                      VOTADO
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VotingView;
