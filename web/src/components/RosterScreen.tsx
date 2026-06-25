import { useEffect, useState } from "react";
import { fetchRoster, markAttendance } from "../api/client";
import type { AttendanceStatus, ClassRoster } from "../types";
import { StudentRow } from "./StudentRow";

interface RosterScreenProps {
  schoolId: string;
  classId: string;
}

// Remembers the marks made so far.
let savedMarks: Record<string, AttendanceStatus> = {};

export function RosterScreen({ schoolId, classId }: RosterScreenProps) {
  const [roster, setRoster] = useState<ClassRoster | null>(null);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    let cancelled = false;
    fetchRoster(schoolId, classId).then((loaded) => {
      if (!cancelled) setRoster(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [schoolId, classId]);

  function handleMark(studentId: string, status: AttendanceStatus) {
    savedMarks[studentId] = status;
    setMarks({ ...savedMarks });
    markAttendance(schoolId, classId, studentId, status);
  }

  function markAllPresent() {
    if (!roster) return;
    for (const student of roster.students) {
      handleMark(student.id, "present");
    }
  }

  if (!roster) {
    return <p>Loading roster…</p>;
  }

  return (
    <section>
      <h1>{roster.className}</h1>
      <p>{roster.date}</p>
      <button onClick={markAllPresent}>Mark all present</button>
      <ul className="roster">
        {roster.students.map((student) => (
          <StudentRow
            student={student}
            status={marks[student.id]}
            onMark={handleMark}
          />
        ))}
      </ul>
    </section>
  );
}
