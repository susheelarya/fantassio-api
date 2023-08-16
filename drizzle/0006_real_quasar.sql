ALTER TABLE "user_master" ADD COLUMN "shoptypeid" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_master" ADD CONSTRAINT "user_master_shoptypeid_shop_type_shoptypeid_fk" FOREIGN KEY ("shoptypeid") REFERENCES "shop_type"("shoptypeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
