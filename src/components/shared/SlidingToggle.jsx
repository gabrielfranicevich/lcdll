import { memo } from 'react';

const SlidingToggle = ({
  value,
  onChange,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  className = ""
}) => {
  const isLeft = value === leftValue;

  return (
    <div className={`inline-flex bg-surface rounded-lg p-1 border border-white/10 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(leftValue)}
        className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${isLeft
          ? 'bg-accent-toxic text-black shadow-sm'
          : 'text-secondary hover:text-white'
          }`}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(rightValue)}
        className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${!isLeft
          ? 'bg-accent-toxic text-black shadow-sm'
          : 'text-secondary hover:text-white'
          }`}
      >
        {rightLabel}
      </button>
    </div>
  );
};

export default memo(SlidingToggle);
