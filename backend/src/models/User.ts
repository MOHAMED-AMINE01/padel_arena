import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    password?: string;
    role: 'PLAYER' | 'ADMIN';
    phone?: string;
    address?: string;
    avatar?: string;
    subscription?: mongoose.Types.ObjectId;
    subscriptionExpiresAt?: Date;
    isActive: boolean;
    googleId?: string;
    authProvider: 'local' | 'google';
    preferences?: {
        sports?: string[];
    };
    notifications?: {
        match?: boolean;
        news?: boolean;
        promo?: boolean;
    };
    balance: number;
    stats?: {
        points?: number;
        level?: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE' | 'EXPERT' | 'ELITE';
        matchesPlayed?: number;
        wins?: number;
        losses?: number;
        streak?: number;
        bestRank?: number;
        tournamentsPlayed?: number;
        tournamentsWon?: number;
    };
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: function (this: IUser) { return this.authProvider === 'local'; }, select: false },
    role: { type: String, enum: ['PLAYER', 'ADMIN'], default: 'PLAYER' },
    phone: { type: String },
    address: { type: String },
    avatar: { type: String },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    subscriptionExpiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    preferences: {
        sports: { type: [String], default: ['Padel'] }
    },
    notifications: {
        match: { type: Boolean, default: true },
        news: { type: Boolean, default: false },
        promo: { type: Boolean, default: true }
    },
    balance: { type: Number, default: 0 },
    stats: {
        points: { type: Number, default: 0 },
        level: { type: String, enum: ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT', 'ELITE'], default: 'DEBUTANT' },
        matchesPlayed: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        streak: { type: Number, default: 0 },
        bestRank: { type: Number, default: 999 },
        tournamentsPlayed: { type: Number, default: 0 },
        tournamentsWon: { type: Number, default: 0 }
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
