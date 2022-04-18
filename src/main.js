let fieldDimension = 5
let maxCellSize = 110
let cellSize
let field = []
let checked = []
let clicks = 0

function setup() {
  let reset = document.querySelector('#reset')
  reset.addEventListener('click', resetter)
  reset.addEventListener('touchstart', resetter)

  let newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)
  newGame.addEventListener('touchstart', newField)

  cellSize = Math.min(maxCellSize, Math.min(windowWidth, windowHeight) / (fieldDimension + 1))

  createCanvas(windowWidth, windowHeight)

  newField()

  noLoop()
}

function resetter() {
  field = Array.from({ length: fieldDimension }, () => {
    return Array.from({ length: fieldDimension }, () => 0)
  })

  checked.forEach(el => {
    checkField(el[0], el[1])
  })

  clicks = 0

  redraw()
}

function newField() {
  checked = []

  for (let k = 0; k < 5; k++) {
    checked.push([Math.floor(Math.random() * fieldDimension), Math.floor(Math.random() * fieldDimension)])
  }

  resetter()
}

function draw() {
  cellSize = Math.min(maxCellSize, Math.min(windowWidth, windowHeight) / fieldDimension) - 10

  clear()
  background(40)
  translate(windowWidth / 2 - cellSize * (fieldDimension) / 2, windowHeight / 2 - cellSize * (fieldDimension) / 2)
  for (let i = 0; i < fieldDimension; i++) {
    for (let j = 0; j < fieldDimension; j++) {
      fill(field[i][j] ? 250 : 114)
      stroke(0)
      strokeWeight(1)

      rect(j * cellSize, i * cellSize, cellSize, cellSize)
    }
  }

  fill(255)
  textSize(24)
  textAlign(LEFT)
  text(`Clicks: ${clicks}`, 10, -20)
  // textSize(32)
  // textAlign(CENTER)
  // text(`Свет выключи, слыш`, cellSize * 2.5, -50)

}

function touchStarted() {
  let mX = mouseX - windowWidth / 2 + cellSize * fieldDimension / 2
  let mY = mouseY - windowHeight / 2 + cellSize * fieldDimension / 2
  if (mX < 0 || mY < 0) return
  translate(windowWidth / 2 - cellSize * fieldDimension / 2, windowHeight / 2 - cellSize * fieldDimension / 2)

  let j = Math.floor(mX / cellSize)
  let i = Math.floor(mY / cellSize)

  if (i < fieldDimension && j < fieldDimension) {
    clicks++
    checkField(i, j)

    redraw()
    winCheck()
  }

  return false
}

function checkField(i, j) {
  field[i][j] = !field[i][j]
  if (i - 1 >= 0) field[i - 1][j] ^= 1
  if (i + 1 < fieldDimension) field[i + 1][j] ^= 1
  if (j - 1 >= 0) field[i][j - 1] ^= 1
  if (j + 1 < fieldDimension) field[i][j + 1] ^= 1
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw()
}

function winCheck() {
  let notYet = false
  for (let i = 0; i < fieldDimension; i++) {
    for (let j = 0; j < fieldDimension; j++) {
      if (field[i][j] == true) {
        notYet = true
        break
      }
    }
    if (notYet) break
  }

  if (!notYet) {
    alert('Yay!')
    setTimeout(() => {
      newField()
    }, 1000)
  }
}