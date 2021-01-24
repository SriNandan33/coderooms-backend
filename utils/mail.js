const EMAIL_CLIENT = require('@sendgrid/mail')

const SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL
EMAIL_CLIENT.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = (reciever, subject, body) => {
  const message = {
    to: reciever,
    from: SENDER_EMAIL,
    subject: subject,
    html: body,
  }
  EMAIL_CLIENT.send(message)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = {
  sendEmail,
}
