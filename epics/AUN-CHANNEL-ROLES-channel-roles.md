[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Per-channel roles

| | |
|---|---|
| **ID** | `AUN-CHANNEL-ROLES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> Spec PR #462 open; "My channels with channel roles" merged (#625).

## Goal

Per-channel team roles, separate from site roles in AlUmmahNowAuth.

## Decisions and constraints

- [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership): Channel roles separate from site roles; only super admins transfer ownership (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Open [AlUmmahNow#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462); merged [AlUmmahNow#625](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/625)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Supersedes native 19.8's "uses auth RBAC"; Epic 29 calls team roles 19.6.

## Sources

- [CHANNEL-ROLES.md (PR #462)](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462)
- [Site roles and channel roles](../guides/roles.md)
- [AlUmmahNow#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462), [AlUmmahNow#625](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/625)
