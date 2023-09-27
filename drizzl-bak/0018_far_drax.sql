CREATE TABLE IF NOT EXISTS "options" (
	"optionid" serial PRIMARY KEY NOT NULL,
	"optiontext" text NOT NULL,
	"questionid" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "options" ADD CONSTRAINT "options_questionid_questions_questionid_fk" FOREIGN KEY ("questionid") REFERENCES "questions"("questionid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
