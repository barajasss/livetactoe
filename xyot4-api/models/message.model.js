const pool = require('../connection')
const MESSAGE_TABLE = 'messages'

const Message = {
	async getMessages() {
		const query = `SELECT * FROM ${MESSAGE_TABLE} ORDER BY timestamp DESC`
		const [rows] = await pool.execute(query)
		if (rows.length > 0) {
			return rows
		}
		return []
	},
	async addMessage(userId, message) {
		console.log('message to insert', userId, message)
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
