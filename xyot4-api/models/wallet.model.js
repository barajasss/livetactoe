/* controls transactions and online purchases */

const pool = require("../connection")
const WALLET_TABLE = "wallet"
const { sendMail } = require("../../utils/mail")

// Login state maintained in the server.
// status 1 - user is logged in.
// status 0 - user is logged out.

const Wallet = {
    async createTransaction(
        userId,
        amount,
        transaction_id,
        transaction_details,
        item_code,
        item_value,
        client
    ) {
        const query = `INSERT INTO ${WALLET_TABLE} (user_id, amount, transaction_id, transaction_details, item_code, item_value, client) VALUES(?, ? ,?,?,?,?,?)`
        const [result] = await pool.execute(query, [
            userId,
            amount,
            transaction_id,
            transaction_details,
            item_code,
            item_value,
            client,
        ])
        if (result.affectedRows) {
            return result.insertId
        }
        return null
    },
}

module.exports = Wallet
