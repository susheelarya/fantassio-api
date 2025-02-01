// import { pgTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, integer, varchar, decimal, timestamp, bigint, numeric, date, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"
import { pgTable, primaryKey, unique, integer, serial, varchar, decimal, timestamp, bigint, numeric, date, boolean, 
	//tinyint 
	} from "drizzle-orm/pg-core"

export const generalParameterMaster = pgTable("general_parameter_master", {
	generalParameterId: serial("general_parameter_id").notNull(),
	parameter: varchar("parameter", { length: 100 }),
	parameterKey: varchar("parameter_key", { length: 100 }),
	parameterValue: varchar("parameter_value", { length: 2000 }),
	parameterFlag: varchar("parameter_flag", { length: 10 }),
},
(table) => {
	return {
		generalParameterMasterGeneralParameterId: primaryKey(table.generalParameterId),
		uqGeneralParameterMaster: unique("uq_general_parameter_master").on(table.parameter, table.parameterKey),
	}
});

export const qotdMaster = pgTable("qotdMaster", {
	id: serial("id").notNull(),
	queid: varchar("queid", { length: 4 }),
	quedesc: varchar("quedesc", { length: 500 }),
	qflag: varchar("qflag", { length: 10 }),
},
(table) => {
	return {
		qotdMasterId: primaryKey(table.id),
	}
});

export const resultsAvg = pgTable("resultsAvg", {
	symbol: integer("symbol").notNull(),
	q15D: decimal("Q15D", { precision: 10, scale: 0 }).notNull(),
	q25D: decimal("Q25D", { precision: 10, scale: 0 }).notNull(),
	q35D: decimal("Q35D", { precision: 10, scale: 0 }).notNull(),
	q45D: decimal("Q45D", { precision: 10, scale: 0 }).notNull(),
	q55D: decimal("Q55D", { precision: 10, scale: 0 }).notNull(),
	q65D: decimal("Q65D", { precision: 10, scale: 0 }).notNull(),
	q75D: decimal("Q75D", { precision: 10, scale: 0 }).notNull(),
	q85D: decimal("Q85D", { precision: 10, scale: 0 }).notNull(),
	q130D: decimal("Q130D", { precision: 10, scale: 0 }).notNull(),
	q230D: decimal("Q230D", { precision: 10, scale: 0 }).notNull(),
	q330D: decimal("Q330D", { precision: 10, scale: 0 }).notNull(),
	q430D: decimal("Q430D", { precision: 10, scale: 0 }).notNull(),
	q530D: decimal("Q530D", { precision: 10, scale: 0 }).notNull(),
	q630D: decimal("Q630D", { precision: 10, scale: 0 }).notNull(),
	q730D: decimal("Q730D", { precision: 10, scale: 0 }).notNull(),
	q830D: decimal("Q830D", { precision: 10, scale: 0 }).notNull(),
	date: timestamp("date", { mode: 'string'}).notNull(),
},
(table) => {
	return {
		resultsAvgSymbol: primaryKey(table.symbol),
	}
});

export const resultsMaster = pgTable("resultsMaster", {
	market: varchar("market", { length: 10 }).notNull(),
	securityCode: varchar("securityCode", { length: 45 }).notNull(),
	date: timestamp("date", { mode: 'string'}).notNull(),
	symbol: varchar("symbol", { length: 45 }).notNull(),
	q1: decimal("Q1", { precision: 10, scale: 2 }),
	q2: decimal("Q2", { precision: 10, scale: 2 }),
	q3: decimal("Q3", { precision: 10, scale: 2 }),
	q4: decimal("Q4", { precision: 10, scale: 2 }),
	q5: decimal("Q5", { precision: 10, scale: 2 }),
	q6: decimal("Q6", { precision: 10, scale: 2 }),
	q7: decimal("Q7", { precision: 10, scale: 2 }),
},
(table) => {
	return {
		resultsMasterDateMarketSecurityCode: primaryKey(table.date, table.market, table.securityCode),
	}
});

