# Immutable Audit Log Service

## What This Service Does

This is a REST API for recording audit events basically a permanent paper trail for sensitive actions in a system. Someone deletes a record, changes a price, updates another user's permissions;this service writes down who did it, what they did, what it affected, and when.

The main rule the whole thing is built around: once an event is written, it cannot be changed or removed. No edit endpoint, no delete endpoint, nothing. If you want to know what happened in your system last week, this is supposed to be a source you can actually trust.

On top of that, every event gets signed with HMAC when it's stored. So even if someone got into the database directly and edited a row by hand, there's a way to detect that the record doesn't match its signature anymore.

---
## Setup & Configuration.

You will need:
-Node.js
-PostgreSQL running somewhere (local is fine)
-npm

---

## clone it and install
```bash
 git clone <repository-url>
 cd immutable-audit-log-service
 npm install.
```

## Then make a .env file in the root with:
        -PORT=3000
        -DATABASE_URL=postgres://postgres:pasword@localhost:5432/event-log-db
        -HMAC_SECRET=secret-key

---
## Then generate and run the migration:
```bash
    npm run db:generate
    npm run db:migrate
 ```

## Running the server
```bash
  npm run dev
  ```
  Runs on http://localhost:3000 by default (or whatever port you set in .env).

---
  ## Running Tests
  ```bash
    npm run test:run
 ```   
    This runs the full Vitest suite; 35 tests across validation, creating events, querying, pagination, bulk inserts, signature verification, and write-only enforcement. All of it should pass on a clean clone, assuming your .env is set up and the database is reachable.

---

| Field | Required | Description |
|-------|----------|-------------|
| actor_id | Yes | Who performed the action |
| action | Yes | Action performed |
| resource_type | Yes | Type of resource |
| resource_id | Yes | Resource identifier |
| before_state | No | Previous state (JSON) |
| after_state | No | Updated state (JSON) |
| ip_address | No | Client IP address |
| user_agent | No | Client information |

You never send id, timestamp, or signature the server sets all three itself on write. Anything you send for those gets ignored. Timestamps are stored as ISO 8601 strings (e.g. 2026-06-29T08:10:15.000Z).

---

## Recording an Event (POST /events)

### Request:

```http
POST /events
Content-Type: application/json
```
{
  "actor_id": "user-1",
  "action": "UPDATE",
  "resource_type": "invoice",
  "resource_id": "INV-001",
  "before_state": { "status": "Pending" },
  "after_state": { "status": "Paid" }
}

Response (201):

 {
  "ok": true,
  "event": {
    "id": "f6f6b0a8-4d08-42cb-a2a3-df91f20d8b71",
    "actor_id": "user-1",
    "action": "UPDATE",
    "resource_type": "invoice",
    "resource_id": "INV-001",
    "before_state": { "status": "Pending" },
    "after_state": { "status": "Paid" },
    "timestamp": "2026-06-29T08:10:15.000Z",
    "signature": "a1b2c3..."
  },
  "errors": []
}

If something's missing, you get a 400 instead, and nothing gets stored:

 {
  "ok": false,
  "event": null,
  "errors": [
    {
      "field": "actor_id",
      "message": "actor_id is required.",
      "code": "MISSING_FIELD"
    }
  ]
}

If more than one field is wrong, all of the errors come back together, not just the first one it hits.

## Recording a Batch (POST /events/bulk)

For when you need to log a bunch of events at once. Caps out at 100 events per request anything bigger gets rejected outright, before any validation or DB work even starts.

The important part: this is all-or-nothing. If even one event in the array is invalid, none of them get written. No partial batches sitting in the database. 

For an audit log that matters a lot — a half-written batch is arguably worse than no batch, because it looks complete when it isn't.

---
### Request:

```http
POST /events/bulk
Content-Type: application/json
```
    [
    {
        "actor_id": "user-1",
        "action": "CREATE",
        "resource_type": "invoice",
        "resource_id": "INV-001"
    },
    {
        "actor_id": "user-2",
        "action": "DELETE",
        "resource_type": "invoice",
        "resource_id": "INV-002"
    }
    ]

Response (201):

    {
    "ok": true,
    "count": 2,
    "events": [ /* both stored events */ ],
    "errors": []
    }

---
 If one of them is bad, you get back which index failed and why, and nothing is saved:

        {
        "ok": false,
        "event": null,
        "errors": [
            {
            "index": 1,
            "errors": [
                {
                "field": "action",
                "message": "action is required.",
                "code": "MISSING_FIELD"
                }
            ]
            }
        ]
        }


---

## Querying Events (GET /events)

No filters, just get everything (paginated, see below):
    -GET /events

Filter by actor:
  -GET /events?actor_id=user-1

Filter by action, resource type, resource id  same pattern. They can also be combined, e.g. one actor's deletes within a date range:
   -GET /events?actor_id=user-1&action=DELETE&from=2026-06-01&to=2026-06-30

There's also GET /events/:id if you just want one specific event by id. Returns 404 if it doesn't exist.

## Pagination
    -GET /events takes limit and offset:
    -GET /events?limit=10&offset=20

    {
    "ok": true,
    "events": [],
    "pagination": {
        "limit": 10,
        "offset": 20,
        "total": 75
    },
    "errors": []
    }

---
Default limit is 10 if you don't pass one. Asking for a page past the end just gives you an empty array, not an error.
Signing & Verification (GET /events/:id/verify)

When an event is written, the server computes an HMAC-SHA256 signature over its contents using a secret from .env (HMAC_SECRET), and stores that signature next to the event. The secret itself never touches the database.

To check whether a stored event still matches what was originally written:

GET /events/:id/verify

```json
{
  "ok": true,
  "intact": true
}
---

If someone went into the database and changed a field directly (not through the API the API doesn't allow that anyway), the recomputed signature won't match the stored one, and intact comes back false.

Worth being honest about what this actually protects against: it tells you if something was changed after the fact.

 It does not stop someone with direct database access from making the change in the first place, and it doesn't protect the secret itself;if someone gets the HMAC_SECRET, they could forge a matching signature too. It's a detection mechanism, not a lock.

Verifying an id that doesn't exist returns 404.

## Why Write-Only

The whole point of an audit log is that you can trust it later. If the log itself can be edited or deleted, it stops being evidence of anything someone could just clean up after themselves and you'd never know.

So this API only supports creating events and reading them back. There's no PUT, PATCH, or DELETE route for /events at all. If you try one of those methods anyway, you get a 405 Method Not Allowed with a normal JSON error body, not a silent failure or a generic server error.



## API Reference (OpenAPI)

Full spec is in openapi.yaml at the project root, and it's served through Swagger UI while the server's running:
http://localhost:3000/api-docs


## Known Limitations
    - No authentication or authorization on any endpoint right now anyone who can reach the API can write events or read the whole log.
    - No rate limiting, so nothing stops someone from hammering the bulk endpoint repeatedly.
    - Assumes PostgreSQL specifically
    - HMAC verification can tell you a record was tampered with after writing, but it can't stop direct database access, and it relies on the secret staying secret.
    - By design, there is no way to fix a mistaken event after it's written that's the tradeoff for write-only. If bad data goes in, it stays in, signed and all.