import { useState, useRef } from 'react';

const CardHand = ({ cards, onCardsSelected, maxSelect = 1, disabled = false, onHover }) => {
  const [selectedCards, setSelectedCards] = useState([]);

  const toggleCard = (card) => {
    if (disabled) return;

    const isSelected = selectedCards.includes(card);

    let newSelection;
    if (isSelected) {
      // Deselect
      newSelection = selectedCards.filter(c => c !== card);
    } else {
      // Select
      if (selectedCards.length < maxSelect) {
        newSelection = [...selectedCards, card];
      } else {
        // Replace oldest selection
        newSelection = [...selectedCards.slice(1), card];
      }
    }

    setSelectedCards(newSelection);
    onCardsSelected(newSelection);
  };

  const lastHoveredCard = useRef(null);
  const hoverTimeout = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleHover = (card, e) => {
    // Selection has precedence - don't update preview if cards are selected
    if (selectedCards.length > 0) return;

    // Basic optimization: if same card, ignore
    if (lastHoveredCard.current === card) return;

    // Layout Loop Protection:
    // If this event was triggered by a layout shift (e.g. black card resizing),
    // the mouse coordinates will be effectively identical to the last successful hover.
    // We only want to trigger if the user ACTUALLY moved the mouse.
    if (e) {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const prevX = lastMousePos.current.x;
      const prevY = lastMousePos.current.y;

      const dist = Math.hypot(currentX - prevX, currentY - prevY);

      // If mouse moved less than 5px, ignore this 'new card' event 
      // (It's likely the old card moving out from under us)
      if (dist < 5) return;

      // Update position for next check
      lastMousePos.current = { x: currentX, y: currentY };
    }

    // Clear any pending timeout
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    lastHoveredCard.current = card;

    // Set new timeout for 300ms
    hoverTimeout.current = setTimeout(() => {
      if (onHover) onHover(card);
    }, 300);
  };

  const handleFocus = (card) => {
    // Selection has precedence - don't update preview if cards are selected
    if (selectedCards.length > 0) return;

    // Clear any pending timeout from mouse interactions
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    lastHoveredCard.current = card;
    // Immediate update for keyboard navigation
    if (onHover) onHover(card);
  };

  const handleLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    lastHoveredCard.current = null;
    if (onHover) onHover(null);
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-secondary py-12 font-mono text-sm uppercase tracking-widest animate-pulse">
        REPARTIENDO CARTAS...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest">TU MANO</span>
        <span className="text-xs font-mono text-accent-toxic">
          {selectedCards.length}/{maxSelect} SELECCIONADA{maxSelect > 1 ? 'S' : ''}
        </span>
      </div>

      <div
        className="flex flex-col gap-3 pb-20"
      >
        {cards.map((card, index) => {
          const isSelected = selectedCards.includes(card);
          const selectionIndex = selectedCards.indexOf(card) + 1;

          return (
            <button
              key={index}
              onClick={() => toggleCard(card)}
              onMouseEnter={(e) => handleHover(card, e)}
              onMouseMove={(e) => handleHover(card, e)}
              onFocus={() => handleFocus(card)}
              disabled={disabled}
              className={`
                relative bg-paper text-ink rounded-lg p-3 shadow-sm transition-all text-left flex items-start group
                ${isSelected
                  ? 'ring-2 ring-accent-toxic bg-surfaceHighlight text-white shadow-[0_0_15px_rgba(204,255,0,0.1)] z-10 translate-x-2'
                  : 'hover:bg-surfaceHighlight hover:text-white hover:translate-x-1 hover:z-10'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
              `}
            >
              <span className="text-sm font-bold leading-snug font-helvetica flex-1 pr-6">
                {card}
              </span>

              <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                {isSelected && maxSelect > 1 && (
                  <div className="bg-accent-toxic text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {selectionIndex}
                  </div>
                )}
                {isSelected && maxSelect === 1 && (
                  <div className="w-3 h-3 rounded-full bg-accent-toxic shadow-sm"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CardHand;
