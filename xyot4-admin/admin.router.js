const express = require('express')
const router = express.Router()
const rootRouter = express.Router()
const viewController = require('./controllers/view.controller')

router.get('/login', viewController.getLogin)
router.post('/login', viewController.loginAdmin)
router.post('/logout', viewController.logoutAdmin)

/* protected routes */

router.use(viewController.protect)

router.get('/', viewController.getIndex)
router.get('/users', viewController.getUsers)
router.get('/users/:userId', viewController.getUser)

router.post('/users/delete/:userId', viewController.deleteUser)

router.get('/leaderboard', viewController.getLeaderboard)

rootRouter.use('/admin', router)

module.exports = rootRouter
