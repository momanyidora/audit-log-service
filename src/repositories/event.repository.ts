import { db } from "../db";
import { events } from "../db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { count } from "drizzle-orm";
import { StoredEvent } from "../types/event.types";
export async function saveEvent(event: StoredEvent) {
  const [createdEvent] = await db.insert(events).values(event).returning();

  return createdEvent;
}

export async function findEventById(id: string) {
  const [event] = await db.select().from(events).where(eq(events.id, id));

  return event;
}

export async function getEvents() {
  return db.select().from(events);
}
export async function getFilteredEvents(
  filters: {
    actor_id?: string;
    action?: string;
    resource_type?: string;
    resource_id?: string;
    from?: string;
    to?: string;
  },
  limit: number,
  offset: number,
) {
  const conditions = [];

  if (filters.actor_id) {
    conditions.push(eq(events.actor_id, filters.actor_id));
  }

  if (filters.action) {
    conditions.push(eq(events.action, filters.action));
  }

  if (filters.resource_type) {
    conditions.push(eq(events.resource_type, filters.resource_type));
  }

  if (filters.resource_id) {
    conditions.push(eq(events.resource_id, filters.resource_id));
  }

  if (filters.from) {
    conditions.push(gte(events.timestamp, new Date(filters.from)));
  }

  if (filters.to) {
    conditions.push(lte(events.timestamp, new Date(filters.to)));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const data = await db
    .select()
    .from(events)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db
    .select({
      total: count(),
    })
    .from(events)
    .where(whereClause);

  return {
    data,
    total,
  };
}
export async function saveBulkEvents(eventsData: StoredEvent[]) {
  return await db.transaction(async (tx) => {
    return await tx.insert(events).values(eventsData).returning();
  });
}