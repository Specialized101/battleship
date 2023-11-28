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