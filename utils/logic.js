// generate random number including min and max

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// returns the possible combinations that a player can win depending on the game_type (3x3, 4x4, 5x5)

function winnerPatterns(game_type) {
	var wins = Array()

	// 3 x 3 winning patterns;
	if (game_type === 3)
		wins = [
			[11, 12, 13],
			[21, 22, 23],
			[31, 32, 33],
			[11, 21, 31],
			[12, 22, 32],
			[13, 23, 33],
			[11, 22, 33],
			[13, 22, 31],
		]

	// 4 x 4 winning patterns;
	if (game_type === 4)
		wins = [
			[11, 12, 13],
			[12, 13, 14],
			[21, 22, 23],
			[22, 23, 24],
			[31, 32, 33],
			[32, 33, 34],
			[41, 42, 43],
			[42, 43, 44],
			[11, 21, 31],
			[21, 31, 41],
			[12, 22, 32],
			[12, 23, 34],
			[22, 32, 42],
			[13, 23, 33],
			[13, 22, 31],
			[23, 33, 43],
			[14, 24, 34],
			[24, 34, 44],
			[14, 23, 32],
			[23, 32, 41],
			[11, 22, 33],
			[22, 33, 44],
			[21, 32, 43],
			[24, 33, 42],
		]

	// 5 x 5 winning patterns;
	if (game_type === 5)
		wins = [
			[11, 12, 13],
			[12, 13, 14],
			[13, 14, 15],
			[21, 22, 23],
			[22, 23, 24],
			[23, 24, 25],
			[31, 32, 33],
			[32, 33, 34],
			[33, 34, 35],
			[41, 42, 43],
			[42, 43, 44],
			[43, 44, 45],
			[51, 52, 53],
			[52, 53, 54],
			[53, 54, 55],
			[11, 21, 31],
			[21, 31, 41],
			[31, 41, 51],
			[12, 22, 32],
			[12, 23, 34],
			[23, 34, 45],
			[22, 32, 42],
			[32, 42, 52],
			[13, 23, 33],
			[13, 22, 31],
			[13, 24, 35],
			[23, 33, 43],
			[33, 43, 53],
			[14, 24, 34],
			[24, 34, 44],
			[34, 44, 54],
			[14, 23, 32],
			[23, 32, 41],
			[15, 25, 35],
			[25, 35, 45],
			[35, 45, 55],
			[11, 22, 33],
			[22, 33, 44],
			[33, 44, 55],
			[21, 32, 43],
			[32, 43, 54],
			[24, 33, 42],
			[33, 42, 51],
			[15, 24, 33],
			[25, 34, 43],
			[34, 43, 52],
			[35, 44, 53],
			[31, 42, 53],
		]
	return wins
}

// Robot patterns, for auto players of every game board
function DefaultRobotPatterns(game_type) {
	var robot_turns = Array()

	// 3 x 3 winning patterns;
	if (game_type === 3) robot_turns = [22, 11, 33, 13, 21, 23, 12, 32, 31]

	// 4 x 4 winning patterns;
	if (game_type === 4) {
		robot_turns = [
			randomBetween(21, 23),
			randomBetween(31, 32),
			randomBetween(33, 34),
			34,
			24,
			43,
			42,
			41,
			31,
			21,
			12,
			13,
			14,
			44,
			33,
			randomBetween(22, 23),
			11,
		]
	}

	// 5 x 5 winning patterns;
	if (game_type === 5) {
		robot_turns = [
			randomBetween(22, 24),
			randomBetween(21, 23),
			randomBetween(33, 34),
			32,
			43,
			42,
			54,
			52,
			randomBetween(53, 55),
			25,
			45,
			35,
			21,
			31,
			41,
			51,
			12,
			13,
			14,
			15,
			55,
			44,
			33,
			randomBetween(22, 23),
			11,
		]
	}
	return robot_turns
}

function getGameType(board) {
	if (board.length === 9) {
		return 3
	} else if (board.length === 16) {
		return 4
	} else if (board.length === 25) {
		return 5
	}
}

function getIndexFromPattern(game_type, matrix) {
	// convert to linear index(0, 1, 2) from matrix type of index(11, 22, 33)
	// so 11 = 0, 12 = 1, 22 = 4, 32 = 7

	const row = Number(String(matrix).slice(0, 1)) - 1
	const col = Number(String(matrix).slice(1, 2)) - 1
	let multiplier
	if (game_type === 3) {
		multiplier = 3
	} else if (game_type === 4) {
		multiplier = 4
	} else if (game_type === 5) {
		multiplier = 5
	}
	return row * multiplier + col
}

// Check if the player with the symbol(x, o, y, t) won...

exports.checkGameWin = (board, symbol) => {
	let game_type = getGameType(board)
	let win_patterns = winnerPatterns(game_type)
	for (let x = 0; x < win_patterns.length; x++) {
		const win = isWinner(game_type, win_patterns[x], board, symbol)
		if (win) {
			return true
		}
	}
}

exports.checkGameDraw = board => {
	// game is draw if the board is fully filled...
	const totalMarked = board.filter(grid => grid != '').length
	if (board.length === totalMarked) {
		return true
	}
	return false
}

// Verifying each selections with winning pattern
function isWinner(game_type, win_pattern, board, symbol) {
	let match = 0
	for (let x = 0; x < win_pattern.length; x++) {
		let y = getIndexFromPattern(game_type, win_pattern[x])
		if (board[y] === symbol) {
			match++
		}
	}

	if (match === win_pattern.length) return true
	return false
}

// Getting most nearest winning and lossing pattern
function getAutoTurnPattern(game_type) {
	var pattern = []
	if (game_type === 3) {
		pattern = getMostNearestPattern('O')
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern('X')
			if (pattern.length <= 0) {
				pattern = DefaultRobotPatterns(game_type)
			}
		}
	} else if (game_type === 4) {
		pattern = getMostNearestPattern('O')
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern('X')
			if (pattern.length <= 0) {
				pattern = getMostNearestPattern('Y')
				if (pattern.length <= 0) {
					pattern = DefaultRobotPatterns(game_type)
				}
			}
		}
	} else {
		pattern = getMostNearestPattern('O')
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern('X')
			if (pattern.length <= 0) {
				pattern = getMostNearestPattern('Y')
				if (pattern.length <= 0) {
					pattern = getMostNearestPattern('T')
					if (pattern.length <= 0) {
						pattern = DefaultRobotPatterns(game_type)
					}
				}
			}
		}
	}
	return pattern
}

// Getting most applicable pattern for any player
function getMostNearestPattern(selections, turn) {
	var selected = selections[turn].sort()
	var win_patterns = winnerPatterns()

	finished = false
	for (var x = 0; x < win_patterns.length; x++) {
		var intersected = intersectionArray(selected, win_patterns[x])

		if (intersected.length === win_patterns[x].length - 1) {
			// if any position is found empty then return that pattern; otherwise will check another one from list
			for (var y = 0; y < win_patterns[x].length; y++) {
				obj = document.getElementById(win_patterns[x][y])
				if (obj.value === '' || obj.value === ' ') {
					// Return pattern if got an empty; otherwise will match others
					return win_patterns[x]
				}
			}
		}
	}
	return []
}

// Return intersaction result by comparing
// Players' turns and Winning patterns
function intersectionArray(x, y) {
	var response = []
	for (var i = 0; i < x.length; i++) {
		for (var z = 0; z < y.length; z++) {
			if (x[i] === y[z]) {
				response.push(x[i])
				break
			}
		}
	}
	return response
}
