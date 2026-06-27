import { Router } from "express";
import {
  createEventController,
  getEventByIdController,
} from "../controllers/event.controller";

const router = Router();

router.post("/", createEventController);

router.get("/:id", getEventByIdController);

export default router;
