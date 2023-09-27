import express, { Request, Response } from 'express';

import { UserRepo } from '../../../repos/user-repo';

const router = express.Router();

// router.post('/new-user', async (req: Request, res: Response) => {
//   const { email } = req.body;

//   const user = await UserRepo.insert(email);

//   res.status(201).json({
//     status: 'success',
//     data: user,
//   });
// });

// exports.newUser = (req: any, res: any, next: any) => {
//   const { email } = req.body;
//   const user = UserRepo.insert(email);

//   res.status(201).json({
//     status: "success new user",
//     data: user,
//   })
// };

export { router as newUserRouter };
