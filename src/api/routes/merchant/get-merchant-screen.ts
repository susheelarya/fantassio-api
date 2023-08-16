// add to shopType
// return required values.
import express, { Request, Response } from 'express';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema/user';
import { eq } from 'drizzle-orm';
// import { MerchantRepo } from '../../repos/merchant-repo';
// import { UserRepo } from '../../repos/user-repo';

// import { dbFile } from '../../repos/db-file';

const router = express.Router();

// post if you insert the stuff from db file, otherwise GET. also saves user type.
router.post(
  '/get-merchant-screen',
  currentUser,
  requireAuth,
  [body('userType').isString().withMessage('Please provide a userType'),],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.currentUser!;
    var userType = req.body.userType;

    const userID = id;

    const db = await dbConnect();



    if (userType !== 'S' && userType !== 'M') {
      console.log('UPDATE ' + userType);
      console.log('error found');

      throw new BadRequestError('Invalid User Type');
    }

    

    const user = await db
      .update(userMaster)
      .set({
        usertype: userType,
        // usertype: null,
      })
      .where(eq(userMaster.id, Number(userID)));
    //   .returning();

    res.status(200).json({
      response: 'Success',
      userType: userType,
      //   user,
    });

    // if (userType == 'S') {
    //     console.log('UPDATE ' + userType);

    //      const rows = await pgClient.query(
    //        'UPDATE user_master SET userType = $1 where userid = $2;',
    //        [userType, userID]!
    //      );

    //     await db
    //       .update(userMaster)
    //       .set({
    //         usertype: userType
    //       })
    //       .where(eq(userMaster.id, userID));

    //   const user = await UserRepo.updateUserType(userID, userType);
    //   console.log('UserType S Updated');
    //   res.status(200).json({ response: 'Success', userType: userType });
    // }

    // if (userType == 'M') {
    //   console.log('UPDATE ' + userType);
    //   const user = await UserRepo.updateUserType(userID, userType);
    //   console.log('UserType M Updated');
    //   res.status(200).json({ response: 'Success', userType: userType });
    // }

    // res.status(200).json({"response" : "Success"})
  }
);

export { router as merchantScreenRouter };
