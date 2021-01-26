const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
	cors: {
		origin: 'https://example.com',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
	},
})
const PORT = process.env.PORT || 3000

const playerController = require('./controllers/player.controller')

app.use(express.static(__dirname + '/public'))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('index')
})

io.on('connection', socket => {
	socket.on('join_game', playerController.createPlayer(io, socket))
	socket.on('play_turn', playerController.playTurn(io, socket))
	socket.on('disconnect', playerController.disconnect(io, socket))
})

http.listen(PORT, () =>
	console.log('live-tac-toe app listening at localhost:' + PORT)
)
