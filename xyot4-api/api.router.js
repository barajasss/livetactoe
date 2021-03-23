const express = require('express')
const router = express.Router()

const authRouter = require('./routes/auth.router')
const coinRouter = require('./routes/coin.router')
const userRouter = require('./routes/user.router')
const avatarRouter = require('./routes/avatar.router')
const leaderboardRouter = require('./routes/leaderboard.router')

router.use((req, res, next) => {
	// API key is required to communicate between the client and the server...

	let { api_key } = req.body

	if (!api_key) {
		;({ api_key } = req.query)
	}
	if (api_key === process.env.API_KEY) {
		return next()
	}
	// if api_key not found in GET or POST request...
	return res.status(403).json({ msg: 'api_key is required/invalid' })
})

router.use('/', authRouter)
router.use('/coins', coinRouter)
router.use('/users', userRouter)
router.use('/avatars', avatarRouter)
router.use('/leaderboard', leaderboardRouter)

module.exports = router
