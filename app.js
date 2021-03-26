const express = require('express')
const app = express()
const dotenv = require('dotenv')
const http = require('http').createServer(app)
const cors = require('cors')
const { coinUpdater } = require('./xyot4-api/controllers/coin.controller')

dotenv.config()

// const io = require('socket.io')(http)

const io = require('socket.io')(http, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
	},
})

const PORT = process.env.PORT || 3000
const router = require('./routes/router')
const apiRouter = require('./xyot4-api/api.router')
const adminRouter = require('./xyot4-admin/admin.router')

const playerController = require('./controllers/player.controller')
const privateRoomController = require('./controllers/privateRoom.controller')
const messageController = require('./controllers/message.controller')

app.use(express.static(__dirname + '/public'))
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(cors())
app.use(adminRouter)
app.use(router)
app.use(apiRouter)

// updates coins every interval per day - adds 20 coins to every user per day whose coins are below 250
coinUpdater()

console.log('Environment ', process.env.NODE_ENV)

// log_event_name is used to display logs on logs.ejs

io.on('connection', socket => {
	// for public room
	// console.log('socket log', socket)

	// emit to the log connector whenever it connects
	socket.emit('log_connected', socket.id)
	// emit to the log connector when someone connects
	io.emit('log_connection', socket.id)

	socket.on('join_game', playerController.createPlayer(io, socket))

	// for private rooms
	socket.on('create_room', privateRoomController.createRoom(io, socket))
	socket.on('join_room', privateRoomController.joinRoom(io, socket))

	socket.on('message', messageController.sendMessage(io, socket))

	// other
	socket.on('play_turn', playerController.playTurn(io, socket))
	socket.on('disconnect', playerController.disconnect(io, socket))
})

http.listen(PORT, () =>
	console.log('xyot, live-tac-toe app listening at localhost:' + PORT)
)
