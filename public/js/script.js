const socket = io()
const statusDisplay = $('.status')
let playerCreated = false
const randomPlayerName = generateRandomName()
const promptName = prompt('Enter your name')

const mainPlayer = {
	socketId: '',
	name: promptName,
	roomId: '',
	symbol: '',
}
const controls = $('.controls')
const nameDisplay = $('.name')
const timeDisplay = $('.time')
const boardDisplay = $('.board')
const publicJoinBtn = $('#public-join-btn')
const privateJoinBtn = $('#private-join-btn')
const createRoomBtn = $('#create-room-btn')

let grids,
	mainPlayerTurn = false,
	gameOver = false

nameDisplay.innerHTML = mainPlayer.name

// SOCKET EMITTERS

function updatePlayer(newPlayer) {
	mainPlayer.socketId = newPlayer.socketId
	mainPlayer.roomId = newPlayer.roomId
	mainPlayer.symbol = newPlayer.symbol
}

// EVENT LISTENERS

publicJoinBtn.addEventListener('click', joinPublicRoom)

privateJoinBtn.addEventListener('click', joinPrivateRoom)

createRoomBtn.addEventListener('click', createPrivateRoom)

// EVENT HANDLERS

function joinPublicRoom() {
	controls.style.display = 'none'
	statusDisplay.innerHTML = 'Waiting for players...'

	const gameType = $('#public-game-type').value
	boardDisplay.innerHTML = `${gameType} x ${gameType}`

	socket.emit('join_game', mainPlayer, gameType)
}

function joinPrivateRoom() {
	controls.style.display = 'none'
	statusDisplay.innerHTML = 'Waiting for friends...'

	const roomId = $('#room-id-form').value
	if (!roomId) {
		alert('Please enter a room id')
		socket.emit('join_room', mainPlayer, roomId)
	}
}

function createPrivateRoom() {
	controls.style.display = 'none'
	statusDisplay.innerHTML = 'Waiting for friend(s)...'
	boardDisplay.innerHTML = `${gameType} x ${gameType}`

	const gameType = $('#private-game-type').value
	socket.emit('create_room', mainPlayer, gameType)
}

/**
 * SOCKET LISTENERS
 *
 * */

socket.on('timeout', time => {
	timeDisplay.textContent = 'Time: ' + time
})

socket.on('room_created', (player, roomId) => {
	console.log('room_created', roomId)
	updatePlayer(player)
	$('#room-display').innerHTML = roomId
})

socket.on('room_joined', (player, roomId) => {
	$('#room-display').innerHTML = roomId
})

socket.on('player_registered', ({ roomId, socketId, symbol }) => {
	updatePlayer({ socketId, roomId, symbol })
	console.log('player_registered', mainPlayer)
})

socket.on('game_started', room => {
	if (!playerCreated) {
		statusDisplay.textContent = 'Game started'
		playerCreated = true
		grids = generateGrid(room.gameType)

		// attach all the event listeners...

		grids.forEach((grid, i) => {
			grid.addEventListener('click', gridEventListener(i))
		})

		function gridEventListener(gridIndex) {
			return function () {
				if (
					mainPlayerTurn &&
					grids[gridIndex].textContent === '' &&
					!gameOver
				) {
					grids[gridIndex].textContent = mainPlayer.symbol
					socket.emit('play_turn', mainPlayer, gridIndex)
					mainPlayerTurn = false
				}
			}
		}
	}
})

socket.on('turn', playerTurn => {
	// it will receive the player with that given turn...
	if (playerTurn.socketId === mainPlayer.socketId && playerTurn.turn) {
		mainPlayerTurn = true
		statusDisplay.innerHTML = 'Your turn...'
	} else {
		mainPlayerTurn = false
		statusDisplay.innerHTML = `Waiting for ${playerTurn.name}'s turn...`
	}
})

socket.on('turn_played', (playerTurn, gridIndex) => {
	// will run when someone plays their turn
	console.log('turn_played')
	grids[gridIndex].innerHTML = playerTurn.symbol
})

socket.on('game_over', result => {
	statusDisplay.textContent = `Game Over. ${result.message}`
	gameOver = true
})

socket.on('player_left', player => {
	// the player left details
	console.log('player_left', player)
})
