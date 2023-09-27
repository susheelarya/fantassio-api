// if whatsappenabled = true then give number.

import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq } from 'drizzle-orm';
import { favouritesTable, shopType, userMaster, userTypeMapping } from '../../../db/schema';
import { get } from 'http';

const router = express.Router();

// {“Subscription”: “API Name”}, {“Loyalties”: “API Name”},
// {“Order via Whatsapp”: “API Name”},
// {“ Switch to Cashier”: “switch-user-type”},
// // merchant only
// // shopper only
// // shopper only
// // shopper and cashier
// {“ Switch to Merchant”: “switch-user-type”},
// {“ Switch to Shopper”: “switch-user-type”},
// {“Join Shop”: “join-shop-screen”},
// {“Approve Cashier”: “approve-cashier-screen”}, // merchant {“Create Your Own Shop”: “get-merchant-details”}, // shopper
// {“Add Cashier”: “add-cashier-screen”} // merchant

router.post('/order-whatsapp', currentUser,
requireAuth,
[
],
validateRequest, async (req: Request, res: Response) => {
    console.log('order-whatsapp');
    const { id } = req.currentUser!;
    let userID = id;

    const db = await dbConnect();

    // need id of shop basically and then you get mobile number and use the whatsapp api.

    const getShop = await db.select({
        mobilenumber: userMaster.mobilenumber
    })
    .from(userMaster)
    .where(
        eq(userMaster.userid, Number(userID))
    );
    
    // whatsapp api.
    

    
    return res.status(200).json({response: "Success"})

});



export { router as orderWhatsappRouter };