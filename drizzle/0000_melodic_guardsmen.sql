CREATE TABLE IF NOT EXISTS "general_parameter_master" (
	"general_parameter_id" serial NOT NULL,
	"parameter" varchar(100),
	"parameter_key" varchar(100),
	"parameter_value" varchar(2000),
	"parameter_flag" varchar(10),
	CONSTRAINT general_parameter_master_general_parameter_id PRIMARY KEY("general_parameter_id"),
	CONSTRAINT "uq_general_parameter_master" UNIQUE("parameter","parameter_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qotdMaster" (
	"id" serial NOT NULL,
	"queid" varchar(4),
	"quedesc" varchar(500),
	"qflag" varchar(10),
	CONSTRAINT qotdMaster_id PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resultsAvg" (
	"symbol" integer NOT NULL,
	"Q15D" numeric(10, 0) NOT NULL,
	"Q25D" numeric(10, 0) NOT NULL,
	"Q35D" numeric(10, 0) NOT NULL,
	"Q45D" numeric(10, 0) NOT NULL,
	"Q55D" numeric(10, 0) NOT NULL,
	"Q65D" numeric(10, 0) NOT NULL,
	"Q75D" numeric(10, 0) NOT NULL,
	"Q85D" numeric(10, 0) NOT NULL,
	"Q130D" numeric(10, 0) NOT NULL,
	"Q230D" numeric(10, 0) NOT NULL,
	"Q330D" numeric(10, 0) NOT NULL,
	"Q430D" numeric(10, 0) NOT NULL,
	"Q530D" numeric(10, 0) NOT NULL,
	"Q630D" numeric(10, 0) NOT NULL,
	"Q730D" numeric(10, 0) NOT NULL,
	"Q830D" numeric(10, 0) NOT NULL,
	"date" timestamp NOT NULL,
	CONSTRAINT resultsAvg_symbol PRIMARY KEY("symbol")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resultsMaster" (
	"market" varchar(10) NOT NULL,
	"securityCode" varchar(45) NOT NULL,
	"date" timestamp NOT NULL,
	"symbol" varchar(45) NOT NULL,
	"Q1" numeric(10, 2),
	"Q2" numeric(10, 2),
	"Q3" numeric(10, 2),
	"Q4" numeric(10, 2),
	"Q5" numeric(10, 2),
	"Q6" numeric(10, 2),
	"Q7" numeric(10, 2),
	CONSTRAINT resultsMaster_date_market_securityCode PRIMARY KEY("date","market","securityCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stkMaster" (
	"market" varchar(25) NOT NULL,
	"symbol" varchar(45) NOT NULL,
	"securityCode" varchar(45) NOT NULL,
	"companyName" varchar(500),
	"industryType" varchar(45),
	"stockType" varchar(45),
	"sector" varchar(45),
	"industry" varchar(500),
	"subIndustry" varchar(500),
	"status" varchar(45),
	CONSTRAINT stkMaster_market_securityCode PRIMARY KEY("market","securityCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stockPrice" (
	"market" varchar(10) NOT NULL,
	"symbol" varchar(45) NOT NULL,
	"securityCode" varchar(45) NOT NULL,
	"dateUpdate" timestamp NOT NULL,
	"stockPrice" numeric(10, 2),
	"prevClose" numeric(10, 2),
	"prevOpen" numeric(10, 2),
	"dayHigh" numeric(10, 2),
	"dayLow" numeric(10, 2),
	"priceChange" numeric(10, 2),
	"percChange" numeric(10, 2),
	"weightedPrice" numeric(10, 2),
	"week52High" numeric(10, 2),
	"week52Low" numeric(10, 2),
	"fantassioPrice" numeric(10, 2),
	CONSTRAINT stockPrice_dateUpdate_market_securityCode PRIMARY KEY("dateUpdate","market","securityCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stockTxns" (
	"ID" serial NOT NULL,
	"securityCode" varchar(45),
	"symbol" varchar(45) NOT NULL,
	"timestamp" timestamp NOT NULL,
	"prevClose" numeric(10, 0),
	"currentValue" numeric(10, 0),
	"priceChange" numeric(10, 0),
	"dayHigh" numeric(10, 0),
	"dayLow" numeric(10, 0),
	"IntDayVolatile" numeric(10, 0),
	CONSTRAINT stockTxns_ID PRIMARY KEY("ID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userMaster" (
	"user_id" serial NOT NULL,
	"user_first_name" varchar(800),
	"user_last_name" varchar(800),
	"user_email" varchar(100),
	"user_mobile" bigint,
	"user_country_code" varchar(5),
	"user_otp" varchar(10),
	"is_user_validated" varchar(1),
	"is_user_enabled" varchar(1),
	"user_password" varchar(100),
	"user_verification_token" varchar(50),
	"user_image_name" varchar(200),
	"user_init_coord" varchar(100),
	"user_state" varchar(100),
	"user_name" varchar(800),
	"Phoneverified" varchar(50),
	"Pictureverified" varchar(50),
	"Inpersonverified" varchar(50),
	"user_gender" varchar(10),
	"user_age_group" varchar(20),
	"user_language" varchar(5),
	"pushNotificationToken" varchar(200),
	"user_device" varchar(50),
	"user_description" varchar(4000),
	"daily_notification_flag" varchar(1),
	"app_version" varchar(10),
	"social_user_id" varchar(1000),
	"social_authToken" varchar(4000),
	"social_authTokenSecret" varchar(400),
	"social_user_name" varchar(400),
	"social_dp_url" varchar(400),
	"logged_in_with" varchar(1),
	"is_paid_user" varchar(1),
	"user_points" integer,
	"twitter_authToken" varchar(400),
	"twitter_authTokenSecret" varchar(400),
	"twitter_dp_url" varchar(400),
	"twitter_user_id" varchar(400),
	"twitter_user_name" varchar(400),
	"user_email2" varchar(100),
	"paytm_mobile" bigint,
	"current_scheme" varchar(100),
	"created_on" timestamp,
	"financial_status" varchar(30),
	"curr_scheme_valid_upto" timestamp,
	"curr_scheme_amt_paid" numeric,
	"curr_scheme_purchase_date" timestamp,
	"aadhar_image_front" varchar(200),
	"aadhar_image_back" varchar(200),
	"pan_image_front" varchar(200),
	"is_aadhar_validated" varchar(1),
	"is_pan_validated" varchar(1),
	CONSTRAINT userMaster_user_id PRIMARY KEY("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userStockTxns" (
	"userId" integer NOT NULL,
	"date" date NOT NULL,
	"Q1Symbol" varchar(45),
	"Q2Symbol" varchar(45),
	"Q3Symbol" varchar(45),
	"Q4Symbol" varchar(45),
	"Q5Symbol" varchar(45),
	"Q6Symbol" varchar(45),
	"Q7Symbol" varchar(45),
	"Q8Symbol" varchar(45),
	CONSTRAINT userStockTxns_date_userId PRIMARY KEY("date","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validMarkets" (
	"ID" integer NOT NULL,
	"mktSymbol" varchar(45),
	"mktLongName" varchar(45),
	"mktInformation" varchar(45),
	"isActive" boolean,
	CONSTRAINT validMarkets_ID PRIMARY KEY("ID")
);
