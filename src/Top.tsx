import React, { useEffect, useState } from 'react';
import './Top.css';
import { ava1, ava2, ava3, ava4, ava5, ava6 } from './images';

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

const Top: React.FC<TopProps> = ({ setCurrentPage, playerCoins }) => {
  const initialPlayers: Player[] = [
    { rank: 1, name: 'Legend', avatar: ava1, coins: 7000, growthRate: 1.45 },
    { rank: 2, name: 'Champion', avatar: ava2, coins: 6500, growthRate: 1.43 },
    { rank: 3, name: 'Warrior', avatar: ava3, coins: 6000, growthRate: 1.44 },
    { rank: 4, name: 'Hunter', avatar: ava4, coins: 5500, growthRate: 1.46 },
    { rank: 5, name: 'Rogue', avatar: ava5, coins: 5000, growthRate: 1.42 },
    { rank: 6, name: 'Paladin', avatar: ava6, coins: 4500, growthRate: 1.46 },
  ];

  const [topPlayers, setTopPlayers] = useState<Player[]>(initialPlayers);

  // Функция обновления монет у ботов
  const updatePlayerRanks = () => {
    const updatedPlayers = initialPlayers.map((player) => ({
      ...player,
      coins: Math.ceil(playerCoins * 1.2 * player.growthRate), // Минимум на 20% больше игрока
    }));

    // Сортируем игроков по количеству монет
    updatedPlayers.sort((a, b) => b.coins - a.coins);

    // Обновляем ранги
    updatedPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });

    setTopPlayers(updatedPlayers);
  };

  // Проверка и обновление монет раз в сутки
  useEffect(() => {
    const lastUpdate = localStorage.getItem('lastUpdate');
    const now = Date.now();

    if (!lastUpdate || now - parseInt(lastUpdate) > 24 * 60 * 60 * 1000) {
      localStorage.setItem('lastUpdate', now.toString());
      updatePlayerRanks(); // Обновляем ботов, если прошло 24 часа
    }

    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('lastUpdate');
      const now = Date.now();

      if (!lastUpdate || now - parseInt(lastUpdate) > 20 * 1000) {
        localStorage.setItem('lastUpdate', now.toString());
        updatePlayerRanks();
      }
    }, 60 * 1000); // Проверка каждую минуту

    return () => clearInterval(interval);
  }, [playerCoins]);

  return (
    <div className="top-container">
      <h1 className="top-title">Топ игроков</h1>
      <ul className="top-list">
        {topPlayers.map((player) => (
          <li key={player.rank} className="top-player">
            <div className="player-info">
              <div className="player-rank">#{player.rank}</div>
              <img src={player.avatar} alt={player.name} className="player-avatar" />
              <span className="player-name">{player.name}</span>
            </div>
            <span className="player-coins">{player.coins.toLocaleString()} монет</span>
          </li>
        ))}
      </ul>

      <button className="achievements-back-button" onClick={() => setCurrentPage('home')}>
        Назад
      </button>
    </div>
  );
};

export default Top;
