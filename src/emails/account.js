const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const from = process.env.ADMIN_EMAIL

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: from,
        subject: "Task Manager by Gerald Downey | Welcome",
        text: `Hello ${name}! Welcome to Task Manager! Time to add some tasks!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: from,
        subject: "Task Manager by Gerald Downey | Goodbye",
        text: `Goodbye ${name}, we are sorry to see you leave Task Manager! Is there anything we can do to make you change your mind?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}