
import express, { Request, Response } from 'express';
import { OfferRepo } from '../../repos/offer-repo';
import { dbFile } from '../../repos/db-file';
import { UserRepo } from '../../repos/user-repo';
import { MerchantRepo } from '../../repos/merchant-repo';

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


router.post('/create-offer', async (req: Request, res: Response) => {

    console.log("create-offer");

    let userID = req.body.userID;
    //let UserType = req.body.UserType;

    if (isNaN(userID) == true) {
        return res.status(400).json({"response": "userID not valid"}) 
    }


 
    const userid = (userID);
    const user = await UserRepo.getUserType(userID);
     if (typeof(user) == 'undefined' || user.length == 0) {
        return res.status(400).json({"response" : "User ID not found"})
    }
    else {
        var userType = user[0]["usertype"];
        console.log(userType)
    }
    

      //console.log(UserType);
     //var cashierTills = req.body.cashierTills;
    if (userType == 'M' )  {
        // let getOfferTypes = await OfferRepo.getAllOfferTypes();

        // console.log(getOfferTypes)

        let getPredefinedOffers = await OfferRepo.getPredefinedOffers();
        
        // let fieldList = ["Name", "Validity", "Percent Off", "Pounds Off", "Number of Items Buying", "Number of Items Free", "Minimum Spend", "While Stocks Last"];

        // let total_response = {"response" : ["Offer Type", "Field List"]}

        
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
        
        


        var total_offers : any[] = []
        for (let i = 0; i < getPredefinedOffers.length; i++) {
            if (getPredefinedOffers[i]["offertypeid"])
            total_offers.push({"Offer Name": getPredefinedOffers[i]["description"], "OfferID": getPredefinedOffers[i]["offerid"], "OfferTypeID" : getPredefinedOffers[i]["offertypeid"], "Number of Items Buying": getPredefinedOffers[i]["buyitem"], "Number of Items Free": getPredefinedOffers[i]["freeitem"], "% Discount": getPredefinedOffers[i]["percentagediscount"], "Cash Discount": getPredefinedOffers[i]["cashdiscount"], "Minimum Spend": getPredefinedOffers[i]["minspend"], "Validity": getPredefinedOffers[i]["validity"]})
        }
        res.status(200).json({"response" : total_offers})

    

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

