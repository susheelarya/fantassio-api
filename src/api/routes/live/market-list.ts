import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { eq,sql } from 'drizzle-orm';

// import jwt from 'jsonwebtoken';

import { validateRequest } from '../../../middlewares/validateRequest';
import { generalParameterMaster, validMarkets } from '../../../db/schema';
import { body } from 'express-validator';

const router = express.Router();
console.log('game-list');


router.post(
  '/market-list',
  [
    body('param').notEmpty().withMessage('Please provide a valid otp'),
  ],
  validateRequest,
  
  async (req: Request, res: Response) => {
    var param = req.body.param
    const db = await dbConnect();
      const statement = sql`select mktSymbol,mktLongName, mktInformation,isActive from validMarkets;`
      
      //const arya=await db.execute(statement);
      const arya = await db.select({symbol: validMarkets.mktSymbol, longname: validMarkets.mktLongName,
        information: validMarkets.mktInformation, active: validMarkets.isActive
      })
      .from(validMarkets)
      .where(
        eq(validMarkets.mktSymbol, param)
      )

      res.status(200).json({
        response: 'Success',
        "Data" : arya
      });
    }
);

export { router as marketListRouter };
