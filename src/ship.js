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