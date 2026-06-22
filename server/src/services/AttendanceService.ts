import type { AttendanceSession, AttendanceStatus } from "../domain/attendance.js";
import { AttendanceRepository } from "../repository/AttendanceRepository.js";

/**
 * Handles marking attendance for a class. Call beginMarking() to set the class
 * context, then mark() for each student.
 */
export class AttendanceService {
  private repository = new AttendanceRepository();

  private currentSchoolId: string | null = null;
  private currentClassId: string | null = null;

  // Running tally of how many of each status we've marked, for the response.
  private summary: Record<AttendanceStatus, number> = {
    pending: 0,
    present: 0,
    absent: 0,
    late: 0,
  };

  async beginMarking(schoolId: string, classId: string): Promise<void> {
    this.currentSchoolId = schoolId;
    this.currentClassId = classId;
    this.summary = { pending: 0, present: 0, absent: 0, late: 0 };

    const key = this.sessionKey();
    const existing = await this.repository.getSession(key);
    if (existing == null) {
      await this.repository.saveSession(key, {
        schoolId,
        classId,
        date: this.today(),
        marks: [],
      });
    }
  }

  async mark(studentId: string, status: AttendanceStatus): Promise<void> {
    const key = this.sessionKey();

    const session = await this.repository.getSession(key);
    if (session == null) {
      throw new Error("beginMarking() must be called before mark()");
    }

    session.marks.push({
      studentId,
      status,
      markedAt: this.now(),
    });

    await this.repository.saveSession(key, session);

    // Keep the running tally up to date.
    this.bumpSummary(status);
  }

  async markMany(
    marks: Array<{ studentId: string; status: AttendanceStatus }>,
  ): Promise<void> {
    // Apply marks one at a time so that the last status given for a student is
    // the one that sticks.
    for (const m of marks) {
      await this.mark(m.studentId, m.status);
    }
  }

  getSummary(): Record<AttendanceStatus, number> {
    return this.summary;
  }

  // Increments the in-memory tally for a status.
  private bumpSummary(status: AttendanceStatus): void {
    this.summary[status] = this.summary[status] + 1;
  }

  private sessionKey(): string {
    return `${this.currentSchoolId}:${this.currentClassId}:${this.today()}`;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private now(): string {
    return new Date().toISOString();
  }
}

// Single shared instance used by the routes.
export const attendanceService = new AttendanceService();
