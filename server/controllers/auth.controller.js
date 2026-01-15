const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const {
    createTempToken,
    verifyToken,
    createAccessToken
} = require("../utils/jwt");
const { sendOtpMail } = require("../utils/mail");
const { sendResponse } = require("../utils/response");

/**
 * JOIN / REGISTER
 */
exports.join = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return sendResponse(res, 400, false, "Email and password are required");

        let user = await User.findOne({ email });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return sendResponse(res, 401, false, "Invalid credentials");

            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({ email, password: hashedPassword, otp, otpExpiry, isVerified: false });
        }

        await sendOtpMail(email, otp);

        const tempToken = createTempToken({ userId: user._id });

        return sendResponse(res, 200, true, "OTP sent to email", { tempToken });

    } catch (err) {
        console.error("Join Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};


/**
 * VERIFY OTP
 */
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return sendResponse(res, 400, false, "OTP is required");
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendResponse(res, 401, false, "Authorization token required");
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            return sendResponse(res, 401, false, "Token expired or invalid");
        }

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // OTP checks
        if (!user.otp) {
            return sendResponse(res, 400, false, "OTP already used or not generated");
        }

        if (user.otp != otp) {
            return sendResponse(res, 400, false, "Incorrect OTP");
        }

        if (user.otpExpiry < Date.now()) {
            return sendResponse(res, 410, false, "OTP expired");
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();


        const accessToken = createAccessToken({
            userId: user._id,
            email: user.email
        });

        return sendResponse(res, 200, true, "OTP verified successfully", { accessToken });

    } catch (err) {
        console.error("Verify OTP Error:", err);
        return sendResponse(res, 500, false, "Internal server error");
    }
};
