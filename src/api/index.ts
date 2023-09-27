import 'express-async-errors';

import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';

import { newUserRouter } from './routes/user/new-user';
import { getAllUsersRouter } from './routes/user/get-all-users';
import { getUserRouter } from './routes/user/get-user';
import { getProfileRouter } from './routes/user/get-profile';
import { saveProfileRouter } from './routes/user/save-profile';
import { saveUserTypeRouter } from './routes/user/save-user-type';
import { generateOTPRouter } from './routes/auth/generate-otp';
import { registerapgoRouter } from './routes/auth/register-ap-go';
import { validateOTPRouter } from './routes/auth/validate-otp';

/*
import { locationCoordRouter } from './routes/location/get-location-by-coords';
import { postCoordRouter } from './routes/location/get-location-by-post';
import { merchantScreenRouter } from './routes/merchant/get-merchant-screen';
import { getMerchantRouter } from './routes/merchant/get-merchant-details';
import { saveMerchantRouter } from './routes/merchant/save-merchant-details';
import { offersNearYouRouter } from './routes/offer/offers-near-you';
import { createOfferRouter } from './routes/offer/create-offer';
import { saveOfferRouter } from './routes/offer/save-offer';
import { getOfferInformationRouter } from './routes/offer/get-offer-information';
import { loadOfferRouter } from './routes/offer/load-offers';
import { viewOfferRouter } from './routes/offer/view-offer';
import { createLoyaltyRouter } from './routes/loyalty/create-loyalty-scheme';
import { saveLoyaltyRouter } from './routes/loyalty/save-loyalty-scheme';
import { viewLoyaltyRouter } from './routes/loyalty/view-loyalty-scheme';
import { loadLoyaltyRouter } from './routes/loyalty/load-loyalty-scheme';
import { getShopInformationRouter } from './routes/shop/get-shop-information';
import { shopNearYouRouter } from './routes/shop/shop-near-you';
*/
import { getCurrentUserRouter } from './routes/user/current-user';

export const userRoute = '/user';
export const authRoute = '/auth';
export const locationRoute = '/location';
export const merchantRoute = '/merchant';
export const offerRoute = '/offer';
export const shopRoute = '/shop';
export const loyaltyRoute = '/loyalty';

const router = express.Router();
/*
// NOTE: User Routes
// router.use(userRoute, newUserRouter);
router.use(userRoute, getAllUsersRouter);
router.use(userRoute, getCurrentUserRouter);

// router.use(userRoute, getUserRouter);
// router.use(userRoute, getProfileRouter);
router.use(userRoute, saveProfileRouter);
// router.use(userRoute, saveUserTypeRouter);
*/
// NOTE: Auth Routes
router.use(authRoute, generateOTPRouter);
router.use(authRoute, registerapgoRouter);
router.use(authRoute, validateOTPRouter);

router.use(userRoute, getProfileRouter);

// NOTE: Location Routes
// router.use(locationRoute, locationCoordRouter);
// router.use(locationRoute, postCoordRouter);

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

export default router;
