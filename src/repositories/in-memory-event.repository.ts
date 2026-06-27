import { StoredEvent } from "../types/event.types";

const events: StoredEvent[] = [];

export function saveEvent(event: StoredEvent): StoredEvent {
  events.push(event);
  return event;
}
export function getEvents(): StoredEvent[] {
  return events;
}
export function findEventById(id: string) {
  return events.find((event) => event.id === id);
}