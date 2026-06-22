import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { createAttendanceRouter } from "./routes/attendanceRoutes.js";
import { createRosterRouter } from "./routes/rosterRoutes.js";
import type { RosterService } from "./services/RosterService.js";

export interface AppDependencies {
  rosterService: RosterService;
}

/**
 * Builds the Express app from its dependencies. Taking deps as an argument
 * (rather than constructing them here) keeps wiring in one place — the
 * composition root — and lets tests build an app over fakes.
 */
export function createApp(deps: AppDependencies): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api", createRosterRouter(deps.rosterService));
  app.use("/api", createAttendanceRouter());

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
