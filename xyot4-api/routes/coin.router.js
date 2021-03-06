const express = require('express')
const router = express.Router()
const coinController = require('../controllers/coin.controller')

router.get('/:userId', coinController.getCoinByUserId)

router.patch('/play/:userId', coinController.updateCoins(-1))
router.patch('/draw/:userId', coinController.updateCoins(0))
router.patch('/won/:userId', coinController.updateCoins(1))

module.exports = router
