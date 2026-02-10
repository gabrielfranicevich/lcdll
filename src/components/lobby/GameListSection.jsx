import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from '../Icons';
import GameItem from './GameItem';

const GameListSection = ({
  title,
  subtitle,
  icon,
  games,
  isExpanded,
  onToggle,
  onJoin,
  headerClassName = "text-white",
  showCount = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [games.length]);

  if (games.length === 0) return null;

  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const paginatedGames = games.slice(startIndex, startIndex + gamesPerPage);

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-3 px-2 group ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-white/5 group-hover:bg-white/10 transition-colors`}>
            {icon}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold leading-tight uppercase tracking-wide group-hover:text-accent-toxic transition-colors">{title}</h2>
            {subtitle && (
              <span className="text-xs text-secondary font-mono">{subtitle}</span>
            )}
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="mt-1">
          <div className="space-y-2">
            {paginatedGames.map((game) => (
              <GameItem
                key={game.id}
                game={game}
                onJoin={onJoin}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-2 flex items-center justify-between px-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage(prev => Math.max(1, prev - 1));
                }}
                disabled={currentPage === 1}
                className="p-2 text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="text-xs font-mono text-secondary">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                }}
                disabled={currentPage === totalPages}
                className="p-2 text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameListSection;
