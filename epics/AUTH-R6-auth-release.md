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

Checked against the code on 2026-11-23.

| Area | Where | State |
|---|---|---|
| Auth deploy | [`release.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/release.yml), [`scripts/release`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/tree/main/scripts/release) | Complete. Every merge to `main`: build once, stage (secrets check, deploy, smoke, E2E), production (secrets check, migrate, 0% with smoke, 100%, smoke, automatic rollback). A superseded commit is not promoted |
| Auth rollback | [`rollback.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/rollback.yml) | Complete |
| Auth bundle for other repos | [`local-stack-bundle.yml`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/.github/workflows/local-stack-bundle.yml) | Complete: a `local-stack-<sha>` prerelease per released commit |
| **Auth release record** | none | No tag, notes or release for a production release. What is live can only be read from the Actions run list, and a run can succeed without promoting |
| openauth package | [`publish-github.yml`](https://github.com/Al-Ummah-Now/openauth/blob/master/.github/workflows/publish-github.yml), [RELEASING.md](https://github.com/Al-Ummah-Now/openauth/blob/master/docs/RELEASING.md) | Merge to `master` publishes the next patch to GitHub Packages with a tag and a GitHub Release; pull requests get prereleases. The version lives in git tags, so the branch rule is not a problem ([openauth#27](https://github.com/Al-Ummah-Now/openauth/pull/27)). The gaps are listed below |
| Versioning policy | none | Auth's HTTP API and the package have no written rule for breaking changes |
| Performance gate | [`signin-latency.spec.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/e2e/tests/release/signin-latency.spec.ts) | Stage E2E fails if the password sign-in p95 passes its budget |
| Security | [SECURITY.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/SECURITY.md), CodeQL, Dependabot, committed-secrets check | In place ([Auth#225](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/225), [Auth#230](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/230)). No outside penetration test or legal review ([AlUmmahNow#349](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/349)) |
| Privacy | [`account-routes.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/apps/auth/src/routes/account-routes.ts) | Account deletion and JSON export are built ([Auth#233](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/233)); see [Deletion, erasure and cleanup](../guides/data-lifecycle.md) |
| Community files | [CONTRIBUTING.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CONTRIBUTING.md), issue and PR templates | Partly. There is no code of conduct in Auth (the 2026-11-21 reconciliation said there was). Issue templates link to the old `meywd` repo and a `workers.dev` demo |

### Gaps in the openauth publish workflow

1. **It can publish code whose tests failed.** It runs when `test` *or* `format` finishes successfully, so a green `format` publishes while `test` is red.
2. **It can publish a commit nobody tested.** It checks out the branch, not the commit that triggered it.
3. **A failed publish is lost.** The tag is pushed before `npm publish`, and a tagged commit counts as released, so a re-run does nothing until someone deletes the tag.
4. **It publishes when nothing changed.** 1.0.60 to 1.0.62 hold no source change at all.
5. **The version says nothing.** Every release is a patch. A manual minor or major only works on an untagged commit, which exists for a minute or two after a merge.
6. **No artifact outside GitHub Packages.** Installing the package needs a token even though the repo is public, so consumers rebuild the package to learn its hash.
7. **Two upstream workflows still run on every push:** `release.yml` keeps a "Version Packages" pull request open that must never be merged, and `docs.yml` deploys the same docs site as `docs-fork.yml`.
8. **The fork's code of conduct sends security reports to upstream's author**, not to us.

## Stories

Each is one PR. Nothing here is a user-facing feature, so none needs a feature switch.

| Story | Repo | What | Done when |
|---|---|---|---|
| **R6-0 Auth `main` green** | Auth | The admin Security page stops querying D1 once or twice per staff account; stale admin specs fixed ([Auth#490](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/490)) | Main's Test Suite and Release runs pass |
| **R6-1 Safe publish** | openauth | Publish only the triggering commit, only after both `test` and `format` passed on it, and only when the published files changed. The next version follows the commits since the last release: breaking → major, `feat` → minor, otherwise patch. Publish the packed tarball first, then tag; a re-run finishes a half-done release | The version and change rules are a tested script; a re-run after each possible failure point is covered by a test |
| **R6-2 Verifiable package** | openauth | Each GitHub Release carries the exact tarball that was published, its SHA-256 and its npm integrity, and a build-provenance attestation | `gh attestation verify` passes on a real release; the asset's integrity equals the registry's |
| **R6-3 Retire upstream's release flow** | openauth | Remove `release.yml`, `.changeset`, the duplicate `docs.yml` and upstream's `CNAME`; close the "Version Packages" pull request; fix SECURITY.md; replace the code of conduct | No workflow can publish under upstream's name; security reports go to our private reporting |
| **R6-4 Release record** | Auth | After a successful production promote, `release.yml` creates a `vYYYY.MM.DD[.N]` GitHub Release (US Eastern date) on that commit: the merged PRs since the last record, the worker versions, migrations applied, the run and the rollback steps. A superseded or failed run creates none | Every promoted commit has exactly one record; notes logic is unit tested. Marked "latest" ahead of the `local-stack-*` prereleases |
| **R6-5 Versioning policy** | Auth | `docs/API_VERSIONING.md`: what is a breaking change for the OAuth endpoints, tokens, discovery and the admin API; minimum notice; `Deprecation` and `Sunset` headers (RFC 9745, RFC 8594); who must be updated first, including installed native apps. Then a CI check that fails a PR which removes or narrows an operation in `openapi.yaml` without a deprecation entry | The policy merges now; the check follows [AUTH-R4](AUTH-R4-auth-docs-dx.md) R4-4 (the complete API spec) |
| **R6-6 Faster sign-in** | openauth, Auth | The enterprise `subject()` makes about eight D1 round trips one after another ([Auth#314](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/314)). Batch the independent writes; the code is still written last, so a code never points at a missing session | A test counts the round trips and proves the order; the timing log shows fewer on stage |
| **R6-7 Contributor docs** | Auth | Code of conduct, SUPPORT.md, issue-template links, CONTRIBUTING setup, CICD.md and `docs/release-pipeline.md` as the pipeline works today. ROADMAP.md points to this wiki | Docs check: no link to the old repo or the `workers.dev` host in these files |
| **R6-8 QA test accounts** | Auth | More than 40,000 old test accounts on QA slow its database ([Auth#312](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/312)): the daily sweep also removes test-domain accounts older than 24 hours that aren't pinned, through the deletion service, in small batches | The sweep reports counts; QA only; pinned and seed accounts are proven untouched by a test |
| **R6-9 Docker, Helm, self-hosting** | Auth | [Auth#19](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/19), [Auth#171](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/171) | Waits for AR6-D1 |
| **R6-10 Outside security test and legal review** | – | Needs people ([AlUmmahNow#349](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/349)) | Waits for AR6-D3 |

Not in this epic: the TypeScript client, the API spec, the docs sites and publishing to the public npm registry belong to [AUTH-R4](AUTH-R4-auth-docs-dx.md) (R4-2, R4-4 to R4-8, AR4-D3). Monitoring and backups belong to [AUTH-R5](AUTH-R5-auth-cicd.md).

## Data model and API

No database change and no new endpoint. R6-6 changes how existing rows are written, not what is written. R6-5 adds response headers only when a route is first deprecated.

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
- R6-8 deletes only on QA and refuses to run anywhere else.
- Independent penetration testing and legal review can't be replaced by automation; until then no page may claim either.

## Owner decisions

1. **AR6-D1: Should others be able to run our auth server themselves (Docker image, Helm chart, VPS)?**
   - A. No. Cloudflare only; close [Auth#19](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/19) and [Auth#171](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/171).
   - B. A Docker image for local development and tests only.
   - C. Full self-hosting (image, Helm chart, upgrade support).
   - **Recommended: A.** The server depends on D1, KV, Queues, Secrets Store and Workers rate limiting. Replacing them means a second, separately secured product, and nobody has asked for it. Local development and other repos' tests already run the released bundle.
2. **AR6-D2: Should Auth production keep releasing on every merge, or wait for a release tag like the other sites?**
   - A. Every merge (today).
   - B. Tag only ([Auth#217](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/217), matching [O11](decisions.md#o11-production-only-from-tags-on-main)).
   - **Recommended: A, recorded as an exception to O11.** Each merge already has to pass stage and a 0% production check, small releases are easier to roll back, and security fixes don't wait. R6-4 gives the one thing tags would add: a record of what went live and when. If you prefer B, R6-4's naming already matches.
3. **AR6-D3: When should an outside firm test sign-in security and a lawyer review privacy?**
   - A. Before the public launch.
   - B. Later, at a date you choose.
   - **Recommended: A,** one engagement covering Auth, the videos API and the admin. It needs a vendor and a contact person from you. Nothing else here waits for it.

## Constraints

- Keep unit costs low ([O1](decisions.md#o1-cost-conscious-design)).
- Keep the openauth fork ([O29](decisions.md#o29-keep-the-openauth-fork)). Auth stays a separable sign-in provider ([O14](decisions.md#o14-auth-is-a-separable-sso-provider)).
- Never Stripe ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans)).

## History

The roadmap (December 2024) listed five items and was never updated. The 2026-11-21 reconciliation marked community and support Done, and package distribution, compliance and performance In Progress. The inventory above replaces it: community is reopened because the code of conduct is missing and the links are stale.

## Sources

- [AlUmmahNowAuth/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/ROADMAP.md)
- [AlUmmahNowAuth#18](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/18), [#19](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/19), [#20](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/20)
