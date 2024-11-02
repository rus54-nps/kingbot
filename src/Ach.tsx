import { useEffect, useState } from 'react';
import './Ach.css';
import { zl, bl, per, zad } from './images';

// Определение типа для достижения
type Achievement = {
  id: number;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
};

const achievements: Achievement[] = [
  /*Заработок монет*/
  { id: 1, name: "Первый Шаг", description: "Заработайте 1 000 монет", image: zl, unlocked: false },
  { id: 2, name: "Медленный старт", description: "Заработайте 10 000 монет", image: zl, unlocked: false },
  { id: 3, name: "Финансовый прорыв", description: "Заработайте 100 000 монет", image: zl, unlocked: false },
  { id: 4, name: "Монетный Магнат", description: "Заработайте 1 000 000 монет", image: zl, unlocked: false },
  { id: 5, name: "Золотая Лихорадка", description: "Заработайте 10 000 000 монет", image: zl, unlocked: false },
  /*Максимальная энергия*/
  { id: 6, name: "Начинающий энергетик", description: "Увеличьте максимальную энергию до 5 000", image: zl, unlocked: false },
  { id: 7, name: "Энергетик", description: "Увеличьте максимальную энергию до 10 000", image: zl, unlocked: false },
  { id: 8, name: "Энергетический Гигант", description: "Увеличьте максимальную энергию до 15 000", image: zl, unlocked: false },
  /*Количество тапов*/
  { id: 9, name: "Начинающий тапер", description: "Сделайте 1 000 тапов", image: zl, unlocked: false },
  { id: 10, name: "Мастери Тапа", description: "Сделайте 100 000 тапов", image: zl, unlocked: false },
  { id: 11, name: "Владыка Тапов", description: "Сделайте 1 000 000 тапов", image: zl, unlocked: false },
  /*Завершение достижений*/
  { id: 12, name: "Чемпион", description: "Добейтесь 100% выполнения всех достижений", image: zl, unlocked: false },
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

  return (
    <div className="achievements-overlay">
      <h1 className="achievements-title">Achievements</h1>
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
        <div className="achievement-modal">
          <div className="modal-content">
            <h2>{selectedAchiv.name}</h2>
            <p>{selectedAchiv.unlocked ? selectedAchiv.description : "Достижение закрыто"}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
      <button className="achievements-back-button" onClick={() => setCurrentPage('home')}>Назад</button>
      
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
