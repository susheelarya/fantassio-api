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
	"numberoffers" integer,
	"firstserveflag" boolean,
	"virtualflag" boolean,
	"predefined" boolean NOT NULL,
	"validflag" boolean,
	"sellproductid" integer
);
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
