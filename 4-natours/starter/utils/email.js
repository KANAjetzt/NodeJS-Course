const nodemailer = require('nodemailer')

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '39bd8544c4acb1',
      pass: '1856b0243444a3',
    },
  })

  // 2) Define the email options
  const mailOptions = {
    from: 'Natours <natours@k-roth.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  }

  // 3) Actually send the email
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
