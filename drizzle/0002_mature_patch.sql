ALTER TABLE "user_master" DROP CONSTRAINT "user_master_shoptypeid_shop_type_shoptypeid_fk";
--> statement-breakpoint
ALTER TABLE "user_master" DROP COLUMN IF EXISTS "shoptypeid";