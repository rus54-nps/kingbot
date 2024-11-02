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
  { id: 1, name: "Первый Шаг", description: "Заработайте 10 монет", image: zl, unlocked: false },
  { id: 2, name: "Achievement 2", description: "Do Y to unlock", image: zl, unlocked: false },
  { id: 3, name: "Achievement 3", description: "Do Z to unlock", image: zl, unlocked: false },
  { id: 4, name: "Achievement 4", description: "Do t f to unlock", image: zl, unlocked: false },
  { id: 5, name: "Achievement 5", description: "Do B to unlock", image: zl, unlocked: false },
  { id: 6, name: "Achievement 6", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 7, name: "Achievement 7", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 8, name: "Achievement 8", description: "Do Y to unlock", image: zl, unlocked: false },
  { id: 9, name: "Achievement 9", description: "Do Z to unlock", image: zl, unlocked: false },
  { id: 10, name: "Achievement 10", description: "Do t f to unlock", image: zl, unlocked: false },
  { id: 11, name: "Achievement 11", description: "Do B to unlock", image: zl, unlocked: false },
  { id: 12, name: "Achievement 12", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 13, name: "Achievement 13", description: "Do Z to unlock", image: zl, unlocked: false },
  { id: 14, name: "Achievement 14", description: "Do t f to unlock", image: zl, unlocked: false },
  { id: 15, name: "Achievement 15", description: "Do B to unlock", image: zl, unlocked: false },
  { id: 16, name: "Achievement 16", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 17, name: "Achievement 17", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 18, name: "Achievement 18", description: "Do Y to unlock", image: zl, unlocked: false },
  { id: 19, name: "Achievement 19", description: "Do Z to unlock", image: zl, unlocked: false },
  { id: 20, name: "Achievement 20", description: "Do t f to unlock", image: zl, unlocked: false },
  { id: 21, name: "Achievement 21", description: "Do B to unlock", image: zl, unlocked: false },
  { id: 22, name: "Achievement 22", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 23, name: "Achievement 23", description: "Do B to unlock", image: zl, unlocked: false },
  { id: 24, name: "Achievement 24", description: "Do P to unlock", image: zl, unlocked: false },
  { id: 25, name: "Achievement 24", description: "Do P to unlock", image: zl, unlocked: false },
];

interface AchivProps {
  setCurrentPage: (page: string) => void; // Определение типа для setCurrentPage
  points: number; // Определение типа для points
}

function Achiv({ setCurrentPage, points }: AchivProps) {
  const [selectedAchiv, setSelectedAchiv] = useState<Achievement | null>(null);
  const [currentPage, setCurrentPageState] = useState(0);
  const achievementsPerPage = 12;

  useEffect(() => {
    if (points >= 10) {
      achievements[0].unlocked = true; // Открываем первое достижение
    }
  }, [points]);

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
            <p>{selectedAchiv.unlocked ? selectedAchiv.description : "Complete the task to unlock"}</p>
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
