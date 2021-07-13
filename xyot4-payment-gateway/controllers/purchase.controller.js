const Coin = require("../../xyot4-api/models/coin.model")
const User = require("../../xyot4-api/models/user.model")

const PURCHASE_CODES = {
    COIN: "COIN",
    // coffee is considered donation
    DONATION: "DONATION",
    NOADS: "NOADS",
}

exports.purchaseItem = async (userId, itemCode, itemValue) => {
    console.log("purhcase item", userId, itemCode, itemValue)

    /* the item code to purchase must match with the value sent from frontend */
    /* if possible store in some constant or database in future */

    switch (itemCode) {
        case PURCHASE_CODES.COIN: {
            await Coin.addCoins(userId, itemValue)
            break
        }
        case PURCHASE_CODES.DONATION: {
            // do nothing....
            break
        }
        case PURCHASE_CODES.NOADS: {
            await User.updateUser(userId, { noads: true })
            break
        }
        default: {
            // code didn't match... do nothing...
            break
        }
    }
}
