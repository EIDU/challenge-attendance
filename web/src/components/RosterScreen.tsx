import { useEffect, useState } from "react";
import { fetchRoster } from "../api/client";
import type { ClassRoster } from "../types";
import { StudentRow } from "./StudentRow";

interface RosterScreenProps {
  schoolId: string;
  classId: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; roster: ClassRoster };

/**
 * Owns the roster-loading state for a class. State lives in the component that
 * uses it; children are passed plain data.
 */
export function RosterScreen({ schoolId, classId }: RosterScreenProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetchRoster(schoolId, classId)
      .then((roster) => {
        if (!cancelled) setState({ status: "ready", roster });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [schoolId, classId]);

  if (state.status === "loading") {
    return <p>Loading roster…</p>;
  }

  if (state.status === "error") {
    return <p role="alert">Could not load roster: {state.message}</p>;
  }

  const { roster } = state;
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
