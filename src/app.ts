import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieSession from 'cookie-session';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const cookieConfigDev: CookieSessionInterfaces.CookieSessionOptions = {
  name: 'session',
  signed: false, // Disable encryption
  // NOTE: Only sends cookie when someone is connecting from a secure server
  secure: false,
  httpOnly: false,
};

const cookieConfigProd: CookieSessionInterfaces.CookieSessionOptions = {
  name: 'session',
  signed: false, // Disable encryption
  // NOTE: Only sends cookie when someone is connecting from a secure server
  secure: process.env.NODE_ENV !== 'test',
  domain: process.env.DOMAIN,
};

// app.use(
//   cookieSession(
//     process.env.NODE_ENV === 'development' ? cookieConfigDev : cookieConfigProd
//   )
// );

app.use(cookieSession(cookieConfigDev));

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

// ERROR HANDLER
app.use(errorHandler);

app.all('*', () => {
  throw new NotFoundError();
});

export default app;
