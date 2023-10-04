//compare otp , isValidate = Y
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';

import { eq,sql } from 'drizzle-orm';
import { totp } from 'otplib';

import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema';
import { validateRequest } from '../../../middlewares/validateRequest';
import { BadRequestError } from '../../../errors/bad-request-error';

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
    console.log(String(userOTP));
    console.log(process.env.OTP_SECRET);
    console.log(process.env.JWT_KEY);
    // want to say that if the userid already exists then we change the screen.

    if (!isValid) {
      throw new BadRequestError('OTP has expired, try again later');
    }

    const users = await db
      .select({ otp: userMaster.userOtp })
      .from(userMaster)
      .where(eq(userMaster.userId, Number(userID)));

    const dbOTP = users[0];

    if (!dbOTP) {
      throw new BadRequestError('otp not found for this user.');
    }

    if (userOTP === dbOTP.otp) {
      const statement = sql`update userMaster set user_otp = ${'Verified'}, is_user_validated=${true} where user_id =${userID}`
      const user=await db.execute(statement);

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

      const userObject = await db
        .select()
        .from(userMaster)
        .where(eq(userMaster.userId, Number(userID)));

      res.status(200).json({
        response: 'OTP matched',
        token: userJwt,
        user: userObject[0],
      });
    } else {
      throw new BadRequestError("OTP doesn't match");
    }
  }
);

export { router as validateOTPRouter };
