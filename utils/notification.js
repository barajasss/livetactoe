const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")
const { RoomTypes, GameTypes, GameModes } = require("../models/rooms")
const Notification = require("../xyot4-api/models/notification.model")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

/* object that handles sending notifications when some player is waiting for a game */

const joinNotification = {
    [RoomTypes.TWO_PLAYER]: {
        send: () =>
            pushNotification(
                "Join 3x3 multiplayer game",
                "Someone is waiting to play multiplayer game. Join now before someone does it!",
                {
                    gameType: GameTypes.TWO_PLAYER,
                    gameMode: GameModes.ONLINE_PUBLIC,
                    showJoiningRoom: true,
                }
            ).catch((err) => {
                console.log(err)
            }),
    },
    [RoomTypes.THREE_PLAYER]: {
        send: () =>
            pushNotification(
                "Join 4x4 multiplayer game",
                "Someone is waiting to play multiplayer game. Join now before someone does it!",
                {
                    gameType: GameTypes.THREE_PLAYER,
                    gameMode: GameModes.ONLINE_PUBLIC,
                    showJoiningRoom: true,
                }
            ),
    },
    [RoomTypes.FOUR_PLAYER]: {
        send: () =>
            pushNotification(
                "Join 5x5 multiplayer game",
                "Someone is waiting to play multiplayer game. Join now before someone does it!",
                {
                    gameType: GameTypes.FOUR_PLAYER,
                    gameMode: GameModes.ONLINE_PUBLIC,
                    showJoiningRoom: true,
                }
            ),
    },
}

async function pushNotification(title, body, data) {
    /* send push notification to all the users */
    let registrationTokens = await Notification.getTokens()
    if (registrationTokens && registrationTokens.length !== 0) {
        /* do proper transformation from array of objects to array of tokens */
        registrationTokens = registrationTokens.map((token) => token.token)
    } else {
        return
    }

    const message = {
        android: {
            notification: {
                title,
                body,
                tag: "myuniquetag",
            },
        },
        tokens: registrationTokens,
    }

    /* convert the data property values to string */
    if (data) {
        Object.keys(data).forEach((key) => {
            data[key] = data[key].toString()
        })
        message.data = data
    }

    return new Promise((resolve, reject) => {
        admin
            .messaging()
            .sendMulticast(message)
            // .then((res) => res.json())
            .then((data) => {
                console.log(
                    "success sending notification",
                    data,
                    data.responses[0].error
                )
                resolve(data)
            })
            .catch((err) => {
                console.log("error sending notification", err)
                reject(err)
            })
    })
}

module.exports = { pushNotification, joinNotification }
