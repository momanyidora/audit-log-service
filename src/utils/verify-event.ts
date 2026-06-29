import { StoredEvent } from "../types/event.types";
import { signEvent } from "./sign-events";

export function verifyEvent(event: StoredEvent): boolean {
  const expectedSignature = signEvent({
    id: event.id,
    actor_id: event.actor_id,
    action: event.action,
    resource_type: event.resource_type,
    resource_id: event.resource_id,
    before_state: event.before_state,
    after_state: event.after_state,
    ip_address: event.ip_address,
    user_agent: event.user_agent,
    timestamp: event.timestamp,
  });

  return expectedSignature === event.signature;
}
