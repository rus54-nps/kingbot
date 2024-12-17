import React from 'react';
import './Setting.css';
import { useLanguage } from './LanguageContext';

// Подключим иконки флагов
import {ruFlag, enFlag} from './images'

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
          {/* Переключатель языка с флагами */}
          <label>
            <span>{language === 'ru' ? 'Язык:' : 'Language:'}</span>
            <div className="language-switch">
              <img 
                src={ruFlag} 
                alt="Russian" 
                onClick={() => toggleLanguage('ru')} 
                style={{ border: language === 'ru' ? '2px solid #fff' : 'none' }} 
              />
              <img 
                src={enFlag} 
                alt="English" 
                onClick={() => toggleLanguage('en')} 
                style={{ border: language === 'en' ? '2px solid #fff' : 'none' }} 
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Setting;
