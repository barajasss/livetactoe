const express = require("express")
const router = express.Router()
const rootRouter = express.Router()
const paypalController = require("./controllers/paypal.controller")

router.get("/", paypalController.getIndex)
router.get("/success", paypalController.getSuccess)
router.get("/cancel", paypalController.getCancel)
router.get("/process", paypalController.processPayment)

rootRouter.use("/paypal", router)

module.exports = rootRouter
