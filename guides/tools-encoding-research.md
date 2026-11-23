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

1. **Keep server-default encoding with optional desktop pre-encode + server verification ([D11](../epics/decisions.md#d11-who-encodes-renditions), `TOOLS-ADMIN` TA-12).** Under D11, web and app creator uploads encode on the server by default, while Tools and Desktop Studio can pre-encode locally before upload. For pre-encoded uploads, local encoding reduces Cloudflare Containers transcode spend by an **assumed 80–90%** ($0.005/video-minute down to an assumed ~$0.0005–$0.001/video-minute for verification, pending measurement in `apps/cost-monitor`). At Large scale (1,000 h/month), month-12 spend is ~$740/month if 100% server-encoded vs. **~$470–$500/month** if 100% pre-encoded (leaving **$0–$30/month** for all other platform services at month 12 — zero headroom at the high end of verification cost — and crossing $500 around month 12–13 as storage keeps growing by ~$36/month), so **R2 lifecycle/retention rules and/or a 720p cap are required for steady-state compliance under O1**.
2. **Stay on H.264 + AAC in fMP4 HLS (`360p`/`480p`/`720p`/`1080p`, 6 s segments, 2 s GOP, CRF 23, 30 fps cap).** Do not add HEVC (commercial patent-pool exposure) or AV1 (10–100× slower software encode blows container budgets) in v1/v2. Revisit AV1 only if R2 rendition storage exceeds ~15 TB ($225/month) and Apple/TV hardware decode coverage passes 95%.
3. **Keep `aun-media` (Rust in `AlUmmahNowCore`) and `apps/media` (`ladder.mjs`) as the single source of truth.** Do not build a second independent transcoding pipeline on `FFMpegCore` inside `AlUmmahNowTools`. Retire the legacy `FFMpegCore` dependency in Tools once `TOOLS-ADMIN` TA-14 removes direct Bunny/R2 uploads.
4. **Adopted Maktaba's encoder policy plus Tools-specific extensions in [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) (owner decision `TP-D2`, decided 2026-11-23):** ports Maktaba's OS-scoped hardware-first policy (VideoToolbox on macOS, NVENC → QSV on Linux/Windows), `check.go:parseCodecs` `------` legend skip, `hwaccel.go` 0.2 s black-frame null test-encode probe (15 s timeout), `channel/config.go` VideoToolbox `-allow_sw 0 -realtime 1` probe flags, `TOOLS_ENCODER` override, and `transcode.go` transient `refusedSession` cooldown + 30 s fallback window; extends it for Tools / TA-19 with Linux `h264_vaapi` (probing `/dev/dri/renderD*`), Windows `h264_amf` and `h264_mf`, per-file candidate-chain fallback down to `libx264` → `libopenh264`, and local pre-upload verification aligned with `apps/media/container/prebuilt.mjs` (`verifyRenditions`).
5. **Storage levers for Large scale (owner decision `TP-D3`, decided 2026-11-23):** keep **1080p** now; add an **admin setting to cap lectures at 720p, off by default**, for use only when R2 rendition storage passes ~10 TB (~$150/month) or total monthly spend nears the $500/month cap (paired with R2 lifecycle/retention rules for steady-state compliance under O1).

---

## 1. Audit of the 2025 encoding roadmap (P1–P4)

The October 2025 research report (`VIDEO_ENCODING_RESEARCH.md`) proposed four phases when Tools had no FFmpeg integration and uploaded raw files sequentially to Bunny. Every core capability now exists in the current architecture:

| 2025 Phase | Original proposal | Current state (2026-11-23) | Verdict |
|---|---|---|---|
| **P1: Foundation** | Add `FFMpegCore`, metadata probing, pre-upload validation | **Built.** `FFMpegCore` 5.2.0 added to `AlUmmahNow.Data` and `AlUmmahNow.FileScanService` ([Tools#21](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/21)): `AlUmmahNow.Data/Video/MediaProbe.cs`, `AlUmmahNow.Data/Video/VideoThumbnailService.cs`, `AlUmmahNow.Data/Services/FFmpegManagerService.cs`, and `AlUmmahNow.FileScanService/Services/MetadataExtractor.cs`. In `TOOLS-ADMIN`, `AlUmmahNow.ToolsCore/Import/Renditions.cs` (`FfmpegMediaTools.ProbeAsync`) probes directly via `ffprobe` JSON with rotation, frame rate, audio detection, and duration. | **Complete.** Do not duplicate in `FFMpegCore`; prefer `ToolsCore` direct `ffprobe` invocation. |
| **P2: Thumbnails** | Automatic snapshot extraction + upload | **Built.** `AlUmmahNow.Data/Video/VideoThumbnailService.cs`, `ThumbnailShape.cs` ([Tools#40](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/40)), `FileScanService/Services/ThumbnailService.cs`. On the active R2 path, `apps/media` automatically generates `thumb.jpg`, `thumb_640.jpg`, and `preview.webp`, while Tools attaches custom sidecar thumbnails via `AttachStep`. | **Complete.** No further thumbnail pipeline needed in Tools. |
| **P3: Performance** | Parallel uploads with `SemaphoreSlim` + queue | **Built.** `AlUmmahNow.ToolsCore/Import/WorkQueue.cs` ([Tools#50](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/50)): crash-safe disk queue, per-step concurrency (Hash 1–8, Encode 1–4, Upload 1–5, Attach 1–8), pause/resume, backoff retry, and resumable TUS via `TusClient`. | **Complete.** Resolves overlap with `aun-upload` ([Epic 11](../epics/E11-aun-core.md)). |
| **P4: Transcoding & hardware accel** | Format conversion, ABR ladder, GPU acceleration | **Built.** `AlUmmahNow.ToolsCore/Import/Renditions.cs` ([Tools#52](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/52), TA-12) fetches the server's ladder from `GET /api/admin/import/encoding`, decodes once to per-rung MP4s, packages fMP4 HLS via `AlUmmahNowCore` (`HlsPackageMp4`), uploads to staging before the original, and verifies the server's verdict (`CheckStep`). Server fallback runs automatically on any local failure. Maktaba's hardware-first encoder policy, Linux `h264_vaapi`, 0.2 s test-encode probing, `refusedSession` handling, runtime fallback, and local `ffprobe` output verification added in [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) (`TP-D2`). | **Complete** except LGPL FFmpeg bundling (`TOOLS-ADMIN` TA-19). |

---

## 2. Cost analysis: local pre-encoding vs. server encoding

Unit prices verified against public Cloudflare pages (retrieved **2026-11-23**: [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/), [Cloudflare Containers pricing](https://developers.cloudflare.com/containers/pricing/)) and [`AlUmmahNow/docs/media-delivery/R2-DELIVERY-PLAN.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/media-delivery/R2-DELIVERY-PLAN.md) / `apps/cost-monitor/src/pricing.ts`:

- **Server transcoding (`apps/media`, Cloudflare Containers `standard-4`, 4 vCPU / 12 GiB RAM):**
  - Speed: ~0.75× real time (~45 container-seconds per video-minute).
  - Rate: $0.000020/vCPU-s + $0.0000025/GiB-s + $0.00000007/GB-s ≈ **$0.000111/instance-second** (active CPU only) → **~$0.005/video-minute** (**$0.30/video-hour**), billed once per upload. Workers Paid includes 375 vCPU-minutes/month.
  - **Container egress note (to verify in billing):** Cloudflare Containers lists outbound network egress at $0.025/GB in NA/EU after 1 TB included/month. At Large scale (~2.4 TB/month of rendition output), if traffic from the container through Worker outbound handlers to R2 is billed as container egress rather than free Worker-intercepted traffic, that adds **~$35/month**. Confirm in `apps/cost-monitor` once Large-scale container traffic runs.
- **Optional local pre-encoding in Tools / Studio (`TA-12`, D11):**
  - Staff computer encodes the ladder ($0 Cloudflare compute) and stages fMP4 HLS segments before the original upload completes.
  - **Verification cost (unmeasured assumption):** Cloudflare Container runs TA-12 verification (decoding every segment of every rung plus spot picture/audio checks against the source). The table below assumes **10–20% of full encode time** → **~$0.0005–$0.001/video-minute** (**$0.03–$0.06/video-hour**; **$30–$60/month** at 1,000 h/month), an 80–90% reduction vs. full server transcode. **This figure is unmeasured until `apps/cost-monitor` records real TA-12 verification container-seconds.** Note also that any local encode that fails verification (for example, a hardware encoder violating VBV or keyframe bounds) incurs **both** verification cost and a full server re-encode (`~$0.0055–$0.006/video-min`).
  - Extra staging writes: ~40 R2 Class A writes/video-minute at $4.50/M = **$0.00018/video-minute** (negligible). R2 ingress is **$0**.
- **R2 storage & operations for the 4-rung ladder (`360p`/`480p`/`720p`/`1080p`):**
  - Combined bitrate caps: 0.8 + 1.4 + 2.8 + 5.0 Mbps video + audio ≈ 10.5 Mbps peak; with CRF 23 on lectures, typical stored size is **~40 MB/video-minute** (~2.4 GB/video-hour). Static-slide or talking-head lectures often compress to **15–25 MB/video-minute**.
  - R2 storage rate: **$0.015/GB-month**, egress **$0**.
  - **Cache-hit assumption for R2 Class B reads ($0.36/M after 10M free):** following `R2-DELIVERY-PLAN.md`, ~72 R2 Class B reads per viewer-hour reach origin after Cloudflare CDN caching (~36M reads at 500k viewer-hours → **~$10/month**).

### Monthly cost comparison (**month-12 accumulated library snapshot**)

> **Important:** The storage column reflects a **12-month library snapshot**, not steady state. At Large scale (1,000 h/month), R2 storage continues growing by **~$36/month** (`1,000 h × 2.4 GB × $0.015`) every month after month 12 — reaching $500/month already at month 12 at the high end of verification cost ($60/month) and crossing $500 around month 13 even at the low end ($30/month, ~$506/month before counting other platform services), reaching ~$650–$680+/month by month 18 unless retention/lifecycle rules or bitrate caps are applied.

| Scale (at month 12) | Uploads / viewer-hours | Server transcode (`apps/media`) | Local pre-encode + server verify *(100% Tools/Studio share, 10–20% verify range)* | R2 storage (month 12) | R2 ops + CDN delivery | **Total (100% Server encode)** | **Total (100% Local pre-encode)** | **Savings vs. server** |
|---|---|---|---|---|---|---|---|---|
| **Small** (today) | 20 h / 2k viewer-h | $6 | ~$0.60–$1.20 | $9 | <$1 | **~$16/mo** | **~$10–$11/mo** | ~$5/mo |
| **Medium** | 200 h / 50k viewer-h | $60 | ~$6–$12 | $86 | ~$1 | **~$147/mo** | **~$93–$99/mo** | ~$48–$54/mo |
| **Large (1080p)** | 1,000 h / 500k viewer-h | $300 | ~$30–$60 | $430 | ~$10 | **~$740/mo** *(over cap)* | **~$470–$500/mo** *($0–$30 headroom; zero headroom at high end)* | ~$240–$270/mo |
| **Large (universal 720p cap, 100% of uploads)** | 1,000 h / 500k viewer-h | $190 | ~$20–$38 | ~$245 | ~$10 | **~$445/mo** | **~$275–$293/mo** *(~$207–$225 headroom at mo 12)* | ~$152–$170/mo vs. 720p server; ~$447–$465/mo vs. 1080p server |

### Sensitivity to Tools/Studio pre-encode share at Large scale (month 12, 1080p)

Because D11 keeps **server encoding as the default** for web/app creator uploads, actual Large-scale spend depends on both the fraction of the 1,000 h/month arriving pre-encoded from Tools or Desktop Studio and where actual verification cost lands within the 10–20% range ($30–$60/month at 100% share):

| Pre-encoded share (Tools / Studio) | Container encode + verify *(low–high)* | R2 storage (month 12) | R2 ops | **Month-12 total** |
|---|---|---|---|---|
| **0%** (all web/app server-encoded) | $300 | $430 | ~$10 | **~$740/mo** |
| **25%** | ~$233–$240 | $430 | ~$10 | **~$673–$680/mo** |
| **50%** | ~$165–$180 | $430 | ~$10 | **~$605–$620/mo** |
| **75%** | ~$98–$120 | $430 | ~$10 | **~$538–$560/mo** |
| **100%** (best case, all Tools/Studio) | ~$30–$60 | $430 | ~$10 | **~$470–$500/mo** |

**Key takeaways for the $500/month whole-platform cap (O1):**
1. **Local pre-encoding alone is necessary but not sufficient at Large scale.** Even at 100% pre-encode share, month-12 storage ($430) plus verification ($30–$60) and R2 ops ($10) totals **$470–$500/month** — leaving **no headroom at the high end** (and at most $30/month at the low end) for Workers, D1, KV, captions, and live, and growing ~$36/month thereafter.
2. **Steady-state compliance requires storage levers:**
   - **R2 lifecycle / retention rules** (from `R2-DELIVERY-PLAN.md`): prune or down-tier cold 1080p rungs on older low-view videos (keeping 360p/480p/720p playable, or capping active 1080p storage at ~15–20 TB).
   - **720p cap (`TP-D3`):** a universal 720p cap across 100% of uploads drops month-12 storage from ~$430 to ~$245 (cutting monthly growth from ~$36/mo to ~$20/mo). An opt-in cap limited to audio-led/static-slide lectures saves proportionally to their share of uploads (e.g., 50% lectures saves ~$95–$100/month at month 12).

---

## 3. Codec evaluation

| Codec | Compression vs. H.264 | Encode speed (CPU) | Playback support (Web / Apple / Android / TV) | Licensing & patent risk | Recommendation |
|---|---|---|---|---|---|
| **H.264 / AVC + AAC (fMP4 HLS)** | Baseline (1.0×) | Fast (`libx264 veryfast` ~0.75× RT on 4 vCPU; 3–8× RT on desktop GPUs) | **100%** (every browser, iOS, macOS, Android, tvOS, Tizen, webOS) | Mature; hardware encoders covered by OS/silicon vendors; OpenH264 binary covered by Cisco's BSD/patent license | **Keep as primary codec.** |
| **H.265 / HEVC** | ~35–45% smaller | 2–4× slower | Partial on web (Safari/Edge only; Chrome/Firefox software decode gaps) | **High risk:** overlapping commercial patent pools (MPEG LA, Access Advance, Velos) | **Do not use.** |
| **VP9** | ~30–35% smaller | 2–5× slower | Poor on Apple/Safari/tvOS HLS pipelines | Royalty-free | **Do not use** (requires dual-encode alongside H.264 for Apple, doubling storage and compute). |
| **AV1** | ~45–55% smaller | **10–100× slower** (SVT-AV1/libaom) | Growing, but older iOS/Android/TV hardware lacks decode | Royalty-free (AOMedia) | **Defer.** Would raise server fallback cost 10×+ ($0.05–$0.15/video-min). Revisit only above 15 TB R2 storage ($225/mo) and >95% fleet hardware decode. |

---

## 4. Hardware acceleration, Maktaba encoder policy (`TP-D2`), and TA-19 licensing

Under owner decision **`TP-D2`** (decided 2026-11-23), `AlUmmahNow.ToolsCore/Import/Renditions.cs` adopts the sibling **Maktaba** repository's encoder policy (`streaming/internal/ffmpeg/hwaccel.go`, `streaming/internal/ffmpeg/transcode.go`, `streaming/internal/channel/config.go`, `streaming/internal/cluster/capability.go`, and `cmd/maktaba-server/internal/ffmpeg/check.go`), plus Tools-specific extensions for LGPL bundling (TA-19) and server prebuilt verification parity (`apps/media/container/prebuilt.mjs`).

### Maktaba vs. Tools encoder policy comparison

| Policy area | Maktaba (reference implementation) | Tools before [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) | Tools after [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) (`TP-D2`) |
|---|---|---|---|
| **Encoder priority** | **OS-scoped hardware-first (`hwaccel.go`):** macOS `h264_videotoolbox` → `libx264`; Linux & Windows `h264_nvenc` → `h264_qsv` → `libx264` (`channel/config.go` checks NVENC → software; `h264_vaapi`, `h264_amf`, and `h264_mf` appear only in report-only `check.go:57`) | Single cross-OS list with **`libx264` first**, no `h264_vaapi`, then VideoToolbox → NVENC → QSV → AMF → MF → `libopenh264` | **Ported from Maktaba:** macOS VideoToolbox and Linux/Windows NVENC → QSV ahead of `libx264`. **Tools extension (TA-19):** adds Linux `h264_vaapi` after QSV, Windows `h264_amf` → `h264_mf` after QSV, and `libopenh264` last for LGPL builds |
| **Capability parsing** | `cmd/maktaba-server/internal/ffmpeg/check.go:parseCodecs` skips legend/header lines before `------` (`hwaccel.go:listEncoders` does not skip legend lines) | Scanned every line containing a `V.....` token | Ports `check.go:parseCodecs`: skips all lines before `------` before parsing encoder names (`ParseVideoEncoders`) |
| **Hardware probing** | `hwaccel.go:encodes` runs a 0.2 s black-frame null encode (`color=c=black:s=256x144:r=25:d=0.2` → `-f null -`, 15 s timeout) and returns `(ok, busy)`; `channel/config.go` and `cluster/capability.go` add `-allow_sw 0 -realtime 1` for VideoToolbox | Trusted `ffmpeg -encoders` listing alone (no real probe) | **Ported from Maktaba:** 0.2 s black-frame null probe (15 s timeout, distinguishing busy vs. unsupported) and `-allow_sw 0 -realtime 1` on the VideoToolbox probe. **Tools extension:** scans `/dev/dri/renderD*` nodes for Linux VAAPI |
| **Override knob** | `MAKTABA_HWACCEL_PREFER` (`auto` / `software` / explicit encoder name) | None | `TOOLS_ENCODER` env var (`auto`, `software`/`off`/`none`/`cpu`/`libx264`, or an explicit encoder name; documented in `docs/RELEASE.md`) |
| **Transient busy vs. permanent failure** | `transcode.go:refusedSession` detects NVENC session limits (`openencodesessionex failed` without `unsupported device`) and falls back without permanently blacklisting the GPU; only runs failing within `fallbackWindow` (30 s) fall back to software (`transcode.go:345-349, 631-640`) | No runtime fallback; any failure aborted local encode and fell back to server | **Ported from Maktaba:** `FfmpegMediaTools` puts refused/busy encoders into a 30 s cooldown without blacklisting or permanently caching software fallback; source/disk errors and failures past the 30 s window do not blacklist the GPU. **Tools extension:** per-file candidate-chain fallback down to `libx264` → `libopenh264`, committing permanent blacklisting only after a subsequent encoder succeeds on the same input |
| **Output verification** | `transcode.go` has **no** per-encode output verification (`api/internal/tvchange/streamverify.go` verifies staged TV slots for cadence/conformity, a separate feature) | Relied solely on server-side TA-12 verification after upload | **Tools extension (aligned with `prebuilt.mjs:verifyRenditions`):** verifies encoded MP4s (`h264`, `yuv420p`, exact dimensions, stereo `aac` or no audio on silent sources, duration within 1 s / 1% slack, keyframe gaps ≤ `GOP×2+0.05`) and packaged HLS segments (segment length ≤ `SegmentSeconds+1`, peak segment bitrate ≤ `(maxrate+audio)×1.5`) before staging; server-side decoded pixel/audio content matching still runs on upload |
| **Linux FFmpeg install hints** | Distro-aware commands from `/etc/os-release` (`apt`, `pacman`, Fedora RPM Fusion, RHEL/Alma/Rocky EPEL+CRB+RPM Fusion, openSUSE Packman) | Generic "FFmpeg not found" | Documented below for `TOOLS-ADMIN` TA-19 when Linux users rely on system FFmpeg |

Findings:

1. **OS-scoped hardware-first + Tools extensions (VAAPI/AMF/MF, render-node walk, local verification):** `H264Encoders.PreferredForPlatform` follows Maktaba's OS-scoped hardware-first ordering and extends it for desktop AMD/Intel/Windows hardware under TA-19:
   - **macOS:** `h264_videotoolbox` → `libx264` → `libopenh264`
   - **Linux:** `h264_nvenc` → `h264_qsv` → `h264_vaapi` *(Tools extension)* → `libx264` → `libopenh264`
   - **Windows:** `h264_nvenc` → `h264_qsv` → `h264_amf` → `h264_mf` *(Tools extensions)* → `libx264` → `libopenh264`
   Tools-specific extensions in [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) probe every `/dev/dri/renderD*` node (covering dual-GPU Linux machines where the VAAPI-capable iGPU sits on `renderD129` rather than `renderD128`) and run local structural/keyframe/bitrate verification matching `apps/media/container/prebuilt.mjs` (`verifyRenditions`) before staging. This catches bad codec/pixel-format/audio/keyframe/VBV hardware outputs locally before wasting upload bandwidth, while server-side decoded pixel and audio-envelope correlation (`contentMatches`) remains the final gate on upload (and real hardware encodes through the staging verifier remain the proof of end-to-end parity).
2. **LGPL bundling compatibility (TA-19) & Linux distro hints:** When Tools bundles an **LGPL** FFmpeg build (without GPL `libx264`), `H264Encoders` probes the OS hardware encoders first and falls back to Cisco's `libopenh264` (downloaded on first use per Cisco's patent license). For Linux users installing system FFmpeg (before or alongside TA-19 bundling), follow Maktaba's `/etc/os-release` hints (`cmd/maktaba-server/internal/ffmpeg/install.go`): Debian/Ubuntu `sudo apt install ffmpeg`, Arch `sudo pacman -S --needed ffmpeg`, Fedora RPM Fusion (`rpmfusion-free-release` + `dnf install --allowerasing ffmpeg`, since Fedora's `ffmpeg-free` omits H.264), RHEL/Alma/Rocky EPEL + CRB + RPM Fusion, and openSUSE Packman.
3. **Overlap resolved with `AlUmmahNowCore` (`aun-media`, Epic 30):** `ToolsCore` calls `AlUmmahNow.Core.AunCoreMethods.HlsPackageMp4` for fMP4 segmentation rather than writing its own muxer, and reads the exact ladder parameters from `GET /api/admin/import/encoding`. Both Tools and Desktop Studio therefore share one packaging engine and one ladder definition.
