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
