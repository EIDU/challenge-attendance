/**
 * Time is a dependency, not an ambient global. Injecting a Clock keeps services
 * testable (a fake clock makes "today" deterministic) instead of reaching for
 * `new Date()` inline.
 */
export interface Clock {
  now(): Date;
  /** Today's date as an ISO calendar string, e.g. "2026-06-22". */
  today(): string;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }

  today(): string {
    return this.now().toISOString().slice(0, 10);
  }
}
