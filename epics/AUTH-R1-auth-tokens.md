[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: Authentication & token management

| | |
|---|---|
| **ID** | `AUTH-R1` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **shipped** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |

> JWT phases 0–4 complete, refresh rotation, sessions and audit logging exist; MFA not built. The roadmap (Dec 2024, links to the old `meywd/AlUmmahNowAuth`) still says **0/5 issues** for every epic and was never updated. Later work (Lanes, the openauth fork, JWT/RBAC docs, Epic 9) built much of it.

## Goal

Auth roadmap epic `category/tokens` (P0, Alpha v0.8.0).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Session management | Issue #__ (never filed) |
| – | Token security (JWT, rotation) | Issue #__ (never filed) |
| – | MFA (TOTP, backup codes) | Issue #__ (never filed) |
| – | Rate limiting & brute force | Issue #__ (never filed) |
| – | Audit logging | Issue #__ (never filed) |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- 2026-11-15, AUTH-1: signing-key rotation with a published-before-use overlap, scheduled and from the admin, audited ([Auth#388](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/388), [Auth#389](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/389), [Auth#390](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/390)); verifiers refetch JWKS on an unknown `kid` ([AlUmmahNow#1394](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1394)); per-device sign-out by `sid` ([Auth#386](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/386), [AlUmmahNow#1408](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1408)); sign-in logs without PII ([Auth#385](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/385)); critical Dependabot alerts cleared and pnpm as the only lockfile ([Auth#393](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/393), [Auth#397](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/397)). See [Authentication](../guides/authentication.md#tokens).

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
