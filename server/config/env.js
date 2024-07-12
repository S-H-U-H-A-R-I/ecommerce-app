import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'REDIS_HOST',
    'REDIS_PORT',
    'SESSION_SECRET',
    'MONGODB_URI',
    'PORT'
];

export const checkEnvVars = () => {
    const missingVars = requiredEnvVars.filter((varName) =>!process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};

export const PORT = process.env.PORT || 3000;