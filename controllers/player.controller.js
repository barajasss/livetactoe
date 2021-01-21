const {
	RoomTypes,
	addPlayer,
	getPlayerTurn,
	setNextPlayerTurn,
	getPlayerFromSocketId,
	removeRoom,
	markSymbol,
} = require('./room.controller')

const { checkGameWin, checkGameDraw } = require('../utils/game')

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

	// mark the symbol on the board...
	const board = markSymbol(roomId, gridIndex, player.symbol)
	socket.to(roomId).emit('turn_played', player, gridIndex)
	console.log(board)
	if (checkGameWin(board, player.symbol)) {
		return gameWon(io, player)
	}
	if (checkGameDraw(board)) {
		return gameDraw(io, player)
	}

	const playerTurn = setNextPlayerTurn(roomId)

	io.to(roomId).emit('turn', playerTurn)
}

/**
 * Broadcast winner data to all the players.
 * @param {Socket Object} io To broadcast the winner to all the players.
 * @param {Object} player To send the winning player information.
 */

function gameWon(io, player) {
	io.in(player.roomId).emit(
		'game_over',
		{
			message: `${player.name} won the game...`,
		},
		player
	)
	removeRoom(player.roomId)
}

/**
 * Broadcast game draw data to all the players.
 * @param {Socket Object} io To broadcast the winner to all the players.
 * @param {Object} player To send the winning player information.
 */
function gameDraw(io, player) {
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
	}
}
