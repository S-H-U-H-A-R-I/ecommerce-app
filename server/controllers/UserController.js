import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorMiddleware.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/emailUtils.js";

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
        const expirationTime = new Date(Date.now() + OPT_EXPIRATION_MS);
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

export const requestOTP = async (req, res, next) => {
    const { email } = req.body;
    if (!isValidEmail(email)) return next(new AppError('Invalid email format', 400));
    const otp = generateOTP();
    try {
        await sendOTP(req, email, otp);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        next(new AppError('Error sending OTP', 500));
    }
};

export const verifyOTP = async (req, res, next) => {
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
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-__v');
        res.status(200).json(users);
    } catch (err) {
        next(new AppError('Error fetching users', 500));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id, '-__v');
        if (!user) return next(new AppError('User not found', 404));
        res.status(200).json(user);
    } catch (err) {
        next(new AppError('Error fetching user', 500));
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { name, surname, email, phone, address, role, accountStatus } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, surname, email, phone, address, role, accountStatus },
            { new: true, runValidators: true }
        );
        if (!updatedUser) return next(new AppError('User not found', 404));
        res.status(200).json(updatedUser);
    } catch (err) {
        next(new AppError('Error updating user', 500));
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return next(new AppError('User not found', 404));
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        next(new AppError('Error deleting user', 500));
    }
};
