-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE IF NOT EXISTS `resultsAvg` (
	`symbol` int NOT NULL,
	`Q15D` decimal(10,0) NOT NULL,
	`Q25D` decimal(10,0) NOT NULL,
	`Q35D` decimal(10,0) NOT NULL,
	`Q45D` decimal(10,0) NOT NULL,
	`Q55D` decimal(10,0) NOT NULL,
	`Q65D` decimal(10,0) NOT NULL,
	`Q75D` decimal(10,0) NOT NULL,
	`Q85D` decimal(10,0) NOT NULL,
	`Q130D` decimal(10,0) NOT NULL,
	`Q230D` decimal(10,0) NOT NULL,
	`Q330D` decimal(10,0) NOT NULL,
	`Q430D` decimal(10,0) NOT NULL,
	`Q530D` decimal(10,0) NOT NULL,
	`Q630D` decimal(10,0) NOT NULL,
	`Q730D` decimal(10,0) NOT NULL,
	`Q830D` decimal(10,0) NOT NULL,
	`date` datetime NOT NULL,
	CONSTRAINT `resultsAvg_symbol` PRIMARY KEY(`symbol`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `resultsMaster` (
	`market` varchar(10) NOT NULL,
	`securityCode` varchar(45) NOT NULL,
	`date` datetime NOT NULL,
	`symbol` varchar(45) NOT NULL,
	`Q1` decimal(10,2),
	`Q2` decimal(10,2),
	`Q3` decimal(10,2),
	`Q4` decimal(10,2),
	`Q5` decimal(10,2),
	`Q6` decimal(10,2),
	`Q7` decimal(10,2),
	CONSTRAINT `resultsMaster_date_market_securityCode` PRIMARY KEY(`date`,`market`,`securityCode`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `stkMaster` (
	`market` varchar(10) NOT NULL,
	`symbol` varchar(45) NOT NULL,
	`securityCode` varchar(45) NOT NULL,
	`companyName` varchar(500),
	`industryType` varchar(45),
	`stockType` varchar(45),
	`sector` varchar(45),
	`industry` varchar(500),
	`subIndustry` varchar(500),
	`status` varchar(45),
	CONSTRAINT `stkMaster_market_securityCode` PRIMARY KEY(`market`,`securityCode`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `stockPrice` (
	`market` varchar(10) NOT NULL,
	`symbol` varchar(45) NOT NULL,
	`securityCode` varchar(45) NOT NULL,
	`dateUpdate` datetime NOT NULL,
	`stockPrice` decimal(10,2),
	`prevClose` decimal(10,2),
	`prevOpen` decimal(10,2),
	`dayHigh` decimal(10,2),
	`dayLow` decimal(10,2),
	`priceChange` decimal(10,2),
	`percChange` decimal(10,2),
	`weightedPrice` decimal(10,2),
	`52weekHigh` decimal(10,2),
	`52weekLow` decimal(10,2),
	`fantassioPrice` decimal(10,2),
	CONSTRAINT `stockPrice_dateUpdate_market_securityCode` PRIMARY KEY(`dateUpdate`,`market`,`securityCode`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `stockTxns` (
	`ID` int AUTO_INCREMENT NOT NULL,
	`securityCode` varchar(45),
	`symbol` varchar(45) NOT NULL,
	`dateTime` datetime NOT NULL,
	`prevClose` decimal(10,0),
	`currentValue` decimal(10,0),
	`priceChange` decimal(10,0),
	`dayHigh` decimal(10,0),
	`dayLow` decimal(10,0),
	`IntDayVolatile` decimal(10,0),
	CONSTRAINT `stockTxns_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `userMaster` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`user_first_name` varchar(800),
	`user_last_name` varchar(800),
	`user_email` varchar(100),
	`user_mobile` bigint,
	`user_country_code` varchar(5),
	`user_otp` varchar(10),
	`is_user_validated` varchar(1),
	`is_user_enabled` varchar(1),
	`user_password` varchar(100),
	`user_verification_token` varchar(50),
	`user_image_name` varchar(200),
	`user_init_coord` varchar(100),
	`user_state` varchar(100),
	`user_name` varchar(800),
	`Phoneverified` varchar(50),
	`Pictureverified` varchar(50),
	`Inpersonverified` varchar(50),
	`user_gender` varchar(10),
	`user_age_group` varchar(20),
	`user_language` varchar(5),
	`pushNotificationToken` varchar(200),
	`user_device` varchar(50),
	`user_description` varchar(4000),
	`daily_notification_flag` varchar(1),
	`app_version` varchar(10),
	`social_user_id` varchar(1000),
	`social_authToken` varchar(4000),
	`social_authTokenSecret` varchar(400),
	`social_user_name` varchar(400),
	`social_dp_url` varchar(400),
	`logged_in_with` varchar(1),
	`is_paid_user` varchar(1),
	`user_points` int,
	`twitter_authToken` varchar(400),
	`twitter_authTokenSecret` varchar(400),
	`twitter_dp_url` varchar(400),
	`twitter_user_id` varchar(400),
	`twitter_user_name` varchar(400),
	`user_email2` varchar(100),
	`paytm_mobile` bigint,
	`current_scheme` varchar(100),
	`created_on` datetime,
	`financial_status` varchar(30),
	`curr_scheme_valid_upto` datetime,
	`curr_scheme_amt_paid` float,
	`curr_scheme_purchase_date` datetime,
	CONSTRAINT `userMaster_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `userStockTxns` (
	`userId` int NOT NULL,
	`date` date NOT NULL,
	`Q1Symbol` varchar(45),
	`Q2Symbol` varchar(45),
	`Q3Symbol` varchar(45),
	`Q4Symbol` varchar(45),
	`Q5Symbol` varchar(45),
	`Q6Symbol` varchar(45),
	`Q7Symbol` varchar(45),
	`Q8Symbol` varchar(45),
	CONSTRAINT `userStockTxns_date_userId` PRIMARY KEY(`date`,`userId`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `validMarkets` (
	`ID` int NOT NULL,
	`mktSymbol` varchar(45),
	`mktLongName` varchar(45),
	`mktInformation` varchar(45),
	`isActive` tinyint,
	CONSTRAINT `validMarkets_ID` PRIMARY KEY(`ID`)
);

