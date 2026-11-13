[← Decision log](decisions.md) · [Epics](README.md) · [Home](../README.md)

# D2: Video delivery

| | |
|---|---|
| **Status** | **Decided**, 2026-11-10 |
| **Decision** | Cloudflare R2 + Cloudflare CDN |
| **Cost constraint** | Whole platform ≤ $500/month |
| **Source** | [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686), which updates [`docs/native-apps/EPICS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md) §9. Merged 2026-11-10. |

## Decision

Video is delivered from **R2 through Cloudflare's CDN**. Bunny.net was the alternative. Since 2026-11-12 both run side by side in every environment and an admin switch picks the source; see [Video delivery](../guides/video-delivery.md).

Cloudflare Support confirmed in writing that the setup is allowed. HLS stored in R2 and served through a custom domain on our zone meets the CDN Service-Specific Terms on a self-serve plan (Workers Paid / Pro), as long as R2 is subscribed. No published usage level forces Enterprise.

## Ruled out

- **Cloudflare Stream.** It would cost about $50k/month for 50M minutes, far over the cap.

## Required setup

- A **cache-everything Cache Rule** on the media hostname. Cloudflare doesn't cache `.m3u8` and `.ts` by default.
- **Smart Tiered Cache.**
- A **custom domain** on our zone. Never `r2.dev`.

## Limits to design around

- **No Cache Reserve for R2 public buckets.** A cold tail costs first-byte latency, but egress is $0.
- **512 MB** is the largest cacheable file on Pro.
- **50 bucket-management operations per second.**
- **1,200 REST API calls per 5 minutes.** This limits management calls only, not delivery.

## What this unblocks

- [D3](D3-live-provider.md), the live provider. Decided 2026-11-11: both providers, round-robin.
- [Epic 9](E09-native-platform-foundations.md) story 9.6, playback authorization: the R2 signed-URL adapter can now be written.
- [Epic 14](E14-offline-listen.md), offline downloads: download URLs and licences can be built on R2.
- [D11](decisions.md#d11-who-encodes-renditions), who encodes renditions. Its recommendation was waiting for D2.
- [E4](decisions.md#e4-delivery-cost-for-embeds), the delivery cost of embeds ([Epic 25](E25-sharing-embeds.md) story 25.9).
- [M4](decisions.md#m4-csam-coverage-for-r2-served-media): CSAM Scanning Tool coverage for media served from R2 now matters for video too.

## History

- 2026-11-07/08: listed as an open decision in `EPICS.md`. The options were Bunny (today) and R2 + Cloudflare CDN. The recommendation was "pending Cloudflare confirmation and cost cap (≤ $500/mo)".
- 2026-11-10: decided after Cloudflare Support's written confirmation ([#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686)).
- 2026-11-10: owner chose Cloudflare Containers for transcoding ([O31](decisions.md#o31-transcode-on-cloudflare-containers)) and a side-by-side trial with Bunny before switching ([O32](decisions.md#o32-run-bunny-and-r2-side-by-side-before-switching)).
- 2026-11-12: R2 delivery live in QA, stage and production ([#948](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/948)); the API picks the source and returns one playback URL ([#1013](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1013)).

