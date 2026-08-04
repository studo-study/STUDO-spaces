import { and, eq } from 'drizzle-orm';
import {
  classroomactivities,
  classroomsets,
  setlikes,
  studysessions,
} from '../drizzle/schema';
import type { DatabaseProvider } from '../drizzle/drizzle.provider';

export type SetType = 'studyset' | 'visualset';

type TransactionClient = Parameters<
  Parameters<DatabaseProvider['transaction']>[0]
>[0];

/**
 * Builds a fresh studysession row for a given set.
 * Shared by studyset and visualset services, which create identical sessions.
 */
export function buildNewSession(params: {
  userId: string;
  setId: string;
  setType: SetType;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const iso = now.toISOString();

  return {
    startedAt: iso,
    durationMin: 0,
    secondLastLogin: 'unknown',
    lastLogin: 'unknown',
    endedAt: 'unknown',
    index: 0,
    accuracy: 100,
    averageResponseTime: 0,
    longestFocusStreak: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    deviceType: 'unknown',
    lastSeen: iso,
    lastStudied: iso,
    userId: params.userId,
    setId: params.setId,
    setType: params.setType,
  };
}

/**
 * Deletes all polymorphic references (sessions, likes, classroom sets and
 * activities) scoped to a set of the given type. Runs inside the caller's
 * transaction. Shared by studyset and visualset deleteById implementations.
 */
export async function deleteSetReferences(
  tx: TransactionClient,
  setId: string,
  setType: SetType,
): Promise<void> {
  await tx
    .delete(studysessions)
    .where(
      and(eq(studysessions.setId, setId), eq(studysessions.setType, setType)),
    );

  await tx
    .delete(setlikes)
    .where(and(eq(setlikes.setId, setId), eq(setlikes.setType, setType)));

  await tx
    .delete(classroomsets)
    .where(
      and(eq(classroomsets.setId, setId), eq(classroomsets.setType, setType)),
    );

  await tx
    .delete(classroomactivities)
    .where(
      and(
        eq(classroomactivities.setId, setId),
        eq(classroomactivities.setType, setType),
      ),
    );
}
