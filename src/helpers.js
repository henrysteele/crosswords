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
