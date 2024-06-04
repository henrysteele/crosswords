import "./App.css"

import { For, createSignal } from "solid-js"
import { makeCrossWord } from "./matrix.js"
import { fillMatrix, usedWords } from "./words.js"
import listofwords from "./listofwords"
import CrosswordPuzzle from "./CrosswordPuzzle"

export function logger (...args) {
  console.log(...args)
}

export const crosswords = []

export default function () {

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
      <For each={crosswords}>{
        (item) => <CrosswordPuzzle value={item} />
      }</For>
    </>
  )
}

