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
  incomePerHour: number;  // Доход в час
}

const AutoFarm: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}> = ({ points, setPoints, setCurrentPage }) => {
  const [items, setItems] = useState<AutoFarmItem[]>([
    { id: 1, name: 'Золотые Руки', price: 3000, image: item1, level: 1, description: '0 монет в час.', incomePerHour: 0 },
    { id: 2, name: 'Счастливая Монета', price: 2500, image: item2, level: 1, description: '330 монет в час.', incomePerHour: 330 },
    { id: 3, name: 'Счастливая Монета', price: 2500, image: item3, level: 1, description: '330 монет в час.', incomePerHour: 500 },
  ]);
  const [autoFarmIncome, setAutoFarmIncome] = useState(0); // Хранение текущего дохода от автофарма

  // Функция для добавления монет с округлением
  const addCoins = (coins: number) => {
    setPoints(prevPoints => Math.floor(prevPoints + coins)); // Округляем до целого числа
  };

  // Рассчитываем доход от автофарма
  useEffect(() => {
    const interval = setInterval(() => {
      let totalIncome = 0;
      items.forEach(item => {
        // Суммируем доход от всех активных предметов
        totalIncome += item.incomePerHour * (1 / 3600); // Доход в секунду
      });
      setAutoFarmIncome(totalIncome); // Обновляем доход от автофарма
      addCoins(totalIncome); // Прибавляем монеты к балансу
    }, 1000); // Запускать каждую секунду

    return () => clearInterval(interval); // Очистка интервала при демонтировании компонента
  }, [items]); // Завязываем на изменения в items, чтобы доход обновлялся при изменении предметов

  const handlePurchase = (itemId: number) => {
    const itemToPurchase = items.find(item => item.id === itemId);
    if (itemToPurchase && points >= itemToPurchase.price) {
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          const newLevel = item.level + 1;
          let newPrice = item.price * 2;

          // Увеличиваем доход в зависимости от уровня
          let newIncome = item.incomePerHour;
          if (newLevel === 2) {
            newIncome = item.id === 1 ? 3600 : item.incomePerHour; // Для Золотых Рук доход становится 3600 монет в час
          } else if (newLevel === 3) {
            newIncome += item.id === 1 ? 100 : 110; // Для других предметов увеличиваем доход
          }

          return {
            ...item,
            level: newLevel,
            price: newPrice,
            incomePerHour: newIncome,
            description: `${newIncome} монет в час.`, // Описание обновляется в зависимости от уровня
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
        <span>{Math.floor(points)}</span> {/* Отображаем только целые монеты */}
      </div>

      {/* Добавим строку с доходом от автофарма */}
      <div className="autofarm-income">
        <img src={coin} alt="Coin" width={20} height={20} />
        <span>{Math.floor(autoFarmIncome)}</span> {/* Показываем доход от автофарма */}
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
                <h3>{item.name}</h3> {/* Название товара без уровня */}
                <p>{item.description}</p>
                <button className="buy-button" onClick={() => handlePurchase(item.id)}>
                  <img src={coin} alt="Coin" width={16} height={16} />
                  {item.price} {/* Цена товара */}
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
