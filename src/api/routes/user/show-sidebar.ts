import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq } from 'drizzle-orm';
import { userMaster, userTypeMapping } from '../../../db/schema';
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

router.post('/show-sidebar', currentUser,
requireAuth,
[
],
validateRequest, async (req: Request, res: Response) => {
    console.log('show-sidebar');
    const { id } = req.currentUser!;
    let userID = id;

    const db = await dbConnect();

    // Subscription : merchant
    // Loyalties : shopper
    // Order via Whatsapp : shopper
    // Switch to Cashier, Merchant, Shopper
    // Join Shop : cashier
    // Approve Cashier : merchant
    // Create Your Own Shop : shopper
    // Add Cashier : merchant

    let selectUserType = await db.select(
        {usertype: userMaster.usertype}
    )
    .from(userMaster)
    .where(eq(userMaster.userid, Number(userID)))

    let userType = selectUserType[0].usertype

    if (userType == 'M') {
        return res.status(200).json({fields: [
            {name: "Subscription", API: "/api-name"},
            {name: "Switch to Shopper", API: "/user/switch-user-type"},
            {name: "Approve Cashier", API: "shop/approve-cashier-screen"},
            {name: "Add Cashier", API: "shop/add-cashier-screen"}
        ]})
    }
    else if (userType == 'C') {
        return res.status(200).json({fields : [
            {name: "Join Shop", API: "/shop/join-shop"},
            {name: "Switch to Shopper", API: "/user/switch-user-type"},

        ]})
    }
    else if (userType == 'S') {
        // switch to cashier/merchant
        // create your own shop
        let switchUser = ''
        let selectFromMapping = await db.select({
            usertype: userTypeMapping.usertype
        })
        .from(userTypeMapping)
        .where(eq(userTypeMapping.userid, Number(userID)));

        var userTypeList = selectFromMapping.map(function (el) { return el.usertype; });

        if (userTypeList.includes('C')) {
            switchUser = 'Cashier'
        }
        else if (userTypeList.includes('M')) {
            switchUser = 'Mapping'
        }

        if (userTypeList.length == 1) {
            return res.status(200).json({fields : [
                {name: "Loyalties", API: "/api-name"},
                {name: "Order via Whatsapp", API: "/api-name"},
                {name: "Switch to "+switchUser, API: "/user/switch-user-type"},
                {name: "Create your own Shop", API: "/merchant/get-merchant-details"}
            ]})
        }
        else {
            return res.status(200).json({fields : [
                {name: "Loyalties", API: "/api-name"},
                {name: "Order via Whatsapp", API: "/api-name"},
                {name: "Switch to "+switchUser, API: "/user/switch-user-type"}
            ]})
        }

        
    }
    // MERCHANT : Subscription, Switch Shopper, Approve Cashier
        // Subscription : merchant
    // Loyalties : shopper
    // Order via Whatsapp : shopper
    // Switch to Cashier, Merchant, Shopper
    // Join Shop : cashier
    // Approve Cashier : merchant
    // Create Your Own Shop : shopper
    // Add Cashier : merchant


    


});



export { router as showSidebarRouter };