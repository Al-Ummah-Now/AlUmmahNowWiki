[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Social media management for channels

| | |
|---|---|
| **ID** | `AUN-SOCIAL` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **planned** |
| **Last updated** | 2026-11-09 |

> Spec and owner decisions merged 2026-11-09/10 (#569, #581). Not implemented.

## Goal

Channel teams connect Facebook, X, Telegram, Instagram, YouTube and others in Studio to auto-announce, cross-post, schedule, measure and answer.

## Scope

- Facebook and X first, then Telegram, Instagram, YouTube, TikTok, Threads, LinkedIn, Bluesky, Mastodon; share kits for WhatsApp Channels and Snapchat
- Default post format is the video itself, natively; link posts opt-in (owner decision 2)
- Always async: queues, retry, DLQ, admin errors page (owner decision 5)
- Lives in Creator Studio as a **Social** rail item; follows per-channel roles (#462)

## Decisions and constraints

- [D2](decisions.md#d2-video-delivery): Video delivery (decided), see the [D2 page](D2-video-delivery.md)
- [O30](decisions.md#o30-social-media-answers): Social media answers (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#569](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/569), [AlUmmahNow#581](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/581)

## Open questions

- Register a legal business so Facebook/Instagram/Threads work for every channel (Meta Business Verification)? Without it: own Pages + 50 beta channels.

## Conflicts between sources

- The spec's own cost estimate is **≈ $620–720/month with X** (≈ $230–330 without), above the whole-platform **≤ $500/month** cap from D2. The spec sets a separate X spend cap defaulting to $500. Not resolved in any source.

## Sources

- [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)
- [AlUmmahNow#569](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/569), [AlUmmahNow#581](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/581)
