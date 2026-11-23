[← Home](../README.md) · [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) · [Video delivery](video-delivery.md)

# Tools encoding research findings and cost analysis

| | |
|---|---|
| **Epic** | [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) (`TP-4`) |
| **Applies to** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) (`aun-media`), [AlUmmahNow](../repos/AlUmmahNow.md) (`apps/media`) |
| **Date** | 2026-11-23 |
| **Source baseline** | [`AlUmmahNowTools/VIDEO_ENCODING_RESEARCH.md`](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/master/VIDEO_ENCODING_RESEARCH.md) (October 2025) |

## Executive recommendation

1. **Keep server-default encoding with optional desktop pre-encode + server verification ([D11](../epics/decisions.md#d11-who-encodes-renditions), `TOOLS-ADMIN` TA-12).** Under D11, web and app creator uploads encode on the server by default, while Tools and Desktop Studio can pre-encode locally before upload. For pre-encoded uploads, local encoding reduces Cloudflare Containers transcode spend by an **assumed 80–90%** ($0.005/video-minute down to an **unmeasured, assumed** ~$0.0005–$0.001/video-minute for verification, pending real container-seconds telemetry in `apps/cost-monitor`). At Large scale (1,000 h/month), month-12 total spend is ~$740/month if 100% server-encoded vs. **~$470–$500/month** if 100% pre-encoded (saving ~$240–$270/month in compute). Past month 12, R2 storage grows by **~$36/month**, so **R2 lifecycle/retention rules and/or the off-by-default 720p lecture setting (`TP-D3`) are the primary long-term storage levers**.
2. **Stay on H.264 + AAC in fMP4 HLS (`360p`/`480p`/`720p`/`1080p`, 6 s segments, 2 s GOP, CRF 23, 30 fps max).** Do not add HEVC (commercial patent-pool exposure) or AV1 (10–100× slower software encode drives compute cost) in v1/v2. Revisit AV1 only if R2 rendition storage exceeds ~15 TB ($225/month) and Apple/TV hardware decode coverage passes 95%.
3. **Keep `aun-media` (Rust in `AlUmmahNowCore`) and `apps/media` (`ladder.mjs`) as the single source of truth.** Do not build a second independent transcoding pipeline on `FFMpegCore` inside `AlUmmahNowTools`. Retire the legacy `FFMpegCore` dependency in Tools once remaining legacy direct R2 uploads and `FileScanService` are retired (legacy Bunny clients were removed under `TP-D4` in [Tools#64](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/64)).
4. **Adopt Maktaba's encoder policy plus Tools-specific extensions in [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) (open; owner decision `TP-D2`, decided 2026-11-23):** ports Maktaba (`origin/main`) OS-scoped hardware-first priority (macOS VideoToolbox; Linux NVENC → QSV → VA-API with `/dev/dri/renderD*` probing; Windows NVENC → QSV), `check.go:parseCodecs` `------` legend skip, `hwaccel.go` 0.2 s black-frame null test-encode probe (15 s timeout), `channel/config.go` & `cluster/capability.go` VideoToolbox `-allow_sw 0 -realtime 1` probe flags, and transient `refusedSession` 30 s pause (`channel/nvenc.go:nvencRefusedPause` + `transcode.go:refusedSession`) + 30 s `fallbackWindow` (`transcode.go`); extends it for Tools / TA-19 with `TOOLS_ENCODER` override, Windows `h264_amf` and `h264_mf`, LGPL `libopenh264` fallback, per-file candidate-chain retry, and local pre-upload verification aligned with `apps/media/container/prebuilt.mjs` (`verifyRenditions`).
5. **Storage levers for Large scale (owner decision `TP-D3`, decided 2026-11-23):** keep **1080p** now; add an **admin setting to limit lectures to 720p, off by default**, for use only when R2 rendition storage passes ~10 TB (~$150/month), alongside R2 lifecycle/retention rules for long-term storage growth.

---

## 1. Audit of the 2025 encoding roadmap (P1–P4)

The October 2025 research report (`VIDEO_ENCODING_RESEARCH.md`) proposed four phases when Tools had no FFmpeg integration and uploaded raw files sequentially to Bunny. Every core capability now exists in the current architecture:

| 2025 Phase | Original proposal | Current state (2026-11-23) | Verdict |
|---|---|---|---|
| **P1: Foundation** | Add `FFMpegCore`, metadata probing, pre-upload validation | **Built.** `FFMpegCore` 5.2.0 added to `AlUmmahNow.Data` and `AlUmmahNow.FileScanService` ([Tools#21](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/21)): `AlUmmahNow.Data/Video/MediaProbe.cs`, `AlUmmahNow.Data/Video/VideoThumbnailService.cs`, `AlUmmahNow.Data/Services/FFmpegManagerService.cs`, and `AlUmmahNow.FileScanService/Services/MetadataExtractor.cs`. In `TOOLS-ADMIN`, `AlUmmahNow.ToolsCore/Import/Renditions.cs` (`FfmpegMediaTools.ProbeAsync`) probes directly via `ffprobe` JSON with rotation, frame rate, audio detection, and duration. | **Complete.** Do not duplicate in `FFMpegCore`; prefer `ToolsCore` direct `ffprobe` invocation. |
| **P2: Thumbnails** | Automatic snapshot extraction + upload | **Built.** `AlUmmahNow.Data/Video/VideoThumbnailService.cs`, `ThumbnailShape.cs` ([Tools#40](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/40)), `FileScanService/Services/ThumbnailService.cs`. On the active R2 path, `apps/media` automatically generates `thumb.jpg`, `thumb_640.jpg`, and `preview.webp`, while Tools attaches custom sidecar thumbnails via `AttachStep`. | **Complete.** No further thumbnail pipeline needed in Tools. |
| **P3: Performance** | Parallel uploads with `SemaphoreSlim` + queue | **Built.** `AlUmmahNow.ToolsCore/Import/WorkQueue.cs` ([Tools#50](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/50)): crash-safe disk queue, per-step concurrency (Hash 1–8, Encode 1–4, Upload 1–5, Attach 1–8), pause/resume, backoff retry, and resumable TUS via `TusClient`. | **Complete.** Resolves overlap with `aun-upload` ([Epic 11](../epics/E11-aun-core.md)). |
| **P4: Transcoding & hardware accel** | Format conversion, ABR ladder, GPU acceleration | **Built (base) + PR #60 open.** `AlUmmahNow.ToolsCore/Import/Renditions.cs` ([Tools#52](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/52), TA-12) fetches the server's ladder from `GET /api/admin/import/encoding`, decodes once to per-rung MP4s, packages fMP4 HLS via `AlUmmahNowCore` (`HlsPackageMp4`), uploads to staging before the original, and verifies the server's verdict (`CheckStep`). Server fallback runs automatically on any local failure. Maktaba's hardware-first encoder policy (including Linux `h264_vaapi` + `/dev/dri/renderD*` probing, 0.2 s test-encode probing, `refusedSession` 30 s cooldown, 30 s fallback window) plus Windows AMF/MF, `libopenh264`, per-file retry, and `prebuilt.mjs`-aligned local verification are implemented in [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) (open, `TP-D2`). | **Base complete;** `TP-D2` encoder policy in open [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60); LGPL FFmpeg bundling remains in `TOOLS-ADMIN` TA-19. |

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

> **Important:** The storage column reflects a **12-month library snapshot**, not steady state. At Large scale (1,000 h/month), R2 storage continues growing by **~$36/month** (`1,000 h × 2.4 GB × $0.015`) every month after month 12 — bringing total monthly spend from ~$470–$500/month at month 12 to **~$690–$720+/month** by month 18 (~$648 storage + $40–$70 verification and ops) unless retention/lifecycle rules or resolution/bitrate limits are applied.

| Scale (at month 12) | Uploads / viewer-hours | Server transcode (`apps/media`) | Local pre-encode + server verify *(100% Tools/Studio share, 10–20% verify range)* | R2 storage (month 12) | R2 ops + CDN delivery | **Total (100% Server encode)** | **Total (100% Local pre-encode)** | **Savings vs. server** |
|---|---|---|---|---|---|---|---|---|
| **Small** (today) | 20 h / 2k viewer-h | $6 | ~$0.60–$1.20 | $9 | <$1 | **~$16/mo** | **~$10–$11/mo** | ~$5/mo |
| **Medium** | 200 h / 50k viewer-h | $60 | ~$6–$12 | $86 | ~$1 | **~$147/mo** | **~$93–$99/mo** | ~$48–$54/mo |
| **Large (1080p)** | 1,000 h / 500k viewer-h | $300 | ~$30–$60 | $430 | ~$10 | **~$740/mo** | **~$470–$500/mo** | ~$240–$270/mo |
| **Large (universal 720p limit, 100% of uploads)** | 1,000 h / 500k viewer-h | $190 | ~$20–$38 | ~$245 | ~$10 | **~$445/mo** | **~$275–$293/mo** | ~$152–$170/mo vs. 720p server; ~$447–$465/mo vs. 1080p server |

### Sensitivity to Tools/Studio pre-encode share at Large scale (month 12, 1080p)

Because D11 keeps **server encoding as the default** for web/app creator uploads, actual Large-scale spend depends on both the fraction of the 1,000 h/month arriving pre-encoded from Tools or Desktop Studio and where actual verification cost lands within the 10–20% range ($30–$60/month at 100% share):

| Pre-encoded share (Tools / Studio) | Container encode + verify *(low–high)* | R2 storage (month 12) | R2 ops | **Month-12 total** |
|---|---|---|---|---|
| **0%** (all web/app server-encoded) | $300 | $430 | ~$10 | **~$740/mo** |
| **25%** | ~$233–$240 | $430 | ~$10 | **~$673–$680/mo** |
| **50%** | ~$165–$180 | $430 | ~$10 | **~$605–$620/mo** |
| **75%** | ~$98–$120 | $430 | ~$10 | **~$538–$560/mo** |
| **100%** (all Tools/Studio) | ~$30–$60 | $430 | ~$10 | **~$470–$500/mo** |

**What drives cost at Large scale:**
1. **Accumulated R2 storage dominates past month 12.** At 1,000 h/month, month-12 storage alone is ~$430/month (growing by ~$36/month thereafter), whereas local pre-encoding reduces monthly compute from $300/month to an assumed ~$30–$60/month.
2. **Primary storage levers:**
   - **R2 lifecycle / retention rules** (from `R2-DELIVERY-PLAN.md`): prune or down-tier cold 1080p rungs on older low-view videos (keeping 360p/480p/720p playable, or bounding active 1080p storage at ~15–20 TB).
   - **720p lecture setting (`TP-D3`):** limiting 100% of uploads to 720p drops month-12 storage from ~$430 to ~$245 (cutting monthly growth from ~$36/mo to ~$20/mo). An opt-in limit applied only to audio-led/static-slide lectures saves proportionally to their share of uploads (e.g., 50% lectures saves ~$95–$100/month at month 12).

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

Under owner decision **`TP-D2`** (decided 2026-11-23), `AlUmmahNow.ToolsCore/Import/Renditions.cs` ([Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60), open) adopts the sibling **Maktaba** repository's current encoder policy (`origin/main`, verified at `8264ee568`: `streaming/internal/ffmpeg/hwaccel.go`, `vaapi.go`, `vaapi_unix.go`, `transcode.go`, `streaming/internal/channel/config.go`, `streaming/internal/cluster/capability.go`, and `cmd/maktaba-server/internal/ffmpeg/check.go`), plus Tools-specific extensions for Windows AMD/Media Foundation, LGPL bundling (TA-19), and server prebuilt verification parity (`apps/media/container/prebuilt.mjs`).

### Maktaba vs. Tools encoder policy comparison

| Policy area | Maktaba (`origin/main` reference implementation) | Tools before [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) | Tools in [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) (open, `TP-D2`) |
|---|---|---|---|
| **Encoder priority** | **OS-scoped hardware-first (`hwaccel.go`):** macOS `h264_videotoolbox` → `libx264`; Linux `h264_nvenc` → `h264_qsv` → `h264_vaapi` → `libx264` (with `PreferVAAPI` putting VA-API ahead of QSV on NAS/containers, story 59.05); Windows `h264_nvenc` → `h264_qsv` → `libx264` (`check.go` also reports `h264_amf` and `h264_mf` in its report-only `HWEncoders` list) | Single cross-OS list with **`libx264` first**, no `h264_vaapi`, then VideoToolbox → NVENC → QSV → AMF → MF → `libopenh264` | **Ported from Maktaba:** macOS VideoToolbox, Linux NVENC → QSV → VA-API, and Windows NVENC → QSV ahead of `libx264`. **Tools extension (TA-19):** adds Windows `h264_amf` → `h264_mf` after QSV, and `libopenh264` last for LGPL builds |
| **Capability parsing** | `cmd/maktaba-server/internal/ffmpeg/check.go:parseCodecs` skips legend/header lines before `------` (`hwaccel.go:listEncoders` does not skip legend lines) | Scanned every line containing a `V.....` token | Ports `check.go:parseCodecs`: skips all lines before `------` before parsing encoder names (`ParseVideoEncoders`) |
| **Hardware probing** | `hwaccel.go:encodes` runs a 0.2 s black-frame null encode (`color=c=black:s=256x144:r=25:d=0.2` → `-f null -`, 15 s timeout) returning `(ok, busy)`; `channel/config.go` and `cluster/capability.go` add `-allow_sw 0 -realtime 1` for VideoToolbox; `vaapi.go` / `vaapi_unix.go` globs `/dev/dri/renderD*`, checks permissions + optional `vainfo` (falling back to test encode alone when `vainfo` is absent), and runs a VA-API test encode with `-vaapi_device … format=nv12,hwupload -c:v h264_vaapi` | Trusted `ffmpeg -encoders` listing alone (no real probe) | **Ported from Maktaba:** 0.2 s black-frame null probe (15 s timeout, distinguishing busy vs. unsupported), `-allow_sw 0 -realtime 1` on the VideoToolbox probe, and `/dev/dri/renderD*` probing with `format=nv12,hwupload` for Linux VA-API (relying directly on the ffmpeg test encode, as Maktaba does when `vainfo` is absent) |
| **Override knob** | `MAKTABA_HWACCEL_PREFER` (`auto`, `software`/`off`/`none`/`libx264`, `nvenc`, `qsv`, `vaapi`, `videotoolbox`) | None | `TOOLS_ENCODER` env var (`auto`, `software`/`off`/`none`/`cpu`/`libx264`, or an explicit encoder name including `vaapi`/`amf`/`mf`/`openh264`; documented in `docs/RELEASE.md`) |
| **Transient busy vs. permanent failure** | `transcode.go:refusedSession` detects NVENC session limits (`openencodesessionex failed` without `unsupported device`) and pauses the NVENC gate for 30 s (`channel/nvenc.go:nvencRefusedPause`) without permanently blacklisting the GPU; only runs failing within `fallbackWindow` (30 s, `transcode.go`) fall back to software | No runtime fallback; any failure aborted local encode and fell back to server | **Ported from Maktaba:** `FfmpegMediaTools` (synchronized across concurrent encodes) puts refused/busy encoders into a 30 s cooldown without blacklisting or permanently caching software fallback; source/disk errors and failures past the 30 s `FallbackWindow` do not blacklist the GPU. **Tools extension:** per-file candidate-chain fallback down to `libx264` → `libopenh264`, committing permanent blacklisting only after a subsequent encoder succeeds on the same input |
| **Output verification** | `transcode.go` has **no** per-encode output verification (`api/internal/tvchange/streamverify.go` verifies staged TV slots for cadence/conformity, a separate feature) | Relied solely on server-side TA-12 verification after upload | **Tools extension (aligned with `prebuilt.mjs:verifyRenditions`):** verifies encoded MP4s (`h264`, `yuv420p`, exact dimensions, stereo `aac` or no audio on silent sources, duration within 1 s / 1% slack, keyframe gaps ≤ `GOP×2+0.05`) and packaged HLS segments (segment length ≤ `SegmentSeconds+1`, peak segment bitrate ≤ `(maxrate+audio)×1.5`) before staging; server-side decoded pixel/audio content matching still runs on upload |
| **Linux FFmpeg install hints** | Distro-aware commands from `/etc/os-release` (`apt`, `pacman`, Fedora RPM Fusion, RHEL/Alma/Rocky EPEL+CRB+RPM Fusion, openSUSE Packman) | Generic "FFmpeg not found" | Documented below for `TOOLS-ADMIN` TA-19 when Linux users rely on system FFmpeg |

Findings:

1. **OS-scoped hardware-first (Maktaba policy + Tools extensions):** `H264Encoders.PreferredForPlatform` matches Maktaba `origin/main` on macOS and Linux, and extends Windows/LGPL coverage for Tools under TA-19:
   - **macOS (Maktaba):** `h264_videotoolbox` → `libx264` → `libopenh264` *(LGPL fallback)*
   - **Linux (Maktaba):** `h264_nvenc` → `h264_qsv` → `h264_vaapi` → `libx264` → `libopenh264` *(LGPL fallback)*
   - **Windows (Maktaba + Tools extensions):** `h264_nvenc` → `h264_qsv` → `h264_amf` → `h264_mf` *(Tools extensions)* → `libx264` → `libopenh264` *(LGPL fallback)*
   Probing every `/dev/dri/renderD*` node (ported from Maktaba `vaapi.go`) covers dual-GPU Linux machines where the VAAPI-capable iGPU sits on `renderD129` rather than `renderD128`. As a Tools extension in [Tools#60](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/60) (open), local structural/keyframe/bitrate verification aligned with `apps/media/container/prebuilt.mjs` (`verifyRenditions`) runs before staging, catching bad codec/pixel-format/audio/keyframe/VBV hardware outputs locally before wasting upload bandwidth, while server-side decoded pixel and audio-envelope correlation (`contentMatches`) remains the final gate on upload (and real hardware encodes through the staging verifier remain the proof of end-to-end parity).
2. **LGPL bundling compatibility (TA-19) & Linux distro hints:** When Tools bundles an **LGPL** FFmpeg build (without GPL `libx264`), `H264Encoders` probes the OS hardware encoders first and falls back to Cisco's `libopenh264` (downloaded on first use per Cisco's patent license). For Linux users installing system FFmpeg (before or alongside TA-19 bundling), follow Maktaba's `/etc/os-release` hints (`cmd/maktaba-server/internal/ffmpeg/install.go`): Debian/Ubuntu `sudo apt install ffmpeg`, Arch `sudo pacman -S --needed ffmpeg`, Fedora RPM Fusion (`rpmfusion-free-release` + `dnf install --allowerasing ffmpeg`, since Fedora's `ffmpeg-free` omits H.264), RHEL/Alma/Rocky EPEL + CRB + RPM Fusion, and openSUSE Packman.
3. **Overlap resolved with `AlUmmahNowCore` (`aun-media`, Epic 30):** `ToolsCore` calls `AlUmmahNow.Core.AunCoreMethods.HlsPackageMp4` for fMP4 segmentation rather than writing its own muxer, and reads the exact ladder parameters from `GET /api/admin/import/encoding`. Both Tools and Desktop Studio therefore share one packaging engine and one ladder definition.
