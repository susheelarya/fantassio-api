import { dbConnect } from '../hichers-api/src/db/dbConnect'
import { userType, shopType, questionType, options, offerType, loyaltySchemeType, parametersTable, offerMaster, loyaltySchemeMaster, questions } from '../hichers-api/src/db/schema/user';


const inserts = async () => {
    const db = await dbConnect();
    db.insert(userType).values({description: 'M'});
    db.insert(userType).values({description: 'S'});

    db.insert(shopType).values({description: 'Bar'});
    db.insert(shopType).values({description: 'Cafe'});
    db.insert(shopType).values({description: 'Cake Shop'});
    db.insert(shopType).values({description: 'Grocery'});
    db.insert(shopType).values({description: 'Hair Salon'});
    db.insert(shopType).values({description: 'Nails'});
    db.insert(shopType).values({description: 'Parlour'});
    db.insert(shopType).values({description: 'Newsagent'});
    db.insert(shopType).values({description: 'Flowerist'});
    db.insert(shopType).values({description: 'Stationery'});
    db.insert(shopType).values({description: 'Restaurant'});
    db.insert(shopType).values({description: 'Wine Shop'});
    db.insert(questionType).values({questiontypeid: 1, questiontype: "R", questiontypedesc : "Multiple Choice"});
    db.insert(questionType).values({questiontypeid: 2, questiontype: "C", questiontypedesc : "Multiple Options"});
    db.insert(questions).values({questionid: 1, questiontypeid: 1, questiontext : "Are you a?"});
    db.insert(questions).values({questionid: 2, questiontypeid: 1, questiontext : "How many franchises do you have?"});
    db.insert(options).values({questionid: 1, optiontext: 'Highstreet Shop'});
    db.insert(options).values({questionid: 1, optiontext: 'Corner Shop'});
    db.insert(options).values({questionid: 1, optiontext: 'Shop in a Shopping Mall'});
    db.insert(options).values({questionid: 1, optiontext: 'Shop at the Retail Park'});
    db.insert(options).values({questionid: 2, optiontext: 'None'});
    db.insert(options).values({questionid: 2, optiontext: '1'});
    db.insert(options).values({questionid: 2, optiontext: '2'});
    db.insert(options).values({questionid: 2, optiontext: '3'});
    db.insert(options).values({questionid: 2, optiontext: '4'});
    db.insert(options).values({questionid: 2, optiontext: '5'});
    db.insert(options).values({questionid: 2, optiontext: 'More than 5'});

    db.insert(offerType).values({offertypeid: 1, description: 'Buy One Get One'});
    db.insert(offerType).values({offertypeid: 2, description: 'Percentage Discount'});
    db.insert(offerType).values({offertypeid: 3, description: 'Cash Discount'});
    db.insert(offerType).values({offertypeid: 4, description: 'Minimum Spend'});
    db.insert(offerType).values({offertypeid: 5, description: 'Multi Buy'});
    db.insert(offerType).values({offertypeid: 6, description: 'Flash Sales'});

    db.insert(loyaltySchemeType).values({loyaltyschemetypeid: 1, description: 'Cashback'});
    db.insert(loyaltySchemeType).values({loyaltyschemetypeid: 2, description: 'Vouchers'});
    db.insert(loyaltySchemeType).values({loyaltyschemetypeid: 3, description: 'Stamps'});

    db.insert(parametersTable).values({parameter: 'Redeem Frequency', paramkey: 'm', paramvalue: 'monthly'});
    db.insert(parametersTable).values({parameter: 'Redeem Frequency', paramkey: 'q', paramvalue: 'quarterly'});
    db.insert(parametersTable).values({parameter: 'Redeem Frequency', paramkey: 'y', paramvalue: 'yearly'});
    db.insert(parametersTable).values({parameter: 'Redeem Frequency', paramkey: 'a', paramvalue: 'any time'});
    db.insert(parametersTable).values({parameter: 'Points Conversion', paramkey: '£ spent', paramvalue: 'Amount Spent'});
    db.insert(parametersTable).values({parameter: 'Points Conversion', paramkey: 'Pts Col', paramvalue: 'Points Collected'});
    db.insert(parametersTable).values({parameter: 'Points Conversion', paramkey: 'Pts spent', paramvalue: 'Points Spent'});
    db.insert(parametersTable).values({parameter: 'Points Conversion', paramkey: '£ col', paramvalue: 'Amount Collected'});
    db.insert(parametersTable).values({parameter: 'Stamps Conversion', paramkey: 'Stmp Col', paramvalue: 'Stamps Collected'});
    db.insert(parametersTable).values({parameter: 'Stamps Conversion', paramkey: 'Free', paramvalue: 'Items Free'});




    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '10', moneyfrompoints: '1', redeemfrequency: 'monthly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Ten Points One Monthly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '10', moneyfrompoints: '1', redeemfrequency: 'quarterly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Ten Points One Quarterly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '10', moneyfrompoints: '1', redeemfrequency: 'yearly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Ten Points One Yearly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '10', moneyfrompoints: '1', redeemfrequency: 'any time', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Ten Points One Any Time', expireflag: false});

    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '50', moneyfrompoints: '1', redeemfrequency: 'monthly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Fifty Points One Monthly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '50', moneyfrompoints: '1', redeemfrequency: 'quarterly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Fifty Points One Quarterly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '50', moneyfrompoints: '1', redeemfrequency: 'yearly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Fifty Points One Yearly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '50', moneyfrompoints: '1', redeemfrequency: 'any time', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Fifty Points One Any Time', expireflag: false});

    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '100', moneyfrompoints: '1', redeemfrequency: 'monthly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Hundred Points One Monthly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '100', moneyfrompoints: '1', redeemfrequency: 'quarterly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Hundred Points One Quarterly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '100', moneyfrompoints: '1', redeemfrequency: 'yearly', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Hundred Points One Yearly', expireflag: false});
    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 1, moneyforpoints: '1', pointsfrommoney: '1', pointstoredeem : '100', moneyfrompoints: '1', redeemfrequency: 'any time', predefined: true, expiremonths: 36, validfromdate: '2023-10-01', loyaltyschemename: 'Hundred Points One Any Time', expireflag: false});

    db.insert(loyaltySchemeMaster).values({loyaltyschemetypeid: 3, moneyforpoints: '1', stampstocollect: '10', freeitems : '1', predefined: true, validfromdate: '2023-10-01', loyaltyschemename: 'Collect 10 Stamps', expireflag: false});


    db.insert(offerMaster).values({offertypeid: 1, description: 'Buy One Get One Free', buyitem: 1, freeitem : 1, validity: '2023-10-01', validflag: true, predefined: true});
    db.insert(offerMaster).values({offertypeid: 2, description: '10% Off', percentagediscount: '10', validity: '2023-10-01', validflag: true, predefined: true});
    db.insert(offerMaster).values({offertypeid: 3, description: '£10 Off', cashdiscount: '10', validity: '2023-10-01', validflag: true, predefined: true});
    db.insert(offerMaster).values({offertypeid: 4, description: 'Minimum Spend 25 Get 10% off', minspend: '25', percentagediscount : '10', validity: '2023-10-01', validflag: true, predefined: true});
    db.insert(offerMaster).values({offertypeid: 4, description: 'Minimum Spend 25 Get £5 off', minspend: '25', cashdiscount : '5', validity: '2023-10-01', validflag: true, predefined: true});
    db.insert(offerMaster).values({offertypeid: 5, description: 'Buy 3 Get 1 Free', buyitem: 3, freeitem : 1, validity: '2023-10-01', validflag: true, predefined: true});
    db.insert(offerMaster).values({offertypeid: 5, description: 'Buy 4 Get 10% Off', buyitem: 4, percentagediscount : '10', validity: '2023-10-01', validflag: true, predefined: true});
    db.insert(offerMaster).values({offertypeid: 5, description: 'Buy 5 Get £5 Off', buyitem: 5, cashdiscount : '5', validity: '2023-10-01', validflag: true, predefined: true});

}




