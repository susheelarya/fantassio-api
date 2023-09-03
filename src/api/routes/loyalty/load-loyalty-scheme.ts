import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { BadRequestError } from '../../../errors/bad-request-error';
import {
  userMaster,
  loyaltySchemeType,
  loyaltySchemeShopMapping,
  loyaltySchemeMaster,
  loyaltyInformation,
} from '../../../db/schema';
import { and, eq, exists, isNull, sql } from 'drizzle-orm';
// import { body } from 'express-validator';
// import pg from 'pg';
// import { time } from 'console';

const router = express.Router();

router.get(
  '/load-loyalty-scheme',
  currentUser,
  requireAuth,
  validateRequest,
  [],
  async (req: Request, res: Response) => {
    const { id } = req.currentUser!;
    let userID = id;

    const db = await dbConnect();

    const userTypeCheck = await db
      .select({ userTypeField: userMaster.usertype })
      .from(userMaster)
      .where(eq(userMaster.userid, Number(userID)));

    const userType = userTypeCheck[0];

    if (typeof userType == 'undefined' || userType.userTypeField == null) {
      throw new BadRequestError('User Type for this user not found.');
    }

    let loadLoyaltyForUser = await db
      .select({
        loyaltyschemeid: loyaltySchemeMaster.loyaltyschemeid,
        loyaltyschemetypeid: loyaltySchemeMaster.loyaltyschemetypeid,
        moneyforpoints: loyaltySchemeMaster.moneyforpoints,
        pointsfrommoney: loyaltySchemeMaster.pointsfrommoney,
        pointstoredeem: loyaltySchemeMaster.pointstoredeem,
        redeemfrequency: loyaltySchemeShopMapping.redeemfrequency,
        predefined: loyaltySchemeMaster.predefined,
        stampstocollect: loyaltySchemeMaster.stampstocollect,
        freeitems: loyaltySchemeMaster.freeitems,
        expiremonths: loyaltySchemeShopMapping.expiremonths,
        validfromdate: loyaltySchemeShopMapping.validfromdate,
        validtodate: loyaltySchemeShopMapping.validtodate,
        loyaltyschemename: loyaltySchemeMaster.loyaltyschemename,
        mapid: loyaltySchemeShopMapping.mapid,
        expireflag: loyaltySchemeShopMapping.expireflag,
      })
      .from(loyaltySchemeMaster)
      .innerJoin(
        loyaltySchemeShopMapping,
        and(
          eq(loyaltySchemeShopMapping.useridshop, Number(userID)),
          eq(
            loyaltySchemeShopMapping.loyaltyschemeid,
            loyaltySchemeMaster.loyaltyschemeid
          )
        )
      );
    console.log(loadLoyaltyForUser)
    if (loadLoyaltyForUser.length == 0) {
      return res.status(200).json({
        message:
          "You don't have any loyalty schemes. Press the plus icon to create one",
        data: loadLoyaltyForUser,
      });
    }
    console.log(loadLoyaltyForUser);
    const nowObj = new Date();
    var today = new Date(nowObj.getTime());
    today.setDate(nowObj.getDate());
    today = new Date(today.setUTCHours(0.0, 0, 0, 0));
    console.log(nowObj);
    console.log(today);
    let todayDate = today.toISOString().split('T')[0];

    let loadObj: any = loadLoyaltyForUser;
    let loadArr = [];
    for (let i = 0; i < loadLoyaltyForUser.length; i++) {
      console.log(loadLoyaltyForUser[i].validfromdate);
      if (loadLoyaltyForUser[i].validtodate! < todayDate) {
        var timeStatus = 'past';
      } else {
        if (loadLoyaltyForUser[i].validfromdate! > todayDate) {
          var timeStatus = 'future';
        } else {
          var timeStatus = 'present';
        }
      }
      console.log(timeStatus);
      loadObj[i].timestatus = timeStatus;
    }

    return res.status(200).json({ data: loadLoyaltyForUser, message: '' });
  }
);

export { router as loadLoyaltyRouter };
