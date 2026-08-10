import { ConflictException } from '@nestjs/common';

// Postgres unique_violation.
const PG_UNIQUE_VIOLATION = '23505';

// Mapt de unieke-index-naam naar een veld-specifieke conflict-code voor de client.
const CONSTRAINT_CODES: Record<string, { code: string; message: string }> = {
  users_email_lower_unique: {
    code: 'EMAIL_TAKEN',
    message: 'There is already a user with this email address',
  },
  users_displayname_lower_unique: {
    code: 'DISPLAY_NAME_TAKEN',
    message: 'There is already a user with this display name',
  },
};

/**
 * Vangt de race die de pre-check mist: twee gelijktijdige writes glippen langs
 * de SELECT, waarna de DB-unique index één afkeurt met 23505. Zet dat om in een
 * nette 409 met dezelfde code als de pre-check; gooit al het andere door.
 */
export function rethrowAsConflict(error: unknown): never {
  const e = error as { code?: string; constraint?: string };
  if (e?.code === PG_UNIQUE_VIOLATION && e.constraint) {
    const mapped = CONSTRAINT_CODES[e.constraint];
    if (mapped) throw new ConflictException(mapped);
  }
  throw error;
}