export const stkMaster = pgTable("stkMaster", {
	market: varchar("market", { length: 10 }).notNull(),
	symbol: varchar("symbol", { length: 45 }).notNull(),
	securityCode: varchar("securityCode", { length: 45 }).notNull(),
	companyName: varchar("companyName", { length: 500 }),
	industryType: varchar("industryType", { length: 45 }),
	stockType: varchar("stockType", { length: 45 }),
	sector: varchar("sector", { length: 45 }),
	industry: varchar("industry", { length: 500 }),
	subIndustry: varchar("subIndustry", { length: 500 }),
	status: varchar("status", { length: 45 }),
},
(table) => {
	return {
		stkMasterMarketSecurityCode: primaryKey(table.market, table.securityCode),
	}
});

export const stockPrice = pgTable("stockPrice", {
	market: varchar("market", { length: 10 }).notNull(),
	symbol: varchar("symbol", { length: 45 }).notNull(),
	securityCode: varchar("securityCode", { length: 45 }).notNull(),
	dateUpdate: timestamp("dateUpdate", { mode: 'string'}).notNull(),
	stockPrice: decimal("stockPrice", { precision: 10, scale: 2 }),
	prevClose: decimal("prevClose", { precision: 10, scale: 2 }),
	prevOpen: decimal("prevOpen", { precision: 10, scale: 2 }),
	dayHigh: decimal("dayHigh", { precision: 10, scale: 2 }),
	dayLow: decimal("dayLow", { precision: 10, scale: 2 }),
	priceChange: decimal("priceChange", { precision: 10, scale: 2 }),
	percChange: decimal("percChange", { precision: 10, scale: 2 }),
	weightedPrice: decimal("weightedPrice", { precision: 10, scale: 2 }),
	week52High: decimal("week52High", { precision: 10, scale: 2 }),
	week52Low: decimal("week52Low", { precision: 10, scale: 2 }),
	fantassioPrice: decimal("fantassioPrice", { precision: 10, scale: 2 }),
},
(table) => {
	return {
		stockPriceDateUpdateMarketSecurityCode: primaryKey(table.dateUpdate, table.market, table.securityCode),
	}
});

export const stockTxns = pgTable("stockTxns", {
	id: serial("ID").notNull(),
	securityCode: varchar("securityCode", { length: 45 }),
	symbol: varchar("symbol", { length: 45 }).notNull(),
	timestamp: timestamp("timestamp", { mode: 'string'}).notNull(),
	prevClose: decimal("prevClose", { precision: 10, scale: 0 }),
	currentValue: decimal("currentValue", { precision: 10, scale: 0 }),
	priceChange: decimal("priceChange", { precision: 10, scale: 0 }),
	dayHigh: decimal("dayHigh", { precision: 10, scale: 0 }),
	dayLow: decimal("dayLow", { precision: 10, scale: 0 }),
	intDayVolatile: decimal("IntDayVolatile", { precision: 10, scale: 0 }),
},
(table) => {
	return {
		stockTxnsId: primaryKey(table.id),
	}
});

