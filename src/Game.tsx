import React, { useState, useEffect } from 'react';
import Memo from './Memo';
import './Game.css';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { bafx2, sapbafx2 } from './images';
import Sap from './Sap';

interface GameProps {
  setCurrentPage: (page: string) => void;
  activateBuff: () => void;
  activateBuffSap: () => void;
  isBuffActive: boolean;
  isBuffActiveSap: boolean;
  buffTime: number | null;
}

const Game: React.FC<GameProps> = ({ setCurrentPage, activateBuff, activateBuffSap, isBuffActive, isBuffActiveSap, buffTime }) => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);

  const resetAttempts = () => {
    setAttemptsLeft(5);
    localStorage.setItem('attemptsLeft', '5');
  };

  const checkNewDay = () => {
    const storedDate = localStorage.getItem('lastCheckedDate');
    const currentDate = new Date();
    const mskTime = toZonedTime(currentDate, 'Europe/Moscow');
    const currentDay = format(mskTime, 'yyyy-MM-dd');

    if (storedDate !== currentDay) {
      localStorage.setItem('lastCheckedDate', currentDay);
      resetAttempts();
    }
  };

  useEffect(() => {
    const storedAttempts = localStorage.getItem('attemptsLeft');
    if (storedAttempts) {
      setAttemptsLeft(parseInt(storedAttempts, 10));
    }

    checkNewDay();

    const mskTime = toZonedTime(new Date(), 'Europe/Moscow');
    const nextMidnight = new Date(mskTime.setHours(2, 0, 0, 0));
    const timeUntilMidnight = nextMidnight.getTime() - new Date().getTime();

    const timeoutId = setTimeout(() => {
      resetAttempts();
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const updateAttempts = (newAttempts: number) => {
    localStorage.setItem('attemptsLeft', newAttempts.toString());
    setAttemptsLeft(newAttempts);
  };

  const handleBack = () => {
    if (currentGame) {
      setCurrentGame(null);
    } else {
      setCurrentPage('home');
    }
  };

  return (
    <div className="game-container">
      <button className="back-button" onClick={handleBack}>
        Назад
      </button>

      <h1 className="game-title">Мини-игры</h1>
      <div className="game-list">
        <button className="game-item" onClick={() => setCurrentGame('memo')}>
          Memo
        </button>
        <button className="game-item" onClick={() => setCurrentGame('sap')}>
          Sapper
        </button>
      </div>

      <h3 className="attempts-left">Оставшиеся попытки: {attemptsLeft}</h3>

      {isBuffActive && buffTime !== null && (
        <div className="buff-info">
          <img src={bafx2} alt="Buff" className="buff-icon" />
          <span className="buff-time">{buffTime} сек</span>
        </div>
      )}

      {isBuffActiveSap && buffTime !== null && (
        <div className="buff-info">
          <img src={sapbafx2} alt="SapBuff" className="buff-icon" />
          <span className="buff-time">{buffTime} сек</span>
        </div>
      )}

      {/* Отображение модального окна с текущей игрой */}
      {currentGame && (
        <div className="game-modal">
          <div className="modal-content">
            {currentGame === 'memo' && (
              <Memo
                setCurrentPage={setCurrentPage}
                attemptsLeft={attemptsLeft}
                updateAttempts={updateAttempts}
                activateBuff={activateBuff}
              />
            )}
            {currentGame === 'sap' && (
              <Sap
                setCurrentPage={setCurrentPage}
                attemptsLeft={attemptsLeft}
                updateAttempts={updateAttempts}
                activateBuffSap={activateBuffSap}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
