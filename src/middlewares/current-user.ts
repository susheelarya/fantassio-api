import { Request, Response, NextFunction } from 'express';
import { Buffer } from 'safe-buffer';

import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
}

// This also works
interface RequestObj extends Request {
  currentUser?: UserPayload;
}

// Inside the express project (namespace), find the request interface and add in this additional property
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.session?.jwt &&
    !req.headers.authorization &&
    !req.headers.authorization?.startsWith('Bearer')
  ) {
    return next();
  }

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const jwtParsed = Buffer.from(
        req.headers.authorization.split(' ')[1],
        'base64'
      ).toString('utf8');
      token = JSON.parse(jwtParsed).jwt;
    } catch (error) {
      token = req.headers.authorization.split(' ')[1];
    }
  } else if (req.session?.jwt) {
    token = req.session.jwt;
  } else {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;

    req.currentUser = payload;
  } catch (error) {}

  next();
};
