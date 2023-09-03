import express, { Request, Response } from 'express';
// import { OfferRepo } from '../../repos/offer-repo';
//import { dbFile } from '../../repos/db-file';
// import { UserRepo } from '../../repos/user-repo';
//import { MerchantRepo } from '../../repos/merchant-repo';

import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import {
  userMaster,
  parametersTable,
  loyaltySchemeType,
  loyaltySchemeMaster,
  loyaltySchemeShopMapping,
} from '../../../db/schema';
import { eq, sql, and } from 'drizzle-orm';

console.log('start');

const router = express.Router();

//     // Sample Request Body.
// //  {
// // 	"userID”: 4, //required

// // }

// // Sample Response Body.
// {“response” :
// [{“loyalty scheme” : “Cashback”, “id” : 1, “Points Conversion” : […], “Redeem Frequency” : […], “Stamps Conversion” : “”}, {……}],
// “schemes” : [{“loyalty scheme type” : “Cashback”, “Amount Spend” : 1, “Points Collected” : 1, “Number of points” : 10, “Amount from points” : 1, “name” : “name”}, {“loyalty scheme type”: “Cashback”, ….}, {“loyalty scheme type” : “Stamps”

// WHAT ERROR CODE DO WE SEND IF NOT MERCHANT?

// get user type. get all loyalty types.

