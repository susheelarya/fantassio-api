import { pgClient } from '../pgClient';

import toCamelCase from './utils/to-camel-case';

const format = require('pg-format');

class OfferRepo {
  static async getAllOfferTypes() {
    const rows = await pgClient.query(`SELECT * FROM OFFER_TYPE;`)!;
    return rows.rows;
  }

  static async getOfferInformation(offerID: string) {
    const rows = await pgClient.query(
      `SELECT * FROM offer_master where offerid = $1;`,
      [offerID]
    )!;
    return rows.rows;
  }

  static async getProductID(productName: string) {
    const rows = await pgClient.query(
      'SELECT productID FROM product_master WHERE productdescription = $1;',
      [productName]
    )!;
    return rows.rows;
  }

  static async getAllLoyaltyTypes() {
    const rows = await pgClient.query(`SELECT * FROM loyalty_scheme_type;`)!;
    return rows.rows;
  }

  static async getAllLoyaltyInformation(userID: string) {
    const rows = await pgClient.query(
      `select o.redeemfrequency, o.loyaltyschemeid, o.predefined, m.description, o.validfromdate, o.loyaltyschemename, o.expireflag, i.pointscollected, i.numberofcustomers, i.pointsredeemed, i.pointstoberedeemed, i.stampstocollect, i.stampscollected, i.freeitemsgiven from loyalty_scheme_master o inner join loyalty_information i on o.loyaltyschemeid = i.loyaltyschemeid and i.useridshop = $1 inner join loyalty_scheme_type m on m.loyaltyschemetypeid = o.loyaltyschemetypeid
          ;`,
      [userID]
    )!;
    return rows.rows;
  }

  static async getAllParameters() {
    const rows = await pgClient.query(`SELECT * FROM parameters;`)!;
    return rows.rows;
  }

  static async getPredefinedLoyalty() {
    const rows = await pgClient.query(
      `SELECT * FROM loyalty_scheme_master WHERE predefined = true;`
    )!;
    return rows.rows;
  }

  static async getLoyaltySchemeType(id: string) {
    const rows = await pgClient.query(
      `select description from loyalty_scheme_type where loyaltyschemetypeid = $1;`,
      [id]
    )!;
    return rows.rows;
  }

  static async getOfferTypeID(offerTypeID: string) {
    const rows = await pgClient.query(
      'SELECT * from offer_type where offertypeid = $1;',
      [offerTypeID]
    )!;
    return rows.rows;
  }

  static async getLoyaltyTypeID(loyaltySchemeTypeID: string) {
    const rows = await pgClient.query(
      'SELECT * from loyalty_scheme_type where loyaltyschemetypeid = $1;',
      [loyaltySchemeTypeID]
    )!;
    return rows.rows;
  }

  static async validateOfferID(offerTypeID: string, offerID: string) {
    console.log(offerTypeID);
    const rows = await pgClient.query(
      'select offerid from offer_master where offertypeid = $1 and offerid = $2;',
      [offerTypeID, offerID]
    )!;
    return rows.rows;
  }

  static async validateLoyaltyID(
    loyaltySchemeTypeID: string,
    loyaltySchemeID: string
  ) {
    console.log(loyaltySchemeTypeID);
    const rows = await pgClient.query(
      'select loyaltyschemeid from loyalty_scheme_master where loyaltyschemetypeid = $1 and loyaltyschemeid = $2;',
      [loyaltySchemeTypeID, loyaltySchemeID]
    )!;
    return rows.rows;
  }

  static async insertOfferMaster(
    offerName: string,
    numberItemsToBuy: string,
    itemsFree: string,
    percentageDiscount: string,
    cashDiscount: string,
    minSpend: string,
    offerPicture: string,
    validity: string,
    offerTypeID: string,
    predefined: string
  ) {
    console.log(
      'offer repo ',
      offerName,
      numberItemsToBuy,
      itemsFree,
      percentageDiscount,
      cashDiscount,
      minSpend,
      offerPicture,
      validity,
      offerTypeID,
      'Y',
      predefined
    );
    const rows = await pgClient.query(
      'insert into offer_master (description,  buyitem, freeitem, percentagediscount, cashdiscount, minSpend, validity, offertypeid, offerpicture, validflag, predefined) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning offerid;',
      [
        offerName,
        numberItemsToBuy,
        itemsFree,
        percentageDiscount,
        cashDiscount,
        minSpend,
        validity,
        offerTypeID,
        offerPicture,
        'Y',
        predefined,
      ]
    )!;

    return rows.rows;
  }

  // loyaltyschemetypeid, loyaltyschemeid, moneyforpoints, pointsfrommoney, pointstoredeem, moneyfrompoints, redeemfrequency, predefined, stampstocollect, freeitems, expiremonths, validfromdate, loyaltyschemename, expireflag

