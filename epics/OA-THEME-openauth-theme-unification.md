[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# OpenAuth theme unification for the multi-tenant issuer

| | |
|---|---|
| **ID** | `OA-THEME` |
| **Owning repos** | [openauth](../repos/openauth.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> Plan phases are all unticked, but per-request theme and language rendering shipped (openauth#10–#12, #21) and the owner's English-default rule is tested (#37). On the Auth side, Auth now keeps its own theme packages and the auth admin picks the sign-in theme (Auth #279, #282).

## Goal

Theme every request by tenant branding → config → DB default tenant → env, without a global that bleeds between requests.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Phase 1 | Backwards-compatible theme prop | Prop exists in code |
| Phase 2 | Context-aware theme in the enterprise issuer |  |
| Phase 3 | Provider UIs |  |
| Phase 4 | Default tenant fallback |  |
| Phase 5 | Cleanup |  |

## Decisions and constraints

- [O21](decisions.md#o21-english-default-on-sign-in-and-profile): English default on sign-in and profile (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- openauth [openauth#10](https://github.com/Al-Ummah-Now/openauth/pull/10), [openauth#11](https://github.com/Al-Ummah-Now/openauth/pull/11), [openauth#12](https://github.com/Al-Ummah-Now/openauth/pull/12), [openauth#21](https://github.com/Al-Ummah-Now/openauth/pull/21), [openauth#36](https://github.com/Al-Ummah-Now/openauth/pull/36), [openauth#37](https://github.com/Al-Ummah-Now/openauth/pull/37)
- Auth [AlUmmahNowAuth#279](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/279), [AlUmmahNowAuth#282](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/282)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Plan checkboxes are unticked although the per-request theme work is merged.

## Sources

- [openauth/packages/openauth/PLAN.md](https://github.com/Al-Ummah-Now/openauth/blob/8529f59fe365137438a6a47147ad1748d2a762b2/packages/openauth/PLAN.md)
- [openauth#21](https://github.com/Al-Ummah-Now/openauth/pull/21), [AlUmmahNowAuth#261](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/261), [openauth#37](https://github.com/Al-Ummah-Now/openauth/pull/37)
