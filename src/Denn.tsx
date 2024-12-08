import React, { useState, useEffect } from 'react';
import './Denn.css';

type DenProps = {
  onClose: () => void;
  onCollectReward: (rewardAmount: number) => void;
};

const Den: React.FC<DenProps> = ({ onCollectReward }) => {
  const [reward, setReward] = useState<number>(400); // Начальная награда
  const [canClaim, setCanClaim] = useState<boolean>(false); // Флаг, можно ли забрать награду
  const [isVisible, setIsVisible] = useState<boolean>(false); // Флаг, нужно ли показывать окно
  const [, setConsecutiveDays] = useState<number>(0); // Количество дней подряд

  useEffect(() => {
    const now = new Date();
    const moscowTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // Переводим время в московское
    const today = moscowTime.toISOString().split('T')[0]; // Формат YYYY-MM-DD для сравнения

    const lastClaimedDate = localStorage.getItem('lastClaimedDate'); // Получаем дату последнего забора награды
    const storedConsecutiveDays = Number(localStorage.getItem('consecutiveDays')) || 0; // Получаем количество дней подряд
    const storedReward = Number(localStorage.getItem('currentReward')) || 400; // Получаем награду из localStorage
    const hasClaimedToday = localStorage.getItem('hasClaimedToday'); // Проверка, была ли награда забрана сегодня

    if (lastClaimedDate !== today || hasClaimedToday !== 'true') {
      // Новый день или награда еще не была забрана
      let nextReward = storedReward + 200; // Увеличиваем награду на 200 каждый день

      // Проверяем, если сегодня 10-й день подряд
      if ((storedConsecutiveDays + 1) % 10 === 0) {
        nextReward = nextReward * 3; // Увеличиваем награду в 3 раза
      }

      setReward(nextReward); // Обновляем награду
      setConsecutiveDays(storedConsecutiveDays + 1); // Увеличиваем количество дней подряд
      setCanClaim(true); // Разрешаем забор награды
      setIsVisible(true); // Показываем окно

      // Сохраняем текущие данные
      localStorage.setItem('currentReward', String(nextReward));
      localStorage.setItem('consecutiveDays', String(storedConsecutiveDays + 1));
      localStorage.setItem('lastClaimedDate', today); // Обновляем дату последнего забора
      localStorage.setItem('hasClaimedToday', 'false'); // Обновляем флаг, что награду еще не забрали
    } else {
      // Если награда уже была забрана, скрываем окно
      setCanClaim(false);
      setIsVisible(false);
    }
  }, []);

  const handleCollect = () => {
    if (!canClaim) return;

    onCollectReward(reward); // Передаем награду в родительский компонент
    setCanClaim(false); // Блокируем повторный забор награды
    setIsVisible(false); // Закрываем окно

    // Записываем в localStorage, что награда была забрана сегодня
    localStorage.setItem('hasClaimedToday', 'true');
  };

  if (!isVisible) return null; // Если окно не должно отображаться, не рендерим его

  return (
    <div className="den-modal">
      <h2>Ежедневная награда</h2>
      <p>{reward} монет</p>
      <button onClick={handleCollect} disabled={!canClaim}>
        {canClaim ? 'Забрать' : 'Уже забрано'}
      </button>
    </div>
  );
};

export default Den;
