import { useEffect, useState } from "react";
import { fetchRoster, markAttendance } from "../api/client";
import type { AttendanceStatus, ClassRoster } from "../types";
import { StudentRow } from "./StudentRow";

interface RosterScreenProps {
  schoolId: string;
  classId: string;
}

// Remembers the marks made so far this session.
let savedMarks: Record<string, AttendanceStatus> = {};

export function RosterScreen({ schoolId, classId }: RosterScreenProps) {
  const [roster, setRoster] = useState<ClassRoster | null>(null);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoster(schoolId, classId)
      .then((r) => setRoster(r))
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Unknown error");
      });
  }, [schoolId, classId]);

  function handleMark(studentId: string, status: AttendanceStatus) {
    // Update the UI immediately.
    savedMarks[studentId] = status;
    setMarks({ ...savedMarks });

    // Persist in the background.
    markAttendance(schoolId, classId, studentId, status).catch(() => {
      setError(`Could not save attendance for ${studentId}`);
    });
  }

  function markAllPresent() {
    if (!roster) return;
    for (const student of roster.students) {
      handleMark(student.id, "present");
    }
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!roster) {
    return <p>Loading roster…</p>;
  }

  const markedCount = Object.keys(marks).length;

  return (
    <section>
      <h1>{roster.className}</h1>
      <p>{roster.date}</p>
      <p>
        {markedCount} / {roster.students.length} marked
      </p>
      <button onClick={markAllPresent}>Mark all present</button>
      <ul className="roster">
        {roster.students.map((student) => (
          <StudentRow
            key={student.id}
            student={student}
            status={marks[student.id]}
            onMark={handleMark}
          />
        ))}
      </ul>
    </section>
  );
}
