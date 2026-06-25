import { Router } from "express";
import type { AttendanceStatus } from "../domain/attendance.js";
import { attendanceService } from "../services/AttendanceService.js";

export function createAttendanceRouter(): Router {
  const router = Router();

  router.post(
    "/schools/:schoolId/classes/:classId/attendance",
    async (req, res) => {
      const { schoolId, classId } = req.params;
      const body = req.body as any;

      if (!Array.isArray(body.marks)) {
        res.status(400).json({ error: "marks must be an array" });
        return;
      }

      const summary = await attendanceService.record(
        schoolId,
        classId,
        body.marks as Array<{ studentId: string; status: AttendanceStatus }>,
      );

      res.json({
        ok: true,
        message: `Recorded ${body.marks.length} mark(s)`,
        summary,
      });
    },
  );

  return router;
}
