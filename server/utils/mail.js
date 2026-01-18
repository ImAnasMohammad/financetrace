const nodemailer = require("nodemailer");

exports.sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: "FinanceTrace <yourgmail@gmail.com>",
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`
  });
};
