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
		randomName += `${randomName}${randomChar}`
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
