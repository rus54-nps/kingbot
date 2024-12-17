import React, { useState, useEffect } from 'react';
import './Shop.css';
import { item1, item2, item3, coin, tapImages, tapHighLevelImage } from './images'; // Подключаем нужные изображения
import { useLanguage } from './LanguageContext';

interface ShopItem {
  id: number;
  name: string;
  price: number;
  image: string;
  level: number;
  regenerationRate: number;
  nextPrice: number;
}

const itemNames = {
  tap: { ru: 'Тап lvl 1', en: 'Tap lvl 1' },
  energy: { ru: 'Энергия lvl 1', en: 'Energy lvl 1' },
  regen: { ru: 'Реген lvl 1', en: 'Regen lvl 1' },
};

const Shop: React.FC<{
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  setEnergyRecoveryRate: React.Dispatch<React.SetStateAction<number>>;
  setMaxEnergy: React.Dispatch<React.SetStateAction<number>>;
  setPointsToAdd: React.Dispatch<React.SetStateAction<number>>;
}> = ({ points, setPoints, setCurrentPage, setEnergyRecoveryRate, setMaxEnergy, setPointsToAdd }) => {
  const [items, setItems] = useState<ShopItem[]>([
    { id: 1, name: 'tap', price: 3000, image: item1, level: 1, regenerationRate: 1, nextPrice: 6000},
    { id: 2, name: 'energy', price: 2500, image: item2, level: 1, regenerationRate: 500, nextPrice: 5000},
    { id: 3, name: 'regen', price: 2500, image: item3, level: 1, regenerationRate: 1, nextPrice: 5000},
  ]);

  const { language } = useLanguage();

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
            // Убираем изменение name
            image: item.id === 1 ? getTapImageByLevel(newLevel) : item.image, // Устанавливаем изображение для "Тап"
          };
        }
        return item;
      });

      setItems(updatedItems);
      setPoints(points - itemToPurchase.price);
      localStorage.setItem('shop-items', JSON.stringify(updatedItems));

      alert(`{language === 'ru' ? 'Вы купили' : 'You bought'} ${itemToPurchase.name}! ${language === 'ru' ? 'Новый уровень' : 'New level'}: ${itemToPurchase.level + 1}`);
    } else {
      alert(language === 'ru' ? 'Недостаточно очков для покупки!' : 'Not enough points to buy!');
    }
  };

  return (
    <div className="Shp shop-overlay">
      <h2 className="shop-title">{language === 'ru' ? 'Магазин' : 'Shop'}</h2>
        <div className="balance">
          <img src={coin} alt="Coin" width={20} height={20} />
          <span>{Math.floor(points)}</span>
        </div>
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
                <h3>
  {itemNames[item.name as keyof typeof itemNames][language].split(' lvl')[0]} lvl {item.level}
</h3>



                  <p>{language === 'ru' ? 'Цена' : 'Price'}: {item.price} <img src={coin} alt="Coin" width={16} height={16} /></p>
                  <button onClick={() => handlePurchase(item.id)}>{language === 'ru' ? 'Купить' : 'Buy'}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className="shop-back-button" onClick={() => setCurrentPage('home')}>{language === 'ru' ? 'Назад' : 'Back'}</button>
    </div>
  );
};

export default Shop;
