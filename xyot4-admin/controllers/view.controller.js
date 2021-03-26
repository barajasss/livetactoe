const User = require('../../xyot4-api/models/user.model')
const Stats = require('../../xyot4-api/models/stats.model')

exports.protect = (req, res, next) => {
	/* middleware to only allow logged in routes */
	if (req.session.isLoggedIn) next()
	else res.redirect('/admin/login')
}
exports.getIndex = (req, res) => {
	res.render('admin/index')
}
exports.getLogin = (req, res) => {
	if (req.session.isLoggedIn) res.redirect('/admin')
	res.render('admin/login')
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
exports.getLeaderboard = async (req, res) => {
	const leaderboard = await Stats.getLeaderboard()
	res.render('admin/leaderboard', { leaderboard })
}

/* post requests */
exports.loginAdmin = (req, res) => {
	const { username, password } = req.body
	if (
		username === process.env.ADMIN_USERNAME &&
		password === process.env.ADMIN_PASSWORD
	) {
		/* store the session after successful login */
		req.session.isLoggedIn = true
	}

	/* attempt redirection to admin panel */
	res.redirect(`/admin`)
}
exports.logoutAdmin = (req, res) => {
	req.session.destroy()
	res.redirect(`/admin/login`)
}
exports.deleteUser = async (req, res) => {
	const { userId } = req.params
	const { redirect_url: redirectUrl } = req.query
	await User.deleteUser(userId)
	res.redirect(`/admin/${redirectUrl}`)
}
