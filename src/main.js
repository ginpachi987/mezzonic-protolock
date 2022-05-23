import './style.css'
import { langs } from './lang/langs'
import { showTutorial } from './scripts/tutorial'
import { preload } from './scripts/images'
import { Field } from './scripts/field'

const fieldSize = 5
const maxWidth = 480
let field

const container = document.querySelector('.game')

let lang = langs.en
let tip
let showTip

preload()
setup()

function setup() {
  setLang(navigator.language.substring(0, 2))

  const newGame = document.querySelector('#new')
  newGame.addEventListener('click', newField)

  const reset = document.querySelector('#reset')
  reset.addEventListener('click', resetGame)

  const tutorialButton = document.querySelector('#tutorial-button')
  tutorialButton.addEventListener('click', () => { showTutorial(showTip, lang) })

  field = new Field(container, fieldSize)
  field.newField()

  window.addEventListener('resize', recalcSizes)
  recalcSizes()

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
}

function setLang(language) {
  if (langs[language]) {
    lang = langs[language]
  }
  else lang = langs.en
  const newGame = document.querySelector('#new-game')
  newGame.innerHTML = lang.newGame || langs.en.newGame

  const resetText = document.querySelector('#reset-text')
  resetText.innerHTML = lang.reset || langs.en.reset

  const tip = document.querySelector('#tip')
  tip.innerHTML = lang.tip || langs.en.tip
}

function recalcSizes() {
  const width = Math.min(maxWidth, window.innerWidth - 60, window.innerHeight - 60)
  if (field) field.resize(width)
}

function resetGame() {
  field.reset()
}

function newField() {
  field.newField()
}