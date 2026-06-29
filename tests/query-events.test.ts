import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("REQ-008 Query Events", () => {
  it("gets all events", async () => {
    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("filters by actor_id", async () => {
    const res = await request(app).get("/events?actor_id=user-1");

    expect(res.status).toBe(200);
  });

  it("filters by action", async () => {
    const res = await request(app).get("/events?action=CREATE");

    expect(res.status).toBe(200);
  });

  it("filters by resource_type", async () => {
    const res = await request(app).get("/events?resource_type=invoice");

    expect(res.status).toBe(200);
  });

  it("returns 404 for missing event", async () => {
    const res = await request(app).get(
      "/events/11111111-1111-1111-1111-111111111111",
    );

    expect(res.status).toBe(404);
  });
});
