import { cloneMatrix, transpose } from "./matrix"
import bigListOfWords from "./listofwords"
import { crosswords, logger } from "./App"
export const usedWords = []
const maxWord = 3

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

// todo: convert listOfWords to a dictionary per word length, shuffled once - optimize

export function findWords(w_rd, maxLength = w_rd.length) {
	let regx = w_rd.replaceAll("_", ".")
	let dots = regx.replaceAll(/[^\\.]/g, "") // total dots only, e.g. replace ... with \w{3}
	while (dots.length) {
		if (dots.length > 1) {
			regx = regx.replace(dots, "\\w{" + dots.length + "}")
			dots = dots.slice(0, dots.length - 1)
		} else {
			regx = regx.replace(dots, "\\w")
			break
		}
	}
	regx = new RegExp(regx, "gi")
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

function isAlpha(ch) {
	return ch >= "a" && ch <= "z"
}

export function fillMatrix(m) {
	//crosswords.push(cloneMatrix(m))

	// find words to fill gaps
	for (let i = 0; i < m.length / maxWord + 1; i++) {
		for (let r = 0; r < m.length; r += 2) {
			// every other row, avoids parallel words
			let row = m[r]
			m[r] = fillBlanks(row.join("")).split("")
		}
		//crosswords.push(cloneMatrix(m))
		transpose(m)
	}

	for (let i = 0; i < m.length / maxWord + 1; i++) {
		for (let r = 0; r < m.length; r += 2) {
			let row = m[r]
			// every other row, avoids parallel words
			let w_rd = row.join("").replace("1", ".")
			m[r] = fillBlanks(w_rd, true).split("")
		}
		//crosswords.push(cloneMatrix(m))
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

function fillBlanks(w_rd, findSmallWords = false) {
	w_rd = w_rd.replace(/[ _0]/g, ".")
	if (!w_rd.includes(".")) return w_rd

	const parts = w_rd.split(/[12]+/g)
	for (let part of parts) {
		if (!part.includes(".")) continue
		const word = randomWord(part)
		if (word) {
			usedWords.push(word)
			w_rd = w_rd.replace(part, word)
			w_rd = w_rd.replace(new RegExp("1" + word), "2" + word)
			w_rd = w_rd.replace(new RegExp(word + "1"), word + "2")
			//logger({ fillBlanks: w_rd, word, part })
		}
	}

	if (findSmallWords) {
		w_rd = fillSmallWords(w_rd.replaceAll("1", "."))
	}

	return w_rd
}

function fillSmallWords(w_rd, recurse = 0) {
	w_rd = w_rd.replaceAll(/ _0/g, ".")
	if (!w_rd.includes(".")) return w_rd
	if (recurse > w_rd.length / maxWord) return w_rd

	const parts = w_rd.split(".") // Split into segments separated by .
	let combos = []

	for (let i = 0; i < parts.length; i++) {
		for (let j = i + 1; j <= parts.length; j++) {
			const combo = parts.slice(i, j).join(".")
			if (
				combo.length > 2 &&
				combo.includes(".") &&
				!/[\d]/.test(combo)
			) {
				combos.push(combo)
			}
		}
	}

	if (!combos.length) return w_rd

	combos = [...new Set(combos)].sort((a, b) => b.length - a.length) // longest first

	//logger({ fillSmallWords: w_rd, combos })
	for (let combo of combos) {
		const word = randomWord(combo)
		if (word) {
			//logger({ replace: w_rd, regx: combo, word })
			w_rd = w_rd.replace(combo, word)
			break
		}
	}
	return fillSmallWords(w_rd, ++recurse)
}
