ALTER TABLE "settings" ADD COLUMN "limit_tracking" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "show_streak" boolean DEFAULT true NOT NULL;