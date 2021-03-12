exports.sendMessage = (io, socket) => (message, emittingPlayer) => {
	io.to(emittingPlayer.roomId).emit('message', message, emittingPlayer)
}
