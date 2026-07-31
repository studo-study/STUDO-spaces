CREATE TABLE "chat" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"board_id" varchar,
	"title" varchar NOT NULL,
	"creation_date" varchar NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_message" (
	"id" varchar PRIMARY KEY NOT NULL,
	"chat_id" varchar NOT NULL,
	"sven_message" boolean NOT NULL,
	"sort_index" integer NOT NULL,
	"content" varchar(1000) NOT NULL,
	"created_at" varchar NOT NULL,
	CONSTRAINT "chat_message_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "chat_message_payload" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"message_id" varchar NOT NULL,
	"flowcourse_id" varchar,
	"studoset_id" varchar,
	"card_id" varchar
);
--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" DROP CONSTRAINT "suggestion_terms_cards_card_id_cards_id_fk";
--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" DROP CONSTRAINT "suggestion_terms_cards_image_id_suggestion_images_id_fk";
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_board_id_flowboards_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."flowboards"("board_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ADD CONSTRAINT "chat_message_payload_message_id_chat_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_message"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ADD CONSTRAINT "chat_message_payload_flowcourse_id_flowcourses_flowcourse_id_fk" FOREIGN KEY ("flowcourse_id") REFERENCES "public"."flowcourses"("flowcourse_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ADD CONSTRAINT "chat_message_payload_studoset_id_studysets_id_fk" FOREIGN KEY ("studoset_id") REFERENCES "public"."studysets"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_message_payload" ADD CONSTRAINT "chat_message_payload_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_search_index" ON "chat" USING gin (to_tsvector
      ('simple',
      "id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_search_index" ON "chat" USING gin (to_tsvector
      ('simple',
      "user_id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_title_search_index" ON "chat" USING gin (to_tsvector
      ('simple',
      "title"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_search_index" ON "chat_message" USING gin (to_tsvector
      ('simple',
      "id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_id_search_index" ON "chat_message" USING gin (to_tsvector
      ('simple',
      "chat_id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "payload_search_index" ON "chat_message_payload" USING gin (to_tsvector
      ('simple',
      "id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_id_search_index" ON "chat_message_payload" USING gin (to_tsvector
      ('simple',
      "message_id"
      ));--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ADD CONSTRAINT "suggestion_terms_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ADD CONSTRAINT "suggestion_terms_cards_image_id_suggestion_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."suggestion_images"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flowboards_search_index" ON "flowboards" USING gin (to_tsvector
      ('simple',
      "board_id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flowboard_title_search_index" ON "flowboards" USING gin (to_tsvector
      ('simple',
      "title"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flowcourses_search_index" ON "flowcourses" USING gin (to_tsvector
      ('simple',
      "flowcourse_id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "board_id_search_index" ON "flowcourses" USING gin (to_tsvector
      ('simple',
      "board_id"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flow_course_title_search_index" ON "flowcourses" USING gin (to_tsvector
      ('simple',
      "title"
      ));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "visualsets_images_index" ON "images" USING gin (to_tsvector
      ('simple',
      "title"
      ));