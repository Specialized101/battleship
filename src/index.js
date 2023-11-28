import './style.css'

const gameboard = require('./gameboard.js')
const ship = require('./ship.js')

let playerBoard = gameboard()
let computerBoard = gameboard()

function placeRandomShips(board) {
  const shipLengths = [5, 4, 3, 3, 2];

  for (let length of shipLengths) {
    let shipPlaced = false;

    while (!shipPlaced) {
      try {
        const isHorizontal = Math.random() >= 0.5;
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        board.placeShip(ship(length), row, col, isHorizontal);
        shipPlaced = true;
      } catch (error) {
        console.error(error);
      }
    }
  }
}

placeRandomShips(playerBoard)
placeRandomShips(computerBoard)

const player = {
  attack(gameboard, x, y) {
    gameboard.receiveAttack(x, y);
  },
};

const computer = {
  hasHitShip: false,
  lastHit: null,
  adjacentCells: [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1]
  ],
  attack(gameboard) {
    let attackCompleted = false
    while (!attackCompleted) {
      let x, y
      if (this.hasHitShip) {
        const [lastHitX, lastHitY] = this.lastHit
        const [offsetX, offsetY] = this.adjacentCells.shift()
        x = lastHitX + offsetX
        y = lastHitY + offsetY
      }
      else {
        x = Math.floor(Math.random() * 10)
        y = Math.floor(Math.random() * 10)
      }

      if (x >= 0 && x < 10 && y >= 0 && y < 10) {
        const cell = gameboard.board[y][x]
        if (!cell.isHit) {
          if (cell.ship) {
            gameboard.receiveAttack(x, y)
            this.hasHitShip = true
            this.lastHit = [x, y]
            this.adjacentCells = [
              [-1, 0],
              [0, -1],
              [1, 0],
              [0, 1],
            ]
          }
          else {
            gameboard.receiveAttack(x, y)
            this.hasHitShip = false
          }
          attackCompleted = true
        }
        else if (this.hasHitShip && this.adjacentCells.length === 0) {
          this.hasHitShip = false
          this.adjacentCells = [
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1],
          ]
        }
      }
      else {
        this.hasHitShip = false
      }
    }
  }
}

let currentPlayer = player

function switchTurns() {
  if (currentPlayer === player){
    currentPlayer = computer
  }
  else {
    currentPlayer = player
  } 
}

const playerBoardElement = document.querySelector('#player-board')
const computerBoardElement = document.querySelector('#computer-board')

function renderBoard(board, element) {
  element.replaceChildren()

  for (let i = 0; i < board.board.length; i++) {
    for (let j = 0; j < board.board[i].length; j++) {
      const cell = document.createElement('div')
      cell.classList.add('square')

      if (board.board[i][j].ship === null && board.board[i][j].isHit === true) {
        cell.classList.add('miss')
        cell.textContent = '•'
      }

      if (board.board[i][j].ship !== null) {
        cell.classList.add('ship')
        if (board.board[i][j].isHit === true) {
          cell.classList.add('hit')
          cell.textContent = ''
        }
      }

      cell.addEventListener('click', () => {
        if (currentPlayer === player && !board.board[i][j].isHit && cell.parentElement === computerBoardElement) {
          currentPlayer.attack(computerBoard, j, i)
          renderBoard(computerBoard, computerBoardElement)
          switchTurns()
          playGame()
        }
      })
      element.appendChild(cell)
    }
  }
}

function playGame() {
  if (playerBoard.areAllShipsSunk()){
    alert('Computer wins!')
    return
  }
  if (computerBoard.areAllShipsSunk()){
    alert('Player wins!')
    return
  }

  if (currentPlayer === computer) {
    currentPlayer.attack(playerBoard)
    renderBoard(playerBoard, playerBoardElement)
    switchTurns()
    playGame()
  }
}

renderBoard(playerBoard, playerBoardElement)
renderBoard(computerBoard, computerBoardElement)

function restartGame() {
  playerBoard = gameboard()
  computerBoard = gameboard()

  placeRandomShips(playerBoard)
  placeRandomShips(computerBoard)

  renderBoard(playerBoard, playerBoardElement)
  renderBoard(computerBoard, computerBoardElement)
  playGame()
}

const restartButton = document.querySelector('#restart-btn')
restartButton.addEventListener('click', () => {
  restartGame()
})