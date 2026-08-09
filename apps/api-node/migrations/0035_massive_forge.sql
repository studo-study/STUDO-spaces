DROP INDEX "idx_set_classroom_unique";--> statement-breakpoint
DROP INDEX "idx_user_classroom_unique";--> statement-breakpoint
DROP INDEX "idx_course_sets_unique";--> statement-breakpoint
DROP INDEX "idx_set_trackcommunities_unique";--> statement-breakpoint
ALTER TABLE "classroomsets" ADD CONSTRAINT "classroomsets_set_id_classroom_id_pk" PRIMARY KEY("set_id","classroom_id");--> statement-breakpoint
ALTER TABLE "classroomusers" ADD CONSTRAINT "classroomusers_user_id_classroom_id_pk" PRIMARY KEY("user_id","classroom_id");--> statement-breakpoint
ALTER TABLE "course_sets" ADD CONSTRAINT "course_sets_set_id_course_id_pk" PRIMARY KEY("set_id","course_id");--> statement-breakpoint
ALTER TABLE "studoprofilecommunities" ADD CONSTRAINT "studoprofilecommunities_classroom_id_studoprofile_id_pk" PRIMARY KEY("classroom_id","studoprofile_id");