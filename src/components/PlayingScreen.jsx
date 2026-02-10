import { useState, useEffect } from 'react';
import PhaseHeader from './playing/PhaseHeader';
import CardSubmissionView from './playing/CardSubmissionView';
import VotingView from './playing/VotingView';
import ReadingView from './playing/ReadingView';
import ResultsView from './playing/ResultsView';

const OnlinePlayingScreen = ({ roomData, playerId, submitCards, submitVote, leaveRoom, isHost, resetGame, myHand, mySubmissionId, startVoting }) => {
  const [hasSubmittedCards, setHasSubmittedCards] = useState(false);

  const gameData = roomData.gameData || {};
  const gamePhase = gameData.state || 'playing';
  const blackCard = gameData.currentBlackCard || '';

  // Reset submission state when new round starts
  useEffect(() => {
    if (gamePhase === 'playing') {
      setHasSubmittedCards(false);
    }
  }, [gamePhase, blackCard]);

  // Check if player has submitted in current round
  const mySubmission = gameData.table?.find(entry => entry.playerId === playerId);
  const hasSubmitted = !!mySubmission || hasSubmittedCards;

  const handleSubmitCards = (cards) => {
    submitCards(cards);
    setHasSubmittedCards(true);
  };

  const handleSubmitVote = (submissionId) => {
    submitVote(submissionId);
  };

  const handleNextRound = () => {
    if (isHost) {
      resetGame(); // This triggers 'nextRound' on server which starts a new round
    }
  };

  return (
    <div className="p-4 sm:p-6 relative z-10 h-full flex flex-col max-w-lg md:max-w-6xl mx-auto w-full">
      <PhaseHeader gamePhase={gamePhase} onLeave={leaveRoom} />

      <div className="flex-1 overflow-y-auto min-h-0 pb-4 no-scrollbar">
        {/* Playing Phase: Card Submission */}
        {gamePhase === 'playing' && (
          <CardSubmissionView
            blackCard={blackCard}
            myHand={myHand}
            onSubmitCards={handleSubmitCards}
            hasSubmitted={hasSubmitted}
          />
        )}

        {/* Reading Phase (In Person) */}
        {gamePhase === 'reading' && (
          <ReadingView
            gameData={gameData}
            myId={playerId}
            startVoting={startVoting}
            isHost={isHost}
          />
        )}

        {/* Voting Phase */}
        {gamePhase === 'voting' && (
          <VotingView
            gameData={gameData}
            myId={playerId}
            mySubmissionId={mySubmissionId}
            onSubmitVote={handleSubmitVote}
          />
        )}

        {/* Results Phase */}
        {gamePhase === 'results' && (
          <ResultsView
            gameData={gameData}
            roomData={roomData}
            isHost={isHost}
            onNextRound={handleNextRound}
          />
        )}
      </div>
    </div>
  );
};

export default OnlinePlayingScreen;
