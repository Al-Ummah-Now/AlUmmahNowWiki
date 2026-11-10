[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# OpenAuth enterprise admin APIs

| | |
|---|---|
| **ID** | `OA-ADMIN-APIS` |
| **Owning repos** | [openauth](../repos/openauth.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **in progress** |
| **Last updated** | 2025-12-14 |

> Code for M2M, users, clients, dynamic providers and middleware exists in `packages/openauth/src` with tests, but every task checklist is unticked.

## Goal

Tenant-scoped M2M, user, RBAC, identity-provider, client and scope admin REST APIs.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Phase 1 | M2M authentication |  |
| Phase 2 | User management |  |
| Phase 3 | RBAC REST APIs |  |
| Phase 4 | Dynamic identity providers |  |
| Phase 5 | Scope authorization / client management | See conflict |
| Phase 6 | Security & audit / scope authorization | See conflict |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Phases 5 and 6 differ: IMPLEMENTATION_PLAN says 5 = scope auth, 6 = security & audit; `tasks/README` says 5 = client management, 6 = scope authorization. Totals ~15 vs 17 days.

## Sources

- [openauth/docs/enterprise-admin-apis/IMPLEMENTATION_PLAN.md](https://github.com/Al-Ummah-Now/openauth/blob/8529f59fe365137438a6a47147ad1748d2a762b2/docs/enterprise-admin-apis/IMPLEMENTATION_PLAN.md)
