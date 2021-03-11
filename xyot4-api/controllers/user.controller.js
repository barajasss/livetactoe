const User = require('../models/user.model')

exports.getUser = async (req, res) => {
	const { userId } = req.params
	/* user also includes the coins from other table */
	const user = await User.getUser(userId)
	if (user) {
		return res.status(200).json({
			msg: 'User found',
			data: user,
		})
	}
	return res.status(500).json({ msg: 'could not find user' })
}

exports.updateUser = async (req, res) => {
	const { user } = req.body
	const { userId } = req.params

	if (!user) {
		return res.status(500).json({
			msg: `user to update is required with proper properties`,
		})
	}
	const userUpdated = await User.updateUser(userId, user)
	if (userUpdated) {
		// user updated successfully...
		const updatedUser = await User.getUser(userId)
		return res.status(200).json({
			msg: 'User updated successfully',
			data: updatedUser,
		})
	}
	return res
		.status(500)
		.json({ msg: 'could not update the user. make sure email is valid' })
}
