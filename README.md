# Attendance — Technical Interview Challenge

A small TypeScript full-stack app for the national school **attendance** feature:
a teacher opens a class and sees the day's roster. This repository is the
**baseline** — clean, deliberately simple, and the starting point for the code
review.

During the interview the candidate reviews a **pull request** (on a separate
branch) where a mid-level engineer adds the "mark today's attendance" flow. The
review conversation is where the signal lives.

## Layout

```
challenge-attendance/
  server/   Express + TypeScript API (in-memory data, hand-rolled DI)
  web/      React + Vite + TypeScript client
```

## Running it

Two terminals.

```bash
# 1) API on http://localhost:4000
cd server
npm install
npm run dev

# 2) Web on http://localhost:5173 (proxies /api to the server)
cd web
npm install
npm run dev
```

Open http://localhost:5173 — you should see the **Grade 3A** roster.

Other useful scripts (in each package): `npm run typecheck`, and in `server/`
`npm test` runs the example unit test that demonstrates the injection seam.

## Notes for the interviewer

- `main` is this clean baseline. The challenge PR lives on its own branch.
- The baseline is intentionally well-structured (constructor injection +
  composition root in `server/src/container.ts`, time behind a `Clock`, thin
  route handlers, state owned by the component that uses it). It doubles as the
  reference for "what good looks like" when contrasting against the PR.
- Data is in-memory (`server/src/repository/RosterRepository.ts`); no database
  setup required.
