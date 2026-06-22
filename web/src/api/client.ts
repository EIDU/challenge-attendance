import type { ClassRoster } from "../types";

/**
 * All knowledge of the HTTP API lives here, so components deal in domain types
 * rather than fetch/URL details.
 */
export async function fetchRoster(
  schoolId: string,
  classId: string,
): Promise<ClassRoster> {
  const response = await fetch(
    `/api/schools/${schoolId}/classes/${classId}/roster`,
  );
  if (!response.ok) {
    throw new Error(`Failed to load roster (${response.status})`);
  }
  return (await response.json()) as ClassRoster;
}
