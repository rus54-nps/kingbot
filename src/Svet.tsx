import React, { useState } from 'react';
import './Svet.css';

interface SvetProps {
  setCurrentPage: (page: string) => void;
  attemptsLeft: number;
  updateAttempts: (newAttempts: number) => void;
}

interface Cell {
  color: string | null;
  isStart: boolean;
  isEnd: boolean;
}

const gridSize = 6; // Размер сетки (6x6)
const initialGrid: Cell[][] = [
  [
    { color: 'red', isStart: true, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: 'yellow', isStart: true, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: 'blue', isStart: true, isEnd: false },
    { color: null, isStart: false, isEnd: false },
  ],
  [
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
  ],
  [
    { color: null, isStart: false, isEnd: false },
    { color: 'green', isStart: true, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: 'pink', isStart: true, isEnd: false },
    { color: null, isStart: false, isEnd: false },
  ],
  [
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
  ],
  [
    { color: 'red', isStart: false, isEnd: true },
    { color: null, isStart: false, isEnd: false },
    { color: 'yellow', isStart: false, isEnd: true },
    { color: null, isStart: false, isEnd: false },
    { color: 'blue', isStart: false, isEnd: true },
    { color: null, isStart: false, isEnd: false },
  ],
  [
    { color: null, isStart: false, isEnd: false },
    { color: null, isStart: false, isEnd: false },
    { color: 'green', isStart: false, isEnd: true },
    { color: null, isStart: false, isEnd: false },
    { color: 'pink', isStart: false, isEnd: true },
    { color: null, isStart: false, isEnd: false },
  ],
];

const Svet: React.FC<SvetProps> = ({ setCurrentPage, attemptsLeft, updateAttempts }) => {
  const [grid, setGrid] = useState<Cell[][]>(initialGrid);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  const handleCellClick = (x: number, y: number) => {
    const cell = grid[x][y];

    if (cell.color && cell.isStart && !currentPath.length) {
      // Начало линии
      setCurrentPath([{ x, y }]);
      setCurrentColor(cell.color);
    } else if (
      currentPath.length &&
      cell.color === currentColor &&
      cell.isEnd &&
      !currentPath.some((pos) => pos.x === x && pos.y === y)
    ) {
      // Успешное соединение
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        currentPath.forEach((pos) => {
          newGrid[pos.x][pos.y] = { ...newGrid[pos.x][pos.y], color: currentColor };
        });
        return newGrid;
      });
      setCurrentPath([]);
      setCurrentColor(null);
    } else if (currentPath.length) {
      // Добавление клетки в путь
      const lastCell = currentPath[currentPath.length - 1];
      if (
        Math.abs(lastCell.x - x) + Math.abs(lastCell.y - y) === 1 && // Проверка на соседство
        !currentPath.some((pos) => pos.x === x && pos.y === y) // Проверка на отсутствие пересечения
      ) {
        setCurrentPath([...currentPath, { x, y }]);
      } else {
        // Неверное действие
        updateAttempts(attemptsLeft - 1);
        setCurrentPath([]);
        setCurrentColor(null);
      }
    }
  };

  return (
    <div className="svet-container">
      <button className="back-button" onClick={() => setCurrentPage('game')}>
        Назад
      </button>
      <h3 className="attempts-left">Оставшиеся попытки: {attemptsLeft}</h3>
      <div className="grid">
        {grid.map((row, x) =>
          row.map((cell, y) => (
            <div
              key={`${x}-${y}`}
              className={`cell ${cell.color ? `cell-${cell.color}` : ''} ${
                currentPath.some((pos) => pos.x === x && pos.y === y) ? 'active-path' : ''
              }`}
              onClick={() => handleCellClick(x, y)}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Svet;
