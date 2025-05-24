import { useState, useMemo } from "react";
import "./App.css";

const initialBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function App() {
  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [invalidNumber, setInvalidNumber] = useState<number | null>(null);
  const [isGameComplete, setIsGameComplete] = useState(false);

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

  const isValidMoveForBoard = (
    board: number[][],
    row: number,
    col: number,
    num: number
  ): boolean => {
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

  const handleCellClick = (i: number, j: number) => {
    if (initialBoard[i][j] !== 0) return;
    setSelectedCell([i, j]);
  };

  const handleNumberClick = (number: number) => {
    if (!selectedCell) return;
    const [i, j] = selectedCell;

    if (isValidMoveForBoard(board, i, j, number)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[i][j] = number;
      setBoard(newBoard);
    } else {
      setInvalidNumber(number);
      setTimeout(() => setInvalidNumber(null), 500);
    }
  };

  const solveSudoku = () => {
    const newBoard = board.map((r) => [...r]);

    const solve = (b: number[][]): boolean => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (b[i][j] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValidMoveForBoard(b, i, j, num)) {
                b[i][j] = num;
                if (solve(b)) {
                  return true;
                }
                b[i][j] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (solve(newBoard)) {
      setBoard(newBoard);
    }
  };

  const startNewGame = () => {
    setBoard(initialBoard);
    setSelectedCell(null);
    setInvalidNumber(null);
    setIsGameComplete(false);
  };

  return (
    <div className="app">
      <header>
        <h1>❤️</h1>
      </header>
      <main>
        <div className={`board ${isGameComplete ? "game-complete" : ""}`}>
          {board.map((row, i) => (
            <div key={i} className="row">
              {row.map((cell, j) => {
                const isInitial = initialBoard[i][j] !== 0;
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
          {isGameComplete && (
            <button className="new-game-button" onClick={startNewGame}>
              Новая игра
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
