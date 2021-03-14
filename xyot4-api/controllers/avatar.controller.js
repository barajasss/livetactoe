const Avatar = require('../models/avatar.model')

exports.getPurchasedAvatars = async (req, res) => {
	const { user_id: userId } = req.query
	if (!userId) {
		return res.status(400).json({
			msg:
				'user_id is required as a query param to get purchased avatars.',
		})
	}
	const avatars = await Avatar.getPurchasedAvatarsByUserId(userId)
	return res.status(200).json({
		msg: 'Purchased avatars by user',
		data: avatars,
	})
}

exports.purchaseAvatar = async (req, res) => {
	const { userId, avatar, avatarCost } = req.body
	const purchasedAvatars = await Avatar.purchaseAvatar(userId, avatar, avatarCost)
	if (purchasedAvatars) {
		res.status(200).json({
			msg: 'Avatar purchased successfully.',
			data: purchasedAvatars
		})
	} else {
		res.status(500).json({
			msg: 'Could not purchase avatar.',
		})
	}
}
