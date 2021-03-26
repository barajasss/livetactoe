const express = require('express')
const router = express.Router()
const rootRouter = express.Router()
const viewController = require('./controllers/view.controller')

router.get('/', viewController.getIndex)
router.get('/users', viewController.getUsers)
router.get('/users/:userId', viewController.getUser)
router.get('/leaderboard', viewController.getLeaderboard)

rootRouter.use('/admin', router)

module.exports = rootRouter
