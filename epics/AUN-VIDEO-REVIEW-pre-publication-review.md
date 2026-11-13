[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Pre-publication video review (In review, NSFW and content checks)

| | |
|---|---|
| **ID** | `AUN-VIDEO-REVIEW` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (api-videos, processor, media, scheduler, admin-api, admin-web, web). The native Studio apps show the new status |
| **Status** | **planned**: draft v1 spec, waiting on owner decisions VR1–VR16 |
| **Last updated** | 2026-11-13 |

Read from AlUmmahNow `origin/main` [`39a795d`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/39a795dd1) and the live reports D1 on 2026-11-13. Builds on [Epic 28](E28-ai-moderation.md) (AI moderation), [AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md) and [AUN-SUBS](AUN-SUBS-subscriptions-plan.md).

## Why

Owner: *"We need videos to be checked before they are available, for content issues."* and *"we need to flag not-safe-for-work stuff."*

## Rules from the owner

- **Production only.** This review is for real creators' production uploads. *"We will not test this in QA."* Review and AI moderation are **off in QA and stage**: uploads there publish as today, with no AI calls and no queue.
- **Open-weight models only.** No proprietary model APIs. Open-weight models hosted on Workers AI come first. Self-hosting is only a fallback.
- **NSFW is first class.** NSFW covers nudity or sexual content, graphic violence or gore, other disturbing imagery, and explicit language in en and ar. A hit **always** holds the video for a person and is never auto-approved. The same image check covers post images, avatars, banners and profile pictures.
- **Tests make no real AI calls.** Tests run on the local stack with a mocked provider.

## What exists today

### Upload to public

- **Readiness is tracked by `uploadStatus`.** Its values are `initiated`, `uploading`, `processing`, `ready` and `failed`. The `processingStatus` field is never written.
- **No webhook.** Readiness comes from a polling loop: `lib/processing/sync.ts` sets `ready` at the first playable rendition, calls `markPublished`, and then notifies subscribers.
- **Public uploads go live at once.** A public upload is visible the moment it becomes `ready`.
- **Watch and playback skip the readiness check.** They serve a public video that is still processing.
- **The scheduler doesn't check readiness.** It publishes without checking `uploadStatus`.

### Visibility rule

- **One helper, many copies.** The rule lives in `api-videos/src/lib/visibility.ts`, used by about 45 files. Variant copies of it live in:
  - the search projection, which drives search, the sitemap, IndexNow and the feed
  - `public-play.ts`, used by the www timeline and Shorts
  - the web embed
  - R2 `desiredAccess`
  - `isAnnounceable`
  - the scheduler
- **`isHidden` doesn't fit "In review".** It also hides the video from its owner.

### Epic 28 AI moderation

- **Text only, signals only.** It covers comments, posts and video metadata. Its output is a signal row, and it never changes a video.
- **Pipeline:** Arabic text is translated by m2m100, which is unusable (#813), and the result goes to Llama Guard 3.
- **The upload path is missing.** The metadata scan is never sent from the real upload path.
- **Enabled in the wrong place.** It is **on in QA** (enabled 2026-11-08) and **off in stage and prod**, because those have no config rows.
- **Open issues:** vision (#394), transcripts (#395) and CSAM hashing (#397).

### Captions, transcoding and live

- **Captions:** there is no automatic transcription. Captions are only uploaded by hand.
- **Transcoding:** the `apps/media` Transcoder container (ffmpeg) already decodes every R2 upload.
- **Live:** the VOD of a stream lives on the `livestream:{id}` record.

## Proposed flow

1. **Statuses.** Videos get a new field, `reviewStatus`, with these values:
   - `not_required`: the default. It covers existing videos and all QA and stage videos.
   - `checking`
   - `in_review`
   - `approved`
   - `rejected`
   - `appealed`
   - `post_review`
2. **The gate sits in `isVideoReady()`.** A video counts as ready only when its upload is ready and the review has cleared (`not_required`, `approved` or `post_review`). The owner still sees their own video through `isVideoListedFor`.
3. **Every copy of the rule gets the same condition.** A contract test lists every surface and fails if any of them serves an unreviewed video. The surfaces are:
   - lists, search, the sitemap, IndexNow, the feed and notifications
   - watch and playback for anyone but the owner
   - embed and oEmbed, public-play, R2 public access and short links
   - the scheduler
4. **Studio** shows **In review** in text with an icon, and the ETA "usually within N hours" taken from the queue SLA. The owner can still watch the video and edit its metadata.
5. **Scheduled publishes** wait for approval. If the scheduled time has passed, the video publishes when it is approved (VR8).
6. **Rejection.** The video stays private. The creator gets a reason from a fixed en/ar list, with the guideline section it breaks. They can edit and resubmit, and can appeal once; a different reviewer handles the appeal.
7. **Live streams** are never pre-reviewed. Once a stream ends, its VOD is checked post-hoc. An NSFW hit or high risk pulls it back to In review.

## Automated checks (open-weight, Workers AI)

**Frames and audio** come from the existing Transcoder pass, so no new decode is needed:
- **Frames:** one every 2 s, plus every scene cut (`select='gt(scene,0.3)'`), at 512 px. Near-duplicates are dropped by perceptual hash.
- **Cap:** 1,200 frames. Past the cap, one every 4 s plus every cut.
- **Audio:** 16 kHz mono chunks of 10 minutes or less, the same format as in AUN-CAPTIONS.
- **Storage:** everything goes under R2 `review/<videoId>/` and is deleted 30 days after the decision.

| Check | Model | Arabic | List price (2026-11-13) |
|---|---|---|---|
| NSFW image, stage 1: every frame, thumbnail and other image | `@cf/cloudflare/clef-flash`: Apache-2.0, open weights, 9B on a Qwen3.5 base. It returns probabilities for nudity/sexual, gore, disturbing imagery and minor present, with up to 4 images per call | n/a | $0.038 per M input tokens |
| NSFW image, stage 2: the thumbnail, plus any frame scoring p ≥ 0.2 in stage 1 | `@cf/google/gemma-4-26b-a4b-it` (vision), with a ShieldGemma-style policy prompt and a JSON verdict | good (we measured it for translation) | $0.10 in / $0.30 out per M |
| Transcript | `@cf/openai/whisper-large-v3-turbo` with VAD off and the hallucination filter | measured: good on lectures, weaker on mujawwad recitation | $0.000513 per minute |
| English text | `@cf/meta/llama-guard-3-8b` | Arabic is not supported | $0.484 / $0.03 per M |
| Arabic text and platform categories | Gemma 4 26B reading the Arabic natively. It replaces m2m100 (#813) and the llama-4-scout extension classifier | native; safety accuracy not yet measured | $0.10 / $0.30 per M |
| Quran hook | AUN-CAPTIONS matcher (quran.com only). Quran spans are left out of the violence and hate scores | native | free |

### NSFW accuracy and limits

- **No published numbers.** None of these models publishes NSFW accuracy on content like ours.
- **Benchmarks for reference:**
  - ShieldGemma 2 4B is open-weight but not on Workers AI. On Google's internal synthetic set it scores F1 88.6 for sexually explicit content and 85.0 for violence/gore.
  - Llama Guard 4 reaches 41–61% recall on images, which is too weak.
- **Two-stage design.** Stage 1 is tuned for recall at a low threshold. Stage 2 and the human reviewers supply the precision.
- **Gaps:**
  - drawings
  - dark or small regions
  - nudity only in motion
  - medical or fiqh context, such as wudu or ghusl teaching
- **Gap handling.** These cases go to a person and are never auto-rejected.
- **Minors.** "Minor present" together with any sexual score holds the video and escalates it to the senior role. The CSAM hash scan (#397) remains a separate P0.

**Routing.** Risk is the maximum of the severity-weighted scores, and each reason records its source and timestamp.
- **In review:** any NSFW hit, high risk, a failed check, or a channel policy that requires a person.
- **Approved:** risk below the auto-approve threshold.

**Other images.** On an NSFW hit, only the image is withheld. A default avatar, a plain banner or an "under review" tile shows in its place, and the image goes to the queue blurred. Each check costs about $0.00004.

## Human review queue (admin-web)

**Videos in review** follows the same Action needed / History pattern as the other admin queues. Items are sorted by SLA deadline, then by risk. The review screen has:
- a player at 1–3× speed, with flagged-timestamp markers and a key to jump to the next one
- a frame strip with flagged frames outlined
- the transcript, with flagged spans highlighted, click-to-seek, RTL Arabic and Quran reference chips
- the metadata with flagged words, and the reasons with model and prompt versions

**NSFW material is blurred by default.** Each item is revealed by a button, and every reveal is audited. The player starts blurred on NSFW items. Items flagged for minors are visible to the senior role only.

**Actions:** Approve, Reject (fixed reason plus an optional note) and Escalate. Each one is audited, notifies the creator, and can be undone within 10 minutes. Agree/disagree feedback is collected for every reason. Appeals go to a different reviewer.

**Roles:** `content_reviewer`, plus a senior reviewer role.

## Policy knobs (admin-managed)

- **`video_review.mode`:** `off`, `shadow`, `enforce_nsfw` or `enforce`. It can only be set in prod, because of the env gate `VIDEO_REVIEW_ALLOWED`, which is set only in the production wrangler config.
- **Per-channel policy:** pre-review (the default), auto-approve below threshold, or trusted post-hoc.
  - A new channel's first 5 videos always go to a person.
  - Trusted status is granted by an admin only.
- **Plan default:** the entitlement `review.policy`. Institution and Staff plans default to post-hoc. Safety checks are never tiered off.
- **Thresholds per category, SLA and budget:**
  - thresholds are set per category
  - the queue SLA starts at 24 h
  - a daily budget stop starts at $10/day
- **NSFW overrides every knob.** It holds the video on every channel, including trusted ones (VR2).

## Cost and latency

**Per video.** A 30-minute video costs about **$0.04**, or about $0.075 per video-hour. Estimated split:

| Line | Cost |
|---|---|
| Frames, stage 1 | $0.011 |
| Stage 2 | $0.002 |
| Whisper | $0.015 |
| Text | $0.007 |
| Extraction | $0.002 |

An NSFW-only check (no audio) costs about $0.015.

**Per month**, video review plus image checks:

| Scale | Uploads per month | Hours | Cost |
|---|---|---|---|
| Launch | 100 | 50 h | $4 + $1 |
| Spec scale | 500 | 250 h | $19 + $2 |
| High | 3,000 | 1,500 h | $112 + $5 |

This is a new line under the $500/month cap. Human review time is the larger cost: at 10% held and 5 minutes each, 500 uploads a month means about 4 hours of review.

**Latency.** The automated pass is estimated at 1–3 minutes after the transcode for a 30-minute video. Shadow mode will measure the real figure.

**Self-hosting fallback only:**
- **ShieldGemma 2 on a GPU.** Cloudflare Containers have no GPU. An always-on L4-class GPU costs about $450–580 a month, which breaks the cap. A scale-to-zero GPU costs about $0.01–0.03 per video.
- **CPU ViT classifier.** `Falconsai/nsfw_image_detection` (Apache-2.0) costs about $0.002 per video. It detects nudity only, has no gore class, and publishes no accuracy figures.

## Environments, testing and rollout

**Environments:** off in QA and stage. Today's Epic 28 text moderation is also turned off in QA (VR13).

**Tests run on the local stack only:**
- A `FixtureModerationProvider` returns these outcomes:
  - clean
  - NSFW frame at 00:42
  - explicit Arabic transcript span
  - high-risk metadata
  - provider down
  - slow
- A loud guard throws if the Workers AI provider is built in any test or CI run.
- Unit tests cover routing, thresholds and the visibility contract.
- Local E2E covers these paths:
  - upload, then In review, then approve, then visible
  - reject, then the creator's notice
  - provider down, so the video stays in review
  - a scheduled time passes, then the video publishes on approval
- No real AI call happens in any test run.

**First production rollout:**
1. Deploy with `mode=off`.
2. Run **shadow** for about 2 weeks. Every new upload is scored and the result is logged as "would hold", but videos still publish as today. Reviewers label a daily sample. The report covers:
   - hold rate
   - agreement between the AI and reviewers
   - NSFW hits, and misses found by spot-checking auto-approved videos
   - p95 latency
   - cost per video
3. Switch to `enforce_nsfw`.
4. Switch to `enforce`.

Each step is an instant admin switch. Turning review off leaves held videos held. An admin "Release all" bulk action, with undo, releases them.

**Failure modes:**
- **Workers AI error or timeout:** three retries, then the video goes to In review as "automated check unavailable". It is **never auto-published**.
- **Budget stop reached:** the video goes to a person, or waits (VR14).
- **Extraction failure:** a partial check covering metadata and thumbnail only, then In review.
- **SLA breach:** an alert to reviewers, and the creator's ETA updates.
- **Model deprecated:** the model id is config, so it can be swapped after the fixture contract test.

## Privacy, accessibility and language

- **Privacy:**
  - Everything runs on Cloudflare Workers AI, which does not train on customer data. No third-party AI is used.
  - Frames and transcripts are kept 30 days. Signals are kept 12 months.
  - Every reviewer view is audited.
  - GDPR erase deletes the `review/` prefix, and a test asserts it (lesson from #814).
  - A person decides every rejection (GDPR Art. 22).
- **Accessibility:**
  - Status is shown in text, not colour alone.
  - Status changes are announced through `aria-live`.
  - The queue works fully by keyboard.
  - Blur is revealed by a button.
  - Speed controls are labelled.
- **Language:** all creator-facing strings, reasons and emails exist in en and ar, with RTL.

## Findings along the way

These are filed as issues before the build starts.

- **F1:** the `video_metadata` scan is never sent from `uploadInitiate` or `uploadBatchInitiate`.
- **F2:**
  - scheduled videos never notify subscribers
  - the scheduler stamps `publishedAt` on unready videos
- **F3:**
  - watch and playback serve public videos that are still processing
  - the visibility rule is copied in six or more places with different conditions
- **F4:** Epic 28 text moderation is on in QA but off in prod.

## Decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| VR1 | Who is pre-reviewed by default | Every channel. A new channel's first 5 videos go to a person; after that, auto-approve below the threshold. Admin-granted trusted channels are reviewed post-hoc |
| VR2 | Does an NSFW hit hold trusted and post-hoc channels too, pulling back a published video | Yes, always |
| VR3 | Models | clef-flash (stage 1) and Gemma 4 26B (stage 2) for images, Whisper large-v3-turbo, Llama Guard 3 for English, Gemma 4 for Arabic and the platform categories. Retire m2m100 |
| VR4 | Frame sampling | Every 2 s plus every scene cut, with dedupe; cap 1,200 frames (then every 4 s plus cuts) |
| VR5 | Seed thresholds | Auto-approve when NSFW p < 0.10 and risk < 0.15. An NSFW hit is stage-2 p ≥ 0.5. Escalate extremism or minors above 0.3. Retune after shadow |
| VR6 | SLA shown to creators | 24 h target, shown as "usually within N h" |
| VR7 | Reviewers | A new `content_reviewer` role plus a senior role. The owner names the first reviewers |
| VR8 | Scheduled time passes while in review | Publish on approval and tell the creator |
| VR9 | Live | Post-hoc review of the VOD now; sample live frames later |
| VR10 | Rejection | The video stays private. Edit and resubmit any number of times; one appeal per decision, handled by a different reviewer |
| VR11 | Moderation transcript as a caption draft | Offer it to the creator as an opt-in draft at no extra AI cost; Quran rules apply |
| VR12 | Retention | Media 30 days after the decision or appeal; signals 12 months |
| VR13 | Also turn off today's QA comment and post AI moderation | Yes. Off in QA and stage; prod goes through shadow, then enforce |
| VR14 | Budget stop reached | Send unchecked videos to a person; $10/day stop plus a cost-monitor alert |
| VR15 | Existing library | No backfill now. Option: an NSFW-only backfill (about $150 per 5,000 h) after a cost report |
| VR16 | Other images | On an NSFW hit, withhold only the image until reviewed; other risks are flag-only |
