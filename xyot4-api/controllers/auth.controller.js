const pool = require('../connection')
const User = require('../models/user.model')

exports.loginAndSendOtp = async (req, res) => {
	// every time user has to verify otp for logging in
	// if email did not exist before, a new account is created automatically...

	const { name, email } = req.body

	if (!name || !email) {
		return res.status(400).json({ msg: 'name and email are required' })
	}

	// determine if user exists
	const user = await User.findByEmail(email)

	if (user) {
		// user already exists..
		await User.sendOtp(email)
		return res.status(200).json({
			msg: 'otp sent',
		})
	} else {
		// create a new user
		const insertId = await User.createUser(name, email)
		await User.sendOtp(email)
		return res.status(200).json({ msg: 'otp sent', data: { insertId } })
	}
}

exports.verifyOtp = async (req, res) => {
	const { email, otp } = req.body

	// determine if user exists
	const user = await User.verifyOtp(email, otp)

	if (user) {
		// otp verified successfully...
		return res.status(200).json({
			msg: 'OTP verified successfully',
			data: user,
			otpVerified: true,
		})
	}

	// return failure...
	return res.status(400).json({
		msg: 'OTP is invalid',
		data: null,
		otpVerified: false,
	})
}

exports.logout = async (req, res) => {
	const { email } = req.body

	// determine if user exists
	const loggedOut = await User.logout(email)

	if (loggedOut) {
		return res.status(200).json({
			msg: 'logged out successfully',
			data: null,
		})
	}

	// return failure...
	return res.status(500).json({
		msg: 'could not log out',
		data: null,
	})
}
