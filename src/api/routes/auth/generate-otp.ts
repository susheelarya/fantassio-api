import express, { Request, Response } from 'express';
import axios from 'axios';

import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema';
import { eq,sql } from 'drizzle-orm';
import { totp } from 'otplib';

import { body } from 'express-validator';

// import jwt from 'jsonwebtoken';

import { validateRequest } from '../../../middlewares/validateRequest';
import { BadRequestError } from '../../../errors/bad-request-error';

const router = express.Router();
console.log('generate-otp1');

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
console.log(token)
    // Connect to DB
    const db = await dbConnect();

    console.log('generate-otp3');

    var countryCode = req.body.countryCode;
    var mobileNumber = req.body.mobileNumber;

    // var otp = randomNumber(1001, 9999);

    const otp = token;

    console.log(countryCode);
    console.log(mobileNumber);

    console.log(typeof countryCode);
    console.log(typeof mobileNumber);

    // if (isNaN(mobileNumber) == true) {
    //   throw new BadRequestError('Mobile Number not valid.');
    // }

    var otpMessage = otp + ' is your Fantassio One Time Password (OTP).'
    

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
      .select({
        userId: userMaster.userId
      })
      .from(userMaster)
      .where(eq(userMaster.userMobile, mobileNumber));

    // User exists
    if (finduser.length === 0) {
     // const user = await db.insert(numberTo, otp.toString());
     // let g:any = 0
      // const user = await db.insert(userMaster).values({userOtp:otp });

      const arya = await db.insert(userMaster).values({userMobile:mobileNumber, userCountryCode: countryCode, userOtp: otp })
      .returning({ insertedId: userMaster.userId });

      const statement = sql`insert into userMaster(user_mobile,user_country_code,user_otp) values (${mobileNumber},${countryCode},${otp});`

      //const arya=await db.execute(statement);

      const requesturl =
        'https://api.clickatell.com/http/sendmsg?user=babblers&password=Pr3sident11&api_id=3620030&to=' +
        numberTo +
        '&text=' +
        otpMessage;
      console.log(requesturl);

      // await axios.get(requesturl);

      res.status(200).json({
        response: 'Success',
        userId: arya[0].insertedId,
        userOtp: otp, 
      });
    }
console.log(finduser.length)

    if (finduser.length > 0) {
      await db
        .update(userMaster)
        .set({ userOtp: otp.toString() })
        .where(eq(userMaster.userId, finduser[0].userId))
        ;

      const requesturl =
        'https://api.clickatell.com/http/sendmsg?user=babblers&password=Pr3sident11&api_id=3620030&to=' +
        numberTo +
        '&text=' +
        otpMessage;
      console.log(requesturl.slice(-1));
      await axios.get(requesturl);

      res.status(200).json({
        response: 'Success',
        userId: finduser[0].userId,
        otp: otp,
      });
    }
  }
);

export { router as generateOTPRouter };
