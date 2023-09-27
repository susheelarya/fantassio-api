// send email?
// param : emailid, password of sender and to send.
// send everything
 

import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { and, eq } from 'drizzle-orm';
import { favouritesTable, shopType, userMaster, userTypeMapping } from '../../../db/schema';


const router = express.Router();


router.post('/contact-us', currentUser,
requireAuth,
[
    body('message').isString().withMessage("Please provide a message."),
],
validateRequest, async (req: Request, res: Response) => {
    console.log('contact-us');
    const { id } = req.currentUser!;
    let userID = id;
    let message = req.body.message

    const db = await dbConnect();
    var nodemailer = require('nodemailer');

    let getDetails = await db.select(
        {businessname: userMaster.businessname,
        mobilenumber: userMaster.mobilenumber,
        countrycode: userMaster.countrycode,
        whatsappenabled: userMaster.whatsappenabled,
        cashiertills: userMaster.cashiertills}
    )
    .from(userMaster)
    .where(
        eq(userMaster.userid, Number(userID))
    )

    let heading = "Request from user "+ userID+
     " with shop name "+getDetails[0].businessname+
     " and mobile number "+getDetails[0].countrycode+getDetails[0].mobilenumber+"."  

    var transporter = nodemailer.createTransport({
    service: 'mail.aureans.com',
    auth: {
        user: 'support@aureans.com',
        pass: 'F4c3b00k!'
    }
    });

    var mailOptions = {
    from: 'support@aureans.com',
    to: 'devang.arya@aureans.com',
    subject: heading,
    text: message
    };

    transporter.sendMail(mailOptions, (error: any, info: { response: string; }) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    }); 

    return res.status(200).json({
        response: "Success"
    })


});


export { router as contactUsRouter };