CREATE TYPE "public"."row_priority" AS ENUM('no_priority', 'low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."row_status" AS ENUM('not_started', 'doing', 'done');--> statement-breakpoint
CREATE TYPE "public"."row_type" AS ENUM('course', 'notes', 'summary', 'abstract', 'sample_exam', 'task');--> statement-breakpoint
CREATE TABLE "course_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"row_id" uuid NOT NULL,
	"link" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course_rows" RENAME COLUMN "position" TO "row_index";--> statement-breakpoint
ALTER TABLE "course_users" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "course_users" ALTER COLUMN "course_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "course_context" ADD COLUMN "course_id" uuid;--> statement-breakpoint
ALTER TABLE "course_rows" ADD COLUMN "status" "row_status" DEFAULT 'not_started';--> statement-breakpoint
ALTER TABLE "course_rows" ADD COLUMN "priority" "row_priority" DEFAULT 'no_priority';--> statement-breakpoint
ALTER TABLE "course_rows" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "course_rows" ADD COLUMN "type" "row_type";--> statement-breakpoint
ALTER TABLE "course_resources" ADD CONSTRAINT "course_resources_row_id_course_rows_id_fk" FOREIGN KEY ("row_id") REFERENCES "public"."course_rows"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_context" ADD CONSTRAINT "course_context_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE cascade;