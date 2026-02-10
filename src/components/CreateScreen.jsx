import CreateGameHeader from './create/CreateGameHeader';
import CreateGameForm from './create/CreateGameForm';
import SlidingToggle from './shared/SlidingToggle';

const OnlineCreateScreen = ({ setScreen, newGameSettings, setNewGameSettings,
  onlineGames, setOnlineGames, playerNames, createOnlineGame,
  playerName, setPlayerName, getRandomName }) => {
  const handleSubmit = () => {
    let finalName = playerName.trim();
    if (!finalName) {
      finalName = getRandomName();
      setPlayerName(finalName);
    }

    if (createOnlineGame) {
      createOnlineGame(finalName);
    } else {
      // Local fallback for testing/demo without socket
      const newGame = {
        id: Date.now(),
        name: newGameSettings.name || `Partida de ${playerNames[0] || 'Jugador'}`,
        players: 1,
        maxPlayers: newGameSettings.players,
        type: newGameSettings.type,
        status: 'waiting'
      };
      setOnlineGames([...onlineGames, newGame]);
      setScreen('online_lobby');
    }
  };

  return (
    <div className="p-6 relative z-10 h-full flex flex-col max-w-lg md:max-w-6xl mx-auto w-full">
      <div className="flex-1 flex flex-col">
        <CreateGameHeader
          onBack={() => setScreen('online_lobby')}
          toggleSlot={
            <SlidingToggle
              value={newGameSettings.isPrivate || false}
              onChange={(val) => setNewGameSettings({ ...newGameSettings, isPrivate: val })}
              leftLabel="PÚBLICA"
              rightLabel="PRIVADA"
              leftValue={false}
              rightValue={true}
            />
          }
        />

        <div className="flex-1 flex flex-col justify-center">
          <CreateGameForm
            playerName={playerName}
            setPlayerName={setPlayerName}
            newGameSettings={newGameSettings}
            setNewGameSettings={setNewGameSettings}
            onSubmit={handleSubmit}
            getRandomName={getRandomName}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-white text-black py-4 font-black text-xl uppercase tracking-widest hover:bg-accent-toxic transition-colors shadow-brutal hover:shadow-brutal-hover active:translate-y-1 active:shadow-none mt-6"
        >
          CREAR AHORA
        </button>
      </div>
    </div>
  );
};

export default OnlineCreateScreen;

