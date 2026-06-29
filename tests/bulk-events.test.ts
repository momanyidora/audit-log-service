import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("REQ-010 Bulk Insert", () => {
  const event = {
    actor_id: "bulk-user",
    action: "CREATE",
    resource_type: "invoice",
    resource_id: "1",
  };

  it("creates a batch", async () => {
    const res = await request(app).post("/events/bulk").send([event, event]);

    expect(res.status).toBe(201);
    expect(res.body.count).toBe(2);
  });

  it("rejects non-array", async () => {
    const res = await request(app).post("/events/bulk").send(event);

    expect(res.status).toBe(400);
  });

  it("rejects invalid event", async () => {
    const res = await request(app)
      .post("/events/bulk")
      .send([{ action: "CREATE" }]);

    expect(res.status).toBe(400);
  });

  it("rejects more than 100 events", async () => {
    const batch = Array.from({ length: 101 }, () => event);

    const res = await request(app).post("/events/bulk").send(batch);

    expect(res.status).toBe(400);
  });

  it("returns events array", async () => {
    const res = await request(app).post("/events/bulk").send([event]);

    expect(Array.isArray(res.body.events)).toBe(true);
  });
});
