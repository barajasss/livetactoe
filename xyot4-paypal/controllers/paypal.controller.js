const paypal = require("paypal-rest-sdk")

paypal.configure({
    mode: "sandbox",
    client_id:
        "AZRfhCvJSHgUl8ModDewJo3DBfXMLEw70tLn61_iYUowDVJp4tgtEeuAJlJYz9dPRoY_fk34Le5Zdar2",
    client_secret:
        "EMEO0yeh9aQu-gWVGrWZlI26Yxlgc-sVN8G5Q09HImVq8MW59cM3YjsBb-6qwl5W-MXnSnTJfM-Ozb2R",
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
                    total: "1.00",
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
    const { userId, itemName, price } = req.body

    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "http://socketserver.xyot4.com:3000/paypal/success",
            cancel_url: "http://socketserver.xyot4.com:3000/paypal/cancel",
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
