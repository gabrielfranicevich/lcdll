import { ArrowLeft } from '../Icons';

const PhaseHeader = ({ gamePhase, onLeave }) => {
  const getPhaseTitle = (phase) => {
    switch (phase) {
      case 'playing': return 'ELEGÍ TUS CARTAS';
      case 'voting': return 'VOTACIÓN';
      case 'results': return 'RESULTADOS';
      default: return 'JUGANDO';
    }
  };

  return (
    <div className="relative mb-6 flex items-center justify-center border-b border-white/10 pb-4">
      <button
        onClick={onLeave}
        className="absolute left-0 p-2 text-secondary hover:text-white transition-all active:scale-95"
        title="Salir"
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-xl font-black text-white tracking-widest uppercase text-center">
        {getPhaseTitle(gamePhase)}
      </h1>
    </div>
  );
};

export default PhaseHeader;
