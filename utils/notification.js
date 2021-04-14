const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")
const { RoomTypes, GameTypes } = require("../models/rooms")
const Notification = require('../xyot4-api/models/notification.model')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

/* object that handles sending notifications when some player is waiting for a game */

const joinNotification = {
    [RoomTypes.TWO_PLAYER]: {
        send: () => pushNotification(
            "Join 3x3 multiplayer game",
            "Someone is waiting to play multiplayer game. Join now before someone does it!",
            { gameType: GameTypes.TWO_PLAYER.TWO_PLAYER, showJoiningRoom: true }
        ),
    },
    [RoomTypes.THREE_PLAYER]: {
        send: () => pushNotification(
            "Join 4x4 multiplayer game",
            "Someone is waiting to play multiplayer game. Join now before someone does it!",
            {
                gameType: GameTypes.TWO_PLAYER.THREE_PLAYER,
                showJoiningRoom: true,
            }
        ),
    },
    [RoomTypes.FOUR_PLAYER]: {
        send: () => pushNotification(
            "Join 5x5 multiplayer game",
            "Someone is waiting to play multiplayer game. Join now before someone does it!",
            {
                gameType: GameTypes.TWO_PLAYER.FOUR_PLAYER,
                showJoiningRoom: true,
            }
        ),
    },
}

function pushNotification(title, body, data) {
    /* send push notification to all the users */
    const registrationTokens = await Notification.getTokens()
    const message = {
        data,
        notification: {
            title,
            body,
        },
        tokens: registrationTokens,
    }
    return new Promise((resolve, reject) => {
        admin
            .messaging()
            .sendMulticast(message)
            // .then((res) => res.json())
            .then((data) => {
                console.log("success sending notificastion", data)
                resolve(data)
            })
            .catch((err) => {
                console.log("error sending notification", err)
                reject(err)
            })
    })
}

module.exports = { pushNotification, joinNotification }
