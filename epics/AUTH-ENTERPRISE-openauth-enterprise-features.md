[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# OpenAuth fork: enterprise features

| | |
|---|---|
| **ID** | `AUTH-ENTERPRISE` |
| **Owning repos** | [openauth](../repos/openauth.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **shipped** |
| **Last updated** | 2025-11-30 |

> openauth `IMPLEMENTATION_REPORT.md`: "✅ Complete" (client credentials, introspection, revocation, audit, client auth, CORS); openauth#1 merged 2025-11-30. Apps use `@al-ummah-now/openauth` 1.0.x.

## Goal

Fork OpenAuth to add confidential clients, RFC 7662 introspection, RFC 7009 revocation, audit logging and CORS.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Phase 1 | Fork setup | Done |
| Phase 2 | ~~D1 storage adapter~~ client credentials & audit | D1 adapter cancelled (concurrency) |
| Phase 3 | Client authentication |  |
| Phase 4 | RFC endpoints |  |
| Phase 5 | Audit logging |  |
| Phase 6 | Integration & testing |  |

## Decisions and constraints

- [O29](decisions.md#o29-keep-the-openauth-fork): Keep the openauth fork (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- openauth [openauth#1](https://github.com/Al-Ummah-Now/openauth/pull/1), [openauth#13](https://github.com/Al-Ummah-Now/openauth/pull/13)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Both plan headers still say "Status: PLANNING".
- Auth's copy keeps the D1 storage adapter as Phase 2; openauth's copy cancels it and cuts the estimate to 12–19 h.

## Sources

- [openauth/docs/ENTERPRISE_FEATURES_PLAN.md](https://github.com/Al-Ummah-Now/openauth/blob/8529f59fe365137438a6a47147ad1748d2a762b2/docs/ENTERPRISE_FEATURES_PLAN.md)
- [AlUmmahNowAuth/docs/OPENAUTH_FORK_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/docs/OPENAUTH_FORK_PLAN.md)
