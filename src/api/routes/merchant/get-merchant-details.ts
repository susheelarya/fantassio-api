import express, { Request, Response } from 'express';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { dbConnect } from '../../../db/dbConnect';
import { eq } from 'drizzle-orm';
import {
  userMaster,
  shopType,
  questions,
  options,
  questionType,
} from '../../../db/schema/user';

const router = express.Router();
// save merchant/shopper. usertypetable needed?

router.post(
  '/get-merchant-details',
  currentUser,
  requireAuth,
  [
    body('userType')
      .isString()
      .withMessage('Please provide a userType that is a string'),
    body('userType').notEmpty().withMessage('Please provide a userType'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('get-merchant-details');

    let userTypeInput = req.body.userType;
    const { id } = req.currentUser!;
    let userID = id;
    const db = await dbConnect();
    // if (isNaN(userID) == true) {
    //     return res.status(400).json({"response": "userID not valid"})
    // }
    if (userTypeInput != 'S' && userTypeInput != 'M') {
      throw new BadRequestError('Invalid User Type.');
    }

    const userTypeCheck = await db
      .select({ userTypeField: userMaster.usertype })
      .from(userMaster)
      .where(eq(userMaster.userid, Number(userID)));

    let userTypeResult = userTypeCheck[0];
    console.log(userID);

    if (
      typeof userTypeResult == 'undefined' ||
      userTypeResult.userTypeField == null
    ) {
      throw new BadRequestError('User Type for this user not found.');
    } else {
      var userType = userTypeResult.userTypeField;
      console.log(userType);
      console.log(userTypeInput);
    }

    //var cashierTills = req.body.cashierTills;
    if (userTypeInput == userType) {
      const shopTypes = await db
        .select({
          description: shopType.description,
          shoptypeid: shopType.shoptypeid,
        })
        .from(shopType);

      // SELECT description, shoptypeid FROM shop_type
      if (shopTypes.length == 0) {
        throw new BadRequestError('No shop types found.');
      }

      //     console.log("shopTypes : "+shopTypes[0]);
      // const shopTypeList : string[] = [];
      // for (let i = 0; i < shopTypes.length; i++) {
      //     console.log(JSON.stringify(shopTypes[i]["description"]["SHOPTYPEID"]));
      //   }

      // console.log(shopTypeList);
      //    select a.questionid, a.questiontext, b.optionid, b.optiontext, c.questiontype from questions a inner join options b on a.questionid = b.questionid inner join questiontype c on a.questiontypeid=c.questiontypeid

      let questionsResult = await db
        .select({
          questiontext: questions.questiontext,
          questionid: questions.questionid,
          optionid: options.optionid,
          optiontext: options.optiontext,
          questiontype: questionType.questiontype,
        })
        .from(questions)
        .innerJoin(options, eq(questions.questionid, options.questionid))
        .innerJoin(
          questionType,
          eq(questions.questiontypeid, questionType.questiontypeid)
        );

      //let questions = await MerchantRepo.selectquestion();
      if (questionsResult.length == 0) {
        throw new BadRequestError('Unable to select question.');
      }

      // const questionText : string[] = [];
      // for (let i = 0; i < questions.length; i++) {
      //    questionText.push(questions[i]['questiontext']);
      //   }

      res.status(200).json({
        'Choose your type': shopTypes,
        Question: questionsResult,
        // res.status(200).json({"Shop Type" : shopTypes, "Question" : questions
      });
    } else {
      throw new BadRequestError('Incorrect user type');
    }
    /*let logo = req.body.logo;
    let businessName = req.body.nameOfBusiness;
    let shopType = req.body.shopType;       // required
    let cashierTills = req.body.cashierTills;
    //let interests = req.body.interests;
    //var shopType = req.body.shopType;
    
    const shopTypeIDRow = await MerchantRepo.getShopTypeID(shopType);
    var shopTypeID = shopTypeIDRow[0]["shoptypeid"];
    console.log(shopTypeIDRow);



//let insertDetails = await MerchantRepo.insertMerchantDetails(userID, cashierTills, shopTypeIDRow[0]["shoptypeid"], "M");
 let insertDetails = await MerchantRepo.insertMerchantDetails(userID, cashierTills, shopTypeID, logo, businessName, "M");

 res.status(200).json({"response" : "success"})
*/
  }
);

// Sample Request Body.
//  {
// 	"userID”: 4, //required
// 	"cashierTills": "2"//required
// 	“shopType” : “Groceries” //required.
// }

// Sample Response Body.
//  {
// 	“response” : “success”
// }

export { router as getMerchantRouter };
