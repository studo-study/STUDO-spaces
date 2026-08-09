ALTER TABLE "settings" ALTER COLUMN "auto_group_participation" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "all_sets_private" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "experimental_group_features" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "group_notifications" boolean DEFAULT true NOT NULL;