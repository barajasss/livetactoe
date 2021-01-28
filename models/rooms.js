/**
 * @file Stores the room design structure/model...
 */

const RoomTypes = {
	TWO_PLAYER: 'TWO_PLAYER',
	THREE_PLAYER: 'THREE_PLAYER',
	FOUR_PLAYER: 'FOUR_PLAYER',
}
const GameTypes = {
	TWO_PLAYER: 3,
	THREE_PLAYER: 4,
	FOUR_PLAYER: 5,
}
let twoPlayerRooms = [
	// {
	//  isFull: true/false,
	//  roomType: 'TWO_PLAYER'/'THREE_PLAYER'/'FOUR_PLAYER',
	//  gameType: 3/4/5,
	//  maxPlayers: 2/3/4,
	// 	roomId: 'two-player-room-1',
	// 	players: [
	// 		{
	// 			socketId: 'jdfaad',
	//	 		name: 'sadfdsa',
	// 			turn: true/false,
	// 			symbol: 'X'/'Y'/'O','T',
	// 			roomId: 'TWO_PLAYER-1'
	// 			robot: true/false,
	// 		},
	// 		{
	//		 	socketId: 'jdfaad'
	// 			...similar properties
	// 		}
	// 	],
	//	private: true/false,
	//  board: ['', '', '', '', '', '', '', '', '']
	//	timeoutId: 328148373,
	//	timeout: 10 seconds,
	// 	gameStarted: false,
	// },
]
let threePlayerRooms = []
let fourPlayerRooms = []

// 10 seconds time allowed for each player to make a move...
exports.MAX_TIMEOUT = 10

exports.SYMBOLS = ['X', 'O', 'Y', 'T']
exports.RoomTypes = RoomTypes
exports.GameTypes = GameTypes
exports.twoPlayerRooms = twoPlayerRooms
exports.threePlayerRooms = threePlayerRooms
exports.fourPlayerRooms = fourPlayerRooms
