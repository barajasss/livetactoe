const { generateRoomData } = require('../utils/room')
const {
	SYMBOLS,
	RoomTypes,
	twoPlayerRooms,
	threePlayerRooms,
	fourPlayerRooms,
} = require('../models/rooms')

/**
 * Adds a player to a room. Creates a new room if it does not exist.
 * @param {String} roomType - The type of the room: 'TWO_PLAYER', 'THREE_PLAYER', 'FOUR_PLAYER'
 * @param {Object} player - The player object to add
 * @returns {Object} Room with roomId and players.
 */

exports.addPlayer = (roomType, player) => {
	player = {
		...player,
		turn: false,
	}

	let { room, newRoomName, board } = generateRoomData(roomType)

	if (room) {
		// already an empty room is there with a waiting player...

		// append some important properties to the player
		player.symbol = SYMBOLS[room.players.length]
		player.roomId = room.roomId

		// mutate the array by inserting the player
		room.players = [...room.players, player]
		return room
	} else {
		// create a new room if no available rooms with waiting players
		const newRoomId = newRoomName

		// append some important properties to the player
		player.symbol = SYMBOLS[0]
		player.roomId = newRoomId

		const newRoom = {
			roomType,
			roomId: newRoomId,
			players: [player],
			board,
		}

		// append the newly created room to the proper rooms array
		switch (roomType) {
			case RoomTypes.TWO_PLAYER: {
				twoPlayerRooms.push(newRoom)
			}
			case RoomTypes.THREE_PLAYER: {
				threePlayerRooms.push(newRoom)
			}
			case RoomTypes.FOUR_PLAYER: {
				fourPlayerRooms.push(newRoom)
			}
		}
		return newRoom
	}
}

/**
 * Get the room
 * @param {String} roomId The id of the room to find
 */

const getRoomById = roomId => {
	let room = twoPlayerRooms.find(room => room.roomId === roomId)
	if (!room) {
		room = threePlayerRooms.find(room => room.roomId === roomId)
	}
	if (!room) {
		room = fourPlayerRooms.find(room => room.roomId === roomId)
	}
	return room
}

/**
 * Set random player turn
 * @param {String} roomId Id of the room to get random player
 */

exports.setRandomPlayerTurn = roomId => {
	const room = getRoomById(roomId)
	const randomIndex = Math.floor(Math.random() * room.players.length)
	let playerTurn = room.players[randomIndex]

	if (playerTurn) {
		// clear other player turns to false
		room.players.forEach(player => (player.turn = false))

		// set the random player turn to true
		playerTurn.turn = true
		return playerTurn
	}
}

/**
 * Get Current player's turn
 * @param {String} roomId Id of the room to get player
 */

exports.getPlayerTurn = roomId => {
	const room = getRoomById(roomId)
	let playerTurn = room.players.find(player => player.turn)
	if (!playerTurn && room.players) {
		// set the first player as their turn...
		playerTurn = room.players[0]
		playerTurn.turn = true
	}
	return playerTurn
}

exports.setNextPlayerTurn = roomId => {
	// properly set the turn for the next player...
	const room = getRoomById(roomId)
	let playerTurnIndex = room.players.findIndex(player => player.turn)
	let playerTurn
	// this case will probably not run
	if (playerTurnIndex !== -1 && room.players) {
		playerTurn = room.players[0]
		playerTurn.turn = true
	}

	// set the next player as the active current player
	playerTurnIndex += 1

	// cycle the turns for all the players
	if (playerTurnIndex >= room.players.length) {
		playerTurnIndex = 0
	}

	playerTurn = room.players[playerTurnIndex]
	// set all other player turns as false
	room.players.forEach(player => (player.turn = false))
	playerTurn.turn = true
	return playerTurn
}

exports.removeRoom = roomId => {
	let room = getRoomById(roomId)
	const findRoom = room => room.roomId === roomId
	if (room) {
		// remove the room by finding its index and mutating it...
		if (room.roomType === RoomTypes.TWO_PLAYER) {
			const index = twoPlayerRooms.findIndex(findRoom)
			twoPlayerRooms.splice(index, 1)
			return
		} else if (room.roomType === RoomTypes.THREE_PLAYER) {
			const index = threePlayerRooms.findIndex(findRoom)
			threePlayerRooms.splice(index, 1)
			return
		} else if (room.roomType === RoomTypes.FOUR_PLAYER) {
			const index = threePlayerRooms.findIndex(findRoom)
			fourPlayerRooms.splice(index, 1)
			return
		}
	}
}

exports.getPlayerFromSocketId = socketId => {
	let player

	const searchPlayerBySocketId = (rooms, socketId) => {
		for (let i = 0; i < rooms.length; i++) {
			const room = rooms[i]
			const player = room.players.find(
				player => player.socketId === socketId
			)
			if (player) {
				return player
			}
		}
		return null
	}

	// first search in twoPlayerRooms
	player = searchPlayerBySocketId(twoPlayerRooms, socketId)
	if (!player) {
		// search in threePlayerRooms
		player = searchPlayerBySocketId(threePlayerRooms, socketId)
	}
	if (!player) {
		// search in fourPlayerRooms
		player = searchPlayerBySocketId(fourPlayerRooms, socketId)
	}
	if (player) return player
	return null
}

/**
 *
 * @param {String} roomId Room to find the board
 * @param {Number} index Board position to mark
 * @param {String} symbol The player symbol (X/Y/O/T).
 */

exports.markSymbol = (roomId, index, symbol) => {
	const room = getRoomById(roomId)
	if (index >= 0 && index < room.board.length) {
		room.board[index] = symbol
		return room.board
	}
}
