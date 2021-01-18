const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const playerController = require('./controllers/player.controller')

app.use(express.static(__dirname + '/public'))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	res.render('index')
})

io.on('connection', socket => {
	socket.on('join_game', playerController.createPlayer(io, socket))
})

http.listen(3000, () =>
	console.log('live-tac-toe app listening at localhost:3000')
)
