const pool = require('../connection')
const MESSAGE_TABLE = 'messages'
const USER_TABLE = 'users'

const Message = {
	async getMessages() {
		const query = `SELECT * FROM ${MESSAGE_TABLE} ORDER BY timestamp DESC`
		const [rows] = await pool.execute(query)
		if (rows.length > 0) {
			return rows
		}
		return []
	},
	async getMessage(messageId) {
		const query = `SELECT m.*, u.name, u.user_email FROM ${MESSAGE_TABLE} AS m INNER JOIN ${USER_TABLE} AS u ON m.user_id = u.id WHERE m.id = ?`
		let [rows] = await pool.execute(query, [messageId])
		if (rows.length > 0) {
			return rows[0]
		} else {
			/* ANONYMOUS MESSAGES: select message without user details if message has no user associated with it */
			const query = `SELECT * FROM ${MESSAGE_TABLE} WHERE id=?`
			let [rows2] = await pool.execute(query, [messageId])
			if (rows2.length > 0) {
				return rows2[0]
			}
		}
		return null
	},
	async addMessage(userId, message) {
		const query = `INSERT INTO ${MESSAGE_TABLE}(user_id, message) VALUES(?, ?)`
		const [result] = await pool.execute(query, [userId, message])
		if (result.affectedRows > 0) {
			return true
		}
		return false
	},
	async viewMessage(messageId) {
		const query = `UPDATE ${MESSAGE_TABLE} SET viewed = 1 WHERE id=?`
		const [result] = await pool.execute(query, [messageId])
		if (result.affectedRows > 0) {
			return true
		}
		return false
	},
	async deleteMessage(messageId) {
		const query = `DELETE FROM ${MESSAGE_TABLE} WHERE id=?`
		const [result] = await pool.execute(query, [messageId])
		if (result.affectedRows > 0) {
			return true
		}
		return false
	},
}

module.exports = Message
