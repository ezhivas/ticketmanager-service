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
    const link = `http://localhost:${config.port}/api/verify-email?token=${token}`;

    try {
        const info = await transporter.sendMail({
            from: '"Ticket App" <noreply@ticketapp.com>',
            to,
            subject: 'Verify your email',
            html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
        });
        return info;
    } catch (error) {
        console.error('Email send failed:', error);
        return null;
    }
};