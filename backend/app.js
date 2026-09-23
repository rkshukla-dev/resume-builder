import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/error.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import resumeRouter from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.disable("x-powered-by");    // Hide unnecessary technology information from HTTP responses

// Middleware
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if(env.nodeEnv !== 'test') app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ success: true, status: "OK", timestamp: new Date().toISOString() }));
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, _path) => {
        res.set("Access-Control-Allow-Origin", env.clientUrl)
    }
}))
app.use(notFound);
app.use(errorHandler);