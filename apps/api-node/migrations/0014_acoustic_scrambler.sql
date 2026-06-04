ALTER TABLE "suggestion_terms_images" DROP CONSTRAINT IF EXISTS "suggestion_terms_images_term_id_suggestion_terms_id_fk";--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" DROP CONSTRAINT IF EXISTS "suggestion_terms_images_image_id_suggestion_images_id_fk";--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" DROP CONSTRAINT IF EXISTS "suggestion_terms_images_term_id_image_id_pk";--> statement-breakpoint
ALTER TABLE "suggestion_terms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "suggestion_terms" CASCADE;--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" RENAME TO "suggestion_terms_cards";--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" RENAME COLUMN "term_id" TO "card_id";--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ADD CONSTRAINT "suggestion_terms_cards_card_id_image_id_pk" PRIMARY KEY("card_id","image_id");--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "suggestion_image_id" varchar(64);--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ADD CONSTRAINT "suggestion_terms_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestion_terms_cards" ADD CONSTRAINT "suggestion_terms_cards_image_id_suggestion_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."suggestion_images"("id") ON DELETE cascade ON UPDATE no action;