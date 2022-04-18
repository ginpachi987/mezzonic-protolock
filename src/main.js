import './style.css'
import { Field, offImage, onImage } from './classes.js'
import { ru, en } from './lang/langs'
let langs = { ru: ru, en: en }
let lang = en

const maxWidth = 480

//Tutorial stuff
let tip
let tutorialInterval1
let tutorialInterval2
let showTip

const fieldSize = 5
let field
setup()

function setup() {
  let gameContainer = document.querySelector('#game')
  field = new Field(fieldSize, gameContainer)
  field.newField()

  // Button events
  let reset = document.querySelector('#reset')
  reset.addEventListener('click', resetGame)
  // reset.addEventListener('touchstart', resetGame)

  let newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)
  // newGame.addEventListener('touchstart', newField)

  let tutorialButton = document.querySelector('#tutorial-button')
  tutorialButton.addEventListener('click', showTutorial)

  setLang(navigator.language.substring(0, 2))
  window.top.postMessage('getLang', '*')

  // Clear nav if iframe
  if (window.self !== window.top) {
    document.querySelector('nav').innerHTML = ''
  }

  // Message from parent
  window.onmessage = function (e) {
    if (e.data.lang) {
      setLang(e.data.lang)
    }
  }

  // Tutorial popup
  showTip = JSON.parse(localStorage.getItem('showTip')) || false
  if (!showTip) {
    setTimeout(() => {
      tip = document.querySelector('#tip')
      tip.style.opacity = 1
      tip.style.pointerEvents = 'auto'
      tip.addEventListener('click', () => {
        localStorage.setItem('showTip', true)
        tip.style.opacity = 0
      })
    }, 2000)
  }

  window.addEventListener('resize', () => {
    resize()
  })
  resize()
}

function resize() {
  let width = Math.min(maxWidth, window.innerWidth - 60, window.innerHeight - 60)
  field.resize(width)
}

function resetGame() {
  field.reset()
}

function newField() {
  field.newField()
}

function setLang(language) {
  if (langs[language]) {
    lang = langs[language]
  }
  else lang = langs['en']
  let newGame = document.querySelector('#new-game')
  newGame.innerHTML = lang.newGame || en.newGame

  let resetText = document.querySelector('#reset-text')
  resetText.innerHTML = lang.reset || en.reset

  let tip = document.querySelector('#tip')
  tip.innerHTML = lang.tip || lang.tip
}

function showTutorial() {
  if (!showTip) {
    localStorage.setItem('showTip', true)
    tip.style.opacity = 0
  }

  let wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.style.display = 'block'

  let tutorial = document.createElement('div')
  tutorial.classList.add('tutorial')

  let closeButton = document.createElement('div')
  closeButton.id = 'tutorial-close'
  closeButton.innerHTML = 'X'
  closeButton.addEventListener('click', hideTutorial)

  tutorial.appendChild(closeButton)

  let header = document.createElement('h1')
  header.innerHTML = lang.title || en.title

  tutorial.appendChild(header)
  tutorial.appendChild(document.createElement('hr'))

  let p = document.createElement('p')
  p.innerHTML = lang.tutorial[0] || en.tutorial[0]

  tutorial.appendChild(p)

  let disp = document.createElement('div')
  disp.classList.add('tut-display')
  p = document.createElement('p')
  p.innerHTML = (lang.tutorial[1] || en.tutorial[1]) + ' ->'
  disp.appendChild(p)
  let offCell = document.createElement('div')
  offCell.classList.add('cell')
  offCell.style.backgroundImage = `url('${offImage}')`
  disp.appendChild(offCell)
  let onCell = document.createElement('div')
  onCell.classList.add('cell')
  onCell.style.backgroundImage = `url('${onImage}')`
  disp.appendChild(onCell)
  p = document.createElement('p')
  p.innerHTML = '<- ' + (lang.tutorial[2] || en.tutorial[2])
  disp.appendChild(p)
  tutorial.appendChild(disp)

  let h2 = document.createElement('h2')
  h2.innerHTML = `${lang.tutorial[3] || en.tutorial[3]} 1`
  tutorial.appendChild(h2)

  p = document.createElement('p')
  p.innerHTML = lang.tutorial[4] || en.tutorial[4]
  tutorial.appendChild(p)

  let div = document.createElement('div')
  div.classList.add('game')
  div.style.pointerEvents = 'none'
  let tutorialField1 = new Field(5, div)
  tutorial.appendChild(div)

  h2 = document.createElement('h2')
  h2.innerHTML = `${lang.tutorial[3] || en.tutorial[3]} 2`
  tutorial.appendChild(h2)

  p = document.createElement('p')
  p.innerHTML = lang.tutorial[5] || en.tutorial[5]
  tutorial.appendChild(p)

  div = document.createElement('div')
  div.classList.add('game')
  div.style.pointerEvents = 'none'
  let tutorialField2 = new Field(5, div)
  tutorial.appendChild(div)

  let int = (field, cells) => {
    cells.forEach((cell, i) => {
      const [x, y] = cell
      field.checkCell(x, y, 0)
      setTimeout(() => {
        field.cells[x][y].toggleHighlight()
      }, 2000 * (i + 1) - 500)
      setTimeout(() => {
        field.cells[x][y].toggleHighlight()
        field.checkCell(x, y)
      }, 2000 * (i + 1))
    })

    setTimeout(() => {
      field.flicker()
    }, 2000 * cells.length + 1000)

    cells = cells.reverse()
  }
  let cells1 = [[1, 1], [3, 3]]
  let cells2 = [[3, 1], [2, 0], [1, 1], [1, 2], [1, 4]]
  int(tutorialField1, cells1)
  int(tutorialField2, cells2)

  tutorialInterval1 = setInterval((field, cells) => {
    int(field, cells)
  }, 2000 * (cells1.length + 2), tutorialField1, cells1)

  tutorialInterval2 = setInterval((field, cells) => {
    int(field, cells)
  }, 2000 * (cells2.length + 2), tutorialField2, cells2)

  wrapper.appendChild(tutorial)
}

