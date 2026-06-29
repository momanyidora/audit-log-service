import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("EXT-002 Verify Signature", () => {
  it("verifies an event", async () => {
    const created = await request(app).post("/events").send({
      actor_id: "verify-user",
      action: "CREATE",
      resource_type: "invoice",
      resource_id: "INV-10",
    });

    const id = created.body.event.id;

    const res = await request(app).get(`/events/${id}/verify`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("returns verified field", async () => {
    const created = await request(app).post("/events").send({
      actor_id: "verify-user",
      action: "CREATE",
      resource_type: "invoice",
      resource_id: "INV-11",
    });

    const res = await request(app).get(
      `/events/${created.body.event.id}/verify`,
    );

    expect(res.body.intact).toBeDefined();
  });

  it("returns message", async () => {
    const created = await request(app).post("/events").send({
      actor_id: "verify-user",
      action: "CREATE",
      resource_type: "invoice",
      resource_id: "INV-12",
    });

    const res = await request(app).get(
      `/events/${created.body.event.id}/verify`,
    );

    expect(typeof res.body.intact).toBe("boolean");
  });

  it("returns 404 for missing event", async () => {
    const res = await request(app).get(
      "/events/11111111-1111-1111-1111-111111111111/verify",
    );

    expect(res.status).toBe(404);
  });

  it("returns ok=true when found", async () => {
    const created = await request(app).post("/events").send({
      actor_id: "verify-user",
      action: "CREATE",
      resource_type: "invoice",
      resource_id: "INV-13",
    });

    const res = await request(app).get(
      `/events/${created.body.event.id}/verify`,
    );

    expect(res.body.ok).toBe(true);
  });
});
