import type { ClassRoster, Student } from "../domain/types.js";

/**
 * Persistence seam for rosters. The service depends on this interface, not on a
 * concrete store, so the storage technology can change (and be faked in tests)
 * without touching business logic.
 */
export interface RosterRepository {
  getRoster(
    schoolId: string,
    classId: string,
    date: string,
  ): Promise<ClassRoster | null>;
}

interface SeedClass {
  schoolId: string;
  classId: string;
  className: string;
  students: Student[];
}

const DEFAULT_SEED: SeedClass[] = [
  {
    schoolId: "school-nairobi-01",
    classId: "grade-3-a",
    className: "Grade 3A",
    students: [
      { id: "stu-001", name: "Amani Okello" },
      { id: "stu-002", name: "Brian Kiptoo" },
      { id: "stu-003", name: "Chebet Mwangi" },
      { id: "stu-004", name: "Daniel Otieno" },
      { id: "stu-005", name: "Esther Wanjiru" },
      { id: "stu-006", name: "Faith Achieng" },
    ],
  },
  {
    schoolId: "school-nairobi-01",
    classId: "grade-4-b",
    className: "Grade 4B",
    students: [
      { id: "stu-101", name: "George Mutua" },
      { id: "stu-102", name: "Halima Yusuf" },
      { id: "stu-103", name: "Ian Njoroge" },
    ],
  },
];

export class InMemoryRosterRepository implements RosterRepository {
  private readonly classes: SeedClass[];

  constructor(seed: SeedClass[] = DEFAULT_SEED) {
    this.classes = seed;
  }

  async getRoster(
    schoolId: string,
    classId: string,
    date: string,
  ): Promise<ClassRoster | null> {
    const found = this.classes.find(
      (c) => c.schoolId === schoolId && c.classId === classId,
    );
    if (!found) return null;

    return {
      schoolId: found.schoolId,
      classId: found.classId,
      className: found.className,
      date,
      students: found.students,
    };
  }
}
