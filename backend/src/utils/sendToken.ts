import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
    };

    user.password = undefined; // Ensure password isn't sent in response

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            token,
            data: user
        });
};
