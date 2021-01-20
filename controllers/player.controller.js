const {
	RoomTypes,
	addPlayer,
	getPlayerTurn,
	setNextPlayerTurn,
	getPlayerFromSocketId,
	removeRoom,
} = require('../rooms')

exports.createPlayer = (io, socket) => (player, roomType = 'TWO_PLAYER') => {
	// create a player and match with any waiting player.
	let newPlayer = {
		...player,
		socketId: socket.id,
	}
	const { roomId, players } = addPlayer(roomType, newPlayer)
	newPlayer = players.find(player => player.socketId === newPlayer.socketId)
	socket.join(roomId)
	console.log(newPlayer)
	socket.emit('player_registered', newPlayer)
	io.to(roomId).emit('player_joined', players)

	if (players.length === 2) {
		io.to(roomId).emit('game_started', player)
		const playerTurn = getPlayerTurn(roomId)
		console.log('player turn', playerTurn)
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
	io.in(player.roomId).emit(
		'game_over',
		{
			message: `${player.name} won the game...`,
		},
		player
	)
}
exports.gameDraw = (io, socket) => player => {
	io.in(player.roomId).emit(
		'game_over',
		{
			message: `It is draw`,
		},
		player
	)
	removeRoom(player.roomId)
}

exports.disconnect = (io, socket) => () => {
	const player = getPlayerFromSocketId(socket.id)
	if (player) {
		// only broadcast the disconnect info if the player was found
		socket.to(player.roomId).emit('player_left', player)
		removeRoom(player.roomId)
	}
}
