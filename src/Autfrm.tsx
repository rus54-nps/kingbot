import React, { useState, useEffect } from 'react';
import './Autfrm.css';
import { item1, item2, item3, coin } from './images';

interface AutoFarmItem {
  id: number;
  name: string;
  price: number;
  image: string;
  level: number;
  description: string;
  incomePerHour: number;  // Доход в час
}

const AutoFarm: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}> = ({ points, setPoints, setCurrentPage }) => {
  const [items, setItems] = useState<AutoFarmItem[]>([
    { id: 1, name: 'Золотые Руки', price: 5000, image: item1, level: 0, description: '0 монет в час.', incomePerHour: 0 },
    { id: 2, name: 'Счастливая Монета', price: 8888, image: item2, level: 0, description: '0 монет в час.', incomePerHour: 0 },
    { id: 3, name: 'Охотник за Сокровищами', price: 16320, image: item3, level: 0, description: '0 монет в час.', incomePerHour: 0 },
  ]);
  const [autoFarmIncome, setAutoFarmIncome] = useState(0);

  useEffect(() => {
    const savedPoints = localStorage.getItem('points');
    if (savedPoints) {
      setPoints(Number(savedPoints));
    }

    const savedItems = localStorage.getItem('autoFarmItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    const lastIncomeTime = localStorage.getItem('lastIncomeTime');
    const currentTime = Date.now();

    if (lastIncomeTime) {
      const elapsedTime = currentTime - Number(lastIncomeTime);
      const maxOfflineTime = 3 * 60 * 60 * 1000; // 3 часа в миллисекундах
      const totalIncomePerHour = items.reduce((sum, item) => sum + item.incomePerHour, 0);
      const offlineIncome = (totalIncomePerHour * Math.min(elapsedTime, maxOfflineTime)) / 3600000; // Переводим миллисекунды в часы и считаем доход
      addCoins(Math.floor(offlineIncome));
    }

    localStorage.setItem('lastIncomeTime', currentTime.toString());
  }, [setPoints]);

  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('autoFarmItems', JSON.stringify(items));
  }, [points, items]);

  const addCoins = (coins: number) => {
    setPoints(prevPoints => prevPoints + coins);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const totalIncomePerSecond = items.reduce((sum, item) => sum + item.incomePerHour / 3600, 0);
      setAutoFarmIncome(totalIncomePerSecond);
      addCoins(totalIncomePerSecond);
    }, 1000);

    return () => {
      clearInterval(interval);
      localStorage.setItem('lastIncomeTime', Date.now().toString());
    };
  }, [items]);

  const handlePurchase = (itemId: number) => {
    const itemToPurchase = items.find(item => item.id === itemId);
    if (itemToPurchase && points >= itemToPurchase.price) {
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          const newLevel = item.level + 1;
          let newPrice: number = item.price;
          let newIncomePerHour: number = item.incomePerHour;

          if (item.id === 1) {
            newPrice = Math.round(item.price * 1.4);
            newIncomePerHour = item.level === 0 ? 2000 : item.incomePerHour + 150;
          } else if (item.id === 2) {
            newPrice = Math.round(item.price * 1.45);
            newIncomePerHour = item.level === 0 ? 3300 : item.incomePerHour + 200;
          } else if (item.id === 3) {
            newPrice = Math.round(item.price * 1.6);
            newIncomePerHour = item.level === 0 ? 6060 : item.incomePerHour + 300;
          }

          return {
            ...item,
            level: newLevel,
            price: newPrice,
            incomePerHour: newIncomePerHour,
            description: `${newIncomePerHour} монет в час.`,
          };
        }
        return item;
      });

      setItems(updatedItems);
      setPoints(points - itemToPurchase.price);
      alert(`Вы купили ${itemToPurchase.name}! Новый уровень: ${itemToPurchase.level + 1}`);
    } else {
      alert('Недостаточно очков для покупки!');
    }
  };

  return (
    <div className="autofarm-overlay">
      <h2 className="autofarm-title">Автофарм</h2>
      <div className="autofarm-balance">
        <img src={coin} alt="Coin" width={20} height={20} />
        <span>{Math.floor(points)}</span>
      </div>

      <div className="autofarm-income">
        <img src={coin} alt="Coin" width={20} height={20} />
        <span>{Math.floor(autoFarmIncome * 3600)}</span>
        <span> монет в час</span>
      </div>

      <div className="autofarm-passive-income">
        <div className="autofarm-passive-title">Пассивный доход</div>
        <p className="autofarm-passive-text">
          После того как ты закрыл игру, пассивный доход копится 3 часа.
        </p>
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
