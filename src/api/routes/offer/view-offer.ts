// offertypeid        | integer                |           | not null | 
//  offerid            | integer                |           | not null | nextval('offer_master_offerid_seq'::regclass)
//  description        | text                   |           |          | 
//  buyitem            | integer                |           |          | 
//  freeitem           | integer                |           |          | 
//  percentagediscount | numeric                |           |          | 
//  cashdiscount       | numeric                |           |          | 
//  minspend           | numeric                |           |          | 
// predefined


import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { offerMaster, userMaster, userOfferMapping } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

const router = express.Router();


router.post('/view-offer', currentUser,
requireAuth,
[
    body('offerID').isInt().withMessage('Please send a valid offer id that is an integer'),
    body('mapID').isInt().withMessage("Please send a valid map id that is an integer")
],
validateRequest, async (req: Request, res: Response) => {
    const { id } = req.currentUser!;
    let userID = id;
    let mapID = req.body.mapID;
    let offerID = req.body.offerID;
    const db = await dbConnect();

    const userTypeCheck = await db.select({userTypeField: userMaster.usertype}).from(userMaster).where(eq(userMaster.userid, Number(userID)));

    const userType = userTypeCheck[0];

    if ((typeof userType == 'undefined') || (userType.userTypeField  == null)) {
        throw new BadRequestError('User Type for this user not found.');        
    }

    let loadOffers = await db.select({offertypeid: offerMaster.offertypeid, offerid: offerMaster.offerid,
    description: offerMaster.description, buyitem: offerMaster.buyitem, freeitem: offerMaster.freeitem, percentagediscount: offerMaster.percentagediscount,
    cashdiscount: offerMaster.cashdiscount, minspend: offerMaster.minspend, predefined: offerMaster.predefined, mapid: userOfferMapping.mapid,
    validfromdate: userOfferMapping.validfromdate, validtodate: userOfferMapping.validtodate, validfromtime: userOfferMapping.validfromtime, validtotime: userOfferMapping.validtotime,
    expireflag: userOfferMapping.expireflag, whilestockslast: userOfferMapping.whilestockslast, offerinformation: userOfferMapping.offerinformation
    }).from(userOfferMapping).innerJoin(offerMaster, and(eq(userOfferMapping.userid, Number(userID)), eq(userOfferMapping.offerid, offerID), eq(offerMaster.offerid, userOfferMapping.offerid), eq(userOfferMapping.mapid, mapID)));


    if (loadOffers.length == 0) {
        throw new BadRequestError("Offer information not found.")
    } 

    // append time and change times.
    let loadObj: any = loadOffers;

    const nowObj = new Date();
    var today = new Date(nowObj.getTime());
    today.setDate(nowObj.getDate());
    today = new Date(today.setUTCHours(0.0,0,0,0)); 
    console.log(nowObj)
    console.log(today)
    let todayDate = today.toISOString().split('T')[0];
    // if ((loadLoyaltyForUser[0].validfromdate! < tomorrowDate) && (loadLoyaltyForUser[0].validtodate! == '9999-12-12')) {
    //     var activeStatus = true
    // }
    // else {
    //     var activeStatus = false
    // }

    if (loadOffers[0].validtodate! < todayDate) {
        var timeStatus = 'past';
        var activeStatus = false;
    }
    else {
        if (loadOffers[0].validfromdate! > todayDate) {
            var timeStatus = 'future';
        }
        else {
            var timeStatus = 'present';
        }
    }
    loadObj[0].timestatus = timeStatus;

    return res.status(200).json({"response" : loadOffers})


});

export { router as viewOfferRouter };
