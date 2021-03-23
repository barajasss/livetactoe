const Leaderboard = require('../models/leaderboard.model')

exports.getLeaderboardRow = async (req, res) => {
	const { userId } = req.params
	const data = await Leaderboard.getData(userId)
	if (data) {
		return res.status(200).json({
			msg: 'successfully fetched',
			data,
		})
	}
	return res.status(500).json({
		msg: 'could not get data',
	})
}

exports.getLeaderboard = async (req, res) => {
	/* return top 100 players */

	const data = await Leaderboard.getLeaderboard()
	if (data) {
		return res.status(200).json({
			msg: 'successfully fetched',
			data,
		})
	}
	return res.status(500).json({
		msg: 'could not fetch data',
	})
}

exports.addWin = async (req, res) => {
	const { userId } = req.params
	/* increment win count and update level of the user */
	const data = await Leaderboard.updateWin(Number(userId))
	if (data) {
		return res.status(200).json({
			msg: 'wins and level updated successfully',
			data,
		})
	}
	return res.status(500).json({
		msg: 'could not update wins',
	})
}
