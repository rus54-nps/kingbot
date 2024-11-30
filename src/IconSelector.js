import React from 'react';
import { ava1, ava2, ava3, ava4, ava5, ava6, ava7 } from './images';
import './IconSelector.css';

type IconSelectorProps = {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  setCurrentPage: (page: string) => void;
};

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, setSelectedIcon, setCurrentPage }) => {
  const icons = [ava1, ava2, ava3, ava4, ava5, ava6, ava7];

  const handleIconClick = (icon: string) => {
    console.log(`Icon clicked: ${icon}`); // Проверка кликов
    setSelectedIcon(icon);
  };

  return (
    <div 
      className="icon-panel"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#2d2d2d',
        padding: '16px',
       borderRadius: '12px',
        zIndex: 1000,
        width: '300px',
       textAlign: 'center',
      }}>
      <button
        className="close-button"
        onClick={() => setCurrentPage('home')}
      >
        ✖
      </button>
      <div className="icon-grid">
        {icons.map((icon, index) => (
          <button
            key={index}
            className={`icon-button ${selectedIcon === icon ? 'selected' : ''}`}
            onClick={() => handleIconClick(icon)}
          >
            <img src={icon} alt={`Icon ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
