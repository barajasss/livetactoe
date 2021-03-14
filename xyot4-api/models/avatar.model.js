const pool = require('../connection')
const AVATARS_TABLE = 'purchased_avatars'
const Coin = require('./coin.model')

const Avatar = {
	async purchaseAvatar(userId, avatar, avatarCost) {
		const coins = await Coin.findCoinsByUserId(userId)
		if (!coins || coins.total_coins < avatarCost) return false

		// deduct coins by adding -ve value
		await Coin.deductCoins(userId, avatarCost)

		// add entry into purchased avatars...
		const query = `INSERT INTO ${AVATARS_TABLE} (user_id, avatar) VALUES(?, ?)`
		const [result] = await pool.execute(query, [userId, avatar])
		if (result.affectedRows > 0) {
			// avatar purchased successfully...
			const purchasedAvatars = await this.getPurchasedAvatarsByUserId(userId)
			return purchasedAvatars
		}
		// could not purchase avatars
		return false
	},
	async getPurchasedAvatarsByUserId(userId) {
		const query = `SELECT DISTINCT user_id, avatar FROM ${AVATARS_TABLE} WHERE user_id=?`
		const [rows, fields] = await pool.execute(query, [userId])
		if (rows.length > 0) {
			return rows.map(item => item.avatar)
		}
		return []
	},
}

module.exports = Avatar
