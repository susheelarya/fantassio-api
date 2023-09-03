// const haversine = require("haversine-distance");


import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { offerMaster, userMaster } from '../../../db/schema';
import { eq, isNull, sql } from 'drizzle-orm';


const router = express.Router();

router.post('/offers-near-you', currentUser,
requireAuth,
[
    body('coords').isNumeric().withMessage("Please make sure the coords is numeric."),
    body('radius').isNumeric().withMessage("Please make sure the radius is numeric."),
    body('page').isInt().withMessage("Please make sure the page is an integer.")
],
validateRequest, async (req: Request, res: Response) => {
    // const a = { latitude: 37.8136, longitude: 144.9631 }
    // const b = { latitude: 33.8650, longitude: 151.2094 }
    
    // console.log(haversine(a, b)) // 714504.18 (in meters)

    // userid and coordinates. Find shops within that radius, and find get offer information and return everything.
    // NEED OFFER_MASTER API TO JUST RETURN OFFER_MASTER

    console.log('offers-near-you');

    const { id } = req.currentUser!;
    let userID = id;

    let coords = req.body.coords;

    let radius = req.body.radius;

    let page = req.body.page;

    let offset = ((10 * page)-10);

    // we want to return shop name, distance, userID of shop, logo of shop, how many offers that are still running the shop has.

    // check userid is a shopper. decode coordinates, find distance

    const db = await dbConnect();



    let validateUserID = await db.select({usertype: userMaster.usertype}).from(userMaster).where(eq(userMaster.userid, Number(userID)));


    console.log(validateUserID);

    if (validateUserID.length == 0) {
        throw new BadRequestError("User Type not found");
    }

    if (validateUserID[0]['usertype'] != 'S') {
        throw new BadRequestError("User is not a shopper");
    }
    
        // console.log(location);
        // console.log(location[0]);
    
        var locationArray = coords.split(",");
        console.log(locationArray);
    
        // update location in db
    
        const latlong = JSON.stringify(locationArray)
        .replace('[', '{')
        .replace(']', '}');

    //     SELECT t.*, u.businessname, u.businesslogo, u.userid, round(cast(acos(
    //         sin(radians($1)) 
    //           * sin(radians(baselatitude)) 
    //         + cos(radians($1)) 
    //           * cos(radians(baselatitude)) 
    //           * cos( radians($2)
    //             - radians(baselongitude))
    //         ) * 3963.1906 as numeric), 2) as distance
    //  FROM user_master u LEFT JOIN user_offer_mapping o ON u.userid=o.userid INNER JOIN offer_master t ON t.offerid = o.offerid
    //  WHERE acos(
    //         sin(radians($1)) 
    //           * sin(radians(baselatitude)) 
    //         + cos(radians($1)) 
    //           * cos(radians(baselatitude)) 
    //           * cos( radians($2)
    //             - radians(baselongitude))
    //         ) * 3963.1906 <= $3 group by u.businessname, u.businesslogo, t.offertypeid, t.offerid, u.userid offset $4 limit 10 ;`,
    //       [latitude, longitude, radius, offset]

        console.log(locationArray[0]);
        try {

            let getOffersStmt = sql`        SELECT t.*, u.businessname, u.businesslogo, u.userid, round(cast(acos(
                sin(radians(${locationArray[0]})) 
                  * sin(radians(baselatitude)) 
                + cos(radians(${locationArray[0]})) 
                  * cos(radians(baselatitude)) 
                  * cos( radians(${locationArray[1]})
                    - radians(baselongitude))
                ) * 3963.1906 as numeric), 2) as distance
         FROM user_master u LEFT JOIN user_offer_mapping o ON u.userid=o.userid INNER JOIN offer_master t ON t.offerid = o.offerid
         WHERE acos(
                sin(radians(${locationArray[0]})) 
                  * sin(radians(baselatitude)) 
                + cos(radians(${locationArray[0]})) 
                  * cos(radians(baselatitude)) 
                  * cos( radians(${locationArray[1]})
                    - radians(baselongitude))
                ) * 3963.1906 <= ${radius} group by u.businessname, u.businesslogo, t.offertypeid, t.offerid, u.userid offset ${offset} limit 10`;

            const getOffers = await db.execute(getOffersStmt);





            // let getOffers = await UserRepo.findOffers(locationArray[0], locationArray[1], radius, offset.toString());

            console.log(getOffers);
        // could be empty

        // const a = { latitude: locationArray[0], longitude: locationArray[1] }
        // const b = { latitude: 52.402496, longitude: -1.510267 }
 
        // console.log("haversine");
        // console.log(haversine(a, b)) // 714504.18 (in meters)
            return res.status(200).json({"response" : getOffers})

        }
        catch (e) {
            console.log(e);
            throw new BadRequestError("Error in finding offers");
        }

});







export { router as offersNearYouRouter };

// location on, get offers from this location (location must be on). Offers from where shopper has been: get id of shop and shopper from user log.
// Sample Request Body.
//  {
// 	"userID”: 4, //required 
// 	“coords” : “0.1233,-0.1573”
// }

// Sample Response Body.
//  {
// 	“address” : “78 Queen Road”
// 	“phoneNumber : “05849108428”
// 	“shopName”: [“Tesco”,”Asda”,…]
// 	“offerName” : [“name1”, “name2”,…]
// 	“validity” : [“validity1”, “validity2”,…]
// 	“description” : [“description1”, “description2”,…]
// 	“buyItem” : [“2”, “0”,…]
// 	“freeItem” : [“1”, “0”,…]
// 	“percentageDiscount” : [“0”, “15”,…]
// }




