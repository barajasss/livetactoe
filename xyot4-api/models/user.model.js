const pool = require('../connection')
const USER_TABLE = 'users'
const COIN_TABLE = 'users_coin'

// Login state maintained in the server.
// status 1 - user is logged in.
// status 0 - user is logged out.

const User = {
	generateOtp() {
		return 12345
	},
	async findByEmail(email) {
		const query = `SELECT * FROM ${USER_TABLE} WHERE user_email = ?`
		const [rows, fields] = await pool.execute(query, [email])
		if (rows.length > 0) {
			// user exists
			const user = rows[0]
			return user
		}
		return null
	},
	async createUser(name, email) {
		const query = `INSERT INTO ${USER_TABLE} (name, user_email) VALUES(?, ?)`
		const [result] = await pool.execute(query, [name, email])
		if (result.affectedRows) {
			return result.insertId
		}
		return null
	},
	async verifyOtp(email, otp) {
		const user = await this.findByEmail(email)
		if (!user) return null

		if (String(otp) === user.otp) {
			// update user status to 1 and reset otp
			const query = `UPDATE ${USER_TABLE} SET status = 1, otp='' WHERE user_email = ?`
			const [result] = await pool.execute(query, [email])
			if (result.affectedRows > 0) {
				user.status = 1
				return user
			}
		}
		return null
	},
	async sendOtp(email) {
		const user = await this.findByEmail(email)
		if (!user) return null

		const otp = this.generateOtp()
		const query = `UPDATE ${USER_TABLE} SET otp = ? WHERE user_email = ?`
		const [result] = await pool.execute(query, [otp, email])
		if (result.affectedRows > 0) {
			return true
		}
		return false
	},
	async logout(email) {
		const user = await this.findByEmail(email)
		if (!user) return null
		const query = `UPDATE ${USER_TABLE} SET status = 0 WHERE user_email = ?`
		const [result] = await pool.execute(query, [email])
		if (result.affectedRows > 0) {
			// logged out successfully
			return true
		}
		// could not logout
		return false
	},
	async getUsers() {
		const query = `SELECT id, name, user_email FROM ${USER_TABLE}`
		const [rows, fields] = await pool.execute(query)
		if (rows.length > 0) {
			return rows
		}
		return []
	},
	async getUser(userId) {
		/* returns the user together with the total coins
		 * accepts email or userId
		 */

		const query = `
			SELECT u.*, t.total_coins AS coins FROM ${USER_TABLE} AS u INNER JOIN ${COIN_TABLE} AS t
			ON u.id = t.user_id
			WHERE u.id = ?
		`
		const [rows, fields] = await pool.execute(query, [userId])
		if (rows.length > 0) {
			const user = rows[0]
			return user
		} else {
			// TRY AGAIN WITH userId as EMAIL ... try to get user from email
			const query = `
				SELECT u.*, t.total_coins AS coins FROM ${USER_TABLE} AS u INNER JOIN ${COIN_TABLE} AS t
				ON u.id = t.user_id
				WHERE u.user_email = ?
			`
			const [rows, fields] = await pool.execute(query, [userId])
			if (rows.length > 0) {
				const user = rows[0]
				return user
			}
		}
		return null
	},
	async updateUser(userId, user) {
		// find user either by userId or email as both are unique...
		const currentUser = await this.getUser(userId)
		if (!currentUser) return null

		/* accepts the updated values */

		const id = user.id || currentUser.id
		const name = user.name || currentUser.name
		const user_phone = user.user_phone || currentUser.user_phone
		const city = user.city || currentUser.city
		const state = user.state || currentUser.state
		const avatar = user.avatar || currentUser.avatar

		console.log(user)
		const query = `
			UPDATE ${USER_TABLE} AS u
			INNER JOIN ${COIN_TABLE} AS t
			ON u.id = t.user_id
			SET u.name = ?, u.user_phone = ?, u.city = ?, u.state = ?, u.avatar = ?
			WHERE u.id = ?
		`

		const [result] = await pool.execute(query, [
			name,
			user_phone,
			city,
			state,
			avatar,
			id,
		])

		if (result.affectedRows > 0) {
			// return the updated user if update is successful...
			const updatedUser = await this.findByEmail(currentUser.user_email)
			return updatedUser
		}
		return false
	},
}

module.exports = User
