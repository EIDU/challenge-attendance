import type { AttendanceSession } from "../domain/attendance.js";

/**
 * Stores attendance sessions in memory, keyed by school/class/date.
 */
export class AttendanceRepository {
  private store = new Map<string, AttendanceSession>();

  async getSession(key: string): Promise<AttendanceSession | null> {
    return this.store.get(key) ?? null;
  }

  async saveSession(key: string, session: AttendanceSession): Promise<void> {
    this.store.set(key, session);
  }
}
