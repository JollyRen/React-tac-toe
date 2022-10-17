// import Inputs from './src/components/Inputs'
// import Winner from './src/components/Winner'
// import Board from './src/components/Board'
// import Score from './src/components/Score'
// import Reset from './src/components/Reset'
import { useState } from "react"

const App = () => {
  //game initialization state
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [toWin, setToWin] = useState(3)
  const [availableMoves, setAvailableMoves] = useState((toWin * toWin) - 1)
  //input state
  const [inputPlayer1, setInputPlayer1] = useState('')
  const [inputPlayer2, setInputPlayer2] = useState('')
  const [inputToWin, setInputToWin] = useState(3)
  
  //game utility state
  const [winningPlayer, setWinningPlayer] = useState('')
  const [currentPlayer, setCurrentPlayer] = useState('X')

  //board state
  const [board, setBoard] = useState(Array(toWin).fill(Array(toWin).fill(null)))
  
  //score state
  const [winScoreX, setWinScoreX] = useState(0)
  const [winScoreO, setWinScoreO] = useState(0)
  
  //game progress state
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isDraw, setIsDraw] = useState(false)

  //utilities

  const findRowCol = (id) => {
    const indexOfCol = id.indexOf('col')
    let row = id.slice(3, indexOfCol)
    let col = id.slice(indexOfCol+3)
    return [row, col]
  }

  const makeNewBoardMove = (row, col) => {
    let newBoard = [...board]
    newBoard[row][col] = currentPlayer
    return newBoard
  }

  const checkWin = () => {
    let checkDiagonalT = 0
    let checkDiagonalB = 0
    let checkVertical = 0
    let winningPlayer = ''
    //loop through rows
    board.forEach((row, i) => {
      //exit early if winning player already found
      if (winningPlayer != '') return
      //reset vertical
      checkVertical = 0
      let checkHorizontal = 0
      let diagonalB = (board.length - 1) - i

      if (board[i][i] == currentPlayer) checkDiagonalT++
      if (board[diagonalB][i] == currentPlayer) checkDiagonalB++
      //loop through columns
      row.forEach((col, j) => {

        if (board[i][j] == currentPlayer) checkHorizontal++

        if (board[j][i] == currentPlayer) checkVertical++

        if (checkHorizontal == toWin || checkVertical == toWin || checkDiagonalT == toWin || checkDiagonalB == toWin) winningPlayer = currentPlayer == 'X' ? player1 : player2

      })
      //if winning player is chosen
      if (winningPlayer != '') {
        setWinningPlayer(winningPlayer)
        setIsFinished(true)
        if (winningPlayer == player1) {
          setWinScoreX(winScoreX + 1)
        } else if (winningPlayer == player2){
          setWinScoreO(winScoreO + 1)
        }
      }
      if (winningPlayer == '' && availableMoves == 0) {
        setIsDraw(true)
        setIsFinished(true)
      }

    })
  }


  // event handlers
  const handlePlayer = (e) => {
    const { id } = e.target
    if(id.includes('1')) setPlayer1(inputPlayer1)
    if(id.includes('2')) setPlayer2(inputPlayer2)
  }
  const handleToWin = (e) => {
    let node = e.target
    console.dir(node)
    setToWin(inputToWin)
  }
  const handleMove = (e) => {
    const { id, className } = e.target
    if (className == "cell") {
      const [row, col] = findRowCol(id)
      if (board[row][col] == null) {
        const newBoard = makeNewBoardMove(row, col)
        setBoard(newBoard)
        setAvailableMoves(availableMoves - 1)
        checkWin()
        console.log(availableMoves)
        if (!isFinished) setCurrentPlayer(currentPlayer == 'X' ? 'O' : 'X')
      }
    }
    
  }

  const handleStart = () => {
    //create starting board
    const newBoard = []
    for (let i = 0; i < toWin; i++){
      const row = []
      for (let j = 0; j < toWin; j++){
        row.push(null)
      }
      newBoard.push(row)
    }
    //set states
    player1 == '' ? setPlayer1('Player 1') : null
    player2 == '' ? setPlayer2('Player 2') : null
    setBoard(newBoard)
    setIsDraw(false)
    setIsStarted(true)
  }
  const handleInputChange = (e) => {
    const { id, value } = e.target
    if (id.includes('1')) setInputPlayer1(value)
    if (id.includes('2')) setInputPlayer2(value)
    if (id.includes('win')) setInputToWin(value)
  }

  const handleReset = () => {
    setAvailableMoves((toWin * toWin) - 1)
    setWinningPlayer('')
    setCurrentPlayer('X')
    setIsFinished(false)
    setIsStarted(false)
    setIsDraw(false)
    handleStart()
  }

  return (
    <>
      {/* <Inputs /> */}
      <div id="inputs">
        <form>
          <div className="input" id="player1-container">
            <input type="text" id="player1" value={inputPlayer1} onChange={(e) => {handleInputChange(e)}}></input>
            <span>{`Player One: ${player1 == '' ? 'empty' : player1}`}</span>
            <button type="button" className="button" id="button-player1" onClick={(e) => handlePlayer(e)}>Change Player Name</button>
          </div>
          <div className="input" id="player2-container">
            <input type="text" id="player2" value={inputPlayer2} onChange={(e) => {handleInputChange(e)}}></input>
            <span>{`Player One: ${player2 == '' ? 'empty' : player2}`}</span>
            <button type="button" className="button" id="button-player2" onClick={(e) => handlePlayer(e)}>Change Player Name</button>
          </div>
          <div className="input" id="to-win-container">
            <input type="number" id="to-win" value={inputToWin} onChange={(e) => {handleInputChange(e)}}></input>
            <span>{`${toWin} in a row to win`}</span>
            <button type="button" className="button" id="button-to-win" onClick={(e) => handleToWin(e)}>Change To Win</button>
          </div>
        </form>
      </div>
      <div id="start-game">
        <button type="button" className="button" id="start-button" onClick={handleStart}>Start Game</button>
      </div>
      {/* <Winner /> */}
      {
        isFinished && winningPlayer != '' && 
      <div id="winner-container">
        <h2 id="winner-text">{`player ${winningPlayer} has Won!`}</h2>
      </div>
      }
      { isFinished && isDraw && 
        <div id="winner-container">
        <h2 id="winner-text">It's a draw! Reset the Game to Play again!</h2>
      </div>
      }
      {/* <Board /> */}
      <div id="board" onClick={(e) => {
        if (!isFinished && isStarted && !isDraw) {handleMove(e)}
        }}>
        {
          isStarted && toWin > 2 && board.map(
            (row, i) => {
              return (
                <div className="row" id={`row${i}`} key={`row${i}`}>
                  {
                    row.map((cell, j) => {
                      return (
                      <div className="cell" id={`row${i}col${j}`} key={`row${i}col${j}`}>
                        <span>{board[i][j]}</span>
                      </div>
                    )})
                  }
                </div>
              )
            })
          }
      </div>
      {/* <Score /> */}
      <div id="score-container">
        <div>
          <p>{`${player1 != '' ? 'Player 1' : player1} has won ${winScoreX} times!`}</p>
        </div>
        <div>
          <p>{`${player2 != '' ? 'Player 2' : player2} has won ${winScoreO} times!`}</p>
        </div>
      </div>
      {/* <Reset /> */}
      <div>
        <button type="button" className="button" id="reset-button" onClick={handleReset}>Reset Game</button>
      </div>
    </>
  )
}

// needs to hold win state, to send to Winner (done)

// hold Input states and send them to Board (done)

// hold board state and send to board (done)

// hold score states and send it to score (done)

// score keeps track of player wins (done)

// reset resets board state to input value (done)

export default App