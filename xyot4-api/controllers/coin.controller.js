const Coin = require('../models/coin.model')

exports.getCoinByUserId = async (req, res) => {
	const { userId } = req.params
	const coin = await Coin.findCoinsByUserId(userId)
	if (coin) {
		return res.status(200).json({ data: coin.total_coins })
	}
	return res.status(404).json({ msg: 'coins not found', data: null })
}

exports.updateCoins = updateType => async (req, res) => {
	const { userId } = req.params
	let updatedCoins

	if (updateType === -1 || updateType === 0 || updateType === 1) {
		updatedCoins = await Coin.updateCoins(userId, updateType)
	}

	if (updatedCoins) {
		const coin = await Coin.findCoinsByUserId(userId)

		// return total coins response after update
		return res
			.status(200)
			.json({ msg: 'coin updated successfully', data: coin.total_coins })
	}
	return res.status(404).json({ msg: 'coins not found', data: null })
}
