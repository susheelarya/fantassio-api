CREATE TABLE IF NOT EXISTS "customer_consolidation" (
	"useridshopper" integer NOT NULL,
	"useridshop" integer NOT NULL,
	"loyaltyschemeid" integer NOT NULL,
	"pointscollected" integer NOT NULL,
	CONSTRAINT customer_consolidation_useridshopper_useridshop_loyaltyschemeid PRIMARY KEY("useridshopper","useridshop","loyaltyschemeid")
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
