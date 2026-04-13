import jwt from "jsonwebtoken";

export function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "7d" }
    );
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}