function hideTutorial() {
  let wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.innerHTML = ''
  wrapper.style.display = 'none'

  clearInterval(tutorialInterval1)
  clearInterval(tutorialInterval2)
}
// let fieldDimension = 5
// let maxCellSize = 110
// let cellSize
// let field = []
// let checked = []
// let clicks = 0

// function setup() {
//   let reset = document.querySelector('#reset')
//   reset.addEventListener('click', resetter)
//   reset.addEventListener('touchstart', resetter)

//   let newGame = document.querySelector('#new')
//   newGame.addEventListener('click', newField)
//   newGame.addEventListener('touchstart', newField)

//   cellSize = Math.min(maxCellSize, Math.min(windowWidth, windowHeight) / (fieldDimension + 1))

//   createCanvas(windowWidth, windowHeight)

//   newField()

//   noLoop()
// }

// function resetter() {
//   field = Array.from({ length: fieldDimension }, () => {
//     return Array.from({ length: fieldDimension }, () => 0)
//   })

//   checked.forEach(el => {
//     checkField(el[0], el[1])
//   })

//   clicks = 0

//   redraw()
// }

// function newField() {
//   checked = []

//   for (let k = 0; k < 5; k++) {
//     checked.push([Math.floor(Math.random() * fieldDimension), Math.floor(Math.random() * fieldDimension)])
//   }

//   resetter()
// }

// function draw() {
//   cellSize = Math.min(maxCellSize, Math.min(windowWidth, windowHeight) / fieldDimension) - 10

//   clear()
//   background(40)
//   translate(windowWidth / 2 - cellSize * (fieldDimension) / 2, windowHeight / 2 - cellSize * (fieldDimension) / 2)
//   for (let i = 0; i < fieldDimension; i++) {
//     for (let j = 0; j < fieldDimension; j++) {
//       fill(field[i][j] ? 250 : 114)
//       stroke(0)
//       strokeWeight(1)

//       rect(j * cellSize, i * cellSize, cellSize, cellSize)
//     }
//   }

//   fill(255)
//   textSize(24)
//   textAlign(LEFT)
//   text(`Clicks: ${clicks}`, 10, -20)
//   // textSize(32)
//   // textAlign(CENTER)
//   // text(`Свет выключи, слыш`, cellSize * 2.5, -50)

// }

// function touchStarted() {
//   let mX = mouseX - windowWidth / 2 + cellSize * fieldDimension / 2
//   let mY = mouseY - windowHeight / 2 + cellSize * fieldDimension / 2
//   if (mX < 0 || mY < 0) return
//   translate(windowWidth / 2 - cellSize * fieldDimension / 2, windowHeight / 2 - cellSize * fieldDimension / 2)

//   let j = Math.floor(mX / cellSize)
//   let i = Math.floor(mY / cellSize)

//   if (i < fieldDimension && j < fieldDimension) {
//     clicks++
//     checkField(i, j)

//     redraw()
//     winCheck()
//   }

//   return false
// }

// function checkField(i, j) {
//   field[i][j] = !field[i][j]
//   if (i - 1 >= 0) field[i - 1][j] ^= 1
//   if (i + 1 < fieldDimension) field[i + 1][j] ^= 1
//   if (j - 1 >= 0) field[i][j - 1] ^= 1
//   if (j + 1 < fieldDimension) field[i][j + 1] ^= 1
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   redraw()
// }

// function winCheck() {
//   let notYet = false
//   for (let i = 0; i < fieldDimension; i++) {
//     for (let j = 0; j < fieldDimension; j++) {
//       if (field[i][j] == true) {
//         notYet = true
//         break
//       }
//     }
//     if (notYet) break
//   }

//   if (!notYet) {
//     alert('Yay!')
//     setTimeout(() => {
//       newField()
//     }, 1000)
//   }
// }