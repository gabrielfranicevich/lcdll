import { useState, useEffect } from 'react';
import InputField from './InputField';
import { parseWordListInput, formatWordListForInput } from '../../utils/textUtils';

const WordListModal = ({ isOpen, onClose, onSave, existingList = null }) => {
  const [listName, setListName] = useState(existingList?.name || '');
  const [blackCards, setBlackCards] = useState([]);
  const [whiteCardsInput, setWhiteCardsInput] = useState('');
  const [newBlackCard, setNewBlackCard] = useState('');
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('black'); // 'black' or 'white'

  useEffect(() => {
    if (isOpen) {
      if (existingList) {
        setListName(existingList.name);
        // Check if existing list is new format [black, white] or old format [white]
        if (Array.isArray(existingList.words) && Array.isArray(existingList.words[0])) {
          // New format: [ [black...], [white...] ]
          setBlackCards(existingList.words[0] || []);
          setWhiteCardsInput(formatWordListForInput(existingList.words[1] || []));
        } else {
          // Old format: just array of strings (assume white cards)
          setBlackCards([]);
          setWhiteCardsInput(formatWordListForInput(existingList.words || []));
        }
      } else {
        setListName('');
        setBlackCards([]);
        setWhiteCardsInput('');
      }
      setNewBlackCard('');
      setErrors([]);
      setActiveTab('black');
    }
  }, [isOpen, existingList]);

  if (!isOpen) return null;

  const handleSave = () => {
    const newErrors = [];

    if (!listName.trim()) {
      newErrors.push('El nombre de la lista es requerido');
    }

    const whiteCards = parseWordListInput(whiteCardsInput);

    if (blackCards.length === 0 && whiteCards.length === 0) {
      newErrors.push('Debe agregar al menos una carta (negra o blanca)');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save as tuple [blackCards, whiteCards]
    onSave(listName.trim(), [blackCards, whiteCards]);
    handleClose();
  };

  const handleAddBlackCard = () => {
    if (newBlackCard.trim()) {
      setBlackCards([...blackCards, newBlackCard.trim()]);
      setNewBlackCard('');
    }
  };

  const handleInsertBlank = () => {
    setNewBlackCard((prev) => prev + ' _____ ');
  };

  const removeBlackCard = (index) => {
    setBlackCards(blackCards.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      // Try parsing as JSON first, else split by newlines
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          if (type === 'black') {
            setBlackCards([...blackCards, ...json.filter(c => typeof c === 'string')]);
          } else {
            const current = parseWordListInput(whiteCardsInput);
            const combined = [...current, ...json.filter(c => typeof c === 'string')];
            setWhiteCardsInput(formatWordListForInput(combined));
          }
          return;
        }
      } catch (e) {
        // Not JSON, treat as text
      }

      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
      if (type === 'black') {
        setBlackCards([...blackCards, ...lines]);
      } else {
        const current = parseWordListInput(whiteCardsInput);
        const combined = [...current, ...lines];
        setWhiteCardsInput(formatWordListForInput(combined));
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = null;
  };

  const handleClose = () => {
    setListName('');
    setBlackCards([]);
    setWhiteCardsInput('');
    setNewBlackCard('');
    setErrors([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-void rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-brutal flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">
          {existingList ? 'EDITAR LISTA' : 'NUEVA LISTA'}
        </h2>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-accent-blood/10 border border-accent-blood text-accent-blood text-sm font-bold font-mono">
            {errors.map((err, i) => (
              <div key={i}>&gt; {err}</div>
            ))}
          </div>
        )}

        {/* List Name */}
        <InputField
          label="NOMBRE DE LA LISTA"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Ej: REFERENCIAS DE LOS SIMPSONS"
          containerClassName="mb-6"
        />

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-4">
          <button
            className={`flex-1 py-2 font-bold uppercase tracking-widest transition-colors ${activeTab === 'black' ? 'text-accent-toxic border-b-2 border-accent-toxic' : 'text-secondary hover:text-white'}`}
            onClick={() => setActiveTab('black')}
          >
            Cartas Negras ({blackCards.length})
          </button>
          <button
            className={`flex-1 py-2 font-bold uppercase tracking-widest transition-colors ${activeTab === 'white' ? 'text-accent-toxic border-b-2 border-accent-toxic' : 'text-secondary hover:text-white'}`}
            onClick={() => setActiveTab('white')}
          >
            Cartas Blancas ({parseWordListInput(whiteCardsInput).length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px]">
          {activeTab === 'black' ? (
            <div className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <InputField
                    label="NUEVA CARTA NEGRA"
                    value={newBlackCard}
                    onChange={(e) => setNewBlackCard(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBlackCard()}
                    placeholder="Ej: Me gusta comer _____"
                  />
                </div>
                <button
                  onClick={handleInsertBlank}
                  className="mb-2 px-3 py-2 bg-surfaceHighlight text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                  title="Insertar espacio en blanco"
                >
                  Ins. Espacio
                </button>
                <button
                  onClick={handleAddBlackCard}
                  className="mb-2 px-4 py-3 bg-white text-black font-bold hover:bg-accent-toxic transition-colors shadow-brutal"
                >
                  +
                </button>
              </div>

              <div className="flex justify-end">
                <label className="text-xs font-bold text-secondary cursor-pointer hover:text-white flex items-center gap-2">
                  <span>IMPORTAR ARCHIVO (TXT/JSON)</span>
                  <input type="file" className="hidden" accept=".txt,.json" onChange={(e) => handleFileUpload(e, 'black')} />
                </label>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {blackCards.map((card, idx) => (
                  <div key={idx} className="bg-black p-3 rounded border border-white/10 flex justify-between items-center group">
                    <span className="font-mono text-sm text-white/90">{card}</span>
                    <button onClick={() => removeBlackCard(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 font-bold px-2">X</button>
                  </div>
                ))}
                {blackCards.length === 0 && (
                  <div className="text-center text-secondary/40 text-sm italic py-8">
                    No hay cartas negras
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold text-accent-toxic uppercase tracking-widest ml-1 block">
                    LISTA DE CARTAS BLANCAS (Separadas por comas)
                  </label>
                  <label className="text-xs font-bold text-secondary cursor-pointer hover:text-white flex items-center gap-2">
                    <span>IMPORTAR ARCHIVO (TXT/JSON)</span>
                    <input type="file" className="hidden" accept=".txt,.json" onChange={(e) => handleFileUpload(e, 'white')} />
                  </label>
                </div>
                <textarea
                  value={whiteCardsInput}
                  onChange={(e) => setWhiteCardsInput(e.target.value)}
                  placeholder="perro, gato, león, ..."
                  rows={10}
                  className="w-full p-4 bg-surface border-b border-white/20 focus:border-accent-toxic focus:outline-none text-white placeholder-secondary/30 font-bold resize-none transition-colors"
                />
                <div className="text-[10px] text-secondary mt-2 font-mono ml-1">
                  FORMATO: palabra1, palabra2, palabra3
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Actions */}
        <div className="flex gap-4 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="flex-1 py-3 bg-transparent border border-white/20 text-secondary font-bold hover:text-white hover:border-white transition-all uppercase tracking-widest text-sm"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-white text-black font-bold hover:bg-accent-toxic transition-all shadow-brutal hover:shadow-brutal-hover active:translate-y-0.5 active:shadow-none uppercase tracking-widest text-sm"
          >
            GUARDAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordListModal;
