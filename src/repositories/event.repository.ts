import { db } from "../db";
import { events } from "../db/schema";
import { eq } from "drizzle-orm";
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
