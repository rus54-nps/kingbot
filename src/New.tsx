import React from 'react';
import './New.css';
import { useLanguage } from './LanguageContext';

interface NewProps {
  onBonusReceived: () => void;
}

const New: React.FC<NewProps> = ({ onBonusReceived }) => {

  const { language } = useLanguage();

  return (
    <div className="new-container">
      <div className="new-message">
        <h1>{language === 'ru' ? 'Приветственный бонус' : 'Welcome Bonus'}</h1>
        <p>{language === 'ru' ? 'Вы получили 2500 монет' : 'You have received 2500 coins'} !</p>
        <button onClick={onBonusReceived}>{language === 'ru' ? 'Забрать' : 'Pick up'}</button> {/* Кнопка для получения бонуса */}
      </div>
    </div>
  );
};

export default New;
