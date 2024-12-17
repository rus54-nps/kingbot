import React, { useState, useEffect } from 'react';
import './Task.css';
import { useLanguage } from './LanguageContext';

interface TaskProps {
  onRewardClaimed: () => void; // Функция для обработки получения награды
  onClose: () => void; // Функция для закрытия вкладки
}

const Task: React.FC<TaskProps> = ({ onRewardClaimed, onClose }) => {
  const [hasClaimedReward, setHasClaimedReward] = useState<boolean>(false); 
  const [hasVisitedGroup, setHasVisitedGroup] = useState<boolean>(false); 

  const { language } = useLanguage();

  // Загружаем состояние из localStorage при загрузке компонента
  useEffect(() => {
    const claimed = localStorage.getItem('taskRewardClaimed');
    const visited = localStorage.getItem('taskGroupVisited');
    if (claimed === 'true') setHasClaimedReward(true);
    if (visited === 'true') setHasVisitedGroup(true);
  }, []);

  const handleGoToGroup = () => {
    window.open('https://t.me/+wC_j77d7MXNjYmZi', '_blank');
    setHasVisitedGroup(true);
    localStorage.setItem('taskGroupVisited', 'true'); // Сохраняем в localStorage
  };

  const handleClaimReward = () => {
    if (!hasClaimedReward && hasVisitedGroup) {
      setHasClaimedReward(true);
      localStorage.setItem('taskRewardClaimed', 'true'); // Сохраняем в localStorage
      onRewardClaimed(); // Вызов функции для добавления награды
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).classList.contains('task-page-overlay')) {
      onClose(); // Закрываем вкладку при клике на затемнённую область
    }
  };

  return (
    <div className="task-page-overlay " onClick={handleOverlayClick}>
      <div className="task-container">
        <h2>{language === 'ru' ? 'Подпишитесь на Telegram' : 'Subscribe to Telegram Welcome Bonus'}</h2>

        <p className="reward-text">🏆 {language === 'ru' ? 'Награда: 2500 монет' : 'Reward: 2500 coins'}</p>

        {!hasVisitedGroup && (
          <button onClick={handleGoToGroup} className="task-button">
            {language === 'ru' ? 'Перейти' : 'Go over'}
          </button>
        )}

        {hasVisitedGroup && !hasClaimedReward && (
          <button onClick={handleClaimReward} className="task-button">
            {language === 'ru' ? 'Забрать награду' : 'To collect the reward'}
          </button>
        )}

        {hasClaimedReward && <p className="reward-received">{language === 'ru' ? 'Награда получена' : 'The reward has been received'}! 🎉</p>}
      </div>
    </div>
  );
};

export default Task;
