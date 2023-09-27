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
        const statement=sql`select * from userMaster where user_id = ${userID}`
        const rows = await db.execute(statement);
//        return rows;
        return res.status(200).json({"response": "Valid user"}) 
    }
});
export { router as getProfileRouter };