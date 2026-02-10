import { useState, useEffect } from 'react';
import BlackCardDisplay from './BlackCardDisplay';
import CardHand from './CardHand';

const CardSubmissionView = ({ blackCard, myHand, onSubmitCards, hasSubmitted }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [submittedCards, setSubmittedCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Calculate how many cards needed based on blanks in black card
  const blankCount = Math.max(1, (blackCard?.match(/_____/g) || []).length);

  useEffect(() => {
    // Reset selection when black card changes
    setSelectedCards([]);
    setSubmittedCards([]); // Also reset submitted cards for new round
  }, [blackCard]);

  // Use local state for immediate feedback, but sync with server data via props if available could be complicated.
  // Actually, hasSubmitted check should be enough, but we want to show WHAT was submitted.
  // The server doesn't send back "your submission" in the public game data during playing phase for anonymity?
  // Wait, getPublicGameData returns { submissionId, playerId, status: 'submitted' } but NO cards.
  // So we MUST persist the submitted cards locally until the round ends.

  useEffect(() => {
    // Determine if we are in a new round or the same round
    // If black card changes, it's a new round -> Reset done in the other useEffect
  }, [blackCard]);

  const handleSubmit = () => {
    if (selectedCards.length === blankCount) {
      const cardsToSubmit = [...selectedCards];
      setSubmittedCards(cardsToSubmit); // Store selected cards to show them
      onSubmitCards(cardsToSubmit);
      // setSelectedCards([]); // Keep them selected or clear? Clearing is fine if we switch view mode.
    }
  };

  const getPreviewCards = () => {
    // If already submitted, show submitted cards
    if (hasSubmitted && submittedCards.length > 0) return submittedCards;

    const preview = [...selectedCards];
    if (hoveredCard && !selectedCards.includes(hoveredCard) && preview.length < blankCount) {
      preview.push(hoveredCard);
    }
    return preview;
  };

  const canSubmit = selectedCards.length === blankCount && !hasSubmitted;

  return (
    <div className="flex flex-col md:flex-row h-full md:gap-8 max-w-6xl mx-auto w-full">
      {/* Black Card Section - Top on Mobile, Left Sticky on Desktop */}
      <div className="flex-none md:w-1/3 pt-2 md:pt-10">
        <div className="md:sticky md:top-6 md:max-h-[85vh] md:overflow-y-auto custom-scrollbar pr-1">
          <BlackCardDisplay
            text={blackCard}
            filledBlanks={hasSubmitted ? submittedCards : getPreviewCards()}
          />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
            w-full py-4 text-sm font-black uppercase tracking-[0.2em] transition-all
            border-2 mt-4
            ${canSubmit
                ? 'bg-accent-toxic text-black border-accent-toxic shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] hover:-translate-y-1 active:translate-y-0'
                : 'bg-surface/50 text-white/40 border-white/20 cursor-not-allowed'
              }
          `}
          >
            {selectedCards.length === 0
              ? 'SELECCIONÁ TUS CARTAS'
              : selectedCards.length < blankCount
                ? `FALTAN ${blankCount - selectedCards.length}`
                : 'CONFIRMAR JUGADA'
            }
          </button>
          <div className="hidden md:block text-center mt-4 text-white/20 text-xs font-mono">
            {hoveredCard ? 'VISTA PREVIA ACTIVA' : 'SELECCIONÁ UNA CARTA'}
          </div>
        </div>
      </div>

      {/* Right Section - Hand/Submitted Cards */}
      <div className="flex-1 flex flex-col min-h-0 md:h-full relative">
        {hasSubmitted ? (
          <div className="flex-1 flex flex-col items-center justify-start pt-4 px-4 overflow-y-auto animate-fade-in pb-20 md:justify-center">
            <div className="w-full max-w-sm">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <div className="w-2 h-2 bg-accent-toxic rounded-full animate-bounce"></div>
                <span className="text-sm font-bold text-secondary uppercase tracking-widest">ESPERANDO A LOS DEMÁS...</span>
                <div className="w-2 h-2 bg-accent-toxic rounded-full animate-bounce delay-75"></div>
              </div>

              <div className="space-y-3">
                {submittedCards.map((card, idx) => (
                  <div key={idx} className="bg-surface border border-white/10 p-4 rounded-lg flex items-start relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-toxic"></div>
                    <span className="text-white font-bold leading-snug font-helvetica flex-1 ml-2">
                      {card}
                    </span>
                    <span className="text-[8px] font-bold tracking-widest opacity-30 uppercase mt-1">ENVIADA</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0 md:pr-2 custom-scrollbar">
              <CardHand
                cards={myHand}
                onCardsSelected={setSelectedCards}
                maxSelect={blankCount}
                disabled={hasSubmitted}
                onHover={setHoveredCard}
              />
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default CardSubmissionView;
