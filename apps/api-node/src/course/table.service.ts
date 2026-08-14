import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { UpdateCourseTable } from '@studo/types';
import { courseResources, courseRows, courseTables } from '../drizzle/schema';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class TableService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async updateTable(courseId: string, body: UpdateCourseTable) {
    let table = await this.db.query.courseTables.findFirst({
      where: eq(courseTables.courseId, courseId),
    });

    // nog geen tabel voor deze course → aanmaken met 3 lege rijen
    if (!table) {
      const [generatedTable] = await this.db
        .insert(courseTables)
        .values({
          courseId,
          title: body.title ?? '',
          description: body.description ?? '',
        })
        .returning();

      // enkel seeden wanneer de client (nog) geen rijen meestuurt
      if (!body.rows) {
        await this.db.insert(courseRows).values(
          Array.from({ length: 3 }, (_, i) => ({
            rowIndex: i + 1,
            tableId: generatedTable.id,
          })),
        );
      }

      table = generatedTable;
    }

    // alleen aangeleverde tabelvelden updaten
    const patch: Partial<typeof courseTables.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (body.title !== undefined) patch.title = body.title;
    if (body.description !== undefined) patch.description = body.description;

    await this.db
      .update(courseTables)
      .set(patch)
      .where(eq(courseTables.id, table.id));

    // volledige sync: rijen die de client meestuurt zijn de gewenste staat
    if (body.rows) {
      await this.syncRows(table.id, body.rows);
    }

    return this.getTable(table.id);
  }

  /**
   * Brengt de rijen van een tabel in lijn met de gewenste staat:
   * - rijen met bestaande id → updaten
   * - rijen zonder (bestaande) id → invoegen
   * - bestaande rijen die niet meer voorkomen → verwijderen
   * rowIndex volgt de volgorde in de payload.
   */
  private async syncRows(
    tableId: string,
    rows: NonNullable<UpdateCourseTable['rows']>,
  ) {
    const existing = await this.db
      .select({ id: courseRows.id })
      .from(courseRows)
      .where(eq(courseRows.tableId, tableId));
    const existingIds = new Set(existing.map((r) => r.id));

    const desiredIds = rows
      .map((r) => r.id)
      .filter((id): id is string => Boolean(id));

    // verwijderde rijen wissen
    const toDelete = [...existingIds].filter((id) => !desiredIds.includes(id));
    if (toDelete.length) {
      await this.db
        .delete(courseRows)
        .where(
          and(
            eq(courseRows.tableId, tableId),
            inArray(courseRows.id, toDelete),
          ),
        );
    }

    // upsert per rij, in volgorde
    for (const [index, row] of rows.entries()) {
      const rowIndex = row.rowIndex ?? index + 1;

      if (row.id && existingIds.has(row.id)) {
        const rowPatch: Partial<typeof courseRows.$inferInsert> = {
          rowIndex,
          updatedAt: new Date(),
        };
        if (row.title !== undefined) rowPatch.title = row.title;
        if (row.status !== undefined) rowPatch.status = row.status;
        if (row.priority !== undefined) rowPatch.priority = row.priority;
        if (row.description !== undefined)
          rowPatch.description = row.description;
        if (row.type !== undefined) rowPatch.type = row.type;
        if (row.dueDate !== undefined) rowPatch.dueDate = row.dueDate;

        await this.db
          .update(courseRows)
          .set(rowPatch)
          .where(eq(courseRows.id, row.id));
      } else {
        await this.db.insert(courseRows).values({
          id: row.id,
          tableId,
          rowIndex,
          title: row.title,
          status: row.status,
          priority: row.priority,
          description: row.description,
          type: row.type,
          dueDate: row.dueDate,
        });
      }

      if (row.id && row.resources !== undefined) {
        await this.syncResources(row.id, row.resources);
      }
    }
  }

  /** Brengt de resources van een rij in lijn met de gewenste staat. */
  private async syncResources(
    rowId: string,
    resources: NonNullable<
      NonNullable<UpdateCourseTable['rows']>[number]['resources']
    >,
  ) {
    const existing = await this.db
      .select({ id: courseResources.id })
      .from(courseResources)
      .where(eq(courseResources.rowId, rowId));
    const existingIds = new Set(existing.map((r) => r.id));

    const desiredIds = resources
      .map((r) => r.id)
      .filter((id): id is string => Boolean(id));

    const toDelete = [...existingIds].filter((id) => !desiredIds.includes(id));
    if (toDelete.length) {
      await this.db
        .delete(courseResources)
        .where(
          and(
            eq(courseResources.rowId, rowId),
            inArray(courseResources.id, toDelete),
          ),
        );
    }

    for (const res of resources) {
      if (res.id && existingIds.has(res.id)) {
        await this.db
          .update(courseResources)
          .set({ link: res.link })
          .where(eq(courseResources.id, res.id));
      } else {
        await this.db
          .insert(courseResources)
          .values({ id: res.id, rowId, link: res.link });
      }
    }
  }

  private async getTable(tableId: string) {
    const table = await this.db.query.courseTables.findFirst({
      where: eq(courseTables.id, tableId),
      with: { rows: { with: { resources: true } } },
    });
    if (!table) throw new NotFoundException('Course table not found');

    const iso = (d: Date | null) => (d ? d.toISOString() : null);

    return {
      id: table.id,
      courseId: table.courseId,
      title: table.title,
      description: table.description,
      createdAt: iso(table.createdAt),
      updatedAt: iso(table.updatedAt),
      rows: table.rows
        .sort((a, b) => a.rowIndex - b.rowIndex)
        .map((r) => ({
          id: r.id,
          tableId: r.tableId,
          rowIndex: r.rowIndex,
          createdBy: r.createdBy,
          createdAt: iso(r.createdAt),
          title: r.title ?? undefined,
          status: r.status,
          priority: r.priority,
          type: r.type,
          description: r.description,
          dueDate: r.dueDate,
          resources: r.resources.map((res) => ({
            id: res.id,
            rowId: res.rowId,
            link: res.link,
          })),
        })),
    };
  }
}
