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
| – | Session management | Done — both audits agree: AlUmmahNowAuth#196, #232, #237, #286, #287, #386 (merged): SSO, revocation, persistent sessions and per-device sign-out; apps/auth/src/routes/admin-session-routes.ts; AlUmmahNowAuth commit 7c95b58 |
| – | Token security (JWT, rotation) | Done — both audits agree: AlUmmahNowAuth#237, #240, #244, #266, #389, #390 (merged): revocation, short lifetimes, refresh and signing-key rotation; openauth#30, #51 (merged): atomic refresh rotation and signing-key rotation; AlUmmahNowAuth commit cc4f901; openauth refresh-token |
| – | MFA (TOTP, backup codes) | Issue #__ (never filed) |
| – | Rate limiting & brute force | Done — both audits agree: AlUmmahNowAuth#264, #268 (merged): attempt limits and Workers Rate Limiting; openauth#35 (merged): atomic rate-limit counters; apps/auth/src/middleware/rate-limit.ts |
| – | Audit logging | Done — both audits agree: AlUmmahNowAuth#60, #72, #241 (merged): audit events, retry/DLQ and production consumer; apps/auth/src/audit-events.ts; apps/admin/app/routes/audit.tsx |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- 2026-11-15, AUTH-1: signing-key rotation with a published-before-use overlap, scheduled and from the admin, audited ([Auth#388](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/388), [Auth#389](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/389), [Auth#390](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/390)); verifiers refetch JWKS on an unknown `kid` ([AlUmmahNow#1394](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1394)); per-device sign-out by `sid` ([Auth#386](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/386), [AlUmmahNow#1408](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1408)); sign-in logs without PII ([Auth#385](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/385)); critical Dependabot alerts cleared and pnpm as the only lockfile ([Auth#393](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/393), [Auth#397](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/397)). See [Authentication](../guides/authentication.md#tokens).

### Reconciled 2026-11-21

- **AUTH-R1 / Session management (HLB-506): Done** — both audits agree: AlUmmahNowAuth#196, #232, #237, #286, #287, #386 (merged): SSO, revocation, persistent sessions and per-device sign-out; apps/auth/src/routes/admin-session-routes.ts; AlUmmahNowAuth commit 7c95b58
- **AUTH-R1 / Token security (JWT, rotation) (HLB-507): Done** — both audits agree: AlUmmahNowAuth#237, #240, #244, #266, #389, #390 (merged): revocation, short lifetimes, refresh and signing-key rotation; openauth#30, #51 (merged): atomic refresh rotation and signing-key rotation; AlUmmahNowAuth commit cc4f901; openauth refresh-token
- **AUTH-R1 / Rate limiting & brute force (HLB-509): Done** — both audits agree: AlUmmahNowAuth#264, #268 (merged): attempt limits and Workers Rate Limiting; openauth#35 (merged): atomic rate-limit counters; apps/auth/src/middleware/rate-limit.ts
- **AUTH-R1 / Audit logging (HLB-510): Done** — both audits agree: AlUmmahNowAuth#60, #72, #241 (merged): audit events, retry/DLQ and production consumer; apps/auth/src/audit-events.ts; apps/admin/app/routes/audit.tsx
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
