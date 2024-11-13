import React, { useState, useEffect } from 'react';
import './Setting.css';

interface SettingProps {
  onClose: () => void;
}

const Setting: React.FC<SettingProps> = ({ onClose }) => {
  // Инициализация значений из localStorage или значениями по умолчанию
  const [isBackgroundSoundOn, setIsBackgroundSoundOn] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem('isBackgroundSoundOn') || 'true')
  );
  const [volume, setVolume] = useState<number>(() =>
    parseFloat(localStorage.getItem('volume') || '0.5')
  );
  const [audio] = useState(new Audio('fon.mp3')); // создаем аудио объект один раз

  const [isCoinSoundOn, setIsCoinSoundOn] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem('isCoinSoundOn') || 'true')
  );
  const [areNotificationsOn, setAreNotificationsOn] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem('areNotificationsOn') || 'true')
  );
  const [isLanguageSettingOn, setIsLanguageSettingOn] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem('isLanguageSettingOn') || 'false')
  );

  // Эффект для управления фоновым звуком
  useEffect(() => {
    audio.volume = volume;
    audio.loop = true;

    if (isBackgroundSoundOn) {
      audio.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isBackgroundSoundOn, volume, audio]);

  // Эффект для сохранения всех настроек в localStorage
  useEffect(() => {
    localStorage.setItem('isBackgroundSoundOn', JSON.stringify(isBackgroundSoundOn));
    localStorage.setItem('volume', volume.toString());
    localStorage.setItem('isCoinSoundOn', JSON.stringify(isCoinSoundOn));
    localStorage.setItem('areNotificationsOn', JSON.stringify(areNotificationsOn));
    localStorage.setItem('isLanguageSettingOn', JSON.stringify(isLanguageSettingOn));
  }, [isBackgroundSoundOn, volume, isCoinSoundOn, areNotificationsOn, isLanguageSettingOn]);

  // Обработчик для изменения громкости
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
              onChange={() => setIsBackgroundSoundOn(!isBackgroundSoundOn)} // Переключение состояния
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
            <input
              type="checkbox"
              checked={isCoinSoundOn}
              onChange={() => setIsCoinSoundOn(!isCoinSoundOn)}
            />
          </label>
          <label>
            <span>Уведомления:</span>
            <input
              type="checkbox"
              checked={areNotificationsOn}
              onChange={() => setAreNotificationsOn(!areNotificationsOn)}
            />
          </label>
          <label>
            <span>Язык:</span>
            <input
              type="checkbox"
              checked={isLanguageSettingOn}
              onChange={() => setIsLanguageSettingOn(!isLanguageSettingOn)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Setting;
