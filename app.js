const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
	},
})

const PORT = process.env.PORT || 3000
const router = require('./routes/router')

const playerController = require('./controllers/player.controller')
const privateRoomController = require('./controllers/privateRoom.controller')

app.use(express.static(__dirname + '/public'))
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(router)

io.attach(http, {
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false,
})

io.on('connection', socket => {
	// for public room
	socket.on('join_game', playerController.createPlayer(io, socket))

	// for private rooms
	socket.on('create_room', privateRoomController.createRoom(io, socket))
	socket.on('join_room', privateRoomController.joinRoom(io, socket))

	// other
	socket.on('play_turn', playerController.playTurn(io, socket))
	socket.on('disconnect', playerController.disconnect(io, socket))
})

http.listen(PORT, () =>
	console.log('live-tac-toe app listening at localhost:' + PORT)
)
