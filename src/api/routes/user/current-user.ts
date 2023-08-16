import express, { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema/user';
import { currentUser } from '../../../middlewares/current-user';

const router = express.Router();

router.get(
  '/current-user',
  currentUser,
  async (req: Request, res: Response) => {
    const id = req.currentUser?.id;

    if (id) {
      const db = await dbConnect();
      const user = await db
        .select()
        .from(userMaster)
        .where(eq(userMaster.id, Number(id)));

      return res.status(200).json({
        status: 'Success',
        data: user[0] || null,
      });
    } else {
      return res.status(200).json({
        status: 'Success',
        data: null,
      });
    }
  }
);

export { router as getCurrentUserRouter };
