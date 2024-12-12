import React, { useState, useEffect } from 'react';
import './Memo.css';
import { m1, m2, m3, m4, m5, m6 } from './images';

interface MemoProps {
  setCurrentPage: (page: string) => void; // Функция для возврата на другие страницы
  attemptsLeft: number; // Количество оставшихся попыток
  updateAttempts: (newAttempts: number) => void; // Функция для обновления количества попыток
  activateBuff: () => void;
}

const Memo: React.FC<MemoProps> = ({
  setCurrentPage,
  attemptsLeft,
  updateAttempts,
  activateBuff,
}) => {
  // Массив изображений
  const images = [m1, m2, m3, m4, m5, m6];
  const [cards, setCards] = useState<{ image: string; id: number }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disableClick, setDisableClick] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // Время игры в секундах
  const [gameOver, setGameOver] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Новое состояние

  // Инициализация карточек
  useEffect(() => {
    const shuffledCards = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image) => ({ image, id: Math.random() }));
    setCards(shuffledCards);
  }, []);

  // Таймер для отсчета времени
  useEffect(() => {
    if (gameOver) return;

    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
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
      }, 500);
    }
  }, [flipped, cards]);

  // Проверка на победу
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
      activateBuff();
      setTimeout(() => {
        alert('Вы победили!');
        handleEndGame();
      }, 500);
    }
  }, [matched, cards]);

 // Завершение игры
const handleEndGame = () => {
  if (hasInteracted && attemptsLeft > 0) {
    updateAttempts(attemptsLeft - 1); // Уменьшаем попытки только если было взаимодействие
  }
  setCurrentPage('home'); // Возвращаемся на главную страницу
};

// Обработчик кликов по карточкам
const handleCardClick = (index: number) => {
  if (!flipped.includes(index) && !matched.includes(index) && !disableClick) {
    setFlipped((prev) => [...prev, index]);
    if (!hasInteracted) {
      setHasInteracted(true); // Устанавливаем факт взаимодействия только при первом действии
    }
  }
};
// Обработчик кнопки "Назад"
const handleExit = () => {
  handleEndGame(); // Завершаем игру и проверяем попытки
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
      <button onClick={handleExit}>Назад</button>

      <div className="timer">
        <h2>Оставшееся время: {timeRemaining} сек</h2>
      </div>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${
              flipped.includes(index) || matched.includes(index) ? 'flipped' : ''
            }`}
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
