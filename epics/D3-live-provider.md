[← Decision log](decisions.md) · [Epics](README.md) · [Home](../README.md)

# D3: Live provider

| | |
|---|---|
| **Status** | **Decided**, 2026-11-11 |
| **Decision** | **Both** providers ship to production together. New streams are assigned round-robin, and the choice is made on data |
| **Earlier recommendation** | Self-hosted RTMP/SRT ingest, packaged to HLS in the same R2 bucket as VOD |
| **Depends on** | [D2](D2-video-delivery.md), decided 2026-11-10 |
| **Source** | [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (merged 2026-11-10), [`docs/native-apps/EPICS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md) §9 |

## Options

| Option | Notes |
|---|---|
| Bunny Stream Live | In preview. The 2025 live-streaming plan (Phase 2) assumed it. |
| Self-hosted RTMP/SRT → HLS in R2 | **Recommended.** Uses the R2 + CDN delivery decided in D2, so live and VOD share a bucket and a delivery path, and the replay becomes VOD without copying. |

The earlier recommendation was "follows D2", then the self-hosted option. On 2026-11-11 the owner decided to run both and compare them on real streams.

## Implementation (merged 2026-11-12)

- A provider-neutral live layer with a Bunny Live adapter and a self-hosted adapter ([#867](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/867)). Assignment modes: round-robin (default), weighted split, only Bunny, only self-hosted. A per-stream move beats a channel override, which beats the mode. A provider that is disabled, draining, at its concurrency cap, over its monthly budget or not configured hands the stream to the other.
- An admin **Live streaming** page: provider routing, overrides, sessions and a side-by-side comparison ([#871](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/871)).
- **Studio Live** and **Go live** on the web, the live watch page, and QoE beacons tagged with the provider ([#872](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/872)). Encoders push RTMP or HTTPS HLS, whichever provider was assigned.
- Bunny Live is in preview with Bunny; see the open issues in the monorepo for its state.

## Production status (checked 2026-11-14)

**Built, rolling out, not live yet.** The code has been in every production release since v2026.11.12.9.

**Why the owner saw nothing in prod Studio.** Live was only the second sub-tab of Studio → **Content** (Content opens on Videos), with no rail item and no dashboard link. It was not a permission (the channel owner holds `live.manage`/`live.moderate`), not a missing translation, and not a tier: no live tier gate existed until [#1373](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1373). Checked on QA as a seeded creator: rail Dashboard, Content, Analytics, Playlists, Customisation, Settings; quick links Upload, New post, Customise; tabs Videos | Live | Posts. [#1373](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1373) adds **Go live** to the rail and to the dashboard quick links.

Production also could not take a stream:

- **Bunny Stream Live**: the live API returns 403 for the production library (400189) until Bunny grants closed-preview access. This is an **owner/vendor step** ([#874](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/874)). Meanwhile the router sends every stream to self-hosted, which works on its own.
- **Self-hosted host**: the production worker declared no `live.alummahnow.net` route, and no release step attached one. [#1367](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1367) makes the release attach `live.alummahnow.net` (and `live.stage.alummahnow.net`) to api-videos when it is missing. It also adds a release smoke check that the live edge answers `/time`. This **needs a release tag** to reach production.
- **Ingest protocol**: the self-hosted edge takes **HTTPS HLS push**: ffmpeg directly, or OBS through *Custom Output (FFmpeg) → Output to URL* with `method=PUT`. Studio's help text explains this.
  - Plain RTMP/SRT (OBS's default) cannot be built self-serve on Cloudflare. Inbound TCP to a Worker or Container needs **Spectrum** in front of a Worker's `connect()` (Enterprise or beta), so it is a vendor step like Bunny ([#875](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/875)).
  - Idle cost stays at zero: the edge is the api-videos Worker plus R2, with no always-on server.

**Proven end to end on QA.** [#1372](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1372) adds `apps/web/e2e/release/live-stream.player.spec.ts`:

1. Create a stream in Studio and read the server and key from Go live.
2. ffmpeg pushes real video (HLS fMP4 over HTTPS PUT).
3. Studio flips to "You're live", and a viewer's `/live/{id}` plays.
4. End the stream; the recording becomes a VOD and plays.

QA run 43655762702: live in about 4 s, VOD with 22 segments. The old `live-go-live.spec.ts` never sent video.

**Creator tiers** ([#1373](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1373), search migration 0040)
- Each tier has *Live streaming: allowed* plus hours a month, streams at once and longest stream.
- Defaults: None off; Creator 20 h / 1 / 240 min; Unlimited and super admins without limits.
- api-videos enforces the channel **owner's** tier: create and ingest 403 `live_not_in_tier`; start 402 `live_hours_used` or 403 `live_concurrent_limit`.
- The 5-minute live sweep ends a session past its limit. It also ends, per owner, streams over the at-once cap and every stream once the month is used, because the self-hosted edge goes live on the first segment even without Go live.
- Studio shows the month's usage, or why the owner can't go live with **Request access** → `/{lang}/upgrade`.

**Viewer count** ([#1387](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1387), AlUmmahNow#30)
- The watch page beats every 20 s with a random per-tab id, through api-videos, to a memory-only `liveviewers:<streamId>` object in the realtime worker. No D1, KV or storage writes.
- A viewer counts while beating (75 s time to live, for background tabs) and is counted out at once on `pagehide`.
- Abuse is bounded by a 60-beats-a-minute edge limit per IP and 50 counted viewers per network.
- The count shows on `/live/{id}` ("Watching now: N") and on Studio's Go live page.

The feature registry keeps `live-streams` as `rolling` until a production release carries the live host and a stream has played there.

## Blocks

- [Epic 17](E17-live-in-apps.md): live in the apps (watch, chat, premieres).
- [Epic 18](E18-studio-mobile.md) story 18.7: going live from a phone.
- [Epic 19](E19-studio-desktop.md) story 19.7: the live control room.
- [Epic 29](E29-core-web-experience.md) story 29.17: live chat on the live watch page.
- [Epic 28](E28-ai-moderation.md) story 28.12: the live chat fast path.
- [Live streaming plan](LIVE-PHASES-live-streaming-phases.md), Phase 2: the go-live wizard (#126–#140), which needs rewriting if D3 isn't Bunny.
