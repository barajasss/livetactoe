const pool = require('../connection')
const USER_TABLE = 'users'

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
	},
	async createUser(name, email) {
		const query = `INSERT INTO ${USER_TABLE} (name, user_email) VALUES(?, ?)`
		const [result] = await pool.execute(query, [name, email])
		if (result.affectedRows) {
			return result.insertId
		}
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
}

module.exports = User
