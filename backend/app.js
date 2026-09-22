import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/error.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';

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
app.use(notFound);
app.use(errorHandler);