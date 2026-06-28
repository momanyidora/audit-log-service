import { pgTable, uuid, text, timestamp, json } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  actor_id: text("actor_id").notNull(),

  action: text("action").notNull(),

  resource_type: text("resource_type").notNull(),

  resource_id: text("resource_id").notNull(),

  before_state: json("before_state"),

  after_state: json("after_state"),

  ip_address: text("ip_address"),

  user_agent: text("user_agent"),

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
