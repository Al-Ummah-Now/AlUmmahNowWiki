[← Home](../README.md) · [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) · [Video delivery](video-delivery.md)

# Tools encoding research findings and cost analysis

| | |
|---|---|
| **Epic** | [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) (`TP-4`) |
| **Applies to** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) (`aun-media`), [AlUmmahNow](../repos/AlUmmahNow.md) (`apps/media`) |
| **Date** | 2026-11-23 |
| **Cost constraint** | Whole platform ≤ $500/month ([O1](../epics/decisions.md#o1-whole-platform-cost-cap)) |
| **Source baseline** | [`AlUmmahNowTools/VIDEO_ENCODING_RESEARCH.md`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/VIDEO_ENCODING_RESEARCH.md) (October 2025) |

## Executive recommendation

1. **Keep the local-first pre-encode + server-verify architecture ([D11](../epics/decisions.md#d11-who-encodes-renditions), `TOOLS-ADMIN` TA-12).** Encoding renditions on the staff computer before upload cuts Cloudflare Containers transcode spend by **80–90%** ($0.005/video-minute down to ~$0.0005–$0.001/video-minute for server verification), which is what keeps Large-scale monthly spend under the **$500/month** cap ($470/month vs. $740/month server-encoded).
2. **Stay on H.264 + AAC in fMP4 HLS (`360p`/`480p`/`720p`/`1080p`, 6 s segments, 2 s GOP, CRF 23, 30 fps cap).** Do not add HEVC (commercial patent-pool exposure) or AV1 (10–100× slower software encode blows container budgets) in v1/v2. Revisit AV1 only if R2 rendition storage exceeds ~15 TB ($225/month) and Apple/TV hardware decode coverage passes 95%.
3. **Keep `aun-media` (Rust in `AlUmmahNowCore`) and `apps/media` (`ladder.mjs`) as the single source of truth.** Do not build a second independent transcoding pipeline on `FFMpegCore` inside `AlUmmahNowTools`. Retire the legacy `FFMpegCore` dependency in Tools once `TOOLS-ADMIN` TA-14 removes direct Bunny/R2 uploads.
4. **Clear small wins to ship now:** add Linux `h264_vaapi` hardware encoder support (named in TA-19) to `AlUmmahNow.ToolsCore/Import/Renditions.cs` alongside existing VideoToolbox, NVENC, QSV, AMF, Media Foundation, and OpenH264 support.
5. **Storage lever for Large scale (owner decision `TP-D3`):** keep 1080p default today; add an opt-in 720p cap ("Lecture mode") for audio-led or static-slide lectures once R2 rendition storage passes 10 TB (~$150/month), cutting rendition storage by ~45% (~$195/month saved at 1,000 h/month).

---

## 1. Audit of the 2025 encoding roadmap (P1–P4)

The October 2025 research report (`VIDEO_ENCODING_RESEARCH.md`) proposed four phases when Tools had no FFmpeg integration and uploaded raw files sequentially to Bunny. Every core capability now exists in the current architecture:

| 2025 Phase | Original proposal | Current state (2026-11-23) | Verdict |
|---|---|---|---|
| **P1: Foundation** | Add `FFMpegCore`, metadata probing, pre-upload validation | **Built.** `FFMpegCore` 5.2.0 added to `AlUmmahNow.Data` and `AlUmmahNow.FileScanService` ([Tools#21](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/21)): `MediaProbe.cs`, `VideoThumbnailService.cs`, `FFmpegManagerService.cs`, `MetadataExtractor.cs`. In `TOOLS-ADMIN`, `AlUmmahNow.ToolsCore/Import/Renditions.cs` (`FfmpegMediaTools.ProbeAsync`) probes directly via `ffprobe` JSON with rotation, frame rate, audio detection, and duration. | **Complete.** Do not duplicate in `FFMpegCore`; prefer `ToolsCore` direct `ffprobe` invocation. |
| **P2: Thumbnails** | Automatic snapshot extraction + upload | **Built.** `VideoThumbnailService.cs`, `ThumbnailShape.cs` ([Tools#40](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/40)), `FileScanService/Services/ThumbnailService.cs`. On the active R2 path, `apps/media` automatically generates `thumb.jpg`, `thumb_640.jpg`, and `preview.webp`, while Tools attaches custom sidecar thumbnails via `AttachStep`. | **Complete.** No further thumbnail pipeline needed in Tools. |
| **P3: Performance** | Parallel uploads with `SemaphoreSlim` + queue | **Built.** `AlUmmahNow.ToolsCore/Import/WorkQueue.cs` ([Tools#50](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/50)): crash-safe disk queue, per-step concurrency (Hash 1–8, Encode 1–4, Upload 1–5, Attach 1–8), pause/resume, backoff retry, and resumable TUS via `TusClient`. | **Complete.** Resolves overlap with `aun-upload` ([Epic 11](../epics/E11-aun-core.md)). |
| **P4: Transcoding & hardware accel** | Format conversion, ABR ladder, GPU acceleration | **Built.** `AlUmmahNow.ToolsCore/Import/Renditions.cs` ([Tools#52](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/52), TA-12) fetches the server's ladder from `GET /api/admin/import/encoding`, decodes once to per-rung MP4s, packages fMP4 HLS via `AlUmmahNowCore` (`HlsPackageMp4`), uploads to staging before the original, and verifies the server's verdict (`CheckStep`). Server fallback runs automatically on any local failure. | **Complete** except Linux `h264_vaapi` (small win) and LGPL FFmpeg bundling (`TOOLS-ADMIN` TA-19). |

---

## 2. Cost analysis: local pre-encoding vs. server encoding

All unit costs come from [`AlUmmahNow/docs/media-delivery/R2-DELIVERY-PLAN.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/R2-DELIVERY-PLAN.md) and `apps/cost-monitor/src/pricing.ts` (Workers Paid list prices, 2026-11):

- **Server transcoding (`apps/media`, Cloudflare Containers `standard-4`, 4 vCPU / 12 GiB RAM):**
  - Speed: ~0.75× real time (~45 container-seconds per video-minute).
  - Rate: ~$0.0001/instance-second (active CPU only; upper bound) → **~$0.005/video-minute** (**$0.30/video-hour**), billed once per upload. Workers Paid includes 375 vCPU-minutes/month.
- **Local-first pre-encoding in Tools (`TA-12`, D11):**
  - Staff computer encodes the ladder ($0 Cloudflare compute) and stages fMP4 HLS segments before the original upload completes.
  - Cloudflare Container runs **verification only** (ladder/codec/segment decode + spot picture/audio checks against the source): ~5–15% of full encode time → **~$0.0005–$0.001/video-minute** (**$0.03–$0.06/video-hour**), an **80–90% reduction** in container spend.
  - Extra staging writes: ~40 R2 Class A writes/video-minute at $4.50/M = **$0.00018/video-minute** (negligible). R2 ingress is **$0**.
- **R2 storage for the 4-rung ladder (`360p`/`480p`/`720p`/`1080p`):**
  - Combined bitrate caps: 0.8 + 1.4 + 2.8 + 5.0 Mbps video + audio ≈ 10.5 Mbps peak; with CRF 23 on lectures, typical stored size is **~40 MB/video-minute** (~2.4 GB/video-hour). Static-slide or talking-head lectures often compress to **15–25 MB/video-minute**.
  - R2 storage rate: **$0.015/GB-month**, egress **$0**.

### Monthly cost comparison (12-month accumulated storage)

| Scale | Uploads / viewer-hours | Server transcode (`apps/media`) | Tools local pre-encode + server verify | R2 storage (12 mo, 1080p ladder) | R2 ops + CDN delivery | **Total (Server encode)** | **Total (Local pre-encode)** | **Savings** |
|---|---|---|---|---|---|---|---|---|
| **Small** (today) | 20 h / 2k viewer-h | $6 | ~$1 | $9 | <$1 | **~$16/mo** | **~$11/mo** | ~$5/mo |
| **Medium** | 200 h / 50k viewer-h | $60 | ~$6 | $86 | ~$1 | **~$147/mo** | **~$93/mo** | ~$54/mo |
| **Large** | 1,000 h / 500k viewer-h | $300 | ~$30 | $430 | ~$10 | **~$740/mo** *(over cap)* | **~$470/mo** *(under cap)* | **~$270/mo** |
| **Large + 720p lecture cap** | 1,000 h / 500k viewer-h | $190 | ~$20 | ~$245 | ~$10 | **~$445/mo** | **~$275/mo** | **~$465/mo vs. baseline** |

**Key takeaway:** At Large scale (1,000 hours uploaded/month), **server-only encoding breaches the $500/month cap** ($740/month). Local-first pre-encoding in Tools brings the exact same workload down to **~$470/month**, and pairing it with an optional 720p cap for audio-led lectures brings it down to **~$275/month**, leaving comfortable headroom for Workers, D1, KV, and captions within the $500/month cap.

---

## 3. Codec evaluation

| Codec | Compression vs. H.264 | Encode speed (CPU) | Playback support (Web / Apple / Android / TV) | Licensing & patent risk | Recommendation |
|---|---|---|---|---|---|
| **H.264 / AVC + AAC (fMP4 HLS)** | Baseline (1.0×) | Fast (`libx264 veryfast` ~0.75× RT on 4 vCPU; 3–8× RT on desktop GPUs) | **100%** (every browser, iOS, macOS, Android, tvOS, Tizen, webOS) | Mature; hardware encoders covered by OS/silicon vendors; OpenH264 binary covered by Cisco's BSD/patent license | **Keep as primary codec.** |
| **H.265 / HEVC** | ~35–45% smaller | 2–4× slower | Partial on web (Safari/Edge only; Chrome/Firefox software decode gaps) | **High risk:** overlapping commercial patent pools (MPEG LA, Access Advance, Velos) | **Do not use.** |
| **VP9** | ~30–35% smaller | 2–5× slower | Poor on Apple/Safari/tvOS HLS pipelines | Royalty-free | **Do not use** (requires dual-encode alongside H.264 for Apple, doubling storage and compute). |
| **AV1** | ~45–55% smaller | **10–100× slower** (SVT-AV1/libaom) | Growing, but older iOS/Android/TV hardware lacks decode | Royalty-free (AOMedia) | **Defer.** Would raise server fallback cost 10×+ ($0.05–$0.15/video-min). Revisit only above 15 TB R2 storage ($225/mo) and >95% fleet hardware decode. |

---

## 4. Hardware acceleration, encoder priority, and TA-19 licensing

In `AlUmmahNow.ToolsCore/Import/Renditions.cs`, `H264Encoders.Preferred` currently selects encoders in this order:

`libx264` → `h264_videotoolbox` (macOS) → `h264_nvenc` (NVIDIA) → `h264_qsv` (Intel) → `h264_amf` (AMD) → `h264_mf` (Windows Media Foundation) → `libopenh264` (software fallback).

Findings:

1. **Missing Linux VAAPI (`h264_vaapi`):** `TOOLS-ADMIN` TA-19 explicitly lists **VAAPI** alongside NVENC for LGPL Linux hardware encoding (covering AMD and Intel GPUs on Linux), but `H264Encoders.Preferred` does not yet include `h264_vaapi`. Adding `h264_vaapi` with proper `-vaapi_device /dev/dri/renderD128` / `format=nv12,hwupload` filter support is a clear small win.
2. **LGPL bundling compatibility (TA-19):** When Tools bundles an **LGPL** FFmpeg build (without GPL `libx264`), `H264Encoders.Pick` automatically skips `libx264` and picks the first available hardware encoder, falling back to Cisco's `libopenh264` (downloaded on first use per Cisco's patent license).
3. **`libx264` vs. hardware-first priority (owner decision `TP-D2`):** Keeping `libx264` first when a staff member already has a system GPL FFmpeg produces bitstreams closest to `apps/media`'s `libx264` verifier (maximizing first-pass acceptance). Switching to hardware-first cuts encode time 3–8× on Apple Silicon / NVIDIA laptops, but should be benchmarked against `apps/media`'s strict keyframe/VBV verifier before changing the default.
4. **Overlap resolved with `AlUmmahNowCore` (`aun-media`, Epic 30):** `ToolsCore` calls `AlUmmahNow.Core.AunCoreMethods.HlsPackageMp4` for fMP4 segmentation rather than writing its own muxer, and reads the exact ladder parameters from `GET /api/admin/import/encoding`. Both Tools and Desktop Studio therefore share one packaging engine and one ladder definition.
