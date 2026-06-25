import { useEffect, useState } from "react";
import { fetchRoster } from "../api/client";
import type { ClassRoster } from "../types";
import { StudentRow } from "./StudentRow";

interface RosterScreenProps {
  schoolId: string;
  classId: string;
}

export function RosterScreen({ schoolId, classId }: RosterScreenProps) {
  const [roster, setRoster] = useState<ClassRoster | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRoster(schoolId, classId).then((loaded) => {
      if (!cancelled) setRoster(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [schoolId, classId]);

  if (!roster) {
    return <p>Loading roster…</p>;
  }

  return (
    <section>
      <h1>{roster.className}</h1>
      <p>{roster.date}</p>
      <ul className="roster">
        {roster.students.map((student) => (
          <StudentRow key={student.id} student={student} />
        ))}
      </ul>
    </section>
  );
}
