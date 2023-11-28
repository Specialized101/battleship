const ship = require('./ship.js')

describe('ship', () => {
  let s
  beforeEach(() => {
    s = ship(3)
  })
  test('Create ship with correct length', () => {
    expect(s.length).toBe(3)
  })
  test('Create ship with correct default hits', () => {
    expect(s.hits).toBe(0)
  })
  test('Create ship with correct default sunk', () => {
    expect(s.isSunk).toBeFalsy()
  })
  test('Increase ship\'s hits on hit', () => {
    s.hit()
    expect(s.hits).toBe(1)
  })
  test('Sunk the ship correctly after hit', () => {
    s.hit()
    s.hit()
    expect(s.isSunk).toBeFalsy()
    s.hit()
    expect(s.isSunk).toBeTruthy()
  })
})