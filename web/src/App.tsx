import { RosterScreen } from "./components/RosterScreen";

// Hardcoded selection for the challenge; a real app would route or let the
// teacher pick a school and class.
const SCHOOL_ID = "school-nairobi-01";
const CLASS_ID = "grade-3-a";

export function App() {
  return (
    <main>
      <RosterScreen schoolId={SCHOOL_ID} classId={CLASS_ID} />
    </main>
  );
}
