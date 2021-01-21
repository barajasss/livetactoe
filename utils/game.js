exports.checkGameWin = (board, symbol) => {
	// only for 2 players 3x3 grid currently.
	// check horizontally
	for (let i = 0; i < 3; i += 3) {
		if (
			board[i] === symbol &&
			board[i + 1] === symbol &&
			board[i + 2] === symbol
		) {
			return true
		}
	}

	// check vertically
	for (let i = 0; i < 3; i++) {
		if (
			board[i] === symbol &&
			board[i + 3] === symbol &&
			board[i + 6] === symbol
		) {
			return true
		}
	}

	// check diagonally

	if (board[0] === symbol && board[4] === symbol && board[8] === symbol) {
		return true
	}
	if (board[2] === symbol && board[4] === symbol && board[6] === symbol) {
		return true
	}
	return false
}

exports.checkGameDraw = board => {
	// only for 2 players 3x3 grid currently.
	const totalMarked = board.filter(grid => grid != '').length
	if (board.length === totalMarked) {
		return true
	}
	return false
}
