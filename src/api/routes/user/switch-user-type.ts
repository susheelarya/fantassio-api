import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq } from 'drizzle-orm';
import { userMaster, userTypeMapping } from '../../../db/schema';

const router = express.Router();


router.post('/switch-user-type', currentUser,
requireAuth,
[
    body('userType').isString().withMessage("Please give user type that is 'C', 'M' or 'S'.")
],
validateRequest, async (req: Request, res: Response) => {
    console.log('switch-user-type');

    const { id } = req.currentUser!;
    let userID = id;
    let userTypeChange = req.body.userType;

    const db = await dbConnect();

    let updateUserType = await db.update(userMaster)
                                .set({usertype: userTypeChange})
                                .where(
                                    eq(userMaster.userid, Number(userID))
                                );

    
    return res.status(200).json({
        response: "Success"
    });


    // let selectUserType = await db.select({
    //     usertype: userMaster.usertype
    // })
    // .from(userMaster)
    // .where(eq(userMaster.userid, Number(userID)));

    // if (typeof selectUserType == 'undefined' || selectUserType.length == 0) {
    //     throw new BadRequestError("User Type Not Found.");
    // }

    // let userTypeChange = ''
    // if (selectUserType[0].usertype == 'M') {
    //     userTypeChange = 'S'
    // }
    // if (selectUserType[0].usertype == 'C') {
    //     userTypeChange = 'S'
    // }
    // if (selectUserType[0].usertype == 'S') {
    //     let selectFromMapping = await db.select({
    //         usertype: userTypeMapping.usertype
    //     })
    //     .from(userTypeMapping)
    //     .where(eq(userTypeMapping.userid, Number(userID)));

    //     var userTypeList = selectFromMapping.map(function (el) { return el.usertype; });

    //     if (userTypeList.includes('C')) {
    //         userTypeChange = 'C'
    //     }
    //     else if (userTypeList.includes('M')) {
    //         userTypeChange = 'M'
    //     }
    //     else {
    //         throw new BadRequestError("User is only a shopper. Cannot switch user type.")
    //     }
    // }

    

});



export { router as switchUserTypeRouter };