const BlackCardDisplay = ({ text, filledBlanks = [] }) => {
  if (!text) return (
    <div className="mb-4 flex justify-center animate-pulse">
      <div className="bg-white/5 rounded-lg w-full max-w-sm p-8 border border-white/10 flex items-center justify-center">
        <span className="text-secondary font-mono text-xs tracking-widest uppercase">ESPERANDO CARTA NEGRA...</span>
      </div>
    </div>
  );

  // Count blanks (any sequence of underscores)
  const blankCount = (text.match(/_+/g) || []).length;

  // Split text by blanks (capturing the underscores)
  const parts = text.split(/(_+)/);

  return (
    <div className="mb-4 flex justify-center">
      <div className="bg-black text-white rounded-lg p-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] border-2 border-white/20 w-full max-w-sm flex flex-col relative group hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1">
        <div className="font-bold text-xl leading-snug font-helvetica">
          {parts.map((part, i) => {
            // If part is a blank (underscores), render the slot
            if (part.match(/_+/)) {
              // Calculate which blank index this is (by counting blanks before it)
              const blankIndex = parts.slice(0, i).filter(p => p.match(/_+/)).length;
              const filledContent = filledBlanks[blankIndex];

              return (
                <span key={i} className={`inline border-b-2 px-1 transition-all ${filledContent
                  ? 'text-accent-toxic border-accent-toxic font-black animate-fade-in'
                  : 'text-transparent border-white/50'
                  }`}>
                  {filledContent || '____'}
                </span>
              );
            }
            // Otherwise render text inline, but prevent punctuation orphaning
            // Replace spaces before punctuation with non-breaking spaces
            const textWithNBSP = part.replace(/\s+([.,;:!?])/g, '\u00A0$1');
            return <span key={i}>{textWithNBSP}</span>;
          })}
        </div>

      </div>
    </div>
  );
};

export default BlackCardDisplay;
