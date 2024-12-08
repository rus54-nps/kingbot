import React, { useState, useEffect } from 'react';
import './Task.css';

interface TaskProps {
  onRewardClaimed: () => void; // Функция для обработки получения награды
}

const Task: React.FC<TaskProps> = ({ onRewardClaimed }) => {
  const [hasClaimedReward, setHasClaimedReward] = useState<boolean>(false); 
  const [hasVisitedGroup, setHasVisitedGroup] = useState<boolean>(false); 

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

  return (
    <div className="task-container">
      <h2>Подпишитесь на Telegram</h2>

      <p className="reward-text">🏆 Награда: 2500 монет</p>

      {!hasVisitedGroup && (
        <button onClick={handleGoToGroup} className="task-button">
          Перейти
        </button>
      )}

      {hasVisitedGroup && !hasClaimedReward && (
        <button onClick={handleClaimReward} className="task-button">
          Забрать награду
        </button>
      )}

      {hasClaimedReward && <p className="reward-received">Награда получена! 🎉</p>}
    </div>
  );
};

export default Task;
