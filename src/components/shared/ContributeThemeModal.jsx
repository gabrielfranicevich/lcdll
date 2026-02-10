import { useState } from 'react';
import { X, Plus, Upload } from '../Icons';
import { loadWordLists } from '../../utils/customWordLists';
import WordListModal from './WordListModal';

const ContributeThemeModal = ({ isOpen, onClose, onContribute }) => {
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const customLists = loadWordLists();
  const customThemeNames = Object.keys(customLists);

  if (!isOpen) return null;

  const toggleThemeSelection = (themeName) => {
    setSelectedThemes(prev =>
      prev.includes(themeName)
        ? prev.filter(t => t !== themeName)
        : [...prev, themeName]
    );
  };

  const handleContribute = () => {
    if (selectedThemes.length > 0) {
      const themesToContribute = selectedThemes.map(name => {
        const list = customLists[name];
        let black = [], white = [];
        if (Array.isArray(list) && list.length === 2 && Array.isArray(list[0]) && Array.isArray(list[1])) {
          black = list[0];
          white = list[1];
        } else {
          white = list;
        }
        return {
          name,
          black,
          white
        };
      });
      onContribute(themesToContribute);
      setSelectedThemes([]);
      onClose();
    }
  };

  const handleCreateNew = (name, words) => {
    // Contribute the newly created theme immediately
    onContribute([{ name, words }]);
    setShowCreateModal(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-void rounded-lg shadow-brutal border border-white/20 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">CONTRIBUIR TEMAS</h2>
            <button
              onClick={onClose}
              className="p-2 hover:text-accent-blood transition-colors text-secondary"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {customThemeNames.length > 0 ? (
              <>
                <p className="text-xs text-secondary mb-4 font-mono font-bold uppercase">
                  SELECCIONA TEMAS PARA COMPARTIR:
                </p>
                <div className="space-y-2 mb-6">
                  {customThemeNames.map(themeName => (
                    <button
                      key={themeName}
                      onClick={() => toggleThemeSelection(themeName)}
                      className={`w-full p-4 font-bold capitalize transition-all border text-left flex justify-between items-center group ${selectedThemes.includes(themeName)
                        ? 'bg-surfaceHighlight text-accent-electric border-accent-electric'
                        : 'bg-surface text-white border-white/10 hover:border-white/30'
                        }`}
                    >
                      <span>{themeName}</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${selectedThemes.includes(themeName) ? 'bg-accent-electric text-black' : 'bg-white/10 text-secondary'
                        }`}>
                        {(() => {
                          const list = customLists[themeName];
                          const isTuple = Array.isArray(list) && list.length === 2 && Array.isArray(list[0]) && Array.isArray(list[1]);
                          return isTuple ? list[0].length + list[1].length : list.length;
                        })()}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-secondary mb-8 font-mono text-center py-4 border border-dashed border-white/10 p-4">
                NO TIENES TEMAS PERSONALIZADOS AÚN.
              </p>
            )}

            <div className="border-t border-white/10 pt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full p-4 font-bold bg-surface border border-white/20 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                <Plus size={20} />
                CREAR NUEVO TEMA
              </button>
            </div>
          </div>

          {/* Footer */}
          {customThemeNames.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-surface">
              <button
                onClick={handleContribute}
                disabled={selectedThemes.length === 0}
                className={`w-full p-4 font-black transition-all border flex items-center justify-center gap-2 uppercase tracking-widest text-sm ${selectedThemes.length > 0
                  ? 'bg-accent-electric text-black border-accent-electric shadow-brutal hover:shadow-brutal-hover active:translate-y-0.5 active:shadow-none'
                  : 'bg-white/5 text-secondary border-white/10 cursor-not-allowed'
                  }`}
              >
                <Upload size={20} />
                COMPARTIR {selectedThemes.length > 0 ? `(${selectedThemes.length})` : ''}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WordListModal for creating new themes */}
      <WordListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateNew}
      />
    </>
  );
};

export default ContributeThemeModal;
