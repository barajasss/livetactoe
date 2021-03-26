const User = require('../../xyot4-api/models/user.model')
const Stats = require('../../xyot4-api/models/stats.model')

exports.getIndex = (req, res) => {
	res.render('admin/index')
}
exports.getUsers = async (req, res) => {
	const users = await User.getUsers()
	res.render('admin/users', {
		users,
	})
}
exports.getUser = async (req, res) => {
	const { userId } = req.params
	const { backurl } = req.query
	const user = (await User.getUser(userId)) || {}
	res.render('admin/user', {
		user,
		backurl,
	})
}
exports.deleteUser = async (req, res) => {
	const { userId } = req.params
	const { redirect_url: redirectUrl } = req.query
	await User.deleteUser(userId)
	res.redirect(`/admin/${redirectUrl}`)
}
exports.getLeaderboard = async (req, res) => {
	const leaderboard = await Stats.getLeaderboard()
	res.render('admin/leaderboard', { leaderboard })
}
