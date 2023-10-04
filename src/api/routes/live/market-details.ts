import express, { Request, Response } from 'express';
import axios from 'axios';

import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema';
import { generalParameterMaster } from '../../../db/schema';
import { eq,sql } from 'drizzle-orm';
import { totp } from 'otplib';

import { body } from 'express-validator';

// import jwt from 'jsonwebtoken';

import { validateRequest } from '../../../middlewares/validateRequest';
import { BadRequestError } from '../../../errors/bad-request-error';

const router = express.Router();
console.log('market-details');


router.post(
  '/market-details',
  validateRequest,
  async (req: Request, res: Response) => {
    const db = await dbConnect();
      const statement = sql`select mktSymbol,mktLongName, mktInformation,isActive from validMarkets;`
      
      const arya=await db.execute(statement);

      res.status(200).json({
        response: 'Success',
        "Data:" : arya[0]
      });
    }
);

export { router as marketDetailsRouter };
