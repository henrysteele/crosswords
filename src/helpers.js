import Typo from "typo-js"

export function cloneMatrix(m) {
  return JSON.parse(JSON.stringify(m))
}

export function transpose(matrix) {
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      const temp = matrix[i][j]
      matrix[i][j] = matrix[j][i]
      matrix[j][i] = temp
    }
  }
  return matrix
}

var dictionary = new Typo("en_US", false, false, {
  dictionaryPath: "/node_modules/typo-js/dictionaries",
})

export const listOfWords = [
  ...new Set( // unique words
    Object.keys(dictionary.dictionaryTable)
      .filter((word) => !word.includes("'")) // no words
      .filter((word) => !word.match(/[\d]/gi)) // no numbers
      .map((word) => word.toUpperCase()) // uppercase
  ),
]

export function findWords(w_rd) {
  const regx = new RegExp(w_rd.replaceAll("_", "."), "gi")
  return listOfWords
    .filter((word) => word.length == w_rd.length)
    .filter((word) => word.match(regx))
}

export function excludeWords(list, excludes) {
  return list.filter((word) => !excludes.includes(word))
}

// var is_spelled_correctly = dictionary.check("mispelled")
// var array_of_suggestions = dictionary.suggest("dgg", 20)
// const longWords = {}
// for (let i = 10; i < 30; i++) {
// 	longWords[i + " chars"] = listOfWords.filter((word) => word.length == i)
// }

// console.log({
// 	is_spelled_correctly,
// 	array_of_suggestions,
// 	listOfWords,
// 	longWords,
// })
