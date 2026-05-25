ALTER TABLE "cards" ADD COLUMN IF NOT EXISTS "term_content_type" varchar(8) NOT NULL DEFAULT 'text';--> statement-breakpoint
UPDATE "cards" SET "term_content_type" = 'latex' WHERE "term_is_latex" = true;--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN IF EXISTS "term_is_latex";--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN IF EXISTS "term_is_code";
