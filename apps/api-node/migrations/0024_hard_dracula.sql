ALTER TYPE "public"."row_type" ADD VALUE 'set';--> statement-breakpoint
ALTER TABLE "course_rows" ALTER COLUMN "type" SET DEFAULT 'task';--> statement-breakpoint
ALTER TABLE "course_rows" ADD COLUMN "title" varchar;--> statement-breakpoint
ALTER TABLE "course_rows" ADD COLUMN "due_date" date;