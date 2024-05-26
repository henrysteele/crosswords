import { cloneMatrix, transpose } from "./helpers"
import bigListOfWords from "./listofwords"
export const usedWords = []

let listOfWords = bigListOfWords.filter(
	// 3 or more letters and atleast one vowel
	(word) =>
		word.length > 2 && /[aeiouy]/.test(word) && /^[a-zA-Z]+$/.test(word)
)

export function shuffle(list) {
	const newList = []
	while (list.length) {
		const j = Math.floor(Math.random() * list.length)
		const temp = list.splice(j, 1)[0]
		newList.push(temp)
	}
	return newList
}

export function findWords(w_rd, maxLength = w_rd.length) {
	const regx = new RegExp(w_rd.replaceAll("_", "."), "gi")
	return listOfWords
		.filter((word) => word.length == maxLength)
		.filter((word) => word.match(regx))
}

function findUnusedWords(w_rd, maxLength) {
	return findWords(w_rd, maxLength).filter(
		(word) => !usedWords.includes(word)
	)
}

function randomWords(w_rd, maxLength) {
	return shuffle(findUnusedWords(w_rd, maxLength))
}

function randomWord(w_rd, maxLength) {
	return randomWords(w_rd, maxLength)[0] || ""
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
	w_rd = randomWord(w_rd)

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

function isAlpha(ch) {
	return ch >= "a" && ch <= "z"
}

export function fillMatrix(m) {
	// fill with random sized words
	for (let i = 0; i < 2; i++) {
		for (let row of m) {
			for (let c = 0; c < row.length; c++) {
				c = fillWord(row, c)
			}
			// for (let c = 1; c < row.length - 1; c++) {
			// 	if (isAlpha(row[c])) {
			// 		if (row[c - 1] == "1") row[c - 1] = "2"
			// 		if (row[c + 1] == "1") row[c + 1] = "2"
			// 	}
			// }
		}
		transpose(m)
	}

	// fill blanks, try 2 x the max number of words(4) per row  2/4 = 1/2
	for (let i = 0; i < m.length; i++) {
		for (let r = 0; r < m.length; r += 2) {
			let row = m[r]
			m[r] = fillBlanks(row.join("")).split("")
		}
		transpose(m)
	}

	// convert placeholders back to 1s
	for (let r = 0; r < m.length; r++) {
		let row = m[r]
		for (let c = 0; c < row.length; c++) {
			const ch = row[c]
			if (!isAlpha(ch)) row[c] = "1"
		}
	}

	return m
}

// given "...d.g..s...ac..."
// return  [ ...d, ...d.g., ...d.g..s.., ...d.g..s...ac...,
//        g..s.., g..s...ac...,
//        .s..,.s...ac...,
//        ..ac... ]
// }
function dotCombos(str) {
	const parts = str.split(".") // Split into segments separated by .
	const combinations = []

	for (let i = 0; i < parts.length; i++) {
		for (let j = i + 1; j <= parts.length; j++) {
			const combo = parts.slice(i, j).join(".")
			//if (combo.length > 2 && /[a-z]/i.test(combo)) {
			if (combo.length > 2) {
				combinations.push(combo)
			}
		}
	}
	const dots = [...new Set(combinations)].sort((a, b) => b.length - a.length)

	return dots.sort((a, b) => b.length - a.length) // longest first
}

function fillBlanks(w_rd) {
	//if (!w_rd.includes("_")) return w_rd

	// replace all _s and 1s with ., so we maximize the probability of filling the row
	// this will compromise symmetry in favor of more words
	const dots = w_rd.replaceAll(/[_1]/g, ".") // "...d.g..s...ac..."

	// find all the possible words given the patterns in dots
	let word = ""
	let regx = ""
	for (regx of dotCombos(dots)) {
		word = randomWord(regx)
		if (word.length) break
	}

	if (!word.length) return w_rd

	// replace with the longest word we've found in dictionary
	let result = dots
		.replace(regx, word)
		.replace(new RegExp(`\.${word}`), "2" + word)
		.replace(new RegExp(`${word}\.`), word + "2")

	if (!word.includes("_")) usedWords.push(word)

	// replace remaining dots with _s
	result = result.replaceAll(".", "1")

	console.log({ fillBlanks: w_rd, dots, combo: regx, result })
	return result
}

fillBlanks("b_u_b_r_l_a_m_d_j_o")
