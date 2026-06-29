import crypto from "crypto";
import { StoredEvent } from "../types/event.types";

const SECRET = process.env.HMAC_SECRET || "default-secret";

export function signEvent(event: Omit<StoredEvent, "signature">): string {
  const payload = JSON.stringify({
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

  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}
