DROP INDEX "idx_board_users_unique";--> statement-breakpoint
ALTER TABLE "board_users" ALTER COLUMN "board_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "board_users" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "board_users" ADD CONSTRAINT "board_users_board_id_user_id_pk" PRIMARY KEY("board_id","user_id");