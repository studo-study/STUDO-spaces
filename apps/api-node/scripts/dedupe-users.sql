-- ============================================================================
-- Dedupe users vóór migratie 0042 (case-insensitieve unique op email/displayname).
--
-- Waarom: de bestaande unique constraints zijn case-sensitive, dus 'Bob@x.com'
-- en 'bob@x.com' zitten als aparte rijen in de DB. Migratie 0042 maakt een
-- UNIQUE INDEX op lower(email)/lower(displayname); die FAALT zolang er nog
-- case-duplicaten bestaan. Dit script ruimt ze op.
--
-- Aanpak:
--   1. EMAIL-duplicaten = dezelfde persoon → mergen naar de oudste account
--      (join_date). Alle rijen die naar de loser wijzen worden omgezet naar de
--      keeper; 1:1-kinderen (settings/profiles/…) waar de keeper al een rij
--      heeft worden voor de loser verwijderd. Daarna wordt de loser-user gewist.
--   2. DISPLAYNAME-duplicaten = verschillende personen → NIET mergen, maar de
--      jongere rijen hernoemen met een uniek suffix.
--
-- ⚠️ Draai dit één keer, in een transactie, MET een verse backup. Bekijk de
--    output van de verificatie-queries onderaan voordat je commit.
-- ============================================================================

BEGIN;

-- ── 1) EMAIL: merge duplicaten naar de oudste account ───────────────────────
CREATE TEMP TABLE _email_merge ON COMMIT DROP AS
SELECT id AS loser,
       first_value(id) OVER (
         PARTITION BY lower(email) ORDER BY join_date ASC, id ASC
       ) AS keeper
FROM users;
DELETE FROM _email_merge WHERE loser = keeper;

-- Repoint elke foreign key die naar users(id) wijst, generiek via de catalog.
-- Bij een unique_violation (1:1-kind waar de keeper al een rij heeft) wordt de
-- loser-rij verwijderd i.p.v. omgezet.
DO $$
DECLARE fk RECORD;
BEGIN
  FOR fk IN
    SELECT tc.table_name AS tbl, kcu.column_name AS col
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON kcu.constraint_name = tc.constraint_name
     AND kcu.table_schema = tc.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
     AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_name = 'users'
      AND ccu.column_name = 'id'
  LOOP
    BEGIN
      EXECUTE format(
        'UPDATE %I c SET %I = m.keeper FROM _email_merge m WHERE c.%I = m.loser',
        fk.tbl, fk.col, fk.col);
    EXCEPTION WHEN unique_violation THEN
      EXECUTE format(
        'DELETE FROM %I c USING _email_merge m WHERE c.%I = m.loser',
        fk.tbl, fk.col);
    END;
  END LOOP;
END $$;

DELETE FROM users u USING _email_merge m WHERE u.id = m.loser;

-- ── 2) DISPLAYNAME: hernoem overgebleven case-duplicaten (aparte personen) ──
WITH ranked AS (
  SELECT id,
         displayname,
         row_number() OVER (
           PARTITION BY lower(displayname) ORDER BY join_date ASC, id ASC
         ) AS rn
  FROM users
)
UPDATE users u
SET displayname = left(u.displayname, 90) || '_' || substr(u.id::text, 1, 8)
FROM ranked r
WHERE u.id = r.id
  AND r.rn > 1;

-- ── Verificatie: beide moeten 0 rijen teruggeven vóór je commit ─────────────
-- SELECT lower(email) AS k, count(*) FROM users GROUP BY 1 HAVING count(*) > 1;
-- SELECT lower(displayname) AS k, count(*) FROM users GROUP BY 1 HAVING count(*) > 1;

COMMIT;
