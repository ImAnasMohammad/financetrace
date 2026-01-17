const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendOtpMail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "FinanceTrace <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP",
      html: `<p>Your OTP is <b>${otp}</b></p>`
    });
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};
