import { SystemClock } from "./clock.js";
import { InMemoryRosterRepository } from "./repository/RosterRepository.js";
import { RosterService } from "./services/RosterService.js";
import type { AppDependencies } from "./app.js";

/**
 * Composition root: the one place that knows how to construct concrete
 * implementations and wire them together. Everything else depends on
 * interfaces and receives its collaborators through its constructor.
 */
export function buildContainer(): AppDependencies {
  const clock = new SystemClock();
  const rosterRepository = new InMemoryRosterRepository();
  const rosterService = new RosterService(rosterRepository, clock);

  return { rosterService };
}
