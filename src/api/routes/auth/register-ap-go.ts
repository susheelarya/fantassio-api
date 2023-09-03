import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';

import { validateRequest } from '../../../middlewares/validateRequest';
import { BadRequestError } from '../../../errors/bad-request-error';

import { body } from 'express-validator';

console.log('register-ap-go');

const router = express.Router();

// const insertNewUser = require('../user/new-user');

router.post(
  '/register-ap-go',
  [
    body('authtkn').notEmpty().withMessage('Please provide a valid auth token'),
    body('authTknSecret')
      .notEmpty()
      .withMessage('Please provide a valid auth token secret'),
    body('authTknUserID')
      .notEmpty()
      .withMessage('Please provide a valid auth userid'),
    body('authTknName')
      .notEmpty()
      .withMessage('Please provide a valid auth token name'),
    body('authTknFamilyName')
      .notEmpty()
      .withMessage('Please provide a valid auth token family name'),
    body('mobileDevice')
      .notEmpty()
      .withMessage('Please provide a valid mobile device'),
    body('pushNotificationToken')
      .notEmpty()
      .withMessage('Please provide a valid push notification token'),
    body('loggedInWith')
      .notEmpty()
      .withMessage('Please provide a valid logged in with status'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // const userID = req.body.userID;

    var authtkn = req.body.authtkn;
    var authTknSecret = req.body.authTknSecret;
    var authTknUserID = req.body.authTknUserID;
    var authTknName = req.body.authTknName;
    var authTknFamilyName = req.body.authTknFamilyName;
    var mobileDevice = req.body.mobileDevice;
    var pushNotificationToken = req.body.pushNotificationToken;
    var loggedInWith = req.body.loggedInWith;

    //remove plus from countryCode
    //let firstChar = authTknName.charAt(0);
    //if (firstChar == "+") {
    //  countryCode = countryCode.substring(1);
    //}

    var authTknUserName = authTknName + ' ' + authTknFamilyName;
    console.log(authTknUserName);

    const db = await dbConnect();

    //  var finduser : number;
    console.log('register-ap-go');
    if (loggedInWith == 'G') {
      console.log('Inside Google');
      if (authTknUserID.indexOf('@') < 0) {
        authTknUserID = authTknUserID + '@gmail.com';
      }
      const findUser = await db
        .select({ userid: sql<number>`max(${userMaster.userid})` })
        .from(userMaster)
        .where(eq(userMaster.googleAuthTknUserID, authTknUserID));
      // SELECT max(userid) userid FROM user_master WHERE "googleAuthTknUserID" = $1

      if (findUser[0].userid == null) {
        const user = await db.insert(userMaster).values({
          googleAuthTkn: authtkn,
          googleAuthTknSecret: authTknSecret,
          googleAuthTknUserID: authTknUserID,
          googleAuthTknUserName: authTknUserName,
          loggedInWith: loggedInWith,
          mobileDevice: mobileDevice,
          pushNotificationToken: pushNotificationToken,
          isenabled: true,
          isvalidated: false,
        });
        res
          .status(200)
          .json({ response: 'Success', userID: findUser[0].userid });
      }
      if (findUser[0].userid != null) {
        /* const user = await UserRepo.updateGoogleID( authtkn, authTknSecret, authTknUserID, authTknUserID, authTknUserName, loggedInWith, mobileDevice,pushNotificationToken);
         */
        res
          .status(200)
          .json({ response: 'Success', userID: findUser[0].userid });
      }
    }
    if (loggedInWith == 'A') {
      console.log('Inside Apple');
      const findUser = await db
        .select({ userid: sql<number>`max(${userMaster.userid})` })
        .from(userMaster)
        .where(eq(userMaster.appleauthtkn, authtkn));
      console.log('userid ' + findUser[0].userid);
      if (findUser[0].userid == null) {
        const user = await db.insert(userMaster).values({
          appleauthtkn: authtkn,
          appleAuthTknSecret: authTknSecret,
          appleAuthTknUserID: authTknUserID,
          appleAuthTknUserName: authTknUserName,
          loggedInWith: loggedInWith,
          mobileDevice: mobileDevice,
          pushNotificationToken: pushNotificationToken,
          isenabled: true,
          isvalidated: false,
        });

        res
          .status(200)
          .json({ response: 'Success', userID: findUser[0].userid });
      }
      if (findUser[0].userid != null) {
        /*       const user = await UserRepo.updateAppleID( authtkn, authTknSecret, authTknUserID, authTknUserID, authTknUserName, loggedInWith, mobileDevice,pushNotificationToken);
         */
        res
          .status(200)
          .json({ response: 'Success', userID: findUser[0].userid });
      }
    }
  }
);
/*
    if (finduser.userid == null)   {  
        console.log("INSERT "+finduser.userid); 
    const user = await UserRepo.insert(numberTo, otp.toString());
    res.status(202).json({"response" : "Success", "userID" : user.userid});

    }
    if (finduser.userid != null)   { 
        console.log("UPDATE " + finduser.userid);
        const user = await UserRepo.updateReturnUser(finduser.userid.toString(), otp.toString());
        res.status(202).json({"response" : "Success", "userID" : finduser.userid});

        }



    const axios = require('axios');

    // axios.get(requesturl, { json: true }, (err: any, res: any, body: any) => {
    // if (err) { return console.log(err); }
    });
    //res.status(202).json({"response" : "Success", "userID" : user.userid});

*/
export { router as registerapgoRouter };
