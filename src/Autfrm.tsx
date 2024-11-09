import React, { useState, useEffect } from 'react';
import './Autfrm.css';
import { item1, item2, item3, coin, bl, per } from './images';

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
    { id: 1, name: 'Золотые Руки', price: 5000, image: item1, level: 0, description: '0 монет в час', incomePerHour: 2000, priceIncreaseFactor: 1.4, incomeIncrease: 150 },
    { id: 2, name: 'Счастливая Монета', price: 8000, image: item2, level: 0, description: '0 монет в час', incomePerHour: 3000, priceIncreaseFactor: 1.45, incomeIncrease: 150 },
    { id: 3, name: 'Богатый Урожай', price: 10000, image: item3, level: 0, description: '0 монет в час', incomePerHour: 5000, priceIncreaseFactor: 1.5, incomeIncrease: 200 },
    { id: 4, name: 'Дар Судьбы', price: 12000, image: bl, level: 0, description: '0 монет в час', incomePerHour: 4500, priceIncreaseFactor: 1.55, incomeIncrease: 250 },
    { id: 5, name: 'Охотник за Сокровищами', price: 16000, image: per, level: 0, description: '0 монет в час', incomePerHour: 6500, priceIncreaseFactor: 1.6, incomeIncrease: 300 },
  ]);

  const [autoFarmIncome, setAutoFarmIncome] = useState(0);

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
    return () => clearInterval(interval);
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
