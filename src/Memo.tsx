import React, { useState, useEffect } from 'react';
import './Memo.css';
import { m1, m2, m3, m4, m5, m6 } from './images';
import { useLanguage } from './LanguageContext';

interface MemoProps {
  setCurrentPage: (page: string) => void;
  attemptsLeft: number;
  updateAttempts: (newAttempts: number) => void;
  activateBuff: () => void;
}

const Memo: React.FC<MemoProps> = ({
  setCurrentPage,
  attemptsLeft,
  updateAttempts,
  activateBuff,
}) => {
  const images = [m1, m2, m3, m4, m5, m6];
  const [cards, setCards] = useState<{ image: string; id: number }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disableClick, setDisableClick] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [resultModal, setResultModal] = useState<'win' | 'lose' | null>(null);

  const { language } = useLanguage();

  useEffect(() => {
    const shuffledCards = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image) => ({ image, id: Math.random() }));
    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleEndGame('lose');
    }
  }, [timeRemaining, gameOver]);

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

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
      activateBuff();
      setResultModal('win');
    }
  }, [matched, cards]);

  const handleEndGame = (result: 'win' | 'lose') => {
    if (hasInteracted && attemptsLeft > 0) {
      updateAttempts(attemptsLeft - 1);
    }
    setResultModal(result);
  };

  const handleCardClick = (index: number) => {
    if (!flipped.includes(index) && !matched.includes(index) && !disableClick) {
      setFlipped((prev) => [...prev, index]);
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    }
  };

  const closeModal = () => {
    setResultModal(null);
    setCurrentPage('home');
  };

  if (attemptsLeft <= 0) {
    return (
      <div className="memome">
        <h1>{language === 'ru' ? 'Мемо' : 'Memo'}</h1>
        <h2>{language === 'ru' ? 'У вас закончились попытки' : 'You run out of attempts'}</h2>
        <button onClick={() => setCurrentPage('home')}>{language === 'ru' ? 'Назад' : 'Back'}</button>
      </div>
    );
  }

  return (
    <div className="memo-game">
      <h1>{language === 'ru' ? 'Мемо' : 'Memo'}</h1>
      <button onClick={() => setCurrentPage('home')}>{language === 'ru' ? 'Назад' : 'Back'}</button>

      <div className="timer">
        <h2>
          {language === 'ru' ? 'Оставшееся время' : 'Remaining time'}: {timeRemaining}{' '}
          {language === 'ru' ? 'Секунд' : 'Seconds'}
        </h2>
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

      {resultModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{resultModal === 'win' ? (language === 'ru' ? 'Победа!' : 'Victory!') : (language === 'ru' ? 'Проиграл' : 'Defeat')}</h2>
            {resultModal === 'win' && <p>{language === 'ru' ? 'Награда: Баф на х2 монет' : 'Reward: Buff on x2 coins'}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Memo;
