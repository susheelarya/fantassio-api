
import express, { Request, Response } from 'express';

const router = express.Router();
// save merchant/shopper. usertypetable needed? 

// This will be slightly different for Shopper and Shopkeeper. Business, we need a logo, proper address, subscription schemes, type of business (Pub/Retail/Coffee Shop), number of cashier tills and some more relevant information.

// For Shoppers, simply location and their interests is good enough.


// /get-profile
// Required : userID, location, userType
// Optional : if M : logo, nameOfBusiness, shopType, cashierTills
// Optional Parameters : will come blank if option not fulfilled. 
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { BadRequestError } from '../../../errors/bad-request-error';
import { userMaster, shopType } from '../../../db/schema/user';
import { and, eq } from 'drizzle-orm';
import { body } from 'express-validator';

router.post('/save-profile', currentUser,
requireAuth,
[
    body('logo').optional().isString().withMessage('Please provide a logo that is an integer'),
    body('nameOfBusiness').optional().isString().withMessage('Please provide a nameOfBusiness that is an integer'),
    body('postcode').optional().isString().withMessage('Please provide a postcode that is a string'),
    body('shopType').optional().isString().withMessage('Please provide a shopType that is numeric'),
    body('cashierTills').optional().isInt().withMessage('Please provide a cashierTills that is numeric'),
    body('interests').optional().isString().withMessage('Please provide a interests that is numeric'),
],
validateRequest, async (req: Request, res: Response) => {
    const { id } = req.currentUser!;
    let userID = id;

    let logo = req.body.logo!;
    let businessName = req.body.nameOfBusiness!;
    let postcode = req.body.postcode!;
    let aboutInfo = req.body.about!;       // required for merchant.
    let cashierTills = req.body.cashierTills!;
    let interests = req.body.interests!;

    const db = await dbConnect();
    const userTypeCheck = await db.select({userTypeField: userMaster.usertype}).from(userMaster).where(eq(userMaster.userid, Number(userID)));



    
    if (typeof(userTypeCheck) == 'undefined' || userTypeCheck.length == 0 || userTypeCheck == null) {
        throw new BadRequestError("User Type not found");
    }
    var userType = userTypeCheck[0].userTypeField;

    console.log(userType);

    if ((userType == 'M') && (logo != 'undefined') && (businessName != 'undefined') && (postcode != 'undefined') && (aboutInfo != 'undefined') && (cashierTills != 'undefined')) {
        try {
            const updateProfile = await db.update(userMaster).set({businessname: businessName, businesslogo: logo, about: aboutInfo, cashiertills: cashierTills, postcode: postcode}).where(eq(userMaster.userid, Number(userID)));
            // const updateProfile = await UserRepo.updateProfileMerchant(userID, logo, businessName, shopTypeID, cashierTills, postcode);
        }
        catch (error) {
            console.log(error)
            throw new BadRequestError("Error in updating profile")
        }
    }
    // UPDATE user_master SET interests = $1 WHERE userid = $2',
    //   [interests, userID]
    // )!;
    
    else if ((userType == "S") && (interests != 'undefined')) {
        try {
            const updateProfile = await db.update(userMaster).set({interests: interests}).where(eq(userMaster.userid, Number(userID)));
        }
        catch (error) {
            console.log(error)
            throw new BadRequestError("Error in updating profile");
        }
    }
    else {
        throw new BadRequestError("Invalid fields");
    }

    return res.status(200).json({"response" : "Success"})
});





export { router as saveProfileRouter };