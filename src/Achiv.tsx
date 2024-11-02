import { useEffect, useState } from 'react';
import './Achiv.css';
import { zl, bl } from './images';

const achievements = [
  { id: 1, name: "Achievement 1", description: "Do X to unlock", image: zl, unlocked: true },
  { id: 2, name: "Achievement 2", description: "Do Y to unlock", image: zl, unlocked: true },
  { id: 3, name: "Achievement 3", description: "Do Z to unlock", image: zl, unlocked: false },
  { id: 4, name: "Achievement 4", description: "Do t f to unlock", image: zl, unlocked: true },
  { id: 5, name: "Achievement 5", description: "Do B to unlock", image: zl, unlocked: true },
  { id: 6, name: "Achievement 6", description: "Do P to unlock", image: zl, unlocked: false },
];

function Achiv({ setCurrentPage }) {
  const [selectedAchiv, setSelectedAchiv] = useState(null);

  const handleClick = (achiv) => {
    setSelectedAchiv(achiv);
  };

  return (
    <div className="achievements-overlay">
      <h1 className="achievements-title">Achievements</h1>
      <div className="achievements-grid">
        {achievements.map((achiv) => (
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
            <button onClick={() => setSelectedAchiv(null)}>Close</button>
          </div>
        </div>
      )}
      <button className="achievements-back-button" onClick={() => setCurrentPage('home')}>Назад</button>
    </div>
  );
}

export default Achiv;
