// import { Request, Response, NextFunction } from 'express';

// const checkUser =
//   (Model: Model<any>) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.currentUser!.id;

//     const user = await Model.findById(userId);

//     if (!user) {
//       throw new Error('User does not exist');
//     }

//     next();
//   };

// export { checkUser };
