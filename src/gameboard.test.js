const gameboard = require('./gameboard.js')
const ship = require('./ship.js')

describe('gameboard', () => {
  let gb, s
  beforeEach(() => {
    gb = gameboard()
    s = ship(3)
  })
  test('Create gameboard object with empty board array', () => {
    expect(gb.board).toEqual(expect.any(Array))
    expect(gb.board.length).toBe(10)
    expect(gb.board[0].length).toBe(10)
  })
  test('Place a ship on the board horizontally', () => {
    gb.placeShip(s, 0, 0, false)
    expect(gb.board[0][0].ship).toEqual(s)
    expect(gb.board[0][1].ship).toEqual(s)
    expect(gb.board[0][2].ship).toEqual(s)
  })
  test('Place a ship on the board vertically', () => {
    gb.placeShip(s, 0, 0, true)
    expect(gb.board[0][0].ship).toEqual(s)
    expect(gb.board[1][0].ship).toEqual(s)
    expect(gb.board[2][0].ship).toEqual(s)
  })
  test('Throw error when placing ship outside the grid horizontally', () => {
    expect(() => gb.placeShip(s, 9, 9, false)).toThrow('Ship placement out of bounds')
  })
  test('Throw error when placing ship outside the grid vertically', () => {
    expect(() => gb.placeShip(s, 9, 9, true)).toThrow('Ship placement out of bounds')
  })
  test('Throw error when placing ship causes overlap horizontally', () => {
    const shipA = ship(3)
    gb.placeShip(shipA, 0, 0, false)
    expect(() => gb.placeShip(s, 0, 0, false)).toThrow('Ship placement overlap')
  })
  test('Throw error when placing ship causes overlap vertically', () => {
    const shipA = ship(3)
    gb.placeShip(shipA, 0, 0, true)
    expect(() => gb.placeShip(s, 0, 0, true)).toThrow('Ship placement overlap')
  })
  test('Mark cell on hit', () => {
    gb.placeShip(s, 0, 0, false)
    gb.receiveAttack(0, 0)
    expect(gb.board[0][0].isHit).toBeTruthy()
  })
  test('Returns true when all ships are sunk', () => {
    const a = ship(2)
    const b = ship(3)
    gb.placeShip(a, 0, 0, false)
    gb.placeShip(b, 1, 1, true)
    a.hit()
    a.hit()
    b.hit()
    b.hit()
    b.hit()
    expect(gb.areAllShipsSunk()).toBeTruthy()
  })
  test('Returns false when not all ships are sunk', () => {
    const a = ship(2)
    const b = ship(3)
    gb.placeShip(a, 0, 0, false)
    gb.placeShip(b, 1, 1, true)
    a.hit()
    a.hit()
    b.hit()
    expect(gb.areAllShipsSunk()).toBeFalsy()
  })
})