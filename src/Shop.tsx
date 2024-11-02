import React, { useState, useEffect } from 'react';
import './Shop.css';
import { item1, item2, item3, coin, tapImages, tapHighLevelImage } from './images'; // Подключаем нужные изображения

interface ShopItem {
  id: number;
  name: string;
  price: number;
  image: string;
  level: number;
  regenerationRate: number;
  nextPrice: number;
  description: string;
}

const Shop: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  setEnergyRecoveryRate: React.Dispatch<React.SetStateAction<number>>;
  setMaxEnergy: React.Dispatch<React.SetStateAction<number>>;
  setPointsToAdd: React.Dispatch<React.SetStateAction<number>>;
  setAchievement: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ points, setPoints, setCurrentPage, setEnergyRecoveryRate, setMaxEnergy, setPointsToAdd,setAchievement }) => {
  const [items, setItems] = useState<ShopItem[]>([
    { id: 1, name: 'Тап lvl 1', price: 3000, image: item1, level: 1, regenerationRate: 1, nextPrice: 6000, description: 'Монеты за Тап: 1' },
    { id: 2, name: 'Энергия lvl 1', price: 2500, image: item2, level: 1, regenerationRate: 500, nextPrice: 5000, description: 'Начальное количество энергии: 500' },
    { id: 3, name: 'Реген lvl 1', price: 2500, image: item3, level: 1, regenerationRate: 1, nextPrice: 5000, description: 'Восстановление энергии: 1 в секунду' },
  ]);

  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem('shop-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shop-items', JSON.stringify(items));
  }, [items]);

  // Функция для получения изображения уровня "Тап"
  const getTapImageByLevel = (level: number): string => {
    return level <= 9 ? tapImages[level - 1] : tapHighLevelImage;
  };

  const handlePurchase = (itemId: number) => {
    const itemToPurchase = items.find(item => item.id === itemId);
    if (itemToPurchase && points >= itemToPurchase.price) {
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          const newLevel = item.level + 1;
          let newPrice = item.price * 2;
          let newRegenerationRate = item.regenerationRate;

          if (itemId === 1) {
            setPointsToAdd(newLevel);
            localStorage.setItem('pointsToAdd', newLevel.toString()); // Сохранение уровня "Тап"

            if (newLevel === 5) {
              setAchievement('Сила Тапа'); // Устанавливаем достижение
              alert('Достижение получено: Сила Тапа!'); // Уведомляем пользователя
            }
          }

          if (itemId === 2) {
            setMaxEnergy(prevMax => {
              const newMaxEnergy = prevMax + 500;
              localStorage.setItem('maxEnergy', newMaxEnergy.toString()); // Сохранение макс. энергии
              return newMaxEnergy;
            });
          }

          if (itemId === 3) {
            switch (newLevel) {
              case 2:
                newPrice = 5000;
                newRegenerationRate = 2;
                break;
              case 3:
                newPrice = 20000;
                newRegenerationRate = 3;
                break;
              case 4:
                newPrice = 50000;
                newRegenerationRate = 4;
                break;
              case 5:
                newPrice = 120000;
                newRegenerationRate = 5;
                break;
              default:
                break;
            }
            setEnergyRecoveryRate(newRegenerationRate);
            localStorage.setItem('energyRecoveryRate', newRegenerationRate.toString()); // Сохранение регенерации
          }

          return {
            ...item,
            level: newLevel,
            regenerationRate: newRegenerationRate,
            price: newPrice,
            name: `${item.name.split(' lvl')[0]} lvl ${newLevel}`,
            image: item.id === 1 ? getTapImageByLevel(newLevel) : item.image, // Устанавливаем изображение для "Тап"
          };
        }
        return item;
      });

      setItems(updatedItems);
      setPoints(points - itemToPurchase.price);
      localStorage.setItem('shop-items', JSON.stringify(updatedItems));

      alert(`Вы купили ${itemToPurchase.name}! Новый уровень: ${itemToPurchase.level + 1}`);
    } else {
      alert('Недостаточно очков для покупки!');
    }
  };

  const handleToggleDescription = (itemId: number) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
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
                  {expandedItemId === item.id ? (
                    <p>{item.description}</p>
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
