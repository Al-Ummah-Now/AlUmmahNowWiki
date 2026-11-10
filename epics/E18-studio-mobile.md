[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 18: Studio mobile (iOS / iPadOS / Android)

| | |
|---|---|
| **ID** | `E18` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> Studio iOS AVFoundation edit spike (Apple #12) and Android upload skeleton, Transformer edit spike and `feature-live` ("D3 pending") exist. 18.7 waits on D3, unblocked 2026-11-10.

## Goal

Manage, upload, edit and go live from a phone.

## Scope

- Depends on: 9, 10, 11, 30, D3

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 18.1 | Dashboard |  |
| 18.2 | Upload from phone (TUS, background) |  |
| 18.3 | Edit details |  |
| 18.4 | Comments & community |  |
| 18.5 | Analytics |  |
| 18.6 | Channel management |  |
| 18.7 | Go live from phone over RTMP/SRT (D3) | Waits on D3 (unblocked 2026-11-10; recommendation: self-hosted RTMP/SRT → HLS in R2). |
| 18.8 | Notifications |  |
| 18.9 | Mobile video editor (EDL from Epic 30) |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D3](decisions.md#d3-live-provider): Live provider (pending), see the [D3 page](D3-live-provider.md)
- [D10](decisions.md#d10-transcription-location): Transcription location (open)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- D2/D3 update: [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (open, head `e689549`)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNow | [#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476) | PR | docs(spec): web Creator Studio | OPEN | 2026-11-09 |
| AlUmmahNowApple | [#10](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/10) | issue | Studio stories after the spikes (Epics 18, 19, 30) | OPEN | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- In EPICS.md, story 18.9 is listed before 18.8.
- Chat 2026-11-09 15:51: the owner asked whether Epic 18 was the web Studio spec. It is Studio **mobile**; the web Creator Studio (PR #476) has no epic number.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowApple/docs/research/live-broadcast.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/e1777cba481c31a0967befa9e25ac5672125a092/docs/research/live-broadcast.md)
