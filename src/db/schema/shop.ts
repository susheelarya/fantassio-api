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
import { loyaltySchemeMaster } from './loyalty';

export const shopType = pgTable('shop_type', {
  shoptypeid: serial('shoptypeid').primaryKey(),
  description: text('description'),
});

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

export const productMaster = pgTable('product_master', {
  productid: serial('productid').primaryKey().notNull(),
  productdescription: text('productdescription'),
  productpicture: text('productpicture'),
});
