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
import { userMaster } from './user';

export const loyaltySchemeType = pgTable('loyalty_scheme_type', {
  loyaltyschemetypeid: serial('loyaltyschemetypeid').primaryKey(),
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
  loyaltyschemename: text('loyaltyschemename'),
});

export const loyaltySchemeShopMapping = pgTable('loyalty_scheme_shop_mapping', {
  useridshop: integer('useridshop'),
  loyaltyschemeid: integer('loyaltyschemeid').references(
    () => loyaltySchemeMaster.loyaltyschemeid
  ),
  mapid: serial('mapid').primaryKey(),
  validfromdate: date('validfromdate'),
  validtodate: date('validtodate'),
  expireflag: boolean('expireflag'),
  expiremonths: integer('expiremonths'),
  redeemfrequency: text('redeemfrequency'),
});

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
