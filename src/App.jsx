
import './App.css'
import { testData, htmlTable } from './script.js'
import { onMount, createSignal } from 'solid-js'
import Typo from "typo-js"


var dictionary = new Typo("en_US", false, false, { dictionaryPath: "/node_modules/typo-js/dictionaries" })
var is_spelled_correctly = dictionary.check("mispelled");
var array_of_suggestions = dictionary.suggest("d-g", 20);

const listOfWords = Object.keys(dictionary.dictionaryTable).filter(word => !word.includes("'"))

const longWords = {}
for (let i = 10; i < 30; i++) {
  longWords[i + " chars"] = listOfWords.filter(word => word.length == i)
}

console.log({ is_spelled_correctly, array_of_suggestions, listOfWords, longWords })



// creates an empty NxN matrix
function newMatrix (N) {
  const m = []
  for (let r = 0; r < N; r++) {
    m.push([])
    for (let c = 0; c < N; c++) {
      m[r].push([])
    }
  }
  return m
}

// returns a new matrix that is the horizontal reflection of matrix
function flipHorizontally (matrix) {

  /*
  Given [
    [1,0,0],
    [0,1,0],
    [0,0,1],
  ]

  Return [
    [0,0,1],
    [0,1,0],
    [1,0,0],
  ]
  */

  if (!matrix) return []
  const N = matrix.length
  const m = newMatrix(N)

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      m[r][c] = matrix[r][N - c - 1]
    }
  }
  return m
}

function flipVertically (matrix) {
  return matrix
}
function addHorizontally (left, right) { return left }
function addVertically (top, bottom) { return right }

function mirror (matrix) {
  // let temp = addHorizontally(matrix, flipHorizontally(matrix))
  // temp = addVertically(temp, flipVertically(temp))
  // return temp

  return flipHorizontally(matrix)
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
    matrix: mirror(testData[0].matrix)
  })



  return (
    <>
      <For each={testData}>{
        (item) => <div class="crossword" innerHTML={htmlTable(item.matrix)} />
      }</For>
    </>
  )
}

export default App
