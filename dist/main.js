/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((module) => {

const gameboard = () => {
  const board = Array.from(Array(10), () => {
    return Array(10).fill().map(() => ({
      isHit: false,
      ship: null
    }))
  })

  const ships = []

  function placeShip(ship, x, y, isVertical) {
    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      throw new Error('Invalid Coordinates')
    }

    if (isVertical) {
      if (y + ship.length > 10) {
        throw new Error('Ship placement out of bounds')
      }
      for (let i = 0; i < ship.length; i++) {
        if (board[y + 1][x].ship !== null) {
          throw new Error('Ship placement overlap')
        }
      }
      for (let i = 0; i < ship.length; i++) {
        board[y + i][x] = { ship: ship, isHit: false }
      }
    }
    else {
      if (x + ship.length > 10) {
        throw new Error('Ship placement out of bounds')
      }
      for (let i = 0; i < ship.length; i++) {
        if (board[y][x + i].ship !== null) {
          throw new Error('Ship placement overlap')
        }
      }
      for (let i = 0; i < ship.length; i++) {
        board[y][x + i] = { ship: ship, isHit: false }
      }
    }
    ships.push(ship)
  }

  function receiveAttack(x, y) {
    if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      throw new Error('Invalid Coordinates')
    }

    const cell = board[y][x]
    if (!cell.isHit) {
      cell.isHit = true
      if (cell.ship !== null) {
        cell.ship.hit()
      }
      return true
    }
    return false
  }

  function areAllShipsSunk() {
    return ships.every(ship => ship.isSunk)
  }

  return {
    board,
    placeShip,
    receiveAttack,
    areAllShipsSunk
  }
}

