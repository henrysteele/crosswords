//const { GoogleGenerativeAI } = require("@google/generative-ai")

// Access your API key as an environment variable (see "Set up your API key" above)
// const x = "AI.za-Sy.BhZ-9Y.0Pv-rfk4.VCP-J5.1A2-tXT.1w5-3I.OY-81.g"
// const genAI = new GoogleGenerativeAI(x.split(".").join("").split("-").join(""))

// async function run() {
// 	// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
// 	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// 	const prompt = "Write a story about a magic backpack."

// 	const result = await model.generateContent(prompt)
// 	const response = await result.response
// 	const text = response.text()
// 	console.log(text)
// }

//run();

export default function prompt(props) {
	// create funny crossword style hints about sharks in the following json

	return {
		across: {
			1: {
				word: "tooted",
				hint: "What a shark did when it passed gas?",
			},
			4: {
				word: "rux",
				hint: "The Latin plural of a shark's favorite game, Rex",
			},
			5: {
				word: "eurous",
				hint: "Describes a shark feeling lucky after winning the lotto",
			},
			8: {
				word: "exrupeal",
				hint: "A shark's rash after a bad encounter with a jellyfish",
			},
			9: {
				word: "digitals",
				hint: "What a tech-savvy shark uses to browse the ocean web",
			},
			13: {
				word: "stalinism",
				hint: "A political ideology followed by a communist hammerhead shark",
			},
			15: {
				word: "piosities",
				hint: "How a devout shark describes its prayers to the Codfather",
			},
			17: {
				word: "bronchomucormycosis",
				hint: "What a doctor shark might diagnose when a patient has a nasty cough and gills",
			},
			20: {
				word: "eth",
				hint: "Old English for a shark's tooth, as in, 'Beware his sharp eth!'",
			},
			21: {
				word: "korec",
				hint: "A unit of currency used in Atlantis, featuring a shark on the bill",
			},
			22: {
				word: "lench",
				hint: "What a shark does when it's feeling shy and wants to avoid attention",
			},
			23: {
				word: "ids",
				hint: "What a shark therapist helps its patients confront",
			},
			24: {
				word: "uts",
				hint: "The musical notes a shark choir sings",
			},
			26: {
				word: "gaums",
				hint: "What a clumsy shark might trip over on the ocean floor",
			},
			27: {
				word: "cymas",
				hint: "A group of flower-like creatures a shark might give to its valentine",
			},
			29: {
				word: "woa",
				hint: "What a surprised shark might say when it sees a scuba diver",
			},
			31: {
				word: "sternocleidomastoid",
				hint: "A muscle a shark might strain while headbanging to heavy metal under the sea",
			},
			34: {
				word: "cellarets",
				hint: "Where a sophisticated shark stores its collection of vintage kelp",
			},
			36: {
				word: "dentinoid",
				hint: "A type of tooth enamel that makes sharks the envy of the deep-sea dentist community",
			},
			37: {
				word: "mutinize",
				hint: "What a crew of rebellious sharks might do to their captain",
			},
			40: {
				word: "meristem",
				hint: "The growing part of a plant, or what a hungry shark might say before dinner: 'More is stem!'",
			},
			43: {
				word: "minors",
				hint: "Young sharks not old enough to drive the school bus",
			},
			44: {
				word: "nab",
				hint: "What a shark might do to a tasty-looking fish",
			},
			45: {
				word: "tankle",
				hint: "The annoying noise a shark's jewelry makes when it swims",
			},
		},
		down: {
			2: {
				word: "tau",
				hint: "The Greek letter that looks like a shark swimming sideways",
			},
			3: {
				word: "dieri",
				hint: "A shark's response when asked if it wants to try sushi: 'Die? Really?'",
			},
			4: {
				word: "rel",
				hint: "Short for 'relative,' what a baby shark calls its uncle",
			},
			6: {
				word: "rit",
				hint: "A fancy shark's way of saying 'right'",
			},
			7: {
				word: "unl",
				hint: "A lazy shark's way of saying 'until'",
			},
			9: {
				word: "dipso",
				hint: "A shark who's had one too many fermented krill cocktails",
			},
			10: {
				word: "goodman",
				hint: "What a well-behaved shark is called",
			},
			11: {
				word: "usable",
				hint: "How a resourceful shark describes leftover chum",
			},
			12: {
				word: "ostsis",
				hint: "The plural of 'ost,' the bone found in a shark's ear",
			},
			14: {
				word: "azoth",
				hint: "A mysterious substance alchemists believe can turn sharks into gold",
			},
			16: {
				word: "issei",
				hint: "The Japanese word for 'first generation,' often used to describe immigrant sharks",
			},
			18: {
				word: "oer",
				hint: "What a shark might say when it wants to go faster: 'Oer the top!'",
			},
			19: {
				word: "uncaste",
				hint: "A society where all sharks are equal, regardless of their breed",
			},
			22: {
				word: "lucid",
				hint: "How a shark feels after a refreshing kelp smoothie",
			},
			24: {
				word: "unsick",
				hint: "How a shark feels after a visit to Dr. Gill",
			},
			25: {
				word: "steel",
				hint: "A metal a shark might use to build its underwater mansion",
			},
			26: {
				word: "gunja",
				hint: "A type of Indian hemp a shark might use to make a relaxing tea",
			},
			28: {
				word: "sesti",
				hint: "A unit of currency used in ancient Rome, featuring a shark gladiator on the coin",
			},
			29: {
				word: "whoso",
				hint: "Old English for 'whoever,' as in, 'Whoso dares enter my reef...'",
			},
			30: {
				word: "audads",
				hint: "Sheep-like animals a landlocked shark might dream of chasing",
			},
			32: {
				word: "chevies",
				hint: "What a group of sharks might do to their prey",
			},
			33: {
				word: "minaret",
				hint: "A tower on a mosque, or where a religious shark might go to pray",
			},
			35: {
				word: "skein",
				hint: "A length of yarn, or what a confused shark might say instead of 'skin'",
			},
			36: {
				word: "demob",
				hint: "To discharge from military service, or what a shark might do to a clam",
			},
			38: {
				word: "uni",
				hint: "A type of sushi a shark might enjoy (but only if it's made with tuna!)",
			},
			39: {
				word: "ido",
				hint: "A universal language spoken by all sharks, regardless of their accent",
			},
			41: {
				word: "sen",
				hint: "A Japanese coin, or what a shark might charge for a ride on its fin",
			},
			42: {
				word: "efl",
				hint: "English as a Foreign Language, or what a shark might need to learn before studying abroad",
			},
		},
	}
}
