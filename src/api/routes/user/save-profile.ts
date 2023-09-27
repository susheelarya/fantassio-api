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
import { userMaster } from '../../../db/schema';

import { eq,sql } from 'drizzle-orm';
import { body } from 'express-validator';

router.post(
  '/save-profile',
  currentUser,
  requireAuth,
  [
    body('logo')
      .optional()
      .isString()
      .withMessage('Please provide a logo that is a string'),
    body('nameOfBusiness')
      .optional()
      .isString()
      .withMessage('Please provide a nameOfBusiness that is a string'),
    body('postcode')
      .optional()
      .isString()
      .withMessage('Please provide a postcode that is a string'),
    body('shopType')
      .optional()
      .isString()
      .withMessage('Please provide a shopType that is string'),
    body('cashierTills')
      .optional()
      .isInt()
      .withMessage('Please provide a cashierTills that is integer'),
    body('interests')
      .optional()
      .isString()
      .withMessage('Please provide a interests that is string'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.currentUser!;
    let userID = id;

    let logo = req.body.logo!;
    let businessName = req.body.nameOfBusiness!;
    let postcode = req.body.postcode!;
    let aboutInfo = req.body.about!; // required for merchant.
   

    const db = await dbConnect();
    
    
    if (
      logo != 'undefined' &&
      businessName != 'undefined' &&
      postcode != 'undefined' &&
      aboutInfo != 'undefined'
    ) {
      try {
        const updateProfile = await db
          .update(userMaster)
          .set({
            userImageName: logo,
          })
          .where(eq(userMaster.userId, Number(userID)));
        // const updateProfile = await UserRepo.updateProfileMerchant(userID, logo, businessName, shopTypeID, cashierTills, postcode);
      } catch (error) {
        console.log(error);
        throw new BadRequestError('Error in updating profile');
      }
    }
    // UPDATE user_master SET interests = $1 WHERE userid = $2',
    //   [interests, userID]
    // )!;
  
    return res.status(200).json({ response: 'Success' });
  }
);

export { router as saveProfileRouter };
