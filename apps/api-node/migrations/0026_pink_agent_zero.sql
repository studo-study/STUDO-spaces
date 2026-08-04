ALTER TABLE "sessioncards" ADD COLUMN "total_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sessioncards" ADD COLUMN "total_correct" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD COLUMN "total_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD COLUMN "total_correct" integer DEFAULT 0 NOT NULL;