import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

interface JwtPayload {
    id: string;
}

export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Check cookies first
    if (req.cookies?.token) {
        token = req.cookies.token;
    }
    
    // 2. Check Authorization header (case-insensitive for Vercel/Serverless compatibility)
    if (!token) {
        const authHeader = req.headers.authorization || req.headers['Authorization'];
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }

    // 3. No token found anywhere
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required. Please log in.' 
        });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment variables!');
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }
        
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User associated with this token no longer exists' });
        }
        
        req.user = user;
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid authentication token' });
    }
});

export const authorize = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
