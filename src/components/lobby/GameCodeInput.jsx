import { useState } from 'react';

const GameCodeInput = ({ onJoin }) => {
  const [code, setCode] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    setCode(value);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    setCode(pastedText);
  };

  const handleJoin = () => {
    if (code.length === 4) onJoin(code);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && code.length === 4) handleJoin();
  };

  // if (there are no joinable games) return null;

  return (
    <div className="mb-8">
      <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1 mb-2 block">CÓDIGO DE JUEGO</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="XXXX"
          maxLength={4}
          className="flex-1 p-4 bg-surface border-2 border-surfaceHighlight text-white font-mono font-bold text-xl text-center tracking-[0.5em] uppercase focus:border-accent-toxic focus:outline-none transition-all placeholder-white/10"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleJoin}
          disabled={code.length !== 4}
          className="px-8 py-3 bg-white text-black font-black uppercase tracking-wider 
          hover:bg-accent-toxic transition-all disabled:opacity-20 disabled:cursor-not-allowed
          shadow-brutal hover:shadow-brutal-hover active:translate-y-1 active:shadow-none"
        >
          IR
        </button>
      </div>
    </div>
  );
};

export default GameCodeInput;
