import React, { useState, useEffect } from 'react';
import './Memo.css';
import { k1, k2, k3, k4, k5, tap1 } from './images';

interface MemoProps {
  setCurrentPage: (page: string) => void; // Функция для возврата на другие страницы
  attemptsLeft: number; // Количество оставшихся попыток
  updateAttempts: (newAttempts: number) => void; // Функция для обновления количества попыток
  activateBuff: () => void;
  isBuffActive: boolean;
  buffTime: number | null;
  taps: number;
}

const Memo: React.FC<MemoProps> = ({ setCurrentPage, attemptsLeft, updateAttempts, activateBuff}) => {
  // Массив изображений
  const images = [k1, k2, k3, k4, k5, tap1];
  const [cards, setCards] = useState<{ image: string; id: number }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disableClick, setDisableClick] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // Время игры в секундах
  const [gameOver, setGameOver] = useState(false);

  // Инициализация карточек
  useEffect(() => {
    const shuffledCards = [...images, ...images] // Дублируем изображения
      .sort(() => Math.random() - 0.5) // Перемешиваем
      .map((image) => ({ image, id: Math.random() })); // Создаем массив объектов
    setCards(shuffledCards);
  }, []);

  // Таймер для отсчета времени
  useEffect(() => {
    if (gameOver) return; // Останавливаем таймер, если игра окончена

    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Очистка таймера при выходе из useEffect
    } else {
      alert('Время вышло! Вы проиграли!');
      handleEndGame();
    }
  }, [timeRemaining, gameOver]);

  // Логика сравнения
  useEffect(() => {
    if (flipped.length === 2) {
      setDisableClick(true);
      const [first, second] = flipped;
      if (cards[first].image === cards[second].image) {
        setMatched((prev) => [...prev, first, second]);
      }
      setTimeout(() => {
        setFlipped([]);
        setDisableClick(false);
      }, 1000);
    }
  }, [flipped, cards]);

  // Проверка на победу
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true); // Завершаем игру при победе
      activateBuff(); // Активируем бафф
      setTimeout(() => {
        alert('Вы победили!');
        handleEndGame();
      }, 500);
    }
  }, [matched, cards]);

  // Завершение игры
  const handleEndGame = () => {
    if (attemptsLeft > 0) {
      updateAttempts(attemptsLeft - 1); // Уменьшаем количество оставшихся попыток
    }
    setCurrentPage('home'); // Возвращаемся на главную страницу
  };

  // Обработчик кликов по карточкам
  const handleCardClick = (index: number) => {
    if (!flipped.includes(index) && !matched.includes(index) && !disableClick) {
      setFlipped((prev) => [...prev, index]);
    }
  };

  // Проверка, есть ли оставшиеся попытки
  if (attemptsLeft <= 0) {
    return (
      <div className="memo-game">
        <h1>Memo Game</h1>
        <h2>У вас закончились попытки!</h2>
        <button onClick={() => setCurrentPage('home')}>Назад</button>
      </div>
    );
  }

  return (
    <div className="memo-game">
      <h1>Memo Game</h1>
      <button onClick={() => setCurrentPage('home')}>Назад</button>
    
      <div className="timer">
        <h2>Оставшееся время: {timeRemaining} сек</h2>
      </div>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-front">
              <img src={card.image} alt="card" />
            </div>
            <div className="card-back">❓</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memo;
