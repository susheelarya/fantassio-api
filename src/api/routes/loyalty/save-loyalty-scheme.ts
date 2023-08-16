import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { BadRequestError } from '../../../errors/bad-request-error';
import { userMaster, loyaltySchemeType, loyaltySchemeMaster, loyaltyInformation, loyaltySchemeShopMapping, stamps } from '../../../db/schema/user';
import { and, eq } from 'drizzle-orm';
import { body } from 'express-validator';
import exp from 'constants';


 const router = express.Router();


router.post('/save-loyalty-scheme', currentUser,
requireAuth,
[
    body('loyaltySchemeTypeID').isInt().withMessage('Please provide a loyaltySchemeTypeID that is an integer'),
    body('loyaltySchemeID').optional().isInt().withMessage('Please provide a loyaltySchemeID that is an integer'),
    body('loyaltySchemeName').optional().isString().withMessage('Please provide a loyaltySchemeName that is a string'),
    body('amountSpend').optional().isNumeric().withMessage('Please provide a amountSpend that is numeric'),
    body('pointsCollected').optional().isNumeric().withMessage('Please provide a pointsCollected that is numeric'),
    body('pointsRedeem').optional().isNumeric().withMessage('Please provide a pointsRedeem that is numeric'),
    body('amountFromPoints').optional().isNumeric().withMessage('Please provide a amountFromPoints that is numeric'),
    body('redeemFrequency').optional().isString().withMessage('Please provide a redeemFrequency that is a string'),
    body('stampsCollect').optional().isNumeric().withMessage('Please provide a stampsCollect that is numeric'),
    body('freeItems').optional().isNumeric().withMessage('Please provide a freeItems that is numeric'),
    body('monthsExpire').optional().isInt().withMessage('Please provide a monthsExpire that is numeric'),
    body('validFromDate').optional().isDate().withMessage('Please provide a validFromDate that is numeric'),
    body('predefined').isBoolean().withMessage('Please provide a predefined value that is a boolean'),
    body('createFlag').isBoolean().withMessage('Please provide a create flag. True if on the create-loyalty screen, False if on the modify-loyalty screen')
],
validateRequest, async (req: Request, res: Response) => {
    console.log('save-loyalty-scheme');

    let loyaltySchemeTypeID = req.body.loyaltySchemeTypeID;     // necessary for create.
    let loyaltySchemeID = req.body.loyaltySchemeID!;             // necessary for modify.
    let loyaltySchemeName = req.body.loyaltySchemeName!;
    let amountSpend = req.body.amountSpend!;
    let pointsCollected = req.body.pointsCollected!;
    let pointsRedeem = req.body.pointsRedeem!;
    let amountFromPoints = req.body.amountFromPoints!;
    let redeemFrequency = req.body.redeemFrequency!;
    let stampsCollect = req.body.stampsCollect!;
    let freeItems = req.body.freeItems!;
    let expiry = req.body.monthsExpire!;
    let validity = req.body.validFromDate!;
    let predefined = req.body.predefined;           // necessary either way
    let createFlag = req.body.createFlag;           // necessary either way.

    const { id } = req.currentUser!;
    let userID = id;

    const db = await dbConnect();
    
    const userCheck = await db.select().from(userMaster).where(eq(userMaster.userid, Number(userID)));

    if (userCheck.length == 0) {
        throw new BadRequestError('UserID not found');
    }

    // loyalty scheme type id check : is it valid?
    
    // if predefined, insert into loyalty scheme shop mapping. Check if ids match, if offerids have predefined offers.
    // if not predefined, insert into master and mapping.


    let loyaltySchemeTypeIDList = await db.select().from(loyaltySchemeType).where(eq(loyaltySchemeType.loyaltyschemetypeid, loyaltySchemeTypeID))

    if (loyaltySchemeTypeIDList.length == 0) {
        throw new BadRequestError('loyaltySchemeTypeID not found');
    }


    if (createFlag == true) {
        // save. Create. Need loyaltytypeid and loyaltyid for predefined true, Need none of the above for predefined false.
        try {

            if (predefined == true) {
                if (loyaltySchemeID == null) {
                    throw new BadRequestError('Need loyaltySchemeID with predefined loyalty scheme');
                }
        //         select loyaltyschemeid from loyalty_scheme_master where loyaltyschemetypeid = $1 and loyaltyschemeid = $2;',
        //   [loyaltySchemeTypeID, loyaltySchemeID]
                let validateLoyaltyID = await db.select({loyaltyschemeid: loyaltySchemeMaster.loyaltyschemeid}).from(loyaltySchemeMaster).where(and(eq(loyaltySchemeMaster.loyaltyschemetypeid, loyaltySchemeTypeID), eq(loyaltySchemeMaster.loyaltyschemeid, loyaltySchemeID)));
                if (validateLoyaltyID.length == 0) {
                    throw new BadRequestError('loyaltySchemeID and loyaltySchemeTypeID do not match');
                }
                let insertUserLoyaltyMapping = await db.insert(loyaltySchemeShopMapping).values({useridshop: Number(userID), loyaltyschemeid: loyaltySchemeID});
            }
        //     insert into loyalty_scheme_shop_mapping (useridshop, loyaltyschemeid) values ($1, $2);',
        //   [userID, loyaltySchemeID
            else if (predefined == false) {
                // insert into loyalty_scheme_master (loyaltyschemetypeid, moneyforpoints, pointsfrommoney, pointstoredeem, moneyfrompoints, redeemfrequency, predefined, stampstocollect, freeitems, expiremonths, validfromdate, loyaltyschemename, expireflag) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning loyaltyschemeid
                
                await db.transaction(async (tx) => {
                    let insertLoyalty: {insertedID: Number}[] = await tx.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: loyaltySchemeTypeID, moneyforpoints: amountSpend, pointsfrommoney: pointsCollected, pointstoredeem: pointsRedeem,
                        moneyfrompoints: amountFromPoints, redeemfrequency: redeemFrequency, predefined: predefined, stampstocollect: stampsCollect, freeitems: freeItems, expiremonths: expiry, validfromdate: validity, loyaltyschemename: loyaltySchemeName, expireflag: false}).returning({insertedID: loyaltySchemeMaster.loyaltyschemeid});
                        console.log(insertLoyalty);
                    let insertUserLoyaltyMapping = await tx.insert(loyaltySchemeShopMapping).values({useridshop: Number(userID), loyaltyschemeid: Number(insertLoyalty[0].insertedID)});
                });
                
                
    
            } 
            else {
                throw new BadRequestError('Predefined needs to be boolean');
                }
            }
        catch (error) {
            console.log(error)
            throw new BadRequestError('Error saving loyalty scheme');
            }

    }

    if (createFlag == false) {
        // modify. We absolutely need the loyalty scheme id and predefined, everything else optional. Check date if given. Has to be after today.
        try {
            if (typeof validity != 'undefined' && validity != null) {
                const nowObj = new Date();
                let dateValidity = new Date(validity);
                let currentDate = nowObj.getDate();
                console.log(nowObj)
                console.log(dateValidity)
                if (dateValidity < nowObj) {
                    throw new BadRequestError("Date needs to be future date.");
                }
            }
            if (predefined == true) {
                // the only way that you can edit a predefined scheme is to unsubscribe.
                // Delete at that date. End of day operation.

                // let removeScheme = await db.delete(loyaltySchemeShopMapping).where(eq(loyaltySchemeShopMapping.loyaltyschemeid, loyaltySchemeID));
            }
            else {
                let predefinedUpdate = await db.update(loyaltySchemeMaster).set({loyaltyschemename : loyaltySchemeName, moneyforpoints: amountSpend, 
                pointsfrommoney: pointsCollected, pointstoredeem: pointsRedeem, moneyfrompoints: amountFromPoints, redeemfrequency: redeemFrequency,
            stampstocollect: stampsCollect, freeitems: freeItems, expiremonths: expiry, validfromdate: validity}).where(eq(loyaltySchemeMaster.loyaltyschemeid, loyaltySchemeID));
            }

        }
        catch (error) {
            console.log(error)
            throw new BadRequestError("Unable to modify loyalty scheme.")
        }
    }
 
    



    return res.status(200).json({"response" : "success"});



});

export { router as saveLoyaltyRouter };