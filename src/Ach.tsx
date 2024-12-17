import { useEffect, useState } from 'react';
import './Ach.css';
import { bl, zad, per, k1, k2, k3, k4, k5, en1, en2, en3, tap1, tap2, tap3, fullach } from './images';
import { useLanguage } from './LanguageContext';

// Определение типа для достижения
type Achievement = {
  id: number;
  name: string;
  description: { ru: string; en: string };
  image: string;
  unlocked: boolean;
};

const itemNames = {
  firstStep: { ru: 'Первый Шаг', en: 'The First Step' },
  slowStart: { ru: 'Медленный старт', en: 'Slow start' },
  financial: { ru: 'Финансовый прорыв', en: 'Financial breakthrough' },
  coinMagnate: { ru: 'Монетный Магнат', en: 'The Coin Magnate' },
  goldRush: { ru: 'Золотая Лихорадка', en: 'The Gold Rush' },
  //
  novicePower : { ru: 'Начинающий энергетик', en: 'A novice power engineer' },
  engineer: { ru: 'Энергетик', en: 'The power engineer' },
  giant: { ru: 'Энергетический Гигант"', en: 'The Energy Giant' },
  //
  beginner: { ru: 'Начинающий тапер', en: 'Beginner piano player' },
  masters: { ru: 'Мастери Тапа', en: 'Tapa Masters' },
  lord: { ru: 'Владыка Тапов', en: 'The Lord of Taps' },
  //
  champion: { ru: 'Чемпион', en: 'Champion' },
};

const achievements: Achievement[] = [
  /*Заработок монет*/
  { id: 1, name: "firstStep", description: { ru: "Заработайте 1 000 монет", en: "Earn 1 000 coins" }, image: k1, unlocked: false },
  { id: 2, name: "slowStart", description: { ru: "Заработайте 10 000 монет", en: "Earn 10 000 coins" }, image: k2, unlocked: false },
  { id: 3, name: "financial", description: { ru: "Заработайте 100 000 монет", en: "Earn 100 000 coins" }, image: k3, unlocked: false },
  { id: 4, name: " coinMagnate", description: { ru: "Заработайте 1 000 000 монет", en: "Earn 1 000 000 coins" }, image: k4, unlocked: false },
  { id: 5, name: "goldRush", description: { ru: "Заработайте 10 000 000 монет", en: "Earn 10 000 000 coins" }, image: k5, unlocked: false },
  /*Максимальная энергия*/
  { id: 6, name: "novicePower", description: { ru: "Увеличьте максимальную энергию до 5 000", en: "Increase max energy to 5,000" }, image: en1, unlocked: false },
  { id: 7, name: "engineer", description: { ru: "Увеличьте максимальную энергию до 10 000", en: "Increase max energy to 10 000" }, image: en2, unlocked: false },
  { id: 8, name: "giant", description: { ru: "Увеличьте максимальную энергию до 15 000", en: "Increase max energy to 15 000" }, image: en3, unlocked: false },
  /*Количество тапов*/
  { id: 9, name: "beginner", description:  { ru: "Сделайте 1 000 тапов", en: "Make 1,000 taps" }, image: tap1, unlocked: false },
  { id: 10, name: "masters", description:  { ru: "Сделайте 100 000 тапов", en: "Make 100 000 taps" }, image: tap2, unlocked: false },
  { id: 11, name: "lord", description:  { ru: "Сделайте 1 000 000 тапов", en: "Make 1 000 000 taps" }, image: tap3, unlocked: false },
  /*Завершение достижений*/
  { id: 12, name: "champion", description: { ru: "Добейтесь 100% выполнения всех достижений", en: "Achieve 100% completion of all achievements" }, image: fullach, unlocked: false },
  /*
  { id: 13, name: "Потрачено", description: "Потратьте 1000 монет в магазине", image: zl, unlocked: false },
  /*
  { id: 14, name: "Прирожденный Тапер", description: "Совершите 300 тапов за 2 минуты", image: zl, unlocked: false },
  { id: 15, name: "Скоростной Тап", description: "Совершите 50 тапов за 10 секунд", image: zl, unlocked: false },
  { id: 16, name: "Неудержимый Тапер", description: "Совершите 100 тапов за минуту", image: zl, unlocked: false },
  { id: 17, name: "Прирождённый Тапер", description: "Совершите 300 тапов за 2 минуты", image: zl, unlocked: false },
  { id: 18, name: "Чемпион", description: "Do B to unlock", image: zl, unlocked: false },
  { id: 19, name: "Марафонец", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 20, name: "Тайный Реген", description: "Do B to unlock", image: zl, unlocked: false },
  { id: 21, name: "Achievement 24", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 22, name: "Achievement 24", description: "Do P to unlock", image: zl, unlocked: false },
   */
];

interface AchivProps {
  setCurrentPage: (page: string) => void;
  points: number;
  maxEnergy: number;
  taps: number;
}

