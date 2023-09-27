CREATE TABLE IF NOT EXISTS "loyalty_information" (
	"loyaltyschemeid" integer PRIMARY KEY NOT NULL,
	"useridshop" integer,
	"pointscollected" numeric,
	"numberofcustomers" numeric,
	"pointsredeemed" numeric,
	"stampstocollect" integer,
	"stampscollected" integer,
	"freeitemsgiven" integer
);
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
