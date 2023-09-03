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
import { productMaster } from './shop';

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
  validtodate: date('validtodate'),
  validfromtime: time('validfromtime'),
  validtotime: time('validtotime'),
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
