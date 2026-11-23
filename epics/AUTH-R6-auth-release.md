[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: Release & distribution

| | |
|---|---|
| **ID** | `AUTH-R6` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **planned** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |

> Not started as such. The roadmap (Dec 2024, links to the old `meywd/AlUmmahNowAuth`) still says **0/5 issues** for every epic and was never updated. Later work (Lanes, the openauth fork, JWT/RBAC docs, Epic 9) built much of it.

## Goal

Auth roadmap epic `category/release` (P2, v1.0.0).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | npm/Docker/Helm | In Progress — both audits agree: openauth#27, #42 (merged): tag-based package releases; AlUmmahNowAuth issues #19 and #20 (open): Docker/Helm and semantic-release follow-ups; @al-ummah-now/openauth (npm) |
| – | API versioning | Issue #__ (never filed) |
| – | Audit, pen test, GDPR | In Progress — both audits agree: AlUmmahNowAuth#225 and #230 (merged): security hardening; AlUmmahNowAuth issue #297 (closed): Dependabot triage; AlUmmahNowAuth#233 (merged): GDPR deletion/export; AlUmmahNow issue #349 (open): independent compliance sign-offs including penetration testing; apps/auth/src/routes/account-routes.ts; AlUmmahNow#349 |
| – | Performance | In Progress — both cross-checks agree: #315/#321/#333/#353 optimize real paths while #311/#314 leave database scaling work open.; Auth#315/#321/#333/#353 merged with #311/#314 open — underway, not complete. |
| – | Community & support | Done — both cross-checks agree: CONTRIBUTING.md, CODE_OF_CONDUCT.md and .github issue/PR templates exist and #21 is closed, meeting the community-docs acceptance.; Auth#21 closed with CONTRIBUTING/CoC/PR templates (#4, #27) merged — thin but the tracking item is done. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

### Reconciled 2026-11-21

- **AUTH-R6 / npm/Docker/Helm (AUN-141): In Progress** — both audits agree: openauth#27, #42 (merged): tag-based package releases; AlUmmahNowAuth issues #19 and #20 (open): Docker/Helm and semantic-release follow-ups; @al-ummah-now/openauth (npm)
- **AUTH-R6 / Audit, pen test, GDPR (AUN-143): In Progress** — both audits agree: AlUmmahNowAuth#225 and #230 (merged): security hardening; AlUmmahNowAuth issue #297 (closed): Dependabot triage; AlUmmahNowAuth#233 (merged): GDPR deletion/export; AlUmmahNow issue #349 (open): independent compliance sign-offs including penetration testing; apps/auth/src/routes/account-routes.ts; AlUmmahNow#349
- **AUTH-R6 (AUN-140): In Progress** — both cross-checks agree: npm releases and performance/security work have shipped, but Docker/Helm and independent compliance sign-offs remain open, so AUTH-R6 is underway.; Mixed finals: community/support Done, npm+audit+performance In Progress.
- **AUTH-R6 / Performance (AUN-144): In Progress** — both cross-checks agree: #315/#321/#333/#353 optimize real paths while #311/#314 leave database scaling work open.; Auth#315/#321/#333/#353 merged with #311/#314 open — underway, not complete.
- **AUTH-R6 / Community & support (AUN-145): Done** — both cross-checks agree: CONTRIBUTING.md, CODE_OF_CONDUCT.md and .github issue/PR templates exist and #21 is closed, meeting the community-docs acceptance.; Auth#21 closed with CONTRIBUTING/CoC/PR templates (#4, #27) merged — thin but the tracking item is done.
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
