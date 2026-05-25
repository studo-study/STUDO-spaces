ALTER TABLE "cards" ADD COLUMN IF NOT EXISTS "term_content_type" varchar(8) NOT NULL DEFAULT 'text';--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'term_is_latex'
  ) THEN
    UPDATE "cards" SET "term_content_type" = 'latex' WHERE "term_is_latex" = true;
  END IF;
END;
$$;--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN IF EXISTS "term_is_latex";--> statement-breakpoint
ALTER TABLE "cards" DROP COLUMN IF EXISTS "term_is_code";
