import type { Clock } from "../clock.js";
import type { ClassRoster } from "../domain/types.js";
import type { RosterRepository } from "../repository/RosterRepository.js";

export class RosterNotFoundError extends Error {
  constructor(schoolId: string, classId: string) {
    super(`No roster found for class "${classId}" in school "${schoolId}".`);
    this.name = "RosterNotFoundError";
  }
}

/**
 * Application logic for reading rosters. Dependencies are injected through the
 * constructor: the service owns no state of its own and is trivial to
 * instantiate with fakes in a test.
 */
export class RosterService {
  constructor(
    private readonly repository: RosterRepository,
    private readonly clock: Clock,
  ) {}

  async getRosterForToday(
    schoolId: string,
    classId: string,
  ): Promise<ClassRoster> {
    const today = this.clock.today();
    const roster = await this.repository.getRoster(schoolId, classId, today);
    if (roster === null) {
      throw new RosterNotFoundError(schoolId, classId);
    }
    return roster;
  }
}
