import "./App.css"
import { testData, htmlTable } from "./script.js"

import { makeCrossWord } from "./matrix.js"
import { fillMatrix, usedWords } from "./words.js"
import listofwords from "./listofwords"

export function logger (...args) {
  console.log(...args)
}

export const crosswords = []

function App () {

  //for (let i = 5; i < 16; i += 5) {
  crosswords.push(fillMatrix(makeCrossWord(10)))
  //crosswords.push(fillMatrix(makeCrossWord(13)))
  //}

  logger({ final: usedWords })

  for (let word of usedWords) {
    if (!listofwords.includes(word)) logger({ error: word })
  }

  return (
    <>
      <For each={crosswords}>
        {(item) => <div class="crossword" innerHTML={htmlTable(item)} />}
      </For>
    </>
  )
}

export default App

