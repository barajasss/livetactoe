const paypal = require("paypal-rest-sdk")

paypal.configure({
    mode: "sandbox",
    client_id:
        "ATV08R7oSF4E7g6chN7OexIVB9bLZ8RHkqivVn9VsbJfBaNdaRiOWRfTiZy-_TdRsHnFVTlOXvt4qjA6",
    client_secret:
        "EBl0YXYwUSFSmRogH2O3CoM7YON5bsHOwyoSSIiFoZuL5MRt56jF1p6rElT7EKZlA5B5JpduMuMf4eKQ",
})

exports.getIndex = (req, res) => {
    res.render("paypal/index")
}

exports.getSuccess = (req, res) => {
    /* execute the payment */
    const paymentId = req.query.paymentId
    const PayerID = req.query.PayerID

    const execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: "50.00",
                },
            },
        ],
    }

    paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
            if (error) {
                console.log(error.response)
                throw error
            } else {
                console.log("Get Payment Response")
                console.log(JSON.stringify(payment))
                res.render("paypal/success")
            }
        }
    )
}

exports.getCancel = (req, res) => {
    res.render("paypal/cancel")
}

exports.processPayment = (req, res) => {
    const { userId, itemName, price } = req.query
    console.log("userId", userId, "price", price)
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            // return_url: "http://socketserver.xyot4.com:3000/paypal/success",
            // cancel_url: "http://socketserver.xyot4.com:3000/paypal/cancel",

            return_url: "http://localhost:3000/paypal/success",
            cancel_url: "http://localhost:3000/paypal/cancel",
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "coin",
                            sku: "coin",
                            price: `${price}`,
                            currency: "USD",
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: "USD",
                    total: `${price}`,
                },
                description: "Buying additional coins.",
            },
        ],
    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error
        } else {
            console.log("Create Payment Response")
            console.log(payment)
            res.redirect(payment.links[1].href)
        }
    })
}
