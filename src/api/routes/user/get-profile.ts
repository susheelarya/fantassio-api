import express, { Request, Response } from 'express';
// import { UserRepo } from '../../../repos/user-repo';
 import { eq,sql } from 'drizzle-orm';
 import { dbConnect } from '../../../../src/db/dbConnect';

console.log('get-profile');
const router = express.Router();

router.post('/get-profile', async (req: Request, res: Response) => {
    const db = await dbConnect();
    const userID = req.body.userID;

    if (isNaN(userID) == true) {
        return res.status(400).json({"response": "userID not valid"}) 
    }
    else{
        const statement=sql`select user_first_name,user_last_name,is_user_validated,is_user_enabled,is_aadhar_validated,is_pan_validated,aadhar_image_front,aadhar_image_back,pan_image_front,user_image_name,user_gender,user_age_group,user_language,user_points,current_scheme,curr_scheme_valid_upto from userMaster where user_id = ${userID}`
        const rows = await db.execute(statement);
//        return rows;
        return res.status(200).json({"response": "Valid user","Data":rows}) 
    }
});
export { router as getProfileRouter };