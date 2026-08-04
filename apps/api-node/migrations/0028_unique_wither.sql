ALTER TABLE "sessioncards" ADD COLUMN "response_sum_ms" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "studysessions" ADD COLUMN "completions" integer DEFAULT 0 NOT NULL;