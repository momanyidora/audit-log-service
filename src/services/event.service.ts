import crypto from "crypto";
import { AuditEvent, StoredEvent } from "../types/event.types";
import { saveEvent, findEventById, saveBulkEvents} from "../repositories/event.repository";
import { getFilteredEvents } from "../repositories/event.repository";
export async function createEvent(event: AuditEvent) {
  const newEvent: StoredEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date(),

    actor_id: event.actor_id,
    action: event.action,
    resource_type: event.resource_type,
    resource_id: event.resource_id,
    before_state: event.before_state,
    after_state: event.after_state,
    ip_address: event.ip_address,
    user_agent: event.user_agent,
  };

  return await saveEvent(newEvent);
}

export async function getEventById(id: string) {
  return await findEventById(id);
}
export async function getAllEvents(
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
  return await getFilteredEvents(filters, limit, offset);
}
export async function createBulkEvents(events: AuditEvent[]) {
  const newEvents: StoredEvent[] = events.map((event) => ({
    id: crypto.randomUUID(),
    timestamp: new Date(),

    actor_id: event.actor_id,
    action: event.action,
    resource_type: event.resource_type,
    resource_id: event.resource_id,
    before_state: event.before_state,
    after_state: event.after_state,
    ip_address: event.ip_address,
    user_agent: event.user_agent,
  }));

  return await saveBulkEvents(newEvents);
}