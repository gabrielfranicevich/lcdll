import { useState } from 'react';
import { ArrowLeft, Check, Copy } from '../Icons';

const WaitingRoomHeader = ({ roomName, roomId, onLeave }) => {
  const [copied, setCopied] = useState(false);

  const copyGameCode = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
      } else {
        // Fallback for non-secure contexts (http on LAN)
        const textArea = document.createElement("textarea");
        textArea.value = roomId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="relative mb-8 flex items-center justify-center border-b border-surfaceHighlight pb-4">
        <button
          onClick={onLeave}
          className="absolute left-0 p-2 text-secondary hover:text-white transition-all active:scale-95"
          title="Salir"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-xs font-bold text-accent-toxic uppercase tracking-widest mb-1">SALA</h1>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">{roomName}</h2>
        </div>
      </div>

      <div className="bg-surface p-6 border border-white/10 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-toxic/5 -rotate-45 transform origin-bottom-left pointer-events-none transition-all group-hover:bg-accent-toxic/10"></div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">CÓDIGO DE JUEGO</span>
            <div className="text-4xl font-mono font-bold text-white tracking-[0.2em] mt-2 text-stroke">{roomId}</div>
          </div>
          <button
            onClick={copyGameCode}
            className={`p-4 transition-all border-2 ${copied
              ? 'bg-accent-toxic border-accent-toxic text-black'
              : 'bg-transparent border-white/20 text-white hover:border-white hover:bg-white/10'
              }`}
            title={copied ? '¡Copiado!' : 'Copiar código'}
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default WaitingRoomHeader;
