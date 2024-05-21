import "./App.css"
import { testData, htmlTable } from "./script.js"
import { onMount, createSignal } from "solid-js"
import Typo from "typo-js"
import { findWords, transpose } from "./helpers.js"
import { fillMatrix } from "./words.js"
function deleteMiddle(matrix) {
  const rows = matrix.length
  matrix.splice(rows / 2, 1)
  for (let row of matrix) {
    const cols = row.length
    row.splice(cols / 2, 1)
  }
  return matrix
}
// creates an empty NxN matrix
function newMatrix(rows = 4, cols = 0, value = 0) {
  if (!cols) cols = rows
  const m = []
  console.log({ newMatrix: m, rows, cols, value })
  for (let r = 0; r < rows; r++) {
    m.push([])
    for (let c = 0; c < cols; c++) {
      m[r].push(value)
    }
  }
  console.log({ newMatrix: m })
  return m
}

// returns a new matrix that is the horizontal reflection of matrix
function flipHorizontally(matrix) {
  if (!matrix) return []
  const rows = matrix.length
  const cols = matrix[0].length
  const m = newMatrix(rows, cols)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      m[r][c] = matrix[r][cols - 1 - c]
    }
  }
  return m
}

function flipVertically(matrix) {
  console.log({ flipVertically: matrix })
  if (!matrix) return []
  const rows = matrix.length
  const cols = matrix[0].length
  const m = newMatrix(rows, cols)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      m[r][c] = matrix[rows - 1 - r][c]
    }
  }
  return m
}
function addHorizontally(left, right) {
  const m = []
  for (let i = 0; i < left.length; i++) {
    m.push([...left[i], ...right[i]])
  }
  return m
}

function addVertically(top, bottom) {
  const m = []
  let r
  for (r = 0; r < top.length; r++) {
    m.push([...top[r]])
  }
  console.log({ addVertically1: m })
  for (r = 0; r < bottom.length; r++) {
    m.push([...bottom[r]])
  }
  console.log({ addVertically2: m })
  return m
}

function fillRows(matrix) {
  const N = matrix.length
  const maxWidth = 10
  for (let r = Math.round(Math.random()); r < N; r += 2) {
    const width = Math.min(maxWidth, 3 + Math.round(Math.random() * (N - 3)))
    const x = Math.round(Math.random() * (N - width))
    console.log({ N, width, x })
    for (let c = x; c < x + width; c++) {
      matrix[r][c] = 0
    }
  }
  return matrix
}

function createMatrix(N = 4) {
  if (N < 4) N = 4
  const matrix = newMatrix(N, N, 1)
  console.log({ createMatrix: matrix })

  return fillRows(transpose(fillRows(matrix)))
}

function randomMatrix(N) {
  const m = newMatrix(N)
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      let rand = Math.floor(Math.random() + 0.5)
      m[r][c] = rand
    }
  }
  return m
}

function mirror(matrix) {
  if (!matrix) return []

  let temp = addHorizontally(matrix, flipHorizontally(matrix))
  temp = addVertically(temp, flipVertically(temp))
  temp = deleteMiddle(temp)

  return temp
}

function App() {
  let matrix

  testData.push({
    matrix: fillMatrix(mirror(createMatrix(10))),
  })

  return (
    <>
      <For each={testData}>
        {(item) => <div class="crossword" innerHTML={htmlTable(item.matrix)} />}
      </For>
    </>
  )
}

export default App
