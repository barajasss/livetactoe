const pool = require('../connection')
const LEADERBOARD_TABLE = 'leaderboard'
const USER_TABLE = 'users'

const Avatar = {
	async createNew(userId) {
		const level = 0
		const wins = 0
		let query = `INSERT INTO ${LEADERBOARD_TABLE} (user_id, wins, level) VALUES(?, ?, ?)`
		const [result] = await pool.execute(query, [userId, wins, level])
		if (result.affectedRows > 0) {
			/* return the inserted data */
			return { userId, wins, level }
		}
		return null
	},
	async updateWin(userId) {
		/* increments the win count and then updates the level also. */

		/*  Calculate level first from wins
            User Level management : default level is 0
            Level 1 : total 10 wins.
            Level 2 : need 15 wins more i.e total 25 wins.
            Level 3 : need 20 wins more i.e total 45 wins. And so on increase by 5
        */
		let query = `SELECT wins FROM ${LEADERBOARD_TABLE} WHERE user_id=?`
		const [rows, fields] = await pool.execute(query, [userId])
		let level, wins

		if (rows.length > 0) {
			/* calculate level */
			wins = rows[0].wins + 1
			function getWins(level) {
				/* returns the minimum wins required to reach that level */
				/* sum of arithmetic sequence (n * (2a + (n-1)d)) / 2 */
				return (level * (2 * 10 + (level - 1) * 5)) / 2
			}
			level = 0
			let nextLevel = 1
			while (wins >= getWins(nextLevel)) {
				level = nextLevel
				nextLevel += 1
			}
		} else {
			return null
		}

		query = `UPDATE ${LEADERBOARD_TABLE} SET wins = ?, level = ? WHERE user_id = ?`
		const [result] = await pool.execute(query, [wins, level, userId])

		/* also return the wins */
		if (result.affectedRows > 0) {
			return { userId, wins, level }
		}
		return null
	},
	async getData(userId) {
		let query = `SELECT * FROM ${LEADERBOARD_TABLE} WHERE user_id = ?`
		const [rows, fields] = await pool.execute(query, [userId])
		if (rows.length > 0) {
			return rows[0]
		}
		return null
	},
	async getLeaderboard() {
		/* returns the top 100 players */
		let query = `SELECT u.name, l.* FROM ${LEADERBOARD_TABLE} AS l INNER JOIN ${USER_TABLE} AS u ON l.user_id = u.id ORDER BY wins`
		const [rows, fields] = await pool.execute(query)
		if (rows.length > 0) {
			return rows
		}
		return null
	},
}

module.exports = Avatar
