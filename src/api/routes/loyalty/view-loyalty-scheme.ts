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
import { body } from 'express-validator';
import pg from 'pg';

const router = express.Router();

router.get(
  '/view-loyalty-scheme',
  currentUser,
  requireAuth,
  validateRequest,
  [
    body('reportFlag')
      .isBoolean()
      .withMessage('Please provide a report flag that is a boolean.'),
    body('loyaltySchemeID')
      .isInt()
      .withMessage('Please send a valid loyalty scheme id that is an integer'),
    body('mapID')
      .isInt()
      .withMessage('Please send a valid map id that is an integer'),
    // body('userID').notEmpty().withMessage('Please provide a valid userID'),
  ],
  async (req: Request, res: Response) => {
    console.log('view-loyalty-scheme');

    let reportFlag = req.body.reportFlag;
    let loyaltySchemeID = req.body.loyaltySchemeID;
    let mapID = req.body.mapID;
    const { id } = req.currentUser!;
    let userID = id;
    console.log(userID);

    const db = await dbConnect();

    const userCheck = await db
      .select()
      .from(userMaster)
      .where(eq(userMaster.userid, Number(userID)));

    if (userCheck.length == 0) {
      throw new BadRequestError('UserID not found');
    }

    // check if they match

    let matching = await db
      .select({ loyaltyschemeid: loyaltySchemeShopMapping.loyaltyschemeid })
      .from(loyaltySchemeShopMapping)
      .where(eq(loyaltySchemeShopMapping.mapid, mapID));
    console.log(matching);
    if (
      matching.length == 0 ||
      matching[0].loyaltyschemeid == null ||
      matching[0].loyaltyschemeid != loyaltySchemeID
    ) {
      throw new BadRequestError('Loyalty Scheme ID and Map ID do not match');
    }

    if (reportFlag == true) {
      // let loadLoyaltyInformation = sql`select o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename,
      // o.expireflag, coalesce(max(i.pointscollected),0) as pointscollected, coalesce(max(i.numberofcustomers),0) as numberofcustomers, coalesce(max(i.pointsredeemed),0) as pointsredeemed, coalesce(max(i.pointstoberedeemed),0) as pointstoberedeemed, coalesce(max(i.stampstocollect),0) as stampstocollect,
      // coalesce(max(i.stampscollected),0) as stampscollected, coalesce(max(i.freeitemsgiven),0) as freeitemsgiven from ${loyaltySchemeMaster} o inner join ${loyaltyInformation} i
      // on i.loyaltyschemeid = ${loyaltySchemeID} and i.useridshop = ${userID}
      // inner join ${loyaltySchemeType} m on m.loyaltyschemetypeid = o.loyaltyschemetypeid where exists(select useridshop from loyalty_scheme_shop_mapping where useridshop=${userID}) group by o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename,
      // o.expireflag`;

      // ISOLATE LOYALTYID

      let loadLoyaltyInformation = sql`select o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, s.validfromdate, o.loyaltyschemename, 
        s.expireflag, coalesce(max(i.pointscollected),0) as pointscollected, coalesce(max(i.numberofcustomers),0) as numberofcustomers, coalesce(max(i.pointsredeemed),0) as pointsredeemed, coalesce(max(i.pointstoberedeemed),0) as pointstoberedeemed, coalesce(max(i.stampstocollect),0) as stampstocollect, 
        coalesce(max(i.stampscollected),0) as stampscollected, coalesce(max(i.freeitemsgiven),0) as freeitemsgiven from ${loyaltySchemeMaster} o inner join ${loyaltyInformation} i 
        on o.loyaltyschemeid = ${loyaltySchemeID} and i.useridshop = ${userID}
        inner join ${loyaltySchemeType} m on m.loyaltyschemetypeid = o.loyaltyschemetypeid inner join ${loyaltySchemeShopMapping} s on s.loyaltyschemeid = ${loyaltySchemeID} and s.useridshop = ${userID} group by o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, s.validfromdate, o.loyaltyschemename, 
        s.expireflag`;

      // let loadLoyaltyInformation = sql`select * from ${loyaltySchemeMaster} where ${loyaltySchemeMaster.loyaltyschemeid}=${userID}`;
      const response = await db.execute(loadLoyaltyInformation);

      // let loadLoyaltyInformation = await db.select({redeemfrequency: isNull(loyaltySchemeMaster.redeemfrequency), loyaltyschemeid: loyaltySchemeMaster.loyaltyschemeid,
      //     predefined: loyaltySchemeMaster.predefined, description: loyaltySchemeType.description, validfromdate: loyaltySchemeMaster.validfromdate,
      //     loyaltyschemename: loyaltySchemeMaster.loyaltyschemename, expireflag: loyaltySchemeMaster.expireflag, pointscollected: loyaltyInformation.pointscollected,
      //     numberofcustomers: loyaltyInformation.numberofcustomers, pointsredeemed: loyaltyInformation.pointsredeemed, pointstoberedeemed: loyaltyInformation.pointstoberedeemed,
      //     stampstocollect: loyaltyInformation.stampscollected, stampscollected: loyaltyInformation.stampscollected, freeitemsgiven: loyaltyInformation.freeitemsgiven})
      //     .from(loyaltySchemeMaster).innerJoin(loyaltyInformation, and((eq(loyaltySchemeMaster.loyaltyschemeid, loyaltyInformation.loyaltyschemeid)), eq(loyaltyInformation.useridshop, Number(userID))))
      //     .innerJoin(loyaltySchemeType, eq(loyaltySchemeType.loyaltyschemetypeid, loyaltySchemeMaster.loyaltyschemetypeid)).where(exists(db.select({useridshop: loyaltySchemeShopMapping.useridshop}).from(loyaltySchemeShopMapping).where(eq(loyaltySchemeShopMapping.useridshop, Number(userID)))));
      console.log(response);
      if (response.rows.length == 0) {
        throw new BadRequestError(
          'No reporting information found for this scheme.'
        );
      } else {
        var total_schemes: any[] = [];
        //
        for (let i = 0; i < response.rows.length; i++) {
          total_schemes.push({
            'redeemFrequncy': response.rows[i]['redeemfrequency'],
            'loyaltySchemeID': response.rows[i]['loyaltyschemeid'],
            Predefined: response.rows[i]['predefined'],
            'loyaltySchemeType': response.rows[i]['description'],
            'validFrom': response.rows[i]['validfromdate'],
            'loyaltySchemeName': response.rows[i]['loyaltyschemename'],
            'expireFlag': response.rows[i]['expireflag'],
            'pointsCollected': response.rows[i]['pointscollected'],
            'numberOfCustomers': response.rows[i]['numberofcustomers'],
            'pointsRedeemed': response.rows[i]['pointsredeemed'],
            'pointsToBeReedeemed': response.rows[i]['pointstoberedeemed'],
            'stampsToCollect': response.rows[i]['stampstocollect'],
            'stampsCollected': response.rows[i]['stampscollected'],
            'freeItemsGiven': response.rows[i]['freeitemsgiven'],
          });
        }
      }

      return res.status(200).json({ response: total_schemes });
    }
    if (reportFlag == false) {
      // see if the scheme is active. if validto is 9999-12-12 and validfrom is not future.
      // this is for loading loyalty scheme information for this specific scheme.
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
        .from(loyaltySchemeShopMapping)
        .innerJoin(
          loyaltySchemeMaster,
          and(
            eq(loyaltySchemeShopMapping.useridshop, Number(userID)),
            eq(loyaltySchemeShopMapping.loyaltyschemeid, loyaltySchemeID),
            eq(
              loyaltySchemeMaster.loyaltyschemeid,
              loyaltySchemeShopMapping.loyaltyschemeid
            ),
            eq(loyaltySchemeShopMapping.mapid, mapID)
          )
        );
      if (loadLoyaltyForUser.length == 0) {
        throw new BadRequestError('Loyalty Scheme information not found.');
      }

      const nowObj = new Date();
      var today = new Date(nowObj.getTime());
      today.setDate(nowObj.getDate());
      today = new Date(today.setUTCHours(0.0, 0, 0, 0));
      console.log(nowObj);
      console.log(today);
      let todayDate = today.toISOString().split('T')[0];
      // if ((loadLoyaltyForUser[0].validfromdate! < tomorrowDate) && (loadLoyaltyForUser[0].validtodate! == '9999-12-12')) {
      //     var activeStatus = true
      // }
      // else {
      //     var activeStatus = false
      // }

      if (loadLoyaltyForUser[0].validtodate! < todayDate) {
        var timeStatus = 'past';
        var activeStatus = false;
      } else {
        if (loadLoyaltyForUser[0].validfromdate! > todayDate) {
          var timeStatus = 'future';
          var activeStatus = false;
        } else {
          var timeStatus = 'present';
          var activeStatus = true;
        }
      }

      return res.status(200).json({
        response: loadLoyaltyForUser,
        active: activeStatus,
        time: timeStatus,
      });
    }

    // loyalty_scheme_master o
    // loyalty_information i
    // loyalty_scheme_type m
    // select o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename,
    // o.expireflag, i.pointscollected, i.numberofcustomers, i.pointsredeemed, i.pointstoberedeemed, i.stampstocollect,
    // i.stampscollected, i.freeitemsgiven from loyalty_scheme_master o inner join loyalty_information i
    // on o.loyaltyschemeid = i.loyaltyschemeid and i.useridshop = 1
    // inner join loyalty_scheme_type m on m.loyaltyschemetypeid = o.loyaltyschemetypeid
    // if userid exists in mapping table.

    // if empty, return no loyalty schemes created, otherwise return same format as in create-loyalty.
    // i also want name, type, valid date, expiry flag, redeem frequency
  }
);

export { router as viewLoyaltyRouter };
