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
	"expiremonths" integer,
	"validfromdate" date,
	"loyaltyschemename" text,
	"expireflag" boolean
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loyalty_scheme_master" ADD CONSTRAINT "loyalty_scheme_master_loyaltyschemetypeid_loyalty_scheme_type_loyaltyschemetypeid_fk" FOREIGN KEY ("loyaltyschemetypeid") REFERENCES "loyalty_scheme_type"("loyaltyschemetypeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
