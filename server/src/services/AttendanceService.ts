import type { AttendanceStatus } from "../domain/attendance.js";
import { InMemoryAttendanceRepository } from "../repository/AttendanceRepository.js";

/**
 * Records attendance for a class. Call record() with the class context and the
 * marks the teacher made.
 */
export class AttendanceService {
  private repository = new InMemoryAttendanceRepository();

  private currentSchoolId: string | null = null;
  private currentClassId: string | null = null;

  // Running tally of how many of each status we've recorded, for the response.
  private summary: Record<AttendanceStatus, number> = {
    pending: 0,
    present: 0,
    absent: 0,
    late: 0,
  };

  async record(
    schoolId: string,
    classId: string,
    marks: Array<{ studentId: string; status: AttendanceStatus }>,
  ): Promise<Record<AttendanceStatus, number>> {
    this.currentSchoolId = schoolId;
    this.currentClassId = classId;

    // Apply marks one at a time so the latest status for a student wins.
    for (const mark of marks) {
      await this.mark(mark.studentId, mark.status);
    }

    return this.summary;
  }

  private async mark(studentId: string, status: AttendanceStatus): Promise<void> {
    const key = `${this.currentSchoolId}:${this.currentClassId}:${new Date()
      .toISOString()
      .slice(0, 10)}`;

    const session = await this.repository.getSession(key);
    const updated =
      session == null
        ? {
            schoolId: this.currentSchoolId as string,
            classId: this.currentClassId as string,
            date: new Date().toISOString().slice(0, 10),
            marks: [],
          }
        : session;

    updated.marks.push({
      studentId,
      status,
      markedAt: new Date().toISOString(),
    });

    await this.repository.saveSession(key, updated);

    this.summary[status] = this.summary[status] + 1;
  }
}

// Single shared instance used by the routes.
export const attendanceService = new AttendanceService();
