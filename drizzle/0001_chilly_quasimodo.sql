ALTER TABLE "user_offer_mapping" RENAME COLUMN "datetime" TO "offerid";--> statement-breakpoint
ALTER TABLE "user_offer_mapping" DROP CONSTRAINT "user_offer_mapping_datetime_offer_master_offerid_fk";
--> statement-breakpoint
ALTER TABLE "offer_availed" ADD COLUMN "offerid" integer;--> statement-breakpoint
ALTER TABLE "offer_availed" ADD COLUMN "useridshop" integer;--> statement-breakpoint
ALTER TABLE "user_offer_mapping" ADD COLUMN "whilestockslast" boolean;--> statement-breakpoint
ALTER TABLE "user_offer_mapping" ADD COLUMN "offerinformation" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_offer_mapping" ADD CONSTRAINT "user_offer_mapping_offerid_offer_master_offerid_fk" FOREIGN KEY ("offerid") REFERENCES "offer_master"("offerid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
