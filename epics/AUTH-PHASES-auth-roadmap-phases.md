[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: milestones and phases

| | |
|---|---|
| **ID** | `AUTH-PHASES` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **in progress** |
| **Last updated** | 2024-12-01 |

> Phase 1 Foundation "Complete"; Phase 2 Security & Compliance "In Progress"; Phase 3 Scale "Planned"; Phase 4 Community "Future". Milestones Alpha (2025-02-15), Beta (2025-03-15), v1.0 (2025-03-31) all "0% Complete" and long past.

## Goal

The 2024/25 plan to take auth to v1.0.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Phase 1 | Foundation | Complete |
| Phase 2 | Enhanced security & compliance (MFA, GDPR, SAML/LDAP) | In progress per doc |
| Phase 3 | Scale & performance | Planned per doc |
| Phase 4 | Community & integration (Islamic calendar, prayer-aware sessions) | Future per doc |

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

- `.github/copilot-instructions.md` numbers Phases 1–4 with different content (Phase 4 = multi-tenancy).

## Sources

- [AlUmmahNowAuth/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/ROADMAP.md)
- [AlUmmahNowAuth/README.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/README.md)
