[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: CI/CD & infrastructure

| | |
|---|---|
| **ID** | `AUTH-R5` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> Stage-then-promote release pipeline shipped (Auth #188 and #184–#187 phases). The roadmap (Dec 2024, links to the old `meywd/AlUmmahNowAuth`) still says **0/5 issues** for every epic and was never updated. Later work (Lanes, the openauth fork, JWT/RBAC docs, Epic 9) built much of it.

## Goal

Auth roadmap epic `category/infra` (P1, Beta).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Monitoring | In Progress — split one step: partially built, acceptance not fully met: Kimi: ROADMAP.md:75 requires metrics and alerting as well as health checks; main has deep health/error reporting but no production metrics/alerting stack.; GLM: Auth#175 (/health, request IDs), #344/#439 (errors reach the admin Errors page with origin) plus deep-health and the status app. |
| – | Release automation | In Progress — split one step: partially built, acceptance not fully met: Kimi: ROADMAP.md:76 requires semantic versioning and changelog generation; release.yml automates stage/promote/rollback but no changelog generation.; GLM: Auth release.yml + rollback.yml exist; #189/#194/#202/#208 shipped stage -> E2E -> promote -> smoke -> auto-rollback. |
| – | Testing infra | Done — both audits agree: AlUmmahNowAuth#73, #193, #303, #309 (merged): Playwright, code sink, locked test routes and per-run accounts; apps/auth/src/__tests__/ |
| – | Deployment optimisation | Done — both cross-checks agree: Auth runs at the Cloudflare edge and #213/#256/#321/#333 add logging and discovery/JWKS caching plus deployment optimization.; Auth#306 (serialized deploys), #323 (local-stack bundle per release) and #321 (Cloudflare usage cuts) merged. |
| – | Backup & DR | Issue #__ (never filed) |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

### Reconciled 2026-11-21

- **AUTH-R5 / Testing infra (AUN-137): Done** — both audits agree: AlUmmahNowAuth#73, #193, #303, #309 (merged): Playwright, code sink, locked test routes and per-run accounts; apps/auth/src/__tests__/
- **AUTH-R5 / Monitoring (AUN-135): In Progress** — split one step: partially built, acceptance not fully met: Kimi: ROADMAP.md:75 requires metrics and alerting as well as health checks; main has deep health/error reporting but no production metrics/alerting stack.; GLM: Auth#175 (/health, request IDs), #344/#439 (errors reach the admin Errors page with origin) plus deep-health and the status app.
- **AUTH-R5 / Release automation (AUN-136): In Progress** — split one step: partially built, acceptance not fully met: Kimi: ROADMAP.md:76 requires semantic versioning and changelog generation; release.yml automates stage/promote/rollback but no changelog generation.; GLM: Auth release.yml + rollback.yml exist; #189/#194/#202/#208 shipped stage -> E2E -> promote -> smoke -> auto-rollback.
- **AUTH-R5 / Deployment optimisation (AUN-138): Done** — both cross-checks agree: Auth runs at the Cloudflare edge and #213/#256/#321/#333 add logging and discovery/JWKS caching plus deployment optimization.; Auth#306 (serialized deploys), #323 (local-stack bundle per release) and #321 (Cloudflare usage cuts) merged.
## Open questions

- None recorded in the sources.

## Conflicts between sources

- Roadmap status "0/5" disagrees with later implementation docs; status here comes from those docs.
- README says "Phase 1 Complete, Phase 2 In Progress"; `.github/copilot-instructions.md` has a different Phase 1–4 list with the same numbers.

## Sources

- [AlUmmahNowAuth/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/ROADMAP.md)
- [AlUmmahNowAuth/.github/ISSUE_TEMPLATE/roadmap_epic.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/.github/ISSUE_TEMPLATE/roadmap_epic.md)
- [AlUmmahNowAuth#22](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/22)
- [AlUmmahNowAuth#8](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/8) (closed roadmap issue)
