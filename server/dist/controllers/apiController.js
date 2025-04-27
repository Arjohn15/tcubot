"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_email = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const send_email = async (req, resp) => {
    const { email, id, message, name } = req.body;
    const isMessageEmpty = message === "";
    const formatted_message = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TCUbot - Rejection Email</title>
</head>
<body style="font-family: sans-serif; background-color: #f7fafc; padding: 5px; color: #2d3748;">

  <div style="background-color: #ffffff; padding: 5px 20px 5px 20px ; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Logo at the top, centered -->
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://i.ibb.co/jvfXTFX5/tcubot-main-logo.png" alt="TCUbot Logo" style="width: 300px; height: auto; margin: 0 auto;">
    </div>

    <h1 style="font-size: 24px; color: #e53e3e; font-weight: 600; margin-bottom: 24px; text-align: left;">
      We're sorry, but your registration was rejected
    </h1>

    <p style="font-size: 18px; margin-bottom: 16px;">
      Dear <span style="font-weight: 600;">${name}</span>,
    </p>

    <p style="font-size: 18px; margin-bottom: 16px;">
    ${isMessageEmpty
        ? "We regret to inform you that your registration with TCUbot has been rejected for some reason."
        : "We regret to inform you that your registration with TCUbot has been rejected due to the following reason:"}
    </p>

    ${isMessageEmpty
        ? ""
        : `<p style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">${message}</p>`}

    <p style="font-size: 18px; margin-bottom: 16px;">
      If you believe this was a mistake or if you would like to discuss this matter further, please contact our support team at
      <a href="mailto:tcuva23@gmail.com" style="color: #3182ce;">tcuva23@gmail.com</a>.
    </p>

    <p style="font-size: 18px; margin-bottom: 24px;">Thank you for your understanding.</p>

    <p style="font-size: 18px; margin-bottom: 24px;">Sincerely,</p>

    <p style="font-size: 18px; font-weight: 600;">The TCUbot Team</p>

    <div style="margin-top: 24px; text-align: center; font-size: 14px; color: #a0aec0;">
      <p>
        If you did not make this request, please disregard this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: `TCUbot Admin Team: <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Message from TCUbot`,
            html: formatted_message,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        resp.status(200).json({ message: "Email sent!" });
    }
    catch (err) {
        console.error("Failed to send email:", err);
        resp
            .status(502)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.send_email = send_email;
