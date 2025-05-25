# Agent Guidance for FocusTracker

## 1 — Source of Truth

- **Always load `docs/project_spec.json`** before starting any new task or if current memory is uncertain.
- Treat the JSON spec as immutable unless the human product owner uploads a signed revision.

## 2 — Task Workflow

1. Pull the latest `main`.
2. Identify the Epic and User Story in scope.
3. Create a short branch name: `feat/<epic-id>-<story-id>`.
4. Implement code and tests **only** for that story.
5. Commit, push, open PR; wait for CI and human feedback before starting another story.

## 3 — Loop-Breaking Rules

- If CI fails **3 times** on the same branch, pause and post a diagnostic summary in the PR.
- If a dependency error cannot be resolved in **15 automated retries**, open an issue tagged `needs-human-input`.
- Never rebase or force-push `main`; let GitHub merge PRs.

## 4 — Context Recovery

- On startup, scan open PRs and issues for blockers.
- Re-read `docs/project_spec.json` plus the last 20 lines of each relevant PR discussion.
- Summarize current status to yourself before acting.

## 5 — Communication Protocol

- Use concise, bulleted PR descriptions.
- Tag the human only when:
  - All acceptance criteria appear satisfied **and**
  - CI, tests, and Vercel preview are green.

## 6 — Security & Privacy

- Do not add analytics, trackers, or external scripts.
- Keep all data local-only; no external databases.

_End of Guidance_
