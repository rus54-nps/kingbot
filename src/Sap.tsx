import React, { useState, useEffect, useRef } from "react";
import "./Sap.css";


interface Cell {
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

const generateField = (rows: number, cols: number, mineCount: number): Cell[][] => {
  const field: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isOpen: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!field[row][col].isMine) {
      field[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mine counts
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].isMine) continue;

      let mineCount = 0;
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const nr = row + r;
          const nc = col + c;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && field[nr][nc].isMine) {
            mineCount++;
          }
        }
      }
      field[row][col].adjacentMines = mineCount;
    }
  }

  return field;
};

const Sap: React.FC = () => {
  const rows = 9;
  const cols = 9;
  const mineCount = 10;
  const timeLimit = 90; // Ограничение по времени в секундах

  const [field, setField] = useState<Cell[][]>(() => generateField(rows, cols, mineCount));
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit); // Оставшееся время

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Запуск таймера при старте игры
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current!); // Очистка таймера при размонтировании
    };
  }, []);

  const openCell = (row: number, col: number) => {
    if (gameOver || field[row][col].isOpen || field[row][col].isFlagged) return;

    const newField = field.slice();
    const cell = newField[row][col];

    if (cell.isMine) {
      cell.isOpen = true;
      setGameOver(true);
    } else {
      revealCells(newField, row, col);
      checkVictory(newField);
    }
    setField(newField);
  };

  const revealCells = (field: Cell[][], row: number, col: number) => {
    const stack = [[row, col]];
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const cell = field[r][c];
      if (cell.isOpen) continue;

      cell.isOpen = true;
      if (cell.adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              !field[nr][nc].isOpen &&
              !field[nr][nc].isMine
            ) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || field[row][col].isOpen) return;

    const newField = field.slice();
    newField[row][col].isFlagged = !newField[row][col].isFlagged;
    setField(newField);
  };

  const checkVictory = (field: Cell[][]) => {
    const isVictory = field.every((row) =>
      row.every((cell) => (cell.isMine && cell.isFlagged) || (!cell.isMine && cell.isOpen))
    );
    if (isVictory) {
      setVictory(true);
      clearInterval(timerRef.current!); // Остановить таймер при победе
    }
  };

  const restartGame = () => {
    setField(generateField(rows, cols, mineCount));
    setGameOver(false);
    setVictory(false);
    setTimeLeft(timeLimit); // Сброс времени
    clearInterval(timerRef.current!);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="sap-container">
      <h1>Сапёр</h1>
      <div>Оставшееся время: {timeLeft} секунд</div>
      {gameOver && <div className="message">Игра окончена!</div>}
      {victory && <div className="message">Победа!</div>}
      <div className="sap-field">
        {field.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`cell ${cell.isOpen ? "open" : ""} ${
                cell.isMine && gameOver ? "mine" : ""
              } ${cell.isFlagged ? "flag" : ""}`}
              onClick={() => openCell(rIdx, cIdx)}
              onContextMenu={(e) => toggleFlag(e, rIdx, cIdx)}
            >
              {cell.isOpen && cell.adjacentMines > 0 && !cell.isMine && cell.adjacentMines}
            </div>
          ))
        )}
      </div>
      <button className="restart-button" onClick={restartGame}>
        Начать заново
      </button>
    </div>
  );
};

export default Sap;
