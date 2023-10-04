import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { eq,sql } from 'drizzle-orm';

// import jwt from 'jsonwebtoken';

import { validateRequest } from '../../../middlewares/validateRequest';

const router = express.Router();
console.log('get-qotd');


router.post(
  '/get-qotds',
  validateRequest,
  async (req: Request, res: Response) => {
    const db = await dbConnect();
      const statement = sql`select id,queid,quedesc from qotdMaster where qflag='Active';`
      
      const arya=await db.execute(statement);

      res.status(200).json({
        response: 'Success',
        "Data:" : arya[0]
      });
    }
);

export { router as getQotdsRouter };
