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
const hintDisplay = $('.hint-display')
const roomDisplay = $('.room-display')

const publicJoinBtn = $('#public-join-btn')
const createRoomBtn = $('#create-room-btn')
const joinPrivateRoomForm = $('#join-private-room-form')

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

joinPrivateRoomForm.addEventListener('submit', joinPrivateRoom)

createRoomBtn.addEventListener('click', createPrivateRoom)

// EVENT HANDLERS

function joinPublicRoom() {
	controls.style.display = 'none'
	statusDisplay.innerHTML = 'Waiting for players...'

	const gameType = $('#public-game-type').value
	boardDisplay.innerHTML = `Board: ${gameType} x ${gameType}`

	socket.emit('join_game', mainPlayer, gameType)
}

async function joinPrivateRoom(e) {
	e.preventDefault()

	const roomId = $('#room-id-form').value
	if (roomId) {
		// send a request to see if room id exists...
		try {
			const res = await fetch(`/rooms/${roomId}`)
			const data = await res.json()
			console.log(data)
			if (!res.ok || !data) {
				throw new Error(data.message || 'some error')
			}
			if (data.room.players.length < data.room.maxPlayers) {
				console.log('room is found n everything ok')
				controls.style.display = 'none'
				statusDisplay.innerHTML = 'Waiting for friends...'
				socket.emit('join_room', mainPlayer, roomId)
			} else {
				throw new Error('Room is full.')
			}
		} catch (err) {
			alert(err)
		}
	} else {
		alert('Please enter a room id')
	}
}

function createPrivateRoom() {
	controls.style.display = 'none'
	statusDisplay.innerHTML = 'Waiting for friend(s)...'
	const gameType = $('#private-game-type').value
	boardDisplay.innerHTML = `Board: ${gameType} x ${gameType}`
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
	roomDisplay.innerHTML = 'Room ID: ' + roomId
	hintDisplay.innerHTML =
		'Tell your friend to enter this roomId. <br />Game will start once there are enough players.'
})

socket.on('room_joined', (player, roomId, room) => {
	console.log('room_joined')
	roomDisplay.innerHTML = 'Room ID: ' + roomId
	boardDisplay.innerHTML = `Board: ${room.gameType} x ${room.gameType}`
})

socket.on('player_registered', ({ roomId, socketId, symbol }) => {
	updatePlayer({ socketId, roomId, symbol })
	console.log('player_registered', mainPlayer)
})

socket.on('game_started', room => {
	if (!playerCreated) {
		hintDisplay.innerHTML = ''
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
	statusDisplay.innerHTML = `Game Over. ${result.message}.<br/> Refresh the page to play the game again.`
	gameOver = true
})

socket.on('player_left', player => {
	// the player left details
	console.log('player_left', player)
})
