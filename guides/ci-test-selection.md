[← Home](../README.md)

# CI test selection

How the videos monorepo decides which E2E suites a pull request needs, and how that is being rolled out. Read from [AlUmmahNow](../repos/AlUmmahNow.md) `main` on 2026-11-16 ([#1542](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1542)). The code is in [`scripts/ci/select/`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/scripts/ci/select).

## The short version

- A PR's changed files are mapped onto a **dependency graph**. The suites the changes can reach are **selected**.
- A shared-package change reaches every app that uses the package, so those apps' suites still run.
- **Pushes to `main`, the nightly run, releases and hand-started runs always run everything.**
- **Today it runs in shadow mode.** Every suite still runs. The selector only reports what it *would* run and skip, and the gate records every job it would have skipped that failed (a "miss"). Selection becomes real only after the owner has reviewed the shadow data.

## How a selection is made

1. **Changed files**: `git diff` between the PR's merge base and its head.
2. **File → node.** Each file takes the first node in [`graph.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/scripts/ci/select/graph.ts) whose globs match it. Markdown and `docs/` are ignored.
3. **Walk.** The selector does a breadth-first walk over "used → users" edges. Edges come from:
   - the `workspace:*` deps in each `package.json`, read at run time;
   - sub-node → parent links (for example `web:player` → `web`);
   - `EXTRA_EDGES`, the references `package.json` does not declare (see the drift check below).
4. **Suites.** A suite is selected when the walk reaches anything in its `dependsOn`. Local E2E's build job runs when the web, admin or release suite does. Each selected suite is shown with the chain that selected it, for example `packages/shared-types/src/video.ts → shared-types → web:player → Player E2E`.
5. **Placement table.** `apps/web/e2e/test-utils/placement.ts` is diffed row by row: each changed row selects its spec's suite. A change anywhere else in that file runs everything.

| Suite | Runs against |
|---|---|
| Local web suite (5 shards) | web specs; web, api-videos, processor, websocket-server, short-links |
| Local admin suite (5) | admin specs; admin-web, admin-api, api-videos, processor, websocket-server, status, web |
| Local release suite (7) | release specs; all eight apps the local stack boots |
| Player E2E (6 browsers) | player specs; the player paths in web (with resume storage and `next.config.ts`); fanous-tokens |

### Runs everything

The selector **fails open**: when in doubt, it runs every suite.

- **Any event other than `pull_request`**, or the PR label **`ci:full`**.
- **A file no node maps.** A new folder or a new app runs everything until it is added to the graph.
- **A selector error**: git, the placement table, anything else.
- **Global inputs**:
  - dependencies: lockfile, any `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `patches/`;
  - build config: `turbo.json`, `tsconfig*.json`;
  - CI: the Local E2E, Player E2E and deploy workflows, `.github/actions/`, the selector itself, `playwright-outcomes.ts`, `qa-lock.ts`;
  - the local stack: `scripts/local-stack/`, `scripts/e2e/`, the stack apps' wrangler configs;
  - the shared E2E harness: `e2e/test-utils/`, `e2e/seed/`, `e2e/test-fixtures/`, release-suite helpers;
  - files the stack scripts import: `shared-types/src/queue.ts`, `scripts/release/{jsonc,cf-api,upload-budget}.ts`, and cost-monitor's migrations (admin-api's stack config applies them).

### Selects no E2E suite

These changes skip E2E entirely: unit tests and type-check run on every PR in `deploy.yml`, whatever the selector says.

- Unit tests (`test/`, `__tests__/`, `*.test.*`).
- fanous-tokens tooling: the generators, the colour lint, their tests and `theme-colors.allowlist.json`.
- Workers not on the local stack: scheduler, media, cost-monitor (apart from its migrations), log-service, mcp-log-server.
- Ops scripts (`scripts/release|qa|migrations|data|media-cdn|ops`).
- Other workflows.

## Keeping the graph right

`pnpm test:scripts` runs these checks on every PR (`release-checks`):

- **Coverage.** Every tracked file maps to a node or the ignore list, and every node matches at least one file.
- **Edge drift.** [`import-edges.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/scripts/ci/select/import-edges.ts) scans for cross-unit references: relative imports, CSS `@import`, config and package-script paths (`../../packages/...`), and bare `@al-ummah/*` imports. Inside fanous-tokens it also scans `./` imports between files of the same package, because that package is split into runtime and tooling.
  - The test fails when a reference would let a change skip a suite the user's code is in (**missing edge**).
  - It also fails when an `EXTRA_EDGES` entry is no longer supported by any reference in the tree (**stale edge**).
  - The placement table is exempt, because it is diffed by row.
- **Spec ownership.** Every E2E spec, and every `SPEC_PLACEMENT` key, selects exactly one suite. The theme-visibility, help-picture and production-check specs select none, because they run in their own workflows.
- **Golden cases.** Known file lists with their expected suites, including the replay of [#1521](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1521) (admin + release only).

**When a test fails:** add the path to a node, or add the edge with a `why` naming the file that creates it. To see the current scan, run `node --experimental-strip-types scripts/ci/select/drift.ts`.

**Known limit:** inside `apps/web`, the `web:player` sub-node is the same path list as Player E2E's `paths:` filter (resume storage and `next.config.ts` added in [#1697](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1697)); Player E2E also runs on every push to `main` and in every release, whatever changed. A web file outside that list does not select Player E2E even if the player imports it, which is no change from before.

## Shadow rollout

| Phase | What changes | Exit |
|---|---|---|
| **0 · Shadow** (now) | The `Test selection` job writes "would run / would skip" to the run summary, plus the `test-selection` artifact. The `CI gate` job writes `selection-audit` (job, selected, result, miss). Every suite still runs. | 2 weeks and at least 40 PRs with zero real misses |
| 1 · Enforce suites | Suites wait for `select` and skip when not selected. Player E2E moves into Local E2E (a `paths:`-filtered workflow stays Pending as a required check). `CI gate` becomes a required check. | 4 weeks without a main or nightly break that a PR run skipped |
| 2 · Spec level | Placement rows get an `apps` field, so the admin and release suites run only the matching spec files | No per-spec misses |
| 3 · Optional | `turbo run test type-check --affected` once workspace deps are complete | — |

Phases 1 to 3 need the owner's go-ahead after the shadow data.

### Reading the shadow data

```bash
node --experimental-strip-types scripts/ci/select/shadow-report.ts --prs 40 [--since 2026-11-16] [--json out.json]
```

The report uses GraphQL only, one query per 10 PRs, so it stays off the shared REST quota. It lists:

- PR runs with a plan;
- how many E2E jobs and runner-minutes selection would have skipped;
- every **miss**, with whether the same job failed on `main` within a day. "Yes" points to a flake. "No" means check the graph: each real miss becomes an edge and a golden case.

### The gate

`CI gate` needs every Local E2E job and runs even when they fail. It fails when:

- a job failed or was cancelled;
- a job the plan selected was skipped.

A skipped job the plan did not select passes. With no plan (the select job failed), every job counts as selected. In shadow mode every job runs, so the gate fails only when a suite already failed.
