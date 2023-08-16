import { time } from 'console';
import {
  serial,
  text,
  timestamp,
  pgTable,
  boolean,
  integer,
  date,
  numeric,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const userMaster = pgTable('user_master', {
  id: serial('id'),
  userid: serial('userid').primaryKey().notNull().unique(),
  fullname: text('fullname'),
  mobilenumber: text('mobilenumber'),
  isvalidated: boolean('isvalidated'),
  isenabled: boolean('isenabled'),
  businessname: text('businessname'),
  dpname: text('dpname'),
  otp: text('otp'),
  appleauthtkn: text('appleauthtkn'),
  appleAuthTknSecret: text('appleAuthTknSecret'),
  appleAuthTknUserID: text('appleAuthTknUserID'),
  appleAuthTknUserName: text('appleAuthTknUserName'),
  googleAuthTkn: text('googleAuthTkn'),
  googleAuthTknSecret: text('googleAuthTknSecret'),
  googleAuthTknUserID: text('googleAuthTknUserID'),
  googleAuthTknUserName: text('googleAuthTknUserName'),
  loggedInWith: text('loggedInWith'),
  postcode: text('postcode'),
  address1: text('address1'),
  address2: text('address2'),
  city: text('city'),
  ageGroup: text('ageGroup'),
  gender: text('gender'),
  appVersion: text('appVersion'),
  lastActivity: text('lastActivity'),
  createdOn: text('createdOn'),
  currentSchemeID: integer('currentSchemeID'),
  currentSchemeName: text('currentSchemeName'),
  currentSchemeAmount: text('currentSchemeAmount'),
  currentSchemePurchaseDate: date('currentSchemePurchaseDate'),
  currentSchemeValidityDate: date('currentSchemeValidityDate'),
  userRating: text('userRating'),
  pushNotificationToken: text('pushNotificationToken'),
  mobileDevice: text('mobileDevice'),
  secureToken: text('secureToken'),
  thanosID: integer('thanosID'),
  thanosPassword: text('thanosPassword'),
  isAdmin: boolean('isAdmin'),
  shoptypeid: integer('shoptypeid').references(() => shopType.shoptypeid),
  cashiertills: integer('cashiertills'),
  paiduser: boolean('paiduser'),
  usertype: text('usertype'),
  about: text('about'),
  businesslogo : text('logo'),
  interests: text('interests'),
  baselongitude: numeric('baselongitude'),
  baselatitude: numeric('baselatitude'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const customerTransaction = pgTable('customer_transaction', {
  transactionid: serial('transactionid').primaryKey(),
  useridshopper: integer('useridshopper').notNull(),
  useridshop: integer('useridshop').notNull(),
  moneyspent: numeric('moneyspent'),
  pointsearned: numeric('pointsearned'),
  loyaltyschemeid: integer('loyaltyschemeid'),
  receiptid: integer('receiptid'),
  collectedflag: boolean('collectedflag'),
  datetime: timestamp('datetime'),
});
export const loyaltySchemeShopMapping = pgTable('loyalty_scheme_shop_mapping', {
  useridshop: integer('useridshop'),
  loyaltyschemeid: integer('loyaltyschemeid').references(
    () => loyaltySchemeMaster.loyaltyschemeid
  ),
  mapid: serial('mapid').primaryKey(),
});

export const shopType = pgTable('shop_type', {
  shoptypeid: serial('shoptypeid').primaryKey(),
  description: text('description'),
});

export const loyaltySchemeMaster = pgTable('loyalty_scheme_master', {
  loyaltyschemeid: serial('loyaltyschemeid').primaryKey(),
  loyaltyschemetypeid: integer('loyaltyschemetypeid')
    .notNull()
    .references(() => loyaltySchemeType.loyaltyschemetypeid),
  moneyforpoints: numeric('moneyforpoints'),
  pointsfrommoney: numeric('pointsfrommoney'),
  pointstoredeem: numeric('pointstoredeem'),
  moneyfrompoints: numeric('moneyfrompoints'),
  redeemfrequency: text('redeemfrequency'),
  predefined: boolean('predefined').notNull(),
  stampstocollect: numeric('stampstocollect'),
  freeitems: numeric('freeitems'),
  expiremonths: integer('expiremonths'),
  validfromdate: date('validfromdate'),
  loyaltyschemename: text('loyaltyschemename'),
  expireflag: boolean('expireflag'),
});

export const loyaltySchemeType = pgTable('loyalty_scheme_type', {
  loyaltyschemetypeid: serial('loyaltyschemetypeid').primaryKey(),
  description: text('description'),
});

export const offerAvailed = pgTable(
  'offer_availed',
  {
    userid: integer('userid'),
    mapid: integer('mapid').references(() => userOfferMapping.mapid),
    datetime: timestamp('datetime'),
  },
  (tableOfferAvailed) => {
    return {
      pk: primaryKey(tableOfferAvailed.userid, tableOfferAvailed.mapid),
    };
  }
);

export const stamps = pgTable('stamps', {
  transactionid: serial('transactionid'),
  useridshopper: integer('useridshopper').references(() => userMaster.userid),
  useridshop: integer('useridshop').references(() => userMaster.userid),
  redeemflag: boolean('redeemflag'),
  stampsbought: integer('stampsbought'),
  loyaltyschemeid: integer('loyaltyschemeid').references(
    () => loyaltySchemeMaster.loyaltyschemeid
  ),
  datetime: timestamp('datetime'),
});

export const userLog = pgTable('user_log', {
  useridshop: integer('useridshop')
    .notNull()
    .references(() => userMaster.userid),
  useridshopper: integer('useridshopper')
    .notNull()
    .references(() => userMaster.userid),
  datetime: timestamp('datetime'),
  id: serial('id').primaryKey().notNull(),
});

export const userOfferMapping = pgTable('user_offer_mapping', {
  mapid: serial('mapid').primaryKey().notNull(),
  userid: integer('userid').references(() => userMaster.userid),
  offerid: integer('datetime').references(() => offerMaster.offerid),
  virtualobjcoord: text('virtualobjcoord'),
});

export const offerMaster = pgTable('offer_master', {
  offertypeid: integer('offertypeid')
    .notNull()
    .references(() => offerType.offertypeid),
  offerid: serial('offerid').primaryKey().notNull(),
  description: text('description'),
  buyitem: integer('buyitem'),
  freeitem: integer('freeitem'),
  percentagediscount: numeric('percentagediscount'),
  cashdiscount: numeric('cashdiscount'),
  minspend: numeric('minspend'),
  buyproductid: integer('buyproductid').references(
    () => productMaster.productid
  ),
  offerpicture: text('offerpicture'),
  validity: date('validity'),
  numberoffers: integer('numberoffers'),
  firstserveflag: boolean('firstserveflag'),
  virtualflag: boolean('virtualflag'),
  predefined: boolean('predefined').notNull(),
  validflag: boolean('validflag'),
  sellproductid: integer('sellproductid').references(
    () => productMaster.productid
  ),
});

export const offerType = pgTable('offer_type', {
  offertypeid: serial('offertypeid').primaryKey().notNull(),
  description: text('description'),
});

export const productMaster = pgTable('product_master', {
  productid: serial('productid').primaryKey().notNull(),
  productdescription: text('productdescription'),
  productpicture: text('productpicture'),
});

export const userType = pgTable('user_type', {
  usertypeid: serial('usertypeid').primaryKey().notNull(),
  description: text('description').notNull(),
});

export const validPostcodes = pgTable('valid_postcodes', {
  id: serial('id').primaryKey().notNull(),
  postcode: varchar('postcode', { length: 30 }),
  latlong: varchar('latlong', { length: 100 }),
  county: varchar('county', { length: 100 }),
  district: varchar('district', { length: 100 }),
  ward: varchar('ward', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postcodearea: varchar('postcodearea', { length: 5 }),
  postcodedistrict: varchar('postcodedistrict', { length: 10 }),
});

export const questionType = pgTable('question_type', {
  questiontypeid: serial('questiontypeid').primaryKey().notNull(),
  questiontype: text('questiontype').notNull(),
  questiontypedesc: text('questiontypedesc').notNull(),
});

export const questions = pgTable('questions', {
  questionid: serial('questionid').primaryKey().notNull(),
  questiontext: text('questiontext').notNull(),
  questiontypeid: integer('questiontypeid').references(
    () => questionType.questiontypeid
  ),
});

export const options = pgTable('options', {
  optionid: serial('optionid').primaryKey().notNull(),
  optiontext: text('optiontext').notNull(),
  questionid: integer('questionid').references(() => questions.questionid),
});

export const userOptions = pgTable(
  'user_options',
  {
    optionid: integer('optionid').references(() => options.optionid),
    userid: integer('userid').references(() => userMaster.userid),
    questionid: integer('questionid').references(() => questions.questionid),
    optiontext: text('optiontext'),
  },
  (tableUserOptions) => {
    return {
      pk: primaryKey(
        tableUserOptions.optionid,
        tableUserOptions.userid,
        tableUserOptions.questionid
      ),
    };
  }
);

export const parametersTable = pgTable('parameters', {
  paramid: serial('paramid').primaryKey(),
  parameter: text('parameter'),
  paramkey: text('paramkey'),
  paramvalue: text('paramvalue'),
});

export const customerConsolidation = pgTable(
  'customer_consolidation',
  {
    useridshopper: integer('useridshopper')
      .notNull()
      .references(() => userMaster.userid),
    useridshop: integer('useridshop')
      .notNull()
      .references(() => userMaster.userid),
    loyaltyschemeid: integer('loyaltyschemeid')
      .notNull()
      .references(() => loyaltySchemeMaster.loyaltyschemeid),
    pointscollected: integer('pointscollected').notNull(),
  },
  (tableConsolidation) => {
    return {
      pk: primaryKey(
        tableConsolidation.useridshopper,
        tableConsolidation.useridshop,
        tableConsolidation.loyaltyschemeid
      ),
    };
  }
);

export const customerRedeem = pgTable(
  'customer_redeem',
  {
    useridshopper: integer('useridshopper')
      .notNull()
      .references(() => userMaster.userid),
    useridshop: integer('useridshop')
      .notNull()
      .references(() => userMaster.userid),
    redeemablepoints: integer('redeemablepoints').notNull(),
  },
  (tableRedeem) => {
    return {
      pk: primaryKey(tableRedeem.useridshopper, tableRedeem.useridshop),
    };
  }
);

export const loyaltyInformation = pgTable('loyalty_information', {
  loyaltyschemeid: integer('loyaltyschemeid')
    .primaryKey()
    .notNull()
    .references(() => loyaltySchemeMaster.loyaltyschemeid),
  useridshop: integer('useridshop').references(() => userMaster.userid),
  pointscollected: numeric('pointscollected'),
  numberofcustomers: numeric('numberofcustomers'),
  pointsredeemed: numeric('pointsredeemed'),
  pointstoberedeemed: numeric('pointstoberedeemed'),
  stampstocollect: integer('stampstocollect'),
  stampscollected: integer('stampscollected'),
  freeitemsgiven: integer('freeitemsgiven'),
});

// CREATE TABLE IF NOT EXISTS public.users (
//   id integer NOT NULL,
//   otp bigint,
//   createdat character varying(30),
//   updatedat character varying(30),
//   email character varying(30),
//   isvalidated boolean,
//   isenabled boolean,
//   mobilenumber character varying(30)
// );
