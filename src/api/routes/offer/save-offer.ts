

 import express, { Request, Response } from 'express';
 import { pgClient } from '../../pgClient';
 import { OfferRepo } from '../../repos/offer-repo';
 import { UserRepo } from '../../repos/user-repo';
 import { dbFile } from '../../repos/db-file';

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



    router.post('/save-offer', async (req: Request, res: Response) => {
        console.log('save-offer');
//     // let fieldList = ["Name", "Validity", "# offers available", "First Come First Serve", "Drop Virtual Object", "Upload Picture", "# items to buy", 
//     // "% Discount", "Cash Discount", "Minimum Spend", "Product to Buy", "Free Product", "Product"];
     let userID = req.body.userID;      // necessary
     let offerTypeID = req.body.offerTypeID;    // necessary
     let offerID = req.body.offerID!;
     let offerName = req.body.offerName!;
     let numberItemsToBuy = req.body.itemsBuy!;
     let itemsFree = req.body.itemsFree!;
     let percentageDiscount = req.body.percentageDiscount!;
    let cashDiscount = req.body.cashDiscount!;
     let minSpend = req.body.minSpend!;
    let offerPicture = req.body.offerPicture!;
     let validity = req.body.validity!;
    //  let numberOffers = req.body.numberOffers!;
    //  let fcfs = req.body.fcfs!;
    // let virtualObject = req.body.virtualObject!;
    let predefined = req.body.predefined;   // necessary

    

    console.log("calling values ",offerName, numberItemsToBuy, itemsFree, percentageDiscount, cashDiscount,
    minSpend, offerPicture,validity, offerTypeID, predefined)

    const user = await UserRepo.getUserType(userID);
     if (typeof(user) == 'undefined' || user.length == 0) {
        return res.status(400).json({"response" : "User ID not found"})
    }
    else {
        var userType = user[0]["usertype"];
        console.log(userType)
    }

    let offerTypeIDList = await OfferRepo.getOfferTypeID(offerTypeID);

    if (offerTypeIDList.length == 0) {
        return res.status(400).json({"response" : "OfferTypeID not found."})
    }


    

    try {
        // if predefined, insert mapping with the offerid provided. If not predefined, insert offer with offertypeid provided, return the offerid and insert into mapping.
        
        if (predefined == true) {
            if (offerID == null) {
                return res.status(400).json({"response" : "Need offerID with predefined offer."})
            }
            let validateOfferID = await OfferRepo.validateOfferID(offerTypeID, offerID);
            if (validateOfferID.length == 0) {
                return res.status(400).json({"response" : "OfferID and OfferTypeID do not match."})
            }
            // select offerid where offertypeid = offertypeid;
            // if null then report error.
            let insertUserOfferMapping = await OfferRepo.insertUserOfferMapping(userID, offerID);
        }
        else if (predefined == false) {
            let insertOffer = await OfferRepo.insertOfferMaster(offerName, numberItemsToBuy, itemsFree, percentageDiscount, cashDiscount,
         minSpend, offerPicture, validity, offerTypeID, predefined);
         let insertUserOfferMapping = await OfferRepo.insertUserOfferMapping(userID, insertOffer[0]['offerid']); 
        }
        else {
            return res.status(400).json({"response" : "Predefined needs to be boolean." })
        }
        
        
        
       
        // const offerID = insertOffer[0]['offerid'];

        // console.log(offerID);
    
        // console.log(userID);
    
        // let insertUserOfferMapping = await OfferRepo.insertUserOfferMapping(userID, offerID);
        }
    catch (error) {
        console.log(error)
        return res.status(400).json({"response" : "Error saving offer."})

        }



    return res.status(200).json({"response" : "success"});






});


 export { router as saveOfferRouter };