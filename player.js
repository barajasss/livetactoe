// each player is an object with socket id
let players = [
	// each player is an object with an socket id and opponent object
	// {
	//     id: socket.id,
	//     opponent: null
	// }
]

exports.addPlayer = player => {
	players = [...players, player]
	return player
}

exports.removePlayer = playerId => {
	const player = players.find(player => player.id === playerId)
	players = players.filter(player => player.id !== playerId)
	return player
}

exports.getOpponent = ({ id }) => {
	// search for an idle player
	const opponent = players.find(
		player => player.id !== id && !player.opponent
	)
	if (opponent) {
		opponent.symbol = 'o'
	}
	return opponent
}
