[← Decision log](decisions.md) · [Epics](README.md) · [Home](../README.md)

# D3: Live provider

| | |
|---|---|
| **Status** | **Pending.** Unblocked on 2026-11-10; waiting on the owner |
| **Recommendation** | Self-hosted RTMP/SRT ingest, packaged to HLS in the same R2 bucket as VOD |
| **Depends on** | [D2](D2-video-delivery.md), decided 2026-11-10 |
| **Source** | [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (merged 2026-11-10), [`docs/native-apps/EPICS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md) §9 |

## Options

| Option | Notes |
|---|---|
| Bunny Stream Live | In preview. The 2025 live-streaming plan (Phase 2) assumed it. |
| Self-hosted RTMP/SRT → HLS in R2 | **Recommended.** Uses the R2 + CDN delivery decided in D2, so live and VOD share a bucket and a delivery path, and the replay becomes VOD without copying. |

The earlier recommendation was "follows D2". Now that D2 is decided, the recommendation is the self-hosted option. Only the owner's decision is missing.

## Blocks

- [Epic 17](E17-live-in-apps.md): live in the apps (watch, chat, premieres).
- [Epic 18](E18-studio-mobile.md) story 18.7: going live from a phone.
- [Epic 19](E19-studio-desktop.md) story 19.7: the live control room.
- [Epic 29](E29-core-web-experience.md) story 29.17: live chat on the live watch page.
- [Epic 28](E28-ai-moderation.md) story 28.12: the live chat fast path.
- [Live streaming plan](LIVE-PHASES-live-streaming-phases.md), Phase 2: the go-live wizard (#126–#140), which needs rewriting if D3 isn't Bunny.
