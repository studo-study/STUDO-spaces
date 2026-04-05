CREATE TABLE "cards" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"term" varchar(128) NOT NULL,
	"definition" varchar(128) NOT NULL,
	"number" integer NOT NULL,
	"created_at" varchar(24) NOT NULL,
	"updated_at" varchar(24) NOT NULL,
	"set_id" varchar(64) NOT NULL,
	"owner_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroomactivity" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"classroom_id" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"displayName" varchar(64) NOT NULL,
	"img_url" varchar(250) NOT NULL,
	"last_seen" varchar(64) NOT NULL,
	"set_id" varchar(64) NOT NULL,
	"set_type" varchar(24) NOT NULL,
	"title" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"owner_id" varchar(64) NOT NULL,
	"type" varchar(40) NOT NULL,
	"created_at" varchar(24) NOT NULL,
	"verified" boolean NOT NULL,
	"school" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroomsets" (
	"set_id" varchar(64) NOT NULL,
	"set_type" varchar(20) NOT NULL,
	"added_by" varchar(100) NOT NULL,
	"classroom_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroomusers" (
	"user_id" varchar(64) NOT NULL,
	"classroom_id" varchar(64) NOT NULL,
	"role" varchar(7) NOT NULL,
	"joined_at" varchar(24) NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"owner_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"index" integer NOT NULL,
	"url" varchar(250) NOT NULL,
	"grid_x" integer NOT NULL,
	"grid_y" integer NOT NULL,
	"scale" varchar(64) NOT NULL,
	"set_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pins" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"definition" varchar(128) NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"number" integer NOT NULL,
	"created_at" varchar(24) NOT NULL,
	"updated_at" varchar(24) NOT NULL,
	"image_id" varchar(64) NOT NULL,
	"set_id" varchar(64) NOT NULL,
	"owner_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" varchar(64) PRIMARY KEY NOT NULL,
	"displayname" varchar(100) NOT NULL,
	"img_url" varchar(250) NOT NULL,
	"banner_url" varchar(250),
	"join_date" varchar(24) NOT NULL,
	"join_number" serial NOT NULL,
	"streak" integer NOT NULL,
	"verified" boolean NOT NULL,
	"tags" varchar[] NOT NULL,
	CONSTRAINT "profiles_join_number_unique" UNIQUE("join_number")
);
--> statement-breakpoint
CREATE TABLE "sessioncards" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"card_viewcount" integer NOT NULL,
	"card_total_viewcount" integer NOT NULL,
	"inQueue" boolean NOT NULL,
	"mastered" boolean NOT NULL,
	"times_relearned" integer NOT NULL,
	"card_id" varchar(64) NOT NULL,
	"session_id" varchar(64) NOT NULL,
	"owner_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessionpins" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"pin_viewcount" integer NOT NULL,
	"pin_total_viewcount" integer NOT NULL,
	"inQueue" boolean NOT NULL,
	"mastered" boolean NOT NULL,
	"times_relearned" integer NOT NULL,
	"pin_id" varchar(64) NOT NULL,
	"session_id" varchar(64) NOT NULL,
	"owner_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "setlikes" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"set_id" varchar(64) NOT NULL,
	"set_type" varchar(20) NOT NULL,
	"created_at" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studoprofilecommunities" (
	"classroom_id" varchar(64) NOT NULL,
	"class_type" varchar(20) NOT NULL,
	"studoprofile_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studoprofiles" (
	"user_id" varchar(64) PRIMARY KEY NOT NULL,
	"displayname" varchar(100) NOT NULL,
	"img_url" varchar(250) NOT NULL,
	"banner_url" varchar(250) NOT NULL,
	"tags" varchar[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studotracks" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"studoprofile_id" varchar(64) NOT NULL,
	"displayname" varchar(100) NOT NULL,
	"icon_name" varchar(50) NOT NULL,
	"grade" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studysessions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"set_id" varchar(64) NOT NULL,
	"set_type" varchar(30) NOT NULL,
	"started_at" varchar(24) NOT NULL,
	"duration_min" integer NOT NULL,
	"ended_at" varchar(24) NOT NULL,
	"set_index" integer NOT NULL,
	"accuracy" integer NOT NULL,
	"average_response_time" integer NOT NULL,
	"longest_focus_streak" integer NOT NULL,
	"last_seen" varchar(64) NOT NULL,
	"last_studied" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studysets" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"course" varchar(100) NOT NULL,
	"studoset" boolean NOT NULL,
	"global_term_language" varchar(2) NOT NULL,
	"global_definition_language" varchar(2) NOT NULL,
	"created_at" varchar(24) NOT NULL,
	"last_updated" varchar(24) NOT NULL,
	"publicSet" boolean NOT NULL,
	"displayname" varchar(100) NOT NULL,
	"img_url" varchar(250) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"folder_id" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "tracksets" (
	"set_id" varchar(64) NOT NULL,
	"set_type" varchar(20) NOT NULL,
	"track_id" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"displayname" varchar(100) NOT NULL,
	"img_url" varchar(250) NOT NULL,
	"join_date" varchar(24) NOT NULL,
	"join_number" serial NOT NULL,
	"total_sets" integer NOT NULL,
	"streak_started" varchar(24),
	"streak_count" integer,
	"streak_last_update" varchar(24),
	"last_login" varchar(24) NOT NULL,
	"roles" jsonb NOT NULL,
	"public_role" varchar(24) NOT NULL,
	"verified" boolean NOT NULL,
	CONSTRAINT "users_join_number_unique" UNIQUE("join_number")
);
--> statement-breakpoint
CREATE TABLE "visualsets" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"course" varchar(100) NOT NULL,
	"studoset" boolean NOT NULL,
	"created_at" varchar(24) NOT NULL,
	"last_updated" varchar(24) NOT NULL,
	"publicSet" boolean NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"displayname" varchar(100) NOT NULL,
	"img_url" varchar(250) NOT NULL,
	"folder_id" varchar(64) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_set_id_studysets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."studysets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroomactivity" ADD CONSTRAINT "classroomactivity_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroomactivity" ADD CONSTRAINT "classroomactivity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroomsets" ADD CONSTRAINT "classroomsets_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroomusers" ADD CONSTRAINT "classroomusers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroomusers" ADD CONSTRAINT "classroomusers_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_set_id_visualsets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."visualsets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pins" ADD CONSTRAINT "pins_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pins" ADD CONSTRAINT "pins_set_id_visualsets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."visualsets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pins" ADD CONSTRAINT "pins_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessioncards" ADD CONSTRAINT "sessioncards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessioncards" ADD CONSTRAINT "sessioncards_session_id_studysessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."studysessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessioncards" ADD CONSTRAINT "sessioncards_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD CONSTRAINT "sessionpins_pin_id_pins_id_fk" FOREIGN KEY ("pin_id") REFERENCES "public"."pins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD CONSTRAINT "sessionpins_session_id_studysessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."studysessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionpins" ADD CONSTRAINT "sessionpins_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setlikes" ADD CONSTRAINT "setlikes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studoprofilecommunities" ADD CONSTRAINT "studoprofilecommunities_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studoprofilecommunities" ADD CONSTRAINT "studoprofilecommunities_studoprofile_id_studoprofiles_user_id_fk" FOREIGN KEY ("studoprofile_id") REFERENCES "public"."studoprofiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studoprofiles" ADD CONSTRAINT "studoprofiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studotracks" ADD CONSTRAINT "studotracks_studoprofile_id_studoprofiles_user_id_fk" FOREIGN KEY ("studoprofile_id") REFERENCES "public"."studoprofiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studysessions" ADD CONSTRAINT "studysessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studysets" ADD CONSTRAINT "studysets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studysets" ADD CONSTRAINT "studysets_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracksets" ADD CONSTRAINT "tracksets_track_id_studotracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."studotracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visualsets" ADD CONSTRAINT "visualsets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visualsets" ADD CONSTRAINT "visualsets_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "classrooms_search_index" ON "classrooms" USING gin (to_tsvector
      ('simple',
      "name"
      ));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_set_classroom_unique" ON "classroomsets" USING btree ("set_id","classroom_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_classroom_unique" ON "classroomusers" USING btree ("user_id","classroom_id");--> statement-breakpoint
CREATE INDEX "profiles_search_index" ON "profiles" USING gin (to_tsvector
      ('simple',
      "displayname"
      ));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_set_trackcommunities_unique" ON "studoprofilecommunities" USING btree ("classroom_id","studoprofile_id");--> statement-breakpoint
CREATE INDEX "studoprofiles_search_index" ON "studoprofiles" USING gin (to_tsvector
      ('simple',
      "displayname"
      ));--> statement-breakpoint
CREATE INDEX "studotracks_search_index" ON "studotracks" USING gin (to_tsvector
      ('simple',
      "displayname"
      ));--> statement-breakpoint
CREATE INDEX "studysets_search_index" ON "studysets" USING gin (to_tsvector
      ('simple',
      "title"
      ||
      ' '
      ||
      "course"
      ));--> statement-breakpoint
CREATE UNIQUE INDEX "idx_set_tracksets_unique" ON "tracksets" USING btree ("set_id","track_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "visualsets_search_index" ON "visualsets" USING gin (to_tsvector
      ('simple',
      "title"
      ||
      ' '
      ||
      "course"
      ));