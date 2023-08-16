import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema/user';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const db = await dbConnect();

  const users = await db.select().from(userMaster);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

export { router as getAllUsersRouter };
