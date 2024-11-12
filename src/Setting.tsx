import React from 'react';
import './Setting.css';

interface SettingProps {
  onClose: () => void;
  toggleMusic: () => void;
  isMusicPlaying: boolean;
}

const Setting: React.FC<SettingProps> = ({ onClose, toggleMusic, isMusicPlaying }) => {
  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>Настройки</h2>
        <div className="settings-content">
          <label>
            <span>Звук фона:</span>
            <input type="checkbox" checked={isMusicPlaying} onChange={toggleMusic} />
          </label>
          <label>
            <span>Звук монеты:</span>
            <input type="checkbox" />
          </label>
          <label>
            <span>Уведомления:</span>
            <input type="checkbox" />
          </label>
          <label>
            <span>Язык:</span>
            <input type="checkbox" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Setting;
