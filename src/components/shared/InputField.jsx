import { memo } from 'react';

const InputField = ({
  value,
  onChange,
  placeholder = '',
  label = null,
  type = 'text',
  autoFocus = false,
  onKeyDown,
  className = '',
  containerClassName = ''
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-bold text-accent-toxic uppercase tracking-widest ml-1 block">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        className={`w-full p-4 bg-void border-b-2 border-surfaceHighlight focus:border-accent-toxic focus:outline-none text-white placeholder-secondary/30 font-bold transition-all ${className}`}
      />
    </div>
  );
};

export default memo(InputField);
