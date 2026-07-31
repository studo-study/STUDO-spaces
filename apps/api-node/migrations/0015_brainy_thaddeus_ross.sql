CREATE TABLE "flowcourse_sets" (
	"id" varchar PRIMARY KEY NOT NULL,
	"set_id" varchar NOT NULL,
	"course_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "folder_sets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "folders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "folder_sets" CASCADE;--> statement-breakpoint
DROP TABLE "folders" CASCADE;--> statement-breakpoint
DROP INDEX "studysets_search_index";--> statement-breakpoint
DROP INDEX "visualsets_search_index";--> statement-breakpoint
ALTER TABLE "flowcourses" ALTER COLUMN "board_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "flowcourse_sets" ADD CONSTRAINT "flowcourse_sets_set_id_studysets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."studysets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flowcourse_sets" ADD CONSTRAINT "flowcourse_sets_course_id_flowcourses_flowcourse_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."flowcourses"("flowcourse_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessioncards_search_index" ON "sessioncards" USING gin (to_tsvector
      ('simple',
      "session_id"
      ));--> statement-breakpoint
CREATE INDEX "sessionpins_search_index" ON "sessionpins" USING gin (to_tsvector
      ('simple',
      "session_id"
      ));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_studysessions_users_unique" ON "studysessions" USING btree ("user_id","set_id");--> statement-breakpoint
CREATE INDEX "studysets_search_index" ON "studysets" USING gin (to_tsvector
      ('simple',
      "title"
      ));--> statement-breakpoint
CREATE INDEX "visualsets_search_index" ON "visualsets" USING gin (to_tsvector
      ('simple',
      "title"
      ));--> statement-breakpoint
ALTER TABLE "studysets" DROP COLUMN "course";--> statement-breakpoint
ALTER TABLE "visualsets" DROP COLUMN "course";