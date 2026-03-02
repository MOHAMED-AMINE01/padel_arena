import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendTokenResponse } from '../utils/sendToken';
import sendEmail, { getPasswordResetEmail } from '../utils/sendEmail';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phone, address } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create user (password is hashed in pre-save hook)
    const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
        role: 'PLAYER' // Default role
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await (user as any).matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear cookie with the SAME options used when setting it (required for cross-domain)
    res.cookie('token', '', {
        expires: new Date(0), // Expire immediately
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
});
// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = asyncHandler(async (req: any, res: Response) => {
    const { name, email, phone, address, preferences, notifications } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (preferences !== undefined) (user as any).preferences = preferences;
    if (notifications !== undefined) (user as any).notifications = notifications;

    await user.save();

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req: any, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both current and new password' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password matches
    const isMatch = await (user as any).matchPassword(oldPassword);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
});

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Google token is required' });
    }

    try {
        // Fetch user info from Google using the access token
        const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const payload = googleResponse.data;

        if (!payload || !payload.sub) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { sub: googleId, email, name, picture: avatar } = payload;

        if (!email) {
            return res.status(400).json({ message: 'Email not provided by Google' });
        }

        // Find user by googleId or email
        let user = await User.findOne({
            $or: [{ googleId }, { email: email.toLowerCase() }]
        });

        if (user) {
            // Update user with googleId if they don't have it
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                if (!user.avatar && avatar) user.avatar = avatar;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name: name || 'Google User',
                email: email.toLowerCase(),
                googleId,
                avatar,
                authProvider: 'google',
                role: 'PLAYER',
                isActive: true
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'Aucun compte associé à cet email' });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google') {
        return res.status(400).json({ 
            message: 'Ce compte utilise Google pour se connecter. Utilisez "Continuer avec Google".' 
        });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire - 1 hour
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Padel Arena - Réinitialisation du mot de passe',
            html: getPasswordResetEmail(resetUrl, user.name)
        });

        res.status(200).json({ 
            success: true, 
            message: 'Email envoyé avec succès' 
        });
    } catch (error) {
        console.error('Email send error:', error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
    }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Hash the token from URL
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ 
        success: true, 
        message: 'Mot de passe réinitialisé avec succès' 
    });
});
