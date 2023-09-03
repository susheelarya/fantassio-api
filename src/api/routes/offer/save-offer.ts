

 import express, { Request, Response } from 'express';
 import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { BadRequestError } from '../../../errors/bad-request-error';
import { userMaster, offerType, offerMaster, userOfferMapping } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';
import { body } from 'express-validator';


 const router = express.Router();


// // { Request
// // 	“Product” : “milk”
// // 	““Drop Virtual Object” : “N”
// // 	“Upload Picture” : “link”
// // }
// //   {
// // 	“Product To Buy” : “milk”
// // “Product Free” : “ball”
// // 	““Drop Virtual Object” : “N”
// // 	“Upload Picture to Buy” : “link”
// // 	“Upload Picture Free” : “link”
// // }

// // Sample Request Body 3.
// //   {
// // 	“Product” : “milk”
// // 	“% Discount” : “10”
// // 	““Drop Virtual Object” : “N”
// // 	“Upload Picture” : “link”
// // }

// // Sample Request Body 4.
// //    {
// // 	“Product To Buy” : “milk”
// // “Product Discounted” : “ball”
// // 	““Drop Virtual Object” : “N”
// // 	“Upload Picture to Buy” : “link”
// // 	“Upload Picture Discounted” : “link”
// // 	“% Discount” : “10”
// // }

// // Sample Request Body 5. 
// //  {
// // 	“Product To Buy” : “milk”
// // 	“Cash Discount” : “5”
// // 	“Drop Virtual Object” : “N”
// // 	“Upload Picture” : “link”
	
// // }

// // Sample Request Body 6.
// //   {
// // 	"userID”: 4, //required
// // 	“Name” : “First Offer”
// // 	“Validity” : “10/06/22”
// // 	“# offers available” : “19”	// only if FCFS is “Y”
// // 	“First Come First Serve” : “Y”
// // 	“# items to buy” : “5”
// // “Product To Buy” : “milk”
// // “Product Discounted” : “ball”
// // 	“Cash Discount” : “5”
// // 	“Drop Virtual Object” : “N”
// // 	“Upload Picture to Buy” : “link”
// // “Upload Picture to Discount” : “link”
	
// // }

// // Sample Request Body 7.
// //    {
// // 	"userID”: 4, //required
// // 	“Name” : “First Offer”
// // 	“Validity” : “10/06/22”
// // 	“# offers available” : “19”	// only if FCFS is “Y”
// // 	“First Come First Serve” : “Y”
// // 	“Minimum Spend” : “100”
// // 	“Cash Discount” : “5”
// // 	“Drop Virtual Object” : “N”
// // 	“Upload Picture to Buy” : “link”
// // “Upload Picture to Discount” : “link”
	
// // }

/* { 
 "userID" : 19,
  "offerTypeID" : 1,
  "offerName" : "Haldiram Bhujiya",
  "numberItemsToBuy" : 1,
  "itemsFree" : 1,
  "Validity" : "20/04/23",
  "fcfs" : "Y",
 "percentageDiscount" : "",
 "cashDiscount" : "",
"minSpend" : "",
 offerPicture : "",
"numberOffers" : 10,
 "virtualObject" : "N",
 "productToSell" : "",
 "productToBuy" : ""

 } */


// // Sample Request Body 8.
// //    {
// // 	"userID”: 4, //required
// // 	“Name” : “First Offer”
// // 	“Validity” : “10/06/22”
// // 	“# offers available” : “19”	// only if FCFS is “Y”
// // 	“First Come First Serve” : “Y”
// // 	“Minimum Spend” : “100”
// // 	“% Discount” : “5”
// // 	“Drop Virtual Object” : “N”
// // 	“Upload Picture to Buy” : “link”
// // “Upload Picture to Discount” : “link”
	
