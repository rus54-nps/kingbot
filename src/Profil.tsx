import React, { useEffect, useState } from 'react';
import IconSelector from './IconSelector';
import './Profil.css';
import { useLanguage } from './LanguageContext';

type ProfilProps = {
  username: string;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  onBack: () => void;
};

const Profil: React.FC<ProfilProps> = ({ username, selectedIcon, setSelectedIcon, onBack }) => {
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [daysSinceFirstLogin, setDaysSinceFirstLogin] = useState(0);
  const [registrationDate, setRegistrationDate] = useState('');

   const { language } = useLanguage();

  useEffect(() => {
    const firstLoginDate = localStorage.getItem('firstLoginDate');
    if (!firstLoginDate) {
      const today = new Date().toISOString();
      localStorage.setItem('firstLoginDate', today);
      setRegistrationDate(new Date(today).toLocaleDateString());
      setDaysSinceFirstLogin(0);
    } else {
      const firstLogin = new Date(firstLoginDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - firstLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysSinceFirstLogin(diffDays);
      setRegistrationDate(firstLogin.toLocaleDateString());
    }
  }, []);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onBack(); // Закрываем вкладку
    }
  };

  return (
    <div className="profil-modal" onClick={handleOverlayClick}>
      {!showIconSelector ? (
        <div className="profil-container">
          <div className="profil-header">
            <h2>{language === 'ru' ? 'Профиль' : 'Profile'}</h2>
          </div>
          <div className="profil-content">
            <img
              src={selectedIcon}
              alt="User Avatar"
              className="avatar"
              onClick={() => setShowIconSelector(true)} // Открываем выбор иконки при клике
            />
            <ul className="profil-info-list">
              <li>
                <strong>{language === 'ru' ? 'Ник' : 'Name'}:</strong> {username}
              </li>
              <li>
                <strong>{language === 'ru' ? 'Количество дней в игре' : 'Days in the game'}:</strong> {daysSinceFirstLogin}
              </li>
              <li>
                <strong>{language === 'ru' ? 'Дата регистрации' : 'Date of registration'}:</strong> {registrationDate}
              </li>
            </ul>
          </div>
          <div className="profil-footer">
          </div>
        </div>
      ) : (
        <IconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={(icon) => {
            setSelectedIcon(icon);
            setShowIconSelector(false); // Закрываем IconSelector после выбора
          }}
          setCurrentPage={() => {}} // Не используем переход между страницами
          closeIconSelector={() => setShowIconSelector(false)} // Закрыть окно выбора аватара
        />
      )}
    </div>
  );
};

export default Profil;
