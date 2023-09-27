import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq } from 'drizzle-orm';
import { favouritesTable, shopType, userMaster, userTypeMapping } from '../../../db/schema';

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

router.post('/get-favourites', currentUser,
requireAuth,
[
],
validateRequest, async (req: Request, res: Response) => {
    console.log('get-favourites');
    const { id } = req.currentUser!;
    let userID = id;

    const db = await dbConnect();


    const getFavouritesQuery = await db.select({
        useridshop: favouritesTable.useridshop,
        logo: userMaster.businesslogo,
        businessname: userMaster.businessname,
        shoptype: shopType.description,
        shoptypeid: userMaster.shoptypeid
        })
        .from(userMaster)
        .innerJoin(favouritesTable, 
                and(
                    eq(favouritesTable.useridshop, Number(userID)),
                    eq(favouritesTable.useridshop, userMaster.userid)
                    ),
        )
        .innerJoin(shopType, 
            eq(shopType.shoptypeid, userMaster.shoptypeid))

    
    return res.status(200).json({response: getFavouritesQuery})

});



export { router as getFavouritesRouter };