import React, { useState, useEffect } from 'react';
import './Autfrm.css';
import { item1, item2, item3, coin } from './images'; // Подключаем изображения

interface AutoFarmItem {
  id: number;
  name: string;
  price: number;
  image: string;
  level: number;
  description: string;
  incomePerHour: number;
}

const AutoFarm: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}> = ({ points, setPoints, setCurrentPage }) => {
  const [items, setItems] = useState<AutoFarmItem[]>(() => {
    const savedItems = localStorage.getItem('autoFarmItems');
    return savedItems ? JSON.parse(savedItems) : [
      { id: 1, name: 'Золотые fff Руки', price: 5000, image: item1, level: 0, description: '0 монет в час', incomePerHour: 0 },
      { id: 2, name: 'Счастливая fff Монета', price: 8000, image: item2, level: 0, description: '0 монет в час', incomePerHour: 0 },
      { id: 3, name: 'Богатый fff урожай', price: 10000, image: item3, level: 0, description: '0 монет в час', incomePerHour: 0 },
      { id: 4, name: 'Дар fff судьбы', price: 12000, image: item3, level: 0, description: '0 монет в час', incomePerHour: 0 },
      { id: 5, name: 'Охотник fff за сокровищами', price: 16000, image: item3, level: 0, description: '0 монет в час', incomePerHour: 0 },
    ];
  });
  const [autoFarmIncome, setAutoFarmIncome] = useState(0);

  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('autoFarmItems', JSON.stringify(items));
  }, [items]);

  const addCoins = (coins: number) => {
    setPoints(prevPoints => Math.floor(prevPoints + coins));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let totalIncome = 0;
      items.forEach(item => {
        if (item.level > 0) {
          totalIncome += item.incomePerHour * (1 / 3600);
        }
      });
      setAutoFarmIncome(totalIncome);
      addCoins(totalIncome);
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  const handlePurchase = (itemId: number) => {
    const itemToPurchase = items.find(item => item.id === itemId);
    if (itemToPurchase && points >= itemToPurchase.price) {
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          const newLevel = item.level + 1;
          let newPrice = item.price;
          let newIncome = item.incomePerHour;

          if (item.id === 1) { // Настройки для "Золотые Руки"
            newPrice = Math.floor(item.price * 1.4);
            newIncome = 2000 + (newLevel - 1) * 150;
          } else if (item.id === 2) { // Настройки для "Счастливая Монета"
            newPrice = Math.floor(item.price * 1.45);
            newIncome = 3000 + (newLevel - 1) * 200;
          } else if (item.id === 3) { // Настройки для "Богатый урожай"
            newPrice = Math.floor(item.price * 1.5);
            newIncome = 4000 + (newLevel - 1) * 250;
          } else if (item.id === 4) { // Настройки для "Дар судьбы"
            newPrice = Math.floor(item.price * 1.55);
            newIncome = 5000 + (newLevel - 1) * 300;
          } else if (item.id === 5) { // Настройки для "Охотник"
            newPrice = Math.floor(item.price * 1.6);
            newIncome = 6000 + (newLevel - 1) * 350;
          }

          return {
            ...item,
            level: newLevel,
            price: newPrice,
            incomePerHour: newIncome,
            description: `${newIncome} монет в час.`,
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
        <span>{Math.floor(autoFarmIncome)}</span>
        <span>монет в час</span>
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
