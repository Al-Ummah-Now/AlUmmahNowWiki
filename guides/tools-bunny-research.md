[← Home](../README.md) · [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) · [Video delivery](video-delivery.md)

# Tools Bunny.net research findings and retirement analysis

| | |
|---|---|
| **Epic** | [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) (`TP-5`) |
| **Applies to** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md), [AUN-R2-MIGRATION](../epics/AUN-R2-MIGRATION-r2-video-migration.md), [AUN-COST](../epics/AUN-COST-cost-monitoring.md), [TOOLS-ADMIN](../epics/TOOLS-ADMIN-admin-import-tool.md) |
| **Date** | 2026-11-23 |
| **Cost constraint** | Whole platform ≤ $500/month ([O1](../epics/decisions.md#o1-whole-platform-cost-cap)) |
| **Source baseline** | [`AlUmmahNowTools/BUNNY_NET_API_ANALYSIS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/BUNNY_NET_API_ANALYSIS.md) (October 2025) |

## Executive recommendation

1. **Freeze all direct Bunny.net code in `AlUmmahNowTools` — do not implement Phases 2–4 of the 2025 Bunny roadmap in Tools.** Every remaining requirement (TUS resumable uploads, upload progress, SHA-256 verification, transcode status polling, and Bunny/R2 cost monitoring) has already been built in the right place: `AlUmmahNow.ToolsCore` (talking strictly to `admin-api`) and the monorepo (`apps/cost-monitor` and `apps/api-videos`).
2. **Retire `AlUmmahNow.BunnyBulkUploader`, `BunnyStorageClient`, `BunnyStreamClient`, and operator Bunny/R2 keys in `TOOLS-ADMIN` TA-14** once the first bulk import completes through `admin-api`.
3. **Complete the platform migration from Bunny Stream to Cloudflare R2 + Cloudflare CDN ([D2](../epics/D2-video-delivery.md), [AUN-R2-MIGRATION](../epics/AUN-R2-MIGRATION-r2-video-migration.md)).** At Medium scale and above, Bunny's per-GB delivery egress ($0.005–$0.01/GB) exceeds the $500/month whole-platform cost cap — reaching **$2,250–$4,500/month** at 500k viewer-hours and **$9,000–$18,000/month** at 2M viewer-hours — whereas R2 + Cloudflare CDN egress is **$0**.

---

## 1. Audit of the 2025 Bunny roadmap (P1–P4)

The October 2025 analysis (`BUNNY_NET_API_ANALYSIS.md`) was written when Bunny was the sole video host and `AlUmmahNowTools` wrote directly to Bunny Storage and Bunny Stream using operator API keys.

| 2025 Phase | Original proposal (6–8 weeks) | Current state (2026-11-23) | Verdict |
|---|---|---|---|
| **P1: Critical fixes** | Retry logic, concurrency rate limiting, `GetAsync` null fix, config validation | **Built in Tools.** `BunnyStorageClient.cs` and `BunnyRetry.cs` ([Tools#19](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/19), [#24](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/24), [#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30), [#39](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/39)): `SemaphoreSlim(10)` concurrency cap, `BunnyTransientResponseHandler`, `BunnyBackoff` with jittered exponential backoff and `Retry-After` on 429/408/5xx, plus `BunnyStreamClient.EnsureSuccess` ([Tools#48](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/48)). | **Complete.** |
| **P2: High-priority refactors** | Extract `IBunnyStreamClient`, inject `HttpClient`/Polly, upload progress, SHA-256 checksum | **Superseded by `TOOLS-ADMIN`.** The active desktop importer (`AlUmmahNow.ToolsCore`) never calls Bunny directly. Upload progress and SHA-256 hashing live in `ImportSteps.cs` and `TusClient.cs` ([Tools#50](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/50)). | **Do not build in Tools.** Freeze legacy `BunnyStreamClient` until TA-14 removes it. |
| **P3: Resumable uploads & polling** | TUS client for Bunny Stream, encoding status polling, Fetch from URL, upload metrics | **Built on the admin-API path.** Resumable TUS uploads live in `AlUmmahNow.ToolsCore/Import/TusClient.cs` (and `aun-core` `UploadEngine`, [Epic 11](../epics/E11-aun-core.md)); transcode status polling lives in `CheckStep` (`GET /api/admin/import/items/:id/delivery`, [Tools#52](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/52)) and the monorepo processing loop ([AlUmmahNow#580](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/580)). | **Complete on the new path; do not duplicate for direct Bunny.** |
| **P4: Large-file chunking & cost monitoring** | Parallel chunk uploads, Bunny storage/bandwidth cost tracker in Tools | **Built in monorepo.** Bunny billing, R2 storage/operations, Cloudflare Containers, and budget/spike alerts live in `AlUmmahNow/apps/cost-monitor` and the videos admin **Costs** and **Delivery** pages ([AUN-COST](../epics/AUN-COST-cost-monitoring.md), [AlUmmahNow#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400)). | **Complete in monorepo; zero cost-tracking code needed in Tools.** |

---

## 2. Cost comparison: Bunny Stream vs. Cloudflare R2 + Cloudflare CDN

Unit assumptions (2026-11 list prices from [`R2-DELIVERY-PLAN.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/R2-DELIVERY-PLAN.md) and `apps/cost-monitor/src/pricing.ts`):

- **Viewer traffic:** average playback ~2 Mbps ≈ **0.9 GB per viewer-hour**.
- **Stored rendition ladder:** ~40 MB per video-minute ≈ **2.4 GB per video-hour**.
- **Bunny Stream:**
  - Storage: **$0.01/GB-month per region** (typical 2-region replication = $0.02/GB-month).
  - Encoding: **$0**.
  - Delivery egress: **$0.005/GB** (Volume network) to **$0.01/GB** (Standard network; up to $0.03–$0.06/GB in MENA/Asia/Africa standard zones).
- **Cloudflare R2 + Cloudflare CDN (confirmed compliant with Cloudflare CDN Terms in writing, [D2](../epics/D2-video-delivery.md)):**
  - Storage: **$0.015/GB-month** (single global bucket, zero replication multiplier).
  - Encoding: **$0.005/video-minute** on Cloudflare Containers (`standard-4`), or **~$0.0005–$0.001/video-minute** when pre-encoded locally by Tools (`TA-12`).
  - Delivery egress: **$0/GB** (only Class B reads on CDN cache misses at $0.36/million; Smart Tiered Cache + 1-year immutable segment caching keep cache hit ratio high).

### Monthly cost at four traffic tiers (12-month accumulated library)

| Scale | Monthly uploads / viewer-hours | Monthly delivery egress | **Bunny Stream total** *(storage + delivery)* | **R2 + Server encode** | **R2 + Tools local pre-encode** | **Dual-write trial (both)** |
|---|---|---|---|---|---|---|
| **Small** (today) | 20 h / 2k viewer-h | 1.8 TB | **~$21–$30** ($12 storage + $9–$18 egress) | **~$16** ($6 encode + $9 storage + <$1 ops) | **~$11** | ~$40 |
| **Medium** | 200 h / 50k viewer-h | 45 TB | **~$340–$565** ($115 storage + $225–$450 egress) | **~$147** ($60 encode + $86 storage + ~$1 ops) | **~$93** | ~$490–$710 *(over cap)* |
| **Large** | 1,000 h / 500k viewer-h | 450 TB | **~$2,800–$5,100** ($576 storage + $2,250–$4,500 egress) | **~$740** ($300 encode + $430 storage + ~$10 ops) | **~$470** *(fits cap)* | Not viable |
| **Millions of viewers** | 1,000 h / 2M viewer-h | 1,800 TB | **$9,576–$18,576** ($576 storage + $9,000–$18,000 egress) | **~$755–$780** | **~$485–$510** *(~$290 with 720p lecture cap)* | Not viable |

**Key takeaway:** Bunny's "free encoding" is vastly outweighed by per-GB egress as viewership grows. By 50k–100k viewer-hours/month, Bunny delivery alone crosses the **$500/month** cap — and because Al Ummah Now serves global Muslim audiences including MENA and Asia (where Bunny Standard pricing is $0.03–$0.06/GB), real-world Bunny egress climbs even faster than the $0.01/GB baseline.

---

## 3. Operational and security findings on legacy Bunny code in Tools

While legacy Bunny code remains in `AlUmmahNowTools` awaiting `TOOLS-ADMIN` TA-14 removal, our code audit notes:

1. **Good resilience in `BunnyStorageClient`:** PR #39 (`AlUmmahNow.Data/Storage/BunnyRetry.cs`) properly wraps the Bunny Storage SDK with `BunnyTransientResponseHandler`, preserves `Retry-After`, applies jittered backoff, and uses `LeaveOpenStream` so retried uploads can rewind safely.
2. **Known minor issues in `BunnyStreamClient` (`AlUmmahNow.Data/Video/BunnyStreamClient.cs`):**
   - Each call instantiates a new `RestClient` without `using` disposal (socket exhaustion risk under high-volume loops).
   - `GetVideosAsync` interpolates `search` without `Uri.EscapeDataString`.
   - `UploadVideoAsync` sends the whole file in one PUT with no retry or TUS resume.
   - **Recommendation:** Do **not** refactor `BunnyStreamClient` unless legacy CLI imports must remain active past `TOOLS-ADMIN` TA-14 (owner decision `TP-D4`). All active staff imports go through `admin-api` TUS (`AlUmmahNow.ToolsCore`), not `BunnyStreamClient`.
3. **Security hygiene:** Removing direct Bunny Storage/Stream keys and R2 S3 credentials from staff computers in TA-14 eliminates long-lived privileged storage keys on endpoints and routes every upload through Auth SSO + audited `admin-api` permissions.
4. **Safe retirement sequence:**
   - Run existing library backfill through the videos admin **R2 backfill** page ([AUN-R2-MIGRATION](../epics/AUN-R2-MIGRATION-r2-video-migration.md), [AlUmmahNow#1395](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1395)) — never via ad-hoc Tools scripts.
   - Flip playback priority to R2-first once Delivery QoE comparison confirms parity.
   - Retire legacy Bunny library `400189` (and later `498994`) through the admin page's grace-period removal flow, which preserves CSAM legal holds and never alters "Block Direct Url File Access".
   - Revoke the old Tools operator Bunny/R2 keys immediately after the first production bulk import via `TOOLS-ADMIN` succeeds (TA-14).
