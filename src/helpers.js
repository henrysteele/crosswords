import Typo from "typo-js"

function badRow(row) {
	// a good row has words with 3 or more zeros and no more than 20 e.g. 10001
	const str = "1" + row.join("") + "1" //ensure the row has at least one 1 on either end
	const bad =
		// str.includes("101") || // valid if it's part of a vertical word
		str.includes("1001") || // and it's bad if there are any 00s
		str.includes("100000000000000000001") // no more than 20 characters either
	return bad
}

function transpose(matrix) {
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < i; j++) {
			const temp = matrix[i][j]
			matrix[i][j] = matrix[j][i]
			matrix[j][i] = temp
		}
	}
}

function badMatrix(matrix) {
	// test every row
	for (let row of matrix) {
		const bad = badRow(row)
		if (bad) return true
	}

	// test every column by transposing the matrix first and then checking rows
	const transposed = transpose(matrix)
	for (let row of transposed) {
		const bad = badRow(row)
		if (bad) return true
	}

	return false
}

var dictionary = new Typo("en_US", false, false, {
	dictionaryPath: "/node_modules/typo-js/dictionaries",
})

export const listOfWords = [
	...new Set( // unique words
		Object.keys(dictionary.dictionaryTable)
			.filter((word) => !word.includes("'")) // no word's
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
