
import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { parametersTable, userMaster, userOfferMapping } from '../../../db/schema/user';
import { offerMaster, offerType } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import moment from 'moment-timezone';

const router = express.Router();


    // Sample Request Body.
//  {
// 	"userID”: 4, //required
	
// }

// Sample Response Body.
//  {
// 	“offers” : “[“buy x get y free on same item”, “buy x get y free on different item”, “buy x get y% discount on same item”, “buy x get y% discount on different item”, “buy x get £y off on same item”, “buy x get £y off on different item”, “minimum spend £x get £y off on total”]”
// 	“fields” : “[“Name”, “Validity”, “# offers available”, “First Come First Serve”, “Drop Virtual Object”, “Upload Picture”, “# items to buy”, “# free items”, “% Discount”, “Cash Discount”, “Minimum Spend”, “Product to Buy”, “Free Product”, “Product”]”
// }


router.post('/create-offer', currentUser,
requireAuth,
[
    body('copyFlag').isBoolean().withMessage("Please make copyFlag as a boolean."),
    body('mapID').optional().isInt().withMessage("Please provide mapID as an integer."),
    body('offerID').optional().isInt().withMessage("Please provide offerID as an integer."),
],
validateRequest, async (req: Request, res: Response) => {

    console.log("create-offer");

    const { id } = req.currentUser!;
    let userID = id;
    let copyFlag = req.body.copyFlag;
    let mapID = req.body.mapID;
    let offerID = req.body.offerID;
    //let UserType = req.body.UserType;

    // if (isNaN(userID) == true) {
    //     return res.status(400).json({"response": "userID not valid"}) 
    // }

    const db = await dbConnect();

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

      //console.log(UserType);
     //var cashierTills = req.body.cashierTills;
    if (userType == 'M' )  {
        // let getOfferTypes = await OfferRepo.getAllOfferTypes();

        // console.log(getOfferTypes)
        // SELECT * from offer_master where predefined = true/


// return now + 15 minutes as a date.
        // return offer type name.
        if (copyFlag == false) {

            let getPredefinedOffers = await db.select({offername: offerMaster.description, offerid: offerMaster.offerid, offertypeid: offerMaster.offertypeid, buyitem: offerMaster.buyitem, freeitem: offerMaster.freeitem,
            percentagediscount: offerMaster.percentagediscount, cashdiscount: offerMaster.cashdiscount, minspend: offerMaster.minspend, offertype: offerType.description}).from(offerMaster).innerJoin(offerType, and(eq(offerMaster.predefined, true), eq(offerType.offertypeid, offerMaster.offertypeid)));
            
            const moment = require('moment');
            var timezone = require('moment-timezone');

            
            
            let validFromMoment = timezone().tz('Europe/London');
            console.log(validFromMoment)
            var newDateObj = validFromMoment.add(15, 'minutes').format().toString();
            console.log(newDateObj)
            let newDateTime = newDateObj
            
            let getOfferTypes = await db.select().from(offerType);
            
            var returnList: any[] = []
            
            for (let i = 0; i< getOfferTypes.length; i++ ) {
                var fieldsList: any[] = []
                let selectFields = await db.select({paramvalue: parametersTable.paramvalue})
                .from(parametersTable)
                .where(eq(parametersTable.parameter , String(getOfferTypes[i].description)));

                for (let j = 0; j < selectFields.length; j++) {
                    fieldsList.push(selectFields[j].paramvalue)
                }
                
                returnList.push(
                    {
                        offerType: getOfferTypes[i].description,
                        offerTypeID: getOfferTypes[i].offertypeid,
                        fields: fieldsList
                    }
                )
            }


            
            // for (let j = 0; j<getOfferTypes.length; j++) {
            //     if (getOfferTypes[j]['description'] == "Buy One Get One Free") { 
            //         total_response.push([{"Offer Type" : getOfferTypes[j]['description'], "Field List" : ["Name", "Validity", "While Stocks Last", "Number of Items Free"] }])}
            //     else if (getOfferTypes[j]['description'] == "Percentage Discount") {
            //         total_response.push([{"Offer Type" : getOfferTypes[j]['description'], "Field List" : ["Name", "Validity", "Percent Off", "While Stocks Last"] }])
            //     }
            //     else if (getOfferTypes[j]['description'] == "Cash Discount") {
            //         total_response.push([{"Offer Type" : getOfferTypes[j]['description'], "Field List" : ["Name", "Validity", "Pounds Off", "While Stocks Last"] }])
            //     }
            //     else if (getOfferTypes[j]['description'] == "Minimum Spend") {
            //         total_response.push([{"Offer Type" : getOfferTypes[j]['description'], "Field List" : ["Name", "Validity", "Minimum Spend",  "While Stocks Last"] }])
            //     }
            //     else if (getOfferTypes[j]['description'] == "Buy One Get One Free") {
            //         total_response.push([{"Offer Type" : getOfferTypes[j]['description'], "Field List" : ["Name", "Validity", "While Stocks Last"] }])
            //     }
            //     else if (getOfferTypes[j]['description'] == "Buy One Get One Free") {
            //         total_response.push([{"Offer Type" : getOfferTypes[j]['description'], "Field List" : ["Name", "Validity", "While Stocks Last"] }])
            //     }

            // }
            
            


            // var total_offers : any[] = []
            // for (let i = 0; i < getPredefinedOffers.length; i++) {
            //     if (getPredefinedOffers[i]["offertypeid"])
            //     total_offers.push({"Offer Name": getPredefinedOffers[i]["description"], "OfferID": getPredefinedOffers[i]["offerid"], "OfferTypeID" : getPredefinedOffers[i]["offertypeid"], "Number of Items Buying": getPredefinedOffers[i]["buyitem"], "Number of Items Free": getPredefinedOffers[i]["freeitem"], "% Discount": getPredefinedOffers[i]["percentagediscount"], "Cash Discount": getPredefinedOffers[i]["cashdiscount"], "Minimum Spend": getPredefinedOffers[i]["minspend"]})
            // }
            res.status(200).json({"response" : getPredefinedOffers, "firstTime": newDateTime, "fieldsList": returnList});
        }
        else {
            // copy flag is true. Get all details of offer and give it
            let loadOffers = await db.select({offertypeid: offerMaster.offertypeid, offerid: offerMaster.offerid,
                description: offerMaster.description, buyitem: offerMaster.buyitem, freeitem: offerMaster.freeitem, percentagediscount: offerMaster.percentagediscount,
                cashdiscount: offerMaster.cashdiscount, minspend: offerMaster.minspend, predefined: offerMaster.predefined, mapid: userOfferMapping.mapid,
                validfromdate: userOfferMapping.validfromdate, validtodate: userOfferMapping.validtodate, validfromtime: userOfferMapping.validfromtime, validtotime: userOfferMapping.validtotime,
                expireflag: userOfferMapping.expireflag, whilestockslast: userOfferMapping.whilestockslast, offerinformation: userOfferMapping.offerinformation
                }).from(userOfferMapping).innerJoin(offerMaster, and(eq(userOfferMapping.userid, Number(userID)), eq(userOfferMapping.offerid, offerID), eq(offerMaster.offerid, userOfferMapping.offerid), eq(userOfferMapping.mapid, mapID)));
            
            if (typeof(loadOffers)=='undefined' || loadOffers.length == 0) {
                return res.status(200).json({"response" : "Offer details not found."})
            }
                
            return res.status(200).json({"response" : loadOffers});
        }


    

    // let fieldList = ["Name", "Validity", "Description", "First Come First Serve", "Drop Virtual Object", "Upload Picture", "# items to buy","# items free", "% Discount", "Cash Discount", "Minimum Spend", 
    // "Product to Buy", "Product to Sell"];
    

    // {"response" : [{"Offer Name", "OfferID", "Buy Item", "Free Item", "% Discount", "Cash Discount", "Minimum Spend", "Validity", "Fields"}]}


    // offertypeid, offerid,description,buyitem,freeitem,percentagediscount,cashdiscount,minspend,validity 





    //let getOfferTypes = await OfferRepo.getAllOfferTypes();

    // console.log(getOfferTypes);
    // const offerTypeList : string[] = [];
    // const offerTypeIDList :Int16Array[] = [];

    // for (let i = 0; i < getOfferTypes.length; i++) {
    //     offerTypeList.push(getOfferTypes[i]["description"]);
    //     offerTypeIDList.push(getOfferTypes[i]["offertypeid"]);
    // }
    // console.log(offerTypeList);
    // console.log(offerTypeIDList);
    
    // res.status(200).json({"offers" : offerTypeList, offerTypeIDList});



    }
    else {
        res.status(400).json({"response" : "User is not a merchant."})
    }
});



export { router as createOfferRouter };