module.exports = gameboard

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((module) => {

const ship = (length) => {
  let hits = 0
  let isSunk = false

  function hit() {
    hits++
    if (hits === length){
      isSunk = true
    }
  }

  return {
    length,
    get hits() {
      return hits
    },
    get isSunk() {
      return isSunk
    },
    hit
  }
}

module.exports = ship

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const gameboard = __webpack_require__(/*! ./gameboard.js */ "./src/gameboard.js")
const ship = __webpack_require__(/*! ./ship.js */ "./src/ship.js")

let playerBoard = gameboard()
let computerBoard = gameboard()

function placeRandomShips(board) {
  const shipSizes = [2, 3, 3, 4, 5]

  for (let size in shipSizes) {
    let shipPlaced = false

    while (!shipPlaced) {
      try {
        const isHorizontal = Math.random() >= 0.5
        const row = Math.floor(Math.random() * 9)
        const col = Math.floor(Math.random() * 9)
        board.placeShip(ship(size), row, col, isHorizontal)
        shipPlaced = true
      }
      catch (error) {
        console.log(error)
      }
    }
  }
}

placeRandomShips(playerBoard)
placeRandomShips(computerBoard)

const player = {
  attack(gameboard, x, y) {
    gameboard.receiveAttack(x, y)
  }
}

const computer = {
  hasHit: false,
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
        cell.classList.add(miss)
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

  playGame()
}

const restartButton = document.querySelector('#restart-btn')
restartButton.addEventListener('click', () => {
  restartGame
})
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2Qyw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkMsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ3hFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOzs7Ozs7VUN2QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7O0FDdEJBLGtCQUFrQixtQkFBTyxDQUFDLDBDQUFnQjtBQUMxQyxhQUFhLG1CQUFPLENBQUMsZ0NBQVc7O0FBRWhDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0Isd0JBQXdCO0FBQzFDLG9CQUFvQiwyQkFBMkI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IEFycmF5LmZyb20oQXJyYXkoMTApLCAoKSA9PiB7XG4gICAgcmV0dXJuIEFycmF5KDEwKS5maWxsKCkubWFwKCgpID0+ICh7XG4gICAgICBpc0hpdDogZmFsc2UsXG4gICAgICBzaGlwOiBudWxsXG4gICAgfSkpXG4gIH0pXG5cbiAgY29uc3Qgc2hpcHMgPSBbXVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCB4LCB5LCBpc1ZlcnRpY2FsKSB7XG4gICAgaWYgKHggPCAwIHx8IHggPj0gMTAgfHwgeSA8IDAgfHwgeSA+PSAxMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIENvb3JkaW5hdGVzJylcbiAgICB9XG5cbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgaWYgKHkgKyBzaGlwLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcCBwbGFjZW1lbnQgb3V0IG9mIGJvdW5kcycpXG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW3kgKyAxXVt4XS5zaGlwICE9PSBudWxsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwIHBsYWNlbWVudCBvdmVybGFwJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW3kgKyBpXVt4XSA9IHsgc2hpcDogc2hpcCwgaXNIaXQ6IGZhbHNlIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoeCArIHNoaXAubGVuZ3RoID4gMTApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwIHBsYWNlbWVudCBvdXQgb2YgYm91bmRzJylcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbeV1beCArIGldLnNoaXAgIT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NoaXAgcGxhY2VtZW50IG92ZXJsYXAnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbeV1beCArIGldID0geyBzaGlwOiBzaGlwLCBpc0hpdDogZmFsc2UgfVxuICAgICAgfVxuICAgIH1cbiAgICBzaGlwcy5wdXNoKHNoaXApXG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHgsIHkpIHtcbiAgICBpZiAoeCA8IDAgfHwgeCA+PSAxMCB8fCB5IDwgMCB8fCB5ID49IDEwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgQ29vcmRpbmF0ZXMnKVxuICAgIH1cblxuICAgIGNvbnN0IGNlbGwgPSBib2FyZFt5XVt4XVxuICAgIGlmICghY2VsbC5pc0hpdCkge1xuICAgICAgY2VsbC5pc0hpdCA9IHRydWVcbiAgICAgIGlmIChjZWxsLnNoaXAgIT09IG51bGwpIHtcbiAgICAgICAgY2VsbC5zaGlwLmhpdCgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyZUFsbFNoaXBzU3VuaygpIHtcbiAgICByZXR1cm4gc2hpcHMuZXZlcnkoc2hpcCA9PiBzaGlwLmlzU3VuaylcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYm9hcmQsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgYXJlQWxsU2hpcHNTdW5rXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lYm9hcmQiLCJjb25zdCBzaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgaGl0cyA9IDBcbiAgbGV0IGlzU3VuayA9IGZhbHNlXG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIGhpdHMrK1xuICAgIGlmIChoaXRzID09PSBsZW5ndGgpe1xuICAgICAgaXNTdW5rID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGVuZ3RoLFxuICAgIGdldCBoaXRzKCkge1xuICAgICAgcmV0dXJuIGhpdHNcbiAgICB9LFxuICAgIGdldCBpc1N1bmsoKSB7XG4gICAgICByZXR1cm4gaXNTdW5rXG4gICAgfSxcbiAgICBoaXRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoaXAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgZ2FtZWJvYXJkID0gcmVxdWlyZSgnLi9nYW1lYm9hcmQuanMnKVxuY29uc3Qgc2hpcCA9IHJlcXVpcmUoJy4vc2hpcC5qcycpXG5cbmxldCBwbGF5ZXJCb2FyZCA9IGdhbWVib2FyZCgpXG5sZXQgY29tcHV0ZXJCb2FyZCA9IGdhbWVib2FyZCgpXG5cbmZ1bmN0aW9uIHBsYWNlUmFuZG9tU2hpcHMoYm9hcmQpIHtcbiAgY29uc3Qgc2hpcFNpemVzID0gWzIsIDMsIDMsIDQsIDVdXG5cbiAgZm9yIChsZXQgc2l6ZSBpbiBzaGlwU2l6ZXMpIHtcbiAgICBsZXQgc2hpcFBsYWNlZCA9IGZhbHNlXG5cbiAgICB3aGlsZSAoIXNoaXBQbGFjZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IE1hdGgucmFuZG9tKCkgPj0gMC41XG4gICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDkpXG4gICAgICAgIGNvbnN0IGNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDkpXG4gICAgICAgIGJvYXJkLnBsYWNlU2hpcChzaGlwKHNpemUpLCByb3csIGNvbCwgaXNIb3Jpem9udGFsKVxuICAgICAgICBzaGlwUGxhY2VkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5wbGFjZVJhbmRvbVNoaXBzKHBsYXllckJvYXJkKVxucGxhY2VSYW5kb21TaGlwcyhjb21wdXRlckJvYXJkKVxuXG5jb25zdCBwbGF5ZXIgPSB7XG4gIGF0dGFjayhnYW1lYm9hcmQsIHgsIHkpIHtcbiAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KVxuICB9XG59XG5cbmNvbnN0IGNvbXB1dGVyID0ge1xuICBoYXNIaXQ6IGZhbHNlLFxuICBsYXN0SGl0OiBudWxsLFxuICBhZGphY2VudENlbGxzOiBbXG4gICAgWy0xLCAwXSxcbiAgICBbMCwgLTFdLFxuICAgIFsxLCAwXSxcbiAgICBbMCwgMV1cbiAgXSxcbiAgYXR0YWNrKGdhbWVib2FyZCkge1xuICAgIGxldCBhdHRhY2tDb21wbGV0ZWQgPSBmYWxzZVxuICAgIHdoaWxlICghYXR0YWNrQ29tcGxldGVkKSB7XG4gICAgICBsZXQgeCwgeVxuICAgICAgaWYgKHRoaXMuaGFzSGl0U2hpcCkge1xuICAgICAgICBjb25zdCBbbGFzdEhpdFgsIGxhc3RIaXRZXSA9IHRoaXMubGFzdEhpdFxuICAgICAgICBjb25zdCBbb2Zmc2V0WCwgb2Zmc2V0WV0gPSB0aGlzLmFkamFjZW50Q2VsbHMuc2hpZnQoKVxuICAgICAgICB4ID0gbGFzdEhpdFggKyBvZmZzZXRYXG4gICAgICAgIHkgPSBsYXN0SGl0WSArIG9mZnNldFlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApXG4gICAgICB9XG5cbiAgICAgIGlmICh4ID49IDAgJiYgeCA8IDEwICYmIHkgPj0gMCAmJiB5IDwgMTApIHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGdhbWVib2FyZC5ib2FyZFt5XVt4XVxuICAgICAgICBpZiAoIWNlbGwuaXNIaXQpIHtcbiAgICAgICAgICBpZiAoY2VsbC5zaGlwKSB7XG4gICAgICAgICAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KVxuICAgICAgICAgICAgdGhpcy5oYXNIaXRTaGlwID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5sYXN0SGl0ID0gW3gsIHldXG4gICAgICAgICAgICB0aGlzLmFkamFjZW50Q2VsbHMgPSBbXG4gICAgICAgICAgICAgIFstMSwgMF0sXG4gICAgICAgICAgICAgIFswLCAtMV0sXG4gICAgICAgICAgICAgIFsxLCAwXSxcbiAgICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpXG4gICAgICAgICAgICB0aGlzLmhhc0hpdFNoaXAgPSBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBhdHRhY2tDb21wbGV0ZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5oYXNIaXRTaGlwICYmIHRoaXMuYWRqYWNlbnRDZWxscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLmhhc0hpdFNoaXAgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuYWRqYWNlbnRDZWxscyA9IFtcbiAgICAgICAgICAgIFstMSwgMF0sXG4gICAgICAgICAgICBbMCwgLTFdLFxuICAgICAgICAgICAgWzEsIDBdLFxuICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuaGFzSGl0U2hpcCA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmxldCBjdXJyZW50UGxheWVyID0gcGxheWVyXG5cbmZ1bmN0aW9uIHN3aXRjaFR1cm5zKCkge1xuICBpZiAoY3VycmVudFBsYXllciA9PT0gcGxheWVyKXtcbiAgICBjdXJyZW50UGxheWVyID0gY29tcHV0ZXJcbiAgfVxuICBlbHNlIHtcbiAgICBjdXJyZW50UGxheWVyID0gcGxheWVyXG4gIH0gXG59XG5cbmNvbnN0IHBsYXllckJvYXJkRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItYm9hcmQnKVxuY29uc3QgY29tcHV0ZXJCb2FyZEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29tcHV0ZXItYm9hcmQnKVxuXG5mdW5jdGlvbiByZW5kZXJCb2FyZChib2FyZCwgZWxlbWVudCkge1xuICBlbGVtZW50LnJlcGxhY2VDaGlsZHJlbigpXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5ib2FyZC5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmQuYm9hcmRbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdzcXVhcmUnKVxuXG4gICAgICBpZiAoYm9hcmQuYm9hcmRbaV1bal0uc2hpcCA9PT0gbnVsbCAmJiBib2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSkge1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQobWlzcylcbiAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9ICfigKInXG4gICAgICB9XG5cbiAgICAgIGlmIChib2FyZC5ib2FyZFtpXVtqXS5zaGlwICE9PSBudWxsKSB7XG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpXG4gICAgICAgIGlmIChib2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0JylcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0gJydcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAoY3VycmVudFBsYXllciA9PT0gcGxheWVyICYmICFib2FyZC5ib2FyZFtpXVtqXS5pc0hpdCAmJiBjZWxsLnBhcmVudEVsZW1lbnQgPT09IGNvbXB1dGVyQm9hcmRFbGVtZW50KSB7XG4gICAgICAgICAgY3VycmVudFBsYXllci5hdHRhY2soY29tcHV0ZXJCb2FyZCwgaiwgaSlcbiAgICAgICAgICByZW5kZXJCb2FyZChjb21wdXRlckJvYXJkLCBjb21wdXRlckJvYXJkRWxlbWVudClcbiAgICAgICAgICBzd2l0Y2hUdXJucygpXG4gICAgICAgICAgcGxheUdhbWUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjZWxsKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwbGF5R2FtZSgpIHtcbiAgaWYgKHBsYXllckJvYXJkLmFyZUFsbFNoaXBzU3VuaygpKXtcbiAgICBhbGVydCgnQ29tcHV0ZXIgd2lucyEnKVxuICAgIHJldHVyblxuICB9XG4gIGlmIChjb21wdXRlckJvYXJkLmFyZUFsbFNoaXBzU3VuaygpKXtcbiAgICBhbGVydCgnUGxheWVyIHdpbnMhJylcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChjdXJyZW50UGxheWVyID09PSBjb21wdXRlcikge1xuICAgIGN1cnJlbnRQbGF5ZXIuYXR0YWNrKHBsYXllckJvYXJkKVxuICAgIHJlbmRlckJvYXJkKHBsYXllckJvYXJkLCBwbGF5ZXJCb2FyZEVsZW1lbnQpXG4gICAgc3dpdGNoVHVybnMoKVxuICAgIHBsYXlHYW1lKClcbiAgfVxufVxuXG5yZW5kZXJCb2FyZChwbGF5ZXJCb2FyZCwgcGxheWVyQm9hcmRFbGVtZW50KVxucmVuZGVyQm9hcmQoY29tcHV0ZXJCb2FyZCwgY29tcHV0ZXJCb2FyZEVsZW1lbnQpXG5cbmZ1bmN0aW9uIHJlc3RhcnRHYW1lKCkge1xuICBwbGF5ZXJCb2FyZCA9IGdhbWVib2FyZCgpXG4gIGNvbXB1dGVyQm9hcmQgPSBnYW1lYm9hcmQoKVxuXG4gIHBsYWNlUmFuZG9tU2hpcHMocGxheWVyQm9hcmQpXG4gIHBsYWNlUmFuZG9tU2hpcHMoY29tcHV0ZXJCb2FyZClcblxuICBwbGF5R2FtZSgpXG59XG5cbmNvbnN0IHJlc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzdGFydC1idG4nKVxucmVzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgcmVzdGFydEdhbWVcbn0pIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9