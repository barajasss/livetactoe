const {
	addPlayer,
	setRandomPlayerTurn,
	setNextPlayerTurn,
	getPlayerFromSocketId,
	removeRoom,
	markSymbol,
	getRoomById,
} = require('./room.controller')

const { MAX_TIMEOUT } = require('../models/rooms')

const { RoomTypes } = require('../models/rooms')

const { checkGameWin, checkGameDraw } = require('../utils/logic')

/**
 * Starts the game by setting up the timers and also the playerTurn...
 */

const setRoomTimeout = (io, room) => {
	const { roomId } = room
	room.timeout = MAX_TIMEOUT
	io.to(roomId).emit('timeout', room.timeout)

	clearInterval(room.timeoutId)

	// set a new interval
	room.timeoutId = setInterval(() => {
		// this function will run continuously every second
		if (room.timeout <= 1) {
			room.timeout = MAX_TIMEOUT
			playerTurn = setNextPlayerTurn(roomId)
			io.to(roomId).emit('turn', playerTurn)
		} else {
			room.timeout--
		}
		io.to(roomId).emit('timeout', room.timeout)
	}, 1000)
}

const startGame = (io, room) => {
	const { roomId } = room
	io.to(roomId).emit('game_started')
	let playerTurn = setRandomPlayerTurn(roomId)
	// inform all the players on whose turn it is
	io.to(roomId).emit('turn', playerTurn)

	// set up timers
	setRoomTimeout(io, room)
}

exports.createPlayer = (io, socket) => (player, roomType = 'TWO_PLAYER') => {
	// create a player and match with any waiting player.
	let newPlayer = {
		...player,
		socketId: socket.id,
	}
	const room = addPlayer(roomType, newPlayer)
	const { roomId, players } = room
	newPlayer = players.find(player => player.socketId === newPlayer.socketId)
	socket.join(roomId)

	console.log(newPlayer)

	socket.emit('player_registered', newPlayer)
	io.to(roomId).emit('player_joined', players)

	if (roomType === RoomTypes.TWO_PLAYER && players.length === 2) {
		startGame(io, room)
	} else if (roomType === RoomTypes.THREE_PLAYER && players.length === 3) {
		startGame(io, room)
	} else if (roomType === RoomTypes.FOUR_PLAYER && players.length === 4) {
		startGame(io, room)
	}
}

exports.playTurn = (io, socket) => (player, gridIndex) => {
	// broadcast the played turn to other players.
	console.log('play_turn')
	const { roomId, name } = player

	// mark the symbol on the board...
	const board = markSymbol(roomId, gridIndex, player.symbol)
	socket.to(roomId).emit('turn_played', player, gridIndex)

	// reset the timers
	const room = getRoomById(roomId)
	setRoomTimeout(io, room)

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
	const room = getRoomById(player.roomId)
	clearInterval(room.timeoutId)
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
	const room = getRoomById(player.roomId)
	clearInterval(room.timeoutId)
	removeRoom(player.roomId)
}

exports.disconnect = (io, socket) => () => {
	const player = getPlayerFromSocketId(socket.id)
	if (player) {
		// only broadcast the disconnect info if the player was found
		socket.to(player.roomId).emit('player_left', player)
	}
}
