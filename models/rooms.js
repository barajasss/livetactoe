const RoomTypes = {
	TWO_PLAYER: 'TWO_PLAYER',
	THREE_PLAYER: 'THREE_PLAYER',
	FOUR_PLAYER: 'FOUR_PLAYER',
}
let twoPlayerRooms = [
	// {
	//  roomType: 'TWO_PLAYER',
	// 	roomId: 'two-player-room-1',
	// 	players: [{ socketId: 'jdfaad', name: 'sadfdsa', turn: true/false }, { socketId: 'jdfaad' }],
	//  board: ['', '', '', '', '', '', '', '', '']
	// },
]
let threePlayerRooms = []
let fourPlayerRooms = []

exports.SYMBOLS = ['X', 'O', 'Y', 'T']
exports.RoomTypes = RoomTypes
exports.twoPlayerRooms = twoPlayerRooms
exports.threePlayerRooms = threePlayerRooms
exports.fourPlayerRooms = fourPlayerRooms
