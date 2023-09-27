CREATE TABLE IF NOT EXISTS "offer_type" (
	"offertypeid" serial PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parameters" (
	"paramid" serial PRIMARY KEY NOT NULL,
	"parameter" text,
	"paramkey" text,
	"paramvalue" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_master" (
	"productid" serial PRIMARY KEY NOT NULL,
	"productdescription" text,
	"productpicture" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_type" (
	"questiontypeid" serial PRIMARY KEY NOT NULL,
	"questiontype" text NOT NULL,
	"questiontypedesc" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_type" (
	"usertypeid" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "valid_postcodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"postcode" varchar(30),
	"latlong" varchar(100),
	"county" varchar(100),
	"district" varchar(100),
	"ward" varchar(100),
	"country" varchar(100),
	"postcodearea" varchar(5),
	"postcodedistrict" varchar(10)
);
