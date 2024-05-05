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

const testData = [
	{
		matrix: [
			[0, 0, 1, 0, 0],
			[0, 1, 0, 1, 0],
			[1, 0, 0, 0, 1],
			[0, 1, 0, 1, 0],
			[0, 0, 1, 0, 0],
		],
		valid: true,
	},
	{
		matrix: [
			[1, 0, 0, 0, 1],
			[0, 1, 0, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 1, 0, 1, 0],
			[1, 0, 0, 0, 1],
		],
		valid: false,
	},
	{
		matrix: [
			[0, 0, 1, 0, 0],
			[0, 1, 0, 1, 0],
			[1, 0, 1, 0, 1],
			[0, 1, 0, 1, 0],
			[0, 0, 1, 0, 0],
		],
		valid: true,
	},
	{
		matrix: [
			[0, 0, 0, 0, 0],
			[0, 1, 0, 1, 0],
			[0, 0, 1, 0, 0],
			[0, 1, 0, 1, 0],
			[0, 0, 0, 0, 0],
		],
		valid: false,
	},
	{
		matrix: [
			[0, 0, 1, 0, 0],
			[0, 1, 0, 1, 0],
			[1, 0, 1, 0, 1],
			[0, 1, 0, 1, 0],
			[0, 0, 1, 0, 0],
		],
		valid: false,
	},
]

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function html(tag, body, attr = "") {
	//body = body.split().join("")
	return "<" + tag + " " + attr + ">" + body + "</" + tag + ">"
}

function htmlTable(matrix) {
	const rows = matrix.length
	let output = ""
	for (let r = 0; r < rows; r++) {
		const row = matrix[r]
		for (let c = 0; c < row.length; c++) {
			const i = Math.floor(Math.random() * alpha.length)
			if (matrix[r][c] == 1) {
				output += html("td", "", 'class="black"')
			} else {
				output += html("td", alpha[i], 'class="white"')
			}
		}
		output = html("tr", "" + output)
	}
	output = html("table", "" + output)

	return output
}

for (let i = 0; i < testData.length; i++) {
	document.writeln(htmlTable(testData[i].matrix) + "<br/>")
}
