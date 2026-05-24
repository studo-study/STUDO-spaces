ALTER TABLE "sessioncards" DROP CONSTRAINT "sessioncards_card_id_cards_id_fk";
--> statement-breakpoint
ALTER TABLE "cards" ADD COLUMN "term_is_latex" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "sessioncards" ADD CONSTRAINT "sessioncards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;