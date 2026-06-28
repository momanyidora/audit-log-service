import { Router } from "express";
import {
  createEventController,
  getEventByIdController,
} from "../controllers/event.controller";

const router = Router();

router.post("/", createEventController);

router.get("/:id", getEventByIdController);
router.put("/:id", (_, res) => {
  res.status(405).json({
    ok: false,
    event: null,
    errors: [
      {
        field: "method",
        message: "PUT is not allowed.",
        code: "METHOD_NOT_ALLOWED",
      },
    ],
  });
});

router.patch("/:id", (_, res) => {
  res.status(405).json({
    ok: false,
    event: null,
    errors: [
      {
        field: "method",
        message: "PATCH is not allowed.",
        code: "METHOD_NOT_ALLOWED",
      },
    ],
  });
});

router.delete("/:id", (_, res) => {
  res.status(405).json({
    ok: false,
    event: null,
    errors: [
      {
        field: "method",
        message: "DELETE is not allowed.",
        code: "METHOD_NOT_ALLOWED",
      },
    ],
  });
});
export default router;
