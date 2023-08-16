CREATE TABLE IF NOT EXISTS "customer_redeem" (
	"useridshopper" integer NOT NULL,
	"useridshop" integer NOT NULL,
	"redeemablepoints" integer NOT NULL,
	CONSTRAINT customer_redeem_useridshopper_useridshop PRIMARY KEY("useridshopper","useridshop")
);
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
