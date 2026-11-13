[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Creator tiers: invite-only uploads and channel creation

| | |
|---|---|
| **ID** | `CHAT-CREATOR-TIERS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#630, #660, #623, #659).

## Goal

Normal users can't upload or create channels until subscriptions exist; admins assign None / Creator / Unlimited; super admins hold Unlimited.

## Decisions and constraints

- [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers): Invite-only uploads with admin-assigned creator tiers (decided)
- [T1](decisions.md#t1-plans-are-admin-managed): Plans are admin-managed (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#630](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/630), [AlUmmahNow#660](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/660), [AlUmmahNow#623](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/623), [AlUmmahNow#659](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/659), [AlUmmahNow#675](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/675)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Conflicts with Epic 27's seed plans (Free / Plus / Pro / Institution, where Free can upload). See [Epic 27](E27-plans-entitlements.md).

## Sources

- [AlUmmahNow#630](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/630), [AlUmmahNow#660](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/660)
