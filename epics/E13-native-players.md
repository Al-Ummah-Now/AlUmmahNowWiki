[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 13: Native players

| | |
|---|---|
| **ID** | `E13` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> AVKit (Apple) and Media3 (Android) players with quality, speed, subtitles, PiP, background audio, AirPlay/Cast; Desktop parses HLS and WebVTT in shared code; aun-player conformance scenarios (38) in Core 0.2.0.

## Goal

Native player per platform (AVKit, Media3, Media Foundation, GStreamer, AVPlay), identical behaviour via the shared conformance suite.

## Scope

- Depends on: 11

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 13.1 | HLS ABR playback, fast start | Done — both audits agree: AlUmmahNowApple#4 (merged): AVKit HLS with quality selection; AlUmmahNowAndroid#4 (merged): Media3 HLS with quality selection; AlUmmahNowDesktop#6 and #10 (merged): GStreamer and Windows HLS playback; AlUmmahNowAndroid#4; AlUmmahNowApple#4 |
| 13.2 | Speed and skip ±10 s (mirrored in RTL) | Done — both cross-checks agree: Apple PlayerController.swift:53-54,106,131 implements speeds, pitch correction and ±10 s; Android AunVideoPlayer.kt:64-96 implements mirrored double-tap seek.; Android#4 body: speeds 0.5x-2x in PlayerSettingsSheet and RTL-mirrored double-tap seek; Apple PlayerController.swift has speeds [0.5...2]. |
| 13.3 | Subtitles incl. verse-synced recitation | In Progress — both cross-checks agree: EPICS.md:299-300 requires verse-synced Arabic plus translation; Apple WebVTT.swift and Android #4 ship only ordinary sidecar captions.; WebVTT sidecars shipped on both platforms, but #419 is open (no HLS renditions, so PiP/AirPlay lose subtitles) and verse-synced recitation is not in any player. |
| 13.4 | Chapters | In Progress — split one step: partially built, acceptance not fully met: Kimi: Both watch screens render tappable chapter lists, but EPICS.md:301 also requires chapter-skip gestures, which are absent.; GLM: Android#4 body: "Chapters seek on tap"; Apple WatchView.swift renders chapters — present on both watch screens. |
| 13.5 | PiP, background audio, Now Playing | Done — both cross-checks agree: Apple PlayerSurface.swift and NowPlayingCoordinator.swift implement PiP/background/lock-screen controls; Android AunPlaybackService.kt supplies PiP/background MediaSession.; Android: PiP auto-enter + MediaLibraryService notification (#4 body); Apple: NowPlayingCoordinator + UIBackgroundModes audio in ViewerIOS/Info.plist. |
| 13.6 | Casting | In Progress — both audits agree: AlUmmahNowApple#4 (merged): AirPlay; AlUmmahNowAndroid#4 (merged): Chromecast; AlUmmahNowAndroid#4 |
| 13.7 | Study tools: A–B loop, repeat-N, bookmarks |  |
| 13.8 | Sleep timer |  |
| 13.9 | Resume & sync (9.9) | In Progress — both cross-checks agree: Core#19 supplies resume sync, but native viewer watch screens do not call it and Core#13 lists remaining server sync gaps.; Sync API (#406) and aun-sync (Core#19) shipped but are not wired into any player and Core#13 keeps the server contract open. |
| 13.10 | QoE telemetry, clear errors | In Progress — both cross-checks agree: Core#18 implements QoE tracking, but no Apple/Android player integration is present and Core#8/AlUmmahNow#432 leave ingest open.; Consent-gated QoE tracker merged (Core#18) and live QoE beacons ship on web; the native ingest endpoint #432 is still open. |
| 13.11 | Accessibility | In Progress — both cross-checks agree: Native screens have screen-reader semantics and caption language selection, but EPICS.md:309-310 also requires preference defaults and audio-description tracks.; en/ar RTL UI tests ship on every platform, but no screen-reader/accessibility-matrix evidence exists. |

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

### Reconciled 2026-11-21

- **E13 / HLS ABR playback, fast start (HLB-684): Done** — both audits agree: AlUmmahNowApple#4 (merged): AVKit HLS with quality selection; AlUmmahNowAndroid#4 (merged): Media3 HLS with quality selection; AlUmmahNowDesktop#6 and #10 (merged): GStreamer and Windows HLS playback; AlUmmahNowAndroid#4; AlUmmahNowApple#4
- **E13 / Casting (HLB-689): In Progress** — both audits agree: AlUmmahNowApple#4 (merged): AirPlay; AlUmmahNowAndroid#4 (merged): Chromecast; AlUmmahNowAndroid#4
- **E13 / Speed and skip ±10 s (mirrored in RTL) (HLB-685): Done** — both cross-checks agree: Apple PlayerController.swift:53-54,106,131 implements speeds, pitch correction and ±10 s; Android AunVideoPlayer.kt:64-96 implements mirrored double-tap seek.; Android#4 body: speeds 0.5x-2x in PlayerSettingsSheet and RTL-mirrored double-tap seek; Apple PlayerController.swift has speeds [0.5...2].
- **E13 / Subtitles incl. verse-synced recitation (HLB-686): In Progress** — both cross-checks agree: EPICS.md:299-300 requires verse-synced Arabic plus translation; Apple WebVTT.swift and Android #4 ship only ordinary sidecar captions.; WebVTT sidecars shipped on both platforms, but #419 is open (no HLS renditions, so PiP/AirPlay lose subtitles) and verse-synced recitation is not in any player.
- **E13 / Chapters (HLB-687): In Progress** — split one step: partially built, acceptance not fully met: Kimi: Both watch screens render tappable chapter lists, but EPICS.md:301 also requires chapter-skip gestures, which are absent.; GLM: Android#4 body: "Chapters seek on tap"; Apple WatchView.swift renders chapters — present on both watch screens.
- **E13 / PiP, background audio, Now Playing (HLB-688): Done** — both cross-checks agree: Apple PlayerSurface.swift and NowPlayingCoordinator.swift implement PiP/background/lock-screen controls; Android AunPlaybackService.kt supplies PiP/background MediaSession.; Android: PiP auto-enter + MediaLibraryService notification (#4 body); Apple: NowPlayingCoordinator + UIBackgroundModes audio in ViewerIOS/Info.plist.
- **E13 / Resume & sync (9.9) (HLB-692): In Progress** — both cross-checks agree: Core#19 supplies resume sync, but native viewer watch screens do not call it and Core#13 lists remaining server sync gaps.; Sync API (#406) and aun-sync (Core#19) shipped but are not wired into any player and Core#13 keeps the server contract open.
- **E13 / QoE telemetry, clear errors (HLB-693): In Progress** — both cross-checks agree: Core#18 implements QoE tracking, but no Apple/Android player integration is present and Core#8/AlUmmahNow#432 leave ingest open.; Consent-gated QoE tracker merged (Core#18) and live QoE beacons ship on web; the native ingest endpoint #432 is still open.
- **E13 / Accessibility (HLB-694): In Progress** — both cross-checks agree: Native screens have screen-reader semantics and caption language selection, but EPICS.md:309-310 also requires preference defaults and audio-description tracks.; en/ar RTL UI tests ship on every platform, but no screen-reader/accessibility-matrix evidence exists.
## Open questions

- None recorded in the sources.

## Conflicts between sources

- Bunny HLS has no subtitle renditions, so Apple draws a sidecar WebVTT overlay that is missing in PiP/AirPlay (interim).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowCore/docs/PLAYER_BEHAVIOUR.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/45d873a0b0fa908bead87d91f28bd33a2b41bedb/docs/PLAYER_BEHAVIOUR.md)
