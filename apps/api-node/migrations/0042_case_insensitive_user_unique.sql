-- Case-insensitieve uniekheid op email en displayname.
--
-- ⚠️ De CREATE UNIQUE INDEX'en hieronder FALEN als er al casing-duplicaten
-- bestaan (bv. 'Bob@x.com' én 'bob@x.com'). Dedupe die eerst — detecteren:
--
--   SELECT lower(email) AS key, count(*), array_agg(id ORDER BY join_date)
--   FROM users GROUP BY lower(email) HAVING count(*) > 1;
--   SELECT lower(displayname) AS key, count(*), array_agg(id ORDER BY join_date)
--   FROM users GROUP BY lower(displayname) HAVING count(*) > 1;
--
-- Behoud per groep de originele (oudste join_date) en merge/verwijder de rest
-- handmatig; automatisch verwijderen is onveilig door foreign keys.

ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_displayname_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_user_email_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_unique" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "users_displayname_lower_unique" ON "users" USING btree (lower("displayname"));
