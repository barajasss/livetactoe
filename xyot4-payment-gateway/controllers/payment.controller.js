const Wallet = require("../../xyot4-api/models/wallet.model")

// instamojo

const axios = require("axios")
const dotenv = require("dotenv")
const { purchaseItem } = require("./purchase.controller")

dotenv.config()

let apiKey, authToken, paymentUrl, paymentDetailUrl

if (process.env.PAYMENT_MODE === "LIVE") {
    // run the payment in live mode...
    paymentUrl = "https://www.instamojo.com/api/1.1/payment-requests/"
    paymentDetailUrl = "https://test.instamojo.com/api/1.1/payments/"
    apiKey = process.env.INSTAMOJO_API_KEY
    authToken = process.env.INSTAMOJO_AUTH_TOKEN
} else {
    // run the payment in test mode...
    paymentUrl = "https://test.instamojo.com/api/1.1/payment-requests/"
    paymentDetailUrl = "https://www.instamojo.com/api/1.1/payments/"
    apiKey = process.env.TEST_INSTAMOJO_API_KEY
    authToken = process.env.TEST_INSTAMOJO_AUTH_TOKEN
}

var headers = {
    "X-Api-Key": apiKey,
    "X-Auth-Token": authToken,
}

exports.createPaymentLink = async (req, res) => {
    const { userId, name, phone, email, amount, purpose, itemCode, itemValue } = req.body
    var payload = {
        purpose,
        amount,
        phone,
        buyer_name: name,
        redirect_url: `${axios.defaults.baseURL}/payment/complete?user_id=${userId}&item_code=${itemCode}&item_value=${itemValue}&transaction_details=${purpose}&amount=${amount}`,
        send_email: false,
        // webhook: `${axios.defaults.baseURL}/payment/webhook`,
        send_sms: false,
        email,
        allow_repeated_payments: true,
    }

    try {
        const response = await axios.post(
            paymentUrl,
            {
                ...payload,
            },
            { headers }
        )
        const longurl = response.data.payment_request.longurl
        if (response.status == 201) {
            return res.json({
                longurl,
                message: "hello world",
            })
        } else {
            return res.json({ message: "something went wrong" })
        }
    } catch (err) {
        console.log("error", err.response.data)
        return res.json({
            message: err.message,
            response: err.response,
        })
    }
}

exports.transactionWebhook = async (req, res) => {
    // webhook that will run after the transaction is completed

    const { payment_id, status, buyer: email, buyer_name, buyer_phone, amount } = req.body
    console.log("WEBHOOK  REQ BODY DETAILS", req.body)
    if (status === "Credit") {
        // payment was successful
        return res.json({ message: "webhook payment success", body: req.body })
    } else {
        // payment was a failure
        return res.json({ message: "webhook payment failure", body: req.body })
    }
}

exports.transactionRedirect = async (req, res) => {
    const {
        payment_id: paymentId,
        payment_status: paymentStatus,
        item_code: itemCode,
        item_value: itemValue,
        user_id: userId,
        transaction_details: transactionDetails,
        amount: amount,
    } = req.query

    if (paymentStatus === "Credit") {
        // payment was successful
        const paymentObj = {
            message: "Purchase was successful!",
            paymentStatus,
            paymentId,
            itemCode,
            itemValue,
            userId,
        }
        await Wallet.createTransaction(
            userId,
            amount,
            paymentId,
            transactionDetails,
            itemCode,
            itemValue,
            "instamojo"
        )
        // purchase the item code...
        purchaseItem(userId, itemCode, itemValue)

        // return a view response of success...
        return res.json(paymentObj)
    } else {
        // payment was a failure

        const paymentObj = {
            message: "Failed to purchase.",
            payment_status,
            payment_id,
        }

        // return a view response of failure
        return res.json(paymentObj)
    }
}
