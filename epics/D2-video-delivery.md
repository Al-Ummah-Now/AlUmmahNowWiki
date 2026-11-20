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
- [D11](decisions.md#d11-who-encodes-renditions), who encodes renditions: decided 2026-11-14 (server by default, optional desktop pre-encode verified server-side).
- [E4](decisions.md#e4-delivery-cost-for-embeds), the delivery cost of embeds ([Epic 25](E25-sharing-embeds.md) story 25.9).
- [M4](decisions.md#m4-csam-coverage-for-r2-served-media): CSAM Scanning Tool coverage for media served from R2 now matters for video too.

## History

- 2026-11-07/08: listed as an open decision in `EPICS.md`. The options were Bunny (today) and R2 + Cloudflare CDN. The recommendation was "pending Cloudflare confirmation and cost cap (≤ $500/mo)".
- 2026-11-10: decided after Cloudflare Support's written confirmation ([#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686)).
- 2026-11-10: owner chose Cloudflare Containers for transcoding ([O31](decisions.md#o31-transcode-on-cloudflare-containers)) and a side-by-side trial with Bunny before switching ([O32](decisions.md#o32-run-bunny-and-r2-side-by-side-before-switching)).
- 2026-11-12: R2 delivery live in QA, stage and production ([#948](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/948)); the API picks the source and returns one playback URL ([#1013](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1013)).
- 2026-11-15: two production transcodes sat queued while every container start crashed (an image without `review.mjs`), and the admin only said "2 queued". The videos admin **Delivery** page gets a transcode troubleshooting panel: each job with its reason in words, the containers, the queues, the transcoder's log lines, Retry now and Cancel, and stall flags on the Errors page ([#1414](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1414), in review; builds on [#1409](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1409)).
- 2026-11-15: owner: make "max concurrent R2 transcodes" an admin setting on Delivery. Container `max_instances` becomes a hard ceiling (production 10, stage and QA 2; idle instances cost nothing). The admin's setting (default 4, 1 to the ceiling) is enforced by a slots Durable Object in apps/media: jobs over the limit wait in the queue without using up retries, oldest first, and a change applies within a minute. It is a setting of the R2 provider: **Video providers → Cloudflare R2 settings**, where admins change it (audited, Undo) with the estimated cost of one more slot next to the field (about $0.40 an hour while it transcodes, about $289 a month if busy all month). Delivery keeps only the live "N of <setting>" figure with the ceiling and a link to the R2 settings; moderators see the figure ([#1439](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1439), in review; stacked on #1414).
- 2026-11-15: owner: the transcode setting becomes an autoscaling **range (min–max)**. Up to `min` run at once; while jobs wait, one more slot opens per transcode start or finish until the queue is empty or `max` is reached; once nothing waits it falls back to `min`. Never above the deploy ceiling (10 production, 2 QA/stage). Default 4–4 (the earlier fixed 4). Rules 1 ≤ min ≤ max ≤ ceiling, with en/ar errors on the field. The R2 settings show both fields, the cost per extra slot and the worst case at max; Delivery shows "N running · M waiting · range min–max". `min` is a concurrency floor, not warm instances: Cloudflare Containers bill an instance only while it runs ([#1439](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1439), in review).
- 2026-11-15: owner: no ceiling of our own, only Cloudflare's real limit. Containers have no per-application cap; the account-wide limits are 15,000 vCPU, 60 TiB memory and 300 TB disk ([Containers → Limits → Account limits](https://developers.cloudflare.com/containers/platform-details/limits/#account-limits)). For standard-4 (4 vCPU) that is **3,750 concurrent instances**, so production `max_instances` is 3,750. Stage and QA stay at 2 because the limit is shared across the account. The admin shows "Cloudflare limit: N" and the min–max range goes up to it ([#1439](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1439)).
- After v2026.11.15.3: the 3,750 deploy was refused, because every application on the account reserves `max_instances` × its vCPU from the shared 15,000 vCPU. Production is now **3,371**: 10% stays free for other projects, and stage and QA hold 16 vCPU, so (15,000 × 0.9 − 16) / 4 = 3,371. Stage and QA stay at 2. `scripts/release/container-quota.ts` checks the whole account before every release (`apps/media/wrangler.jsonc` comment above `max_instances`; `packages/shared-types/src/transcode-limit.ts`).
