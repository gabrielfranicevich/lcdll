import { memo } from 'react';
import { Users, ChevronUp, ChevronDown } from '../Icons';

const PlayerCounter = ({
  count,
  onIncrement,
  onDecrement,
  min,
  max,
  label = "Jugadores",
  subLabel = "",
  accordion = true,
  expanded = true,
  onToggleExpand
}) => {
  const displayCount = count === '∞' ? '∞' : count;
  const isMin = count <= min;
  const isMax = count >= max;

  const CounterControls = () => (
    <div className="flex items-center gap-4 bg-surface p-2 border border-white/10 mt-2">
      <button
        onClick={onDecrement}
        disabled={isMin}
        className="w-12 h-12 bg-white/5 text-white hover:bg-white/10 hover:text-accent-toxic font-bold text-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center border border-white/5"
      >
        -
      </button>
      <div className="flex-1 text-center">
        <div className="text-4xl font-black text-white">{displayCount}</div>
      </div>
      <button
        onClick={onIncrement}
        disabled={isMax}
        className="w-12 h-12 bg-white/5 text-white hover:bg-white/10 hover:text-accent-toxic font-bold text-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center border border-white/5"
      >
        +
      </button>
    </div>
  );

  if (!accordion) {
    return <CounterControls />;
  }

  return (
    <div className="mb-6">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 bg-surface border border-white/10 text-left hover:bg-surfaceHighlight transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="text-accent-toxic">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight uppercase tracking-wider">{label}</h2>
            <span className="text-xs text-secondary font-mono">{subLabel || `${count} personas`}</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} className="text-secondary" /> : <ChevronDown size={20} className="text-secondary" />}
      </button>
      {expanded && <CounterControls />}
    </div>
  );
};

export default memo(PlayerCounter);
