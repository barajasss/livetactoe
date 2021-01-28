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

function generateGrid(gameType = 3) {
	const grid = $('.grid')

	let templateFractions = '1fr'
	for (let i = 0; i < gameType - 1; i++) {
		templateFractions += ' 1fr'
	}

	// adjust proper css styling...

	grid.style.display = 'grid'
	grid.style.height = `${gameType}00px`
	grid.style.width = `${gameType}00px`
	grid.style.gridTemplateColumns = templateFractions
	grid.style.gridTemplateRows = templateFractions

	// create the grid elements...

	for (let i = 1; i <= gameType * gameType; i++) {
		const div = document.createElement('div')
		grid.appendChild(div)
	}
	const grids = $('.grid div', true)

	// attach event listeners to each grid item
	return grids
}
