[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 30: Studio media engine (`aun-media`, Rust)

| | |
|---|---|
| **ID** | `E30` |
| **Owning repos** | [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> `aun-media` shipped in Core 0.2.0 (probe, job graph, proxies, whisper transcription, EDL v1 schema, HarfBuzz shaping, upload handoff). Apps still use interim edit models.

## Goal

One media engine behind Studio desktop and mobile: probe, encode plans, proxies, transcription, edit model.

## Scope

- Depends on: 11

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 30.1 | Probe & analyse |  |
| 30.2 | Encode job graph |  |
| 30.3 | Proxies & thumbnails |  |
| 30.4 | Transcription (whisper.cpp) |  |
| 30.5 | Edit model (EDL) |  |
| 30.6 | Text rendering (HarfBuzz, bidi) |  |
| 30.7 | Upload handoff |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D6](decisions.md#d6-fonts): Fonts (open)
- [D10](decisions.md#d10-transcription-location): Transcription location (open)
- [D11](decisions.md#d11-who-encodes-renditions): Who encodes renditions (open)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNowAndroid | [#3](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/3) | PR | feat(core-bridge,design): core interfaces + Fanous theme and components | MERGED | 2026-11-08 |
| AlUmmahNowApple | [#10](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/10) | issue | Studio stories after the spikes (Epics 18, 19, 30) | OPEN | 2026-11-08 |
| AlUmmahNowCore | [#4](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/4) | PR | feat(media): probe, analysis and waveforms (Epic 30.1, 30.3) | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#7](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/7) | PR | feat(media): encode job graph, runner, software backend, conformance (Epic 30.2) | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#9](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/9) | PR | feat(media): EDL project format, migrations, edits and render planning (Epic 30.5) | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#10](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/10) | PR | feat(media): bidi-aware text shaping and line breaking (Epic 30.6) | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#11](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/11) | PR | feat(media): model manager, subtitles, chapters, whisper feature (Epic 30.4) | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#12](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/12) | PR | feat(media): upload handoff (Epic 30.7) | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#16](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/16) | PR | feat(ffi): expose aun-media analysis, waveforms, thumbnails, subtitles and EDL | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Android's PLAN scope omits Epic 30, but `feature-editor` / `EditModel.kt` implement 30.5-shaped work.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowCore/docs/MEDIA.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/45d873a0b0fa908bead87d91f28bd33a2b41bedb/docs/MEDIA.md)
