import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { eq,sql } from 'drizzle-orm';
import { body } from 'express-validator';

import { validateRequest } from '../../../middlewares/validateRequest';

const router = express.Router();
console.log('get-qotd-details');


router.post(
  '/get-qotd-details',
  [
    body('mktSymbol')
      .notEmpty()
      .withMessage('Please provide a valid Market Symbol'),
    body('queID')
      .notEmpty()
      .withMessage('Please provide a valid Question ID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const db = await dbConnect();

  var mktSymbol = req.body.mktSymbol;
  var queID = req.body.queID;

    const stmt = sql`select max(date_format(dateUpdate,'%Y-%m-%d')) as td from stockPrice where market=${mktSymbol}`

    const tdate=await db.execute(stmt)
    const tdate1=Object.values(tdate[0])
    const tdate2=Object.values(tdate1[0])
    
    console.log(tdate2[0])

    // tdate = tdate+'%'

    const statement = sql`select symbol,priceChange, fantassioPrice from stockPrice where market=${mktSymbol} and dateUpdate like ${tdate2[0]+'%'} order by priceChange desc limit 10;`
      
      const arya=await db.execute(statement);

      res.status(200).json({
        response: 'Success',
        "Data:" : arya[0]
      });
    }
);

export { router as getQotdDetailsRouter };
