const { addPlayer } = require('./room.controller')

const { startGame } = require('./player.controller')

const { RoomTypes, GameTypes, SYMBOLS } = require('../models/rooms')

const {
	encodeRoomId,
	decodeRoomId,
	getRoomById,
	getRoomType,
	getGameType,
} = require('../utils/room')

/**
 * Create a new room and emit the roomId with the room_created event.
 */

exports.createRoom = (io, socket) => (
	player,
	gameType = GameTypes.TWO_PLAYER
) => {
	// logs for logger client
	io.emit('log_create_room', player, gameType)

	let newPlayer = {
		...player,
		socketId: socket.id,
		robot: false,
	}
	let roomType = getRoomType(gameType)

	// create a new private room...

	const room = addPlayer(roomType, newPlayer, true, true)
	const { roomId, players } = room
	const encodedRoomId = encodeRoomId(roomId)
	newPlayer = players.find(player => player.socketId === newPlayer.socketId)
	socket.join(roomId)

	// send important events necessary to join a private room.
	socket.emit('player_registered', newPlayer)
	io.to(roomId).emit('player_joined', players)
	socket.emit('room_created', newPlayer, encodedRoomId, room)

	// logs for logger client
	io.emit('log_room_created', newPlayer, encodedRoomId, room)
}

/**
 * Join an existing room with Id and emit the room_joined event.
 */

exports.joinRoom = (io, socket) => (player, encodedRoomId) => {
	console.log('join_room')

	// logs for logger client
	io.emit('log_join_room', player, encodedRoomId)

	const roomId = decodeRoomId(encodedRoomId)
	const room = getRoomById(roomId)

	if (!room || !room.private) {
		// room must exist and be private...
		return
	}
	// room must not be full
	if (room.isFull) {
		console.log('Room is full.')
		return
	}

	let newPlayer = {
		...player,
		socketId: socket.id,
		turn: false,
		robot: false,
	}

	newPlayer.symbol = SYMBOLS[room.players.length]
	newPlayer.roomId = room.roomId

	// add the player to the room
	socket.join(roomId)
	room.players = [...room.players, newPlayer]
	let players = room.players
	let roomType = roomId.split('-')[0]
	// send all the essential and vital events.

	socket.emit('player_registered', newPlayer)
	// logs for logger client
	io.emit('log_player_registered', newPlayer)

	io.to(roomId).emit('player_joined', players)
	// logs for logger client
	io.emit('log_player_joined', players)

	socket.emit('room_joined', newPlayer, encodedRoomId, room)
	// logs for logger client
	io.emit('log_room_joined', player, encodedRoomId, room)

	if (roomType === RoomTypes.TWO_PLAYER && players.length === 2) {
		startGame(io, room)
	} else if (roomType === RoomTypes.THREE_PLAYER && players.length === 3) {
		startGame(io, room)
	} else if (roomType === RoomTypes.FOUR_PLAYER && players.length === 4) {
		startGame(io, room)
	}
}
