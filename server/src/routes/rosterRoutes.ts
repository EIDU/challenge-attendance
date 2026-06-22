import { Router } from "express";
import { RosterNotFoundError, type RosterService } from "../services/RosterService.js";

/**
 * Thin HTTP adapter: translate a request into a service call and the result
 * into a response. No business logic lives here.
 */
export function createRosterRouter(rosterService: RosterService): Router {
  const router = Router();

  router.get(
    "/schools/:schoolId/classes/:classId/roster",
    async (req, res, next) => {
      const { schoolId, classId } = req.params;
      try {
        const roster = await rosterService.getRosterForToday(schoolId, classId);
        res.json(roster);
      } catch (error) {
        if (error instanceof RosterNotFoundError) {
          res.status(404).json({ error: error.message });
          return;
        }
        next(error);
      }
    },
  );

  return router;
}
