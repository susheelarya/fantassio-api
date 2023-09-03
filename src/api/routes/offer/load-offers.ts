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


router.post('/load-offers', currentUser,
requireAuth,
[
],
validateRequest, async (req: Request, res: Response) => {
    const { id } = req.currentUser!;
    let userID = id;
    const db = await dbConnect();

    const userTypeCheck = await db.select({userTypeField: userMaster.usertype}).from(userMaster).where(eq(userMaster.userid, Number(userID)));

    const userType = userTypeCheck[0];

    if ((typeof userType == 'undefined') || (userType.userTypeField  == null)) {
        throw new BadRequestError('User Type for this user not found.');        
    }

    // load all offers for a user.
    let loadAllOffers = await db.select({offertypeid: offerMaster.offertypeid, offerid: offerMaster.offerid, 
        description: offerMaster.description, validfromdate: userOfferMapping.validfromdate, validtodate: userOfferMapping. validtodate,
    validfromtime: userOfferMapping.validfromtime, mapid: userOfferMapping.mapid, validtotime: userOfferMapping.validtotime, expireflag: userOfferMapping.expireflag})
    .from(offerMaster).innerJoin(userOfferMapping, and(eq(userOfferMapping.userid, Number(userID)), eq(userOfferMapping.offerid, offerMaster.offerid)));

    if (loadAllOffers.length == 0) {
        return res.status(200).json({"response" : "You don't have any loyalty schemes. Press the plus icon to create one"})
    }
    console.log(loadAllOffers)
    const nowObj = new Date();
    var today = new Date(nowObj.getTime());
    today.setDate(nowObj.getDate());
    today = new Date(today.setUTCHours(0.0,0,0,0)); 
    console.log(nowObj)
    console.log(today)
    let todayDate = today.toISOString().split('T')[0];
    
    let loadObj: any = loadAllOffers;
    let loadArr = [];
    for (let i = 0; i < loadAllOffers.length; i++) {
        console.log(loadAllOffers[i].validfromdate)
        if (loadAllOffers[i].validtodate! < todayDate) {
            var timeStatus = 'past';
        }
        else {
            if (loadAllOffers[i].validfromdate! > todayDate) {
                var timeStatus = 'future';
            }
            else {
                var timeStatus = 'present';
            }
        }
        console.log(timeStatus)
        loadObj[i].timestatus = timeStatus

    }


    


    
    return res.status(200).json({"response" : loadAllOffers})
    




});



export { router as loadOfferRouter };
