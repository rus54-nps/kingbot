import React from 'react';
import './Top.css';

interface Player {
  rank: number;
  name: string;
  avatar: string;
}

interface TopProps {
  setCurrentPage: (page: string) => void;
}

const Top: React.FC<TopProps> = ({ setCurrentPage }) => {
  const topPlayers: Player[] = [
    { rank: 1, name: 'Legend', avatar: 'p1' },
    { rank: 2, name: 'Champion', avatar: 'p2' },
    { rank: 3, name: 'Warrior', avatar: 'p3' },
    { rank: 4, name: 'Hunter', avatar: 'p4' },
    { rank: 5, name: 'Rogue', avatar: 'p5' },
    { rank: 6, name: 'Paladin', avatar: 'p6' },
  ];

  return (
    <div className="top-container">
      <h1 className="top-title">Топ игроков</h1>
      <ul className="top-list">
        {topPlayers.map((player) => (
          <li key={player.rank} className="top-player">
            <div className="player-rank">{player.rank}</div>
            <img
              src={`images/${player.avatar}.png`}
              alt={player.name}
              className="player-avatar"
            />
            <span className="player-name">{player.name}</span>
          </li>
        ))}
      </ul>
      <button className="achievements-back-button" onClick={() => setCurrentPage('home')}>Назад</button>
    </div>
  );
};

export default Top;
