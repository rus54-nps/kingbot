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
}

const Top: React.FC<TopProps> = ({ setCurrentPage, playerCoins }) => {
  const initialPlayers: Player[] = [
    { rank: 1, name: 'Legend', avatar: ava1, coins: 7000, growthRate: 1.2 },
    { rank: 2, name: 'Champion', avatar: ava2, coins: 6500, growthRate: 1.15 },
    { rank: 3, name: 'Warrior', avatar: ava3, coins: 6000, growthRate: 1.1 },
    { rank: 4, name: 'Hunter', avatar: ava4, coins: 5500, growthRate: 1.08 },
    { rank: 5, name: 'Rogue', avatar: ava5, coins: 5000, growthRate: 1.12 },
    { rank: 6, name: 'Paladin', avatar: ava6, coins: 4500, growthRate: 1.05 },
  ];

  const [topPlayers, setTopPlayers] = useState<Player[]>([]);

  // Загрузка данных из localStorage или использование начальных значений
  const loadPlayers = (): Player[] => {
    const savedPlayers = localStorage.getItem('topPlayers');
    if (savedPlayers) {
      return JSON.parse(savedPlayers) as Player[];
    }
    return initialPlayers;
  };

  // Сохранение данных в localStorage
  const savePlayers = (players: Player[]) => {
    localStorage.setItem('topPlayers', JSON.stringify(players));
  };

  // Обновление данных ботов
  const updateBotRanks = () => {
    setTopPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((player) => {
        const isPlayer = player.name === 'Вы';
  
        // Для ботов увеличиваем монеты на основе монет игрока
        if (!isPlayer) {
          const playerBoost = playerCoins * (1.15 + Math.random() * 0.15); // 15%-30% больше монет игрока
          return { ...player, coins: Math.max(player.coins, playerBoost) }; // Увеличиваем только вверх
        }
  
        return player; // Игрока не трогаем
      });
  
      // Сортируем игроков по количеству монет (убывание)
      const sortedPlayers = [...updatedPlayers].sort((a, b) => b.coins - a.coins);
  
      // Обновляем ранги на основе сортировки
      sortedPlayers.forEach((player, index) => {
        player.rank = index + 1;
      });
  
      savePlayers(sortedPlayers);
      return sortedPlayers;
    });
  };
  
  

  useEffect(() => {
    // Загрузка начальных игроков
    setTopPlayers(loadPlayers());

    // Устанавливаем интервал обновления каждые 20 секунд
    const interval = setInterval(updateBotRanks, 2000);

    return () => clearInterval(interval);
  }, [playerCoins]); // Обновление, если изменились монеты игрока

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
