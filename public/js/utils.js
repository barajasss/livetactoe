const $ = (selector, multiple = false) =>
	multiple
		? document.querySelectorAll(selector)
		: document.querySelector(selector)

const generateRandomName = () => {
	const characters = 'abcdefghijklmnopqrstuvwxyz0123'
	const length = 6
	let randomName = ''
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		const randomChar = characters[randomIndex]
		randomName = `${randomName}${randomChar}`
	}
	return randomName
}

function generateGrid() {
	const grid = $('.grid')

	// create 9 grids
	for (let i = 1; i <= 9; i++) {
		const div = document.createElement('div')
		grid.appendChild(div)
	}
	const grids = $('.grid div', true)

	// attach event listeners to each grid item
	return grids
}

function checkGameDraw(grids) {
	const totalMarked = Array.from(grids).filter(grid => grid.textContent)
		.length
	console.log(grids.length, totalMarked)
	if (grids.length === totalMarked) {
		return true
	}
	return false
}

function checkGameWin(grids, symbol) {
	// check horizontally
	for (let i = 0; i < 3; i += 3) {
		if (
			grids[i].textContent === symbol &&
			grids[i + 1].textContent === symbol &&
			grids[i + 2].textContent === symbol
		) {
			return true
		}
	}

	// check vertically
	for (let i = 0; i < 3; i++) {
		if (
			grids[i].textContent === symbol &&
			grids[i + 3].textContent === symbol &&
			grids[i + 6].textContent === symbol
		) {
			return true
		}
	}

	// check diagonally

	if (
		grids[0].textContent === symbol &&
		grids[4].textContent === symbol &&
		grids[8].textContent === symbol
	) {
		return true
	}
	if (
		grids[2].textContent === symbol &&
		grids[4].textContent === symbol &&
		grids[6].textContent === symbol
	) {
		return true
	}
	return false
}
