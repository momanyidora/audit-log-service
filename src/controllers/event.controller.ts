import { Request, Response } from "express";
import { validateCreateEvent } from "../validators/create-event.validator";
import { createEvent } from "../services/event.service";
import { getEventById } from "../services/event.service";
export function createEventController(req: Request, res: Response): void {
  const errors = validateCreateEvent(req.body);

  if (errors.length > 0) {
    res.status(400).json({
      ok: false,
      event: null,
      errors,
    });

    return;
  }

  const event = createEvent(req.body);

  res.status(201).json({
    ok: true,
    event,
    errors: [],
  });
}
interface EventParams {
  id: string;
}

export function getEventByIdController(
  req: Request<EventParams>,
  res: Response,
): void {
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