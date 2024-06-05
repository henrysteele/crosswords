import "./App.css"

import { For, createSignal } from "solid-js"
import { makeCrossWord } from "./matrix.js"
import { fillMatrix, usedWords } from "./words.js"
import listofwords from "./listofwords"
import CrosswordPuzzle from "./CrosswordPuzzle"
import data from './data.js'
import { Button, Container, Stack } from "@suid/material";

export function logger (...args) {
  console.log(...args)
}

export const crosswords = [data[0].matrix]

export default function () {

  //for (let i = 5; i < 16; i += 5) {
  //crosswords.push(fillMatrix(makeCrossWord(10)))
  //crosswords.push(fillMatrix(makeCrossWord(13)))
  //}

  logger({ usedWords })

  for (let word of usedWords) {
    if (!listofwords.includes(word)) logger({ error: word })
  }


  return (
    <>
      <h1>Title</h1>
      <h2>description</h2>


      <For each={crosswords}>{
        (item) => <CrosswordPuzzle value={item} />
      }</For>


    </>
  )
}

