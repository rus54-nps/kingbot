// Setting.tsx
import React from 'react';
import './Setting.css';

interface SettingProps {
  onClose: () => void;
}

const Setting: React.FC<SettingProps> = ({ onClose }) => {
  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>Настройки</h2>
        <div className="settings-content">
          <label>
            <span>Звук:</span>
            <input type="checkbox" />
          </label>
          <label>
            <span>Уведомления:</span>
            <input type="checkbox" />
          </label>
          <label>
            <span>Темная тема:</span>
            <input type="checkbox" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Setting;
