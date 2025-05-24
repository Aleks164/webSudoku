import { useState, useMemo } from "react";
import "./App.css";

// Функция для проверки, можно ли поставить число в ячейку
const isValidPlacement = (board: number[][], row: number, col: number, num: number): boolean => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
};

// Функция для решения судоку
const solveSudokuBoard = (board: number[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let k = nums.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [nums[k], nums[j]] = [nums[j], nums[k]];
        }
        
        for (const num of nums) {
          if (isValidPlacement(board, i, j, num)) {
            board[i][j] = num;
            if (solveSudokuBoard(board)) {
              return true;
            }
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Функция для генерации нового поля
const generateNewBoard = (
  difficulty: "easy" | "medium" | "hard"
): number[][] => {
  const board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  for (let block = 0; block < 3; block++) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    const startRow = block * 3;
    const startCol = block * 3;
    let numIndex = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[startRow + i][startCol + j] = nums[numIndex++];
      }
    }
  }

  solveSudokuBoard(board);

  const cellsToRemove = {
    easy: 35, // 46 начальных ячеек
    medium: 45, // 36 начальных ячеек
    hard: 55, // 26 начальных ячеек
  }[difficulty];

  let removed = 0;

  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }

  return board;
};

const initialBoard = generateNewBoard("medium");

function App() {
  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [initialGameBoard, setInitialGameBoard] =
    useState<number[][]>(initialBoard);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [invalidNumber, setInvalidNumber] = useState<number | null>(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  const remainingNumbers = useMemo(() => {
    const counts = new Array(10).fill(9); // 0-9, где 0 не используется
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell > 0) {
          counts[cell]--;
        }
      });
    });
    return counts;
  }, [board]);

  const remainingMoves = useMemo(() => {
    let count = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 0) count++;
      });
    });
    if (count === 0) {
      setIsGameComplete(true);
    }
    return count;
  }, [board]);

  const handleCellClick = (i: number, j: number) => {
    if (initialGameBoard[i][j] !== 0) return;
    setSelectedCell([i, j]);
  };

  const handleNumberClick = (number: number) => {
    if (!selectedCell) return;
    const [i, j] = selectedCell;

    if (isValidPlacement(board, i, j, number)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[i][j] = number;
      setBoard(newBoard);
    } else {
      setInvalidNumber(number);
      setTimeout(() => setInvalidNumber(null), 500);
    }
  };

  const handleClearCell = () => {
    if (!selectedCell) return;
    const [i, j] = selectedCell;
    if (initialGameBoard[i][j] !== 0) return; // Нельзя очистить начальную ячейку

    const newBoard = board.map((r) => [...r]);
    newBoard[i][j] = 0;
    setBoard(newBoard);
  };

  const startNextGame = () => {
    const newBoard = generateNewBoard(difficulty);
    setBoard(newBoard);
    setInitialGameBoard(newBoard);
    setSelectedCell(null);
    setInvalidNumber(null);
    setIsGameComplete(false);
  };

  const handleDifficultyChange = (
    newDifficulty: "easy" | "medium" | "hard"
  ) => {
    setDifficulty(newDifficulty);
    const newBoard = generateNewBoard(newDifficulty);
    setBoard(newBoard);
    setInitialGameBoard(newBoard);
    setSelectedCell(null);
    setInvalidNumber(null);
    setIsGameComplete(false);
  };

  const solveSudoku = () => {
    const newBoard = board.map((r) => [...r]);
    if (solveSudokuBoard(newBoard)) {
      setBoard(newBoard);
    }
  };

  const startNewGame = () => {
    setBoard(initialGameBoard.map((row) => [...row]));
    setSelectedCell(null);
    setInvalidNumber(null);
    setIsGameComplete(false);
  };

  return (
    <div className="app">
      <div className="difficulty-panel">
        <button
          className={`difficulty-button ${
            difficulty === "easy" ? "active" : ""
          }`}
          onClick={() => handleDifficultyChange("easy")}
          title="Нормальный уровень"
        >
          Нормальный
        </button>
        <button
          className={`difficulty-button ${
            difficulty === "medium" ? "active" : ""
          }`}
          onClick={() => handleDifficultyChange("medium")}
          title="Сложный уровень"
        >
          Сложный
        </button>
        <button
          className={`difficulty-button ${
            difficulty === "hard" ? "active" : ""
          }`}
          onClick={() => handleDifficultyChange("hard")}
          title="Эксперт"
        >
          Эксперт
        </button>
      </div>
      <header>
        <button
          className="header-button new-game-button"
          onClick={startNewGame}
          title="Начать текущую игру заново"
        >
          Заново
        </button>
        <h1 onClick={startNewGame} title="Перезапустить текущую игру">
          ❤️
        </h1>
        <button
          className="header-button next-game-button"
          onClick={startNextGame}
          title="Следующая игра"
        >
          Следующая
        </button>
      </header>
      <main>
        <div className={`board ${isGameComplete ? "game-complete" : ""}`}>
          {board.map((row, i) => (
            <div key={i} className="row">
              {row.map((cell, j) => {
                const isInitial = initialGameBoard[i][j] !== 0;
                const isSelected =
                  selectedCell?.[0] === i && selectedCell?.[1] === j;
                const isSameRow = selectedCell?.[0] === i;
                const isSameCol = selectedCell?.[1] === j;
                const isSameNumber =
                  selectedCell &&
                  cell !== 0 &&
                  board[selectedCell[0]][selectedCell[1]] === cell;
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`
                      cell
                      ${isInitial ? "cell-initial" : ""} 
                      ${isSelected ? "cell-selected" : ""}
                      ${isSameRow ? "cell-same-row" : ""}
                      ${isSameCol ? "cell-same-col" : ""}
                      ${isSameNumber ? "cell-same-number" : ""}
                    `}
                    onClick={() => handleCellClick(i, j)}
                  >
                    {cell || ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="controls">
          <div className="number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) =>
              remainingNumbers[num] > 0 ? (
                <button
                  key={num}
                  className={`number-button ${
                    invalidNumber === num ? "invalid" : ""
                  }`}
                  onClick={() => handleNumberClick(num)}
                  data-count={remainingNumbers[num]}
                >
                  {num}
                </button>
              ) : null
            )}
            <button
              className="number-button clear"
              onClick={handleClearCell}
              title="Очистить ячейку"
            >
              ✕
            </button>
          </div>
          {remainingMoves <= 10 && remainingMoves > 0 && !isGameComplete && (
            <button
              className="solve-button"
              onClick={solveSudoku}
              title="Завершить игру"
            >
              Завершить
            </button>
          )}
        </div>
        {isGameComplete && (
          <div className="victory-message">
            <h2>Вау, ты победил(а)!</h2>
            <p>Как это получилось?!</p>
            <p>
              Это же невероятно сложная игра, в которой надо очень много
              думать...
            </p>
            <div className="victory-emoji">🎉</div>
            <button
              className="victory-button"
              onClick={startNextGame}
              title="Начать новую игру"
            >
              Новая игра
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
