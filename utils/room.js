const {
	RoomTypes,
	twoPlayerRooms,
	threePlayerRooms,
	fourPlayerRooms,
} = require('../models/rooms')

/**
 * Get the room
 * @param {String} roomId The id of the room to find
 */
const getRoomById = roomId => {
	let room
	let roomType = roomId.split('-')[0]
	switch (roomType) {
		case RoomTypes.TWO_PLAYER: {
			room = twoPlayerRooms.find(room => room.roomId === roomId)
			break
		}
		case RoomTypes.THREE_PLAYER: {
			room = threePlayerRooms.find(room => room.roomId === roomId)
			break
		}
		case RoomTypes.FOUR_PLAYER: {
			room = fourPlayerRooms.find(room => room.roomId === roomId)
			break
		}
	}
	return room
}

exports.getRoomById = getRoomById

/**
 * Converts roomId to a short code
 * TWO_PLAYER-1 converts to two1
 * Used for private room creation and joining
 */

exports.encodeRoomId = roomId => {
	const [roomType, roomNum] = roomId.split('-')
	let roomPrefix
	switch (roomType) {
		case RoomTypes.TWO_PLAYER: {
			roomPrefix = 'two'
			break
		}
		case RoomTypes.THREE_PLAYER: {
			roomPrefix = 'three'
			break
		}
		case RoomTypes.FOUR_PLAYER: {
			roomPrefix = 'four'
			break
		}
	}
	const encodedRoomId = `${roomPrefix}${roomNum}`
	return encodedRoomId
}

exports.decodeRoomId = encodedRoomId => {
	let roomType, roomNum
	if (encodedRoomId.startsWith('two')) {
		roomType = RoomTypes.TWO_PLAYER
		const i = encodedRoomId.indexOf('o') + 1
		roomNum = Number(encodedRoomId.slice(i))
	} else if (encodedRoomId.startsWith('three')) {
		roomType = RoomTypes.THREE_PLAYER
		const i = encodedRoomId.lastIndexOf('e') + 1
		roomNum = Number(encodedRoomId.slice(i))
	} else if (encodedRoomId.startsWith('four')) {
		roomType = RoomTypes.FOUR_PLAYER
		const i = encodedRoomId.indexOf('r') + 1
		roomNum = Number(encodedRoomId.slice(i))
	}
	const roomId = `${roomType}-${roomNum}`
	return roomId
}

/**
 *
 * @param {Number} length Length of the array
 * @param {*} symbol Symbol/value to use for all the array elements
 * @returns {Array} New array with all values prefilled with symbols
 */

function createArray(length, symbol = '') {
	let array = []
	for (let i = 0; i < length; i++) {
		array = [...array, symbol]
	}
	return array
}

function createNewRoomName(roomType, roomNum) {
	// create a unique room name
	let newRoomName
	let i = 0
	let room
	console.log('total two player room length', roomNum, twoPlayerRooms)
	do {
		// repeat the process if the room already exists...
		i++
		newRoomName = `${roomType}-${roomNum + i}`
		room = getRoomById(newRoomName)
		console.log('i found the room', room, twoPlayerRooms)
	} while (room)
	console.log('the new room name is ', newRoomName)
	return newRoomName
}

/**
 * Gets a room with empty slots/creates a new roomName and also returns extra important
 * data like newRoomName, new empty board that can be used for the creation
 * of a new room if the empty room does not exist.
 *
 * @param {String} roomType Type of the room to get data
 */

exports.generateRoomData = roomType => {
	let room, newRoomName, board
	switch (roomType) {
		case RoomTypes.TWO_PLAYER: {
			// pair up players
			// search for a public room with one player
			room = twoPlayerRooms.find(
				room => !room.private && room.players.length === 1
			)
			newRoomName = createNewRoomName(roomType, twoPlayerRooms.length)
			board = createArray(9)
			break
		}
		case RoomTypes.THREE_PLAYER: {
			room = threePlayerRooms.find(
				room =>
					!room.private &&
					room.players.length >= 1 &&
					room.players.length <= 2
			)

			newRoomName = createNewRoomName(
				RoomTypes.THREE_PLAYER,
				threePlayerRooms.length
			)
			board = createArray(16)
			break
		}
		case RoomTypes.FOUR_PLAYER: {
			room = fourPlayerRooms.find(
				room =>
					!room.private &&
					room.players.length >= 1 &&
					room.players.length <= 3
			)
			newRoomName = createNewRoomName(
				RoomTypes.FOUR_PLAYER,
				fourPlayerRooms.length
			)
			board = createArray(25)
			break
		}
	}
	return { room, newRoomName, board }
}
