const express = require('express')
const router = express.Router()
const statsController = require('../controllers/stats.controller')

router.get('/leaderboard', statsController.getLeaderboard)
router.get('/:userId', statsController.getStats)
router.patch('/wins/:userId', statsController.addWins)
router.patch('/losses/:userId', statsController.addLosses)
router.patch('/draws/:userId', statsController.addDraws)

module.exports = router
