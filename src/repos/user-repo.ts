import { pgClient } from '../pgClient';

import toCamelCase from './utils/to-camel-case';

export interface User {
  id: number;
  otp: string;
  createdAt: string;
  updatedAt: string;
  email: string | null;
  isValidated: boolean;
  isEnabled: boolean;
  mobileNumber: string;
}

class UserRepo {
  static async find() {
    const { rows } = await pgClient.query('SELECT * FROM user_master;')!;

    return toCamelCase(rows);
  }

  static async findById(id: string) {
    const { rows } = await pgClient.query(
      `SELECT * FROM user_master WHERE userid = $1`,
      [id]
    )!;

    return toCamelCase(rows)[0];
  }

  static async findByNumber(mobnumber: string) {
    console.log('Inside findByNumber ' + mobnumber);
    const { rows } = await pgClient.query(
      `SELECT max(userid) userid FROM user_master WHERE mobilenumber = $1`,
      [mobnumber]
    )!;

    return toCamelCase(rows)[0];
  }

  static async findByGoogleID(googleId: string) {
    //console.log("Inside findByNumber " + mobnumber);
    const { rows } = await pgClient.query(
      `SELECT max(userid) userid FROM user_master WHERE "googleAuthTknUserID" = $1`,
      [googleId]
    )!;

    return toCamelCase(rows)[0];
  }

  static async findByAppleID(appletkn: string) {
    //console.log("Inside findByNumber " + mobnumber);
    const { rows } = await pgClient.query(
      `SELECT max(userid) userid FROM user_master WHERE appleAuthTkn = $1`,
      [appletkn]
    )!;
    console.log(appletkn);
    return toCamelCase(rows)[0];
  }

  static async insert(mobileNumber: string, otp: string, email?: string) {
    const { rows } = await pgClient.query(
      `INSERT INTO user_master (mobileNumber, otp, isValidated, "loggedInWith") VALUES($1, $2, $3, $4) RETURNING *;`,
      [mobileNumber, otp, 'N', 'M']
    )!;

    return toCamelCase(rows)[0];
  }

