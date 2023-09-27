// if whatsappenabled = true then give number.

import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq, sql } from 'drizzle-orm';
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

router.post('/order-whatsapp-screen', currentUser,
requireAuth,
[
    body('radius').isNumeric().withMessage("Please provide a radius that is numeric."),
    body('coords').isString().withMessage("Please provide coords that are string."),
],
validateRequest, async (req: Request, res: Response) => {
    console.log('order-whatsapp-screen');
    const { id } = req.currentUser!;
    let userID = id;
    let radius = req.body.radius;
    let coords = req.body.coords;
    const db = await dbConnect();
    let offset = 1;
    var locationArray = coords.split(",");
    console.log(locationArray);

    // shop name, logo where enabledwhatsapp is on and radius is x
    let getWhatsappShopQuery = sql` SELECT u.businessname, u.logo, u.userid, u.whatsappenabled, round(cast(acos(
        sin(radians(${locationArray[0]})) 
          * sin(radians(baselatitude)) 
        + cos(radians(${locationArray[0]})) 
          * cos(radians(baselatitude)) 
          * cos( radians(${locationArray[1]})
            - radians(baselongitude))
        ) * 3963.1906 as numeric), 2) as distance
 FROM user_master u 
 WHERE acos(
        sin(radians(${locationArray[0]})) 
          * sin(radians(baselatitude)) 
        + cos(radians(${locationArray[0]})) 
          * cos(radians(baselatitude)) 
          * cos( radians(${locationArray[1]})
            - radians(baselongitude))
        ) * 3963.1906 <= ${radius} AND u.whatsappenabled = true group by u.businessname, u.logo, u.userid offset ${offset.toString()} limit 10 ;`;
    let getWhatsappShop = await db.execute(getWhatsappShopQuery);

    console.log(getWhatsappShop);



    

    

    
    return res.status(200).json({response: getWhatsappShop})

});



export { router as orderWhatsappScreenRouter };