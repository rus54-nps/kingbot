// src/Setting.tsx
import React from 'react';
import './Setting.css';
import { useLanguage } from './LanguageContext';

interface SettingProps {
  onClose: () => void;
  toggleMusic: () => void;
  isMusicOn: boolean;
  toggleCoinSound: () => void;
  isCoinSoundOn: boolean;
}

const Setting: React.FC<SettingProps> = ({ onClose, toggleMusic, isMusicOn, toggleCoinSound, isCoinSoundOn }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>{language === 'ru' ? 'Настройки' : 'Settings'}</h2>
        <div className="settings-content">
          <label>
            <span>{language === 'ru' ? 'Звук фона:' : 'Background sound:'}</span>
            <input type="checkbox" checked={isMusicOn} onChange={toggleMusic} />
          </label>
          <label>
            <span>{language === 'ru' ? 'Звук монеты:' : 'Coin sound:'}</span>
            <input type="checkbox" checked={isCoinSoundOn} onChange={toggleCoinSound} />
          </label>
          <label>
            <span>{language === 'ru' ? 'Уведомления:' : 'Notifications:'}</span>
            <input type="checkbox" />
          </label>
          <label>
            <span>{language === 'ru' ? 'Язык (русский/английский):' : 'Language (Russian/English):'}</span>
            <button onClick={toggleLanguage}>
              {language === 'ru' ? 'Переключить на Английский' : 'Switch to Russian'}
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Setting;
