[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Channel sections (Home tab)

| | |
|---|---|
| **ID** | `AUN-CHANNEL-SECTIONS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |

> Spec #602, build #631, E2E #640, fixes #659, all merged 2026-11-10.

## Goal

Channel Home tab as an owner-curated stack of up to 12 sections, with privacy opt-in for Subscriptions/Liked.

## Scope

- Fix the 7 existing types; add Spotlight, Shorts, Live, Created playlists, Featured channels, Community posts
- Server-side population (`GET /sections/populated`)

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#602](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/602), [AlUmmahNow#631](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/631), [AlUmmahNow#640](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/640), [AlUmmahNow#659](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/659)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- No epic number; covers part of Epic 29.18 (channel extras) and the featured-channels gap in CORE-WEB-EXPERIENCE.

## Sources

- [docs/specs/CHANNEL-SECTIONS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/CHANNEL-SECTIONS.md)
- [AlUmmahNow#602](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/602), [AlUmmahNow#631](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/631)
