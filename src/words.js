import { findWords, cloneMatrix, transpose, count, shuffle } from "./helpers"
const usedWords = []

function choosePossibleWord(w_rd) {
  //Try to find good, unused words
  const possibleWords = shuffle(findWords(w_rd))
  for (let word of possibleWords) {
    if (!usedWords.includes(word)) {
      w_rd = word
      break
    }
    console.log({ w_rd, possibleWords })
  }
  return w_rd
}

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
  w_rd = choosePossibleWord(w_rd)
  const _count = count(w_rd, "_")
  if (_count && _count < 3 && w_rd.length < 7) {
    for (let c = startIndex; c < row.length; c++) {
      if (row[c] == 1) break
      if (w_rd[c - startIndex] == "_") {
        row[c] = 1
      }
    }
    return startIndex
  } else if (_count > 0) {
    don't split in half, step thru each underscore at a time 
    and try to form a word to the left of that underscore
    until you either have a list of words or 1s
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
