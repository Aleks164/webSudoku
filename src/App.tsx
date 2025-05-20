import { useState } from 'react'
import './App.css'

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
]

function App() {
  const [board, setBoard] = useState<number[][]>(initialBoard)

  return (
    <div className="app">
      <header>
        <h1>Судоку</h1>
      </header>
      <main>
        <div className="board">
          {board.map((row, i) => (
            <div key={i} className="row">
              {row.map((cell, j) => {
                const isInitial = initialBoard[i][j] !== 0
                return (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    min="1"
                    max="9"
                    value={cell || ''}
                    disabled={isInitial}
                    className={isInitial ? 'cell-initial' : ''}
                    onChange={e => {
                      if (isInitial) return
                      const newBoard = board.map(r => [...r])
                      newBoard[i][j] = parseInt(e.target.value) || 0
                      setBoard(newBoard)
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
