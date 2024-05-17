/*

Write code that satisfies the following problem.  Use the testData below to test your solution.

Display the matrices using an html table with black and white backgrounds.

A typical American-style crossword puzzle grid is an N x N matrix with black and white squares, which obeys the following rules:

Every white square must be part of an "across" word and a "down" word.
No word can be fewer than three letters long.
Every white square must be reachable from every other white square.
The grid is rotationally symmetric (for example, the colors of the top left and bottom right squares must match).
Write a program to determine whether a given matrix qualifies as a crossword grid.


*/

export const testData = [
  {
    matrix: [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ],
    valid: true,
  },
  {
    matrix: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
    ],
    valid: true,
  },
]

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function html(tag, body, attr = "") {
  return "<" + tag + " " + attr + ">" + body + "</" + tag + ">"
}

export function htmlTable(matrix) {
  if (!matrix) return ""
  const rows = matrix.length
  let output = ""
  for (let r = 0; r < rows; r++) {
    const row = matrix[r]
    for (let c = 0; c < row.length; c++) {
      const i = Math.floor(Math.random() * alpha.length)
      if (matrix[r][c] == 1) {
        output += html("td", "", 'class="black"')
      } else {
        // output += html("td", alpha[i], 'class="white"')
        const temp = matrix[r][c] ? matrix[r][c] : ""
        output += html("td", temp, 'class="white"')
      }
    }
    output = html("tr", output)
  }
  output = html("table", output)

  return output
}
