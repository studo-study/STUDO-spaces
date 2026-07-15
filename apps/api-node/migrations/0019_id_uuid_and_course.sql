DO $$ DECLARE r record; BEGIN
	FOR r IN SELECT conname, conrelid::regclass AS tbl FROM pg_constraint
		WHERE contype = 'f' AND connamespace = 'public'::regnamespace
	LOOP EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', r.tbl, r.conname); END LOOP;
END $$;--> statement-breakpoint
CREATE TABLE "course" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flowboards" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "flowcourse_sets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "flowcourses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "flowresources" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "flowrows" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "flowboards" CASCADE;--> statement-breakpoint
DROP TABLE "flowcourse_sets" CASCADE;--> statement-breakpoint
DROP TABLE "flowcourses" CASCADE;--> statement-breakpoint
DROP TABLE "flowresources" CASCADE;--> statement-breakpoint
DROP TABLE "flowrows" CASCADE;--> statement-breakpoint
DROP INDEX "idx_set_tracksets_unique";--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "set_id" SET DATA TYPE uuid USING "set_id"::uuid;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "owner_id" SET DATA TYPE uuid USING "owner_id"::uuid;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "suggestion_image_id" SET DATA TYPE uuid USING "suggestion_image_id"::uuid;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "chat_message" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "chat_message" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "chat_message" ALTER COLUMN "chat_id" SET DATA TYPE uuid USING "chat_id"::uuid;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "chat_message_payload" ALTER COLUMN "message_id" SET DATA TYPE uuid USING "message_id"::uuid;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ALTER COLUMN "studoset_id" SET DATA TYPE uuid USING "studoset_id"::uuid;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ALTER COLUMN "card_id" SET DATA TYPE uuid USING "card_id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomactivity" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomactivity" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "classroomactivity" ALTER COLUMN "classroom_id" SET DATA TYPE uuid USING "classroom_id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomactivity" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomactivity" ALTER COLUMN "set_id" SET DATA TYPE uuid USING "set_id"::uuid;--> statement-breakpoint
ALTER TABLE "classrooms" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "classrooms" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "classrooms" ALTER COLUMN "owner_id" SET DATA TYPE uuid USING "owner_id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomsets" ALTER COLUMN "set_id" SET DATA TYPE uuid USING "set_id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomsets" ALTER COLUMN "classroom_id" SET DATA TYPE uuid USING "classroom_id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomusers" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "classroomusers" ALTER COLUMN "classroom_id" SET DATA TYPE uuid USING "classroom_id"::uuid;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "set_id" SET DATA TYPE uuid USING "set_id"::uuid;--> statement-breakpoint
ALTER TABLE "pins" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "pins" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "pins" ALTER COLUMN "image_id" SET DATA TYPE uuid USING "image_id"::uuid;--> statement-breakpoint
ALTER TABLE "pins" ALTER COLUMN "set_id" SET DATA TYPE uuid USING "set_id"::uuid;--> statement-breakpoint
ALTER TABLE "pins" ALTER COLUMN "owner_id" SET DATA TYPE uuid USING "owner_id"::uuid;--> statement-breakpoint
ALTER TABLE "popular_sets" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "popular_sets" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "popular_sets" ALTER COLUMN "studyset_id" SET DATA TYPE uuid USING "studyset_id"::uuid;--> statement-breakpoint
ALTER TABLE "popular_sets" ALTER COLUMN "visualset_id" SET DATA TYPE uuid USING "visualset_id"::uuid;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "report_id" SET DATA TYPE uuid USING "report_id"::uuid;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "filled_by" SET DATA TYPE uuid USING "filled_by"::uuid;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "target_id" SET DATA TYPE uuid USING "target_id"::uuid;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "reported_user_id" SET DATA TYPE uuid USING "reported_user_id"::uuid;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "reviewed_by" SET DATA TYPE uuid USING "reviewed_by"::uuid;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "assignee_id" SET DATA TYPE uuid USING "assignee_id"::uuid;--> statement-breakpoint
ALTER TABLE "sessioncards" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "sessioncards" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "sessioncards" ALTER COLUMN "card_id" SET DATA TYPE uuid USING "card_id"::uuid;--> statement-breakpoint
ALTER TABLE "sessioncards" ALTER COLUMN "session_id" SET DATA TYPE uuid USING "session_id"::uuid;--> statement-breakpoint
ALTER TABLE "sessioncards" ALTER COLUMN "owner_id" SET DATA TYPE uuid USING "owner_id"::uuid;--> statement-breakpoint
ALTER TABLE "sessionpins" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "sessionpins" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "sessionpins" ALTER COLUMN "pin_id" SET DATA TYPE uuid USING "pin_id"::uuid;--> statement-breakpoint
ALTER TABLE "sessionpins" ALTER COLUMN "session_id" SET DATA TYPE uuid USING "session_id"::uuid;--> statement-breakpoint
ALTER TABLE "sessionpins" ALTER COLUMN "owner_id" SET DATA TYPE uuid USING "owner_id"::uuid;--> statement-breakpoint
ALTER TABLE "setlikes" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "setlikes" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "setlikes" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "setlikes" ALTER COLUMN "set_id" SET DATA TYPE uuid USING "set_id"::uuid;--> statement-breakpoint
ALTER TABLE "studoprofilecommunities" ALTER COLUMN "classroom_id" SET DATA TYPE uuid USING "classroom_id"::uuid;--> statement-breakpoint
ALTER TABLE "studoprofilecommunities" ALTER COLUMN "studoprofile_id" SET DATA TYPE uuid USING "studoprofile_id"::uuid;--> statement-breakpoint
ALTER TABLE "studoprofiles" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "studotracks" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "studotracks" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "studotracks" ALTER COLUMN "studoprofile_id" SET DATA TYPE uuid USING "studoprofile_id"::uuid;--> statement-breakpoint
ALTER TABLE "studysessions" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "studysessions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "studysessions" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "studysessions" ALTER COLUMN "set_id" SET DATA TYPE uuid USING "set_id"::uuid;--> statement-breakpoint
ALTER TABLE "studysets" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "studysets" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "studysets" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "suggestion_images" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "suggestion_images" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ALTER COLUMN "card_id" SET DATA TYPE uuid USING "card_id"::uuid;--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ALTER COLUMN "image_id" SET DATA TYPE uuid USING "image_id"::uuid;--> statement-breakpoint
ALTER TABLE "tracksets" ALTER COLUMN "track_id" SET DATA TYPE uuid USING "track_id"::uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "visualsets" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "visualsets" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "visualsets" ALTER COLUMN "user_id" SET DATA TYPE uuid USING "user_id"::uuid;--> statement-breakpoint
ALTER TABLE "tracksets" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "classroomactivity" ADD CONSTRAINT "classroomactivity_set_id_studysets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."studysets"("id") ON DELETE no action ON UPDATE no action NOT VALID;--> statement-breakpoint
ALTER TABLE "classroomsets" ADD CONSTRAINT "classroomsets_set_id_studysets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."studysets"("id") ON DELETE no action ON UPDATE no action NOT VALID;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_set_tracksets_unique" ON "tracksets" USING btree ("id","track_id");--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN "board_id";--> statement-breakpoint
ALTER TABLE "chat_message_payload" DROP COLUMN "flowcourse_id";--> statement-breakpoint
ALTER TABLE "tracksets" DROP COLUMN "set_id";--> statement-breakpoint
DROP TYPE "public"."priority";--> statement-breakpoint
DROP TYPE "public"."resourceType";--> statement-breakpoint
DROP TYPE "public"."rowType";--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_owner_id_users_id_fk" FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_set_id_studysets_id_fk" FOREIGN KEY (set_id) REFERENCES studysets(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chat_id_chat_id_fk" FOREIGN KEY (chat_id) REFERENCES chat(id) ON UPDATE CASCADE ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ADD CONSTRAINT "chat_message_payload_card_id_cards_id_fk" FOREIGN KEY (card_id) REFERENCES cards(id) ON UPDATE CASCADE ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ADD CONSTRAINT "chat_message_payload_message_id_chat_message_id_fk" FOREIGN KEY (message_id) REFERENCES chat_message(id) ON UPDATE CASCADE ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ADD CONSTRAINT "chat_message_payload_studoset_id_studysets_id_fk" FOREIGN KEY (studoset_id) REFERENCES studysets(id) ON UPDATE CASCADE ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroomactivity" ADD CONSTRAINT "classroomactivity_classroom_id_classrooms_id_fk" FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroomactivity" ADD CONSTRAINT "classroomactivity_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_owner_id_users_id_fk" FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroomsets" ADD CONSTRAINT "classroomsets_classroom_id_classrooms_id_fk" FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroomusers" ADD CONSTRAINT "classroomusers_classroom_id_classrooms_id_fk" FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroomusers" ADD CONSTRAINT "classroomusers_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_set_id_visualsets_id_fk" FOREIGN KEY (set_id) REFERENCES visualsets(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pins" ADD CONSTRAINT "pins_image_id_images_id_fk" FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pins" ADD CONSTRAINT "pins_owner_id_users_id_fk" FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pins" ADD CONSTRAINT "pins_set_id_visualsets_id_fk" FOREIGN KEY (set_id) REFERENCES visualsets(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "popular_sets" ADD CONSTRAINT "popular_sets_studyset_id_studysets_id_fk" FOREIGN KEY (studyset_id) REFERENCES studysets(id);--> statement-breakpoint
ALTER TABLE "popular_sets" ADD CONSTRAINT "popular_sets_visualset_id_visualsets_id_fk" FOREIGN KEY (visualset_id) REFERENCES visualsets(id);--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_assignee_id_users_id_fk" FOREIGN KEY (assignee_id) REFERENCES users(id);--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_filled_by_users_id_fk" FOREIGN KEY (filled_by) REFERENCES users(id);--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_users_id_fk" FOREIGN KEY (reported_user_id) REFERENCES users(id);--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reviewed_by_users_id_fk" FOREIGN KEY (reviewed_by) REFERENCES users(id);--> statement-breakpoint
ALTER TABLE "sessioncards" ADD CONSTRAINT "sessioncards_card_id_cards_id_fk" FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessioncards" ADD CONSTRAINT "sessioncards_owner_id_users_id_fk" FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessioncards" ADD CONSTRAINT "sessioncards_session_id_studysessions_id_fk" FOREIGN KEY (session_id) REFERENCES studysessions(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD CONSTRAINT "sessionpins_owner_id_users_id_fk" FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD CONSTRAINT "sessionpins_pin_id_pins_id_fk" FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD CONSTRAINT "sessionpins_session_id_studysessions_id_fk" FOREIGN KEY (session_id) REFERENCES studysessions(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "setlikes" ADD CONSTRAINT "setlikes_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "studoprofilecommunities" ADD CONSTRAINT "studoprofilecommunities_classroom_id_classrooms_id_fk" FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "studoprofilecommunities" ADD CONSTRAINT "studoprofilecommunities_studoprofile_id_studoprofiles_user_id_f" FOREIGN KEY (studoprofile_id) REFERENCES studoprofiles(user_id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "studoprofiles" ADD CONSTRAINT "studoprofiles_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "studotracks" ADD CONSTRAINT "studotracks_studoprofile_id_studoprofiles_user_id_fk" FOREIGN KEY (studoprofile_id) REFERENCES studoprofiles(user_id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "studysessions" ADD CONSTRAINT "studysessions_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "studysets" ADD CONSTRAINT "studysets_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ADD CONSTRAINT "suggestion_terms_cards_card_id_cards_id_fk" FOREIGN KEY (card_id) REFERENCES cards(id) ON UPDATE CASCADE ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ADD CONSTRAINT "suggestion_terms_cards_image_id_suggestion_images_id_fk" FOREIGN KEY (image_id) REFERENCES suggestion_images(id) ON UPDATE CASCADE ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tracksets" ADD CONSTRAINT "tracksets_track_id_studotracks_id_fk" FOREIGN KEY (track_id) REFERENCES studotracks(id) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "visualsets" ADD CONSTRAINT "visualsets_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;--> statement-breakpoint
