// Business, we need a logo, proper address, subscription schemes, type of business (Pub/Retail/Coffee Shop), number of cashier tills

import express, { Request, Response } from 'express';
import { UserRepo } from '../../repos/user-repo';


const router = express.Router();


router.post('/get-profile', async (req: Request, res: Response) => {
    console.log('get-profile');
    const userID = req.body.userID;

    if (isNaN(userID) == true) {
        return res.status(400).json({"response": "userID not valid"}) 
    }

    const userTypeResponse = await UserRepo.getUserType(userID);
    console.log(userTypeResponse)
    if (typeof(userTypeResponse) == 'undefined' || userTypeResponse.length == 0) {
        return res.status(400).json({"response" : "User ID not found"})
    }
    else {
        var userType = userTypeResponse[0]["usertype"];

    }
    


    if (userType == "M") {
        // get all of the above. 
        // get shopType from shopTypeID

        const merchantProfile = await UserRepo.getMerchantProfile(userID);

        var shopTypeID = merchantProfile[0]["shoptypeid"];
        console.log(shopTypeID);
        const shopType = await UserRepo.getShopType(shopTypeID);


        res.status(200).json({
            "Postcode": merchantProfile[0]["postcode"], 
            "Address" : merchantProfile[0]["address1"], 
            "Logo" : merchantProfile[0]["businesslogo"],
            "Name Of Business" : merchantProfile[0]["businessname"],
            "Type Of Shop" : shopType[0]["description"],
            "Number of Tills" : merchantProfile[0]["cashiertills"],
        });

        // select postcode, address, logo, nameofbusiness, shoptype, cashiertills where userid - UPDATE YourTable SET columnName = null WHERE YourCondition for no postcode.
        // res.status(200).json({"fieldList" : ["location, logo, nameOfBusiness, shopType, cashierTills"]});
    }
    else if (userType == "S") {
        const shopperProfile = await UserRepo.getShopperProfile(userID);
        res.status(200).json({
            "Postcode": shopperProfile[0]["postcode"], 
            "Address" : shopperProfile[0]["address1"],
            "Interests" : shopperProfile[0]["interests"]});
    }
    else {
        res.status(400).json({"response" : "incorrect user type"})
    }
    
});



export { router as getProfileRouter };