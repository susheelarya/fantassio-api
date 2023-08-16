import express, { Request, Response } from 'express';
//import { dbFile } from '../../repos/db-file';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { dbConnect } from '../../../db/dbConnect';
import { eq } from 'drizzle-orm';
import { userMaster, userOptions, shopType, questions, options, questionType } from '../../../db/schema/user';


const router = express.Router();
// save merchant/shopper. usertypetable needed? 

// answer verification not there!

router.post('/save-merchant-details', currentUser,
requireAuth,
[
    body('shopTypeID').notEmpty().withMessage('Please provide a shopTypeID'),
    body('shopTypeID').isInt().withMessage('shopTypeID needs to be integer'),
    body('cashierTills').notEmpty().withMessage('Please provide number of cashierTills'),
    body('cashierTills').isInt().withMessage('cashierTills needs to be integer'),
    body('answer').notEmpty().withMessage('Please provide merchant answers'),
    body('answer').isArray().withMessage('answer needs to be an array'),
],
validateRequest, async (req: Request, res: Response) => {
    console.log('save-merchant-details');

    // let userID = req.body.userID;   // required
    const { id } = req.currentUser!;
    let userID = id;
    const db = await dbConnect();

    // let logo = req.body.logo;
    // let businessName = req.body.nameOfBusiness;
    let shopTypeID = req.body.shopTypeID;       // required
    
    let cashierTills = req.body.cashierTills;
    
    // let interests = req.body.interests;
   // let questionid = req.body.questionid;  
    let answer = req.body.answer

    // {"answer": [{"questionId": [1],"optionID": [1] },{"questionId": [2],"optionID": [7,8,10]}],
    // "userID" : 7,
    // "shopTypeID" : 4
    // "cashiertills" : 2
    // }
    // let optionid = req.body.optionid;

    const userTypeCheck = await db.select({userTypeField: userMaster.usertype}).from(userMaster).where(eq(userMaster.userid, Number(userID)));

    let userTypeResult = userTypeCheck[0];

    if ((typeof userTypeResult == 'undefined') || (userTypeResult.userTypeField  == null)) {
        throw new BadRequestError('User Type for this user not found.');        
    }
    else if (userTypeResult.userTypeField != 'S' && userTypeResult.userTypeField != 'M') {
        throw new BadRequestError('Invalid User Type.');
    }
    else {
        var userType = userTypeResult.userTypeField;
        console.log(userType)

    }
    
    // const shopTypeIDRow = await MerchantRepo.getShopTypeID(shopType);
    // console.log(shopTypeIDRow);
    // var shopTypeID = shopTypeIDRow[0]["shoptypeid"];
    // const updateProfile = await UserRepo.updateProfile(userID, logo, businessName, shopTypeID, cashierTills, interests);

    //const questionlist : string[] = [];

   for (let i = 0; i < answer.length; i++) {
    console.log(answer.length) 
    let optionsList = answer[i]['optionID']
    console.log(typeof(optionsList))
    console.log(optionsList)
    for (let j = 0; j < optionsList.length; j++) { 
        // update usermaster set questionid=answer[i]['questionid'][0], optionid=optionList[j] where userid=$2

        try {
            const insertuserOptions = await db.insert(userOptions).values({userid: Number(userID), questionid: answer[i]['questionID'], optionid: optionsList[j]});
        }
        catch (error) {
            console.log(error);
            throw new BadRequestError('Error in inserting user options');
        }
    
}

try {
    // UPDATE USER_MASTER SET cashierTills = $1, shopTypeID = $2, userType = $3 WHERE userID = $4;`,
    //   [cashierTills, shopTypeID, userType, userID]

    let insertDetails = await db.update(userMaster).set({cashiertills: cashierTills, userid: Number(userID), shoptypeid: shopTypeID, usertype: "M"}).where(eq(userMaster.userid, Number(userID)));

}
catch (error) {
    console.log(error);
    throw new BadRequestError('Error in updating merchant details');
}
    
    //questionlist.push(questionid[i]["QuestionId"]);
      }
     // console.log(questionlist);

    res.status(200).json({"response" : "Success"})
});






export { router as saveMerchantRouter };