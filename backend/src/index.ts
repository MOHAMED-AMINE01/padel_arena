import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
const mongoSanitize = require('mongo-sanitize');

import authRoutes from './routes/authRoutes';
import courtRoutes from './routes/courtRoutes';
import bookingRoutes from './routes/bookingRoutes';
import adminRoutes from './routes/adminRoutes';
import tournamentRoutes from './routes/tournamentRoutes';
import courseRoutes from './routes/courseRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import statsRoutes from './routes/statsRoutes';
import promoCodeRoutes from './routes/promoCodeRoutes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// CORS headers set manually FIRST for maximum compatibility
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://padelarena-topaz.vercel.app'
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Helmet disabled temporarily to debug CORS issues
// app.use(helmet());

// Cookie parser and JSON body
app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); 
app.use(morgan('dev')); 

// Debug endpoint to verify environment and headers (remove in final production)
app.get('/api/debug/health', (req, res) => {
    res.json({
        status: 'ok',
        env: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        allowedOrigins: process.env.ALLOWED_ORIGINS,
        receivedOrigin: req.headers.origin,
        hasAuthHeader: !!req.headers.authorization
    });
});

// Data Sanitization against NoSQL query injection
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = mongoSanitize(req.body);
    if (req.query) req.query = mongoSanitize(req.query);
    if (req.params) req.params = mongoSanitize(req.params);
    next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/promo-codes', promoCodeRoutes);

// Root Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Padel Arena API is running...' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/padel-arena';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error('❌ MongoDB connection error:', error);
    });
