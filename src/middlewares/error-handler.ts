import { ValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      errors: err.serializeErrors(),
    });
  }

  console.error(err);
  res.status(500).json({
    status: 'error',
    errors: [{ message: 'Something went wrong', data: err.message }],
  });
};
