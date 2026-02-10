import { ArrowLeft } from '../Icons';

const CreateGameHeader = ({ onBack, toggleSlot }) => (
  <div className="relative mb-6 flex items-center justify-between border-b border-white/10 pb-4">
    <button
      onClick={onBack}
      className="p-2 text-secondary hover:text-white transition-all active:scale-95"
      title="Volver"
    >
      <ArrowLeft size={24} />
    </button>
    <h1 className="text-xl font-bold text-white tracking-widest uppercase font-mono">NUEVA PARTIDA</h1>
    {toggleSlot || <div className="w-10"></div>} {/* Spacer if no toggle */}
  </div>
);

export default CreateGameHeader;
