const {
	THREE_WIN_PATTERNS,
	FOUR_WIN_PATTERNS,
	FIVE_WIN_PATTERNS,
	THREE_ROBOT_TURNS,
	FOUR_ROBOT_TURNS,
	FIVE_ROBOT_TURNS,
} = require('../models/game')

// generate random number including min and max

// returns the possible combinations that a player can win depending on the game_type (3x3, 4x4, 5x5)

function getWinnerPatterns(game_type) {
	let wins = Array()

	// 3 x 3 winning patterns;
	if (game_type === 3) wins = THREE_WIN_PATTERNS

	// 4 x 4 winning patterns;
	if (game_type === 4) wins = FOUR_WIN_PATTERNS

	// 5 x 5 winning patterns;
	if (game_type === 5) wins = FIVE_WIN_PATTERNS
	return wins
}

// Robot patterns, for auto players of every game board
function DefaultRobotPatterns(game_type) {
	let robot_turns = Array()

	// 3 x 3 winning patterns;
	if (game_type === 3) robot_turns = THREE_ROBOT_TURNS

	// 4 x 4 winning patterns;
	if (game_type === 4) {
		robot_turns = FOUR_ROBOT_TURNS
	}

	// 5 x 5 winning patterns;
	if (game_type === 5) {
		robot_turns = FIVE_ROBOT_TURNS
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

/**
 * Selection array contains all the matrix type of notations marked by the user with that symbol
 */

function createSelectionArray(board, symbol) {
	const selectionArray = []
	const game_type = getGameType(board)
	for (let i = 0; i < board.length; i++) {
		if (board[i] === symbol) {
			const pattern = getPatternFromIndex(game_type, i)
			selectionArray.push(pattern)
		}
	}
	return selectionArray
}

function getPatternFromIndex(game_type, index) {
	// convert to matrix type of index(11, 22, 33) from linear index(0, 1, 2)
	const row = Math.floor(index / game_type) + 1
	const col = (index % 3) + 1
	return Number(`${row}${col}`)
}

function getIndexFromPattern(game_type, matrix) {
	// convert to linear index(0, 1, 2) from matrix type of index(11, 22, 33)
	// so 11 = 0, 12 = 1, 22 = 4, 32 = 7

	const row = Number(String(matrix).slice(0, 1)) - 1
	const col = Number(String(matrix).slice(1, 2)) - 1
	return row * game_type + col
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

	if (match === win_pattern.length) {
		// update win pattern with array indexes...
		win_pattern = win_pattern.map(wp => getIndexFromPattern(game_type, wp))
		return win_pattern
	}
	return false
}

// Getting most nearest winning and lossing pattern
exports.getAutoTurnPattern = board => {
	const game_type = getGameType(board)
	let pattern = []
	if (game_type === 3) {
		pattern = getMostNearestPattern(board, 'O')
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern(board, 'X')
			if (pattern.length <= 0) {
				pattern = DefaultRobotPatterns(game_type)
			}
		}
	} else if (game_type === 4) {
		pattern = getMostNearestPattern(board, 'O')
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern(board, 'X')
			if (pattern.length <= 0) {
				pattern = getMostNearestPattern(board, 'Y')
				if (pattern.length <= 0) {
					pattern = DefaultRobotPatterns(game_type)
				}
			}
		}
	} else {
		pattern = getMostNearestPattern(board, 'O')
		if (pattern.length <= 0) {
			pattern = getMostNearestPattern(board, 'X')
			if (pattern.length <= 0) {
				pattern = getMostNearestPattern(board, 'Y')
				if (pattern.length <= 0) {
					pattern = getMostNearestPattern(board, 'T')
					if (pattern.length <= 0) {
						pattern = DefaultRobotPatterns(game_type)
					}
				}
			}
		}
	}
	for (var x = 0; x < pattern.length; x++) {
		const index = getIndexFromPattern(game_type, pattern[x])
		if (board[index] === '' || !board[index]) {
			return index
		}
	}
}

// Getting most applicable pattern for any player

function getMostNearestPattern(board, symbol) {
	const game_type = getGameType(board)

	let selected = createSelectionArray(board, symbol)
	let win_patterns = getWinnerPatterns(game_type)

	for (let x = 0; x < win_patterns.length; x++) {
		let intersected = intersectionArray(selected, win_patterns[x])

		if (intersected.length === win_patterns[x].length - 1) {
			// if any position is found empty then return that pattern; otherwise will check another one from list
			for (let y = 0; y < win_patterns[x].length; y++) {
				/** start of update */
				let index = getIndexFromPattern(game_type, win_patterns[x][y])
				/** end of update */
				if (board[index] === '' || board[index] === ' ') {
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
	let response = []
	for (let i = 0; i < x.length; i++) {
		for (let z = 0; z < y.length; z++) {
			if (x[i] === y[z]) {
				response.push(x[i])
				break
			}
		}
	}
	return response
}

/**
 *  EXPORTS
 */

// Check if the player with the symbol(x, o, y, t) won...

// exports.getRobotMove = (board, symbol) => {
// 	let game_type = getGameType(board)
// }

exports.checkGameWin = (board, symbol) => {
	let game_type = getGameType(board)
	let win_patterns = getWinnerPatterns(game_type)
	for (let x = 0; x < win_patterns.length; x++) {
		const win_pattern = isWinner(game_type, win_patterns[x], board, symbol)
		if (win_pattern) {
			return win_pattern
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
