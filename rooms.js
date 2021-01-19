let twoPlayerRooms = [
	// {
	// 	roomId: 'two-player-room-1',
	// 	players: [{ socketId: 'jdfaad', name: 'sadfdsa', turn: true/false }, { socketId: 'jdfaad' }],
	// },
]
const SYMBOLS = ['x', 'o', 'y', 't']

exports.twoPlayerRooms = twoPlayerRooms

exports.addPlayer = (roomType, player) => {
	if (roomType.startsWith('two-player')) {
		// pair up players
		// search for a room with one player
		player = {
			...player,
			turn: false,
		}

		const room = twoPlayerRooms.find(room => room.players.length === 1)
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
			const newRoomId = `two-player-${twoPlayerRooms.length + 1}`

			// append some important properties to the player
			player.symbol = SYMBOLS[0]
			player.roomId = newRoomId

			const newTwoPlayerRoom = {
				roomId: newRoomId,
				players: [player],
			}
			twoPlayerRooms = [...twoPlayerRooms, newTwoPlayerRoom]
			return newTwoPlayerRoom
		}
	}
}

const getRoom = roomId => {
	if (roomId.startsWith('two-player')) {
		const room = twoPlayerRooms.find(room => room.roomId === roomId)
		return room
	}
}

exports.getPlayerTurn = roomId => {
	if (roomId.startsWith('two-player')) {
		const room = getRoom(roomId)
		let playerTurn = room.players.find(player => player.turn)
		if (!playerTurn && room.players) {
			// set the first player as their turn...
			playerTurn = room.players[0]
			playerTurn.turn = true
		}
		return playerTurn
	}
}

exports.setNextPlayerTurn = roomId => {
	// properly set the turn for the next player...

	if (roomId.startsWith('two-player')) {
		const room = getRoom(roomId)
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
}
