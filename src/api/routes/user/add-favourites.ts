import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq } from 'drizzle-orm';
import { favouritesTable, userMaster, userTypeMapping } from '../../../db/schema';
import { E } from 'drizzle-orm/select.types.d-d0a10728';

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

router.post('/add-favourites', currentUser,
requireAuth,
[
    body('shopID').isInt().withMessage("Please provide an integer shop id"),
],
validateRequest, async (req: Request, res: Response) => {
    console.log('add-favourites');
    // current user is a shopper.
    const { id } = req.currentUser!;
    let userID = id;

    let shopID = req.body.shopID;


    const db = await dbConnect();

    const addFavourite = await db.insert(favouritesTable)
        .values({
            useridshop: shopID,
            useridshopper: Number(userID)
        })
    
    return res.status(200).json({response: "Success"})

});



export { router as addFavouritesRouter };