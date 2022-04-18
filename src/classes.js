import offImage from './img/off.png'
import onImage from './img/on.png'

export class Field {
  constructor(size, container) {
    this.size = size
    this.container = container
    this.checked = []
    this.cells = [...Array(size)].map(() => [...Array(size).keys()].map(() => new Cell()))

    this.cells.forEach((row, i) => {
      let $row = document.createElement('div')
      $row.classList.add('row')
      row.forEach((cell, j) => {
        cell.el.addEventListener('click', () => {
          this.clickCell(i, j)
        })
        $row.appendChild(cell.el)
      })

      this.container.appendChild($row)
    })
  }

  checkCell(i, j, delay = 100) {
    this.cells[i][j].toggleState()

    setTimeout(() => {
      if (i - 1 >= 0) this.cells[i - 1][j].toggleState()
      if (i + 1 < this.size) this.cells[i + 1][j].toggleState()
      if (j - 1 >= 0) this.cells[i][j - 1].toggleState()
      if (j + 1 < this.size) this.cells[i][j + 1].toggleState()
    }, delay)
  }

  clickCell(i, j) {
    this.checkCell(i, j)

    setTimeout(() => {
      this.victoryCheck()
    }, 100)

  }

  victoryCheck() {
    let victory = true

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.cells[i][j].state) {
          victory = false
          break
        }
        if (!victory) break
      }
    }

    if (victory) {
      this.container.style.pointerEvents = 'none'
      this.flicker()

      setTimeout(() => {
        // console.log('Yay!')
        this.newField()
        this.container.style.pointerEvents = 'auto'

        window.top.postMessage("registerWin", '*')
      }, this.size * 250)

    }
  }

  newField() {
    this.checked = []
    while (this.checked.length < this.size) {
      let x = Math.floor(Math.random() * this.size)
      let y = Math.floor(Math.random() * this.size)
      if (!this.checked.find(el => el.x == x && el.y == y)) {
        this.checked.push({ x: x, y: y })
      }
    }

    this.reset()
  }

  reset() {
    this.cells.forEach(row => {
      row.forEach(cell => {
        cell.toggleState(false)
      })
    })

    this.checked.forEach(el => {
      this.checkCell(el.x, el.y, 0)
    })
  }

  flicker() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j <= i; j++) {
        setTimeout((x, y) => {
          this.cells[x][y].toggleState()
          if (x != y) this.cells[y][x].toggleState()
        }, (i + 1) * 100, i, j)

        setTimeout((x, y) => {
          this.cells[x][y].toggleState()
          if (x != y) this.cells[y][x].toggleState()
        }, (i + 1) * 100 + this.size * 100, i, j)
      }
    }
  }

  resize(width) {
    this.container.style.width = `${width}px`
    let cellSize = width / this.size

    this.cells.forEach(row => {
      row.forEach(cell => {
        cell.el.style.width = `${cellSize}px`
        cell.el.style.height = `${cellSize}px`
        cell.el.style.backgroundSize = `${cellSize}px`
      })
    })
  }
}

export class Cell {
  constructor(state = false) {
    this.state = state
    this.el = document.createElement('div')
    this.el.classList.add('cell')
    this.el.style.backgroundImage = `url('${this.state ? onImage : offImage}')`
  }

  toggleState(state) {
    this.state = state == undefined ? !this.state : state
    this.el.style.backgroundImage = `url('${this.state ? onImage : offImage}')`
  }

  toggleHighlight() {
    this.el.classList.toggle('highlight')
  }
}

export { offImage, onImage }