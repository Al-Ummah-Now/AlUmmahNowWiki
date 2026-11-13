[← Home](../README.md)

# Testing and E2E

How end-to-end tests run across the videos monorepo, and the rules every spec follows. Read from [AlUmmahNow](../repos/AlUmmahNow.md) `main` on 2026-11-12. The source of truth is [`docs/testing/LOCAL-STACK.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/testing/LOCAL-STACK.md) and the "Where E2E tests run" and "Release regressions" sections of the monorepo's [CLAUDE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CLAUDE.md#where-e2e-tests-run).

## The short version

- **Most E2E specs run on a local stack** that each CI job boots for itself. They never touch QA, so jobs run in parallel and shard.
- **Only specs that need a real deployment stay "deployed"**: real Bunny encodes, R2 media delivery, real domains and cookies. They run on QA for pull requests and on stage in releases.
- **Every spec makes its own data and deletes it**, even when it fails. A leftover check fails the job if anything is left.
- **A red run must mean a real bug.** Flaky tests are defects: fix them or quarantine them with an issue and an owner.

## Where each suite runs

| Check | Workflow | Runs | Target | Gates |
|---|---|---|---|---|
| **Local E2E** | [`local-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/local-e2e.yml) | Every PR, every push to `main`, nightly, every release | Local stack (`E2E_ENV=local`) | PRs and releases |
| **Stage E2E** | `release.yml` → [`release-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/release-e2e.yml) | Every release; by hand on QA or stage | Stage, deployed specs only | Production |
| **Legacy E2E suite** | [`e2e-tests.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/e2e-tests.yml) | Once after each release tag's Release run (`workflow_run`), and by hand | QA, web specs not yet moved to the local stack | Nothing; a run of its own, so it never turns the release red ([#1054](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1054), [#1190](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1190)) |
| **Flake hunt** | [`release-e2e-nightly.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/release-e2e-nightly.yml) | By hand only | QA, release suite 3× with no retries | Nothing; keeps one `e2e-flaky-nightly` issue |
| **Admin E2E (QA)** | [`admin-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/admin-e2e.yml) | By hand only | QA | Nothing; the admin suite's gate is now Local E2E |
| **Player E2E** | [`player-e2e.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/player-e2e.yml) | PRs that touch the player | Local `next dev` with a harness page and HLS fixtures | Those PRs |
| **Theme visibility** | [`theme-visibility.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/theme-visibility.yml) | PRs that touch web or themes | Local `next dev`, mocked API, every theme × light/dark × en/ar | Those PRs |

