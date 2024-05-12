import "./App.css"
import { testData, htmlTable } from "./script.js"
import { onMount, createSignal } from "solid-js"
import Typo from "typo-js"
import { findWords } from './helpers'

var dictionary = new Typo("en_US", false, false, {
  dictionaryPath: "/node_modules/typo-js/dictionaries",
})
var is_spelled_correctly = dictionary.check("mispelled")
var array_of_suggestions = dictionary.suggest("d-g", 20)

const listOfWords = Object.keys(dictionary.dictionaryTable).filter(
  (word) => !word.includes("'")
)

const longWords = {}
for (let i = 10; i < 30; i++) {
  longWords[i + " chars"] = listOfWords.filter((word) => word.length == i)
}


console.log({ is_spelled_correctly, array_of_suggestions, listOfWords, longWords })

console.log({ find: findWords("a__l__") })


// creates an empty NxN matrix
function newMatrix (rows, cols = 0) {
  if (!cols) cols = rows
  const m = []
  for (let r = 0; r < rows; r++) {
    m.push([])
    for (let c = 0; c < cols; c++) {
      m[r].push([])
    }
  }
  return m
}

// returns a new matrix that is the horizontal reflection of matrix
function flipHorizontally (matrix) {
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

function flipVertically (matrix) {
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
function addHorizontally (left, right) {
  const m = []
  for (let i = 0; i < left.length; i++) {
    m.push([...left[i], ...right[i]])
  }
  return m
}

function addVertically (top, bottom) {
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

function deleteMiddle (matrix) {
  const rows = matrix.length
  matrix.splice(rows / 2, 1)
  for (let row of matrix) {
    const cols = row.length
    row.splice(cols / 2, 1)
  }
  return matrix
}
// 0001001000

function goodMatrix (matrix) {
  for (let r = 0; r <= matrix.length; r++) {
    const row_2 = matrix[r - 2] || []
    const row_1 = matrix[r - 1] || []
    const row = matrix[r] || []
    const row1 = matrix[r + 1] || []
    const row2 = matrix[r + 2] || []
    for (let c = 0; c < row.length; c++) {
      if (row[c] == 1) continue
      if (
        !(
          (row[c - 1] == 0 && row[c - 2] == 0) ||
          (row[c + 1] == 0 && row[c + 2] == 0) ||
          (row[c - 1] == 0 && row[c + 1] == 0) ||
          (row_1[c] == 0 && row_2[c] == 0) ||
          (row1[c] == 0 && row2[c] == 0) ||
          (row_1[c] == 0 && row1[c] == 0)
        )
      )
        return false
    }
  }
  return true
}

function mirror (matrix) {
  if (!matrix) return []

  let temp = addHorizontally(matrix, flipHorizontally(matrix))
  temp = addVertically(temp, flipVertically(temp))
  temp = deleteMiddle(temp)
  console.log({ goodMatrix: goodMatrix(temp) })

  return temp
}

function App () {
  // const N = 30
  // const m = []

  // for (let i = 0; i < N; i++) {
  //   m.push([])
  //   for (let j = 0; j < N; j++) {
  //     m[i].push([])
  //     m[i][j] = Math.round(Math.random())
  //   }
  // }
  // testData.push({ matrix: m })

  testData.push({
    matrix: mirror(testData[1].matrix),
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
