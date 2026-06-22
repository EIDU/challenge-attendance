import type { Student } from "../types";

/**
 * Presentational only: given a student, render a row. No data fetching, no
 * business logic. The PR will extend this to show/toggle attendance.
 */
export function StudentRow({ student }: { student: Student }) {
  return (
    <li className="student-row">
      <span className="student-name">{student.name}</span>
    </li>
  );
}
