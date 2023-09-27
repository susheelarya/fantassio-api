CREATE TABLE IF NOT EXISTS "questions" (
	"questionid" serial PRIMARY KEY NOT NULL,
	"questiontext" text NOT NULL,
	"questiontypeid" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_questiontypeid_question_type_questiontypeid_fk" FOREIGN KEY ("questiontypeid") REFERENCES "question_type"("questiontypeid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
