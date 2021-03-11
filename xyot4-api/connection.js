const mysql = require('mysql2/promise')

// Create the connection pool. The pool-specific settings are the defaults

let database = 'xyot4_xyot'
let host = 'localhost'
let user = 'root'
let password = ''

if (process.env.NODE_ENV === 'production') {
	database = process.env.DB_NAME
	host = process.env.DB_HOST
	user = process.env.DB_USER
	password = process.env.DB_PASSWORD
}

const pool = mysql.createPool({
	host,
	user,
	database,
	password,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
})

module.exports = pool
