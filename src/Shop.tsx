import React, { useState } from 'react';
import './Shop.css';
import { item1, item2, item3, coin } from './images';

interface ShopItem {
  id: number;
  name: string;
  price: number;
  image: string;
  level: number; // Уровень товара
  regenerationRate: number; // Количество энергии, восстанавливаемой в секунду
  nextPrice: number; // Цена для следующего уровня
}

const Shop: React.FC<{ points: number; setPoints: React.Dispatch<React.SetStateAction<number>>; setCurrentPage: React.Dispatch<React.SetStateAction<string>> }> = ({ points, setPoints, setCurrentPage }) => {
  const [items, setItems] = useState<ShopItem[]>([
    { id: 1, name: 'Тап lvl 1', price: 100, image: item1, level: 1, regenerationRate: 1, nextPrice: 0 },
    { id: 2, name: 'Энергия lvl 1', price: 100, image: item2, level: 1, regenerationRate: 1, nextPrice: 0 },
    { id: 3, name: 'Реген lvl 1', price: 100, image: item3, level: 1, regenerationRate: 1, nextPrice: 5000 }, // Начальная цена для улучшения
  ]);
  
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null); // Состояние для отслеживания открытого товара

  const handlePurchase = (itemId: number) => {
    const itemToPurchase = items.find(item => item.id === itemId);
    if (itemToPurchase && points >= itemToPurchase.price) {
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          const newLevel = item.level + 1;
          let newPrice = 0;
          let newRegenerationRate = item.regenerationRate;

          // Обновляем цену и скорость восстановления в зависимости от уровня
          if (newLevel === 2) {
            newPrice = 5000;
            newRegenerationRate = 2;
          } else if (newLevel === 3) {
            newPrice = 20000;
            newRegenerationRate = 3;
          } else if (newLevel === 4) {
            newPrice = 50000;
            newRegenerationRate = 4;
          } else if (newLevel === 5) {
            newPrice = 120000;
            newRegenerationRate = 5;
          } else if (newLevel === 6 && points >= 1000000) { // Появляется только при 1 миллионе
            newPrice = 500000;
            newRegenerationRate = 10;
          } else {
            alert('Недостаточно монет для повышения уровня!');
            return item; // Если нет достаточно монет, возвращаем товар без изменений
          }

          return { ...item, level: newLevel, regenerationRate: newRegenerationRate, price: newPrice };
        }
        return item;
      });
      setItems(updatedItems);
      setPoints(points - itemToPurchase.price); // Вычитаем стоимость
      alert(`Вы купили ${itemToPurchase.name}! Теперь уровень: ${itemToPurchase.level + 1}, скорость восстановления: ${updatedItems.find(i => i.id === itemId)?.regenerationRate}`);
    } else {
      alert('Недостаточно очков для покупки!');
    }
  };

  const handleToggleDescription = (itemId: number) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId); // Переключаем видимость описания
  };

  return (
    <div className="shop-overlay">
      <h2 className="shop-title">Магазин</h2>
      <div className="shop-frame">
        <div className="shop-items-container">
          <ul className="shop-items">
            {items.map((item) => (
              <li key={item.id} className="shop-item">
                <div className="shop-item-image-container">
                  <img src={item.image} alt={item.name} className="shop-item-image" />
                  <p className="shop-item-level">lvl {item.level}</p>
                </div>
                <div className="shop-item-info">
                  <h3 onClick={() => handleToggleDescription(item.id)} style={{ cursor: 'pointer' }}>{item.name}</h3>
                  <p>Цена: {item.price} <img src={coin} alt="Coin" width={16} height={16} /></p>
                  {item.id === 3 && expandedItemId === item.id && ( // Показываем описание только для Реген lvl 1
                    <p>Скорость восстановления: {item.regenerationRate} энергии/с</p>
                  )}
                </div>
                <button onClick={() => handlePurchase(item.id)}>Купить</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="shop-back-button" onClick={() => setCurrentPage('home')}>Назад</button>
    </div>
  );
};

export default Shop;
