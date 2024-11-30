import React from 'react';
import './Setting.css';

/**
 * @typedef {Object} SettingProps
 * @property {() => void} onClose
 * @property {() => void} toggleMusic
 * @property {boolean} isMusicOn
 * @property {() => void} toggleCoinSound
 * @property {boolean} isCoinSoundOn
 */

/**
 * @param {SettingProps} props
 */

const Setting = ({ onClose, toggleMusic, isMusicOn, toggleCoinSound, isCoinSoundOn, }) => {
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
            <input type="checkbox" checked={isMusicOn} onChange={toggleMusic} />
          </label>
          <label>
            <span>Звук монеты:</span>
            <input type="checkbox" checked={isCoinSoundOn} onChange={toggleCoinSound} />
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