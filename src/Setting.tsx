import React, { useState, useEffect } from 'react';
import './Setting.css';

interface SettingProps {
  onClose: () => void;
}

const Setting: React.FC<SettingProps> = ({ onClose }) => {
  const [isBackgroundSoundOn, setIsBackgroundSoundOn] = useState(false);
  const [volume, setVolume] = useState(0.5); // начальный уровень громкости
  const [audio] = useState(new Audio('fon.mp3')); // Создаем аудио объект один раз

  useEffect(() => {
    // Устанавливаем громкость
    audio.volume = volume;
    
    // Устанавливаем цикл воспроизведения
    audio.loop = true;

    // Включаем или выключаем аудио в зависимости от состояния `isBackgroundSoundOn`
    if (isBackgroundSoundOn) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0; // Сбрасываем на начало
    }

    // Чистим звук при размонтировании компонента
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isBackgroundSoundOn, volume, audio]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

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
            <input
              type="checkbox"
              checked={isBackgroundSoundOn}
              onChange={() => setIsBackgroundSoundOn(!isBackgroundSoundOn)}
            />
          </label>
          {isBackgroundSoundOn && (
            <label>
              <span>Громкость:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </label>
          )}
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
