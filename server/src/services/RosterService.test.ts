import { describe, expect, it } from "vitest";
import type { Clock } from "../clock.js";
import type { ClassRoster } from "../domain/types.js";
import type { RosterRepository } from "../repository/RosterRepository.js";
import { RosterNotFoundError, RosterService } from "./RosterService.js";

/**
 * Because the service takes its collaborators through the constructor, the test
 * supplies tiny fakes — no network, no real clock, no container. This is the
 * payoff of dependency injection.
 */
const fixedClock: Clock = {
  now: () => new Date("2026-06-22T08:00:00Z"),
  today: () => "2026-06-22",
};

function repositoryReturning(roster: ClassRoster | null): RosterRepository {
  return {
    getRoster: async () => roster,
  };
}

describe("RosterService", () => {
  it("looks up the roster using today's date from the clock", async () => {
    const seenDates: string[] = [];
    const repository: RosterRepository = {
      getRoster: async (_schoolId, _classId, date) => {
        seenDates.push(date);
        return {
          schoolId: "school-1",
          classId: "class-1",
          className: "Grade 3A",
          date,
          students: [{ id: "s1", name: "Amani" }],
        };
      },
    };
    const service = new RosterService(repository, fixedClock);

    const result = await service.getRosterForToday("school-1", "class-1");

    expect(seenDates).toEqual(["2026-06-22"]);
    expect(result.students).toHaveLength(1);
  });

  it("throws when the class has no roster", async () => {
    const service = new RosterService(repositoryReturning(null), fixedClock);

    await expect(
      service.getRosterForToday("school-1", "missing"),
    ).rejects.toBeInstanceOf(RosterNotFoundError);
  });
});
