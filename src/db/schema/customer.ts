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
