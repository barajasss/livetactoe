// const { v4 } = require('uuid')
const { twoPlayerRooms, addPlayer } = require('../rooms')

exports.createPlayer = (io, socket) => player => {
	// create a player and match with any waiting player.
	const { roomId, players } = addPlayer('two-player', player)

	socket.join(roomId)

	socket.emit('player_registered', {
		roomId,
	})

	socket.emit('player_joined')
	io.to(roomId).emit('player_joined', players)

	if (players.length === 2) {
		io.to(roomId).emit('game_started', player)
	}
}
