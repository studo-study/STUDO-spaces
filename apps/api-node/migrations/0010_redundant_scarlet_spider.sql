CREATE TABLE "suggestion_images" (
	"image_id" varchar PRIMARY KEY NOT NULL,
	"pexels_id" varchar NOT NULL,
	"display_url" varchar NOT NULL,
	"source" varchar DEFAULT 'pexels' NOT NULL,
	"photographer" varchar,
	"source_page_url" varchar,
	CONSTRAINT "suggestion_images_pexels_id_unique" UNIQUE("pexels_id")
);
--> statement-breakpoint
CREATE TABLE "suggestion_terms" (
	"term_id" varchar PRIMARY KEY NOT NULL,
	"term" varchar NOT NULL,
	"lang" varchar NOT NULL,
	CONSTRAINT "suggestion_terms_term_lang_unique" UNIQUE("term","lang")
);
--> statement-breakpoint
CREATE TABLE "suggestion_terms_images" (
	"term_id" varchar NOT NULL,
	"image_id" varchar NOT NULL,
	"selected_count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "suggestion_terms_images_term_id_image_id_pk" PRIMARY KEY("term_id","image_id")
);
--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" ADD CONSTRAINT "suggestion_terms_images_term_id_suggestion_terms_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."suggestion_terms"("term_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" ADD CONSTRAINT "suggestion_terms_images_image_id_suggestion_images_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."suggestion_images"("image_id") ON DELETE no action ON UPDATE no action;