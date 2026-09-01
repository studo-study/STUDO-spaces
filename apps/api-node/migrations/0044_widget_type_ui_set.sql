ALTER TABLE "course_widgets" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
UPDATE "course_widgets" SET "type" = 'notes' WHERE "type" NOT IN ('progress', 'urgent', 'sets', 'files', 'notes');--> statement-breakpoint
DROP TYPE "public"."widget_type";--> statement-breakpoint
CREATE TYPE "public"."widget_type" AS ENUM('progress', 'urgent', 'sets', 'files', 'notes');--> statement-breakpoint
ALTER TABLE "course_widgets" ALTER COLUMN "type" SET DATA TYPE "public"."widget_type" USING "type"::"public"."widget_type";