  static async insertAppleID(
    authtkn: string,
    authTknSecret: string,
    email: string,
    authTknUserID: string,
    authTknUserName: string,
    loggedInWith: string,
    mobileDevice: string,
    pushNotificationToken: string
  ) {
    const { rows } = await pgClient.query(
      `INSERT INTO user_master (appleauthtkn, "appleAuthTknSecret", email, "appleAuthTknUserID", "appleAuthTknUserName", "loggedInWith", "mobileDevice", "pushNotificationToken", isenabled, isvalidated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [
        authtkn,
        authTknSecret,
        email,
        authTknUserID,
        authTknUserName,
        loggedInWith,
        mobileDevice,
        pushNotificationToken,
        'Y',
        'N',
      ]
    )!;
    return toCamelCase(rows)[0];
  }
  /*
  static async updateAppleID(authtkn: string, authTknSecret: string, email: string, authTknUserID: string, authTknUserName: string, loggedInWith: string, mobileDevice: string, pushNotificationToken: string) {
    const { rows } = await pgClient.query(
      `UPDATE user_master SET (appleauthtkn, appleAuthTknSecret, email, appleAuthTknUserID, appleAuthTknUserName, "loggedInWith", "mobileDevice", "pushNotificationToken", isenabled, isvalidated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [authtkn, authTknSecret, email, authTknUserID, authTknUserName, loggedInWith, mobileDevice, pushNotificationToken, "Y",  "N", "A"]
    )!;
  }
*/

  static async insertGoogleID(
    authtkn: string,
    authTknSecret: string,
    email: string,
    authTknUserID: string,
    authTknUserName: string,
    loggedInWith: string,
    mobileDevice: string,
    pushNotificationToken: string
  ) {
    const { rows } = await pgClient.query(
      `INSERT INTO user_master ("googleAuthTkn", "googleAuthTknSecret", email, "googleAuthTknUserID", "googleAuthTknUserName", "loggedInWith", "mobileDevice", "pushNotificationToken", isenabled, isvalidated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [
        authtkn,
        authTknSecret,
        email,
        authTknUserID,
        authTknUserName,
        loggedInWith,
        mobileDevice,
        pushNotificationToken,
        'Y',
        'N',
      ]
    )!;
    return toCamelCase(rows)[0];
  }

  /*
    static async updateGoogleID(authtkn: string, authTknSecret: string, email: string, authTknUserID: string, authTknUserName: string, loggedInWith: string, mobileDevice: string, pushNotificationTaken: string) {
      const { rows } = await pgClient.query(
        `UPDATE user_master SET (googleauthtkn, googleAuthTknSecret, email, googleAuthTknUserID, googleAuthTknUserName, loggedInWith, mobileDevice, pushNotificationTaken, isenabled, isvalidated) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
        [authtkn, authTknSecret, email, authTknUserID, authTknUserName, loggedInWith, mobileDevice, pushNotificationTaken, "Y",  "N", "G"]
      )!;
  
    }
    */

  static async updateReturnUser(userID: string, otp: string) {
    const rows = await pgClient.query(
      'UPDATE user_master SET otp = $1 , isValidated = $2 where userid = $3;',
      [otp, 'N', userID]!
    );
  }

  static async count() {
    const { rows } = await pgClient.query('SELECT COUNT(*) FROM user_master;')!;

    return rows[0].count;
  }

  static async getOTP(userID: string) {
    const { rows } = await pgClient.query(
      'SELECT otp FROM user_master WHERE userid = $1;',
      [userID]
    )!;

    return toCamelCase(rows)[0];
  }

  static async updateUserType(userID: string, userType: string) {
    const rows = await pgClient.query(
      'UPDATE user_master SET userType = $1 where userid = $2;',
      [userType, userID]!
    );
  }

  static async updateValidate(userID: string) {
    const { rows } = await pgClient.query(
      'UPDATE user_master SET isValidated = $1, otp=$3 WHERE userid = $2;',
      ['Y', userID, 'Verified']
    )!;

    return toCamelCase(rows)[0];
  }

  static async updateLocation(
    latitude: string,
    longitude: string,
    address: string,
    userID: string
  ) {
    const rows = await pgClient.query(
      'UPDATE user_master SET baselatitude = $1::numeric, baselongitude = $2::numeric, address1=$3 WHERE userid = $4;',
      [latitude, longitude, address, userID]
    )!;
  }

  static async updatePostCode(code: string, address: string, userID: string) {
    const rows = await pgClient.query(
      'UPDATE user_master SET postcode = $1, address1=$2 WHERE userid = $3',
      [code, address, userID]
    )!;
  }

  static async getUserType(userID: string) {
    const rows = await pgClient.query(
      `SELECT usertype FROM user_master WHERE userid = $1;`,
      [userID]
    )!;
    return rows.rows;
  }

  static async getMerchantProfile(userID: string) {
    const rows = await pgClient.query(
      'SELECT postcode, address1, businesslogo, businessname, shoptypeid, cashiertills from user_master where userid = $1',
      [userID]
    )!;
    return rows.rows;
  }

  static async getShopType(shopTypeID: string) {
    const rows = await pgClient.query(
      `SELECT description FROM SHOP_TYPE WHERE shopTypeID = $1;`,
      [shopTypeID]
    )!;
    return rows.rows;
  }

  static async findShops(
    latitude: string,
    longitude: string,
    radius: string,
    offset: string
  ) {
    const rows = await pgClient.query(
      `SELECT u.businessname, u.businesslogo, u.userid, count(o.userid) as offercount, round(cast(acos(
        sin(radians($1)) 
          * sin(radians(baselatitude)) 
        + cos(radians($1)) 
          * cos(radians(baselatitude)) 
          * cos( radians($2)
            - radians(baselongitude))
        ) * 3963.1906 as numeric), 2) as distance
 FROM user_master u LEFT JOIN user_offer_mapping o ON u.userid=o.userid
 WHERE acos(
        sin(radians($1)) 
          * sin(radians(baselatitude)) 
        + cos(radians($1)) 
          * cos(radians(baselatitude)) 
          * cos( radians($2)
            - radians(baselongitude))
        ) * 3963.1906 <= $3 group by u.businessname, u.businesslogo, u.userid offset $4 limit 10 ;`,
      [latitude, longitude, radius, offset]
    )!;
    return rows.rows;
  }

  static async findOffers(
    latitude: string,
    longitude: string,
    radius: string,
    offset: string
  ) {
    const rows = await pgClient.query(
      `SELECT t.*, u.businessname, u.businesslogo, u.userid, round(cast(acos(
        sin(radians($1)) 
          * sin(radians(baselatitude)) 
        + cos(radians($1)) 
          * cos(radians(baselatitude)) 
          * cos( radians($2)
            - radians(baselongitude))
        ) * 3963.1906 as numeric), 2) as distance
 FROM user_master u LEFT JOIN user_offer_mapping o ON u.userid=o.userid INNER JOIN offer_master t ON t.offerid = o.offerid
 WHERE acos(
        sin(radians($1)) 
          * sin(radians(baselatitude)) 
        + cos(radians($1)) 
          * cos(radians(baselatitude)) 
          * cos( radians($2)
            - radians(baselongitude))
        ) * 3963.1906 <= $3 group by u.businessname, u.businesslogo, t.offertypeid, t.offerid, u.userid offset $4 limit 10 ;`,
      [latitude, longitude, radius, offset]
    )!;
    return rows.rows;
  }

  static async getShopperProfile(userID: string) {
    const rows = await pgClient.query(
      'SELECT postcode, address1, interests from user_master where userid = $1',
      [userID]
    )!;
    return rows.rows;
  }

  static async checkShopper(userID: string) {
    const rows = await pgClient.query(
      'SELECT usertype from user_master where userid = $1',
      [userID]
    )!;
    return rows.rows;
  }

  static async updateProfileMerchant(
    userID: string,
    logo: string,
    businessName: string,
    shopTypeID: string,
    cashierTills: string,
    postcode: string
  ) {
    const rows = await pgClient.query(
      'UPDATE user_master SET businesslogo = $1, businessname = $2, shoptypeid = $3, cashiertills = $4, postcode = $5 WHERE userid = $6',
      [logo, businessName, shopTypeID, cashierTills, postcode, userID]
    )!;
  }

  static async updateProfileShopper(userID: string, interests: string) {
    const rows = await pgClient.query(
      'UPDATE user_master SET interests = $1 WHERE userid = $2',
      [interests, userID]
    )!;
  }
}

export { UserRepo };
