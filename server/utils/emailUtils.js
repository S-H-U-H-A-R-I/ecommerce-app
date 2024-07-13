import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

import { AppError } from '../middleware/errorMiddleware.js';
import emailConfig from '../config/email.js';

const transporter = nodemailer.createTransport(emailConfig);

const loadEmailTemplate = (templateName) => {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf-8');
};

const validateEnvironmentVariables = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new AppError('Email credentials not found', 500);
    }
};

export const sendEmail = async (to, subject, templateName, context) => {
    validateEnvironmentVariables();
    const htmlContent = loadEmailTemplate(templateName);
    const renderedContent = Object.entries(context).reduce((content, [key, value]) => {
        return content.replace(new RegExp(`{{${key}}}`, 'g'). value);
    }, htmlContent);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: renderedContent
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        throw new AppError(`Failed to send email: ${err.message}`, 500);
    }
};