import express from "express";
import jwt from "jsonwebtoken";

import { AppError } from "../middleware/errorHandler.js"
import User from "../models/User.js";
import { sendEmail } from "../utils/emailService.js";

const router = express.Router();

const OPT_EXPIRATION_MINUTES = 5;
const OPT_EXPIRATION_MS = OPT_EXPIRATION_MINUTES * 60 * 1000;
const OTP_LENGTH = 6;
const OTP_EMAIL_SUBJECT = 'OTP for BuyTheSet';
const OTP_EMAIL_TEMPLATE = 'otpTemplate';
const JWT_EXPIRATION_DAYS = 30;

const generateOTP = () => Math.floor(10 ** (OTP_LENGTH - 1) + Math.random() * 9 * 10 ** (OTP_LENGTH - 1)).toString();

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role,
            accountStatus: user.accountStatus,
        },
        process.env.JWT_SECRET,
        { expiresIn: `${JWT_EXPIRATION_DAYS}d` }
    );
};

const sendOTP = async (req, email, otp) => {
    try {
        const expirationTime = new Date(Date.now() + OPT_EXPIRATION_MS); // 5 minutes
        req.session.otp = { email, otp, expiresAt: expirationTime };
        return sendEmail(email, OTP_EMAIL_SUBJECT, OTP_EMAIL_TEMPLATE, { otp });
    } catch (err) {
        throw new AppError('Error sending OTP', 500);
    }
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidOTP = (otp) => new RegExp(`^\\d{${OTP_LENGTH}}$`).test(otp);

router.post('/request-otp', async (req, res) => {
    const { email } = req.body;
    if (!isValidEmail(email)) return next(new AppError('Invalid email format', 400));
    const otp = generateOTP();
    try {
        await sendOTP(req, email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        next(new AppError('Error sending OTP', 500));
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!isValidEmail(email)) return next(new AppError('Invalid email format', 400));
    if (!isValidOTP(otp)) return next(new AppError('Invalid OTP format', 400));
    const storedOTP = req.session.otp;
    if (storedOTP && storedOTP.email === email && storedOTP.otp === otp) {
        if (new Date() > new Date(storedOTP.expiresAt)) return next(new AppError('OTP expired', 401));
        try {
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({ email });
                await user.save();
            }
            const token = generateToken(user);
            res.status(200).json({ token, user });
        } catch (err) {
            next(new AppError('Error Authentication User', 500));
        }
    } else {
        next(new AppError('Invalid OTP', 401));
    }
});

export default router;