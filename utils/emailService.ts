import nodemailer from 'nodemailer';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const link = `${config.smtp.baseUrl}/api/verify-email?token=${token}`;
    console.log('[DEV] Verification Link:', link);

    try {

        await transporter.sendMail({
            from: config.smtp.from,
            to,
            subject: 'Verify your email',
            html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
        });

        // 👇 Зміна 2: Явно повертаємо true
        return true;
    } catch (error) {
        console.error('Email send failed:', error);
        // 👇 Зміна 3: Явно повертаємо false (або null)
        return null;
    }
};