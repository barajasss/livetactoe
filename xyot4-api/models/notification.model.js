const pool = require("../connection")
const NOTIFICATION_TABLE = "notification_tokens"

const Notification = {
    async getTokens() {
        const query = `SELECT token FROM ${NOTIFICATION_TABLE}`
        const [rows, fields] = await pool.execute(query)
        if (rows.length > 0) {
            return rows
        }
        return []
    },
    async storeToken(token) {
        /* returns the user together with the total coins
         * accepts email or userId
         */
        const query = `
				INSERT INTO ${NOTIFICATION_TABLE}(token) VALUES(?)
			`
        const [result] = await pool.execute(query, [token])
        if (result.affectedRows > 0) return token
        return null
    },
}

module.exports = Notification
