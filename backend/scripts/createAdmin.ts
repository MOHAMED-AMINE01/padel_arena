import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@padelarena.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists. Updating role to ADMIN...');
            existingAdmin.role = 'ADMIN';
            await existingAdmin.save();
            console.log('Admin updated successfully!');
        } else {
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: 'Admin123!',
                role: 'ADMIN',
                phone: '0600000000',
                address: 'Padel Arena HQ'
            });
            console.log('Admin user created successfully!');
        }

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
