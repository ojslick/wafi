import express from 'express';
import 'express-async-errors';
import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { NotFoundError } from './src/errors';
import { errorHandler, currentUser } from './src/middlewares';
import { authRoutes } from './src/routes/auth-routes';

require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use('/api/users', authRoutes);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
