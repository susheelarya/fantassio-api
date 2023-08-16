import express, { Request, Response } from 'express';
import { OfferRepo } from '../../repos/offer-repo';
// import { dbFile } from '../../repos/db-file';

const router = express.Router();

router.get('/get-offer-information', async (req: Request, res: Response) => {

    // let userID = req.body.userID;       // userid is that of the shopper

    let offerID = req.body.offerID;         // offerid

    try {
        let getOfferInformation = OfferRepo.getOfferInformation(offerID);

        res.status(200).json({"response" : getOfferInformation})
    }
    catch (error) {
        console.log(error)
        res.status(400).json({"response" : "Error in getting offer information"})
    }

    


    




});







export { router as getOfferInformationRouter };