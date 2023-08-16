import { pgClient } from '../pgClient';

import toCamelCase from './utils/to-camel-case';

const format = require('pg-format');

class MerchantRepo {
  static async selectShopType() {
    const rows = await pgClient.query(
      `SELECT description, shoptypeid FROM shop_type;`
    )!;

    // return toCamelCase(rows);
    return rows.rows;
  }

  static async selectquestion() {
    const rows = await pgClient.query(
      `select a.questionid, a.questiontext, b.optionid, b.optiontext, c.questiontype from questions a inner join options b on a.questionid = b.questionid inner join questiontype c on a.questiontypeid=c.questiontypeid;
          ;`
    )!;

    // return toCamelCase(rows);
    return rows.rows;
  }

  static async insertuseroptions(
    userid: string,
    questionid: string,
    optionid: string
  ) {
    const { rows } = await pgClient.query(
      `INSERT INTO user_options (userid, questionid, optionid) VALUES($1, $2, $3) RETURNING *;`,
      [userid, questionid, optionid]
    )!;

    return toCamelCase(rows)[0];
  }

  //   static async insert(mobileNumber: string, otp: string, email?: string) {
  //     const { rows } = await pgClient.query(
  //       `INSERT INTO users (mobileNumber, otp, isValidated) VALUES($1, $2, $3) RETURNING *;`,
  //       [mobileNumber, otp, "N"]
  //     )!;

  //     return toCamelCase(rows)[0];
  //   }

  static async getShopTypeID(shopType: string) {
    const rows = await pgClient.query(
      `SELECT SHOPTYPEID FROM SHOP_TYPE WHERE DESCRIPTION = $1;`,
      [shopType]
    )!;

    // return toCamelCase(rows);

    return rows.rows;
  }

  /* static async getqrcodebyID(qrcodeBy: string) {
        const rows = await pgClient.query(
          `SELECT GETQRCODEID FROM GET_QRCODE_BY WHERE DESCRIPTION = $1;`,
          [qrcodeBy]
            )!;
    
        // return toCamelCase(rows);

        return rows.rows;
      }
*/

  static async insertMerchantDetails(
    userID: string,
    cashierTills: string,
    shopTypeID: string,
    userType: string
  ) {
    const rows = await pgClient.query(
      `UPDATE USER_MASTER SET cashierTills = $1, shopTypeID = $2, userType = $3 WHERE userID = $4;`,
      [cashierTills, shopTypeID, userType, userID]
    )!;

    // return toCamelCase(rows);
    return rows.rows;
  }
}

export { MerchantRepo };
