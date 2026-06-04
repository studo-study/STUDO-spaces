ALTER TABLE "suggestion_images" RENAME COLUMN "image_id" TO "id";--> statement-breakpoint
ALTER TABLE "suggestion_terms" RENAME COLUMN "term_id" TO "id";--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" DROP CONSTRAINT "suggestion_terms_images_term_id_suggestion_terms_term_id_fk";
--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" DROP CONSTRAINT "suggestion_terms_images_image_id_suggestion_images_image_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "filled_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" ADD CONSTRAINT "suggestion_terms_images_term_id_suggestion_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."suggestion_terms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestion_terms_images" ADD CONSTRAINT "suggestion_terms_images_image_id_suggestion_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."suggestion_images"("id") ON DELETE no action ON UPDATE no action;