import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { BadRequestError } from '../../../errors/bad-request-error';
import { userMaster, loyaltySchemeType, loyaltySchemeShopMapping, loyaltySchemeMaster, loyaltyInformation } from '../../../db/schema/user';
import { and, eq, exists, isNull, sql } from 'drizzle-orm';
import { body } from 'express-validator';
import pg from 'pg';

 const router = express.Router();


 router.get('/view-loyalty-scheme', currentUser,
 requireAuth,
 validateRequest, 
 [
    body('viewFlag').isBoolean().withMessage('Please provide a view flag that is a boolean.'),
    // body('userID').notEmpty().withMessage('Please provide a valid userID'),
  ],async (req: Request, res: Response) => {
    console.log('view-loyalty-scheme');

    let viewFlag = req.body.viewFlag;
    const { id } = req.currentUser!;
    let userID = id;
    console.log(userID);

    const db = await dbConnect();
    
    const userCheck = await db.select().from(userMaster).where(eq(userMaster.userid, Number(userID)));

    if (userCheck.length == 0) {
        throw new BadRequestError('UserID not found');
    }

    if (viewFlag == true) {
        let loadLoyaltyInformation = sql`select o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename, 
        o.expireflag, coalesce(max(i.pointscollected),0) as pointscollected, coalesce(max(i.numberofcustomers),0) as numberofcustomers, coalesce(max(i.pointsredeemed),0) as pointsredeemed, coalesce(max(i.pointstoberedeemed),0) as pointstoberedeemed, coalesce(max(i.stampstocollect),0) as stampstocollect, 
        coalesce(max(i.stampscollected),0) as stampscollected, coalesce(max(i.freeitemsgiven),0) as freeitemsgiven from ${loyaltySchemeMaster} o inner join ${loyaltyInformation} i 
        on o.loyaltyschemeid = i.loyaltyschemeid and i.useridshop = ${userID}
        inner join ${loyaltySchemeType} m on m.loyaltyschemetypeid = o.loyaltyschemetypeid where exists(select useridshop from loyalty_scheme_shop_mapping where useridshop=${userID}) group by o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename, 
        o.expireflag`;

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
                throw new BadRequestError('You have not created or subscribed to any loyalty schemes.');
            }
            else {
                var total_schemes : any[] = []
    // 
                for (let i = 0; i < response.rows.length;i++) {
            total_schemes.push({"Redeem Frequency" : response.rows[i]['redeemfrequency'], "Loyalty Scheme ID" : response.rows[i]['loyaltyschemeid'], "Predefined" : response.rows[i]['predefined'], "Loyalty Scheme Type" : response.rows[i]['description'], "Valid From" : response.rows[i]['validfromdate'], "Loyalty Scheme Name" : response.rows[i]['loyaltyschemename'], 
            "Expire Flag" : response.rows[i]['expireflag'], "Points Collected" : response.rows[i]['pointscollected'], "Number of Customers" : response.rows[i]['numberofcustomers'], 
            "Points Redeemed" : response.rows[i]['pointsredeemed'], "Points To Be Redeemed" : response.rows[i]['pointstoberedeemed'], "Stamps To Collect" : response.rows[i]['stampstocollect'] , "Stamps Collected" : response.rows[i]['stampscollected'], "Free Items Given" : response.rows[i]['freeitemsgiven']})
        }

            }
        

        return res.status(200).json({"response" : total_schemes})
    }
    if (viewFlag == false) {
        // this is for loading all loyalty scheme information for the user.
        let loadLoyaltyForUser = await db.select({loyaltyschemeid: loyaltySchemeMaster.loyaltyschemeid,
            loyaltyschemetypeid: loyaltySchemeMaster.loyaltyschemetypeid, moneyforpoints: loyaltySchemeMaster.moneyforpoints, pointsfrommoney: loyaltySchemeMaster.pointsfrommoney,
            pointstoredeem: loyaltySchemeMaster.pointstoredeem, redeemfrequency: loyaltySchemeMaster.redeemfrequency, predefined: loyaltySchemeMaster.predefined,
            stampstocollect: loyaltySchemeMaster.stampstocollect, freeitems: loyaltySchemeMaster.freeitems, expiremonths: loyaltySchemeMaster.expiremonths, validfromdate: loyaltySchemeMaster.validfromdate,
            loyaltyschemename: loyaltySchemeMaster.loyaltyschemename, expireflag: loyaltySchemeMaster.expireflag}).from(loyaltySchemeMaster).innerJoin(loyaltySchemeShopMapping, and(eq(loyaltySchemeShopMapping.useridshop, Number(userID)), eq(loyaltySchemeMaster.loyaltyschemeid, loyaltySchemeShopMapping.loyaltyschemeid)))
        if (loadLoyaltyForUser.length == 0) {
            throw new BadRequestError("You have not created or subscribed to any loyalty schemes.")
        }         
        return res.status(200).json({"response" : loadLoyaltyForUser})
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
        
        

    
    
        


 });



 export { router as viewLoyaltyRouter };


//  select o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename, 
//         o.expireflag, coalesce(max(i.pointscollected),0) as pointscollected, coalesce(max(i.numberofcustomers),0) as numberofcustomers, coalesce(max(i.pointsredeemed),0) as pointsredeemed, coalesce(max(i.pointstoberedeemed),0) as pointstoberedeemed, coalesce(max(i.stampstocollect),0) as stampstocollect, 
//         coalesce(max(i.stampscollected),0) as stampscollected, coalesce(max(i.freeitemsgiven),0) as freeitemsgiven from loyalty_scheme_master o inner join loyalty_information i 
//         on o.loyaltyschemeid = i.loyaltyschemeid and i.useridshop = 1
//         inner join loyalty_scheme_type m on m.loyaltyschemetypeid = o.loyaltyschemetypeid where exists(select useridshop from loyalty_scheme_shop_mapping where useridshop=1) group by o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename, 
//         o.expireflag
