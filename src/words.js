import { findWords, cloneMatrix, transpose } from "./helpers"
const usedWords = []

function fillWord(row, startIndex, colStart) {
  if (row[startIndex] == 1) return startIndex //Not a blank
  if (row[startIndex - 1] == 0) return startIndex //Not at beginning
  if (row[startIndex + 1] == 1) return startIndex // Not a horizontal word
  if (row[startIndex + 1] == undefined) return startIndex // Not a horizontal

  let w_rd = ""

  //intializes the w_rd given the zeros in matrix
  for (let c = startIndex; c < row.length; c++) {
    if (row[c] == 1) break
    w_rd += row[c] || "_" //remember the nonzero value; replaces zeros with underscores
  }
  //Try to find good, unused words
  const possibleWords = findWords(w_rd)
  for (let word of possibleWords) {
    if (!usedWords.includes(word)) {
      w_rd = word
      break
    }
    console.log({ w_rd, possibleWords })
  }

  //Save used word once
  if (!usedWords.includes(w_rd)) {
    usedWords.push(w_rd)
  }

  //Adding word to row
  for (let i = 0; i < w_rd.length; i++) {
    row[startIndex + i] = w_rd[i]
  }
  console.log({ fillWord: w_rd, row: row, usedWords })
  return startIndex + w_rd.length
}

export function fillMatrix(m) {
  for (let row of m) {
    for (let c = 0; c < row.length; c++) {
      c = fillWord(row, c)
      // console.log({ fillMatrix: row, m })
    }
  }
  transpose(m)
  for (let row of m) {
    for (let c = 0; c < row.length; c++) {
      c = fillWord(row, c)
      console.log({ fillMatrix: row, m })
    }
  }
  return m
}
