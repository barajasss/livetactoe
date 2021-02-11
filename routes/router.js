const express = require('express')
const { getRoomById, decodeRoomId } = require('../utils/room')

const router = express.Router()

function errorResponse(res, status, msg) {
	return res.status(status).json({
		message: msg,
	})
}

router.get('/', (req, res) => {
	// UI route for testing purpose...
	res.render('index')
})

router.get('/logs', (req, res) => {
	res.render('logs')
})

router.get('/rooms/:roomId', (req, res) => {
	const roomId = decodeRoomId(req.params.roomId)
	console.log('trying to get room Id', roomId)
	if (!roomId) {
		return errorResponse(res, 400, 'RoomId is required')
	}
	const room = getRoomById(roomId)
	if (!room) {
		return errorResponse(res, 404, 'Room not found.')
	}
	console.log('got the room', room)
	delete room.timeoutId
	return res.status(200).json({
		message: 'Room found and exists',
		room,
	})
})

module.exports = router
