CREATE TABLE "folder_sets" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"set_id" varchar(64) NOT NULL,
	"set_type" varchar(20) NOT NULL,
	"folder_id" varchar(64) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "studysets" DROP CONSTRAINT "studysets_folder_id_folders_id_fk";
--> statement-breakpoint
ALTER TABLE "visualsets" DROP CONSTRAINT "visualsets_folder_id_folders_id_fk";
--> statement-breakpoint
ALTER TABLE "folder_sets" ADD CONSTRAINT "folder_sets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_sets" ADD CONSTRAINT "folder_sets_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studysets" DROP COLUMN "folder_id";--> statement-breakpoint
ALTER TABLE "visualsets" DROP COLUMN "folder_id";
CREATE EXTENSION IF NOT EXISTS pg_trgm;