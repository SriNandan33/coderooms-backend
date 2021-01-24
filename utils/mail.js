const EMAIL_CLIENT = require('@sendgrid/mail')

const SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL
EMAIL_CLIENT.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (reciever, subject, body) => {
  const message = {
    to: reciever,
    from: SENDER_EMAIL,
    subject: subject,
    content: [
      {
        type: 'text/html',
        value: body,
      },
    ],
  }
  return EMAIL_CLIENT.send(message)
}

module.exports = {
  sendEmail,
}