  static async insertLoyaltyMaster(
    loyaltySchemeTypeID: string,
    moneyForPoints: string,
    pointsFromMoney: string,
    pointsToRedeem: string,
    moneyFromPoints: string,
    redeemFrequency: string,
    predefined: string,
    stampsToCollect: string,
    freeItems: string,
    expireMonths: string,
    validFromDate: string,
    loyaltySchemeName: string
  ) {
    const rows = await pgClient.query(
      'insert into loyalty_scheme_master (loyaltyschemetypeid, moneyforpoints, pointsfrommoney, pointstoredeem, moneyfrompoints, redeemfrequency, predefined, stampstocollect, freeitems, expiremonths, validfromdate, loyaltyschemename, expireflag) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning loyaltyschemeid;',
      [
        loyaltySchemeTypeID,
        moneyForPoints,
        pointsFromMoney,
        pointsToRedeem,
        moneyFromPoints,
        redeemFrequency,
        predefined,
        stampsToCollect,
        freeItems,
        expireMonths,
        validFromDate,
        loyaltySchemeName,
        'N',
      ]
    )!;

    return rows.rows;
  }

  static async insertUserOfferMapping(userID: string, offerID: string) {
    const rows = await pgClient.query(
      'insert into user_offer_mapping (userid, offerid) values ($1, $2);',
      [userID, offerID]
    )!;
    return rows.rows;
  }

  static async insertLoyaltyMapping(userID: string, loyaltySchemeID: string) {
    const rows = await pgClient.query(
      'insert into loyalty_scheme_shop_mapping (useridshop, loyaltyschemeid) values ($1, $2);',
      [userID, loyaltySchemeID]
    )!;
    return rows.rows;
  }

  static async loadLoyaltyForUser(userID: string) {
    const rows = await pgClient.query(
      'select * from loyalty_scheme_master inner join loyalty_scheme_shop_mapping on loyalty_scheme_master.loyaltyschemeid = loyalty_scheme_shop_mapping.loyaltyschemeid where useridshop = $1;',
      [userID]
    )!;
    return rows.rows;
  }

  /*
    static async insertOfferMaster(offerName: string, numberItemsToBuy: string, itemsFree: string, percentageDiscount: string, cashDiscount: string,
        minSpend: string, productIDBuy: string, offerPicture: string, validity: string, numberOffers: string, fcfs: string, virtualObject: string, productIDSell: string, offerTypeID: string) 
        {
            console.log("offer repo ",offerName, numberItemsToBuy, itemsFree, percentageDiscount, cashDiscount, minSpend, productIDBuy, offerPicture, validity, numberOffers, fcfs, virtualObject, productIDSell, offerTypeID, "Y")
            const rows = await pgClient.query('insert into offer_master (description,  buyitem, freeitem, percentagediscount, cashdiscount, minSpend, buyproductid, offerpicture, validity, numberoffers, firstserveflag, virtualflag, sellproductid, offertypeid, validflag) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning offerid;',
            [offerName, numberItemsToBuy, itemsFree, percentageDiscount, cashDiscount, minSpend, productIDBuy, offerPicture, validity, numberOffers, fcfs, virtualObject, productIDSell, offerTypeID, "Y"])!;
           
            return rows.rows
    }
    */
  static async getShopCoordinates() {
    const rows = await pgClient.query(
      'select baselatitude, baselongitude, u.userid from user_master u inner join user_offer_mapping o on u.userid = o.userid group by u.userid;'
    )!;
    return rows.rows;
  }

  static async getOffersNear(userIDList: string[]) {
    var params: any[] = [];
    for (var i = 1; i <= userIDList.length; i++) {
      params.push('$' + i);
    }
    var queryText =
      'select offerid, userid from user_offer_mapping where userid in (' +
      params.join(',') +
      ')';
    const rows = await pgClient.query(queryText, userIDList)!;

    return rows.rows;
  }

  static async getAddressNumber(userIDList: string[]) {
    var params: any[] = [];
    for (var i = 1; i <= userIDList.length; i++) {
      params.push('$' + i);
    }
    var queryText =
      'select address1, mobilenumber, userid from user_master where userid in (' +
      params.join(',') +
      ')';
    const rows = await pgClient.query(queryText, userIDList)!;

    return rows.rows;
  }

  static async getAddressNumbers(userID: string) {
    const rows = await pgClient.query(
      'select address1, mobilenumber, userid from user_master where userid = $1;',
      [userID]
    )!;
    return rows.rows;
  }

  static async getOfferDetails(offerIDList: string[]) {
    var params: any[] = [];
    for (var i = 1; i <= offerIDList.length; i++) {
      params.push('$' + i);
    }
    var queryText =
      'select * from offer_master where offerid in (' + params.join(',') + ')';
    const rows = await pgClient.query(queryText, offerIDList)!;

    return rows.rows;
  }

  static async getOfferShop(userID: string) {
    // const rows = await pgClient.query('SELECT offerid from user_offer_mapping where userid = $1', [userID])!;
    const rows = await pgClient.query(
      'SELECT * from offer_master where offerid in (select offerid from user_offer_mapping where userid = $1);',
      [userID]
    )!;
    return rows.rows;
  }

  static async getPredefinedOffers() {
    // const rows = await pgClient.query('SELECT offerid from user_offer_mapping where userid = $1', [userID])!;
    const rows = await pgClient.query(
      'SELECT * from offer_master where predefined = true;'
    )!;
    return rows.rows;
  }
}

export { OfferRepo };
