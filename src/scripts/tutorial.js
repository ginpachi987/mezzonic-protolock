import { langs } from '../lang/langs'
import { onImage, offImage } from './images'
import { Field } from './field'

let tutorialInterval1
let tutorialInterval2

export function showTutorial(showTip, lang) {
  if (!showTip) {
    localStorage.setItem('showTip', true)
    tip.style.opacity = 0
  }

  const wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.style.display = 'block'

  const tutorial = document.createElement('div')
  tutorial.classList.add('tutorial')

  const closeButton = document.createElement('div')
  closeButton.id = 'tutorial-close'
  closeButton.innerHTML = 'X'
  closeButton.addEventListener('click', hideTutorial)

  tutorial.appendChild(closeButton)

  const header = document.createElement('h1')
  header.innerHTML = lang.title || langs.en.title

  tutorial.appendChild(header)
  tutorial.appendChild(document.createElement('hr'))

  let p = document.createElement('p')
  p.innerHTML = lang.tutorial[0] || langs.en.tutorial[0]

  tutorial.appendChild(p)

  const disp = document.createElement('div')
  disp.classList.add('tut-display')
  p = document.createElement('p')
  p.innerHTML = (lang.tutorial[1] || langs.en.tutorial[1]) + ' ->'
  disp.appendChild(p)
  const offCell = document.createElement('div')
  offCell.classList.add('cell')
  offCell.style.backgroundImage = `url('${offImage}')`
  disp.appendChild(offCell)
  const onCell = document.createElement('div')
  onCell.classList.add('cell')
  onCell.style.backgroundImage = `url('${onImage}')`
  disp.appendChild(onCell)
  p = document.createElement('p')
  p.innerHTML = '<- ' + (lang.tutorial[2] || langs.en.tutorial[2])
  disp.appendChild(p)
  tutorial.appendChild(disp)

  let h2 = document.createElement('h2')
  h2.innerHTML = `${lang.tutorial[3] || langs.en.tutorial[3]} 1`
  tutorial.appendChild(h2)

  p = document.createElement('p')
  p.innerHTML = lang.tutorial[4] || langs.en.tutorial[4]
  tutorial.appendChild(p)

  let div = document.createElement('div')
  div.classList.add('game')
  div.style.pointerEvents = 'none'
  const tutorialField1 = new Field(div, 5)
  tutorial.appendChild(div)

  h2 = document.createElement('h2')
  h2.innerHTML = `${lang.tutorial[3] || langs.en.tutorial[3]} 2`
  tutorial.appendChild(h2)

  p = document.createElement('p')
  p.innerHTML = lang.tutorial[5] || langs.en.tutorial[5]
  tutorial.appendChild(p)

  div = document.createElement('div')
  div.classList.add('game')
  div.style.pointerEvents = 'none'
  const tutorialField2 = new Field(div, 5)
  tutorial.appendChild(div)

  const int = (field, cells) => {
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
  const cells1 = [[1, 1], [3, 3]]
  const cells2 = [[3, 1], [2, 0], [1, 1], [1, 2], [1, 4]]
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
  const wrapper = document.querySelector('#tutorial-wrapper')
  wrapper.innerHTML = ''
  wrapper.style.display = 'none'

  clearInterval(tutorialInterval1)
  clearInterval(tutorialInterval2)
}