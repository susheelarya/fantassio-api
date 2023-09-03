import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { BadRequestError } from '../../../errors/bad-request-error';
import {
  userMaster,
  loyaltySchemeType,
  loyaltySchemeMaster,
  loyaltyInformation,
  loyaltySchemeShopMapping,
  stamps,
} from '../../../db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { body } from 'express-validator';
import exp from 'constants';

const router = express.Router();

router.post(
  '/save-loyalty-scheme',
  currentUser,
  requireAuth,
  [
    body('loyaltySchemeTypeID')
      .isInt()
      .withMessage('Please provide a loyaltySchemeTypeID that is an integer'),
    body('loyaltySchemeID')
      .optional()
      .isInt()
      .withMessage('Please provide a loyaltySchemeID that is an integer'),
    body('loyaltySchemeName')
      .optional()
      .isString()
      .withMessage('Please provide a loyaltySchemeName that is a string'),
    body('amountSpend')
      .optional()
      .isNumeric()
      .withMessage('Please provide a amountSpend that is numeric'),
    body('pointsCollected')
      .optional()
      .isNumeric()
      .withMessage('Please provide a pointsCollected that is numeric'),
    body('pointsRedeem')
      .optional()
      .isNumeric()
      .withMessage('Please provide a pointsRedeem that is numeric'),
    body('amountFromPoints')
      .optional()
      .isNumeric()
      .withMessage('Please provide a amountFromPoints that is numeric'),
    body('redeemFrequency')
      .optional()
      .isString()
      .withMessage('Please provide a redeemFrequency that is a string'),
    body('stampsCollect')
      .optional()
      .isNumeric()
      .withMessage('Please provide a stampsCollect that is numeric'),
    body('freeItems')
      .optional()
      .isNumeric()
      .withMessage('Please provide a freeItems that is numeric'),
    body('monthsExpire')
      .optional()
      .isInt()
      .withMessage('Please provide a monthsExpire that is integer'),
    body('validFromDate')
      .isDate()
      .withMessage('Please provide a validFromDate that is date'),
    body('predefined')
      .isBoolean()
      .withMessage('Please provide a predefined value that is a boolean'),
    body('unsubscribeFlag')
      .isBoolean()
      .withMessage(
        'Please provide unsubscribe flag that is boolean. True if user is unsubscribing, false otherwise.'
      ),
    body('mapID')
      .optional()
      .isInt()
      .withMessage('Please provide a mapID that is an integer.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('save-loyalty-scheme');

    let loyaltySchemeTypeID = req.body.loyaltySchemeTypeID; // necessary for create.
    let loyaltySchemeID = req.body.loyaltySchemeID!; // necessary for modify.
    let loyaltySchemeName = req.body.loyaltySchemeName!;
    let amountSpend = req.body.amountSpend!;
    let pointsCollected = req.body.pointsCollected!;
    let pointsRedeem = req.body.pointsRedeem!;
    let amountFromPoints = req.body.amountFromPoints!;
    let redeemFrequency = req.body.redeemFrequency!;
    let stampsCollect = req.body.stampsCollect!;
    let freeItems = req.body.freeItems!;
    let expiry = req.body.monthsExpire!; // This is necessary when not unsubscribing.
    let validity = req.body.validFromDate; // necessary.
    let predefined = req.body.predefined; // necessary either way
    let createFlag = req.body.createFlag; // necessary either way
    let unsubscribeFlag = req.body.unsubscribeFlag!; // optional.
    let mapID = req.body.mapID!; // optional. Required when unsubscribing.

    const { id } = req.currentUser!;
    let userID = id;

    const db = await dbConnect();

    const userCheck = await db
      .select()
      .from(userMaster)
      .where(eq(userMaster.userid, Number(userID)));

    if (userCheck.length == 0) {
      throw new BadRequestError('UserID not found');
    }

    // if the user is unsubscribing, then we get the set validtodate to tomorrow. need loyaltyID.
    const nowObj = new Date();
    let today = nowObj.toISOString().split('T')[0];
    // var tomorrow = (new Date(new Date().setDate(nowObj.getDate() + 1)));
    var tomorrow = new Date(nowObj.getTime());
    tomorrow.setDate(nowObj.getDate() - 1);
    tomorrow = new Date(tomorrow.setUTCHours(0.0, 0, 0, 0));

    if (unsubscribeFlag == true) {
      if (loyaltySchemeID == null || typeof loyaltySchemeID == 'undefined') {
        throw new BadRequestError(
          'Need loyaltySchemeID to unsubscribe to a loyalty scheme.'
        );
      }
      if (mapID == null || typeof mapID == 'undefined') {
        throw new BadRequestError(
          'Need mapID to unsubscribe to a loyalty scheme.'
        );
      }
      // check if future scheme. If future, delete from mapping table., remove from mapping table. if same, make validto one day later and expire.
      let checkDate = await db
        .select({ validfromdate: loyaltySchemeShopMapping.validfromdate })
        .from(loyaltySchemeShopMapping)
        .where(eq(loyaltySchemeShopMapping.mapid, mapID));
      if (checkDate[0].validfromdate! <= today) {
        let unsubscribing = await db
          .update(loyaltySchemeShopMapping)
          .set({ validtodate: String(today) })
          .where(eq(loyaltySchemeShopMapping.mapid, mapID));
      } else {
        let unsubscribing = await db
          .delete(loyaltySchemeShopMapping)
          .where(eq(loyaltySchemeShopMapping.mapid, mapID));
      }
    } else {
      if (expiry == null || typeof expiry == 'undefined') {
        console.log(expiry);
        throw new BadRequestError(
          'Need expiry months when not unsubscribing to a scheme.'
        );
      }

      // loyalty scheme type id check : is it valid?

      // if predefined, insert into loyalty scheme shop mapping. Check if ids match, if offerids have predefined offers.
      // if not predefined, insert into master and mapping.

      let loyaltySchemeTypeIDList = await db
        .select()
        .from(loyaltySchemeType)
        .where(eq(loyaltySchemeType.loyaltyschemetypeid, loyaltySchemeTypeID));

      if (loyaltySchemeTypeIDList.length == 0) {
        throw new BadRequestError('loyaltySchemeTypeID not found');
      }

      // always insert in master if predefined, mapping otherwise. Before inserting get max(date), validto = max(date)-1 and validfrom = inserted date.

      let dateValidity = new Date(validity);
      console.log(nowObj);
      console.log(dateValidity);
      console.log(tomorrow);
      if (dateValidity < tomorrow) {
        throw new BadRequestError('Date of creation has to be a future date.');
      }

      // insert if predefined = false into master
      // then basically get max date, if not empty then update mapping one day before, insert new record mapping. If empty then insert new record mapping.
      // let maximumDateResult = await db.select({maxdate: sql<Date>`max(validfromdate)`, mapid: loyaltySchemeShopMapping.mapid}).from(loyaltySchemeShopMapping).where(eq(loyaltySchemeShopMapping.useridshop, Number(userID)));
      // let maxDate = await db.select({maxdate: sql<Date>`max(validfromdate)`}).from(loyaltySchemeShopMapping);
      let query = sql`select mapid, validfromdate from loyalty_scheme_shop_mapping where validfromdate in (select max(validfromdate) from loyalty_scheme_shop_mapping) and useridshop = ${userID} group by mapid;`;
      const maximumDateResult = await db.execute(query);
      console.log("maximumDateResult");
      console.log(maximumDateResult);
      if (maximumDateResult.rows.length != 0) {
        let maxDate = maximumDateResult.rows[0].validfromdate;
        console.log(maxDate);
        let maxDateType = new Date(String(maxDate));
        console.log(maxDateType);

        // select max(validfromdate) from loyalty_scheme_shop_mapping
        // CORRECT QUERY : select mapid, validfromdate from loyalty_scheme_shop_mapping where validfromdate in (select max(validfromdate) from loyalty_scheme_shop_mapping) and useridshop = 1 group by mapid;
        // date has to be in future AND after highest max date.

        console.log('date validity');
        console.log(dateValidity);
        console.log(maxDateType);
        if (dateValidity <= maxDateType) {
          throw new BadRequestError(
            'Date of creation has to be after your latest scheme starts.'
          );
        }
      }

      // get one day before.
      var OneDayBeforeDate = new Date(dateValidity.getTime());
      OneDayBeforeDate.setDate(dateValidity.getDate() - 1);
      console.log(OneDayBeforeDate);
      let OneDayBefore = OneDayBeforeDate.toISOString().split('T')[0];
      console.log(OneDayBefore);

      if (predefined == true) {
        if (loyaltySchemeID == null || typeof loyaltySchemeID == 'undefined') {
          throw new BadRequestError(
            'Need loyaltySchemeID with predefined loyalty scheme'
          );
        }
        //         select loyaltyschemeid from loyalty_scheme_master where loyaltyschemetypeid = $1 and loyaltyschemeid = $2;',
        //   [loyaltySchemeTypeID, loyaltySchemeID]
        let validateLoyaltyID = await db
          .select({ loyaltyschemeid: loyaltySchemeMaster.loyaltyschemeid })
          .from(loyaltySchemeMaster)
          .where(
            and(
              eq(loyaltySchemeMaster.loyaltyschemetypeid, loyaltySchemeTypeID),
              eq(loyaltySchemeMaster.loyaltyschemeid, loyaltySchemeID)
            )
          );
        if (validateLoyaltyID.length == 0) {
          throw new BadRequestError(
            'loyaltySchemeID and loyaltySchemeTypeID do not match'
          );
        }

        // let insertUserLoyaltyMapping = await db.insert(loyaltySchemeShopMapping).values({useridshop: Number(userID), loyaltyschemeid: loyaltySchemeID, validfromdate: validity, validtodate: '9999-12-12', expireflag: false, expiremonths: expiry});
      }

      if (maximumDateResult.rows.length == 0) {
        // insert new record into mapping.
        if (predefined == true) {
          let insertUserLoyaltyMapping = await db
            .insert(loyaltySchemeShopMapping)
            .values({
              useridshop: Number(userID),
              loyaltyschemeid: loyaltySchemeID,
              validfromdate: validity,
              validtodate: '9999-12-12',
              expireflag: false,
              expiremonths: expiry,
              redeemfrequency: redeemFrequency
            });
        } else {
          let insertLoyalty: { insertedID: Number }[];
          insertLoyalty = await db
            .insert(loyaltySchemeMaster)
            .values({
              loyaltyschemetypeid: loyaltySchemeTypeID,
              moneyforpoints: amountSpend,
              pointsfrommoney: pointsCollected,
              pointstoredeem: pointsRedeem,
              moneyfrompoints: amountFromPoints,
              redeemfrequency: redeemFrequency,
              predefined: predefined,
              stampstocollect: stampsCollect,
              freeitems: freeItems,
              loyaltyschemename: loyaltySchemeName,
            })
            .returning({ insertedID: loyaltySchemeMaster.loyaltyschemeid });
          console.log(insertLoyalty);
          console.log("insertLoyalty")
          // await db.transaction(async (tx) => {

          //     let insertUserLoyaltyMapping = await tx.insert(loyaltySchemeShopMapping).values({useridshop: Number(userID), loyaltyschemeid: Number(insertLoyalty[0].insertedID), validfromdate: validity, validtodate: '9999-12-12', expireflag: false, expiremonths: expiry});
          // });

          let insertUserLoyaltyMapping = await db
            .insert(loyaltySchemeShopMapping)
            .values({
              useridshop: Number(userID),
              loyaltyschemeid: Number(insertLoyalty[0].insertedID),
              validfromdate: validity,
              validtodate: '9999-12-12',
              expireflag: false,
              expiremonths: expiry,
              redeemfrequency: redeemFrequency,
            });
        }
      } else {
        // update the record that has highest date so far and insert.
        let maxDate = maximumDateResult.rows[0].validfromdate;
        let dateChange = await db
          .update(loyaltySchemeShopMapping)
          .set({ validtodate: String(OneDayBefore) })
          .where(
            and(
              eq(loyaltySchemeShopMapping.useridshop, Number(userID)),
              eq(loyaltySchemeShopMapping.validfromdate, String(maxDate))
            )
          );
        if (predefined == true) {
          let insertUserLoyaltyMapping = await db
            .insert(loyaltySchemeShopMapping)
            .values({
              useridshop: Number(userID),
              loyaltyschemeid: loyaltySchemeID,
              validfromdate: validity,
              validtodate: '9999-12-12',
              expireflag: false,
              expiremonths: expiry,
              redeemfrequency: redeemFrequency
            });
        } else {
          let insertLoyalty: { insertedID: Number }[];
          insertLoyalty = await db
            .insert(loyaltySchemeMaster)
            .values({
              loyaltyschemetypeid: loyaltySchemeTypeID,
              moneyforpoints: amountSpend,
              pointsfrommoney: pointsCollected,
              pointstoredeem: pointsRedeem,
              moneyfrompoints: amountFromPoints,
              redeemfrequency: redeemFrequency,
              predefined: predefined,
              stampstocollect: stampsCollect,
              freeitems: freeItems,
              loyaltyschemename: loyaltySchemeName,
            })
            .returning({ insertedID: loyaltySchemeMaster.loyaltyschemeid });
          console.log(insertLoyalty);
          console.log("insertLoyalty")
          // await db.transaction(async (tx) => {

          //     let insertUserLoyaltyMapping = await tx.insert(loyaltySchemeShopMapping).values({useridshop: Number(userID), loyaltyschemeid: Number(insertLoyalty[0].insertedID), validfromdate: validity, validtodate: '9999-12-12', expireflag: false, expiremonths: expiry});
          // });

          let insertUserLoyaltyMapping = await db
            .insert(loyaltySchemeShopMapping)
            .values({
              useridshop: Number(userID),
              loyaltyschemeid: Number(insertLoyalty[0].insertedID),
              validfromdate: validity,
              validtodate: '9999-12-12',
              expireflag: false,
              expiremonths: expiry,
              redeemfrequency: redeemFrequency
            });
        }
      }
    }

    return res.status(200).json({ response: 'success' });
  }
);

export { router as saveLoyaltyRouter };
