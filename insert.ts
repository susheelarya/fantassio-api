require('dotenv').config();

import { dbConnect } from '../hichers-api/src/db/dbConnect';
import {
  userType,
  shopType,
  questionType,
  options,
  offerType,
  loyaltySchemeType,
  parametersTable,
  offerMaster,
  loyaltySchemeMaster,
  questions,
} from '../hichers-api/src/db/schema';

const inserts = async () => {
  const db = await dbConnect();
  await db.insert(userType).values({ description: 'M' });
  await db.insert(userType).values({ description: 'S' });

  await db.insert(shopType).values({ description: 'Bar' });
  await db.insert(shopType).values({ description: 'Cafe' });
  await db.insert(shopType).values({ description: 'Cake Shop' });
  await db.insert(shopType).values({ description: 'Grocery' });
  await db.insert(shopType).values({ description: 'Hair Salon' });
  await db.insert(shopType).values({ description: 'Nails' });
  await db.insert(shopType).values({ description: 'Parlour' });
  await db.insert(shopType).values({ description: 'Newsagent' });
  await db.insert(shopType).values({ description: 'Flowerist' });
  await db.insert(shopType).values({ description: 'Stationery' });
  await db.insert(shopType).values({ description: 'Restaurant' });
  await db.insert(shopType).values({ description: 'Wine Shop' });
  await db.insert(questionType).values({
    questiontypeid: 1,
    questiontype: 'R',
    questiontypedesc: 'Multiple Choice',
  });
  await db.insert(questionType).values({
    questiontypeid: 2,
    questiontype: 'C',
    questiontypedesc: 'Multiple Options',
  });
  await db.insert(questions).values({
    questionid: 1,
    questiontypeid: 1,
    questiontext: 'Are you a?',
  });
  await db.insert(questions).values({
    questionid: 2,
    questiontypeid: 1,
    questiontext: 'How many franchises do you have?',
  });
  await db
    .insert(options)
    .values({ questionid: 1, optiontext: 'Highstreet Shop' });
  await db.insert(options).values({ questionid: 1, optiontext: 'Corner Shop' });
  await db.insert(options).values({
    questionid: 1,
    optiontext: 'Shop in a Shopping Mall',
  });
  await db.insert(options).values({
    questionid: 1,
    optiontext: 'Shop at the Retail Park',
  });
  await db.insert(options).values({ questionid: 2, optiontext: 'None' });
  await db.insert(options).values({ questionid: 2, optiontext: '1' });
  await db.insert(options).values({ questionid: 2, optiontext: '2' });
  await db.insert(options).values({ questionid: 2, optiontext: '3' });
  await db.insert(options).values({ questionid: 2, optiontext: '4' });
  await db.insert(options).values({ questionid: 2, optiontext: '5' });
  await db.insert(options).values({ questionid: 2, optiontext: 'More than 5' });

  await db.insert(offerType).values({
    offertypeid: 1,
    description: 'Buy One Get One',
  });
  await db.insert(offerType).values({
    offertypeid: 2,
    description: 'Percentage Discount',
  });
  await db
    .insert(offerType)
    .values({ offertypeid: 3, description: 'Cash Discount' });
  await db
    .insert(offerType)
    .values({ offertypeid: 4, description: 'Minimum Spend' });
  await db
    .insert(offerType)
    .values({ offertypeid: 5, description: 'Multi Buy' });
  await db
    .insert(offerType)
    .values({ offertypeid: 6, description: 'Flash Sales' });

  await db.insert(loyaltySchemeType).values({
    loyaltyschemetypeid: 1,
    description: 'Cashback',
  });
  await db.insert(loyaltySchemeType).values({
    loyaltyschemetypeid: 2,
    description: 'Vouchers',
  });
  await db.insert(loyaltySchemeType).values({
    loyaltyschemetypeid: 3,
    description: 'Stamps',
  });

  await db.insert(parametersTable).values({
    parameter: 'Redeem Frequency',
    paramkey: 'm',
    paramvalue: 'monthly',
  });
  await db.insert(parametersTable).values({
    parameter: 'Redeem Frequency',
    paramkey: 'q',
    paramvalue: 'quarterly',
  });
  await db.insert(parametersTable).values({
    parameter: 'Redeem Frequency',
    paramkey: 'y',
    paramvalue: 'yearly',
  });
  await db.insert(parametersTable).values({
    parameter: 'Redeem Frequency',
    paramkey: 'a',
    paramvalue: 'any time',
  });
  await db.insert(parametersTable).values({
    parameter: 'Points Conversion',
    paramkey: '£ spent',
    paramvalue: 'Amount Spent',
  });
  await db.insert(parametersTable).values({
    parameter: 'Points Conversion',
    paramkey: 'Pts Col',
    paramvalue: 'Points Collected',
  });
  await db.insert(parametersTable).values({
    parameter: 'Points Conversion',
    paramkey: 'Pts spent',
    paramvalue: 'Points Spent',
  });
  await db.insert(parametersTable).values({
    parameter: 'Points Conversion',
    paramkey: '£ col',
    paramvalue: 'Amount Collected',
  });
  await db.insert(parametersTable).values({
    parameter: 'Stamps Conversion',
    paramkey: 'Stmp Col',
    paramvalue: 'Stamps Collected',
  });

  await db.insert(parametersTable).values({
    parameter: 'Stamps Conversion',
    paramkey: 'Free',
    paramvalue: 'Items Free',
  });

  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'monthly',
    predefined: true,
    loyaltyschemename: 'Ten Points One Monthly',
  });

  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'monthly',
    predefined: true,
    loyaltyschemename: 'Ten Points One Monthly',
  });

  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'quarterly',
    predefined: true,
    loyaltyschemename: 'Ten Points One Quarterly',
  });

  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'yearly',
    predefined: true,
    loyaltyschemename: 'Ten Points One Yearly',
  });
  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'any time',
    predefined: true,
    loyaltyschemename: 'Ten Points One Any Time',
  });

  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'monthly',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Monthly',
  });

  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'quarterly',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Quarterly',
  });
  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'yearly',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Yearly',
  });
  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'any time',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Any Time',
  });

  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'monthly',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Monthly',
  });
  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'quarterly',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Quarterly',
  });
  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'yearly',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Yearly',
  });
  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'any time',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Any Time',
  });

  await db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 3,
    moneyforpoints: '1',
    stampstocollect: '10',
    freeitems: '1',
    predefined: true,
    loyaltyschemename: 'Collect 10 Stamps',
  });

  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'monthly',
    predefined: true,
    loyaltyschemename: 'Ten Points One Monthly',
  });

  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'quarterly',
    predefined: true,
    loyaltyschemename: 'Ten Points One Quarterly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'yearly',
    predefined: true,
    loyaltyschemename: 'Ten Points One Yearly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '10',
    moneyfrompoints: '1',
    redeemfrequency: 'any time',
    predefined: true,
    loyaltyschemename: 'Ten Points One Any Time',
  });

  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'monthly',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Monthly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'quarterly',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Quarterly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'yearly',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Yearly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '50',
    moneyfrompoints: '1',
    redeemfrequency: 'any time',
    predefined: true,
    loyaltyschemename: 'Fifty Points One Any Time',
  });

  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'monthly',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Monthly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'quarterly',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Quarterly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'yearly',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Yearly',
  });
  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 1,
    moneyforpoints: '1',
    pointsfrommoney: '1',
    pointstoredeem: '100',
    moneyfrompoints: '1',
    redeemfrequency: 'any time',
    predefined: true,
    loyaltyschemename: 'Hundred Points One Any Time',
  });

  db.insert(loyaltySchemeMaster).values({
    loyaltyschemetypeid: 3,
    moneyforpoints: '1',
    stampstocollect: '10',
    freeitems: '1',
    predefined: true,
    loyaltyschemename: 'Collect 10 Stamps',
  });

  db.insert(offerMaster).values({
    offertypeid: 1,
    description: 'Buy One Get One Free',
    buyitem: 1,
    freeitem: 1,
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  db.insert(offerMaster).values({
    offertypeid: 2,
    description: '10% Off',
    percentagediscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  db.insert(offerMaster).values({
    offertypeid: 3,
    description: '£10 Off',
    cashdiscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  db.insert(offerMaster).values({
    offertypeid: 4,
    description: 'Minimum Spend 25 Get 10% off',
    minspend: '25',
    percentagediscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  db.insert(offerMaster).values({
    offertypeid: 4,
    description: 'Minimum Spend 25 Get £5 off',
    minspend: '25',
    cashdiscount: '5',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  db.insert(offerMaster).values({
    offertypeid: 5,
    description: 'Buy 3 Get 1 Free',
    buyitem: 3,
    freeitem: 1,
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  db.insert(offerMaster).values({
    offertypeid: 5,
    description: 'Buy 4 Get 10% Off',
    buyitem: 4,
    percentagediscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  db.insert(offerMaster).values({
    offertypeid: 5,
    description: 'Buy 5 Get £5 Off',
    buyitem: 5,
    cashdiscount: '5',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });

  await db.insert(offerMaster).values({
    offertypeid: 1,
    description: 'Buy One Get One Free',
    buyitem: 1,
    freeitem: 1,
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(offerMaster).values({
    offertypeid: 2,
    description: '10% Off',
    percentagediscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(offerMaster).values({
    offertypeid: 3,
    description: '£10 Off',
    cashdiscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(offerMaster).values({
    offertypeid: 4,
    description: 'Minimum Spend 25 Get 10% off',
    minspend: '25',
    percentagediscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(offerMaster).values({
    offertypeid: 4,
    description: 'Minimum Spend 25 Get £5 off',
    minspend: '25',
    cashdiscount: '5',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(offerMaster).values({
    offertypeid: 5,
    description: 'Buy 3 Get 1 Free',
    buyitem: 3,
    freeitem: 1,
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(offerMaster).values({
    offertypeid: 5,
    description: 'Buy 4 Get 10% Off',
    buyitem: 4,
    percentagediscount: '10',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(offerMaster).values({
    offertypeid: 5,
    description: 'Buy 5 Get £5 Off',
    buyitem: 5,
    cashdiscount: '5',
    validity: '2023-10-01',
    validflag: true,
    predefined: true,
  });
  await db.insert(parametersTable).values({
    parameter: 'Buy One Get One',
    paramkey: 'name',
    paramvalue: 'Offer Name'
  });
  await db.insert(parametersTable).values({
    parameter: 'Buy One Get One',
    paramkey: 'from',
    paramvalue: 'Valid From'
  });
  await db.insert(parametersTable).values({
    parameter: 'Buy One Get One',
    paramkey: 'to',
    paramvalue: 'Valid Up To'
  });
  await db.insert(parametersTable).values({
    parameter: 'Buy One Get One',
    paramkey: 'buying',
    paramvalue: 'No. Items Buying'
  });
  await db.insert(parametersTable).values({
    parameter: 'Buy One Get One',
    paramkey: 'free',
    paramvalue: 'No. Items Free'
  });
  await db.insert(parametersTable).values({
    parameter: 'Buy One Get One',
    paramkey: 'info',
    paramvalue: 'Offer Information'
  });
  await db.insert(parametersTable).values({
    parameter: 'Buy One Get One',
    paramkey: 'stocks',
    paramvalue: 'While Stocks Last'
  });
  await db.insert(parametersTable).values({
    parameter: 'Percentage Discount',
    paramkey: 'name',
    paramvalue: 'Offer Name'
  });
  await db.insert(parametersTable).values({
    parameter: 'Percentage Discount',
    paramkey: 'from',
    paramvalue: 'Valid From'
  });
  await db.insert(parametersTable).values({
    parameter: 'Percentage Discount',
    paramkey: 'to',
    paramvalue: 'Valid Up To'
  });
  await db.insert(parametersTable).values({
    parameter: 'Percentage Discount',
    paramkey: '%',
    paramvalue: '% Off'
  });
  await db.insert(parametersTable).values({
    parameter: 'Percentage Discount',
    paramkey: 'info',
    paramvalue: 'Offer Information'
  });
  await db.insert(parametersTable).values({
    parameter: 'Percentage Discount',
    paramkey: 'stocks',
    paramvalue: 'While Stocks Last'
  });
  await db.insert(parametersTable).values({
    parameter: 'Cash Discount',
    paramkey: 'name',
    paramvalue: 'Offer Name'
  });
  await db.insert(parametersTable).values({
    parameter: 'Cash Discount',
    paramkey: 'from',
    paramvalue: 'Valid From'
  });
  await db.insert(parametersTable).values({
    parameter: 'Cash Discount',
    paramkey: 'to',
    paramvalue: 'Valid Up To'
  });
  await db.insert(parametersTable).values({
    parameter: 'Cash Discount',
    paramkey: '£',
    paramvalue: '£ Off'
  });
  await db.insert(parametersTable).values({
    parameter: 'Cash Discount',
    paramkey: 'info',
    paramvalue: 'Offer Information'
  });
  await db.insert(parametersTable).values({
    parameter: 'Cash Discount',
    paramkey: 'stocks',
    paramvalue: 'While Stocks Last'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: 'name',
    paramvalue: 'Offer Name'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: 'from',
    paramvalue: 'Valid From'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: 'to',
    paramvalue: 'Valid Up To'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: '£',
    paramvalue: '£ Off'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: '%',
    paramvalue: '% Off'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: 'min spend',
    paramvalue: 'Minimum Spend'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: 'info',
    paramvalue: 'Offer Information'
  });
  await db.insert(parametersTable).values({
    parameter: 'Minimum Spend',
    paramkey: 'stocks',
    paramvalue: 'While Stocks Last'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: 'name',
    paramvalue: 'Offer Name'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: 'from',
    paramvalue: 'Valid From'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: 'to',
    paramvalue: 'Valid Up To'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: '£',
    paramvalue: '£ Off'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: '%',
    paramvalue: '% Off'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: 'buying',
    paramvalue: 'No. Items Buying'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: 'free',
    paramvalue: 'No. Items Free'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: 'info',
    paramvalue: 'Offer Information'
  });
  await db.insert(parametersTable).values({
    parameter: 'Multi Buy',
    paramkey: 'stocks',
    paramvalue: 'While Stocks Last'
  });

};

inserts()
  .then(() => {
    console.log('Inserted records');
    process.exit();
  })
  .catch((error) => {
    console.log('Error inserting fields');
    console.error(error);
    process.exit();
  });