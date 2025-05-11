"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.send_email_accept = exports.send_email_reject = exports.admin_dashboard = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = require("../config/db");
const mongodb_1 = require("mongodb");
const registrants = db_1.db.collection("registrants");
const admins = db_1.db.collection("admins");
const users = db_1.db.collection("users");
const admin_dashboard = async (req, resp) => {
    try {
        const admin_id = req.user.id;
        const allRegistrants = await registrants
            .find({}, {
            projection: {
                hashedPassword: 0,
            },
        })
            .toArray();
        const selectedAdmin = await admins.findOne({ _id: new mongodb_1.ObjectId(`${admin_id}`) }, {
            projection: {
                hashedPassword: 0,
            },
        });
        resp
            .status(200)
            .json({ registrants: allRegistrants, admin: selectedAdmin });
    }
    catch (err) {
        console.error(err);
        resp.status(500).json({ error: "Something went wrong" });
    }
};
exports.admin_dashboard = admin_dashboard;
const send_email_reject = async (req, resp) => {
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
        const result = await registrants.deleteOne({ _id: new mongodb_1.ObjectId(`${id}`) });
        if (result.deletedCount === 0) {
            return resp.status(404).json({ message: "User not found" });
        }
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}. Registrant successfully deleted.`);
        return resp
            .status(200)
            .json({ message: "Email sent and registrant deleted!" });
    }
    catch (err) {
        console.error("Failed to send email or registrant was not deleted:", err);
        return resp.status(404).json({ message: "Registrant not found" });
    }
};
exports.send_email_reject = send_email_reject;
const send_email_accept = async (req, resp) => {
    const { email, id, name } = req.body;
    const formatted_message = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TCUbot - Registration Approved</title>
</head>
<body style="font-family: sans-serif; background-color: #f7fafc; padding: 5px; color: #2d3748;">

  <div style="background-color: #ffffff; padding: 5px 20px 5px 20px ; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Logo at the top, centered -->
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://i.ibb.co/jvfXTFX5/tcubot-main-logo.png" alt="TCUbot Logo" style="width: 300px; height: auto; margin: 0 auto;">
    </div>

    <h1 style="font-size: 24px; color: #38a169; font-weight: 600; margin-bottom: 24px; text-align: left;">
      Congratulations! Your registration has been approved 🎉
    </h1>

    <p style="font-size: 18px; margin-bottom: 16px;">
      Dear <span style="font-weight: 600;">${name}</span>,
    </p>

    <p style="font-size: 18px; margin-bottom: 16px;">
      We're excited to let you know that your registration with TCUbot has been successfully approved.
    </p>

    <p style="font-size: 18px; margin-bottom: 16px;">
      You can now sign in to your account using the credentials you provided during registration. If you have any questions or need assistance, feel free to reach out to our support team at
      <a href="mailto:tcuva23@gmail.com" style="color: #3182ce;">tcuva23@gmail.com</a>.
    </p>

    <p style="font-size: 18px; margin-bottom: 24px;">Welcome aboard, and thank you for joining us!</p>

    <p style="font-size: 18px; margin-bottom: 24px;">Warm regards,</p>

    <p style="font-size: 18px; font-weight: 600;">The TCUbot Team</p>

    <div style="margin-top: 24px; text-align: center; font-size: 14px; color: #a0aec0;">
      <p>
        If you did not initiate this registration, please disregard this email.
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
        const registrant = await registrants.findOne({ _id: new mongodb_1.ObjectId(`${id}`) }, {
            projection: {
                _id: 0,
            },
        });
        if (!registrant) {
            resp.status(404).json({ message: "Registrant not found." });
            return;
        }
        await users.insertOne(registrant);
        await registrants.deleteOne({ _id: new mongodb_1.ObjectId(`${id}`) });
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}. Registrant successfully added as a user of TCUbot.`);
        resp.status(201).json({
            message: "Registrant approved and approval email sent successfully.",
        });
    }
    catch (err) {
        console.error("Failed to send email or registrant was not added as a user of TCUbot:", err);
        if (err.errorResponse.code === 11000) {
            resp.status(409).json({
                message: "The registrant's email or school number has already been used.",
            });
            return;
        }
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.send_email_accept = send_email_accept;
const allUsers = async (req, resp) => {
    try {
        const allUsers = await users
            .find({}, {
            projection: {
                hashedPassword: 0,
            },
        })
            .toArray();
        resp.status(200).json({ users: allUsers });
    }
    catch (err) {
        resp
            .status(500)
            .json({ message: "Something went wrong. Please try again later." });
    }
};
exports.allUsers = allUsers;
