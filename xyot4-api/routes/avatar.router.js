const express = require('express')
const router = express.Router()
const avatarController = require('../controllers/avatar.controller')

router.get('/', avatarController.getPurchasedAvatars)
router.post('/', avatarController.purchaseAvatar)

module.exports = router
