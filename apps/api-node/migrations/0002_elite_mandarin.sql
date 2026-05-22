ALTER TABLE "profiles" ALTER COLUMN "join_date" SET DATA TYPE timestamp USING "join_date"::timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "join_date" SET DATA TYPE timestamp USING "join_date"::timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "streak_started" SET DATA TYPE timestamp USING "streak_started"::timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "streak_last_update" SET DATA TYPE timestamp USING "streak_last_update"::timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" SET DATA TYPE timestamp USING "last_login"::timestamp;
