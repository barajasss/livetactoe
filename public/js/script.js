const socket = io()
const statusDisplay = $('.status')
let playerCreated = false
const randomPlayerName = generateRandomName()
const player = {
	name: randomPlayerName,
	roomId: '',
}

// SOCKET EMITTERS

socket.emit('join_game', player)

// SOCKET LISTENERS

socket.on('player_registered', ({ roomId }) => {
	player.roomId = roomId
})
socket.on('game_started', player => {
	if (!playerCreated) {
		statusDisplay.textContent = 'Game started'
		console.log('player created')
		playerCreated = true
		const grids = generateGrid()

		// attach all the event listeners...

		grids.forEach((grid, i) => {
			grid.addEventListener('click', gridEventListener(i))
		})

		function gridEventListener(i) {
			return function () {
				console.log(grids, grids[i], i)
				grids[i].textContent = 'x'
			}
		}
	}
})
