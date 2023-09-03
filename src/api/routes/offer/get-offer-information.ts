import express, { Request, Response } from 'express';
import { BadRequestError } from '../../../errors/bad-request-error';
// import { dbFile } from '../../repos/db-file';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { offerMaster, userMaster } from '../../../db/schema';
import { eq } from 'drizzle-orm';


const router = express.Router();

router.get('/get-offer-information', currentUser,
requireAuth,
[
    body('offerID').isInt().withMessage("Please make offerID an integer.")
],
validateRequest, async (req: Request, res: Response) => {

    // let userID = req.body.userID;       // userid is that of the shopper

    let offerID = req.body.offerID;         // offerid

    const db = await dbConnect();

    try {
    //     SELECT * FROM offer_master where offerid = $1;`,
    //   [offerID]
        let getOfferInformation = db.select().from(offerMaster).where(eq(offerMaster.offerid, offerID))

        res.status(200).json({"response" : getOfferInformation})
    }
    catch (error) {
        console.log(error);
        throw new BadRequestError("Error in getting offer information");
    }

    


    




});







export { router as getOfferInformationRouter };