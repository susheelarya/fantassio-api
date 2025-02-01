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
console.log('game-list');
const pValue = 'game';


router.post(
  '/game-list',
  validateRequest,
  async (req: Request, res: Response) => {
    const db = await dbConnect();
      const statement = sql`select parameter_key,parameter_value, parameter_flag from general_parameter_master 
      where parameter=${pValue};`
      
      const arya = await db.select({paramkey: generalParameterMaster.parameterKey,
        paramvalue: generalParameterMaster.parameterValue,
        paramflag: generalParameterMaster.parameterFlag
      })
      .from(generalParameterMaster)
      .where(
        eq(generalParameterMaster.parameter, pValue)
      )
      //const arya=await db.execute(statement);

      res.status(200).json({
        response: 'Success',
        "Data" : arya
      });
    }
);

export { router as gameListRouter };
