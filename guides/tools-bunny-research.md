[← Home](../README.md) · [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) · [Video delivery](video-delivery.md)

# Tools Bunny.net research findings and retirement analysis

| | |
|---|---|
| **Epic** | [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) (`TP-5`) |
| **Applies to** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md), [AUN-R2-MIGRATION](../epics/AUN-R2-MIGRATION-r2-video-migration.md), [AUN-COST](../epics/AUN-COST-cost-monitoring.md), [TOOLS-ADMIN](../epics/TOOLS-ADMIN-admin-import-tool.md) |
| **Date** | 2026-11-23 |
| **Cost goal** | Cost-conscious design: prefer low per-video and per-view unit costs ([O1](../epics/decisions.md#o1-cost-conscious-design)) |
| **Source baseline** | [`AlUmmahNowTools/BUNNY_NET_API_ANALYSIS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/BUNNY_NET_API_ANALYSIS.md) (October 2025) |

## Executive recommendation

1. **Remove all direct Bunny.net client code from `AlUmmahNowTools` now (owner decision `TP-D4` in [decisions.md](../epics/decisions.md), decided 2026-11-23) — do not implement Phases 2–4 of the 2025 Bunny roadmap in Tools.** Every remaining requirement (TUS resumable uploads, upload progress, SHA-256 verification, transcode status polling, and Bunny/R2 cost monitoring) has already been built in the right place: `AlUmmahNow.ToolsCore` (talking strictly to `admin-api`) and the monorepo (`apps/cost-monitor` and `apps/api-videos`).
2. **Legacy Bunny removal implemented in [Tools#64](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/64):** deletes `AlUmmahNow.BunnyBulkUploader`, `BunnyStorageClient`, `BunnyRetry`, `BunnyStreamClient`, `BunnyVideo`, `BunnyCDN.Net.Storage`, `RestSharp`, `VideoImporter.ImportFromBunnyApiAsync`, and the dead Bunny DI registrations in `App.xaml.cs` (`ImportView` already runs on `BulkImportViewModel` → `ToolsCore` → `admin-api`). Operator Bunny/R2 keys on staff machines should still be revoked as part of `TOOLS-ADMIN` TA-14.
3. **Complete the platform migration from Bunny Stream to Cloudflare R2 + Cloudflare CDN ([D2](../epics/D2-video-delivery.md), [AUN-R2-MIGRATION](../epics/AUN-R2-MIGRATION-r2-video-migration.md)).** At Medium-to-Large viewership, Bunny's per-GB delivery egress ($0.005/GB Volume tier down to $0.002/GB above 1 PB; $0.01/GB NA/EU Standard, and $0.03–$0.06/GB in Asia/MENA/Africa Standard zones) grows steeply — reaching **$2,800–$5,100/month** at 500k viewer-hours and **~$6,700–$18,600+/month** at 2M viewer-hours — whereas R2 + Cloudflare CDN egress is **$0** (leaving R2 storage and lifecycle rules, not bandwidth, as the primary cost lever under [O1](../epics/decisions.md#o1-cost-conscious-design)).

---

## 1. Audit of the 2025 Bunny roadmap (P1–P4)

The October 2025 analysis (`BUNNY_NET_API_ANALYSIS.md`) was written when Bunny was the sole video host and `AlUmmahNowTools` wrote directly to Bunny Storage and Bunny Stream using operator API keys.

| 2025 Phase | Original proposal (6–8 weeks) | Current state (2026-11-23) | Verdict |
|---|---|---|---|
| **P1: Critical fixes** | Retry logic, concurrency rate limiting, `GetAsync` null fix, config validation | **Built in Tools.** `BunnyStorageClient.cs` and `BunnyRetry.cs` (retry/backoff in [Tools#19](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/19), [#24](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/24), [#39](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/39); unique storage keys and no silent overwrites in [#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30)): `SemaphoreSlim(10)` concurrency cap, `BunnyTransientResponseHandler`, `BunnyBackoff` with jittered exponential backoff and `Retry-After` on 429/408/5xx, plus `BunnyStreamClient.EnsureSuccess` ([Tools#48](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/48)). | **Complete.** |
| **P2: High-priority refactors** | Extract `IBunnyStreamClient`, inject `HttpClient`/Polly, upload progress, SHA-256 checksum | **Superseded by `TOOLS-ADMIN`.** The active desktop importer (`AlUmmahNow.ToolsCore`) never calls Bunny directly. Upload progress and SHA-256 hashing live in `ImportSteps.cs` and `TusClient.cs` ([Tools#50](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/50)). | **Do not build in Tools.** Legacy `BunnyStreamClient` removed now under `TP-D4` ([Tools#64](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/64)). |
| **P3: Resumable uploads & polling** | TUS client for Bunny Stream, encoding status polling, Fetch from URL, upload metrics | **Built on the admin-API path.** Resumable TUS uploads live in `AlUmmahNow.ToolsCore/Import/TusClient.cs` (and `aun-core` `UploadEngine`, [Epic 11](../epics/E11-aun-core.md)); transcode status polling lives in `CheckStep` (`GET /api/admin/import/items/:id/delivery`, [Tools#52](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/52)) and the monorepo processing loop ([AlUmmahNow#580](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/580)). | **Complete on the new path; do not duplicate for direct Bunny.** |
| **P4: Large-file chunking & cost monitoring** | Parallel chunk uploads, Bunny storage/bandwidth cost tracker in Tools | **Built in monorepo.** Bunny billing, R2 storage/operations, Cloudflare Containers, and budget/spike alerts live in `AlUmmahNow/apps/cost-monitor` and the videos admin **Costs** and **Delivery** pages ([AUN-COST](../epics/AUN-COST-cost-monitoring.md), [AlUmmahNow#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400)). | **Complete in monorepo; zero cost-tracking code needed in Tools.** |

---

## 2. Cost comparison: Bunny Stream vs. Cloudflare R2 + Cloudflare CDN

### Pricing sources (retrieved 2026-11-23)

- Bunny Stream: <https://bunny.net/pricing/stream/> (note: Bunny's Stream page publishes "From $0.005/GB" delivery with a $0.01/GB calculator default and "From $0.01/GB" storage across 1–8 selectable replication regions; Bunny's pages do not display a last-updated date, and Bunny enforces a $1/month account minimum which is immaterial at these volumes).
- Bunny CDN (Volume and Standard regional rates): <https://bunny.net/pricing/cdn/> — Volume network: **$0.005/GB** (first 500 TB), **$0.004/GB** (500 TB–1 PB), **$0.002/GB** (1 PB–2 PB); Standard network: **$0.01/GB** (Europe & North America), **$0.03/GB** (Asia & Oceania), **$0.045/GB** (South America), **$0.06/GB** (Middle East & Africa).
- Cloudflare R2: <https://developers.cloudflare.com/r2/pricing/> ($0.015/GB-month storage, $4.50/M Class A, $0.36/M Class B after 10M free, $0 egress).
- Cloudflare Containers: <https://developers.cloudflare.com/containers/pricing/> (`standard-4` ≈ $0.000111/active instance-second → ~$0.005/video-minute server transcode).
- Internal baseline: [`AlUmmahNow/docs/media-delivery/R2-DELIVERY-PLAN.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/R2-DELIVERY-PLAN.md) and `apps/cost-monitor/src/pricing.ts`.

### Modeling assumptions

- **Viewer traffic:** average playback ~2 Mbps ≈ **0.9 GB per viewer-hour**.
- **Stored rendition ladder:** ~40 MB per video-minute ≈ **2.4 GB per video-hour**.
- **Bunny Stream assumptions:** Applying Bunny CDN's Volume/Standard regional rates to Bunny Stream delivery and modeling 2-region replication at **$0.02/GB-month** (2 × $0.01/GB) are explicit assumptions because Bunny's Stream page only states "From $0.005/GB" delivery and "From $0.01/GB" storage without a per-region breakdown.
- **Cloudflare R2 + Cloudflare CDN (confirmed compliant with Cloudflare CDN Terms in writing, [D2](../epics/D2-video-delivery.md)):**
  - Storage: **$0.015/GB-month** (single global bucket, zero replication multiplier).
  - Encoding: **$0.005/video-minute** on Cloudflare Containers (`standard-4`), or an assumed **~$0.0005–$0.001/video-minute** when pre-encoded locally by Tools (`TA-12`; unmeasured — see `tools-encoding-research.md`).
  - Delivery egress: **$0/GB**. Class B origin reads on CDN cache misses ($0.36/M after 10M free) are modeled using `R2-DELIVERY-PLAN.md`'s baseline of **~72 R2 reads per viewer-hour** (~36M reads ≈ $10/mo at 500k viewer-hours; ~144M reads ≈ **$48/mo** at 2M viewer-hours).

### Monthly cost at four traffic tiers (**month-12 accumulated library snapshot**)

> **Snapshot caveat:** Storage columns reflect a **month-12 library snapshot**. At Large scale (1,000 h/month), R2 storage keeps growing by ~$36/month past month 12, so keeping storage costs low past year 1 ([O1](../epics/decisions.md#o1-cost-conscious-design)) calls for R2 lifecycle/retention rules and/or a 720p cap (`TP-D3`) alongside pre-encoding.

| Scale (month 12) | Monthly uploads / viewer-hours | Monthly delivery egress | **Bunny Stream total** *(Volume tiers – NA/EU Std; MENA/Asia Std higher)* | **R2 + Server encode** *(100% server)* | **R2 + Tools local pre-encode** *(100% Tools share, best case)* | **Dual-write trial (both)** |
|---|---|---|---|---|---|---|
| **Small** (today) | 20 h / 2k viewer-h | 1.8 TB | **~$21–$30** ($12 storage + $9–$18 egress) | **~$16** ($6 encode + $9 storage + <$1 ops) | **~$11** | ~$40 |
| **Medium** | 200 h / 50k viewer-h | 45 TB | **~$340–$565** ($115 storage + $225–$450 egress) | **~$147** ($60 encode + $86 storage + ~$1 ops) | **~$93** | ~$490–$710 |
| **Large** | 1,000 h / 500k viewer-h | 450 TB | **~$2,826–$5,076** ($576 storage + $2,250–$4,500 egress) | **~$740** ($300 encode + $430 storage + ~$10 ops) | **~$470** | Not viable |
| **Millions of viewers** | 1,000 h / 2M viewer-h | 1,800 TB | **~$6,676–$18,576+** ($576 storage + **$6,100** Volume tiered egress¹ to **$18,000** NA/EU Std; MENA/Asia Std far higher²) | **~$778** ($300 encode + $430 storage + ~$48 ops³) | **~$508** *(~$313 with universal 720p ladder)* | Not viable |

¹ *Bunny Volume network tiers at 1,800 TB:* `500 TB × $0.005 ($2,500) + 500 TB × $0.004 ($2,000) + 800 TB × $0.002 ($1,600) = $6,100` egress (+ $576 storage ≈ **$6,676/month**).
² *$18,576/month is NOT an upper bound:* `$0.01/GB` is Bunny's Standard rate for Europe and North America only. Because Al Ummah Now serves global Muslim audiences including Asia ($0.03/GB), South America ($0.045/GB), and MENA/Africa ($0.06/GB), a mixed global audience on Standard routing sits well above $18.6K/month at 1,800 TB.
³ *2M viewer-hours R2 Class B reads:* `2M × 72 reads/viewer-h = 144M reads`; `(144M − 10M free) × $0.36/M ≈ $48/month` (replaces the ~$10 ops figure in the Large row rather than stacking on top of it).

**Key takeaway:** Bunny's "free encoding" is vastly outweighed by per-GB egress as viewership grows. At the Standard NA/EU $0.01/GB rate, Bunny delivery alone reaches hundreds of dollars per month by **55k–110k viewer-hours/month**, and climbs into thousands of dollars per month even on Volume tiered pricing (~$6.7K/month at 2M viewer-hours). Moving to R2 + Cloudflare CDN eliminates the bandwidth cliff completely, keeping total monthly spend more than **13×–36× lower** than Bunny at 2M viewer-hours while storage lifecycle rules and pre-encoding keep unit costs low ([O1](../epics/decisions.md#o1-cost-conscious-design)).

---

## 3. Operational and security findings on legacy Bunny code in Tools

Audit of the legacy Bunny code in `AlUmmahNowTools` prior to removal under owner decision **`TP-D4`** ([Tools#64](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/64)):

1. **Historical resilience in `BunnyStorageClient`:** PR #39 (`AlUmmahNow.Data/Storage/BunnyRetry.cs`) properly wrapped the Bunny Storage SDK with `BunnyTransientResponseHandler`, preserved `Retry-After`, applied jittered backoff, and used `LeaveOpenStream` so retried uploads could rewind safely.
2. **Known issues in `BunnyStreamClient` (`AlUmmahNow.Data/Video/BunnyStreamClient.cs`, now removed in [Tools#64](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/64)):**
   - Each call instantiated a new `RestClient` without `using` disposal (socket exhaustion risk under high-volume loops).
   - `GetVideosAsync` interpolated `search` without `Uri.EscapeDataString`.
   - `UploadVideoAsync` sent the whole file in one PUT with no retry or TUS resume.
   - **Resolution (`TP-D4`):** Rather than refactoring dead Bunny code, [Tools#64](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/64) removes `BunnyStreamClient`, `BunnyStorageClient`, `BunnyRetry`, `BunnyVideo`, `AlUmmahNow.BunnyBulkUploader`, `BunnyCDN.Net.Storage`, `RestSharp`, and `VideoImporter.ImportFromBunnyApiAsync` immediately. All active staff imports go through `admin-api` TUS (`AlUmmahNow.ToolsCore`).
3. **Security hygiene:** Removing direct Bunny Storage/Stream code from Tools now (`TP-D4`) and revoking operator Bunny/R2 keys in TA-14 eliminates long-lived privileged storage keys on endpoints and routes every upload through Auth SSO + audited `admin-api` permissions.
4. **Safe retirement sequence:**
   - Run existing library backfill through the videos admin **R2 backfill** page ([AUN-R2-MIGRATION](../epics/AUN-R2-MIGRATION-r2-video-migration.md), [AlUmmahNow#1395](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1395)) — never via ad-hoc Tools scripts.
   - Flip playback priority to R2-first once Delivery QoE comparison confirms parity.
   - Retire legacy Bunny library `400189` (and later `498994`) through the admin page's grace-period removal flow, which preserves CSAM legal holds and never alters "Block Direct Url File Access".
   - Revoke the old Tools operator Bunny/R2 keys immediately after the first production bulk import via `TOOLS-ADMIN` succeeds (TA-14).
