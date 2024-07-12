import https from 'https';
import fs from 'fs';

import app from './src/app.js';
import { checkEnvVars, PORT } from './config/env.js';
import connectDB from './config/db.js';

const startserver = async () => {
    try {
        checkEnvVars();
        await connectDB();

        if (process.env.NODE_ENV === 'production') {
            app.use((req, res, next) => {
                if (req.headers['x-forwarded-proto'] !== 'https') return res.redirect(`https://${req.headers.host}${req.url}`);
                return next();
            });
            const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
            const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8');
            const ca = fs.readFileSync(process.env.SSL_CA, 'utf8');
            const credentials = { key: privateKey, cert: certificate, ca };
            const httpsServer = https.createServer(credentials, app);
            httpsServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        } else {
            app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        }
    } catch (error) {
        console.error("Server Error:", error);
        process.exit(1);
    }
};

startserver();