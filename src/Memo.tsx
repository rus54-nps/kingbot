import React, { useState, useEffect } from 'react';
import './Memo.css';
import { k1, k2 } from './images';

interface MemoProps {
  setCurrentPage: (page: string) => void; // Функция для возврата на другие страницы
}

const Memo: React.FC<MemoProps> = ({ setCurrentPage }) => {
  // Массив изображений
  const images = [k1, k2];
  const [cards, setCards] = useState<{ image: string; id: number }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disableClick, setDisableClick] = useState(false);

  // Инициализация карточек
  useEffect(() => {
    const shuffledCards = [...images, ...images] // Дублируем изображения
      .sort(() => Math.random() - 0.5) // Перемешиваем
      .map((image) => ({ image, id: Math.random() })); // Создаем массив объектов
    setCards(shuffledCards);
  }, []);

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
      setTimeout(() => {
        alert('Вы победили!');
        setCurrentPage('home'); // Возвращаемся к списку мини-игр
      }, 500); // Небольшая задержка для завершения анимации
    }
  }, [matched, cards, setCurrentPage]);
  

  const handleCardClick = (index: number) => {
    if (!flipped.includes(index) && !matched.includes(index) && !disableClick) {
      setFlipped((prev) => [...prev, index]);
    }
  };

  return (
    <div className="memo-game">
      <h1>Memo Game</h1>
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
