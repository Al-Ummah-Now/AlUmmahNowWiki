[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: Release & distribution

| | |
|---|---|
| **ID** | `AUTH-R6` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [openauth](../repos/openauth.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-23 |

## Goal

Every release of the auth server and of the openauth fork is tested, traceable and repeatable: anyone can see what is live, what changed, which bytes were published, and how to go back. Contributors find current instructions and the right place to report a problem.

The epic covers the five roadmap items under release and distribution: package distribution, version management, security and compliance, performance, community and support.

## What exists today

As of 2026-11-23, with the stories below that have merged.

| Area | Where | State |
|---|---|---|
| Auth deploy | [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/release.yml), [`scripts/release`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/scripts/release) | Complete. Every merge to `main`: build once, stage (secrets check, deploy, smoke, E2E), production (secrets check, migrate, 0% with smoke, 100%, smoke, automatic rollback). A superseded commit is not promoted |
| Auth rollback | [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/rollback.yml) | Complete |
| Auth bundle for other repos | [`local-stack-bundle.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/local-stack-bundle.yml) | Complete: a `local-stack-<sha>` prerelease per released commit |
| **Auth release record** | [`record.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/scripts/release/record.ts) | Built (R6-4): a `vYYYY.MM.DD[.N]` GitHub release per promoted commit. Before, what was live could only be read from the Actions run list, and a run can succeed without promoting |
| openauth package | [`publish-github.yml`](https://github.com/Al-Ummah-Now/openauth/blob/master/.github/workflows/publish-github.yml), [`plan.mjs`](https://github.com/Al-Ummah-Now/openauth/blob/master/scripts/release/plan.mjs), [RELEASING.md](https://github.com/Al-Ummah-Now/openauth/blob/master/docs/RELEASING.md) | A merge to `master` publishes to GitHub Packages with a tag and a GitHub Release, once both checks pass on that commit and only if a published file changed. The commits set the size of the version. The version lives in git tags, so the branch rule is not a problem ([openauth#27](https://github.com/Al-Ummah-Now/openauth/pull/27), [openauth#59](https://github.com/Al-Ummah-Now/openauth/pull/59)) |
| Versioning policy | [`API_VERSIONING.md`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/API_VERSIONING.md), [`api-compat.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/scripts/release/api-compat.ts) | Written ([Auth#495](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/495)) and checked in CI: `pnpm check:api` compares [`openapi.json`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/openapi.json) with the newest release record ([Auth#511](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/511)) |
| Performance gate | [`signin-latency.spec.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/e2e/tests/release/signin-latency.spec.ts) | Stage E2E fails if the password sign-in p95 passes its budget |
| Security | [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SECURITY.md), CodeQL, Dependabot, committed-secrets check | In place ([Auth#225](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/225), [Auth#230](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/230)). No outside penetration test or legal review ([AlUmmahNow#349](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/349)) |
| Privacy | [`account-routes.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/apps/auth/src/routes/account-routes.ts) | Account deletion and JSON export are built ([Auth#233](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/233)); see [Deletion, erasure and cleanup](../guides/data-lifecycle.md) |
| Community files | [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CONTRIBUTING.md), [CODE_OF_CONDUCT.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CODE_OF_CONDUCT.md), [SUPPORT.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SUPPORT.md), issue and PR templates | Current, and a test checks their links ([Auth#494](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/494)). Security problems go to private reporting; the public template is gone |

### Gaps the epic found in the openauth publish workflow

All eight are closed, and v1.1.0 shipped through the new workflow.

| Gap before | Closed by |
|---|---|
| A green `format` could publish while `test` was red | [openauth#59](https://github.com/Al-Ummah-Now/openauth/pull/59) |
| It checked out the branch, so it could publish a commit nobody tested | [openauth#59](https://github.com/Al-Ummah-Now/openauth/pull/59) |
| A failed publish was lost: its tag made the commit count as released | [openauth#59](https://github.com/Al-Ummah-Now/openauth/pull/59) |
| It published when nothing changed (1.0.60 to 1.0.62 hold no source change) | [openauth#59](https://github.com/Al-Ummah-Now/openauth/pull/59) |
| Every release was a patch | [openauth#59](https://github.com/Al-Ummah-Now/openauth/pull/59) |
| No artifact outside GitHub Packages, which asks for a token even for a public package | [openauth#62](https://github.com/Al-Ummah-Now/openauth/pull/62) |
| Two upstream workflows still ran: a "Version Packages" pull request that must never be merged, and a second docs deploy | [openauth#61](https://github.com/Al-Ummah-Now/openauth/pull/61) |
| The code of conduct sent security reports to upstream's author | [openauth#61](https://github.com/Al-Ummah-Now/openauth/pull/61) |

## Stories

Each is one PR. Nothing here is a user-facing feature, so none needs a feature switch.

| Story | Repo | What | Done when | Status (2026-11-23) |
|---|---|---|---|---|
| **R6-0 Auth `main` green** | Auth | The admin Security page stops querying D1 once or twice per staff account; stale admin specs fixed ([Auth#490](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/490)) | Main's Test Suite and Release runs pass | **Shipped** ([Auth#490](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/490), [Auth#496](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/496)) |
| **R6-1 Safe publish** | openauth | Publish only the triggering commit, only after both `test` and `format` passed on it, and only when the published files changed. The next version follows the commits since the last release: breaking → major, `feat` → minor, otherwise patch. Publish the packed tarball first, then tag; a re-run finishes a half-done release | The version and change rules are a tested script; a re-run after each possible failure point is covered by a test | **Shipped** ([openauth#59](https://github.com/Al-Ummah-Now/openauth/pull/59)) |
| **R6-2 Verifiable package** | openauth | Each GitHub Release carries the exact tarball that was published, its SHA-256 and its npm integrity, and a build-provenance attestation | `gh attestation verify` passes on a real release; the asset's integrity equals the registry's | **Shipped** ([openauth#62](https://github.com/Al-Ummah-Now/openauth/pull/62)). Proven on [v1.1.0](https://github.com/Al-Ummah-Now/openauth/releases/tag/v1.1.0): its attestation names `master` at the tagged commit, the file matches its checksum and npm integrity, and a tampered file is refused |
| **R6-3 Retire upstream's release flow** | openauth | Remove `release.yml`, `.changeset`, the duplicate `docs.yml` and upstream's `CNAME`; close the "Version Packages" pull request; fix SECURITY.md; replace the code of conduct | No workflow can publish under upstream's name; security reports go to our private reporting | **Shipped** ([openauth#61](https://github.com/Al-Ummah-Now/openauth/pull/61)) |
| **R6-4 Release record** | Auth | After a successful production promote, `release.yml` creates a `vYYYY.MM.DD[.N]` GitHub Release (US Eastern date) on that commit: the merged PRs since the last record, the worker versions, migrations applied, the run and the rollback steps. A superseded or failed run creates none | Every promoted commit has exactly one record; notes logic is unit tested. Marked "latest" ahead of the `local-stack-*` prereleases | **Shipped** ([Auth#491](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/491)); first record v2026.11.23 |
| **R6-5 Versioning policy** | Auth | `docs/API_VERSIONING.md`: what is a breaking change for the OAuth endpoints, tokens, discovery and the admin API; minimum notice; `Deprecation` and `Sunset` headers (RFC 9745, RFC 8594); who must be updated first, including installed native apps. A CI check compares `openapi.json` with the newest release record and fails a PR that removes or narrows something without a deprecation. `docs/api-exceptions.json` allows one exact change: a security fix, or a correction of a spec that was wrong | Both merged. The check fails on a removed or narrowed route, parameter, field, answer or right that the last release promised; on a deprecation at any depth without its notice; and on any schema word it does not know | **Shipped** ([Auth#495](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/495), [Auth#511](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/511)) |
| **R6-6 Faster sign-in** | openauth, Auth | The enterprise `subject()` makes about eight D1 round trips one after another ([Auth#314](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/314)). Batch the independent writes; the code is still written last, so a code never points at a missing session | A test counts the round trips and proves the order; the timing log shows fewer on stage | **Shipped** ([Auth#493](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/493)). The statements were in Auth's own session adapter, so the fork did not change |
| **R6-7 Contributor docs** | Auth | Code of conduct, SUPPORT.md, issue-template links, CONTRIBUTING setup, CICD.md and `docs/release-pipeline.md` as the pipeline works today. ROADMAP.md points to this wiki | Docs check: no link to the old repo or the `workers.dev` host in these files | **Merged** ([Auth#494](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/494)) |
| **R6-8 QA test accounts** | Auth | More than 40,000 old test accounts on QA slow its database ([Auth#312](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/312)): the daily sweep also removes test-domain accounts older than 24 hours that aren't pinned, through the deletion service, in small batches | The sweep reports counts; QA only; pinned and seed accounts are proven untouched by a test | Dry run, sweep query and cleanup **merged** ([Auth#497](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/497), [Auth#504](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/504), [Auth#512](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/512)). The leak is closed: the admin specs' users are run accounts that the run deletes ([Auth#505](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/505)). The cleanup is running on QA, approved by the owner after a dry run |

Not in this epic: the TypeScript client, the API spec, the docs sites and publishing to the public npm registry belong to [AUTH-R4](AUTH-R4-auth-docs-dx.md) (R4-2, R4-4 to R4-8, AR4-D3). Monitoring and backups belong to [AUTH-R5](AUTH-R5-auth-cicd.md).

## Data model and API

No database change. Two new test routes on QA only (R6-8): `GET /test/run-users/census` reads and returns counts; `POST /test/run-users/disposable` is the cleanup, behind a check of the database's own name. QA's database has a one-row `database_identity` table that no other database has. R6-6 changes how existing rows are written, not what is written. R6-5 adds response headers only when a route is first deprecated.

## Platforms

| Platform | Needs |
|---|---|
| Web, admin | Nothing. R6-0 makes the Auth admin's Security page load |
| Apple, Android, Desktop | Nothing to build. The versioning policy counts installed versions: an endpoint they call can't be removed until those versions are gone |
| Other repos' CI | Can download the package tarball from the GitHub Release without a token (R6-2) |

## Feature switch and tiers

None: no user-facing feature.

## Tests

- openauth: `bun test` for the release script (version, change detection, resume) on a scratch git repo. No network.
- Auth: unit tests for the release notes and the naming; workflow tests extend [`release-workflow.test.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/scripts/release/__tests__/release-workflow.test.ts).
- R6-6: tests count statements and check the order, next to the existing issuer tests; sign-in latency stays gated on stage.
- Nothing runs against deployed QA on a pull request.

## Costs

Nothing per video or per view. GitHub Actions, attestations and release assets are free for public repos. A package tarball is under 1 MB per release. R6-0, R6-6 and R6-8 lower D1 use.

## Security and legal

- The publish job is the only place with `packages: write`. Fork pull requests never reach it. Values from events go through `env`, never into a script.
- A release is tied to a commit by tag, hash and signed provenance. A tag is never moved and a version never published twice.
- Release notes use PR titles and authors, which are already public. They hold no secret, no client id and no email address.
- R6-8 deletes only on QA. The server checks the environment, the issuer, the host, a flag and the database's own name; stage and production have none of the last two.
- Independent penetration testing and legal review can't be replaced by automation; until then no page may claim either.

## Decisions

Decided 2026-11-23.

1. **AR6-D1: Should others be able to run our auth server themselves (Docker image, Helm chart, VPS)? No, Cloudflare only.** The server depends on D1, KV, Queues, Secrets Store and Workers rate limiting. Replacing them means a second, separately secured product. Local development and other repos' tests already run the released bundle. [Auth#19](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/19) and [Auth#171](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/171) are closed as not planned. Not chosen: a Docker image for local use, full self-hosting.
2. **AR6-D2: Should Auth production keep releasing on every merge? Yes,** an exception to [O11](decisions.md#o11-production-only-from-tags-on-main). Each merge already has to pass stage and a 0% production check, small releases are easier to roll back, and security fixes don't wait. R6-4 records what went live and when. Not chosen: release on a tag ([Auth#217](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/217), closed as not planned).

Outside the code: an independent penetration test and a legal privacy review are tracked in [AlUmmahNow#349](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/349). They are not part of this epic's build.

## Constraints

- Keep unit costs low ([O1](decisions.md#o1-cost-conscious-design)).
- Keep the openauth fork ([O29](decisions.md#o29-keep-the-openauth-fork)). Auth stays a separable sign-in provider ([O14](decisions.md#o14-auth-is-a-separable-sso-provider)).
- Never Stripe ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans)).

## History

The roadmap (December 2024) listed five items and was never updated. The 2026-11-21 reconciliation marked community and support Done, and package distribution, compliance and performance In Progress. The inventory above replaces it. Community was reopened, because the code of conduct was missing and the links were stale, and closed again by R6-7.

## Sources

- [AlUmmahNowAuth/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/ROADMAP.md)
- [AlUmmahNowAuth#18](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/18), [#19](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/19), [#20](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/20)
