ALTER TABLE "studysessions" ADD COLUMN "total_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "studysessions" ADD COLUMN "total_correct" integer DEFAULT 0 NOT NULL;