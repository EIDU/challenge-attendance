export interface Student {
  id: string;
  name: string;
}

export interface ClassRoster {
  schoolId: string;
  classId: string;
  className: string;
  date: string;
  students: Student[];
}

export type AttendanceStatus = "pending" | "present" | "absent" | "late";
