import React, { useState, useEffect } from 'react';
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
  description: string; // Описание товара
}

const Shop: React.FC<{ points: number; setPoints: React.Dispatch<React.SetStateAction<number>>; setCurrentPage: React.Dispatch<React.SetStateAction<string>> }> = ({ points, setPoints, setCurrentPage }) => {
  const [items, setItems] = useState<ShopItem[]>([
    { id: 1, name: 'Тап lvl 1', price: 100, image: item1, level: 1, regenerationRate: 1, nextPrice: 0, description: 'Монеты за Тап: 1' },
    { id: 2, name: 'Энергия lvl 1', price: 20, image: item2, level: 1, regenerationRate: 500, nextPrice: 0, description: 'Начальное количество энергии: 500' },
    { id: 3, name: 'Реген lvl 1', price: 100, image: item3, level: 1, regenerationRate: 1, nextPrice: 5000, description: 'Специальный предмет для восстановления энергии' },
  ]);

  const [expandedItemId, setExpandedItemId] = useState<number | null>(null); // Состояние для отслеживания открытого товара

  // Загрузка уровней из localStorage при первой загрузке компонента
  useEffect(() => {
    const savedItems = localStorage.getItem('shop-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  const handlePurchase = (itemId: number) => {
    const itemToPurchase = items.find(item => item.id === itemId);
    if (itemToPurchase && points >= itemToPurchase.price) {
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          const newLevel = item.level + 1; // Увеличиваем уровень на 1
          let newPrice = item.price * 2; // Увеличиваем цену в 2 раза
          let newRegenerationRate = item.regenerationRate;

          // Обновляем скорость восстановления для "Энергия"
          if (itemId === 2) {
            newRegenerationRate = item.regenerationRate + 500; // Каждое улучшение увеличивает на 500 энергии
          }

          return { 
            ...item, 
            level: newLevel, // Устанавливаем новый уровень
            regenerationRate: newRegenerationRate, 
            price: newPrice,
            name: `${item.name.split(' lvl')[0]} lvl ${newLevel}` // Обновляем название с новым уровнем
          };
        }
        return item;
      });
      setItems(updatedItems);
      setPoints(points - itemToPurchase.price); // Вычитаем стоимость

      // Сохраняем обновленные предметы в localStorage
      localStorage.setItem('shop-items', JSON.stringify(updatedItems));

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
                  {expandedItemId === item.id ? ( // Показываем описание и скрываем кнопку
                    <>
                      <p>{item.description}</p>
                    </>
                  ) : (
                    <>
                      <p>Цена: {item.price} <img src={coin} alt="Coin" width={16} height={16} /></p>
                      <button onClick={() => handlePurchase(item.id)}>Купить</button>
                    </>
                  )}
                </div>
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
