import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("REQ-003 Create Event", () => {
  const validEvent = {
    actor_id: "user-1",
    action: "CREATE",
    resource_type: "invoice",
    resource_id: "INV-001",
  };

  it("creates a valid event", async () => {
    const res = await request(app).post("/events").send(validEvent);

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.event.actor_id).toBe(validEvent.actor_id);
  });

  it("assigns an id", async () => {
    const res = await request(app).post("/events").send(validEvent);

    expect(res.body.event.id).toBeDefined();
  });

  it("assigns a timestamp", async () => {
    const res = await request(app).post("/events").send(validEvent);

    expect(res.body.event.timestamp).toBeDefined();
  });

  it("assigns a signature", async () => {
    const res = await request(app).post("/events").send(validEvent);

    expect(res.body.event.signature).toBeDefined();
  });

  it("returns errors array", async () => {
    const res = await request(app).post("/events").send(validEvent);

    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});
