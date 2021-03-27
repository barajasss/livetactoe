const dotenv = require('dotenv')
dotenv.config()

var api_key = process.env.MAILGUN_API_KEY
var domain = 'mg.xyot4.com'
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain })

const sendMail = async (to = '', subject = '', text = '', callback) => {
	const data = {
		from: 'XYOT 4 <postmaster@mg.xyot4.com>',
		to,
		subject,
		text,
	}

	return new Promise((resolve, reject) => {
		mailgun.messages().send(data, function (err, body) {
			if (err) {
				return reject({ isSent: false, err, body })
			}
			return resolve({ isSent: true, err, body })
		})
	})
}

module.exports = { sendMail }
