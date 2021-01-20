const RoomTypes = {
	TWO_PLAYER: 'TWO_PLAYER',
	THREE_PLAYER: 'THREE_PLAYER',
	FOUR_PLAYER: 'FOUR_PLAYER',
}
let twoPlayerRooms = [
	// {
	// 	roomId: 'two-player-room-1',
	// 	players: [{ socketId: 'jdfaad', name: 'sadfdsa', turn: true/false }, { socketId: 'jdfaad' }],
	// },
]
let threePlayerRooms = []
let fourPlayerRooms = []

const SYMBOLS = ['X', 'O', 'Y', 'T']

exports.RoomTypes = RoomTypes
exports.twoPlayerRooms = twoPlayerRooms
exports.threePlayerRooms = threePlayerRooms
exports.fourPlayerRooms = fourPlayerRooms

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
	let room, newRoomName

	switch (roomType) {
		case RoomTypes.TWO_PLAYER: {
			// pair up players
			// search for a room with one player
			room = twoPlayerRooms.find(room => room.players.length === 1)
			newRoomName = `${RoomTypes.TWO_PLAYER}-${twoPlayerRooms.length + 1}`
			break
		}
		case RoomTypes.THREE_PLAYER: {
			room = threePlayerRooms.find(
				room => room.players.length >= 1 && room.players.length <= 2
			)
			newRoomName = `${RoomTypes.THREE_PLAYER}-${
				threePlayerRooms.length + 1
			}`
			break
		}
		case RoomTypes.FOUR_PLAYER: {
			room = fourPlayerRooms.find(
				room => room.players.length >= 1 && room.players.length <= 3
			)
			newRoomName = `${RoomTypes.FOUR_PLAYER}-${
				fourPlayerRooms.length + 1
			}`
			break
		}
	}

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
		}

		// append the newly created room to the proper rooms array
		switch (roomType) {
			case RoomTypes.TWO_PLAYER: {
				twoPlayerRooms = [...twoPlayerRooms, newRoom]
			}
			case RoomTypes.THREE_PLAYER: {
				threePlayerRooms = [...threePlayerRooms, newRoom]
			}
			case RoomTypes.FOUR_PLAYER: {
				fourPlayerRooms = [...fourPlayerRooms, newRoom]
			}
		}
		return newRoom
	}
}

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
	const removeFunc = room => room.roomId !== roomId
	if (room) {
		// remove the room
		if (room.roomType === RoomTypes.TWO_PLAYER) {
			twoPlayerRooms.filter(removeFunc)
			return
		} else if (room.roomType === RoomTypes.THREE_PLAYER) {
			threePlayerRooms.filter(removeFunc)
			return
		} else if (room.roomType === RoomTypes.FOUR_PLAYER) {
			fourPlayerRooms.filter(removeFunc)
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
