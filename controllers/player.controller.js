const {
	addPlayer,
	setRandomPlayerTurn,
	setFirstPlayerTurn,
	getPlayerTurn,
	setNextPlayerTurn,
	getPlayerFromSocketId,
	removeRoom,
	markSymbol,
	removePlayer,
} = require('./room.controller')

const { MAX_TIMEOUT, RoomTypes, GameTypes } = require('../models/rooms')

const {
	checkGameWin,
	checkGameDraw,
	getAutoTurnPattern,
} = require('../utils/logic')

const { getRoomById, getRoomType } = require('../utils/room')

/**
 * Makes a robot mark the board on behalf of the player.
 */

function playRobot(io, room) {
	const { roomId, board } = room
	let player = getPlayerTurn(roomId)
	const gridIndex = getAutoTurnPattern(board)
	markSymbol(roomId, gridIndex, player.symbol)
	io.to(roomId).emit('turn_played', player, gridIndex)

	// logs for logger client
	io.emit('log_turn_played', player, gridIndex)

	return player
}

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
			// if the player reaches the last second then robot will make its move...
			const player = playRobot(io, room)
			if (checkGameWin(room.board, player.symbol)) {
				return gameWon(io, player)
			}
			if (checkGameDraw(room.board)) {
				return gameDraw(io, player)
			}

			room.timeout = MAX_TIMEOUT
			playerTurn = setNextPlayerTurn(roomId)
			io.to(roomId).emit('turn', playerTurn)
			// logs for logger client
			io.emit('log_turn', playerTurn)
		} else {
			room.timeout--
		}
		io.to(roomId).emit('timeout', room.timeout)
	}, 1000)
}

const startGame = (io, room) => {
	const { roomId } = room

	room.gameStarted = true
	room.isFull = true

	io.to(roomId).emit('game_started', room)

	// logs for logger client
	io.emit('log_game_started', room)

	let playerTurn = setFirstPlayerTurn(roomId)
	// inform all the players on whose turn it is
	io.to(roomId).emit('turn', playerTurn)

	// logs for logger client
	io.emit('log_turn', playerTurn)

	// set up timers
	setRoomTimeout(io, room)
}

exports.startGame = startGame

exports.createPlayer = (io, socket) => (
	player,
	gameType = GameTypes.TWO_PLAYER
) => {
	// logs for logger client
	io.emit('log_join_game', player, gameType)

	// create a player and match with any waiting player.
	let newPlayer = {
		...player,
		socketId: socket.id,
		robot: false,
	}
	const roomType = getRoomType(gameType)

	const room = addPlayer(roomType, newPlayer)
	const { roomId, players } = room
	newPlayer = players.find(player => player.socketId === newPlayer.socketId)
	socket.join(roomId)

	console.log(newPlayer)

	socket.emit('player_registered', newPlayer)
	// logging for logger
	io.emit('log_player_registered', newPlayer)

	io.to(roomId).emit('player_joined', players, newPlayer)
	// logging for logger
	io.emit('log_player_joined', players, newPlayer)

	if (roomType === RoomTypes.TWO_PLAYER && players.length === 2) {
		startGame(io, room)
	} else if (roomType === RoomTypes.THREE_PLAYER && players.length === 3) {
		startGame(io, room)
	} else if (roomType === RoomTypes.FOUR_PLAYER && players.length === 4) {
		startGame(io, room)
	}
}

exports.playTurn = (io, socket) => (player, gridIndex) => {
	// logging for logger
	io.emit('log_play_turn', player, gridIndex)

	// broadcast the played turn to other players.
	console.log('play_turn')
	const { roomId, name } = player

	// mark the symbol on the board...
	const board = markSymbol(roomId, gridIndex, player.symbol)
	socket.to(roomId).emit('turn_played', player, gridIndex)

	// logging for logger
	io.emit('log_turn_played', player, gridIndex)

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

	// logging for logger
	io.emit('log_turn', playerTurn)
}

/**
 * Broadcast winner data to all the players.
 * @param {Socket Object} io To broadcast the winner to all the players.
 * @param {Object} player To send the winning player information.
 */

function gameWon(io, player) {
	console.log('game won')
	const msgObj = {
		message: `${player.name} won the game...`,
	}
	io.in(player.roomId).emit('game_over', msgObj, player)

	// logs for logger client
	io.emit('log_game_over', msgObj, player)

	// send game_won and winner event
	io.in(player.roomId).emit('game_won', player)

	// logs for logger client
	io.emit('log_game_won', player)

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
	console.log('game draw')
	io.in(player.roomId).emit(
		'game_over',
		{
			message: `It is draw`,
		},
		player
	)

	// logs for logger client
	io.emit(
		'log_game_over',
		{
			message: `It is draw`,
		},
		player
	)

	// send game_draw and winner event
	io.in(player.roomId).emit('game_draw')

	// logs for logger client
	io.emit('log_game_draw')

	const room = getRoomById(player.roomId)
	clearInterval(room.timeoutId)
	removeRoom(player.roomId)
}

exports.disconnect = (io, socket) => () => {
	const player = getPlayerFromSocketId(socket.id)
	if (player) {
		// only broadcast the disconnect info if the player was found

		// socket.leave(player.roomId)
		socket.to(player.roomId).emit('player_left', player)

		// logs for logger client
		io.emit('log_player_left', player)

		// make player a robot if he left when game was running...

		// remove room when all players have left and the game never actually started...
		const room = getRoomById(player.roomId)
		if (!room) return

		// player becomes a robot when then leave a running game
		if (room.gameStarted) {
			player.robot = true
		} else {
			// remove the player if they left before game starting...
			removePlayer(room, player)
		}

		// robots give the correct estimate of fixed players even if some left
		// const totalPlayers = room.players.filter(player => player.robot).length

		// remove room only if the all & then last player left before starting the game...

		if (room && room.players.length === 0 && !room.gameStarted) {
			console.log('yes room was removed')
			removeRoom(room.roomId)
		} else {
			console.log('no room was not removed')
		}
	}
}
