import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not defined!');
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }
    
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

    const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: expiresIn as any
    });

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        path: '/'
    };

    user.password = undefined;

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            token,
            data: user
        });
};
