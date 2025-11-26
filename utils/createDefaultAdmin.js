const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
    try {
        const adminEmail = process.env.EMAIL;
        const adminPassword = process.env.PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.warn('Admin credentials not found in .env, skipping admin creation.');
            return;
        }

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists. Skipping.');
            return;
        }
        console.log('Creating default admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            username: 'SuperAdmin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Default admin created successfully!');
    } catch (error) {
        console.error('Failed to create default admin:', error.message);
    }
};

module.exports = createDefaultAdmin;





