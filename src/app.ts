import express from "express";
import eventRoutes from "./routes/event.routes";

const app = express();

app.use(express.json());

app.use("/events", eventRoutes);

export default app;
