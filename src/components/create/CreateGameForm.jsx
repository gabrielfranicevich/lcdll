import { MessageSquare, Users } from "../Icons";
import InputField from "../shared/InputField";
import PlayerCounter from "../shared/PlayerCounter";

const CreateGameForm = ({
  playerName,
  setPlayerName,
  newGameSettings,
  setNewGameSettings,
  onSubmit,
  getRandomName,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-8 pr-1">
      {/* Host Name */}
      <InputField
        label="TU NOMBRE"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Nombre de Host"
        autoFocus
        onKeyDown={handleKeyDown}
        className="text-xl"
      />

      {/* Game Name */}
      <InputField
        label="NOMBRE DE PARTIDA"
        value={newGameSettings.name}
        onChange={(e) =>
          setNewGameSettings({ ...newGameSettings, name: e.target.value })
        }
        placeholder="Ej: Sala de castigo"
        onKeyDown={handleKeyDown}
        className="text-xl"
      />

      {/* Players Count */}
      <div className="space-y-4">
        <div className="flex items-center justify-between ml-1">
          <label className="text-xs font-bold text-accent-toxic uppercase tracking-widest">
            CANTIDAD DE JUGADORES
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={newGameSettings.players === 2}
              onChange={(e) =>
                setNewGameSettings((s) => ({
                  ...s,
                  players: e.target.checked ? 2 : 3,
                }))
              }
              className="w-4 h-4 accent-accent-toxic bg-surface border-white/20"
            />
            <span className="text-xs font-bold text-secondary group-hover:text-white transition-colors uppercase tracking-wider">
              Ilimitados
            </span>
          </label>
        </div>
        <PlayerCounter
          count={newGameSettings.players === 2 ? "∞" : newGameSettings.players}
          onIncrement={() =>
            setNewGameSettings((s) => ({ ...s, players: s.players + 1 }))
          }
          onDecrement={() =>
            setNewGameSettings((s) => ({
              ...s,
              players: Math.max(3, s.players - 1),
            }))
          }
          min={3}
          accordion={false}
        />
      </div>

      {/* Game Type */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-accent-toxic uppercase tracking-widest ml-1">
          TIPO DE JUEGO
        </label>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() =>
              setNewGameSettings({ ...newGameSettings, type: "chat" })
            }
            className={`p-4 border text-center transition-all group ${newGameSettings.type === "chat"
              ? "bg-surfaceHighlight border-accent-toxic text-white shadow-[0_0_15px_rgba(204,255,0,0.1)]"
              : "bg-surface border-white/10 text-secondary hover:border-white/30 hover:text-white"
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-2 transition-colors ${newGameSettings.type === "chat"
                ? "text-accent-toxic"
                : "text-secondary group-hover:text-white"
                }`}>
                <MessageSquare size={24} />
              </div>
              <span className="font-bold text-sm uppercase tracking-widest">
                CHAT
              </span>
            </div>
          </button>
          <button
            onClick={() =>
              setNewGameSettings({ ...newGameSettings, type: "in_person" })
            }
            className={`p-4 border text-center transition-all group ${newGameSettings.type === "in_person"
              ? "bg-surfaceHighlight border-accent-toxic text-white shadow-[0_0_15px_rgba(204,255,0,0.1)]"
              : "bg-surface border-white/10 text-secondary hover:border-white/30 hover:text-white"
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-2 transition-colors ${newGameSettings.type === "in_person"
                ? "text-accent-toxic"
                : "text-secondary group-hover:text-white"
                }`}>
                <Users size={24} />
              </div>
              <span className="font-bold text-sm uppercase tracking-widest">
                PRESENCIAL
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateGameForm;
