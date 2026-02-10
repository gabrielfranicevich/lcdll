import { memo } from 'react';
import { Edit2, ChevronUp, ChevronDown, Plus, X } from '../Icons';
import { THEMES } from '../../data/constants';

const ThemeSelector = ({
  selectedThemes,
  onToggleTheme,
  expanded,
  setExpanded,
  isHost = true,
  customLists = {},
  contributedThemes = [],
  onOpenCreateModal,
  onEditList,
  onDeleteList
}) => (
  <div className="mb-6">
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full flex items-center justify-between p-4 bg-surface border border-white/10 hover:bg-surfaceHighlight transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/5 p-2 text-white group-hover:text-accent-toxic transition-colors">
          <Edit2 size={20} />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-bold text-white leading-tight uppercase tracking-wider">TEMAS</h2>
          <span className="text-xs text-secondary font-mono bg-white/5 px-2 py-0.5 rounded ml-[-2px]">{selectedThemes.length} SELECCIONADOS</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onOpenCreateModal && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreateModal(e);
            }}
            className="p-2 bg-accent-toxic text-black hover:bg-white transition-all cursor-pointer shadow-sm active:translate-y-0.5"
            title={isHost ? "Crear lista personalizada" : "Contribuir temas"}
          >
            <Plus size={18} />
          </div>
        )}
        {expanded ? <ChevronUp size={24} className="text-secondary" /> : <ChevronDown size={24} className="text-secondary" />}
      </div>
    </button>
    {expanded && (
      <div className="mt-2 p-4 bg-void border border-white/10 border-dashed">
        <div className="grid grid-cols-2 gap-3">
          {/* Custom lists */}
          {Object.keys(customLists).map(listName => {
            const list = customLists[listName];
            const isTuple = Array.isArray(list) && list.length === 2 && Array.isArray(list[0]) && Array.isArray(list[1]);
            const count = isTuple ? list[0].length + list[1].length : list.length;

            return (
              <div key={listName} className="relative">
                <button
                  onClick={() => onToggleTheme(listName)}
                  disabled={!isHost}
                  className={`w-full p-3 font-bold transition-all border ${selectedThemes.includes(listName)
                    ? 'bg-surfaceHighlight text-accent-toxic border-accent-toxic'
                    : 'bg-surface text-secondary border-white/10 hover:border-white/30 hover:text-white'
                    } ${!isHost ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{listName}</span>
                    <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white/50">{count}</span>
                  </div>
                </button>
                {isHost && onEditList && onDeleteList && (
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditList(listName);
                      }}
                      className="p-1 bg-surface border border-white/20 text-white hover:bg-white hover:text-black transition-all"
                      title="Editar"
                    >
                      <Edit2 size={10} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteList(listName);
                      }}
                      className="p-1 bg-surface border border-white/20 text-white hover:bg-accent-blood transition-all"
                      title="Eliminar"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Contributed themes */}
          {contributedThemes.length > 0 && (
            <>
              <div className="col-span-2 mt-4 mb-2">
                <div className="h-px bg-white/10"></div>
                <p className="text-xs text-accent-electric font-bold uppercase tracking-widest mt-2">APORTES DE JUGADORES</p>
              </div>
              {contributedThemes.map((theme, idx) => {
                const list = theme.words;
                const isTuple = Array.isArray(list) && list.length === 2 && Array.isArray(list[0]) && Array.isArray(list[1]);
                const count = isTuple ? list[0].length + list[1].length : list.length;

                return (
                  <div key={`${theme.name}-${theme.contributorId}-${idx}`} className="relative">
                    <button
                      onClick={() => onToggleTheme(`contributed:${theme.name}:${theme.contributorId}`)}
                      disabled={!isHost}
                      className={`w-full p-3 font-bold transition-all border ${selectedThemes.includes(`contributed:${theme.name}:${theme.contributorId}`)
                        ? 'bg-surfaceHighlight text-accent-electric border-accent-electric'
                        : 'bg-surface text-secondary border-white/10 hover:border-white/30 hover:text-white'
                        } ${!isHost ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="text-left w-full">
                        <div className="uppercase flex justify-between items-center">
                          <span>{theme.name}</span>
                          <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white/50">{count}</span>
                        </div>
                        <div className="text-[10px] opacity-60 font-mono font-normal">por {theme.contributorName}</div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {/* Built-in themes */}
          <div className="col-span-2 mt-4 mb-2">
            <div className="h-px bg-white/10"></div>
            <p className="text-xs text-accent-toxic font-bold uppercase tracking-widest mt-2">TEMAS CLÁSICOS</p>
          </div>
          {Object.keys(THEMES).map(theme => (
            <button
              key={theme}
              onClick={() => onToggleTheme(theme)}
              disabled={!isHost}
              className={`p-3 font-bold uppercase transition-all border ${selectedThemes.includes(theme)
                ? 'bg-surfaceHighlight text-accent-toxic border-accent-toxic shadow-[0_0_10px_rgba(204,255,0,0.1)]'
                : 'bg-surface text-secondary border-white/10 hover:border-white/30 hover:text-white'
                } ${!isHost ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {theme}
            </button>
          ))}
        </div>
        {!isHost && (
          <div className="text-center text-xs text-secondary font-mono mt-4 italic border-t border-white/5 pt-2">
            Solo el anfitrión puede seleccionar temas
          </div>
        )}
      </div>
    )}
  </div>
);

export default memo(ThemeSelector);
