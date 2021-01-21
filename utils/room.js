const {
	RoomTypes,
	twoPlayerRooms,
	threePlayerRooms,
	fourPlayerRooms,
} = require('../models/rooms')

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

/**
 * Gets a room with empty slots and also returns extra important
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
			// search for a room with one player
			room = twoPlayerRooms.find(room => room.players.length === 1)
			newRoomName = `${RoomTypes.TWO_PLAYER}-${twoPlayerRooms.length + 1}`
			board = createArray(9)
			break
		}
		case RoomTypes.THREE_PLAYER: {
			room = threePlayerRooms.find(
				room => room.players.length >= 1 && room.players.length <= 2
			)
			newRoomName = `${RoomTypes.THREE_PLAYER}-${
				threePlayerRooms.length + 1
			}`
			board = createArray(16)
			break
		}
		case RoomTypes.FOUR_PLAYER: {
			room = fourPlayerRooms.find(
				room => room.players.length >= 1 && room.players.length <= 3
			)
			newRoomName = `${RoomTypes.FOUR_PLAYER}-${
				fourPlayerRooms.length + 1
			}`
			board = createArray(25)
			break
		}
	}
	return { room, newRoomName, board }
}
