const haversine = require("haversine-distance");


import express, { Request, Response } from 'express';
import { OfferRepo } from '../../repos/offer-repo';
import { UserRepo } from '../../repos/user-repo';
// import { dbFile } from '../../repos/db-file';

const router = express.Router();

router.post('/offers-near-you', async (req: Request, res: Response) => {
    // const a = { latitude: 37.8136, longitude: 144.9631 }
    // const b = { latitude: 33.8650, longitude: 151.2094 }
    
    // console.log(haversine(a, b)) // 714504.18 (in meters)

    // userid and coordinates. Find shops within that radius, and find get offer information and return everything.
    // NEED OFFER_MASTER API TO JUST RETURN OFFER_MASTER

    console.log('offers-near-you');

    const userID = req.body.userID;

    let coords = req.body.coords;

    let radius = req.body.radius;

    let page = req.body.page;

    let offset = ((10 * page)-10);

    // we want to return shop name, distance, userID of shop, logo of shop, how many offers that are still running the shop has.

    // check userid is a shopper. decode coordinates, find distance

    let validateUserID = await UserRepo.checkShopper(userID);

    console.log(validateUserID);

    if (validateUserID.length == 0) {
        return res.status(400).json({"response" : "User ID not found."})
    }

    if (validateUserID[0]['usertype'] != 'S') {
        return res.status(400).json({"response" : "User is not a shopper."})
    }

    if (typeof(coords) !== 'string') {
        return res.status(400).json({"response" : "Coordinates invalid. Not a string."})
      }
    
        // console.log(location);
        // console.log(location[0]);
    
        var locationArray = coords.split(",");
        console.log(locationArray);
    
        // update location in db
    
        const latlong = JSON.stringify(locationArray)
        .replace('[', '{')
        .replace(']', '}');

        console.log(locationArray[0]);
        try {
            let getOffers = await UserRepo.findOffers(locationArray[0], locationArray[1], radius, offset.toString());

            console.log(getOffers);
        // could be empty

        // const a = { latitude: locationArray[0], longitude: locationArray[1] }
        // const b = { latitude: 52.402496, longitude: -1.510267 }
 
        // console.log("haversine");
        // console.log(haversine(a, b)) // 714504.18 (in meters)
            return res.status(200).json({"response" : getOffers})

        }
        catch (e) {
            console.log(e)
            return res.status(400).json({"response" : "Error in finding offers."})
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




