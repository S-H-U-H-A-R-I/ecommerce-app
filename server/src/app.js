import express from "express";
import session from "express-session";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import cors from "cors";

import { AppError, errorHandler } from "../middleware/errorHandler.js";
import UserRoute from "../routes/users.js";

const app = express();

const redisClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error", error);
    throw new AppError("Redis Client Error", 500);
});

redisClient.connect().catch((err) => {
    console.error("Redis Client Connection Error", err);
    throw new AppError("Redis Client Connection Error", 500);
});

const redisStore = new RedisStore({ client: redisClient, prefix: "buytheset:" });

app.use(cors());
app.use(express.json());
app.use(session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
}));

app.use("/api/users", UserRoute);
app.use(errorHandler);

export default app;