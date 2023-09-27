import express, { Request, Response } from 'express';
import { UserRepo } from '../../../repos/user-repo';

const router = express.Router();

router.post('/get-user', async (req: Request, res: Response) => {
  const { email, id = '' } = req.query;

  const user = await UserRepo.findById(id?.toString());

  res.status(200).json({
    status: 'success',
    data: user || null,
  });
});

export { router as getUserRouter };
