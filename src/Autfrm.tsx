import React, { useState, useEffect } from 'react';
import './Autfrm.css';
import { bogy, goldh, dar, huntg, lackm, coin } from './images';

interface AutoFarmItem {
  id: number;
  name: string;
  price: number;
  image: string;
  level: number;
  description: string;
  incomePerHour: number;
  priceIncreaseFactor: number;
  incomeIncrease: number;
}

const AutoFarm: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}> = ({ points, setPoints, setCurrentPage }) => {
  const [items, setItems] = useState<AutoFarmItem[]>([
    { id: 1, name: 'Золотые Руки', price: 8000, image: goldh, level: 0, description: '0 монет в час', incomePerHour: 4000, priceIncreaseFactor: 1.4, incomeIncrease: 150 },
    { id: 2, name: 'Счастливая Монета', price: 10000, image: lackm, level: 0, description: '0 монет в час', incomePerHour: 5000, priceIncreaseFactor: 1.45, incomeIncrease: 150 },
    { id: 3, name: 'Богатый Урожай', price: 12000, image: bogy, level: 0, description: '0 монет в час', incomePerHour: 6000, priceIncreaseFactor: 1.5, incomeIncrease: 200 },
    { id: 4, name: 'Дар Судьбы', price: 15000, image: dar, level: 0, description: '0 монет в час', incomePerHour: 7000, priceIncreaseFactor: 1.5, incomeIncrease: 300 },
    { id: 5, name: 'Искатель Сокровищ', price: 18800, image: huntg, level: 0, description: '0 монет в час', incomePerHour: 8000, priceIncreaseFactor: 1.55, incomeIncrease: 350 },
  ]);

  const [autoFarmIncome, setAutoFarmIncome] = useState(0);

  useEffect(() => {
    // Загрузка состояния улучшений из localStorage
    const savedItems = localStorage.getItem('autoFarmItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    // Загружаем время выхода и начисляем доход
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
          totalIncome += item.incomePerHour * (1 / 3600);
        }
      });
      setAutoFarmIncome(totalIncome);
      setPoints(prevPoints => Math.floor(prevPoints + totalIncome));
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
            price: Math.round(newPrice),
            incomePerHour: newIncome,
            description: `${newIncome} монет в час.`,
          };
        }
        return item;
      });

      setItems(updatedItems);
      localStorage.setItem('autoFarmItems', JSON.stringify(updatedItems));
      setPoints(points - itemToPurchase.price);
      alert(`Вы купили ${itemToPurchase.name}! Новый уровень: ${itemToPurchase.level + 1}`);
    } else {
      alert('Недостаточно очков для покупки!');
    }
  };

  return (
    <div className="Aut autofarm-overlay">
      <h2 className="autofarm-title">Автофарм</h2>
      <div className="autofarm-balance">
        <img src={coin} alt="Coin" width={20} height={20} />
        <span>{Math.floor(points)}</span>
      </div>

      <div className="autofarm-income">
        <img src={coin} alt="Coin" width={20} height={20} />
        <span>{Math.floor(autoFarmIncome)}</span>
        <span>монет в час</span>
      </div>

      <div className="autofarm-passive-income">
        <div className="autofarm-passive-title">Пассивный доход</div>
        <p className="autofarm-passive-text">После того как ты закрыл игру, пассивный доход копится 3 часа.</p>
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
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <button className="buy-button" onClick={() => handlePurchase(item.id)}>
                  <img src={coin} alt="Coin" width={16} height={16} />
                  {item.price}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button className="autofarm-back-button" onClick={() => setCurrentPage('home')}>Назад</button>
    </div>
  );
};

export default AutoFarm;
