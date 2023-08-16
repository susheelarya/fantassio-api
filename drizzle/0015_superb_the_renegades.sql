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
CREATE TABLE IF NOT EXISTS "user_log" (
	"useridshop" integer NOT NULL,
	"useridshopper" integer NOT NULL,
	"datetime" timestamp,
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_offer_mapping" (
	"mapid" serial PRIMARY KEY NOT NULL,
	"userid" integer,
	"datetime" integer,
	"virtualobjcoord" text
);
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
