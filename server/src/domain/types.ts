/**
 * Core domain types for the attendance feature.
 *
 * Baseline scope: read a class roster. Marking attendance is added by a later
 * change (the PR under review), so no attendance-status types live here yet.
 */

export interface Student {
  readonly id: string;
  readonly name: string;
}

export interface ClassRoster {
  readonly schoolId: string;
  readonly classId: string;
  readonly className: string;
  /** ISO calendar date, e.g. "2026-06-22". */
  readonly date: string;
  readonly students: readonly Student[];
}
