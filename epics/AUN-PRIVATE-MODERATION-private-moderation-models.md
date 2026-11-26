[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# AUN-PRIVATE-MODERATION: Private, Self-Hosted Content Moderation Models

| | |
|---|---|
| **ID** | `AUN-PRIVATE-MODERATION` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (`apps/media`, `apps/processor`, `apps/admin-api`, `apps/admin-web`, `packages/shared-types`), plus a private training repo (`AlUmmahNowML`, see `PM-D2`) for Colab notebooks & scripts |
| **Status** | **planned** (spec & execution plan saved 2026-11-26; awaiting owner decisions `PM-D1`–`PM-D5` before production shadowing or cutover) |
| **Last updated** | 2026-11-26 |

Builds on [Epic 28](E28-ai-moderation.md) (AI-assisted moderation & flagging) and [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md) (pre-publication video review).

---

## 1. Goal & Motivation

Owner requirement (2026-11-26): train our own standard content moderation models (NSFW/nudity, gore/violence, disturbing imagery, minor-present safety signal, hate, harassment, self-harm, spam/scams, explicit language — EN & AR) using Google Colab compute credits so that **real user data is never seen by third-party AI vendors** and inference stays strictly inside our own infrastructure.

This epic covers **general platform safety moderation** (not Islamic doctrinal/fiqh adjudication). It complements rather than replaces:
- Dedicated CSAM hash scanning and NCMEC reporting ([E28 story 28.9](E28-ai-moderation.md); note that scanner enablement and R2 coverage remain open under [AlUmmahNow#397](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/397)).
- Human moderator review and appeals (GDPR Art. 22: automated models only score and hold; a person decides every rejection).

---

## 2. Privacy Comparison: Cloudflare Workers AI vs. 100% Self-Hosted Containers

Understanding this boundary drives decision `PM-D1` below:

| Dimension | Cloudflare Workers AI (current pipeline) | Self-Hosted ONNX / Local Runtime in Our Own Container (this epic) |
|---|---|---|
| **Do OpenAI / Anthropic / Google / Meta see user data?** | **No.** Cloudflare hosts open-weight models (`clef-flash`, `gemma-4-26b`, `llama-guard-3-8b`, `whisper-large-v3-turbo`) on Cloudflare's own GPU clusters. No third-party AI API is called. | **No.** Runs inside our own container process (`onnxruntime` + local `whisper.cpp` if strict audio mode is enabled). |
| **New sub-processor?** | **No** — same Cloudflare account & DPA we already use for Workers, D1, R2, Queues, and Containers. | **No** — runs inside our existing Cloudflare Container (`apps/media`) or our own private container host. |
| **Training on customer data** | Cloudflare explicitly does **not** train on Workers AI inputs or outputs ([Cloudflare Workers AI data usage](https://developers.cloudflare.com/workers-ai/platform/data-usage/)). | **Never** — we own the weights and the runtime. |
| **Data retention / logging** | Zero Data Retention (ZDR) by default for standard inference payloads. **Exceptions per Cloudflare policy:** payloads may be stored/retained when using stateful features (AI Gateway logging/caching, R2/KV/DO/Vectorize bindings, Workers Observability/Logpush, async batch/file uploads) or as required for abuse/safety/legal compliance. AI Gateway payload logging & caching must stay **off** for moderation routes. | Strictly in-memory / ephemeral container disk; video frames are scored locally right after FFmpeg extraction in `apps/media` without calling any external inference cluster. |
| **Hardware isolation & region pinning** | Multi-tenant Cloudflare GPU pools; global routing ("Region: Earth"); Regional Services for Workers does **not** pin Workers AI GPU execution to one region on self-serve plans. | Single-tenant container instance (`apps/media` or dedicated moderation container); zero external AI cluster calls in strict mode. |
| **Custom model support** | Only supports BYO LoRA on specific compatible text bases with `r ≤ 32` and `< 300 MB` ([Cloudflare LoRA compatibility docs](https://developers.cloudflare.com/workers-ai/features/fine-tunes/loras/)). **Does not support** arbitrary ONNX classifiers or custom vision models. | Supports **any** open-weight ONNX / quantized model we train (both bilingual text and vision/NSFW), plus local `whisper.cpp` audio transcription. |
| **Inference cost profile** | Per-token / per-neuron metering (very low at launch scale, scales linearly with volume). | Flat container CPU compute; ONNX `int8` classifiers run on CPU with zero always-on GPU server needed. |

**Operating modes & explicit owner sign-off:**
1. **`strict_self_hosted`:** 100% of text, image/frame, and audio moderation runs inside our own containers. **Zero** payloads are sent to Workers AI or any third-party AI host. If the private container is unavailable, pre-publication videos fail closed to `in_review` (never auto-approved, never silently routed to Workers AI).
2. **`hybrid_workers_ai_stage2`:** Our private ONNX models run Stage-1 text & frame screening locally; only borderline escalated items (or audio transcription, if local Whisper is off) call Workers AI (ZDR, AI Gateway payload logging/caching strictly off). **Requires explicit owner sign-off under `PM-D1` before enabling on real user content.**
3. **`shadow_compare` / rollback to `workers_ai`:** Sends real inputs to Workers AI alongside our private container for live calibration (or during rollback). Because this routes real payloads to Workers AI, **enabling `shadow_compare` or rollback to `workers_ai` on production traffic also requires explicit owner sign-off under `PM-D1`.** If `PM-D1` chooses strict zero-Workers-AI privacy from day one, calibration runs on synthetic/public fixtures + offline evaluation first, and strict mode rolls out directly in shadow-hold (logging private scores only, zero Workers AI calls).

---

## 3. Hard Privacy & Policy Guardrails

1. **`PM-R1` — Mode-enforced inference boundary & zero third-party egress:** No third-party AI API is ever called in any mode. In `strict_self_hosted` mode, zero payloads are sent to Workers AI either (text, images, frames, and audio all stay inside our own containers). Modes that touch Workers AI (`shadow_compare`, `hybrid_workers_ai_stage2`, or `workers_ai` rollback) are blocked in code/config unless explicitly authorized by `PM-D1`. Shadow comparison logs store **only** entity IDs, model versions, category scores, latencies, and verdicts — **never** raw user text, transcripts, or image bytes.
2. **`PM-R2` — Zero real user data on Google Colab:** Google Colab runs on Google's cloud and is used **strictly** with permissively licensed public safety datasets and synthetic/non-PII examples. Real user videos, comments, reports, or PII are **never** uploaded to Colab or Google Drive. Whether future retraining may ever use internal reviewer-labeled data on a **private, owned GPU** (never Colab) is an explicit open decision (`PM-D5`).
3. **`PM-R3` — No Quran Foundation data in ML:** Binding platform rule ([QF1: Quran Foundation content use](decisions.md#qf1-quran-foundation-content-use)): Quran Foundation synced text, timings, and our derived Quran index are never used to train, fine-tune, or evaluate any model.
4. **`PM-R4` — Never collect or train on CSAM in ML datasets:** CSAM detection remains strictly handled by dedicated hash scanning (`E28.9`; scanner enablement and R2 coverage remain open under [AlUmmahNow#397](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/397)). No real CSAM material is ever collected, stored, or used in any ML training or evaluation dataset.
5. **`PM-R5` — Flag/hold only, fail-closed, production-only real inference:** Automated models only score and hold for review; humans decide every rejection (GDPR Art. 22). On container error or timeout in any mode, pre-publication videos go to `in_review` (never auto-approved). Unit tests, CI, QA, and staging **always** run `FixtureModerationProvider` (`assertRealAiAllowed` enforced across test, CI, QA, and stage; real moderation runs in production only, matching [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md)).
6. **`PM-R6` — Open, commercially shippable weights & signed artifact verification:** Base models must carry permissive commercial licenses (MIT / Apache-2.0). Trained weights and tokenizers are stored in **private R2** (never committed to public git repositories). Each release bundle includes an **Ed25519-signed manifest** verified against a pinned public key baked into the container, and startup verifies the SHA-256 checksum of **every** artifact (`model.onnx`, `tokenizer.json`, `labels.json`, `calibration.json`) before serving — refusing to start on any signature or hash mismatch.

---

## 4. Target Architecture & Migration Contract

### 4.1 Model 1 — Bilingual Text Safety Classifier (`aun-mod-text-vN`)
- **Scope:** Comments, community posts, video titles/descriptions, channel names/bios, live chat, and transcripts in **English and Arabic** natively (removing the Arabic→English translation hop).
- **Base model:** `microsoft/mdeberta-v3-base` (MIT) or `xlm-roberta-base` (MIT).
- **Exact emitted keys (1:1 per head to existing `ModerationCategory` in `packages/shared-types/src/ai-moderation.ts` & `routeReview()` in `packages/shared-types/src/video-review.ts`):**

| Model head | Exact emitted key (`ModerationCategory` & `ReviewFinding.category`) | Consumer routing & auto-hide parity preserved |
|---|---|---|
| `sexual` | `sexual` | Valid `ModerationCategory`; hits `NSFW_TEXT_CATEGORIES` and `sexualAbove` in `routeReview()`; flag/hold only |
| `S4` | `S4` (text child-safety / grooming / exploitation cues; trained strictly on synthetic non-CSAM text cues per `PM-R4`) | Valid `ModerationCategory`; **preserves `ESCALATE_CATEGORIES` (`S4`) senior-reviewer escalation** independently of `E28.9` media hashing and vision `minor_present` |
| `S1` | `S1` (violent threats / graphic violence / violent crimes) | Valid `ModerationCategory`; hits `ESCALATE_CATEGORIES` (`S1`) and Quran exclusion list (`['violent_extremism', 'hate', 'sectarian_hate', 'gore', 'S1', 'S10']`) in `routeReview()` |
| `violent_extremism` | `violent_extremism` | Valid `ModerationCategory`; hits `ESCALATE_CATEGORIES` (`violent_extremism`), weight `1`, and Quran exclusion list in `routeReview()` |
| `S10` | `S10` (hate speech / slurs) | Valid `ModerationCategory`; hits Quran exclusion list (`S10`) in `routeReview()` |
| `harassment` | `harassment` | Valid `ModerationCategory`; weight `0.7` in `CATEGORY_WEIGHTS` |
| `S11` | `S11` (self-harm / suicide encouragement) | Valid `ModerationCategory` |
| `spam` | `spam` | Valid `ModerationCategory` & `AI_HIDEABLE_CATEGORIES` (reversible hide allowed for low-trust authors per M2) |
| `charity_scam` | `charity_scam` (**strictly** fake charity / donation / zakat / sadaqah scams only) | Valid `ModerationCategory` & `AI_HIDEABLE_CATEGORIES` — preserves existing M2 auto-hide semantics without expanding auto-hide to general fraud/phishing |
| `S2` | `S2` (general fraud, phishing, and non-violent crimes) | Valid `ModerationCategory`; **not** in `AI_HIDEABLE_CATEGORIES` (flags/holds for human review only; never auto-hides) |

- **Disposition of remaining `ModerationCategory` keys not emitted as dedicated v1 heads:**
  - `S12` (sexual content) & `sexual_explicit_language`: covered by the `sexual` head (which hits both `NSFW_TEXT_CATEGORIES` and `sexualAbove`).
  - `child_safety`: text escalation is preserved by `S4` (both sit in `ESCALATE_CATEGORIES`); vision minor+sexual escalation is preserved by `minor_present` + `sexual`.
  - `sectarian_hate`: covered by `S10` (same Quran-exclusion rule in `routeReview()`).
  - `S3` (sex-related crimes): covered by `sexual` / `S1` / `S4` hold/escalation paths.
  - `S5`–`S9`, `S13`, `S14`, `impersonation`, `misinfo_health`, `religious_authenticity`: out of v1 general-safety classifier scope; continue via human user reports (`E06`), keyword/link rules (`E28.2`), or `hybrid_workers_ai_stage2` if authorized under `PM-D1(b)` (never silently mapped into auto-hideable categories).
  - *(No non-existent keys such as bare `violence`, `hate`, `self_harm`, or `scam` are emitted into `moderation_signals`. Parity unit tests in `PM-1` / `PM-6` verify exact `routeReview()` behavior for `S4`, `S1` & `violent_extremism` senior escalation, Quran-span exclusion on `S1`/`violent_extremism`/`S10`, `minor_present` + `sexual` dual-threshold escalation, and that `S2` general fraud/phishing flags without triggering `charity_scam` auto-hide.)*

- **Colab training:** L4 or A100 GPU, ~30–60 min per run, class-weighted BCE / focal loss + post-hoc temperature scaling fitted strictly on a dedicated calibration split.
- **Runtime export:** ONNX `int8` (~150–250 MB) + `tokenizer.json`, target p95 ≤ 50 ms on CPU via `onnxruntime`.

### 4.2 Model 2 — Vision / Video Frame NSFW & Minor-Present Classifier (`aun-mod-vision-vN`)
- **Scope:** Video review frames (sampled every 2 s + scene cuts, capped at 1,200 frames), thumbnails, community post images, avatars, and channel banners.
- **Base model:** `google/siglip-base-patch16-384` (Apache-2.0) or `google/vit-base-patch16-224` (Apache-2.0) with a 4-output multi-label head.
- **Exact emitted keys (1:1 to `ImageReviewCategory` in `packages/shared-types/src/video-review.ts`):**

| Model head | Exact emitted key (`ImageReviewCategory`) | Routing & escalation parity preserved |
|---|---|---|
| `sexual` | `sexual` | `NSFW_IMAGE_CATEGORIES` (`>= t.nsfwHit` holds video/post; withholds avatar/banner) |
| `gore` | `gore` | `NSFW_IMAGE_CATEGORIES` (`>= t.nsfwHit` holds) |
| `disturbing` | `disturbing` | `NSFW_IMAGE_CATEGORIES` (`>= t.nsfwHit` holds) |
| `minor_present` | `minor_present` | Preserves `routeReview()` rule: escalates to `senior_reviewer` when **both** `minor_present > t.escalate` **and** `sexual` (or `sexual_explicit_language`) `> t.escalate` |

- **Where scoring runs in `apps/media` & artifact persistence:**
  - Today, `apps/media` runs a separate FFmpeg extraction pass that writes sampled 512 px JPEGs and 16 kHz audio chunks to local container disk and uploads them to R2 `review/<videoId>/`.
  - Under this epic, `aun-mod-vision` ONNX scores the extracted JPEGs **directly from local container disk inside `apps/media`** right after FFmpeg extraction (batched on CPU, bounded memory/concurrency), returning per-frame `ImageScores` in the review job payload without ever sending frames to an external AI cluster.
  - **What still persists in R2 `review/<videoId>/`:** Flagged frames (and the review filmstrip/thumbnail needed for the `admin-web` human review UI) still persist in private R2 under `review/<videoId>/` with the existing **30-day retention purge** and **GDPR erasure** deletion rule (clean videos that auto-approve can skip uploading unflagged review frames in strict mode, further reducing storage and exposure).

### 4.3 Private Audio Transcription Path (`ModerationProvider.transcribe`)
- Today's `WorkersAiModerationProvider.transcribe()` sends 16 kHz audio chunks to Workers AI `@cf/openai/whisper-large-v3-turbo`.
- In **`strict_self_hosted` mode**, audio **must not** be sent to Workers AI. Two explicit supported paths:
  1. **Preferred (`apps/media` local Whisper):** Run open-weight `whisper.cpp` (`large-v3-turbo` / `small` GGML, MIT — already integrated in `aun-core`) directly inside `apps/media` on the extracted 16 kHz mono audio chunks before deleting local scratch files, then pass the transcript to `aun-mod-text` + the existing Quran matcher hook (skipping Quran spans from violence/hate scoring).
  2. **Explicit fallback if local Whisper is disabled or times out:** Fail closed by holding the video in `in_review` with reason `transcript_check_unavailable` (metadata + frame scores attached; never silently auto-approved and never silently routed to Workers AI).

### 4.4 Integration with Existing `AlUmmahNow` Pipeline
- `apps/processor/src/review/provider.ts`: extend `ModerationProvider['kind']` to `'workers-ai' | 'self-hosted' | 'fixture'` and add `SelfHostedModerationProvider` calling our private container's internal authenticated endpoints (or consuming pre-computed frame/transcript scores emitted by `apps/media`).
- `apps/processor/src/moderation/ai.ts`: route text moderation through the configured provider (`strict_self_hosted`, `hybrid_workers_ai_stage2`, `shadow_compare`, or `workers_ai`), gated by `PM-D1` config allowlist.

---

## 5. Stories

| Story | Title | Owning area | Dependencies | Acceptance criteria |
|---|---|---|---|---|
| **PM-1** | Taxonomy, exact emitted keys, routing parity & signed model registry | `packages/shared-types`, docs, private R2 | None | Exact 1:1 emitted keys for text (10 heads: `sexual`, `S4`, `S1`, `violent_extremism`, `S10`, `harassment`, `S11`, `spam`, `charity_scam`, `S2`) and vision (4 heads: `sexual`, `gore`, `disturbing`, `minor_present`) matching `ModerationCategory` & `ImageReviewCategory`, plus explicit disposition of omitted `ModerationCategory` keys; routing parity tests verifying `routeReview()` senior escalation on `S4`/`S1`/`violent_extremism`, Quran-span exclusion on `S1`/`violent_extremism`/`S10`, dual-threshold escalation (`minor_present > t.escalate && sexual > t.escalate`), and auto-hide isolation (`charity_scam`/`spam` only; `S2` general fraud/phishing never auto-hides); audio contract for `strict_self_hosted` covering primary audio, alternate audio tracks (`AUN-MULTI-AUDIO`), and live VOD recordings (`VR9`); Ed25519-signed manifest schema covering SHA-256 of **every** bundle file (`model.onnx`, `tokenizer.json`, `labels.json`, `calibration.json`); private R2 bucket/prefix with no public read access. |
| **PM-2** | Public + synthetic training corpus & stratified calibration/eval benchmarks (EN + AR) | Private ML repo (`AlUmmahNowML`) / `apps/processor/eval` | PM-1 | License-audited manifest of strictly commercially permissive public EN/AR text & vision datasets; non-PII synthetic boundary cases & hard negatives (including strictly synthetic non-CSAM text safety cues for `S4` per `PM-R4`, and distinct `charity_scam` vs `S2` general fraud/phishing sets); **strictly separate splits**: train, calibration (temperature scaling), held-out EN+AR text test set (≥ 500 stratified examples with **≥ 30 positive examples per gated class per language** and ≥ 100 safe/hard-negative examples per language), and held-out vision test set (**≥ 50 positive examples per head** `sexual`, `gore`, `disturbing`, `minor_present` + ≥ 200 safe/hard-negative frames); `apps/processor/eval/golden.jsonl` (46 rows; 0 `sexual` positives, 1 `S1` & 1 `S11` per language) kept strictly held-out as a separately reported regression baseline; automated hygiene CI verifying zero PII, zero overlap/leakage with `golden.jsonl`, zero Quran Foundation data (`QF1`), and zero CSAM material. |
| **PM-3** | Colab training, calibration & ONNX export: Text safety (`aun-mod-text-v1`) | Private ML repo (`AlUmmahNowML`) | PM-1, PM-2 | Reproducible Colab notebook with Drive/GCS checkpointing every epoch; trains `mDeBERTa-v3-base` / `XLM-RoBERTa-base` 10-head classifier; fits per-class temperature calibration on the calibration split; exports ONNX `int8` + tokenizer + signed manifest; passes measurable release gates on the **new stratified held-out EN & AR test split** (with ≥ 30 positives/class/language): severe-class recall (`sexual`, `S4`, `S1`, `violent_extremism`, `S11`) ≥ 95%, macro-F1 ≥ 0.85 per language (EN & AR), safe/hard-negative FPR ≤ 5%, CPU p95 latency ≤ 50 ms on 256-token comments; additionally reports regression score separately on `golden.jsonl` (without gating unsupported sparse classes on `golden.jsonl`). |
| **PM-4** | Colab training, calibration & ONNX export: Vision NSFW + `minor_present` (`aun-mod-vision-v1`) | Private ML repo (`AlUmmahNowML`) | PM-1, PM-2 | Reproducible Colab notebook with checkpointing; trains `SigLIP` / `ViT-Base` 4-head classifier (`sexual`, `gore`, `disturbing`, `minor_present`) with safe hard-negative mining; calibrates on calibration split; exports ONNX `int8` + signed manifest; passes measurable release gates on the **held-out vision split** (≥ 50 positives/head): `sexual` & `gore` Stage-1 recall ≥ 95%, `minor_present` recall ≥ 90%, safe-frame FPR ≤ 5%, and CPU throughput ≤ 100 ms/frame (1,200-frame video cap completes within container review budget). |
| **PM-5** | Private in-container ONNX & local Whisper runtime (`apps/media` / private container) | `apps/media` (or dedicated private CF Container per `PM-D3`) | PM-1, PM-3, PM-4 | Pulls bundles from private R2 at startup, verifies Ed25519 manifest signature against pinned public key and SHA-256 of every file (refuses to serve on mismatch); scores extracted FFmpeg JPEGs on local container disk before R2 upload and runs local `whisper.cpp` on 16 kHz audio chunks (including alternate audio tracks & live VOD recordings, or emits explicit unavailable status); exposes constant-time `INTERNAL_API_KEY`-authenticated `/internal/moderate/text` and `/internal/moderate/image` routes with strict payload/concurrency limits and `/health` reporting loaded model versions. |
| **PM-6** | `SelfHostedModerationProvider` & mode-gated processor wiring | `apps/processor` | PM-5 | Adds `SelfHostedModerationProvider` (`kind: 'self-hosted'`) implementing `ModerationProvider` (`provider.ts`) and text moderation (`moderation/ai.ts`) with parity unit tests for `S4`/`S1`/`violent_extremism` senior escalation, Quran exclusion, `minor_present > t.escalate && sexual > t.escalate`, and `S2`-vs-`charity_scam` auto-hide isolation (confirming `S2` flags for human review without auto-hiding); enforces `assertRealAiAllowed` across test, CI, QA, and stage; enforces `PM-D1` mode guard (blocks any Workers AI call in `strict_self_hosted` mode across all surfaces); writes **payload-free** shadow comparison records (scores/verdicts/IDs only, zero raw text/images); fail-closed to `in_review` on container timeout/error; full unit & fixture E2E coverage. |
| **PM-7** | Admin model control, shadow comparison & threshold calibration UI (EN/AR) | `apps/admin-api`, `apps/admin-web` | PM-6 | Bilingual EN/AR controls under Admin → Moderation settings: mode selector (restricted to modes permitted by `PM-D1`), loaded model version + manifest SHA-256 readout, per-category threshold controls, payload-free shadow agreement / FPR metrics view, and audited rollback switch (super-admin / approval-workflow gated). |
| **PM-8** | Staged production rollout, strict-mode surface transition, egress audit & retraining runbook | Ops / `AlUmmahNow` / Wiki | PM-7 | Explicit per-surface readiness checklist covering all 5 moderation surfaces before enabling `strict_self_hosted`: (1) text (comments/posts/metadata/live chat), (2) images & video frames, (3) primary video audio transcription, (4) alternate audio tracks (`AUN-MULTI-AUDIO`), and (5) post-hoc live-stream VOD recordings (`VR9`); any surface awaiting cutover while `strict_self_hosted` is enabled MUST fail closed (hold for human review with zero Workers AI calls — never silently falling through to Workers AI). Run production shadow evaluation for ≥ 2 weeks (strict private shadow-hold if `PM-D1 = (a)`, or `shadow_compare` if `PM-D1 = (b)` authorized); execute mode-specific egress audit (zero third-party AI hosts in all modes, zero Workers AI calls in `strict_self_hosted`, AI Gateway logging/caching off in hybrid/shadow); publish quarterly recalibration & retraining runbook adhering to `PM-R2` and `PM-D5`. |

---

## 6. Execution Plan & Estimated Colab Compute

### Phase 1 — Contracts, Datasets & Eval Harness (0 GPU)
- Execute **PM-1** and **PM-2**.
- Deliverable: locked label/audio contracts, Ed25519 manifest spec, license-verified public + synthetic dataset builder, zero-leakage/zero-PII/zero-QF1 hygiene CI, and stratified EN/AR text + vision eval harnesses.

### Phase 2 — Colab Training, Calibration & ONNX Export
- Execute **PM-3** (Text) and **PM-4** (Vision) on Google Colab L4 / A100 GPUs.
- Estimated Colab usage for v1 (including 2–3 tuning & calibration runs):
  - `aun-mod-text-v1`: ~5–15 compute units.
  - `aun-mod-vision-v1`: ~15–30 compute units.
- Deliverable: signed, versioned `int8` ONNX bundles + eval scorecards uploaded to private R2.

### Phase 3 — Private Runtime & Processor Integration
- Execute **PM-5** and **PM-6**.
- Deliverable: verified in-container ONNX + local Whisper runtime and `SelfHostedModerationProvider` with unit + local fixture E2E tests (zero real model calls in test/CI/QA/stage).

### Phase 4 — Admin Controls, Egress Audit & Production Cutover
- Execute **PM-7** and **PM-8**.
- Deliverable: ≥ 2 weeks of production shadow validation against reviewer decisions, verified zero-egress audit, tuned thresholds, and clean cutover.

---

## 7. Open Decisions for the Owner

| ID | Question | Options | Default recommendation |
|---|---|---|---|
| **PM-D1** | **Inference boundary & Workers AI authorization:** May real production moderation inputs touch Cloudflare Workers AI (zero-retention open-weight GPU pools, AI Gateway logging off) during `shadow_compare`, Stage-2 escalation, audio transcription, or rollback — or must moderation be strictly zero-Workers-AI from day one? | (a) `strict_self_hosted` only: zero Workers AI calls for moderation across all 5 surfaces (including shadow, alternate audio, live VODs, and rollback; any surface not yet migrated fails closed to human review); (b) `hybrid_workers_ai_stage2`: explicitly authorizes Workers AI (ZDR, AI Gateway logging/caching off) for Stage-2 borderline vision escalation, audio transcription while local `whisper.cpp` is off, `shadow_compare`, and emergency rollback to `workers_ai`; (c) Stay on Workers AI (defers the self-hosted ONNX rollout in `PM-3`–`PM-8` and optionally adds a custom text BYO LoRA on a [supported text base](https://developers.cloudflare.com/workers-ai/features/fine-tunes/loras/)) | **(a)** if strict zero-external-cluster privacy is required; **(b)** if Cloudflare's ZDR boundary ([data usage policy](https://developers.cloudflare.com/workers-ai/platform/data-usage/)) is acceptable and lower human-review volume on ambiguous frames is desired. |
| **PM-D2** | **Where do Colab training notebooks & dataset scripts live?** *(Note: `AlUmmahNow` is a public repository; only non-sensitive runtime code/schemas belong there, never private datasets or weights.)* | (a) Dedicated private repo (`AlUmmahNowML`); (b) Public `AlUmmahNow` monorepo (`ml/moderation/` — scripts/schemas only, weights in private R2) | **(a) Dedicated private repo** (`AlUmmahNowML`), keeping training pipelines, synthetic prompts, and eval manifests private alongside private R2 weights. |
| **PM-D3** | **Container topology for CPU ONNX + local Whisper inference:** | (a) Host vision ONNX, text ONNX, and local `whisper.cpp` inside existing `apps/media` container initially; (b) Vision + Whisper in `apps/media` and a separate lightweight Cloudflare Container for low-latency text moderation | **(a)** for v1 simplicity (zero new container services), splitting text into its own container once live-chat/comment volume warrants latency isolation. |
| **PM-D4** | **Training order after PM-1 & PM-2:** | (a) Text first (`PM-3`), then Vision (`PM-4`); (b) Vision first (`PM-4`), then Text (`PM-3`); (c) Train both in parallel | **(a) Text first** (fastest Colab iteration & immediate eval against `golden.jsonl` + held-out EN/AR split), then Vision (`PM-4`). |
| **PM-D5** | **Future retraining policy on internal reviewer-labeled production errors:** | (a) Synthetic-only recreation on Colab (never train on real user content anywhere); (b) Allow retraining on consented/anonymized internal moderation errors **only** on a private, Al Ummah Now–owned GPU (never Colab) | **(a)** initially for simplest GDPR posture; revisit **(b)** only if a dedicated owned GPU and formal privacy notice/DPIA are in place. |

---

## 8. Sources & Cross-Links

- [Epic 28: AI-assisted moderation & flagging](E28-ai-moderation.md)
- [AUN-VIDEO-REVIEW: Pre-publication video review](AUN-VIDEO-REVIEW-pre-publication-review.md)
- [QF1: Quran Foundation content use](decisions.md#qf1-quran-foundation-content-use)
- [Cloudflare Workers AI Data Usage Policy](https://developers.cloudflare.com/workers-ai/platform/data-usage/)
- [Cloudflare Workers AI LoRA Compatibility](https://developers.cloudflare.com/workers-ai/features/fine-tunes/loras/)
- `AlUmmahNow`: `apps/processor/src/review/provider.ts`, `apps/processor/src/moderation/ai.ts`, `apps/processor/eval/golden.jsonl`, `apps/media/`
