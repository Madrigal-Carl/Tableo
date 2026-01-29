const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,      // e.g., smtp.gmail.com
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,    // your email
        pass: process.env.SMTP_PASS,    // your email password or app password
    },
});

async function sendVerificationEmail(to, code) {
    const mailOptions = {
        from: `"Tableo" <${process.env.SMTP_USER}>`, // sender
        to,                                           // recipient
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <b>${code}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
