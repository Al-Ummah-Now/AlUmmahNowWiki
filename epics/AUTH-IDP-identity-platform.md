[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Identity platform: SSO provider, Lanes 1–7

| | |
|---|---|
| **ID** | `AUTH-IDP` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [openauth](../repos/openauth.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |

> Lanes 2, 4 and 5 have implementation summaries; Lanes 1 and 3 are in use (the account hub depends on them); Lanes 6–7 have no status. The owner's chat rule makes auth a separable SSO provider.

## Goal

Enterprise SSO: client registration, cross-app SSO, multi-account sessions (3 per browser), session management, per-app tokens, RBAC, multi-tenant white-label, admin controls.

## Scope

- Owner rule (chat O14): "auth is meant as an SSO provider that can be split out and used by other sites"; auth and videos are two separate apps; videos admins send moderation requests to auth admins ([AlUmmahNowAuth#275](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/275))
- Owner rule (chat O13): "if you are signed in then you are signed in" across all apps ([AlUmmahNowAuth#254](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/254))

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Lane 1 | Multi-account & browser sessions | In use (no status in doc) |
| Lane 2 | SSO & OIDC parameters (prompt, login_hint) | Implemented |
| Lane 3 | Session management APIs | In use |
| Lane 4 | Token architecture (audience, exchange, introspection) | Implemented |
| Lane 5 | Multi-tenant infrastructure | Implemented |
| Lane 6 | Admin session controls | No status in doc |
| Lane 7 | Admin & profile UI | No status in doc |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- openauth [openauth#5](https://github.com/Al-Ummah-Now/openauth/pull/5), [openauth#7](https://github.com/Al-Ummah-Now/openauth/pull/7), [openauth#8](https://github.com/Al-Ummah-Now/openauth/pull/8), [openauth#15](https://github.com/Al-Ummah-Now/openauth/pull/15), [openauth#21](https://github.com/Al-Ummah-Now/openauth/pull/21)

## Open questions

- Lanes 6 and 7 status is not recorded anywhere.

## Conflicts between sources

- MASTER plan says "6 parallel work lanes" but lists 7.
- Phase grouping of lanes differs between the MASTER plan and the Serena memory copy.
- openauth's copy of the spec has its own IdP Phases 1–5, which don't match the Lanes.
- Lane migration numbers (0023/0027/0028) collide and none exist at HEAD.
- Lane 2 summary is dated 2024-12-02, Lanes 4/5 2025-12-02 (likely a typo).
- Lane 5 is "P2 Future Phase" in MASTER but "Implemented" in its summary.
- The phrase "identity platform" never appears in chat; the owner's rule is about auth as a separable SSO provider.

## Sources

- [AlUmmahNowAuth/docs/IDENTITY_PLATFORM_SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/docs/IDENTITY_PLATFORM_SPEC.md)
- [openauth/packages/openauth/docs/IDENTITY_PLATFORM_SPEC.md](https://github.com/Al-Ummah-Now/openauth/blob/8529f59fe365137438a6a47147ad1748d2a762b2/packages/openauth/docs/IDENTITY_PLATFORM_SPEC.md)
- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-09 03:27 and 2026-11-10 03:36–03:40 UTC, position 8301 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
