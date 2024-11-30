import React, { useState, useEffect } from 'react';
import Memo from './Memo';
import './Game.css';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

interface GameProps {
  setCurrentPage: (page: string) => void; // Функция для возврата на другие страницы
}

const Game: React.FC<GameProps> = ({ setCurrentPage }) => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5); // Состояние для оставшихся попыток

  // Функция для сброса количества попыток
  const resetAttempts = () => {
    setAttemptsLeft(5);
    localStorage.setItem('attemptsLeft', '5');
  };

  // Функция для проверки, если настал новый день по МСК
  const checkNewDay = () => {
    const storedDate = localStorage.getItem('lastCheckedDate');
    const currentDate = new Date();
    
    // Конвертируем текущее время в МСК
    const mskTime = toZonedTime(currentDate, 'Europe/Moscow');
    const currentDay = format(mskTime, 'yyyy-MM-dd'); // Получаем строку даты (YYYY-MM-DD)
  
    // Если текущая дата отличается от сохраненной, сбрасываем попытки
    if (storedDate !== currentDay) {
      localStorage.setItem('lastCheckedDate', currentDay);
      resetAttempts();
    }
  };

  // Загружаем количество оставшихся попыток из localStorage
  useEffect(() => {
    const storedAttempts = localStorage.getItem('attemptsLeft');
    if (storedAttempts) {
      setAttemptsLeft(parseInt(storedAttempts, 10));
    }

    // Проверка на новый день
    checkNewDay();

    // Настроим таймер на сброс попыток в 00:00 по МСК
    const mskTime = toZonedTime(new Date(), 'Europe/Moscow');
    const nextMidnight = new Date(mskTime.setHours(24, 0, 0, 0)); // Следующий 00:00 по МСК

    const timeUntilMidnight = nextMidnight.getTime() - new Date().getTime();
    
    // Запускаем таймер, который сработает в 00:00 по МСК
    const timeoutId = setTimeout(() => {
      resetAttempts(); // Сбросить попытки в 00:00 по МСК
    }, timeUntilMidnight);

    // Очищаем таймер при размонтировании компонента
    return () => clearTimeout(timeoutId);
  }, []);

  // Обновляем количество попыток в localStorage
  const updateAttempts = (newAttempts: number) => {
    localStorage.setItem('attemptsLeft', newAttempts.toString());
    setAttemptsLeft(newAttempts);
  };

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
      {/* Отображаем оставшиеся попытки здесь */}
      <h3>Оставшиеся попытки: {attemptsLeft}</h3>
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
      {currentGame === 'memo' && (
        <Memo
          setCurrentPage={setCurrentPage}
          attemptsLeft={attemptsLeft}
          updateAttempts={updateAttempts}
        />
      )}
    </div>
  );
};

export default Game;
