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
CREATE TABLE IF NOT EXISTS "loyalty_scheme_shop_mapping" (
	"useridshop" integer,
	"loyaltyschemeid" integer,
	"mapid" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loyalty_scheme_shop_mapping" ADD CONSTRAINT "loyalty_scheme_shop_mapping_loyaltyschemeid_loyalty_scheme_master_loyaltyschemeid_fk" FOREIGN KEY ("loyaltyschemeid") REFERENCES "loyalty_scheme_master"("loyaltyschemeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
