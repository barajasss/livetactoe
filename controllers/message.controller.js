exports.sendMessage = (io, socket) => (message, emittingPlayer) => {
	socket.to(player.roomId).emit('message', message, emittingPlayer)
}
