CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" text NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"before_state" json,
	"after_state" json,
	"ip_address" text,
	"user_agent" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
