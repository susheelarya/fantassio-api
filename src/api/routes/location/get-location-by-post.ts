import express, { Request, Response } from 'express';
import { dbConnect } from '../../../db/dbConnect';
import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { userMaster } from '../../../db/schema/user';
import { eq } from 'drizzle-orm';


const router = express.Router();
//save location in db

router.post('/get-location-by-post', currentUser,
requireAuth,
[
  body('postcode').notEmpty().withMessage('Please provide valid postcode'),
],
validateRequest, async (req: Request, res: Response) => {
    console.log('get-location-by-post');
    var postcode = req.body.postcode;
    //var userID = req.body.userID;
    const { id } = req.currentUser!;
    var requesturl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+postcode+'&sensor=true&key=AIzaSyCQ0nnEa6e-uoCqZz22D8qd46HIBBOGm3g' ;

    const db = await dbConnect();


  if (typeof(postcode) !== 'string') {
    throw new BadRequestError('Postcode invalid. Not a string.');
  }

    // axios

    const axios = require("axios");

    var newData;
    const getAddress = async () => {
        try {
          return await axios.get(requesturl);
        } catch (error) {
      //    console.error(error);
      throw new BadRequestError('Please enter a valid postcode.');
        }
      }

      const getFormattedAddress = async () => {
        try {
        const addresses = await getAddress();
        console.log("Inside getFormattedAddress");
       // var newData = addresses.data["results.formatted_address"];
       var newData = addresses.data["results"][0]["formatted_address"];
       console.log(newData);
       try {
        // const user = await db.update(userMaster).set({baselatitude : locationArray[0], baselongitude: locationArray[1], address1: newData}).where(eq(userMaster.userid, Number(id)))
        const user = db.update(userMaster).set({postcode: postcode, address1: newData}).where(eq(userMaster.userid, Number(id)));
        // const user = await UserRepo.updatePostCode(postcode,newData, userID);
        // UPDATE user_master SET postcode = $1, address1=$2 WHERE userid = $3
        res.status(200).json({"response" : "Success", "address": newData});
      }
      catch (error) {
        console.log(error)
        throw new BadRequestError('Error in updating location.');
      }


       
       
       console.log(res.statusCode);
        return await newData;
        } catch (error) {
          throw new BadRequestError('Please enter a valid postcode.');
          //console.log(res.statusCode);

        }
        
      }
      
      (async () => {
        // console.log("here");
        // console.log(await getFormattedAddress())
        newData = await getFormattedAddress();
     
      //  res.status(200).json({"response" : "Success", "address": newData});
      })()
    
});
export { router as postCoordRouter };