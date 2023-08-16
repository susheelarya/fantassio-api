import { pgClient } from '../pgClient';

import toCamelCase from './utils/to-camel-case';

const format = require('pg-format');

class dbFile {
  static async insertShopType() {
    let shopType = [['others'], ['groceries'], ['cafe']];
    let query1 = format(
      'INSERT INTO SHOP_TYPE (description) VALUES %L returning *',
      shopType
    );
    const { rows } = await pgClient.query(query1)!;

    return toCamelCase(rows)[0];
  }

  static async insertOfferType() {
    let offerType = [
      ['buy x get y free on same item'],
      ['buy x get y free on different item'],
      ['buy x get y% discount on same item'],
      ['buy x get y% discount on different item'],
      ['buy x get £y off on same item'],
      ['buy x get £y off on different item'],
      ['minimum spend £x get £y off on total'],
      ['minimum spend £x get y% off on total'],
    ];
    let query1 = format(
      'INSERT INTO OFFER_TYPE (description) VALUES %L returning *',
      offerType
    );
    const rows = await pgClient.query(query1)!;

    return rows.rows;
  }

  static async insertProducts() {
    let productsList = [
      ['milk', ''],
      ['orange juice', ''],
      ['banana', ''],
    ];
    let query1 = format(
      'INSERT INTO PRODUCT_MASTER (productdescription, productpicture) VALUES %L returning *',
      productsList
    );
    const rows = await pgClient.query(query1)!;

    return rows.rows;
  }

  // INSERT INTO PRODUCT_MASTER --- ITEMS

  // static async insertUserType() {
  //   let userType = [["M"],["S"]]
  //   let query2 = format("INSERT INTO USER_TYPE (description) VALUES %L returning *", userType)
  //   const rows  = await pgClient.query(query2)!;

  //   return rows.rows;
  // }
}

export { dbFile };
