CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TYPE "public"."course_document_status" AS ENUM('uploading', 'processing', 'finished', 'failed');--> statement-breakpoint
CREATE TYPE "public"."course_roles" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."mime_type" AS ENUM('pdf', 'docx');--> statement-breakpoint
CREATE TYPE "public"."set_type" AS ENUM('studoset', 'visualset');--> statement-breakpoint
CREATE TYPE "public"."widget_type" AS ENUM('notes', 'flashcards', 'document', 'set', 'todo', 'timer', 'calendar');--> statement-breakpoint
CREATE TABLE "board_users" (
	"board_id" uuid,
	"user_id" uuid,
	"role" "course_roles" DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"icon" varchar DEFAULT '' NOT NULL,
	"public_board" boolean DEFAULT false,
	"academy_year" integer,
	"exam_date" date,
	"institute" varchar
);
--> statement-breakpoint
CREATE TABLE "course_context" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model" varchar,
	"document_count" varchar,
	"context" text
);
--> statement-breakpoint
CREATE TABLE "course_document_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"page_start" integer,
	"page_end" integer,
	"chunk_index" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"embedding_model" varchar,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE "course_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"uploader_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"author" varchar,
	"publishing_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"page_count" integer,
	"word_count" integer,
	"status" "course_document_status" DEFAULT 'uploading',
	"storage_key" varchar NOT NULL,
	"mime_type" "mime_type" DEFAULT 'pdf' NOT NULL,
	"file_size" integer,
	"checksum" integer
);
--> statement-breakpoint
CREATE TABLE "course_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "course_sets" (
	"set_id" uuid NOT NULL,
	"set_type" "set_type" NOT NULL,
	"added_by" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_users" (
	"user_id" uuid,
	"course_id" uuid,
	"role" "course_roles" DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "course_users_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "course_widgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"type" "widget_type" NOT NULL,
	"x" integer DEFAULT 0 NOT NULL,
	"y" integer DEFAULT 0 NOT NULL,
	"w" integer DEFAULT 1 NOT NULL,
	"h" integer DEFAULT 1 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "course_document_chunk_id" uuid;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "board_id" uuid;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "title" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "icon" varchar DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "public_course" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "academy_year" integer;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "exam_date" date;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "institute" varchar;--> statement-breakpoint
ALTER TABLE "studysets" ADD COLUMN "generated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "board_users" ADD CONSTRAINT "board_users_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "board_users" ADD CONSTRAINT "board_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_document_chunks" ADD CONSTRAINT "course_document_chunks_document_id_course_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."course_documents"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_documents" ADD CONSTRAINT "course_documents_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_documents" ADD CONSTRAINT "course_documents_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_rows" ADD CONSTRAINT "course_rows_table_id_course_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."course_tables"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_rows" ADD CONSTRAINT "course_rows_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_sets" ADD CONSTRAINT "course_sets_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_sets" ADD CONSTRAINT "course_sets_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_tables" ADD CONSTRAINT "course_tables_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_users" ADD CONSTRAINT "course_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_users" ADD CONSTRAINT "course_users_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course_widgets" ADD CONSTRAINT "course_widgets_workspace_id_course_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."course_workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_workspaces" ADD CONSTRAINT "course_workspaces_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_board_users_unique" ON "board_users" USING btree ("board_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_course_sets_unique" ON "course_sets" USING btree ("set_id","course_id");--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_course_document_chunk_id_course_document_chunks_id_fk" FOREIGN KEY ("course_document_chunk_id") REFERENCES "public"."course_document_chunks"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE cascade;