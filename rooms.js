let twoPlayerRooms = [
	// {
	// 	roomId: 'two-player-room-1',
	// 	players: [{ socketId: 'jdfaad' }, { socketId: 'jdfaad' }],
	// },
]

exports.twoPlayerRooms = twoPlayerRooms

exports.addPlayer = (roomType, player) => {
	if (roomType.startsWith('two-player')) {
		// pair up players
		// search for a room with one player
		const room = twoPlayerRooms.find(room => room.players.length === 1)
		if (room) {
			// mutate the array by inserting the player
			room.players = [...room.players, player]
			return room
		} else {
			// create a new room if no available rooms with waiting players
			const newRoomId = `two-player-${twoPlayerRooms.length + 1}`
			const newTwoPlayerRoom = {
				roomId: newRoomId,
				players: [player],
			}
			twoPlayerRooms = [...twoPlayerRooms, newTwoPlayerRoom]
			return newTwoPlayerRoom
		}
	}
}
