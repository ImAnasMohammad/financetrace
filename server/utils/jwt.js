const jwt = require("jsonwebtoken");

exports.createTempToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" });

exports.createAccessToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.verifyToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);
