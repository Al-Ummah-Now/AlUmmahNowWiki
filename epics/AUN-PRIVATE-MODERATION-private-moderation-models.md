[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# AUN-PRIVATE-MODERATION: Private, Self-Hosted Content Moderation Models

| | |
|---|---|
| **ID** | `AUN-PRIVATE-MODERATION` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (`apps/media`, `apps/processor`, `apps/admin-api`, `apps/admin-web`, `packages/shared-types`), plus a private training repo/workspace for Colab notebooks & scripts |
| **Status** | **planned** (spec & execution plan saved 2026-11-26; awaiting owner decision `PM-D1` on Workers AI vs. full self-hosted cutover) |
| **Last updated** | 2026-11-26 |

Builds on [Epic 28](E28-ai-moderation.md) (AI-assisted moderation & flagging) and [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md) (pre-publication video review).

---

## 1. Goal & Motivation

Owner requirement (2026-11-26): train our own standard content moderation models (NSFW/nudity, gore/violence, disturbing imagery, hate, harassment, self-harm, spam/scams, explicit language — EN & AR) using Google Colab compute credits so that **real user data is never seen by third-party AI vendors** and inference stays strictly inside our own infrastructure.

This epic covers **general platform safety moderation** (not Islamic doctrinal/fiqh adjudication). It complements rather than replaces:
- Dedicated CSAM hash scanning and NCMEC reporting ([E28 story 28.9](E28-ai-moderation.md)), which is **never** ML-trained on real CSAM.
- Human moderator review and appeals (GDPR Art. 22: automated models only score and hold; a person decides every rejection).

---

## 2. Privacy Comparison: Cloudflare Workers AI vs. 100% Self-Hosted Containers

Understanding this boundary drives decision `PM-D1` below:

| Dimension | Cloudflare Workers AI (current pipeline) | Self-Hosted ONNX in Our Own Container (this epic) |
|---|---|---|
| **Do OpenAI / Anthropic / Google / Meta see user data?** | **No.** Cloudflare hosts open-weight models (`clef-flash`, `gemma-4-26b`, `llama-guard-3-8b`) on Cloudflare's own GPU clusters. No third-party AI API is called. | **No.** Runs inside our own container process (`onnxruntime`). |
| **New sub-processor?** | **No** — same Cloudflare account & DPA we already use for Workers, D1, R2, Queues, and Containers. | **No** — runs inside our existing Cloudflare Container (`apps/media`) or our own private container host. |
| **Training on customer data** | Cloudflare explicitly does **not** train on Workers AI inputs or outputs. | **Never** — we own the weights and the runtime. |
| **Data retention / logging** | Zero Data Retention (ZDR) by default for standard inference payloads. **Caveat:** enabling AI Gateway logging/caching or observability payload logging persists payloads — must stay **off** for moderation routes. | Strictly in-memory inside our container; frames are scored during transcoding and never even cross a network boundary for Stage-1 vision checks. |
| **Hardware isolation & region pinning** | Multi-tenant Cloudflare GPU pools; global routing ("Region: Earth"); Regional Services for Workers does **not** pin Workers AI GPU execution to one region on self-serve plans. | Single-tenant container instance (`apps/media` or dedicated moderation container); zero external inference calls. |
| **Custom model support** | Only supports BYO LoRA on a narrow list of older text bases (`mistral-7b`, `gemma-2b/7b-it-lora`, `llama-2-7b-chat-hf-lora`) with `r ≤ 32` and `< 300 MB`. **Does not support** arbitrary ONNX classifiers or custom vision models. | Supports **any** open-weight ONNX / PyTorch / quantized model we train (both bilingual text and vision/NSFW). |
| **Inference cost profile** | Per-token / per-neuron metering (very low at launch scale, scales linearly with volume). | Flat container CPU compute; ONNX `int8` classifiers run in ~15–30 ms/text and ~30–80 ms/frame on CPU with zero GPU server needed. |

**Key takeaway:** If Cloudflare's zero-retention open-weight GPU fabric is inside our trust boundary, Workers AI is already free of third-party AI vendors (provided AI Gateway payload logging stays off). If we want **zero external AI cluster egress**, **our own privately owned weights**, **native EN+AR single-pass text scoring**, and **in-container frame NSFW scoring without extra GPU servers**, the self-hosted ONNX architecture below delivers all four cleanly.

---

## 3. Hard Privacy & Policy Guardrails

1. **`PM-R1` — Zero third-party inference egress:** At inference time, user comments, posts, video metadata, transcripts, thumbnails, and video frames never leave our infrastructure to any external AI vendor.
2. **`PM-R2` — Zero real user data on Google Colab:** Google Colab runs on Google's cloud and is used **strictly** with permissively licensed public safety datasets and synthetic/non-PII examples. Real user videos, comments, reports, or PII are **never** uploaded to Colab or Google Drive.
3. **`PM-R3` — No Quran Foundation data in ML:** Binding platform rule ([decisions.md](decisions.md#quran-foundation-terms-binding-2026-11-21)): Quran Foundation synced text, timings, and our derived Quran index are never used to train, fine-tune, or evaluate any model.
4. **`PM-R4` — Never train on CSAM:** CSAM remains strictly handled by dedicated hash scanning (`E28.9`); no CSAM material is ever collected or used in model training.
5. **`PM-R5` — Flag/hold only & fail-closed:** Automated models only score and hold for review; humans decide every rejection (GDPR Art. 22). If the private inference service times out or fails, pre-publication videos go to `in_review` (never auto-approved). Tests, CI, QA, and stage continue to use `FixtureModerationProvider` exclusively (`assertRealAiAllowed` enforced).
6. **`PM-R6` — Open, commercially shippable weights & verified artifacts:** Base models must carry permissive commercial licenses (MIT / Apache-2.0). Trained weights are stored in **private R2** (never committed to public git repositories), accompanied by a signed/hashed manifest (`sha256`, dataset provenance, license audit, calibration temperatures, and eval scorecard) verified at container startup.

---

## 4. Target Architecture

### 4.1 Model 1 — Bilingual Text Safety Classifier (`aun-mod-text-vN`)
- **Scope:** Comments, community posts, video titles/descriptions, channel names/bios, live chat, and transcripts in **English and Arabic** natively (removing the Arabic→English translation hop).
- **Base model:** `microsoft/mdeberta-v3-base` (MIT) or `xlm-roberta-base` (MIT).
- **Task:** Multi-label classification aligned with `packages/shared-types` moderation categories:
  - `sexual` (explicit sexual content / solicitation)
  - `violence` (graphic violence, violent threats, incitement)
  - `hate` (hate speech, slurs, dehumanization)
  - `harassment` (targeted abuse, bullying, doxxing threats)
  - `self_harm` (suicide / self-harm encouragement)
  - `spam` (bulk unsolicited links, repetitive promotional spam)
  - `scam` (fraud, phishing, fake charity/crypto scams, impersonation scams)
- **Colab training:** L4 or A100 GPU, ~30–60 min per run (very low Colab credit burn), class-weighted BCE / focal loss + post-hoc temperature scaling for calibrated probabilities.
- **Runtime export:** ONNX `int8` (~150–250 MB) + `tokenizer.json`, ~15–30 ms on CPU via `onnxruntime`.

### 4.2 Model 2 — Vision / Video Frame NSFW Classifier (`aun-mod-vision-vN`)
- **Scope:** Video review frames (sampled every 2 s + scene cuts, capped at 1,200 frames, already decoded by `apps/media`), thumbnails, community post images, avatars, and channel banners.
- **Base model:** `google/siglip-base-patch16-384` (Apache-2.0) or `google/vit-base-patch16-224` (Apache-2.0) with a multi-label safety head.
- **Task:** Multi-label probabilities aligned with `ImageReviewCategory`:
  - `sexual` (nudity / sexually explicit imagery)
  - `gore` (graphic violence / blood / gore)
  - `disturbing` (shocking / disturbing visual content)
- **Colab training:** L4 or A100 GPU, ~1–2 hours per run, trained with hard-negative safe imagery (medical diagrams, historical art, dark/low-light scenes, normal lectures, animations) to control false positives.
- **Runtime export:** ONNX `int8` (~90–180 MB), executed **in-process inside our existing `apps/media` Transcoder container** while frames are already in memory during transcode — zero frame transfer to external APIs and zero always-on GPU server required.

### 4.3 Integration with Existing `AlUmmahNow` Pipeline
The existing codebase already isolates AI calls behind two clean seams:
- `apps/processor/src/review/provider.ts`: `ModerationProvider` interface (`screenImages`, `reviewImage`, `transcribe`, `guardText`, `policyText`) — extend `kind` to `'workers-ai' | 'self-hosted' | 'fixture'` and add `SelfHostedModerationProvider`.
- `apps/processor/src/moderation/ai.ts`: text moderation adapter — route through the configured provider, supporting a **`shadow_compare`** mode that scores with our private model alongside the existing pipeline and records agreement/precision metrics before cutover.

---

## 5. Stories

| Story | Title | Owning area | Dependencies | Acceptance criteria |
|---|---|---|---|---|
| **PM-1** | Taxonomy, label mapping & private model registry contract | `packages/shared-types`, docs, private R2 | None | Canonical multi-label schema mapped 1:1 to `moderation_signals` & `video_review_findings` categories; JSON artifact manifest spec (`modelId`, `version`, `sha256`, `quantization`, `thresholds`, `metrics`, `datasetLicenses`); private R2 prefix (`models/moderation/<model>/<version>/`) with no public read access; privacy & license checklist documented. |
| **PM-2** | Public + synthetic training corpus & held-out benchmark (EN + AR) | Private ML repo / `apps/processor/eval` | PM-1 | Curated manifest of strictly commercially permissive public EN/AR text & vision safety datasets; synthetic boundary cases & non-flagging hard negatives (zero PII, zero real user data, zero Quran Foundation data, zero CSAM); automated dataset hygiene script verifying zero leakage against `apps/processor/eval/golden.jsonl` (strictly held-out) and zero PII patterns; baseline scorecard recorded on `golden.jsonl`. |
| **PM-3** | Colab training & ONNX export pipeline: Text safety (`aun-mod-text-v1`) | Private ML repo (Colab notebook + scripts) | PM-1, PM-2 | Reproducible Colab notebook with Drive/GCS checkpointing every epoch; trains `mDeBERTa-v3-base` / `XLM-RoBERTa-base` multi-label classifier; applies per-class temperature calibration; exports ONNX `int8` + tokenizer + manifest; meets target held-out eval bar (high recall on severe classes, controlled FPR on EN/AR hard negatives) and CPU p95 latency ≤ 50 ms on short comments. |
| **PM-4** | Colab training & ONNX export pipeline: Vision NSFW (`aun-mod-vision-v1`) | Private ML repo (Colab notebook + scripts) | PM-1, PM-2 | Reproducible Colab notebook with checkpointing; trains `SigLIP` / `ViT-Base` multi-label safety head (`sexual`, `gore`, `disturbing`); applies temperature calibration; exports ONNX `int8` + manifest; achieves Stage-1 recall target (≥ 95% on explicit nudity/gore test split) and CPU latency practical for batch frame scoring in `apps/media`. |
| **PM-5** | Private in-container ONNX inference service (`apps/media` & internal endpoints) | `apps/media` (or dedicated private CF Container) | PM-1, PM-3, PM-4 | Embeds `onnxruntime` CPU runtime; loads versioned ONNX artifacts from private R2 at startup with strict SHA-256 verification (refuses to serve on hash mismatch); scores video frames in-memory during transcode; exposes internal constant-time `INTERNAL_API_KEY`-authenticated `/internal/moderate/text` and `/internal/moderate/image` routes with strict payload limits, bounded concurrency, and `/health` reporting loaded model versions. |
| **PM-6** | `SelfHostedModerationProvider` & shadow comparison wiring | `apps/processor` | PM-5 | Adds `SelfHostedModerationProvider` (`kind: 'self-hosted'`) implementing `ModerationProvider` (`provider.ts`) and text moderation (`moderation/ai.ts`); preserves `assertRealAiAllowed` loud guard in test/CI/E2E; adds `shadow_compare` execution mode logging per-category side-by-side scores without altering decisions; enforces fail-closed fallback to `in_review` on container timeout/error; full unit & fixture-provider E2E coverage. |
| **PM-7** | Admin model control, shadow comparison & threshold UI (EN/AR) | `apps/admin-api`, `apps/admin-web` | PM-6 | Bilingual EN/AR controls under Admin → Moderation settings: provider selector (`workers_ai` / `shadow_compare` / `self_hosted`), active model version & SHA-256 readout, per-category threshold calibration, shadow agreement / false-positive comparison panel, and instant audited rollback switch. |
| **PM-8** | Staged production rollout, zero-egress audit & retraining runbook | Ops / `AlUmmahNow` / Wiki | PM-7 | Run `shadow_compare` in production for ≥ 2 weeks against human reviewer labels; verify zero outbound AI egress via network/log audit (and verify AI Gateway logging is off if hybrid); staged cutover (`text` → `images/frames` → `self_hosted` default); publish quarterly recalibration & retraining runbook honoring `PM-R2` (synthetic/public-only on Colab, or private owned GPU if ever training on internal data). |

---

## 6. Execution Plan & Estimated Colab Compute

### Phase 1 — Contracts, Datasets & Eval Harness (No GPU needed)
- Execute **PM-1** and **PM-2**.
- Deliverable: locked label mapping, license-verified public + synthetic dataset builder, zero-leakage verification against `golden.jsonl`, and reproducible offline eval CLI.

### Phase 2 — Colab Training, Calibration & ONNX Export
- Execute **PM-3** (Text) and **PM-4** (Vision) on Google Colab L4 / A100 GPUs.
- Estimated Colab usage for v1 (including 2–3 hyperparameter & calibration iterations):
  - `aun-mod-text-v1`: ~5–15 compute units (fast transformer fine-tune + int8 quantization).
  - `aun-mod-vision-v1`: ~15–30 compute units (backbone warmup + head/partial unfreeze + calibration).
- Deliverable: versioned `int8` ONNX packages + manifests uploaded to private R2 with eval scorecards.

### Phase 3 — Private Runtime & Processor Integration
- Execute **PM-5** and **PM-6**.
- Deliverable: private in-container ONNX inference verified with unit tests and local fixture E2E (zero real model calls in CI).

### Phase 4 — Admin Controls, Shadow Comparison & Private Cutover
- Execute **PM-7** and **PM-8**.
- Deliverable: ≥ 2 weeks of production shadow comparison, verified zero third-party AI egress, tuned per-category thresholds, and clean cutover to self-hosted private moderation.

---

## 7. Open Decisions for the Owner

| ID | Question | Options | Default recommendation |
|---|---|---|---|
| **PM-D1** | **Trust boundary for Cloudflare Workers AI:** Do we want 100% self-hosted ONNX inside our own containers with **zero** Workers AI calls for moderation, or a hybrid where self-hosted ONNX handles Stage-1 screening and Workers AI Gemma 4 (ZDR, logging off) acts as an optional Stage-2 check on borderline items? | (a) 100% self-hosted ONNX only (zero Workers AI calls for moderation; human reviewers handle borderline holds); (b) Hybrid: self-hosted ONNX Stage 1 + Workers AI Gemma 4 Stage 2 (ZDR, AI Gateway logging off); (c) Keep Workers AI for moderation and only add a custom BYO LoRA for text | **(a)** if strict zero-external-cluster privacy is the goal; **(b)** if Cloudflare's ZDR boundary is acceptable and you want lower human-review volume on ambiguous video frames. |
| **PM-D2** | **Where do Colab training notebooks & dataset scripts live?** | (a) Dedicated private repo (`AlUmmahNowML`); (b) Folder inside `AlUmmahNow` (`ml/moderation/`) | **(a) Dedicated private repo** (`AlUmmahNowML`) — keeps ML Python/Colab tooling cleanly separated from the TS monorepo and public repos; weights always stay in private R2. |
| **PM-D3** | **Container topology for CPU ONNX inference:** | (a) Host both vision and text ONNX inside existing `apps/media` container initially; (b) Vision in `apps/media` + separate lightweight Cloudflare Container for text moderation | **(a)** for v1 simplicity (zero new container services), splitting text into its own container once live-chat/comment volume warrants latency isolation. |
| **PM-D4** | **Build order after PM-1 & PM-2:** | (a) Text first (`PM-3`), then Vision (`PM-4`); (b) Vision first (`PM-4`), then Text (`PM-3`); (c) Train both in parallel | **(a) Text first** (fastest Colab iteration & immediate eval against existing `golden.jsonl`), then Vision (`PM-4`). |

---

## 8. Sources & Cross-Links

- [Epic 28: AI-assisted moderation & flagging](E28-ai-moderation.md)
- [AUN-VIDEO-REVIEW: Pre-publication video review](AUN-VIDEO-REVIEW-pre-publication-review.md)
- [Decision log — Quran Foundation terms](decisions.md#quran-foundation-terms-binding-2026-11-21)
- `AlUmmahNow`: `apps/processor/src/review/provider.ts`, `apps/processor/src/moderation/ai.ts`, `apps/processor/eval/golden.jsonl`, `apps/media/`
