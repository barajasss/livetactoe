const express = require('express')
const router = express.Router()
const leaderboardController = require('../controllers/leaderboard.controller')

router.get('/', leaderboardController.getLeaderboard)
router.get('/:userId', leaderboardController.getLeaderboardRow)
router.patch('/:userId', leaderboardController.addWin)

module.exports = router
