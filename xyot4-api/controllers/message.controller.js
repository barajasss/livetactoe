const Message = require('../models/message.model')

exports.getMessages = async (req, res) => {
	const messages = await Message.getMessages()
	res.status(200).json({
		msg: 'all messages fetched',
		data: messages,
	})
}

exports.createMessage = async (req, res) => {
	const { userId, message } = req.body
	if (!userId || !message) {
		return res.status(500).json({
			msg:
				'properties userId and message are required in the request body',
		})
	}

	const created = await Message.addMessage(userId, message)
	if (created) {
		return res.status(200).json({
			msg: 'Message created successfully.',
		})
	}
	return res.status(500).json({
		msg: 'Could not post the message',
	})
}

exports.updateMessage = async (req, res) => {
	const { messageId } = req.params
	/* supports only updating viewed property right now */

	const viewed = await Message.viewMessage(messageId)
	if (viewed) {
		return res.status(200).json({
			msg: 'Message marked as viewed successfully.',
		})
	}
	return res.status(500).json({
		msg: 'could not mark the message as viewed',
	})
}

exports.deleteMessage = async (req, res) => {
	const { messageId } = req.params

	const deleted = await Message.deleteMessage(messageId)
	if (deleted) {
		return res.status(200).json({
			msg: 'Message deleted successfully.',
		})
	}
	return res.status(500).json({
		msg: 'Could not delete the message',
	})
}
