const Stats = require('../models/stats.model')

exports.getStats = async (req, res) => {
	const { userId } = req.params
	const data = await Stats.getStats(userId)
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

	const data = await Stats.getLeaderboard()
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

exports.addWins = async (req, res) => {
	const { userId } = req.params
	const { game_type: gameType } = req.query
	if (!gameType) {
		return res.status(500).json({
			msg: 'game_type is required in the query parameter string',
		})
	}
	/* increment win count and update level of the user */
	const data = await Stats.incrementWins(Number(userId), Number(gameType))
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
exports.addDraws = async (req, res) => {
	const { userId } = req.params
	const { game_type: gameType } = req.query
	if (!gameType) {
		return res.status(500).json({
			msg: 'game_type is required in the query parameter string',
		})
	}
	/* increment win count and update level of the user */
	const data = await Stats.incrementDraws(Number(userId), Number(gameType))
	if (data) {
		return res.status(200).json({
			msg: 'draws updated successfully',
			data,
		})
	}
	return res.status(500).json({
		msg: 'could not update draws of the player',
	})
}
exports.addLosses = async (req, res) => {
	const { userId } = req.params
	const { game_type: gameType } = req.query
	if (!gameType) {
		return res.status(500).json({
			msg: 'game_type is required in the query parameter string',
		})
	}
	/* increment win count and update level of the user */
	const data = await Stats.incrementLosses(Number(userId), Number(gameType))
	if (data) {
		return res.status(200).json({
			msg: 'losses updated successfully',
			data,
		})
	}
	return res.status(500).json({
		msg: 'could not update losses',
	})
}
