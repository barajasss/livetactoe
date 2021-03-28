const express = require('express')
const router = express.Router()
const messageController = require('../controllers/message.controller')

router.get('/', messageController.getMessages)
router.get('/:messageId', messageController.getMessage)

/* using normal html forms to perform these actions so put and 
delete won't be possible unless ajax is used */

router.post('/', messageController.createMessage)
router.post('/view/:messageId', messageController.updateMessage)
router.post('/delete/:messageId', messageController.deleteMessage)

module.exports = router
