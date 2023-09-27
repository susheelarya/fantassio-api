CREATE TABLE IF NOT EXISTS "offer_availed" (
	"userid" integer,
	"mapid" integer,
	"datetime" timestamp,
	CONSTRAINT offer_availed_userid_mapid PRIMARY KEY("userid","mapid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offer_availed" ADD CONSTRAINT "offer_availed_mapid_user_offer_mapping_mapid_fk" FOREIGN KEY ("mapid") REFERENCES "user_offer_mapping"("mapid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
