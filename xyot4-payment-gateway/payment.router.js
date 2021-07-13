const express = require("express")
const router = express.Router()
const rootRouter = express.Router()
const paymentController = require("./controllers/payment.controller")

router.post("/create", paymentController.createPaymentLink)
router.get("/complete", paymentController.transactionRedirect)
router.post("/webhook", paymentController.transactionWebhook)

rootRouter.use("/payment", router)

module.exports = rootRouter
