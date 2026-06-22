import { Router } from "express";
import type { AttendanceStatus } from "../domain/attendance.js";
import { attendanceService } from "../services/AttendanceService.js";

export function createAttendanceRouter(): Router {
  const router = Router();

  // Mark a single student.
  router.post(
    "/schools/:schoolId/classes/:classId/attendance",
    async (req, res) => {
      const { schoolId, classId } = req.params;
      const body = req.body as any;

      if (!body.studentId || !body.status) {
        res.status(400).json({ error: "studentId and status are required" });
        return;
      }

      await attendanceService.beginMarking(schoolId, classId);
      await attendanceService.mark(
        body.studentId,
        body.status as AttendanceStatus,
      );

      const summary = attendanceService.getSummary();
      res.json({
        ok: true,
        message: `Marked ${body.studentId} as ${body.status}`,
        summary,
      });
    },
  );

  // Mark several students in one request.
  router.post(
    "/schools/:schoolId/classes/:classId/attendance/bulk",
    async (req, res) => {
      const { schoolId, classId } = req.params;
      const body = req.body as any;

      if (!Array.isArray(body.marks)) {
        res.status(400).json({ error: "marks must be an array" });
        return;
      }

      await attendanceService.beginMarking(schoolId, classId);
      await attendanceService.markMany(body.marks);

      const summary = attendanceService.getSummary();
      res.json({
        ok: true,
        message: `Marked ${body.marks.length} students`,
        summary,
      });
    },
  );

  return router;
}
