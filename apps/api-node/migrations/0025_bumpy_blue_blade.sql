ALTER TABLE "sessioncards" ADD COLUMN "flagged" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD COLUMN "flagged" boolean DEFAULT false NOT NULL;