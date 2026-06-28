import { Request, Response } from "express";
import { validateCreateEvent } from "../validators/create-event.validator";
import { createEvent } from "../services/event.service";
import { getEventById } from "../services/event.service";
import { getAllEvents } from "../services/event.service";
import { createBulkEvents } from "../services/event.service";

export async function createEventController(
  req: Request,
  res: Response,
): Promise<void> {
  const errors = validateCreateEvent(req.body);

  if (errors.length > 0) {
    res.status(400).json({
      ok: false,
      event: null,
      errors,
    });

    return;
  }

  const event = await createEvent(req.body);

  res.status(201).json({
    ok: true,
    event,
    errors: [],
  });
}
interface EventParams {
  id: string;
}
export async function getEventByIdController(
  req: Request<EventParams>,
  res: Response,
): Promise<void> {
  // console.log("ID:", JSON.stringify(req.params.id));

  const event = await getEventById(req.params.id);

  if (!event) {
    res.status(404).json({
      ok: false,
      event: null,
      errors: [
        {
          field: "id",
          message: "Event not found.",
          code: "NOT_FOUND",
        },
      ],
    });

    return;
  }

  res.status(200).json({
    ok: true,
    event,
    errors: [],
  });
}

export async function getEventsController(
  req: Request,
  res: Response,
): Promise<void> {
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;

  const result = await getAllEvents(
    {
      actor_id: req.query.actor_id as string,
      action: req.query.action as string,
      resource_type: req.query.resource_type as string,
      resource_id: req.query.resource_id as string,
      from: req.query.from as string,
      to: req.query.to as string,
    },
    limit,
    offset,
  );

  res.status(200).json({
    ok: true,
    events: result.data,
    pagination: {
      limit,
      offset,
      total: result.total,
    },
    errors: [],
  });
}
export async function createBulkEventsController(
  req: Request,
  res: Response,
): Promise<void> {
  const events = req.body;

  if (!Array.isArray(events)) {
    res.status(400).json({
      ok: false,
      event: null,
      errors: [
        {
          field: "body",
          message: "Body must be an array.",
          code: "INVALID_BODY",
        },
      ],
    });

    return;
  }

  if (events.length > 100) {
    res.status(400).json({
      ok: false,
      event: null,
      errors: [
        {
          field: "body",
          message: "Maximum of 100 events allowed.",
          code: "BATCH_LIMIT_EXCEEDED",
        },
      ],
    });

    return;
  }

  const allErrors = [];

  for (let i = 0; i < events.length; i++) {
    const errors = validateCreateEvent(events[i]);

    if (errors.length > 0) {
      allErrors.push({
        index: i,
        errors,
      });
    }
  }

  if (allErrors.length > 0) {
    res.status(400).json({
      ok: false,
      event: null,
      errors: allErrors,
    });

    return;
  }

  const createdEvents = await createBulkEvents(events);

  res.status(201).json({
    ok: true,
    count: createdEvents.length,
    events: createdEvents,
    errors: [],
  });
}