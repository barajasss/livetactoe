const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/login', authController.loginAndSendOtp)
router.post('/verifyOtp', authController.verifyOtp)
router.post('/logout', authController.logout)

module.exports = router