// step 1 : sending fields.
// {“response” : [{“loyalty scheme” : “Cashback”, “id” : 1, “Points Conversion” : […], “Redeem Frequency” : […], “Stamps Conversion” : “”}, {……
router.post(
  '/create-loyalty-scheme',
  currentUser,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('create-loyalty');
    const { id } = req.currentUser!;
    let userID = id;
    //let UserType = req.body.UserType;
    userID = String(1);
    // const userid = (userID);

    const db = await dbConnect();

    const userTypeCheck = await db
      .select({ userTypeField: userMaster.usertype })
      .from(userMaster)
      .where(eq(userMaster.userid, Number(userID)));

    const userType = userTypeCheck[0];

    if (typeof userType == 'undefined' || userType.userTypeField == null) {
      throw new BadRequestError('User Type for this user not found.');
    }

    console.log(userID);
    //  if (isNaN(userID) == true) {
    //     return res.status(400).json({"response": "userID not valid"})
    // }

    //console.log(UserType);
    if (userType.userTypeField == 'M') {
      let getLoyaltyTypes = await db.select().from(loyaltySchemeType);

      // SELECT * FROM parameters
      const parameters = await db.select().from(parametersTable);

      let paramList = [
        'Redeem Frequency',
        'Points Conversion',
        'Stamps Conversion',
      ];
      var redeem_frequency: string[] = [];
      var points_conversion: string[] = [];
      var stamps_conversion: string[] = [];

      for (let i = 0; i < parameters.length; i++) {
        if (parameters[i]['parameter'] == paramList[0]) {
          redeem_frequency.push(parameters[i]['paramvalue'] ?? '');
        } else if (parameters[i]['parameter'] == paramList[1]) {
          points_conversion.push(parameters[i]['paramvalue'] ?? '');
        } else if (parameters[i]['parameter'] == paramList[2]) {
          stamps_conversion.push(parameters[i]['paramvalue'] ?? '');
        } else {
          console.log('error');
          throw new BadRequestError('Parameter Table Error');
        }
      }

      console.log(getLoyaltyTypes);

      var loyalty_scheme_names: string[] = [];
      var loyalty_scheme_ids: Int16Array[] = [];
      var total_response: any[] = [];

      for (let i = 0; i < getLoyaltyTypes.length; i++) {
        // loyalty_scheme_names.push(getLoyaltyTypes[i]['description']);
        // loyalty_scheme_ids.push(getLoyaltyTypes[i]['loyaltyschemetypeid']);
        if (
          getLoyaltyTypes[i]['description'] == 'Cashback' ||
          getLoyaltyTypes[i]['description'] == 'Vouchers'
        ) {
          total_response.push({
            'loyaltyScheme': getLoyaltyTypes[i]['description'],
            id: getLoyaltyTypes[i]['loyaltyschemetypeid'],
            'redeemFrequency': redeem_frequency,
            'pointsConversion': points_conversion,
            'stampsConversion': '',
          });
        } else if (getLoyaltyTypes[i]['description'] == 'Stamps') {
          total_response.push({
            'loyaltyScheme': getLoyaltyTypes[i]['description'],
            id: getLoyaltyTypes[i]['loyaltyschemetypeid'],
            'stampsConversion': stamps_conversion,
          });
        } else {
          console.log('error');
          throw new BadRequestError('Incorrect Loyalty Scheme Type');
        }
      }

      // get * from loyalty scheme master where predefined = 't'
      // get loyalty scheme type from id.

      // if cashback or voucher, then get the 4 columns needed
      // if stamps then get the last 2 columns needed.
      // send loyalty scheme id as well.

      // for each loyalty type, if cashback and voucher then get first 2 params, otherwise get 3rd param.

      var total_schemes: any[] = [];
      let getPredefinedLoyalty = await db
        .select({
          loyaltyschemetype: loyaltySchemeType.description,
          loyaltyschemetypeid: loyaltySchemeMaster.loyaltyschemetypeid,
          loyaltyschemeid: loyaltySchemeMaster.loyaltyschemeid,
          moneyforpoints: loyaltySchemeMaster.moneyforpoints,
          pointsfrommoney: loyaltySchemeMaster.pointsfrommoney,
          pointstoredeem: loyaltySchemeMaster.pointstoredeem,
          moneyfrompoints: loyaltySchemeMaster.moneyfrompoints,
          loyaltyschemename: loyaltySchemeMaster.loyaltyschemename,
          redeemfrequency: loyaltySchemeMaster.redeemfrequency,
          stampstocollect: loyaltySchemeMaster.stampstocollect,
          freeitems: loyaltySchemeMaster.freeitems
        })
        .from(loyaltySchemeMaster)
        .innerJoin(loyaltySchemeType, 
          and(eq(loyaltySchemeType.loyaltyschemetypeid, loyaltySchemeMaster.loyaltyschemetypeid), 
          eq(loyaltySchemeMaster.predefined, true)));
       
      // SELECT * FROM loyalty_scheme_master WHERE predefined = true

      for (let i = 0; i < getPredefinedLoyalty.length; i++) {
        total_schemes.push({
          'loyaltySchemeType': getPredefinedLoyalty[i]['loyaltyschemetype'],
          'loyaltySchemeTypeID':
            getPredefinedLoyalty[i]['loyaltyschemetypeid'],
          'loyaltySchemeID': getPredefinedLoyalty[i]['loyaltyschemeid'],
          'amountSpend': getPredefinedLoyalty[i]['moneyforpoints'],
          'pointsCollected': getPredefinedLoyalty[i]['pointsfrommoney'],
          'numberOfPoints': getPredefinedLoyalty[i]['pointstoredeem'],
          'amountFromPoints': getPredefinedLoyalty[i]['moneyfrompoints'],
          'name': getPredefinedLoyalty[i]['loyaltyschemename'],
          'redeemFrequency': getPredefinedLoyalty[i]['redeemfrequency'],
          'stampsToCollect': getPredefinedLoyalty[i]['stampstocollect'],
          'freeItems': getPredefinedLoyalty[i]['freeitems'],
        });
      }
      let maximumDateResult = await db
        .select({ maxdate: sql<Date>`max(validfromdate)` })
        .from(loyaltySchemeShopMapping)
        .where(eq(loyaltySchemeShopMapping.useridshop, Number(userID)));
      console.log(maximumDateResult);
      if (
        maximumDateResult.length == 0 ||
        maximumDateResult[0].maxdate == null
      ) {
        const nowObj = new Date();
        var tomorrow = new Date(nowObj.getTime());
        tomorrow.setDate(nowObj.getDate() + 1);
        tomorrow = new Date(tomorrow.setUTCHours(0.0, 0, 0, 0));
        console.log('tomorrow : ' + tomorrow);
        var maximumDate = tomorrow;
        var dayAfterDate = tomorrow.toISOString().split('T')[0];
        console.log(dayAfterDate);
      } else {
        var maximumDate = new Date(maximumDateResult[0].maxdate);
        var dayAfter = new Date(new Date().setDate(maximumDate.getDate() + 1));
        dayAfter = new Date(dayAfter.setUTCHours(0.0, 0, 0, 0));
        var dayAfterDate = dayAfter.toISOString().split('T')[0];
      }

      res.status(200).json({
        response: total_response,
        schemes: total_schemes,
        validFrom: dayAfterDate,
        pointsExpired:
          'This field shows for how long (in months) after the loyalty scheme expires the points a user has collected will be valid.',
        stampsExpired: 
          'This field shows for how long (in months) after the loyalty scheme expires the stamps a user has collected will be valid.',
      });

      // “schemes” : [{“loyalty scheme type” : “Cashback”, “Amount Spend” : 1, “Points Collected” : 1, “Number of points” : 10, “Amount from points” : 1, “name” : “name”, "redeem frequency" : "quarterly"}, {“loyalty scheme type”: “Cashback”, ….}, {“loyalty scheme type” : “Stamps”

      // // loyalty scheme type, loyalty scheme type id, amount spend,

      // //     // let insertDetails = await dbFile.insertOfferType();

      // //     //SELECT ALL FROM OFFERTYPE
      //     let fieldList = ["Amount Spend", "Points Collected ", "Number of points", "Amount from points", "Redeem Frequency"];

      // //     //let getOfferTypes = await OfferRepo.getAllOfferTypes();

      //     console.log(getLoyaltyTypes);
      //     const loyaltyTypeList : string[] = [];
      //     const loyaltyTypeIDList :Int16Array[] = [];

      //     for (let i = 0; i < getLoyaltyTypes.length; i++) {
      //         loyaltyTypeList.push(getLoyaltyTypes[i]["description"]);
      //         loyaltyTypeIDList.push(getLoyaltyTypes[i].loyaltyschemetypeid);
      //     }
      //     console.log(loyaltyTypeList);
      //     console.log(loyaltyTypeIDList);

      //     res.status(200).json({"loyalty scheme" : [loyaltyTypeList, loyaltyTypeIDList], "fields" : fieldList

      // });
    } else {
      return res.status(400).json({ response: 'User is not a merchant.' });
    }
  }
);

export { router as createLoyaltyRouter };
