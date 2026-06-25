/**
 * Attendance types for the new "mark today's attendance" flow.
 */

// The set of states a student's attendance can be in.
export type AttendanceStatus = "pending" | "present" | "absent" | "late";

export interface AttendanceMark {
  studentId: string;
  status: AttendanceStatus;
  markedAt: string;
}

export interface AttendanceSession {
  schoolId: string;
  classId: string;
  date: string;
  marks: AttendanceMark[];
}
