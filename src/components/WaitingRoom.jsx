import { useEffect } from 'react';
import WaitingRoomHeader from './waiting/WaitingRoomHeader';
import RoomStats from './waiting/RoomStats';
import GameSettingsSection from './waiting/GameSettingsSection';
import WaitingPlayerList from './waiting/WaitingPlayerList';
import StartGameButton from './waiting/StartGameButton';

const OnlineWaitingRoom = ({ roomData, isHost, leaveRoom, startGame, updateRoomSettings, contributeTheme }) => {
  const selectedThemes = roomData.settings.selectedThemes || ['básico'];
  const currentPlayers = roomData.players.length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && isHost && currentPlayers >= 3) {
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHost, currentPlayers, startGame]);

  const toggleTheme = (theme) => {
    if (!isHost) return;

    if (selectedThemes.includes(theme)) {
      // Don't allow removing the last theme
      if (selectedThemes.length > 1) {
        const newThemes = selectedThemes.filter(t => t !== theme);
        updateRoomSettings({ selectedThemes: newThemes });
      }
    } else {
      const newThemes = [...selectedThemes, theme];
      updateRoomSettings({ selectedThemes: newThemes });
    }
  };



  return (
    <div className="p-6 relative z-10 h-full flex flex-col w-full">
      <WaitingRoomHeader
        roomName={roomData.roomName}
        roomId={roomData.id}
        onLeave={leaveRoom}
      />

      <RoomStats
        currentPlayers={currentPlayers}
        maxPlayers={roomData.settings.players}
        gameType={roomData.settings.type}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <GameSettingsSection
          isHost={isHost}
          selectedThemes={selectedThemes}
          onToggleTheme={toggleTheme}
          contributedThemes={roomData.contributedThemes || []}
          onContributeTheme={contributeTheme}
        />

        <WaitingPlayerList
          players={roomData.players}
          hostId={roomData.hostId}
        />
      </div>

      <StartGameButton
        isHost={isHost}
        onStart={startGame}
        playerCount={currentPlayers}
      />
    </div>
  );
};

export default OnlineWaitingRoom;

