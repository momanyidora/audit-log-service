import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("REQ-007 Write Only", () => {
  const id = "11111111-1111-1111-1111-111111111111";

  it("rejects PUT", async () => {
    const res = await request(app).put(`/events/${id}`);

    expect(res.status).toBe(405);
  });

  it("rejects PATCH", async () => {
    const res = await request(app).patch(`/events/${id}`);

    expect(res.status).toBe(405);
  });

  it("rejects DELETE", async () => {
    const res = await request(app).delete(`/events/${id}`);

    expect(res.status).toBe(405);
  });

  it("returns ok false", async () => {
    const res = await request(app).put(`/events/${id}`);

    expect(res.body.ok).toBe(false);
  });

  it("returns METHOD_NOT_ALLOWED", async () => {
    const res = await request(app).delete(`/events/${id}`);

    expect(res.body.errors[0].code).toBe("METHOD_NOT_ALLOWED");
  });
});
