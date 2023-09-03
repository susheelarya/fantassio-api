import express, { Request, Response } from 'express';
// import { UserRepo } from '../../repos/user-repo';

import { currentUser } from '../../../middlewares/current-user';
import { requireAuth } from '../../../middlewares/require-auth';
import { validateRequest } from '../../../middlewares';
import { body } from 'express-validator';
import { BadRequestError } from '../../../errors/bad-request-error';
import { dbConnect } from '../../../db/dbConnect';
import { userMaster } from '../../../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();
//save location in db

// coords = "52.481564, -1.897311"
// userid is number,
// THIS DOESN'T UPDATE POSTCODE.
router.post(
  '/get-location-by-coords',
  currentUser,
  requireAuth,
  [body('coords').notEmpty().withMessage('Please provide valid coordinates')],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('get-location-by-coords');
    var location = req.body.coords;
    const { id } = req.currentUser!;
    //console.log(res.statusCode)

    if (typeof location !== 'string') {
      throw new BadRequestError('Coordinates invalid. Not a string.');
    }

    // console.log(location);
    // console.log(location[0]);

    var locationArray = location.split(',');
    console.log(locationArray);
    const db = await dbConnect();

    // update location in db

    const latlong = JSON.stringify(locationArray)
      .replace('[', '{')
      .replace(']', '}');

    console.log(locationArray[0]);

    // const user = await UserRepo.updateLocation(locationArray[0], locationArray[1], userID);

    //    var locationJoined = locationArray.join('');

    var latitude = locationArray[0];
    var longitude = locationArray[1];

    // console.log(latitude);
    // console.log(longitude);

    var latLong = latitude + ',' + longitude;
    console.log(latLong);

    // https://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&key=YOUR_API_KEY

    var requesturl =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
      latLong +
      '&sensor=true&key=AIzaSyCQ0nnEa6e-uoCqZz22D8qd46HIBBOGm3g';

    // axios

    const axios = require('axios');

    var newData;

    const getAddress = async () => {
      try {
        return await axios.get(requesturl);
      } catch (error) {
        console.log('FIRST ERROR');
        console.error(error);
        //return error
        throw new BadRequestError(
          'Unable to get location from coordinates given. (Google API).'
        );
      }
    };

    const getFormattedAddress = async () => {
      try {
        const addresses = await getAddress();
        if (typeof addresses.data !== 'undefined') {
          console.log('addresses');
          console.log(typeof addresses.data);
          // console.log(addresses)
          var newData = addresses.data['results'][0]['formatted_address'];
          if (typeof newData !== 'undefined') {
            console.log(newData);
            return await newData;
          } else {
            //console.log("ho")
            // return res.status(400).json({"response" : "Unable to get address."})
          }
        }
      } catch (error) {
        console.log('SECOND ERROR');
        console.error(error);
        if (res.statusCode !== 400) {
          return res.status(400).json({ response: error });
        }
      }
    };

    (async () => {
      try {
        console.log('here');
        //console.log(await getFormattedAddress())
        newData = await getFormattedAddress();
        console.log(newData);
        if (typeof newData != 'undefined') {
          try {
            const user = await db
              .update(userMaster)
              .set({
                baselatitude: locationArray[0],
                baselongitude: locationArray[1],
                address1: newData,
              })
              .where(eq(userMaster.userid, Number(id)));
            // const user = await UserRepo.updateLocation(locationArray[0], locationArray[1], newData, userID);
            res.status(200).json({ response: 'Success', address: newData });
          } catch (error) {
            console.log(error);
            throw new BadRequestError('Error in updating location.');
          }
        }
      } catch (error) {
        console.log('THIRD ERROR');
        console.log(error);

        if (res.statusCode !== 400) {
          return res.status(400).json({ response: error });
        }
      }
    })();
  }
);

export { router as locationCoordRouter };
