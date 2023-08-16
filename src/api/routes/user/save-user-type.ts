import express, { Request, Response } from 'express';
import { UserRepo } from '../../repos/user-repo';


const router = express.Router();
// save merchant/shopper. usertypetable needed? 

// This will be slightly different for Shopper and Shopkeeper. Business, we need a logo, proper address, subscription schemes, type of business (Pub/Retail/Coffee Shop), number of cashier tills and some more relevant information.

// For Shoppers, simply location and their interests is good enough.


// /get-profile
// Required : userID, location, userType
// Optional : if M : logo, nameOfBusiness, shopType, cashierTills
// Optional Parameters : will come blank if option not fulfilled. 

router.post('/save-user-type', async (req: Request, res: Response) => {
    let userID = req.body.userID;
    if (isNaN(userID) == true) {
        return res.status(400).json({"response": "userID not valid"}) 
    }
    let userType = req.body.userType;
    const saveUserType  = await UserRepo.updateUserType(userID, userType);
    res.status(200).json({"response" : "Success"});
});








export { router as saveUserTypeRouter };