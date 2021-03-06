const pool = require('../connection')
const COIN_TABLE = 'users_coin'

// Coins Logic

// New login - 250 Coins
// Minimum balance to play - 30 Coins
// Game Win - 40 Coins
// Coins to play/game lose - subtract 20 Coins from balance
// Draw - 10 Coins

// COIN VALUES

// -1 : New game which consumes coins by 20
// 0 : Draw which adds 10 coins
// 1 : Game win which adds 40 coins

const INITIAL_COINS = 250
const WIN_COINS = 40
const NEW_GAME_COINS = 20
const DRAW_COINS = 10

const Coin = {
	async createNewCoinTable(user_id) {
		const query = `INSERT INTO ${COIN_TABLE} (user_id, total_coins) VALUES(?, ?)`
		const [result] = await pool.execute(query, [user_id, INITIAL_COINS])
		if (result.affectedRows) {
			return true
		}
		return false
	},
	async findCoinsByUserId(user_id) {
		const getCoin = async () => {
			const query = `SELECT * FROM ${COIN_TABLE} WHERE user_id = ?`
			const [rows, fields] = await pool.execute(query, [user_id])
			if (rows.length > 0) return rows[0]
		}
		// create coin table if it did not exist before
		let coin = await getCoin()
		if (coin) {
			return coin
		} else {
			// if coin table did not exist then create it.
			const newCoinTableCreated = await this.createNewCoinTable(user_id)
			console.log(newCoinTableCreated)
			if (newCoinTableCreated) {
				coin = await getCoin()
				return coin
			}
		}
		return null
	},
	async updateCoins(user_id, updateType) {
		let query = `UPDATE ${COIN_TABLE} SET total_coins = total_coins - 0 WHERE user_id = ?`

		switch (updateType) {
			case -1: {
				query = `UPDATE ${COIN_TABLE} SET total_coins = total_coins - ${NEW_GAME_COINS} WHERE user_id = ?`
				break
			}
			case 0: {
				query = `UPDATE ${COIN_TABLE} SET total_coins = total_coins + ${DRAW_COINS} WHERE user_id = ?`
				break
			}
			case 1: {
				query = `UPDATE ${COIN_TABLE} SET total_coins = total_coins + ${WIN_COINS} WHERE user_id = ?`
				break
			}
		}
		const [result] = await pool.execute(query, [user_id])
		if (result.affectedRows) {
			return true
		}
		return false
	},
}

module.exports = Coin
