import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("REQ-002 - Event Validation", () => {
  it("should reject a request with missing actor_id", async () => {
    const response = await request(app).post("/events").send({
      action: "create",
      resource_type: "invoice",
      resource_id: "INV-001",
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  it("should reject a request with missing action", async () => {
    const response = await request(app).post("/events").send({
      actor_id: "user1",
      resource_type: "invoice",
      resource_id: "INV-001",
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  it("should reject a request with missing resource_type", async () => {
    const response = await request(app).post("/events").send({
      actor_id: "user1",
      action: "create",
      resource_id: "INV-001",
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  it("should reject a request with missing resource_id", async () => {
    const response = await request(app).post("/events").send({
      actor_id: "user1",
      action: "create",
      resource_type: "invoice",
    });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
  });

  it("should accept a valid event", async () => {
    const response = await request(app).post("/events").send({
      actor_id: "user1",
      action: "create",
      resource_type: "invoice",
      resource_id: "INV-001",
    });

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
  });
});
