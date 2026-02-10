import { useState, useEffect } from 'react';
import BlackCardDisplay from './BlackCardDisplay';
import { ArrowLeft, ArrowRight } from '../Icons';

const ReadingView = ({ gameData, myId, startVoting, isHost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const submissions = gameData.table || [];
  const totalSubmissions = submissions.length;

  // If no submissions, show nothing (shouldn't happen in reading phase)
  if (totalSubmissions === 0) return null;

  const currentSubmission = submissions[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSubmissions);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSubmissions) % totalSubmissions);
  };

  // Check if I am the Czar
  const isCzar = gameData.czarId === myId;
  const canStartVoting = isCzar || isHost;

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
            : 'El Czar está leyendo las combinaciones.'}
        </p>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4">

        {/* Black Card (Fixed) */}
        <div className="w-full max-w-sm md:w-1/2 flex justify-center md:justify-end">
          <BlackCardDisplay
            text={gameData.currentBlackCard}
            filledBlanks={[]}
          />
        </div>

        {/* White Card (Rotating) */}
        <div className="w-full max-w-sm md:w-1/2 flex flex-col items-center md:items-start relative min-h-[300px]">

          {/* Navigation Controls (Only for Czar usually, but maybe everyone wants to see?) 
              Request said: "he has the role or reading... then they discuss"
              Implies only he needs to control. 
              But for "in person" usually everyone looks at the screen?
              If it's on a TV, everyone sees.
              If it's on phones, maybe only Czar sees the cards to read?
              "can see the black card with the preview, rotatingly"
              Let's make it so ONLY Czar sees the white cards? 
              Or everyone sees them but Czar controls?
              Current implementation: Everyone sees their own local rotation.
              This allows everyone to read at their own pace if they want, 
              OR they can just look at the Czar's screen if casted.
              Let's keep it local control for now, but highlight Czar status.
          */}

          <div className="relative group perspective-1000 w-full">
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

            {/* Navigation Buttons (Overlay) */}
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

          {/* Mobile Navigation */}
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
