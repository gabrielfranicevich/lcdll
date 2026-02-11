import { useState, useEffect } from 'react';
import BlackCardDisplay from './BlackCardDisplay';
import { ArrowLeft, ArrowRight } from '../Icons';

const ReadingView = ({ gameData, myId, startVoting, updateReadingIndex, isHost }) => {
  // Server state
  const serverIndex = gameData.currentReadingIndex || 0;

  // Local state for smooth UI and individual browsing
  const [currentIndex, setCurrentIndex] = useState(serverIndex);

  // Touch/swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Sync local state when server updates (Czar moves)
  useEffect(() => {
    setCurrentIndex(serverIndex);
  }, [serverIndex]);

  const submissions = gameData.table || [];
  const totalSubmissions = submissions.length;

  // If no submissions, show nothing (shouldn't happen in reading phase)
  if (totalSubmissions === 0) return null;

  const currentSubmission = submissions[currentIndex];

  // Check if I am the Czar
  const isCzar = gameData.czarId === myId;
  const canStartVoting = isCzar || isHost; // Allow Host to rescue if Czar is stuck

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % totalSubmissions;
    setCurrentIndex(newIndex);
    // If I am Czar, sync everyone
    if (isCzar) {
      updateReadingIndex(newIndex);
    }
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + totalSubmissions) % totalSubmissions;
    setCurrentIndex(newIndex);
    // If I am Czar, sync everyone
    if (isCzar) {
      updateReadingIndex(newIndex);
    }
  };

  // Touch handlers for swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Mouse handlers for swipe gestures (desktop)
  const [mouseDownX, setMouseDownX] = useState(null);
  const [mouseUpX, setMouseUpX] = useState(null);

  const onMouseDown = (e) => {
    setMouseUpX(null);
    setMouseDownX(e.clientX);
  };

  const onMouseMove = (e) => {
    if (mouseDownX) {
      setMouseUpX(e.clientX);
    }
  };

  const onMouseUp = () => {
    if (!mouseDownX || !mouseUpX) {
      setMouseDownX(null); // Reset start if no move happened
      return;
    }

    const distance = mouseDownX - mouseUpX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    setMouseDownX(null);
    setMouseUpX(null);
  };

  const onMouseLeave = () => {
    if (mouseDownX) {
      onMouseUp();
    }
  };

  return (
    <div className="flex flex-col h-full items-center">
      {/* Header Status */}
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
          {isCzar ? 'TU TURNO DE LEER' : 'LECTURA DE CARTAS'}
        </h2>
        <p className="text-secondary text-sm font-mono">
          {isCzar
            ? 'Leé la combinación en voz alta.'
            : 'El César está leyendo las combinaciones.'}
        </p>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4">

        {/* Black Card (Fixed) */}
        <div className="w-full max-w-sm md:w-1/2 flex justify-center md:justify-end">
          <BlackCardDisplay
            text={gameData.currentBlackCard}
            filledBlanks={currentSubmission.cards}
          />
        </div>

        {/* White Card (Rotating) */}
        <div className="w-full max-w-sm md:w-1/2 flex flex-col items-center md:items-start relative min-h-[300px]">

          <div
            className="relative group perspective-1000 w-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            <div className="bg-white text-black rounded-lg p-6 shadow-brutal border-2 border-white/20 min-h-[250px] flex flex-col relative transition-all duration-300 transform">

              <div className="flex-1 font-bold text-xl md:text-2xl leading-normal font-helvetica text-left">
                {currentSubmission.cards[0] /* Handling single card for now, multi-pick handled later */}
                {currentSubmission.cards.length > 1 && (
                  <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                    <span className="text-sm text-gray-500 uppercase block mb-1">Segunda carta:</span>
                    {currentSubmission.cards[1]}
                  </div>
                )}
              </div>

              {/* Card Index Indicator */}
              <div className="absolute bottom-4 right-4 text-xs font-black text-gray-300 tracking-widest">
                {currentIndex + 1} / {totalSubmissions}
              </div>
            </div>

            {/* Navigation Buttons (Overlay) - For Everyone */}
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 hidden md:block">
              <button onClick={handlePrev} className="p-2 text-white/50 hover:text-accent-toxic transition-colors">
                <ArrowLeft size={32} />
              </button>
            </div>
            <div className="absolute top-1/2 -right-12 -translate-y-1/2 hidden md:block">
              <button onClick={handleNext} className="p-2 text-white/50 hover:text-accent-toxic transition-colors">
                <ArrowRight size={32} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation - For Everyone */}
          <div className="flex items-center justify-between w-full mt-4 md:hidden px-4">
            <button onClick={handlePrev} className="p-4 bg-surfaceHighlight rounded-full text-white active:scale-90 transition-transform">
              <ArrowLeft size={24} />
            </button>
            <span className="font-mono text-sm text-secondary">
              {currentIndex + 1} / {totalSubmissions}
            </span>
            <button onClick={handleNext} className="p-4 bg-surfaceHighlight rounded-full text-white active:scale-90 transition-transform">
              <ArrowRight size={24} />
            </button>
          </div>

        </div>
      </div>

      {/* Footer / Action */}
      <div className="w-full max-w-md p-6">
        {canStartVoting ? (
          <button
            onClick={startVoting}
            className="w-full py-4 bg-accent-toxic text-black font-black text-lg uppercase tracking-[0.2em] 
                       border-2 border-accent-toxic rounded-lg shadow-[0_0_20px_rgba(204,255,0,0.3)] 
                       hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all"
          >
            Comenzar Votación
          </button>
        ) : (
          <div className="text-center p-4 bg-surface/50 rounded-lg border border-white/10">
            <p className="text-secondary animate-pulse">Esperando al Czar...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingView;
