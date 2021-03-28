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
router.get('/messages', viewController.getMessages)
router.get('/messages/:messageId', viewController.getMessage)
router.get('/users', viewController.getUsers)
router.get('/users/:userId', viewController.getUser)
router.get('/leaderboard', viewController.getLeaderboard)

/* post requests */

router.post('/users/delete/:userId', viewController.deleteUser)
router.post('/messages/view/:messageId', viewController.viewMessage)
router.post('/messages/delete/:messageId', viewController.deleteMessage)

rootRouter.use('/admin', router)

module.exports = rootRouter
