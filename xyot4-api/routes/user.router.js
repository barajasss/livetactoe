const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')

router.get('/:userId', userController.getUser)
router.patch('/:userId', userController.updateUser)

module.exports = router
