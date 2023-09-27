CREATE TABLE IF NOT EXISTS "user_options" (
	"optionid" integer,
	"userid" integer,
	"questionid" integer,
	"optiontext" text,
	CONSTRAINT user_options_optionid_userid_questionid PRIMARY KEY("optionid","userid","questionid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_options" ADD CONSTRAINT "user_options_optionid_options_optionid_fk" FOREIGN KEY ("optionid") REFERENCES "options"("optionid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_options" ADD CONSTRAINT "user_options_userid_user_master_userid_fk" FOREIGN KEY ("userid") REFERENCES "user_master"("userid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_options" ADD CONSTRAINT "user_options_questionid_questions_questionid_fk" FOREIGN KEY ("questionid") REFERENCES "questions"("questionid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
