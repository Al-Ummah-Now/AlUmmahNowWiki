[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Pre-publication video review (In review, NSFW and content checks)

| | |
|---|---|
| **ID** | `AUN-VIDEO-REVIEW` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (api-videos, processor, media, scheduler, admin-api, admin-web, web). The native Studio apps show the new status |
| **Status** | **built, shipping with mode off**: AlUmmahNow #1269, #1270, #1273, #1277, #1280, #1283, #1285 and #1293 (2026-11-13). Production goes to shadow after the release that contains them |
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
4. **Studio** shows **In review** in text with an icon, and "usually within 5 minutes" for the automated check (admin-editable); a flagged video reads "a reviewer will check it" with the live queue time (VR6). The owner can still watch the video and edit its metadata.
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

**Other images.** An NSFW hit on a community post image holds the whole post until a reviewer decides (VR16). On an avatar, banner or profile picture, only the image is withheld: the default tile shows in its place, and the image goes to the queue blurred. Each check costs about $0.00004.

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
- **Per-channel policy:** checked before publishing (the default: auto-approved below the thresholds, a person only when flagged, VR1), or trusted post-hoc. Trusted status is granted by an admin only.
- **Plan default:** the entitlement `review.policy`. Institution and Staff plans default to post-hoc. Safety checks are never tiered off.
- **Thresholds per category, SLA and budget:**
  - thresholds are set per category
  - the creator ETA for the automated check starts at 5 minutes (VR6)
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

## Owner decisions (2026-11-13)

| # | Decision |
|---|---|
| VR1 | **Changed.** The AI checks every video from day one; a person sees it only when the AI flags or holds it. There is no "first 5 videos always human" rule. Admin-granted trusted channels keep post-hoc review |
| VR2 | Yes. An NSFW hit always holds the video, and pulls a published video on a trusted channel back to In review |
| VR3 | Models approved as listed. m2m100 is retired (#813) |
| VR4 | Every 2 s plus every scene cut, capped at 1,200 frames |
| VR5 | Seed thresholds as recommended, and **every threshold is admin-configurable** |
| VR6 | **Changed.** Creators see "usually within 5 minutes" for the automated check (admin-editable). A flagged video reads "a reviewer will check it", with the live queue time. Reviewers get instant alerts |
| VR7 | Two roles, `content_reviewer` and senior. The owner is the first senior reviewer |
| VR8 | Publish on approval, and tell the creator |
| VR9 | The VOD is reviewed post-hoc |
| VR10 | Edit and resubmit; one appeal, handled by a different reviewer |
| VR11 | Yes, as an opt-in caption draft. Once the creator claims it, it is their caption, not a review copy |
| VR12 | Media 30 days after the decision or appeal; signals 12 months |
| VR13 | Yes. Epic 28 is turned off in QA and stage now (#1242). Prod goes shadow, then enforce |
| VR14 | The budget is set in admin. When it stops, videos are queued for a person |
| VR15 | No backfill |
| VR16 | **Changed.** An NSFW hit on a community post image holds the **whole post** until a reviewer decides. Avatars, banners and profile pictures have no post to hold, so only the image is withheld and the default tile shows |

The native admin app is specified separately. The review API is built for a native client too: JSON, cursor paging, and push alerts to reviewers.

## Operating it

- **Switch:** admin → Moderation → Videos in review → Settings. Admins only, and every change is audited. The stored settings live in global_settings `video-review/settings.json`; every worker picks a change up within 30 seconds.
  - Modes: `off`, `shadow`, `enforce_nsfw`, `enforce`.
  - Also set there: the creator ETA, the daily budget, media retention and every threshold.
- **Environments:** QA and stage never run review. `VIDEO_REVIEW_ALLOWED` is `"true"` only in production, and `check:config` pins it.
- **Queue:**
  - Action needed, Checking (stalled checks), History, and Shadow mode (the rollout report).
  - Escalations (minors, extremism) go to senior reviewers only; an appeal is decided by a different reviewer.
  - Decisions can be undone for 10 minutes.
  - NSFW media stays blurred until a reviewer presses Show, and every Show is audited.
- **Alerts:** each reviewer turns on instant alerts in the queue. Each alert is an in-app and push `reviewNeeded` notice, plus a live admin event.
- **Who reviews:**
  - Admins and moderators review today; super admins count as seniors.
  - The `content_reviewer` and `senior_reviewer` roles reach `/api/review` only.
  - A review-only admin-web sign-in and the Auth roles are AlUmmahNow#1284.
- **What creators see:**
  - Studio shows the status: **In review** (usually within N minutes, or "a reviewer will check it" with the live queue time) or **Not approved** (with the reason, edit and check again, and appeal once).
  - In-app notices `reviewApproved` and `reviewRejected`; the email is AlUmmahNow#1279.
- **Trusted channels:** admin-api `PUT /api/review/channels/:id/trust` gives a channel post-hoc review. NSFW still pulls a video back.
- **Images (VR16):** a post with an NSFW image is held whole. An avatar, banner or profile picture stays pending until clean.
- **Cost and spend:**
  - Costs go to `ai_usage_daily` under the feature `video_review`.
  - At the daily budget stop, videos wait for a person.
- **Retention:** a daily cron deletes review media and finding text 30 days after the decision, and findings after 12 months.
- **Tests:**
  - A fixture provider stands in for every model; markers in the title choose the outcome, for example `[review-fixture:nsfw_frame@42000]`.
  - The Workers AI adapter refuses to build under test, CI or E2E.
- **Follow-ups:**
  - the Quran matcher hook (#1271)
  - the rejection email (#1279)
  - reviewer sign-in and the Auth roles (#1284)

## Build plan (as built)

The code ships with `video_review.mode = off`. Once it is deployed to production, the mode moves to `shadow`, then to `enforce_nsfw` and finally to `enforce`. Each step is an admin switch. Outside production the env gate `VIDEO_REVIEW_ALLOWED` is unset, so the mode is always off there. The full contract lives in AlUmmahNow `docs/specs/VIDEO-REVIEW.md`. The work is split into these PRs:

1. **Epic 28 off in QA and stage** (#1242).
2. **Foundation:**
   - shared-types review types and config
   - a `review` field on videos, gated in `isVideoReady`
   - reports D1 tables `video_reviews` and `video_review_findings`
   - the env gate
   - upload complete marks a video `checking` in enforce mode
3. **Processor review pipeline:**
   - a `ModerationProvider` interface with a Workers AI adapter and a fixture adapter, plus a loud guard in tests
   - the checks: clef-flash, Gemma 4, Whisper and Llama Guard
   - risk routing and the admin budget
4. **Media transcoder:** extracts frames (every 2 s plus scene cuts, capped at 1,200) and 16 kHz audio chunks into `review/<videoId>/` in the same pass. The job event carries their keys.
5. **api-videos:**
   - an internal decision endpoint, the single writer of a video's review state
   - `publishedAt` and the subscriber announcement on approval
   - the creator notice (in-app and email, en/ar)
   - the appeal flow
   - Studio badges and ETA
   - scheduled publish on approval
   - the caption-draft claim
   - post-hoc review of live VODs
6. **admin-api review API (native-ready):**
   - the queue and item detail
   - decide, with undo
   - an audited reveal
   - config and stats
   - the two roles
   - instant reviewer alerts (in-app, websocket and push)
   - the retention purge
7. **admin-web review queue UI**, plus settings.
8. **Images:**
   - a community post with a flagged image is held as a whole post
   - an avatar, banner or profile picture has only its image withheld
9. **Arabic text moderation:** Gemma 4 replaces m2m100 (#813).
