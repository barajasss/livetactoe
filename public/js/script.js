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
const nameDisplay = $('.name')
let grids,
	mainPlayerTurn = false,
	gameOver = false

// SOCKET EMITTERS

socket.emit('join_game', mainPlayer)

// SOCKET LISTENERS

socket.on('player_registered', ({ roomId, socketId, symbol }) => {
	mainPlayer.socketId = socketId
	mainPlayer.roomId = roomId
	mainPlayer.symbol = symbol
	nameDisplay.innerHTML = mainPlayer.name
	console.log('player_registered', mainPlayer)
})

socket.on('game_started', player => {
	if (!playerCreated) {
		statusDisplay.textContent = 'Game started'
		playerCreated = true
		grids = generateGrid()

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
