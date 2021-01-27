const { addPlayer, getRoomById } = require('./room.controller')

const { startGame } = require('./player.controller')

const { RoomTypes, SYMBOLS } = require('../models/rooms')

const { encodeRoomId, decodeRoomId } = require('../utils/room')

/**
 * Create a new room and emit the roomId with the room_created event.
 */

exports.createRoom = (io, socket) => (
	player,
	roomType = RoomTypes.TWO_PLAYER
) => {
	let newPlayer = {
		...player,
		socketId: socket.id,
	}

	// create a new private room...

	const room = addPlayer(roomType, newPlayer, true, true)
	const { roomId, players } = room
	const encodedRoomId = encodeRoomId(roomId)
	newPlayer = players.find(player => player.socketId === newPlayer.socketId)
	socket.join(roomId)

	// send important events necessary to join a private room.
	socket.emit('player_registered', newPlayer)
	io.to(roomId).emit('player_joined', players)
	socket.emit('room_created', newPlayer, encodedRoomId)
}

/**
 * Join an existing room with Id and emit the room_joined event.
 */

exports.joinRoom = (io, socket) => (player, encodedRoomId) => {
	const roomId = decodeRoomId(encodedRoomId)
	const room = getRoomById(roomId)

	if (!room || !room.private) {
		// room must exist and be private...
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
	io.to(roomId).emit('player_joined', players)
	socket.emit('room_joined', newPlayer, encodedRoomId)

	if (roomType === RoomTypes.TWO_PLAYER && players.length === 2) {
		startGame(io, room)
	} else if (roomType === RoomTypes.THREE_PLAYER && players.length === 3) {
		startGame(io, room)
	} else if (roomType === RoomTypes.FOUR_PLAYER && players.length === 4) {
		startGame(io, room)
	}
}
