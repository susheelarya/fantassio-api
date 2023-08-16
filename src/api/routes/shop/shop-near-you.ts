import express, { Request, Response } from 'express';
import { OfferRepo } from '../../repos/offer-repo';
import { UserRepo } from '../../repos/user-repo';

const haversine = require("haversine-distance");

const router = express.Router();




// Sample Request Body.
//  {
// 	"userID”: 4, //required
// 	“coords”: “0.19028,-1.183491” //required
// 	“radius”: “10” //required. Radius is in miles.
	
// }

// Sample Response Body.
//  {
// 	“shop” : [“shop1 name ”, “shop2 name ”..]
// 	“locationText” : [“3 miles away”, “5 miles away”…]
// 	“userID”: [“6”, 7”, …] // userID of shop.
// 	“logo”: [“logo of shop1”, “logo shop 2”…]
// }



router.post('/shop-near-you', async (req: Request, res: Response) => {
    let userID = req.body.userID;
    let coords = req.body.coords;
    let radius = req.body.radius;
    let page = req.body.page;       // page 1 means offset = 0, page 2 means offset = 10, page 3 means offset = 20
    // let kmRadius = radius * 1.609344;
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
            let getShopLocation = await UserRepo.findShops(locationArray[0], locationArray[1], radius, offset.toString());

            console.log(getShopLocation);
        // could be empty

        // const a = { latitude: locationArray[0], longitude: locationArray[1] }
        // const b = { latitude: 52.402496, longitude: -1.510267 }
 
        // console.log("haversine");
        // console.log(haversine(a, b)) // 714504.18 (in meters)
            return res.status(200).json({"response" : getShopLocation})

        }
        catch (e) {
            console.log(e)
            return res.status(400).json({"response" : "Error in finding shops."})
        }
        


    // {
    //     “shop” : [“shop1 name ”, “shop2 name ”..]
    //     “locationText” : [“3 miles away”, “5 miles away”…]
    //     “userID”: [“6”, 7”, …] // userID of shop.
    //     “logo”: [“logo of shop1”, “logo shop 2”…]
    //     “offerCount”: “…”
    // }
    


});
export { router as shopNearYouRouter };