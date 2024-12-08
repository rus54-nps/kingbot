// Task.tsx
import React, { useState } from 'react';

interface TaskProps {
  onRewardClaimed: () => void; // Функция для обработки получения награды
}

const Task: React.FC<TaskProps> = ({ onRewardClaimed }) => {
  const [isSubscribed] = useState(false); // Состояние для подписки
  const [hasClaimedReward, setHasClaimedReward] = useState(false); // Состояние для получения награды

  const handleGoToGroup = () => {
    window.open('https://t.me/+wC_j77d7MXNjYmZi', '_blank'); // Переход в группу
  };

  const handleClaimReward = () => {
    if (isSubscribed && !hasClaimedReward) {
      setHasClaimedReward(true);
      onRewardClaimed(); // Вызов функции для получения награды (1000 монет)
    }
  };

  return (
    <div className="task-container">
      <h2>Задание: Подпишитесь на нашу группу</h2>
      <p>Описание: Подпишитесь на нашу группу в Telegram, чтобы получить награду!</p>
      <p>Награда: 1000 монет</p>

      {/* Кнопка перехода в группу */}
      <button onClick={handleGoToGroup}>Перейти</button>

      {/* Кнопка получения награды, доступна только после подписки */}
      {isSubscribed && !hasClaimedReward && (
        <button onClick={handleClaimReward}>Забрать награду</button>
      )}

      {/* Сообщение о том, что пользователь подписался */}
      {isSubscribed && <p>Вы подписались на группу!</p>}

      {/* Состояние задания */}
      {hasClaimedReward && <p>Награда получена!</p>}
    </div>
  );
};

export default Task;
