import {
  serial,
  text,
  timestamp,
  time,
  pgTable,
  boolean,
  integer,
  date,
  numeric,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';

import { options, questions } from './question';
import { shopType } from './shop';
import { offerMaster } from './offer';

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
  businesslogo: text('logo'),
  interests: text('interests'),
  baselongitude: numeric('baselongitude'),
  baselatitude: numeric('baselatitude'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const offerAvailed = pgTable(
  'offer_availed',
  {
    userid: integer('userid').references(() => userMaster.userid),
    mapid: integer('mapid').references(() => userOfferMapping.mapid),
    datetime: timestamp('datetime'),
    offerid: integer('offerid').references(() => offerMaster.offerid),
    useridshop: integer('useridshop').references(() => userMaster.userid),
  },
  (tableOfferAvailed) => {
    return {
      pk: primaryKey(tableOfferAvailed.userid, tableOfferAvailed.mapid),
    };
  }
);

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
  offerid: integer('offerid').references(() => offerMaster.offerid),
  virtualobjcoord: text('virtualobjcoord'),
  validfromdate: date('validfromdate'),
  validtodate: date('validtodate'),
  validfromtime: time('validfromtime'),
  validtotime: time('validtotime'),
  expireflag: boolean('expireflag'),
  whilestockslast : boolean('whilestockslast'),
  offerinformation: text('offerinformation'),
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
