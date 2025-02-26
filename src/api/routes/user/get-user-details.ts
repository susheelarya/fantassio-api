import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq } from 'drizzle-orm';
// import { favouritesTable, shopType, userMaster, userTypeMapping } from '../../../db/schema';


const router = express.Router();

router.post('/get-user-details', currentUser,
requireAuth,
[
],
validateRequest, async (req: Request, res: Response) => {
    console.log('get-user-details');
    const { id } = req.currentUser!;
    let userID = id;

    const db = await dbConnect();

    let getUserType = await db.select()
    .from(userMaster)
    .where(
        eq(userMaster.userid, Number(userID))
    )
    if (typeof getUserType == 'undefined' || getUserType.length == 0) {
        return res.status(200).json({response: "User Type Not Found."})
    }

    return res.status(200).json({response: getUserType})

});

export { router as getUserDetailsRouter };