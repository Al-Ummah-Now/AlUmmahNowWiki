[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 13: Native players

| | |
|---|---|
| **ID** | `E13` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> AVKit (Apple) and Media3 (Android) players with quality, speed, subtitles, PiP, background audio, AirPlay/Cast; Desktop parses HLS and WebVTT in shared code; aun-player conformance scenarios (38) in Core 0.2.0.

## Goal

Native player per platform (AVKit, Media3, Media Foundation, GStreamer, AVPlay), identical behaviour via the shared conformance suite.

## Scope

- Depends on: 11

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 13.1 | HLS ABR playback, fast start |  |
| 13.2 | Speed and skip ±10 s (mirrored in RTL) |  |
| 13.3 | Subtitles incl. verse-synced recitation |  |
| 13.4 | Chapters |  |
| 13.5 | PiP, background audio, Now Playing |  |
| 13.6 | Casting |  |
| 13.7 | Study tools: A–B loop, repeat-N, bookmarks |  |
| 13.8 | Sleep timer |  |
| 13.9 | Resume & sync (9.9) |  |
| 13.10 | QoE telemetry, clear errors |  |
| 13.11 | Accessibility |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNowApple | [#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9) | issue | Viewer stories after the first slice (Epics 12-17, 20-22) | OPEN | 2026-11-08 |
| AlUmmahNowCore | [#5](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/5) | PR | feat(aun-player): player behaviour model + conformance suite | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#18](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/18) | PR | feat(aun-telemetry): consent-gated telemetry, QoE tracker, breadcrumbs, sinks | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Bunny HLS has no subtitle renditions, so Apple draws a sidecar WebVTT overlay that is missing in PiP/AirPlay (interim).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowCore/docs/PLAYER_BEHAVIOUR.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/45d873a0b0fa908bead87d91f28bd33a2b41bedb/docs/PLAYER_BEHAVIOUR.md)
