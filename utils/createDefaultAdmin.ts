import { config } from '../config/env';

import User from "../models/user";
import bcrypt from 'bcryptjs';

const createDefaultAdmin = async (): Promise<void> => {
    try {
        const adminEmail = config.admin.email;
        const adminPassword = config.admin.password;

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists. Skipping.');
            return;
        }
        console.log('Creating default admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            username: 'SuperAdmin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
        });

        console.log('Default admin created successfully!');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to create default admin:', error.message);
        }
        console.error(error);
    }
};

export default createDefaultAdmin;