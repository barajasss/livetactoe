const pool = require('../connection')
const STATS_TABLE = 'stats'
const { GameTypes } = require('../../models/rooms')
const USER_TABLE = 'users'

const Stats = {
	async createNew(userId) {
		const level = 0
		const wins = 0
		let query = `INSERT INTO ${STATS_TABLE} (user_id, wins, level) VALUES(?, ?, ?)`
		const [result] = await pool.execute(query, [userId, wins, level])
		if (result.affectedRows > 0) {
			/* return the inserted data */
			return { userId, wins, level }
		}
		return null
	},
	async incrementDraws(userId, gameType) {
		let query
		switch (gameType) {
			case GameTypes.TWO_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET two_player_draws = two_player_draws + 1 WHERE user_id = ?`
				break
			case GameTypes.THREE_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET three_player_draws = three_player_draws + 1 WHERE user_id = ?`
				break
			case GameTypes.FOUR_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET four_player_draws = four_player_draws + 1 WHERE user_id = ?`
				break
			default:
				query = ''
				break
		}
		const [result] = await pool.execute(query, [userId])
		if (result.affectedRows > 0) {
			return true
		}
		return false
	},
	async incrementLosses(userId, gameType) {
		let query
		switch (gameType) {
			case GameTypes.TWO_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET two_player_losses = two_player_losses + 1 WHERE user_id = ?`
				break
			case GameTypes.THREE_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET three_player_losses = three_player_losses + 1 WHERE user_id = ?`
				break
			case GameTypes.FOUR_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET four_player_losses = four_player_losses + 1 WHERE user_id = ?`
				break
			default:
				query = ''
				break
		}
		const [result] = await pool.execute(query, [userId])
		if (result.affectedRows > 0) {
			return true
		}
		return false
	},
	async incrementWins(userId, gameType) {
		/* increments the win count and then updates the level also. */

		/*  Calculate level first from wins
            User Level management : default level is 0
            Level 1 : total 10 wins.
            Level 2 : need 15 wins more i.e total 25 wins.
            Level 3 : need 20 wins more i.e total 45 wins. And so on increase by 5
        */
		let query = `SELECT two_player_wins, three_player_wins, four_player_wins FROM ${STATS_TABLE} WHERE user_id=?`
		const [rows, fields] = await pool.execute(query, [userId])
		let level, totalWins

		if (rows.length > 0) {
			/* calculate level */
			totalWins =
				rows[0].two_player_wins +
				rows[0].three_player_wins +
				rows[0].four_player_wins +
				1
			function getWins(level) {
				/* returns the minimum wins required to reach that level */
				/* sum of arithmetic sequence (n * (2a + (n-1)d)) / 2 */
				return (level * (2 * 10 + (level - 1) * 5)) / 2
			}
			level = 0
			let nextLevel = 1
			while (totalWins >= getWins(nextLevel)) {
				level = nextLevel
				nextLevel += 1
			}
		} else {
			return null
		}
		switch (gameType) {
			case GameTypes.TWO_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET two_player_wins = two_player_wins + 1, level = ? WHERE user_id = ?`
				break
			case GameTypes.THREE_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET three_player_wins = three_player_wins + 1, level = ? WHERE user_id = ?`
				break
			case GameTypes.FOUR_PLAYER:
				query = `UPDATE ${STATS_TABLE} SET four_player_wins = four_player_wins + 1, level = ? WHERE user_id = ?`
				break
		}
		const [result] = await pool.execute(query, [level, userId])

		/* also return the wins */
		if (result.affectedRows > 0) {
			return { userId, level }
		}
		return null
	},
	async getStats(userId) {
		let query = `SELECT * FROM ${STATS_TABLE} WHERE user_id = ?`
		const [rows, fields] = await pool.execute(query, [userId])
		if (rows.length > 0) {
			return rows[0]
		}
		return null
	},
	async getLeaderboard() {
		/* returns the top 100 players */
		let query = `SELECT u.name, l.*, SUM(two_player_wins, three_player_wins, four_player_wins) AS total_wins FROM ${STATS_TABLE} AS l INNER JOIN ${USER_TABLE} AS u ON l.user_id = u.id ORDER BY total_wins`
		const [rows, fields] = await pool.execute(query)
		if (rows.length > 0) {
			return rows
		}
		return null
	},
}

module.exports = Stats