export const userMaster = pgTable("userMaster", {
	userId: serial("user_id").notNull(),
	userFirstName: varchar("user_first_name", { length: 800 }),
	userLastName: varchar("user_last_name", { length: 800 }),
	userEmail: varchar("user_email", { length: 100 }),
	userMobile: bigint("user_mobile", { mode: "number" }),
	userCountryCode: varchar("user_country_code", { length: 5 }),
	userOtp: varchar("user_otp", { length: 10 }),
	isUserValidated: varchar("is_user_validated", { length: 1 }),
	isUserEnabled: varchar("is_user_enabled", { length: 1 }),
	userPassword: varchar("user_password", { length: 100 }),
	userVerificationToken: varchar("user_verification_token", { length: 50 }),
	userImageName: varchar("user_image_name", { length: 200 }),
	userInitCoord: varchar("user_init_coord", { length: 100 }),
	userState: varchar("user_state", { length: 100 }),
	userName: varchar("user_name", { length: 800 }),
	phoneverified: varchar("Phoneverified", { length: 50 }),
	pictureverified: varchar("Pictureverified", { length: 50 }),
	inpersonverified: varchar("Inpersonverified", { length: 50 }),
	userGender: varchar("user_gender", { length: 10 }),
	userAgeGroup: varchar("user_age_group", { length: 20 }),
	userLanguage: varchar("user_language", { length: 5 }),
	pushNotificationToken: varchar("pushNotificationToken", { length: 200 }),
	userDevice: varchar("user_device", { length: 50 }),
	userDescription: varchar("user_description", { length: 4000 }),
	dailyNotificationFlag: varchar("daily_notification_flag", { length: 1 }),
	appVersion: varchar("app_version", { length: 10 }),
	socialUserId: varchar("social_user_id", { length: 1000 }),
	socialAuthToken: varchar("social_authToken", { length: 4000 }),
	socialAuthTokenSecret: varchar("social_authTokenSecret", { length: 400 }),
	socialUserName: varchar("social_user_name", { length: 400 }),
	socialDpUrl: varchar("social_dp_url", { length: 400 }),
	loggedInWith: varchar("logged_in_with", { length: 1 }),
	isPaidUser: varchar("is_paid_user", { length: 1 }),
	userPoints: integer("user_points"),
	twitterAuthToken: varchar("twitter_authToken", { length: 400 }),
	twitterAuthTokenSecret: varchar("twitter_authTokenSecret", { length: 400 }),
	twitterDpUrl: varchar("twitter_dp_url", { length: 400 }),
	twitterUserId: varchar("twitter_user_id", { length: 400 }),
	twitterUserName: varchar("twitter_user_name", { length: 400 }),
	userEmail2: varchar("user_email2", { length: 100 }),
	paytmMobile: bigint("paytm_mobile", { mode: "number" }),
	currentScheme: varchar("current_scheme", { length: 100 }),
	createdOn: timestamp("created_on", { mode: 'string'}),
	financialStatus: varchar("financial_status", { length: 30 }),
	currSchemeValidUpto: timestamp("curr_scheme_valid_upto", { mode: 'string'}),
	currSchemeAmtPaid: numeric("curr_scheme_amt_paid"),
	currSchemePurchaseDate: timestamp("curr_scheme_purchase_date", { mode: 'string'}),
	aadharImageFront: varchar("aadhar_image_front", { length: 200 }),
	aadharImageBack: varchar("aadhar_image_back", { length: 200 }),
	panImageFront: varchar("pan_image_front", { length: 200 }),
	isAadharValidated: varchar("is_aadhar_validated", { length: 1 }),
	isPanValidated: varchar("is_pan_validated", { length: 1 }),
},
(table) => {
	return {
		userMasterUserId: primaryKey(table.userId),
	}
});

export const userStockTxns = pgTable("userStockTxns", {
	userId: integer("userId").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	date: date("date", { mode: 'string' }).notNull(),
	q1Symbol: varchar("Q1Symbol", { length: 45 }),
	q2Symbol: varchar("Q2Symbol", { length: 45 }),
	q3Symbol: varchar("Q3Symbol", { length: 45 }),
	q4Symbol: varchar("Q4Symbol", { length: 45 }),
	q5Symbol: varchar("Q5Symbol", { length: 45 }),
	q6Symbol: varchar("Q6Symbol", { length: 45 }),
	q7Symbol: varchar("Q7Symbol", { length: 45 }),
	q8Symbol: varchar("Q8Symbol", { length: 45 }),
},
(table) => {
	return {
		userStockTxnsDateUserId: primaryKey(table.date, table.userId),
	}
});

export const validMarkets = pgTable("validMarkets", {
	id: integer("ID").notNull(),
	mktSymbol: varchar("mktSymbol", { length: 45 }),
	mktLongName: varchar("mktLongName", { length: 45 }),
	mktInformation: varchar("mktInformation", { length: 45 }),
	isActive: boolean("isActive"),
},
(table) => {
	return {
		validMarketsId: primaryKey(table.id),
	}
});