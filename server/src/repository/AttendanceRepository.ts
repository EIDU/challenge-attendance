import type { AttendanceSession } from "../domain/attendance.js";

/**
 * Persistence for attendance sessions.
 *
 * NOTE: the in-memory implementation below is a local-dev stub and is NOT part
 * of this PR's review — real persistence (Postgres, multi-tenant) is tracked in
 * ATT-417. Treat it as a working fake: assume get/save behave like a real store.
 */
export interface AttendanceRepository {
  getSession(key: string): Promise<AttendanceSession | null>;
  saveSession(key: string, session: AttendanceSession): Promise<void>;
}

export class InMemoryAttendanceRepository implements AttendanceRepository {
  private readonly sessions = new Map<string, AttendanceSession>();

  async getSession(key: string): Promise<AttendanceSession | null> {
    return this.sessions.get(key) ?? null;
  }

  async saveSession(key: string, session: AttendanceSession): Promise<void> {
    this.sessions.set(key, session);
  }
}
