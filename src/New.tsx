import React from 'react';
import './New.css';

interface NewProps {
  onBonusReceived: () => void;
}

const New: React.FC<NewProps> = ({ onBonusReceived }) => {
  return (
    <div className="new-container">
      <div className="new-message">
        <h1>Приветственный бонус</h1>
        <p>Вы получили 1000 монет !</p>
        <button onClick={onBonusReceived}>Забрать</button> {/* Кнопка для получения бонуса */}
      </div>
    </div>
  );
};

export default New;
