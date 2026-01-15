const nodemailer = require("nodemailer");

exports.sendOtpMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    await transporter.sendMail({
        to: email,
        subject: "Your OTP",
        text: `Your OTP is ${otp}`
    });
};
