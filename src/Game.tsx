import React, { useState } from 'react';
import Memo from './Memo';
import './Game.css';

interface GameProps {
  setCurrentPage: (page: string) => void; // Функция для возврата на другие страницы
}

const Game: React.FC<GameProps> = ({ setCurrentPage }) => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const handleBack = () => {
    if (currentGame) {
      setCurrentGame(null); // Возвращаемся к списку игр
    } else {
      setCurrentPage('home'); // Возвращаемся на главную страницу
    }
  };

  return (
    <div className="game-container">
      <button className="back-button" onClick={handleBack}>
        Назад
      </button>
      {!currentGame && (
        <>
          <h1 className="game-title">Мини-игры</h1>
          <div className="game-list">
            <button className="game-item" onClick={() => setCurrentGame('memo')}>
              Игра 1
            </button>
            <button className="game-item">Игра 2</button>
          </div>
        </>
      )}
      {currentGame === 'memo' && <Memo setCurrentPage={setCurrentPage} />}
    </div>
  );
};

export default Game;
