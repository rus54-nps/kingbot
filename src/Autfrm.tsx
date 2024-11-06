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
    // Загружаем сохраненные данные
    const savedPoints = localStorage.getItem('points');
    if (savedPoints) {
      setPoints(Number(savedPoints));
    }

    const savedItems = localStorage.getItem('autoFarmItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    const savedIncome = localStorage.getItem('autoFarmIncome');
    if (savedIncome) {
      setAutoFarmIncome(Number(savedIncome));
    }
  }, [setPoints]);

  useEffect(() => {
    // Обновление localStorage при изменении points, items и autoFarmIncome
    localStorage.setItem('points', points.toString());
    localStorage.setItem('autoFarmItems', JSON.stringify(items));
    localStorage.setItem('autoFarmIncome', autoFarmIncome.toString());
  }, [points, items, autoFarmIncome]);

  const addCoins = (coins: number) => {
    setPoints(prevPoints => prevPoints + coins);
  };

  // Основной useEffect для постоянного обновления дохода
  useEffect(() => {
    // Получаем время последнего обновления из localStorage
    const lastUpdateTime = Number(localStorage.getItem('lastUpdateTime')) || Date.now();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = (now - lastUpdateTime) / 1000; // Прошло время в секундах

      let totalIncome = 0;
      items.forEach(item => {
        totalIncome += item.incomePerHour * (timeElapsed / 3600); // Доход за прошедшее время
      });

      setAutoFarmIncome(totalIncome);
      addCoins(totalIncome);

      // Сохраняем текущее время в localStorage
      localStorage.setItem('lastUpdateTime', now.toString());
    }, 1000);

    return () => clearInterval(interval);
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
        <span className="income-text"> монет в час</span>
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