function Achiv({ setCurrentPage, points, maxEnergy, taps }: AchivProps) {
  const [selectedAchiv, setSelectedAchiv] = useState<Achievement | null>(null);
  const [currentPage, setCurrentPageState] = useState(0);
  const achievementsPerPage = 12;

  const { language } = useLanguage();

  /*Заработок монет*/
  useEffect(() => {
    if (points >= 1000) {
      achievements[0].unlocked = true;
    }
  }, [points]);

  useEffect(() => {
    if (points >= 10000) {
      achievements[1].unlocked = true;
    }
  }, [points]);

  useEffect(() => {
    if (points >= 100000) {
      achievements[2].unlocked = true;
    }
  }, [points]);

  useEffect(() => {
    if (points >= 1000000) {
      achievements[3].unlocked = true;
    }
  }, [points]);

  useEffect(() => {
    if (points >= 10000000) {
      achievements[4].unlocked = true;
    }
  }, [points]);

  /*Максимальная энергия*/
  useEffect(() => {
    if (maxEnergy >= 5000) {
      achievements[5].unlocked = true;
    }
  },[maxEnergy]);

  useEffect(() => {
    if (maxEnergy >= 10000) {
      achievements[6].unlocked = true;
    }
  },[maxEnergy]);

  useEffect(() => {
    if (maxEnergy >= 15000) {
      achievements[7].unlocked = true;
    }
  },[maxEnergy]);

  /*Количество тапов*/
  useEffect(() => {
    if (taps >= 1000) {
      achievements[8].unlocked = true;
    }
  }, [taps]);

  useEffect(() => {
    if (taps >= 100000) {
      achievements[9].unlocked = true; // Обратите внимание на индекс 8 для достижения "Начинающий тапер"
    }
  }, [taps]);

  useEffect(() => {
    if (taps >= 1000000) {
      achievements[10].unlocked = true; // Обратите внимание на индекс 8 для достижения "Начинающий тапер"
    }
  }, [taps]);

                        /*Последнее достиженее*/
    useEffect(() => {
    const allAchievementsUnlocked = achievements.slice(0, -1).every(ach => ach.unlocked);
    if (allAchievementsUnlocked) {
      achievements[11].unlocked = true; // Индекс 11 для достижения "Чемпион"
    }
  }, [achievements]);


  const handleClick = (achiv: Achievement) => {
    setSelectedAchiv(achiv); // Устанавливаем выбранное достижение
  };

  const handleBackPage = () => {
    if (currentPage > 0) {
      setCurrentPageState((prevPage) => prevPage - 1); // Не позволяем уходить на отрицательные страницы
    }
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const nextAchievements = achievements.slice(nextPage * achievementsPerPage, (nextPage + 1) * achievementsPerPage);
    if (nextAchievements.length > 0) {
      setCurrentPageState(nextPage); // Переход на следующую страницу, если она не пустая
    }
  };

  const handleClose = () => {
    setSelectedAchiv(null);
  };

  const startIndex = currentPage * achievementsPerPage;
  const endIndex = startIndex + achievementsPerPage;
  const currentAchievements = achievements.slice(startIndex, endIndex);

  const hasNextPage = (currentPage + 1) * achievementsPerPage < achievements.length; // Проверка наличия достижений на следующей странице

  const closeach = {
    achievementLocked: {
      ru: "Достижение закрыто",
      en: "Achievement locked",
    },
  };
  
  return (
    <div className="Ach achievements-overlay">
      <h1 className="achievements-title">
      {language === 'ru' ? 'Достижения' : 'Achievements'}</h1>
      <div className="achievements-grid">
        {currentAchievements.map((achiv) => (
          <div key={achiv.id} className="achievement" onClick={() => handleClick(achiv)}>
            <img
              src={achiv.unlocked ? achiv.image : bl}
              alt={achiv.name}
              className="achievement-image"
            />
          </div>
        ))}
      </div>

      {selectedAchiv && (
  <div 
    className="achievement-modal-overlay" 
    onClick={handleClose} // Закрытие при клике на оверлей
  >
    <div 
      className="modal-content" 
      onClick={(e) => e.stopPropagation()} // Остановка всплытия события, чтобы не закрывать при клике на содержимое
    >
      <h2>{itemNames[selectedAchiv.name as keyof typeof itemNames][language]}</h2>
      <p>{selectedAchiv.unlocked ? selectedAchiv.description[language] : 
      closeach.achievementLocked[language]}</p>
    </div>
  </div>
)}

      <button className="achievements-back-button" onClick={() => setCurrentPage('home')}>{language === 'ru' ? 'Назад' : 'Back'}</button>
      
      {/* Кнопки навигации с изображениями */}
      <div className="navigation-buttons">
        <button 
          className="back-page-button" 
          onClick={handleBackPage} 
          disabled={currentPage === 0} // Отключаем кнопку, если на первой странице
        >
          <img src={zad} alt="Назад" className="navigation-image" />
        </button>
        <button 
          className={`next-page-button ${!hasNextPage ? 'disabled' : ''}`} // Добавляем класс "disabled", если нет следующей страницы
          onClick={handleNextPage}
          disabled={!hasNextPage} // Отключаем кнопку, если нет достижений на следующей странице
        >
          <img src={per} alt="Вперёд" className="navigation-image" />
        </button>
      </div>
    </div>
  );
}

export default Achiv;
