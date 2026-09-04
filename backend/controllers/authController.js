const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { generateOtp } = require('../utils/otp');
const asyncHandler = require('../utils/asyncHandler');

const OTP_VALID_MS = 10 * 60 * 1000;

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: admin._id, email: admin.email });

    res.status(200).json({
        message: 'Login successful',
        data: { _id: admin._id, email: admin.email },
        Token: token,
    });
});

exports.sendCode = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
        return res.status(404).json({ message: 'No admin account found with this email' });
    }

    const otp = generateOtp();
    admin.resetCode = await bcrypt.hash(otp, 10);
    admin.resetCodeExpiry = new Date(Date.now() + OTP_VALID_MS);
    await admin.save();

    await sendEmail({
        to: admin.email,
        subject: 'Aarambh Adornments - Password Reset OTP',
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
});

exports.verifyCode = asyncHandler(async (req, res) => {
    const { email, resetCode } = req.body;
    if (!email || !resetCode) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !admin.resetCode || !admin.resetCodeExpiry) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    if (admin.resetCodeExpiry.getTime() < Date.now()) {
        return res.status(400).json({ message: 'OTP has expired' });
    }

    const isValid = await bcrypt.compare(resetCode, admin.resetCode);
    if (!isValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    const hasValidOtpWindow = admin && admin.resetCode && admin.resetCodeExpiry && admin.resetCodeExpiry.getTime() >= Date.now();
    if (!hasValidOtpWindow) {
        return res.status(400).json({ message: 'OTP verification required before resetting password' });
    }

    admin.password = newPassword;
    admin.resetCode = undefined;
    admin.resetCodeExpiry = undefined;
    await admin.save();

    res.status(200).json({ message: 'Password reset successful' });
});
