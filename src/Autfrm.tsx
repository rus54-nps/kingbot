import React, { useState, useEffect } from 'react';
import './Autfrm.css';
import { bogy, goldh, dar, huntg, lackm, coin } from './images';
import { useLanguage } from './LanguageContext';

interface AutoFarmItem {
  id: number;
  name: string;
  price: number;
  image: string;
  level: number;
  description: { ru: string; en: string };
  incomePerHour: number;
  priceIncreaseFactor: number;
  incomeIncrease: number;
}

const itemNames = {
  goldHands: { ru: 'Золотые Руки', en: 'Golden Hands' },
  luckyCoin: { ru: 'Счастливая Монета', en: 'Lucky Coin' },
  richHarvest: { ru: 'Богатый Урожай', en: 'Rich Harvest' },
  giftOfFate: { ru: 'Дар Судьбы', en: 'Gift of Fate' },
  treasureSeeker: { ru: 'Искатель Сокровищ', en: 'Treasure Seeker' },
};

const AutoFarm: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}> = ({ points, setPoints, setCurrentPage }) => {
  // Инициализация `items` из `localStorage` или начальных значений
  const initialItems: AutoFarmItem[] = [
    { id: 1, name: 'goldHands', price: 8000, image: goldh, level: 0, description: { ru: '0 монет в час', en: '0 coins per hour' }, incomePerHour: 4000, priceIncreaseFactor: 1.4, incomeIncrease: 150 },
    { id: 2, name: 'luckyCoin', price: 10000, image: lackm, level: 0, description: { ru: '0 монет в час', en: '0 coins per hour' }, incomePerHour: 5000, priceIncreaseFactor: 1.45, incomeIncrease: 80 },
    { id: 3, name: 'richHarvest', price: 12000, image: bogy, level: 0, description: { ru: '0 монет в час', en: '0 coins per hour' }, incomePerHour: 6000, priceIncreaseFactor: 1.5, incomeIncrease: 200 },
    { id: 4, name: 'giftOfFate', price: 15000, image: dar, level: 0, description: { ru: '0 монет в час', en: '0 coins per hour' }, incomePerHour: 7000, priceIncreaseFactor: 1.5, incomeIncrease: 300 },
    { id: 5, name: 'treasureSeeker', price: 18800, image: huntg, level: 0, description: { ru: '0 монет в час', en: '0 coins per hour' }, incomePerHour: 8000, priceIncreaseFactor: 1.55, incomeIncrease: 350 },
  ];

  const savedItems = localStorage.getItem('autoFarmItems');
  const [items, setItems] = useState<AutoFarmItem[]>(savedItems ? JSON.parse(savedItems) : initialItems);

   const { language } = useLanguage();

  useEffect(() => {
    const lastExitTime = localStorage.getItem('lastExitTime');
    if (lastExitTime) {
      const timeElapsed = (Date.now() - parseInt(lastExitTime)) / (1000 * 60 * 60); // Часы с момента выхода
      const hoursToAdd = Math.min(timeElapsed, 3); // Ограничиваем до 3 часов

      let totalIncomePerHour = 0;
      items.forEach(item => {
        if (item.level > 0) {
          totalIncomePerHour += item.incomePerHour;
        }
      });

      const passiveIncome = totalIncomePerHour * hoursToAdd;
      setPoints(prevPoints => prevPoints + Math.floor(passiveIncome));
    }
  }, [items, setPoints]);

  useEffect(() => {
  const interval = setInterval(() => {
    let totalIncome = 0;
    items.forEach(item => {
      if (item.level > 0) {
        totalIncome += item.incomePerHour / 3600; // Пересчитываем доход за секунду
      }
    });
    setPoints(prevPoints => Math.floor(prevPoints + totalIncome)); // Добавляем доход за секунду
  }, 1000);

  return () => {
    clearInterval(interval);
    localStorage.setItem('lastExitTime', Date.now().toString()); // Сохраняем время выхода
  };
}, [items, setPoints]);

const handlePurchase = (itemId: number) => {
  const itemToPurchase = items.find(item => item.id === itemId);
  if (itemToPurchase && points >= itemToPurchase.price) {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const newLevel = item.level + 1;
        const newPrice = item.price * item.priceIncreaseFactor;
        const newIncome = newLevel === 1 ? item.incomePerHour : item.incomePerHour + item.incomeIncrease;

        return {
          ...item,
          level: newLevel,
          price: Math.round(newPrice), // Обновляем цену
          incomePerHour: newIncome,
          description: {
            ru: `${newIncome} монет в час`,
            en: `${newIncome} coins per hour`,
          }, // Обновляем описание
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem('autoFarmItems', JSON.stringify(updatedItems)); // Сохраняем обновленные данные
    setPoints(points - itemToPurchase.price);
    alert(`${language === 'ru' ? 'Вы купили' : 'You bought'} ${itemToPurchase.name}! ${language === 'ru' ? 'Новый уровень' : 'New level'}: ${itemToPurchase.level + 1}`);
  } else {
    alert(language === 'ru' ? 'Недостаточно очков для покупки!' : 'Not enough points to buy!');
  }
};

  return (
    <div className="Aut autofarm-overlay">
      <h2 className="autofarm-title">{language === 'ru' ? 'Автофарм' : 'Autofarm'}</h2>
      <div className="autofarm-balance">
        <img src={coin} alt="Coin" width={20} height={20} />
        <span>{Math.floor(points)}</span>
      </div>

      <div className="autofarm-passive-income">
        <div className="autofarm-passive-title">{language === 'ru' ? 'Пассивный доход' : 'Passive income'}</div>
        <p className="autofarm-passive-text">{language === 'ru' ? 'После того как ты закрыл игру, пассивный доход копится 3 часа.' : 'After you close the game, passive income accumulates for 3 hours.'}</p>
      </div>
      <div className="autofarm-items-container">
        <ul className="autofarm-items">
          {items.map((item) => (
            <li key={item.id} className="autofarm-item">
              <div className="autofarm-item-image-container">
                <img src={item.image} alt={item.name} className="autofarm-item-image" />
                <div className="autofarm-item-level">Lvl {item.level}</div>
              </div>
              <div className="autofarm-item-info">
              <h3>{itemNames[item.name as keyof typeof itemNames][language]}</h3>

              <p>{item.description[language]}</p>
                <button className="buy-button" onClick={() => handlePurchase(item.id)}>
                  <img src={coin} alt="Coin" width={16} height={16} />
                  {item.price}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button className="autofarm-back-button" onClick={() => setCurrentPage('home')}>{language === 'ru' ? 'Назад' : 'back'}</button>
    </div>
  );
};

export default AutoFarm;
