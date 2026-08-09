CREATE TYPE "public"."account_status" AS ENUM('all_good', 'limited', 'very_limited', 'at_risk', 'banned', 'perma_banned');--> statement-breakpoint
CREATE TYPE "public"."app_theme" AS ENUM('light', 'dark', 'system');--> statement-breakpoint
CREATE TYPE "public"."online_status" AS ENUM('active', 'away', 'dnd');--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"dev_mode" boolean DEFAULT false NOT NULL,
	"debug_mode" boolean DEFAULT false NOT NULL,
	"show_reprocessing" boolean DEFAULT false NOT NULL,
	"visible_streak" boolean DEFAULT true NOT NULL,
	"share_group_progress" boolean DEFAULT true NOT NULL,
	"allow_group_invites" boolean DEFAULT true NOT NULL,
	"auto_group_participation" boolean DEFAULT false NOT NULL,
	"theme" "app_theme" DEFAULT 'system' NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"in_app_notifications" boolean DEFAULT true NOT NULL,
	"progress_notifications" boolean DEFAULT false NOT NULL,
	"streak_reminders" boolean DEFAULT true NOT NULL,
	"account_status" "account_status" DEFAULT 'all_good' NOT NULL,
	"online_status" "online_status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;