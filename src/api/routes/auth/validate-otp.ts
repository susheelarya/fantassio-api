//compare otp , isValidate = Y
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';

import { eq } from 'drizzle-orm';
import { totp } from 'otplib';

import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema/user';
import { validateRequest } from '../../../middlewares/validateRequest';
import { BadRequestError } from '../../../errors/bad-request-error';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';

const router = express.Router();

// check if dbOTP is undefined, check userID number, check userOTP number.
router.post(
  '/validate-otp',
  // currentUser,
  // requireAuth,
  [
    body('otp').notEmpty().withMessage('Please provide a valid otp'),
    body('userID').notEmpty().withMessage('Please provide a valid userID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const db = await dbConnect();

    var userOTP = req.body.otp;
    var userID = req.body.userID;

    // let { id } = req.currentUser!;
    // var userID = id;
    console.log(userID);

    // return toCamelCase(rows)[0];
    const isValid = totp.verify({
      token: String(userOTP),
      secret: process.env.OTP_SECRET!,
    });

    if (!isValid) {
      throw new BadRequestError('OTP has expired, try again later');
    }

    const users = await db
      .select({ otp: userMaster.otp })
      .from(userMaster)
      .where(eq(userMaster.userid, Number(userID)));

    const dbOTP = users[0];

    if (!dbOTP) {
      throw new BadRequestError('otp not found for this user.');
    }

    if (userOTP === dbOTP.otp) {
      await db
        .update(userMaster)
        .set({
          otp: 'Verified',
          isvalidated: true,
        })
        .where(eq(userMaster.userid, Number(userID)));

      const userJwt = jwt.sign(
        {
          id: userID,
        },
        process.env.JWT_KEY!
      );

      // Store JWT on session object
      req.session = {
        jwt: userJwt,
      };

      res.status(200).json({ response: 'OTP matched' });
    } else {
      throw new BadRequestError("OTP doesn't match");
    }
  }
);

export { router as validateOTPRouter };
