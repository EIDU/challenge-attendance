import type { AttendanceStatus, Student } from "../types";

interface StudentRowProps {
  student: Student;
  status: AttendanceStatus | undefined;
  onMark: (studentId: string, status: AttendanceStatus) => void;
}

export function StudentRow({ student, status, onMark }: StudentRowProps) {
  return (
    <li className="student-row">
      <span className="student-name">{student.name}</span>
      <button onClick={() => onMark(student.id, "present")}>Present</button>
      <button onClick={() => onMark(student.id, "absent")}>Absent</button>
      <button onClick={() => onMark(student.id, "late")}>Late</button>
      {status ? <span className="status">{status}</span> : null}
    </li>
  );
}
