import crypto from "crypto";
import { AuditEvent, StoredEvent } from "../types/event.types";
import { saveEvent } from "../repositories/in-memory-event.repository";

import { findEventById } from "../repositories/in-memory-event.repository";

export function createEvent(event: AuditEvent): StoredEvent {
  const newEvent: StoredEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    actor_id: event.actor_id,
    action: event.action,
    resource_type: event.resource_type,
    resource_id: event.resource_id,
    before_state: event.before_state,
    after_state: event.after_state,
    ip_address: event.ip_address,
    user_agent: event.user_agent,
  };
  return saveEvent(newEvent);
}
export function getEventById(id: string) {
  return findEventById(id);
}