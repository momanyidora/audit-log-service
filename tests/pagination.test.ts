import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("REQ-009 Pagination", () => {
  it("uses default pagination", async () => {
    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(res.body.pagination.limit).toBe(10);
  });

  it("accepts limit", async () => {
    const res = await request(app).get("/events?limit=2");

    expect(res.body.pagination.limit).toBe(2);
  });

  it("accepts offset", async () => {
    const res = await request(app).get("/events?offset=1");

    expect(res.body.pagination.offset).toBe(1);
  });

  it("returns events array", async () => {
    const res = await request(app).get("/events");

    expect(Array.isArray(res.body.events)).toBe(true);
  });

  it("returns total", async () => {
    const res = await request(app).get("/events");

    expect(res.body.pagination.total).toBeDefined();
  });
});
