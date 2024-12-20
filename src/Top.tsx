import React, { useEffect, useState } from 'react';
import './Top.css';
import { ava1, ava2, ava3, ava4, ava5, ava6 } from './images';
import { useLanguage } from './LanguageContext';

interface Player {
  rank: number;
  name: string;
  avatar: string;
  coins: number;
  growthRate: number; // Модификатор роста монет
  
}

interface TopProps {
  setCurrentPage: (page: string) => void;
  playerCoins: number; // Количество монет у текущего игрока
  selectedIcon: string; // Аватар текущего игрока
}

const Top: React.FC<TopProps> = ({ setCurrentPage, playerCoins, selectedIcon }) => {
  const initialPlayers: Player[] = [
    { rank: 1, name: 'Tifer', avatar: ava1, coins: 6068, growthRate: 1.45 },
    { rank: 2, name: 'Smuzi', avatar: ava2, coins: 5601, growthRate: 1.43 },
    { rank: 3, name: 'IIIyxep', avatar: ava3, coins: 4052, growthRate: 1.44 },
    { rank: 4, name: 'qwerty', avatar: ava4, coins: 4901, growthRate: 1.46 },
    { rank: 5, name: 'OtVaL', avatar: ava5, coins: 4835, growthRate: 1.42 },
    { rank: 6, name: 'Invoker', avatar: ava6, coins: 3721, growthRate: 1.46 },
  ];

  const [topPlayers, setTopPlayers] = useState<Player[]>(initialPlayers);

  const { language } = useLanguage();

  // Функция для обновления монет ботов в зависимости от монет игрока
  const updateBotCoins = (playerCoins: number): Player[] => {
    return initialPlayers.map((player) => {
      // Боты увеличивают свои монеты на 15-30% от монет игрока
      const randomFactor = 1 + Math.random() * (0.30 - 0.15) + 0.15; // Коэффициент от 15% до 30%
      const newCoins = Math.round(playerCoins * randomFactor);
      return { ...player, coins: newCoins };
    });
  };


  useEffect(() => {
    const updatePlayerRanks = () => {
      const currentPlayerName = language === 'ru' ? 'Вы' : 'You'; 
      const player: Player = {
        rank: 0, // Ранг будет обновлен
        name: currentPlayerName, // Имя текущего игрока
        avatar: selectedIcon,
        coins: playerCoins,
        growthRate: 1, // Текущий игрок имеет фиксированный рост
      };

      // Обновляем монеты ботов
      const updatedBots = updateBotCoins(playerCoins);

      // Создаем список всех игроков (включая текущего)
      const playersWithCurrent = [player, ...updatedBots];

      // Сортируем всех игроков по монетам
      playersWithCurrent.sort((a, b) => b.coins - a.coins);

      // Обновляем ранги игроков
      playersWithCurrent.forEach((p, index) => {
        p.rank = index + 1;
      });

      setTopPlayers(playersWithCurrent);
    };

    // Первое обновление при монтировании
    updatePlayerRanks();

    // Устанавливаем интервал обновления раз в час
    const interval = setInterval(updatePlayerRanks, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [playerCoins, selectedIcon]); // Зависимость от монет и аватара игрока

  // Функция для форматирования монет
  const formatCoins = (coins: number): string => {
    if (coins >= 1000000) {
      return `${(coins / 1000000).toFixed(0)} млн`; // Отображать в миллионах
    } else if (coins >= 1000) {
      return `${(coins / 1000).toFixed(0)} тыс.`; // Отображать в тысячах
    } else {
      return coins.toLocaleString(); // Для чисел меньше тысячи
    }
  };

  return (
    <div className="top-container">
      <h1 className="top-title">{language === 'ru' ? 'Топ игроков' : 'Top players'}</h1>
      <ul className="top-list">
        {topPlayers.map((player) => {
          const currentPlayerName = language === 'ru' ? 'Вы' : 'You'; 
          const isCurrentPlayer = player.name === currentPlayerName;
          return (
            <li
              key={isCurrentPlayer ? 'current-player' : player.rank}
              className={`top-player ${isCurrentPlayer ? 'current-player' : ''}`}
            >
              <div className="player-info">
                <img src={player.avatar} alt={player.name} className="player-avatar" />
                <span className="player-name">{player.name}</span>
              </div>
              <span className="player-coins">{formatCoins(player.coins)} монет</span>
            </li>
          );
        })}
      </ul>

      <button className="achievements-back-button" onClick={() => setCurrentPage('home')}>
      {language === 'ru' ? 'Назад' : 'Back'}
      </button>
    </div>
    
  );
};

export default Top;
