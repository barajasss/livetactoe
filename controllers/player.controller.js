// const { v4 } = require('uuid')
const { addPlayer, getPlayerTurn, setNextPlayerTurn } = require('../rooms')

exports.createPlayer = (io, socket) => player => {
	// create a player and match with any waiting player.
	let newPlayer = {
		...player,
		socketId: socket.id,
	}
	const { roomId, players } = addPlayer('two-player', newPlayer)
	newPlayer = players.find(player => player.socketId === newPlayer.socketId)

	socket.join(roomId)

	socket.emit('player_registered', newPlayer)
	io.to(roomId).emit('player_joined', players)

	if (players.length === 2) {
		io.to(roomId).emit('game_started', player)
		const playerTurn = getPlayerTurn(roomId)
		io.to(roomId).emit('turn', playerTurn)
	}
}

exports.playTurn = (io, socket) => (player, gridIndex) => {
	// broadcast the played turn to other players.
	console.log('play_turn')
	const { roomId, name } = player
	console.log(roomId, player)
	socket.to(roomId).emit('turn_played', player, gridIndex)
	const playerTurn = setNextPlayerTurn(roomId)
	console.log('next player turn', playerTurn)
	io.to(roomId).emit('turn', playerTurn)
}

exports.gameWon = (io, socket) => player => {
	io.in(player.roomId).emit('game_over', {
		message: `${player.name} won the game...`,
	})
}
exports.gameDraw = (io, socket) => player => {
	io.in(player.roomId).emit('game_over', {
		message: `It is draw`,
	})
}
