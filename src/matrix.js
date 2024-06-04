import { logger } from "./App"

export function makeCrossWord(N = 10) {
	const matrix = createSmallCrossword(N)

	let temp = addHorizontally(matrix, flipHorizontally(matrix))
	temp = addVertically(temp, flipVertically(temp))
	temp = deleteMiddle(temp)

	return temp
}

function deleteMiddle(matrix) {
	const rows = matrix.length
	matrix.splice(rows / 2, 1)
	for (let row of matrix) {
		const cols = row.length
		row.splice(cols / 2, 1)
	}
	return matrix
}

export function cloneMatrix(m) {
	return JSON.parse(JSON.stringify(m))
}

export function sameMatrix(a, b) {
	if (!a || !b) return false
	if (a.length != b.length) return false
	for (let r = 0; r < a.length; r++) {
		for (let c = 0; c < a.length; c++) {
			if (a[r][c] != b[r][c]) return false
		}
	}
	return true
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

// creates an empty NxN matrix
export function newMatrix(rows = 4, cols = 0, value = 0) {
	if (!cols) cols = rows
	const m = []
	logger({ newMatrix: m, rows, cols, value })
	for (let r = 0; r < rows; r++) {
		m.push([])
		for (let c = 0; c < cols; c++) {
			m[r].push(value)
		}
	}
	logger({ newMatrix: m })
	return m
}

function randomRows(matrix) {
	const N = matrix.length
	const maxWidth = 10
	for (let r = 0; r < N; r += 2) {
		const width = Math.min(
			maxWidth,
			3 + Math.round(Math.random() * (N - 3))
		)
		const x = Math.round(Math.random() * (N - width))
		logger({ N, width, x })
		for (let c = x; c < x + width; c++) {
			matrix[r][c] = 0
		}
	}
	return matrix
}

export function createSmallCrossword(N = 4) {
	if (N < 4) N = 4
	const matrix = newMatrix(N, N, 1)
	logger({ createMatrix: matrix })

	return randomRows(transpose(randomRows(matrix)))
}

// returns a new matrix that is the horizontal reflection of matrix
function flipHorizontally(matrix) {
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

function flipVertically(matrix) {
	logger({ flipVertically: matrix })
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
function addHorizontally(left, right) {
	const m = []
	for (let i = 0; i < left.length; i++) {
		m.push([...left[i], ...right[i]])
	}
	return m
}

function addVertically(top, bottom) {
	const m = []
	let r
	for (r = 0; r < top.length; r++) {
		m.push([...top[r]])
	}
	logger({ addVertically1: m })
	for (r = 0; r < bottom.length; r++) {
		m.push([...bottom[r]])
	}
	logger({ addVertically2: m })
	return m
}
