// USEFUL CONSTANTS

exports.THREE_WIN_PATTERNS = [
	[11, 12, 13],
	[21, 22, 23],
	[31, 32, 33],
	[11, 21, 31],
	[12, 22, 32],
	[13, 23, 33],
	[11, 22, 33],
	[13, 22, 31],
]

exports.FOUR_WIN_PATTERNS = [
	[11, 12, 13],
	[12, 13, 14],
	[21, 22, 23],
	[22, 23, 24],
	[31, 32, 33],
	[32, 33, 34],
	[41, 42, 43],
	[42, 43, 44],
	[11, 21, 31],
	[21, 31, 41],
	[12, 22, 32],
	[12, 23, 34],
	[22, 32, 42],
	[13, 23, 33],
	[13, 22, 31],
	[23, 33, 43],
	[14, 24, 34],
	[24, 34, 44],
	[14, 23, 32],
	[23, 32, 41],
	[11, 22, 33],
	[22, 33, 44],
	[21, 32, 43],
	[24, 33, 42],
]

exports.FIVE_WIN_PATTERNS = [
	[11, 12, 13],
	[12, 13, 14],
	[13, 14, 15],
	[21, 22, 23],
	[22, 23, 24],
	[23, 24, 25],
	[31, 32, 33],
	[32, 33, 34],
	[33, 34, 35],
	[41, 42, 43],
	[42, 43, 44],
	[43, 44, 45],
	[51, 52, 53],
	[52, 53, 54],
	[53, 54, 55],
	[11, 21, 31],
	[21, 31, 41],
	[31, 41, 51],
	[12, 22, 32],
	[12, 23, 34],
	[23, 34, 45],
	[22, 32, 42],
	[32, 42, 52],
	[13, 23, 33],
	[13, 22, 31],
	[13, 24, 35],
	[23, 33, 43],
	[33, 43, 53],
	[14, 24, 34],
	[24, 34, 44],
	[34, 44, 54],
	[14, 23, 32],
	[23, 32, 41],
	[15, 25, 35],
	[25, 35, 45],
	[35, 45, 55],
	[11, 22, 33],
	[22, 33, 44],
	[33, 44, 55],
	[21, 32, 43],
	[32, 43, 54],
	[24, 33, 42],
	[33, 42, 51],
	[15, 24, 33],
	[25, 34, 43],
	[34, 43, 52],
	[35, 44, 53],
	[31, 42, 53],
]

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// FOR ROBOTS

exports.THREE_ROBOT_TURNS = [22, 11, 33, 13, 21, 23, 12, 32, 31]
exports.FOUR_ROBOT_TURNS = [
	randomBetween(21, 23),
	randomBetween(31, 32),
	randomBetween(33, 34),
	34,
	24,
	43,
	42,
	41,
	31,
	21,
	12,
	13,
	14,
	44,
	33,
	randomBetween(22, 23),
	11,
]
exports.FIVE_ROBOT_TURNS = [
	randomBetween(22, 24),
	randomBetween(21, 23),
	randomBetween(33, 34),
	32,
	43,
	42,
	54,
	52,
	randomBetween(53, 55),
	25,
	45,
	35,
	21,
	31,
	41,
	51,
	12,
	13,
	14,
	15,
	55,
	44,
	33,
	randomBetween(22, 23),
	11,
]