// // }



    router.post('/save-offer', currentUser,
    requireAuth,
    [
        body('offerTypeID').isInt().withMessage('Please provide a offerTypeID that is an integer'),
        body('offerID').optional().isInt().withMessage('Please provide a offerID that is an integer'),
        body('offerName').isString().withMessage('Please provide a offerName that is a string'),
        body('itemsBuy').optional().isInt().withMessage('Please provide a itemsBuy that is integer'),
        body('itemsFree').optional().isInt().withMessage('Please provide a itemsFree that is integer'),
        body('percentageDiscount').optional().isNumeric().withMessage('Please provide a percentageDiscount that is numeric'),
        body('cashDiscount').optional().isNumeric().withMessage('Please provide a cashDiscount that is numeric'),
        body('minSpend').optional().isNumeric().withMessage('Please provide a minSpend that is a numeric'),
        body('offerPicture').optional().isString().withMessage('Please provide a offerPicture that is string'),
        body('validFromDate').isDate().withMessage('Please provide a validfrom date'),
        body('predefined').isBoolean().withMessage('Please provide a predefined value that is a boolean'),
        body('validToDate').isDate().withMessage('Please provide a validto date'),
        body('validFromTime').isTime({hourFormat: 'hour24', mode: 'default'} ).withMessage('Please provide a validfrom time'),
        body('validToTime').isTime({hourFormat: 'hour24', mode: 'default'} ).withMessage('Please provide a validto time'),
        body('editFlag').isBoolean().withMessage("Please provide an edit flag"),
        body('deleteFlag').optional().isBoolean().withMessage("Please provide a delete flag that is a boolean"),
        body('mapID').optional().isInt().withMessage("Please provide a mapid that is an integer. Needed with edit."),
        body("whileStocksLast").optional().isBoolean().withMessage("Please send a while stocks last option which is a boolean."),
        body("offerInformation").optional().isString().withMessage("Please provide offer information that is a string.")
    ],
    validateRequest, async (req: Request, res: Response) => {
        console.log('save-offer');
//     // let fieldList = ["Name", "Validity", "# offers available", "First Come First Serve", "Drop Virtual Object", "Upload Picture", "# items to buy", 
//     // "% Discount", "Cash Discount", "Minimum Spend", "Product to Buy", "Free Product", "Product"];
     let offerTypeID = req.body.offerTypeID;    // necessary
     let offerID = req.body.offerID!;
     let offerName = req.body.offerName;
     let numberItemsToBuy = req.body.itemsBuy!;
     let itemsFree = req.body.itemsFree!;
     let percentageDiscount = req.body.percentageDiscount!;
    let cashDiscount = req.body.cashDiscount!;
     let minSpend = req.body.minSpend!;
    let offerPicture = req.body.offerPicture!;
     let validity = req.body.validFromDate;      // necessary
     let validToDate = req.body.validToDate;     // necessary
     let validFromTime = req.body.validFromTime;        // necessary 
     let validToTime = req.body.validToTime;        // necessary
    //  let numberOffers = req.body.numberOffers!;
    //  let fcfs = req.body.fcfs!;
    // let virtualObject = req.body.virtualObject!;
    let predefined = req.body.predefined;   // necessary
    let deleteFlag = req.body.deleteFlag!;  // only necessary when edit is true.
    let editFlag = req.body.editFlag;   // necessary
    let mapID = req.body.mapID!;
    let offerInformation = req.body.offerInformation!;
    let whileStocksLast = req.body.whileStocksLast!;

    const { id } = req.currentUser!;
    let userID = id;
    const db = await dbConnect();
        // VALIDATE THE TIME AS WELL.
    const nowObj = new Date();
    let dateValidity = new Date(validity);
    let currentDate = nowObj.getDate();
    console.log(nowObj);
    console.log(dateValidity);
    if (dateValidity < nowObj) {
        throw new BadRequestError("Date needs to be future date.");
    }
    let validFlag = false;
    if (dateValidity == nowObj) {
        validFlag = true;
    }
    

    

    console.log("calling values ",offerName, numberItemsToBuy, itemsFree, percentageDiscount, cashDiscount,
    minSpend, offerPicture,validity, offerTypeID, predefined)

    const userTypeCheck = await db.select({userTypeField: userMaster.usertype}).from(userMaster).where(eq(userMaster.userid, Number(userID)));

    let userTypeResult = userTypeCheck[0];
    console.log(userID); 

    if ((typeof userTypeResult == 'undefined') || (userTypeResult.userTypeField  == null)) {
        throw new BadRequestError('User Type for this user not found.');        
    }
    else {
        var userType = userTypeResult.userTypeField;
        console.log(userType); 
    }    

    let offerTypeIDList = await db.select().from(offerType).where(eq(offerType.offertypeid, offerTypeID));  

    if (offerTypeIDList.length == 0) {
        throw new BadRequestError("OfferTypeID not found");
    }

    // validto must be after validfrom, validto must be after now + 15 mins.
    const moment = require('moment');

    console.log("real")
    let validFromMoment = moment.utc(validity+' '+validFromTime);
    let validToMoment = moment.utc(validToDate+' '+validToTime);
    let validFrom = validFromMoment.toDate()
    let validTo = validToMoment.toDate()
    console.log(validFrom);
    console.log(validTo);


    if (validTo <= validFrom) {
        throw new BadRequestError("Valid To must be after Valid From")
    }

    var newDateObj = new Date(validFrom.getTime() + 15*60000);
    console.log(newDateObj);
   let newDateTime = newDateObj.toISOString().split('T')[1];

   console.log(newDateTime);

   if (validTo <= newDateObj) {
    throw new BadRequestError("Offer must last longer than 15 minutes.")
   }

   if (editFlag == false) {
    //whilestockslast, offerinformation
    if (predefined == true) {
        if (offerID == null) {
            throw new BadRequestError("Need offerID with predefined offer");
        }
        let validateOfferID = await db.select({offerid: offerMaster.offerid}).from(offerMaster).where(and(eq(offerMaster.offertypeid, offerTypeID), eq(offerMaster.offerid, offerID)));
        if (validateOfferID.length == 0) {
            throw new BadRequestError("OfferID and OfferTypeID do not match");
        }
        // select offerid where offertypeid = offertypeid;
        // if null then report error.
        let insertUserOfferMapping = await db.insert(userOfferMapping).values({userid: Number(userID), offerid: offerID, validfromdate: validity, validtodate: validToDate, validfromtime: validFromTime, validtotime: validToTime, whilestockslast: whileStocksLast, offerinformation: offerInformation, expireflag: false});
    }
    else if (predefined == false) {
        // custom offer.
        
            
        await db.transaction(async (tx) => {
            let insertOffer : {insertedID: Number}[] = await tx.insert(offerMaster).values({description: offerName, buyitem: numberItemsToBuy, freeitem: itemsFree,
            percentagediscount: percentageDiscount, cashdiscount: cashDiscount, minspend: minSpend, offertypeid: offerTypeID, offerpicture: offerPicture, predefined: predefined}).returning({insertedID: offerMaster.offerid});
            let insertUserOfferMapping = await tx.insert(userOfferMapping).values({userid: Number(userID), offerid: Number(insertOffer[0].insertedID), validfromdate: validity, validtodate: validToDate, validfromtime: validFromTime, validtotime: validToTime, whilestockslast: whileStocksLast, offerinformation: offerInformation, expireflag: false});
            });
    }
    else {
        throw new BadRequestError("Predefined needs to be boolean.")
    }
    
    
    
   
    // const offerID = insertOffer[0]['offerid'];

    // console.log(offerID);

    // console.log(userID);

    // let insertUserOfferMapping = await OfferRepo.insertUserOfferMapping(userID, offerID);
    
    


    return res.status(200).json({"response" : "success"});

   }
   else {
    // edit offer : If deleted, then set expired = true. Otherwise, update the mapping table with the valid to date/time. If not predefined then update the master table. 
    // need deleteflag, editflag.
    console.log(deleteFlag)
    if (typeof(deleteFlag) == "undefined") {
        throw new BadRequestError("delete flag needed when editing offer.")
    }

    //need mapid.

    if (typeof(mapID) == "undefined") {
        throw new BadRequestError("mapid needed when editing offer.")
    }



    if (deleteFlag == true) {
        let setExpired = await db.update(userOfferMapping).set({expireflag: true}).where(eq(userOfferMapping.mapid, mapID));

    }
    else {
        let updateMapping = await db.update(userOfferMapping).set({validtodate: validToDate, validtotime: validToTime}).where(eq(userOfferMapping.mapid, mapID));
    }

    return res.status(200).json({"response" : "success"});

   }



    

        // if predefined, insert mapping with the offerid provided. If not predefined, insert offer with offertypeid provided, return the offerid and insert into mapping.
        
        






});


 export { router as saveOfferRouter };