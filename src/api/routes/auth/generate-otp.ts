import express, { Request, Response } from 'express';
import axios from 'axios';

import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema/user';
import { eq } from 'drizzle-orm';
import { totp } from 'otplib';

import { body } from 'express-validator';

import jwt from 'jsonwebtoken';

import { validateRequest } from '../../../middlewares/validateRequest';
import { BadRequestError } from '../../../errors/bad-request-error';

const router = express.Router();

var removePlus = (code: string) => {
  let firstChar = code.charAt(0);
  if (firstChar == '+') {
    code = code.substring(1);
  }
  return code;
};

// generate otp, store new user with number, store otp.

// ERRORS : check data type. NOT CHECKING FOR VALID PHONE NUMBER. FRONT END CHECK FOR DIGITS!

router.post(
  '/generate-otp',
  [
    body('countryCode')
      .notEmpty()
      .withMessage('Please provide a valid country code'),
    body('mobileNumber')
      .notEmpty()
      .withMessage('Please provide a valid mobile number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Valid for 3 minutes
    totp.options = { digits: 4, step: 180 };

    const token = totp.generate(process.env.OTP_SECRET!);

    // Connect to DB
    const db = await dbConnect();

    console.log('generate-otp');
    var countryCode = req.body.countryCode;
    var mobileNumber = req.body.mobileNumber;

    // var otp = randomNumber(1001, 9999);
    const otp = token;

    console.log(typeof countryCode);
    console.log(typeof mobileNumber);

    // if (isNaN(mobileNumber) == true) {
    //   throw new BadRequestError('Mobile Number not valid.');
    // }

    var otpMessage = otp + ' is your Hichers One Time Password (OTP).';

    console.log(otpMessage);

    //remove plus from countryCode

    if (typeof countryCode == 'string') {
      countryCode = removePlus(countryCode);
    }

    if (isNaN(countryCode) == true) {
      throw new BadRequestError('Country Code not valid.');
    }

    // insert

    // return res.status(200).json({"response" : "Success"});

    var numberTo = countryCode + mobileNumber;
    console.log(numberTo);

    const finduser = await db
      .select()
      .from(userMaster)
      .where(eq(userMaster.mobilenumber, numberTo));

    console.log(finduser);
    // User exists
    if (finduser.length === 0) {
      // const user = await UserRepo.insert(numberTo, otp.toString());
      const user = await db
        .insert(userMaster)
        .values({
          mobilenumber: numberTo,
          otp: otp.toString(),
          isvalidated: false,
          loggedInWith: 'M',
        })
        .returning();

      const requesturl =
        'https://api.clickatell.com/http/sendmsg?user=babblers&password=Pr3sident11&api_id=3620030&to=' +
        numberTo +
        '&text=' +
        otpMessage;

      console.log(requesturl);

      await axios.get(requesturl);

      res.status(200).json({
        response: 'Success',
        user: user[0].userid,
        otp: otp,
      });
    }

    if (finduser.length > 0) {
      await db
        .update(userMaster)
        .set({ otp: otp.toString() })
        .where(eq(userMaster.userid, finduser[0].userid))
        .returning();

      const requesturl =
        'https://api.clickatell.com/http/sendmsg?user=babblers&password=Pr3sident11&api_id=3620030&to=' +
        numberTo +
        '&text=' +
        otpMessage;

      await axios.get(requesturl);

      res.status(200).json({
        response: 'Success',
        userID: finduser[0].userid,
        otp: otp,
      });
    }
  }
);

export { router as generateOTPRouter };
