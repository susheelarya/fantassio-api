CREATE TABLE IF NOT EXISTS "customer_consolidation" (
	"useridshopper" integer NOT NULL,
	"useridshop" integer NOT NULL,
	"loyaltyschemeid" integer NOT NULL,
	"pointscollected" integer NOT NULL,
	CONSTRAINT customer_consolidation_useridshopper_useridshop_loyaltyschemeid PRIMARY KEY("useridshopper","useridshop","loyaltyschemeid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_redeem" (
	"useridshopper" integer NOT NULL,
	"useridshop" integer NOT NULL,
	"redeemablepoints" integer NOT NULL,
	CONSTRAINT customer_redeem_useridshopper_useridshop PRIMARY KEY("useridshopper","useridshop")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_transaction" (
	"transactionid" serial PRIMARY KEY NOT NULL,
	"useridshopper" integer NOT NULL,
	"useridshop" integer NOT NULL,
	"moneyspent" numeric,
	"pointsearned" numeric,
	"loyaltyschemeid" integer,
	"receiptid" integer,
	"collectedflag" boolean,
	"datetime" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loyalty_information" (
	"loyaltyschemeid" integer PRIMARY KEY NOT NULL,
	"useridshop" integer,
	"pointscollected" numeric,
	"numberofcustomers" numeric,
	"pointsredeemed" numeric,
	"pointstoberedeemed" numeric,
	"stampstocollect" integer,
	"stampscollected" integer,
	"freeitemsgiven" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loyalty_scheme_master" (
	"loyaltyschemeid" serial PRIMARY KEY NOT NULL,
	"loyaltyschemetypeid" integer NOT NULL,
	"moneyforpoints" numeric,
	"pointsfrommoney" numeric,
	"pointstoredeem" numeric,
	"moneyfrompoints" numeric,
	"redeemfrequency" text,
	"predefined" boolean NOT NULL,
	"stampstocollect" numeric,
	"freeitems" numeric,
	"loyaltyschemename" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loyalty_scheme_shop_mapping" (
	"useridshop" integer,
	"loyaltyschemeid" integer,
	"mapid" serial PRIMARY KEY NOT NULL,
	"validfromdate" date,
	"validtodate" date,
	"expireflag" boolean,
	"expiremonths" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loyalty_scheme_type" (
	"loyaltyschemetypeid" serial PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offer_master" (
	"offertypeid" integer NOT NULL,
	"offerid" serial PRIMARY KEY NOT NULL,
	"description" text,
	"buyitem" integer,
	"freeitem" integer,
	"percentagediscount" numeric,
	"cashdiscount" numeric,
	"minspend" numeric,
	"buyproductid" integer,
	"offerpicture" text,
	"validity" date,
	"validtodate" date,
	"validfromtime" time,
	"validtotime" time,
	"numberoffers" integer,
	"firstserveflag" boolean,
	"virtualflag" boolean,
	"predefined" boolean NOT NULL,
	"validflag" boolean,
	"sellproductid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offer_type" (
	"offertypeid" serial PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "options" (
	"optionid" serial PRIMARY KEY NOT NULL,
	"optiontext" text NOT NULL,
	"questionid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_type" (
	"questiontypeid" serial PRIMARY KEY NOT NULL,
	"questiontype" text NOT NULL,
	"questiontypedesc" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"questionid" serial PRIMARY KEY NOT NULL,
	"questiontext" text NOT NULL,
	"questiontypeid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offer_availed" (
	"userid" integer,
	"mapid" integer,
	"datetime" timestamp,
	CONSTRAINT offer_availed_userid_mapid PRIMARY KEY("userid","mapid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parameters" (
	"paramid" serial PRIMARY KEY NOT NULL,
	"parameter" text,
	"paramkey" text,
	"paramvalue" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_log" (
	"useridshop" integer NOT NULL,
	"useridshopper" integer NOT NULL,
	"datetime" timestamp,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_master" (
	"id" serial NOT NULL,
	"userid" serial PRIMARY KEY NOT NULL,
	"fullname" text,
	"mobilenumber" text,
	"isvalidated" boolean,
	"isenabled" boolean,
	"businessname" text,
	"dpname" text,
	"otp" text,
	"appleauthtkn" text,
	"appleAuthTknSecret" text,
	"appleAuthTknUserID" text,
	"appleAuthTknUserName" text,
	"googleAuthTkn" text,
	"googleAuthTknSecret" text,
	"googleAuthTknUserID" text,
	"googleAuthTknUserName" text,
	"loggedInWith" text,
	"postcode" text,
	"address1" text,
	"address2" text,
	"city" text,
	"ageGroup" text,
	"gender" text,
	"appVersion" text,
	"lastActivity" text,
	"createdOn" text,
	"currentSchemeID" integer,
	"currentSchemeName" text,
	"currentSchemeAmount" text,
	"currentSchemePurchaseDate" date,
	"currentSchemeValidityDate" date,
	"userRating" text,
	"pushNotificationToken" text,
	"mobileDevice" text,
	"secureToken" text,
	"thanosID" integer,
	"thanosPassword" text,
	"isAdmin" boolean,
	"shoptypeid" integer,
	"cashiertills" integer,
	"paiduser" boolean,
	"usertype" text,
	"about" text,
	"logo" text,
	"interests" text,
	"baselongitude" numeric,
	"baselatitude" numeric,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "user_master_userid_unique" UNIQUE("userid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_offer_mapping" (
	"mapid" serial PRIMARY KEY NOT NULL,
	"userid" integer,
	"datetime" integer,
	"virtualobjcoord" text,
	"validfromdate" date,
	"validtodate" date,
	"validfromtime" time,
	"validtotime" time,
	"expireflag" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_options" (
	"optionid" integer,
	"userid" integer,
	"questionid" integer,
	"optiontext" text,
	CONSTRAINT user_options_optionid_userid_questionid PRIMARY KEY("optionid","userid","questionid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_type" (
	"usertypeid" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "valid_postcodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"postcode" varchar(30),
	"latlong" varchar(100),
	"county" varchar(100),
	"district" varchar(100),
	"ward" varchar(100),
	"country" varchar(100),
	"postcodearea" varchar(5),
	"postcodedistrict" varchar(10)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_master" (
	"productid" serial PRIMARY KEY NOT NULL,
	"productdescription" text,
	"productpicture" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shop_type" (
	"shoptypeid" serial PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stamps" (
	"transactionid" serial NOT NULL,
	"useridshopper" integer,
	"useridshop" integer,
	"redeemflag" boolean,
	"stampsbought" integer,
	"loyaltyschemeid" integer,
	"datetime" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_consolidation" ADD CONSTRAINT "customer_consolidation_useridshopper_user_master_userid_fk" FOREIGN KEY ("useridshopper") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_consolidation" ADD CONSTRAINT "customer_consolidation_useridshop_user_master_userid_fk" FOREIGN KEY ("useridshop") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_consolidation" ADD CONSTRAINT "customer_consolidation_loyaltyschemeid_loyalty_scheme_master_loyaltyschemeid_fk" FOREIGN KEY ("loyaltyschemeid") REFERENCES "loyalty_scheme_master"("loyaltyschemeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_redeem" ADD CONSTRAINT "customer_redeem_useridshopper_user_master_userid_fk" FOREIGN KEY ("useridshopper") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_redeem" ADD CONSTRAINT "customer_redeem_useridshop_user_master_userid_fk" FOREIGN KEY ("useridshop") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loyalty_information" ADD CONSTRAINT "loyalty_information_loyaltyschemeid_loyalty_scheme_master_loyaltyschemeid_fk" FOREIGN KEY ("loyaltyschemeid") REFERENCES "loyalty_scheme_master"("loyaltyschemeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loyalty_information" ADD CONSTRAINT "loyalty_information_useridshop_user_master_userid_fk" FOREIGN KEY ("useridshop") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loyalty_scheme_master" ADD CONSTRAINT "loyalty_scheme_master_loyaltyschemetypeid_loyalty_scheme_type_loyaltyschemetypeid_fk" FOREIGN KEY ("loyaltyschemetypeid") REFERENCES "loyalty_scheme_type"("loyaltyschemetypeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loyalty_scheme_shop_mapping" ADD CONSTRAINT "loyalty_scheme_shop_mapping_loyaltyschemeid_loyalty_scheme_master_loyaltyschemeid_fk" FOREIGN KEY ("loyaltyschemeid") REFERENCES "loyalty_scheme_master"("loyaltyschemeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offer_master" ADD CONSTRAINT "offer_master_offertypeid_offer_type_offertypeid_fk" FOREIGN KEY ("offertypeid") REFERENCES "offer_type"("offertypeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offer_master" ADD CONSTRAINT "offer_master_buyproductid_product_master_productid_fk" FOREIGN KEY ("buyproductid") REFERENCES "product_master"("productid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offer_master" ADD CONSTRAINT "offer_master_sellproductid_product_master_productid_fk" FOREIGN KEY ("sellproductid") REFERENCES "product_master"("productid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "options" ADD CONSTRAINT "options_questionid_questions_questionid_fk" FOREIGN KEY ("questionid") REFERENCES "questions"("questionid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_questiontypeid_question_type_questiontypeid_fk" FOREIGN KEY ("questiontypeid") REFERENCES "question_type"("questiontypeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offer_availed" ADD CONSTRAINT "offer_availed_mapid_user_offer_mapping_mapid_fk" FOREIGN KEY ("mapid") REFERENCES "user_offer_mapping"("mapid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_log" ADD CONSTRAINT "user_log_useridshop_user_master_userid_fk" FOREIGN KEY ("useridshop") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_log" ADD CONSTRAINT "user_log_useridshopper_user_master_userid_fk" FOREIGN KEY ("useridshopper") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_master" ADD CONSTRAINT "user_master_shoptypeid_shop_type_shoptypeid_fk" FOREIGN KEY ("shoptypeid") REFERENCES "shop_type"("shoptypeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_offer_mapping" ADD CONSTRAINT "user_offer_mapping_userid_user_master_userid_fk" FOREIGN KEY ("userid") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_offer_mapping" ADD CONSTRAINT "user_offer_mapping_datetime_offer_master_offerid_fk" FOREIGN KEY ("datetime") REFERENCES "offer_master"("offerid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_options" ADD CONSTRAINT "user_options_optionid_options_optionid_fk" FOREIGN KEY ("optionid") REFERENCES "options"("optionid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_options" ADD CONSTRAINT "user_options_userid_user_master_userid_fk" FOREIGN KEY ("userid") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_options" ADD CONSTRAINT "user_options_questionid_questions_questionid_fk" FOREIGN KEY ("questionid") REFERENCES "questions"("questionid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stamps" ADD CONSTRAINT "stamps_useridshopper_user_master_userid_fk" FOREIGN KEY ("useridshopper") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stamps" ADD CONSTRAINT "stamps_useridshop_user_master_userid_fk" FOREIGN KEY ("useridshop") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stamps" ADD CONSTRAINT "stamps_loyaltyschemeid_loyalty_scheme_master_loyaltyschemeid_fk" FOREIGN KEY ("loyaltyschemeid") REFERENCES "loyalty_scheme_master"("loyaltyschemeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
