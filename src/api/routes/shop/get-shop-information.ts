import express, { Request, Response } from 'express';
import { OfferRepo } from '../../repos/offer-repo';

const router = express.Router();

// post if you insert the stuff from db file, otherwise GET. also saves user type.
router.post('/get-shop-information', async (req: Request, res: Response) => {
  console.log('get-shop-information');
  let userIDShop = req.body.userID;
  try {
    let getShopTypes = await OfferRepo.getOfferShop(userIDShop);
    let addressNumbers = await OfferRepo.getAddressNumbers(userIDShop);
    res
      .status(200)
      .json({ response: getShopTypes, shopInformation: addressNumbers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ response: 'Error in retrieving information.' });
  }
});

export { router as getShopInformationRouter };
