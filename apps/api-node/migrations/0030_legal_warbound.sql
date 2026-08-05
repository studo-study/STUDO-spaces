CREATE TYPE "public"."document_tag" AS ENUM('overview', 'course', 'notes', 'summary', 'exercises', 'exam', 'slides', 'lab', 'assignment', 'cheatsheet', 'document');--> statement-breakpoint
ALTER TABLE "course_documents" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "course_documents" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "course_documents" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "course_documents" ADD COLUMN "document_tag" "document_tag" DEFAULT 'document' NOT NULL;