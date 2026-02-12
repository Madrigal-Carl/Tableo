const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendVerificationEmail(to, code) {
    const mailOptions = {
        from: `"Tabléo" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your Verification Code",
        html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f9fafb; padding: 40px;">
        <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background-color: #FA824C; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Tabléo</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; text-align: center;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
              Use the verification code below to continue:
            </p>

            <!-- Code -->
            <div style="
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 6px;
              color: #FA824C;
              background-color: #FFF3ED;
              padding: 16px 0;
              border-radius: 10px;
              margin: 24px 0;
            ">
              ${code}
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
              This code will expire shortly. If you did not request this, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} Tabléo. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `,
        text: `Your verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