**Tests run against the deployed QA only on numbered releases** (owner, 2026-11-13; QA's D1 read volume ran to billions of rows a day). Nothing tests QA on a pull request, a push to `main` or a schedule: pull requests rely on Local E2E, and the release suite runs on stage as the release gate (not on QA too: stage runs the same specs on the same code). QA is still deployed on every push to `main` ([#1190](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1190)).

The legacy QA suite runs once after each release tag, only for the web specs still placed on QA, and gates nothing. The owner's rule is that no spec may stop running: a spec leaves that run only by moving to the local stack's list (`e2e/test-utils/local-web-specs.ts`).

The `skip-qa-e2e` label ([#928](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/928)) no longer does anything: no suite runs against QA on a pull request ([#1190](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1190)).

## The local stack

One Miniflare instance runs every worker of the monorepo, so queues, Durable Objects, D1, R2, KV and the Secrets Store behave as in a deployed environment ([#962](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/962)).

- **Workers:** web and admin-web (their OpenNext builds), api-videos, websocket-server, processor and admin-api, each on its own localhost port.
- **Real sign-in.** The Auth repo's issuer, profile app and admin dashboard run from the Auth repo's **released bundle**. Every released Auth commit publishes a `local-stack.tar.gz` on a `local-stack-<sha>` prerelease ([Auth#323](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/323), [Auth#324](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/324)). The monorepo downloads it, checks its sha256 and unpacks it; nothing of that repo is checked out ([#1001](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1001)). The CMS and www are taken at their newest released `v*` tag.
- **Nothing leaves the machine.** Every outbound request from a worker goes through an outbound router. Local hosts pass through, faked third parties get the fake, and everything else (QA, production, paid AI) is refused with 502 and logged. AI steps are off.
- **Fakes:** Bunny Stream (videos and TUS uploads, with a configurable encode delay), the Bunny CDN, Bunny Storage and the image host, and Resend (emails are kept, never sent).
- **Browser proxy.** Playwright runs through a local proxy that terminates HTTPS to faked hosts with a throwaway certificate. Pages keep their real CDN URLs, and a local run can never load QA or production.
- **Control API** (loopback only): inspect fake Bunny videos and kept emails, run SQL on a stack D1 database, read and write stack R2 objects, run a worker's scheduled handler now, and list leftovers for a run.
- **Translations:** the stack seeds its translation store ([#1002](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1002)).

Boot it locally with the commands in [LOCAL-STACK.md, "Run it"](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/testing/LOCAL-STACK.md#run-it). One stack and one Playwright run at a time on a machine.

### Placement

Every spec is listed in `apps/web/e2e/test-utils/placement.ts` as `local` or `deployed`, with a reason for each deployed one. A unit test fails on a spec that is missing or listed twice ([#958](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/958)). With `E2E_ENV=local` the release config runs only the local specs; against QA or stage it runs only the deployed ones. The placement table is generated by `scripts/e2e/placement-doc.ts` and printed in the Local E2E build job's summary.

### Local E2E jobs

`local-e2e.yml` has one build job and several suite jobs. Each suite job boots its own stack through the `local-stack-up` action (fetch the Auth bundle, boot, smoke, seed translations, seed data), runs its specs, deletes its run accounts and runs the leftover check.

- **Release suite:** sharded by browser project (auth flows in three shards, player, Chrome, Firefox, WebKit).
- **Admin suite:** chromium in two shards, WebKit, mobile and shared state ([#987](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/987), [#1053](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1053)). Its leftover check gates the job; only token revocations may remain ([#1078](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1078)).
- **Web suite:** the legacy web specs moved so far, in five shards ([#985](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/985)). A shard that ran no tests fails. Every shard writes its failed, flaky and skipped tests (with the skip reason) to the job summary, and uploads `outcomes.tsv` with every test's status, so a green shard still shows what was skipped ([#1089](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1089)).

## Rules for every spec

### Own data

A spec creates everything it reads or changes through the builders in [`apps/web/e2e/release/builders.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/apps/web/e2e/release/builders.ts): users, creator tiers, channels, videos, playlists, posts and comments ([#981](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/981)). Names carry the run namespace. A spec never reads seed or demo data, "the newest public video" or `limit=1` of a shared list. `scripts/qa/__tests__/own-data.test.ts` fails on seed titles, demo data or hard-coded ids.

### Cleanup and leftover checks

- Builders register teardown as they create. Teardown always runs, even on failure, and treats a 404 as already gone ([#998](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/998)).
- A builder user is torn down last. A run account on QA or stage only has its auth account deleted: the api-videos run-user sweep erases its profile and anything left within 10 minutes, and the deployed leftover check reports that as "erase pending". On the local stack (no crons) and for non-run accounts, the builder runs the privacy erase first ([#1140](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1140)).
- Run cleanup purges trashed videos together with their Bunny video ([#986](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/986)).
- **Local:** `scripts/local-stack/leftovers.ts --marker <run id>` lists every D1 row, R2 object, KV entry and fake Bunny video or image that still holds the run id or a run user's id ([#993](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/993)). It gates the admin suite and is report-only for batches that don't yet clean up fully.
- **Deployed:** the release suite's leftover step also covers QA's Bunny library and R2 ([#1004](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1004)), and counts only rows of run accounts that still exist ([#1074](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1074)).

### Per-run accounts

Every E2E job registers its own accounts, `e2e+<run>-<attempt>-<name>@e2e.alummahnow.net`, so runs never share users and need no queue ([#732](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/732)). Registration marks them as run accounts on the auth server (QA and stage only). An `always()` step erases their content and deletes them through the auth server's QA/stage-only test route. `scripts/e2e/teardown-run-users.ts` deletes 4 accounts at a time, with a 30-second timeout per request. The deployed workflows size the step's timeout to the job's account count with `--step-minutes`: 15 seconds per account per lane, plus 2 minutes, and at least 5 ([#1140](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1140)). The few specs that change global state (site theme, shared translations, the shared error group) run in a `shared-state` project under a lock held as a compare-and-swap git ref.

### Waits, retries and quarantine

- **No sleeps for readiness.** Wait for the thing itself: settled sign-in, hydrated controls, the menu actually open ([#801](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/801)).
- **Retries stay at one.** A test that needed its retry is reported as flaky in the job summary.
- **Quarantine format.** A spec still red gets `test.fixme(..., 'quarantined: #<issue> @<owner> ...')`, one issue per cause. `scripts/ci/check-quarantine.ts` enforces the format. Fix it in a small follow-up and lift the `fixme`.

### Encodes and load

- **Encode-waiting specs** (Bunny must encode an upload, or R2 must transcode it) share the QA/stage test library's encode queue. CI runs them in their own step (`E2E_ENCODE=only`) under a 2-slot cross-run lock ([#842](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/842)). New ones go in `ENCODE_SPECS` in `playwright.release.config.ts`.
- **Slow third-party encodes skip, they don't fail** ([#952](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/952)). Wrong behaviour after the encode finished still fails.
- **Upload budget.** After each deployed run, `scripts/release/upload-budget.ts` counts the run's uploads from the API's own counters and warns above 30. It never fails the job.
- **Parallel encode part and Bunny upload cap** ([#1061](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1061), merged 2026-11-13). The deployed release suite runs as two parallel parts. **main** runs the specs that don't wait for an encode, then shared-state, then the non-blocking `@load` report. **encode** runs the encode-waiting specs under the 2-slot lock, with its own run accounts, leftover check and upload budget. Its check is named `Release regressions (<env>) - encode`, and `stage-e2e` waits for both. The encode part uploads three shared run clips that specs reuse (`E2E_SHARED_RUN_VIDEOS=1`). That makes about **8 real Bunny uploads per release**, and a "Bunny upload cap" step fails the part above 10.
- **Load and timing specs** carry the `@load` tag. Every gating run leaves them out; they run in a non-blocking step by hand and in releases, never on PRs.

## Cleanup jobs for shared environments

The specs clean up after themselves. These jobs catch what a crashed or cancelled run left behind.

| Job | Schedule | Does |
|---|---|---|
| [`e2e-run-users-sweep.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/e2e-run-users-sweep.yml) | Hourly | Deletes QA run accounts older than 24 hours. Keeps listing while a page comes back full, so the backlog drains ([#1087](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1087)) |
| api-videos run-user sweep | Queue | Erases the videos-side data of run accounts the auth server has deleted, through the indexes and on its own queue ([#899](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/899), [#1066](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1066)) |
| [`qa-cleanup.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/qa-cleanup.yml) | Daily | Sweeps E2E leftovers on QA. Keeps seed fixtures and anything younger than 2 hours |
| [`bunny-qa-status.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/bunny-qa-status.yml) | Hourly | Test-library census and sweep for QA and stage; guards against the library growing past 500 videos ([#951](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/951), [#1063](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1063), [#1069](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1069)) |
| [`bunny-orphan-collections.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/bunny-orphan-collections.yml) | By hand | Finds Bunny collections no channel or profile refers to. Test library: dry run, then apply deletes only collections that were orphans then and still are. Production: count only ([#1092](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1092)) |
| [`prod-test-data.yml`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/.github/workflows/prod-test-data.yml) | Daily, and after every production test run | Fails when production holds anything a test account created, deletes it, and still fails so every leak is seen |

Only throwaway test accounts may touch production, and only the release's signed-in check uses them. They are deleted from every store when the run ends, pass or fail.

## Other repos

- **[AlUmmahNowAuth](../repos/AlUmmahNowAuth.md):** E2E on QA from PRs and on stage in its release, with per-run accounts for session-ending specs.
- **[AlUmmahNowUI](../repos/AlUmmahNowUI.md) and [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md):** Playwright against QA, with dedicated accounts for session-ending specs, and a smoke in each release.
- All repos cache Playwright browsers and retry their install. Playwright is pinned to 1.64.1 where Firefox 1.65 crashed ([CMS#35](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/35)).

## Tests and paid AI

Tests, CI and stage never call paid AI providers. The local stack refuses every unknown outbound host, and the processor's AI steps are off there.
