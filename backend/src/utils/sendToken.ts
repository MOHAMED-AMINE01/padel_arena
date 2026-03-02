import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const secret = process.env.JWT_SECRET || 'secret';
    const expiresIn = (process.env.JWT_EXPIRES_IN as any) || '1d';

    const token = jwt.sign({ id: user._id }, secret, {
        expiresIn
    });

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: true, // Force true to satisfy Vercel/Chrome SameSite:None requirement
        sameSite: 'none' as const
    };

    user.password = undefined; // Ensure password isn't sent in response

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            token, // Returning token for Frontend localStorage sync
            data: user
        });
};
