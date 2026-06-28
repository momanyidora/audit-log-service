import { Request, Response } from "express";
import { validateCreateEvent } from "../validators/create-event.validator";
import { createEvent } from "../services/event.service";
import { getEventById } from "../services/event.service";
export async function createEventController(
  req: Request,
  res: Response
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

