[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Transcription, translation and inline translation (Quran-aware)

| | |
|---|---|
| **ID** | `AUN-CAPTIONS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (later AlUmmahNowCMS for the shared provider layer, and the native Studio apps) |
| **Status** | **in progress**: transcription is live: the Quran index (v2026.11.13.10), caption drafts, transcription jobs and caption minutes per tier with grants (v2026.11.14), and Studio's Transcribe button (v2026.11.14.3); AlUmmahNow #1303, #1311, #1312, #1315, #1318, #1332. On-device desktop transcription (D10) is in review in [AlUmmahNow#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386) and [AlUmmahNowCore#43](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/43). Translation is in review in [AlUmmahNow#1398](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1398): Studio's Translate on a caption draft (queued per language, counted in caption minutes), Quran in the channel's Quran Foundation edition, the inline en/ar Translate button, and labelled viewer titles (an admin setting, on by default, waiting for the owner, P4). Transcript search is in review in [AlUmmahNow#1401](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1401). **QF terms (2026-11-21):** audit and backend fixes in [AlUmmahNow#1716](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1716); attribution in every Quran cue and in Studio in [AlUmmahNow#1722](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1722), held for the owner's screenshots (see below). **QF answers (2026-11-22):** one-video subtitle downloads, `mushafs:4` word cuts and the no-ML guard in [AlUmmahNow#1734](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1734), **live in v2026.11.22** |
| **Last updated** | 2026-11-22 |

> v1 spec merged in [#816](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/816). The v2 update is in PR [#819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/819): [spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/72b76733fe10c4aa4185433ac3f1b23bdb47f93c/docs/specs/TRANSCRIPTION-TRANSLATION.md) · [research](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/72b76733fe10c4aa4185433ac3f1b23bdb47f93c/docs/research/TRANSCRIPTION-TRANSLATION-RESEARCH.md). v2 adds the zero-mistake Quran design, Quran identify-vs-store split (QF permission email drafted), DeepL measured, and the full price comparison. v3 ([#826](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/826)): quran.com-only Quran fetched live, "Confirm all suggested", DeepL tested on lectures.

## Goal

- **Subtitles on demand:** a creator can ask for subtitles on a video, in its own language and in other languages. Nothing is ever automatic: there is a Transcribe or Translate action in Studio, or a flag at upload.
- **Draft first:** the transcript is a draft that the creator corrects in an editor before publishing.
- **Translated metadata:** titles and descriptions get a Translate button, en↔ar first.
- **Quran, zero mistakes:** ASR text is never shown for Quran. A confirmed span renders the official Uthmani text for its exact word range; anything uncertain shows a reference only, with no text. Quran is never machine-translated or machine-spoken.

## Recommendation (measured 2026-11-11)

| | Choice | Cost |
|---|---|---|
| Speech-to-text | Workers AI Whisper large-v3-turbo, with VAD **off** (VAD deleted speech in tests) | $0.034 per video-hour |
| High-accuracy STT (optional, off by default) | **ElevenLabs Scribe v3 preferred.** Measured best on Quran (WER 1.1–1.4%; Ar-Rahman mujawwad 25/25 ayat vs Workers AI 16/25, DeepL 7/25); 2–5 s per clip. It needs an ElevenLabs plan for production (Creator $22/month ≈ 110 h; Pro $99 ≈ 495 h). DeepL Voice stays an alternative on API Pro. Never in tests or QA | $0.20/h (Scribe), $1.85/h (DeepL) |
| Premium translation (optional, off by default) | DeepL API Pro with a glossary: fast, and the glossary fixes names. It still made meaning slips the default didn't | $27.50 per 1M chars ≈ $1.00/h of speech |
| Transcript translation | DeepSeek V4.1 Flash on Workers AI, falling back to Gemma 4 26B | $0.024/h per language |
| Inline title translation | Gemma 4 26B, falling back to DeepSeek. Free on every tier with a daily fair-use limit (O5); the $20/month budget is the backstop. | about $0.00002 per title |
| Not used | Bunny transcription ($6/h per language, no better), m2m100 (unusable), Cloudflare Stream captions (no Arabic) | |
| Quran: source | **quran.com (Quran Foundation API) only**. Captions store references; the player fetches text and translation live (edge cache ≤ 6 days); QF down → reference plus a quran.com link | free |
| Quran: identify | Now: QF search + Content fetch + our verification (22/55 auto, 0 wrong, 0/20 false). Later: a local index from Content Sync once QF grants it; an index built from regular API responses isn't allowed | free |
| Quran translations | QF `translations` by id, fetched live. Each channel picks its edition per language (platform default Saheeh International, changeable by admins); edition name shown (O7) | free, with attribution |

## Zero-mistake Quran: measured on 20 clips (2026-11-11)

The clips cover 10 reciters, murattal and mujawwad, partial ayat cut at word boundaries, a lecture quote and 6 production lectures.

| Risk | Result |
|---|---|
| Wrong ayah shown | **0** (96 of 110 recited ayat auto-suggested; the rest go to review) |
| Words shown that weren't recited | **0** (91% of recited words shown) |
| False Quran candidates in lectures | 6, all sent to review, **none shown** |
| Ayah-start timing | median **33 ms**, p90 278 ms, after snapping to recitation pauses |

The creator confirms Quran spans before publishing (decided). "Confirm all suggested" covers high-confidence matches, and unsure matches publish as a reference plus a quran.com link.

## Lectures: Workers AI vs DeepL (5.3 min, adjudicated reference)

| Engine | WER |
|---|---|
| DeepL | 3.1% |
| Workers AI | 3.4% |
| local whisper.cpp | 6.9% |
| Bunny | 32.4% |

- Parity on lectures. DeepL is better on hadith and Quran wording; Workers AI hallucinated a subtitle credit at the end of one clip.
- Workers AI stays the default; DeepL remains the paid high-accuracy option.

## Price comparison

Transcription plus one translation language, including the Quran pipeline (≈ $0.001/h):

| Stack | 100 h/month | 1,000 h | 10,000 h |
|---|---|---|---|
| **Default: Workers AI ASR + Workers AI translation** | **$6** | **$59** | **$590** |
| Workers AI ASR + DeepL Pro translation | $109 | $1,044 | $10,393 |
| DeepL Voice STT + DeepL translation (Pro) | $291 | $2,859 | $28,543 |
| Same on DeepL Growth | $272 | $2,840 | not possible (300 voice-hour and 50M-character caps) |
| ElevenLabs Scribe + Workers AI translation | $23 | $228 | $2,280 |
| Default + DeepL second opinion on Quran minutes (10% of audio) | $24 | $244 | $2,440 |
| Bunny | $1,200 | $12,000 | $120,000 |

**DeepL plan:** Growth ($32.50/month) only beats Pro ($5.49/month plus usage) above about 1M characters a month. Pro has no volume cap.

**Cap:** caption allowances and pack prices will be set by the site-wide subscription plan (pending, decision 3/13); until then, captions are by admin grant only. Budgets (O4): captions $100/month and inline translation $20/month, with daily slices and `waiting_budget` plus an admin alert. **Tests never burn the budget:** automated suites use mocked providers, and QA and stage have their own $5 budgets.

**Also decided 2026-11-11:** viewer-side auto-translated titles, labelled, with per-channel opt-out (O6); Arabic subtitles keep the spoken honorific by default, with ﷺ per channel (O10).

> **2026-11-21:** transcripts are translated into the other site language as caption drafts that a person publishes, labelled machine translated until edited, and local (desktop) transcripts from the admin importer use the on-device route. See [TOOLS-ADMIN](TOOLS-ADMIN-admin-import-tool.md) TA-7, TA-13 and TA-20.

## Stories (phases)

| Story | What | Status / acceptance notes |
|---|---|---|
| P0 | Provider interfaces, Quran store from Tanzil/QuranEnc (QF sync once cleared), zero-mistake Quran detector, glossary, translation cache, additive entitlement grants | planned |
| P1 | Inline title/description translation (upload, Studio, Set values), Quran-aware titles | Building in [AlUmmahNow#1398](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1398): Translate on every en/ar pair, daily fair-use limit, $20/month backstop with an admin kill switch; `{…}` Quran references kept; p95 ≤ 2 s |
| P2 | On-demand transcription: jobs, queue, audio-extraction container, editor, publish, metering with refunds, budget stop | planned |
| P3 | Transcript translation with official Quran translations; bulk actions; upload flag; admin grants | Building in [AlUmmahNow#1398](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1398): Translate on a source draft into up to 6 languages, queued per language with retry/DLQ and refunds, drafts labelled machine translation, channel Quran edition per language; admin grants are live |
| P4 | ElevenLabs/DeepL adapters, viewer-side translated titles (owner decision) | Building in [AlUmmahNow#1398](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1398): DeepL Pro adapter (off by default, admin switch); viewer titles labelled "Auto-translated" with "Show original", en/ar only, with a channel opt-out. Whether viewers see them is **waiting for the owner**, so it is an admin setting (Admin → Captions & translation → "Show viewers machine-translated titles"), on by default as built: either answer is a toggle, not a rebuild. ElevenLabs not built |
| P5 | Transcript search; native Studio Subtitles tab; on-device desktop transcription | On-device transcription building: Studio uploads whisper.cpp segments, the server runs the Quran layer and writes an `on_device` draft with no caption minutes spent ([AlUmmahNow#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386), [AlUmmahNowCore#43](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/43), [AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36)). Transcript search building in [AlUmmahNow#1401](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1401): published tracks indexed as timed passages through the queue (Quran never indexed, private videos never match), search lists "Said in videos" and opens the watch page at `?t=`. The native Subtitles tab is planned. |
| DEEPL-KEY | DeepL API key set in the videos admin instead of only a deployment secret | Building in [AlUmmahNow#1728](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1728). **Caption settings → DeepL API key** is for super admins only; other admins see its state. The field is write-only and shows the last 4 characters, the plan (keys ending in `:fx` are Free and go to `api-free.deepl.com`; other keys are Pro), who set it and when, and the last **Test key** result (DeepL `/v2/usage`: characters used of the limit). **Remove** asks first. Every change is audited without the key. admin-api encrypts the key (AES-256-GCM, the cost-credentials scheme, SEARCH_DB `service_credentials`); api-videos and the processor decrypt it in memory for each job. The admin key wins, and the bound `AI_KEY_DEEPL` secret is still used when no admin key is set. A refused (401/403) or used-up (456) key flags the Errors page (`deepl-key`; Retry runs the key test), and the job falls back to Workers AI. The Costs page shows DeepL characters and the estimated cost; this is for information only, since the Workers AI line already includes DeepL. Tests mock DeepL. |

Follow-ups found: [#813](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/813) (moderation still uses m2m100), [#814](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/814) (purge leaves subtitle files).

## Quran text copy: operations

- **The copy** lives in each environment's private media bucket (`quran/current.json` → `quran/text/<version>/`, plus the matcher index), written by the processor's Content Sync (daily cron 03:41 UTC, or **Sync now** on the Errors page item `quran-sync`).
- **2026-11-16 incident:** the sync failed every day from 2026-11-14 in production, stage and QA. Four verses (2:181, 8:6, 13:37, 37:130) each have one QF word written as two (بَعْدَ مَا, إِلْ يَاسِينَ). That word's own Imla'i text has the same space, but the build split the verse on spaces and got one token too many. No copy was ever written, and the passage API answered 503. Fixed in [AlUmmahNow#1506](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1506): a word row spans as many Uthmani tokens as its Imla'i text has words, and the totals must still add up exactly.
- **Hidden while unavailable** (owner rule, "Hidden when off"): `GET /api/me/features` has `quranText`, true only while the copy is synced and fresh (under 7 days, per the QF terms). Without it:
  - `GET /api/v1/quran/passage` answers 404 `feature_off`, with one warning log per isolate. It is not a server error and never reaches the Errors page.
  - Studio's Quran span card shows only the reference and the quran.com link: no text, no "unavailable" note, and no Different reference.

## QF terms (2026-11-21)

Quran Foundation answered our permission email (O13) on 2026-11-21. These terms bind every app that touches Quran text, including the native apps, Tools and search:

> - No caption files that keep Quran text and translation permanently with each video; no exception or partnership.
> - Outside Content Sync, QF content may NOT be stored for more than 1 week. Compliant: store only verse keys + our own timestamps in captions; load text + translation at play time from the Content API, or from a Content Sync copy synced at least every 7 days.
> - Content Sync covers quran_core (Uthmani text, word-level data), translations, word-by-word translations, transliterations, tafsirs, recitations, chapter_recitations (word timing segments), articles.
> - No fixed rate limits; on HTTP 429 back off and honour Retry-After.
> - New backend apps with Client Credentials get granular scopes (content.quran.read, content.translations.read) instead of `content`. Frontend apps get no Content scope and must call Content through our backend.
> - Attribution wherever the text appears: "Quran data provided by Quran Foundation (https://quran.foundation/)" plus the translation edition by name.

Refs: [Content Sync, offline content](https://api-docs.quran.foundation/docs/tutorials/content-sync/getting-started#content-available-for-offline-sync) · [Quickstart](https://api-docs.quran.foundation/docs/quickstart/) · [FAQ: rate limits](https://api-docs.quran.foundation/docs/tutorials/faq#are-there-rate-limits) · [Connected apps: attribution](https://api-docs.quran.foundation/docs/connected-apps#content-and-attribution-requirements)

**Where we stand** (full audit table in spec §9.5):
- **Already compliant:**
  - Caption drafts, published tracks, transcript search, the review pipeline, transcript translation, inline translation and on-device captions store verse keys and our own timestamps only.
  - The Content Sync copy syncs daily and is deleted at 7 days.
  - The native apps make no direct QF calls, hold no credentials, keep no offline copies and bundle no Quran text.
  - No stored data violated the terms, so no cleanup job was needed.
- **Fixed in [AlUmmahNow#1716](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1716):**
  - 429 honoured everywhere we call QF (`Retry-After` in seconds or as an HTTP date, bounded backoff with jitter).
  - api-videos requests only `content.quran.read content.translations.read`; the processor requests `content.sync.read`. Both clients already hold these scopes, so nothing changes for the owner.
  - A copy not synced for over 3 days flags the admin (`quran-stale`, **Sync now**).
- **[AlUmmahNow#1722](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1722)**, held for the owner's screenshots:
  - Every served cue with Quran text or a translation ends with QF's attribution line (en, or ar right to left). A translated cue also names its edition.
  - Because the line is part of the cue, the web player, the native apps and embeds all show it without app releases.
  - Studio's span card uses the same wording.
- **Rules for other work:**
  - TOOLS-ADMIN: local transcription, transcript translations and SEO keywords.
  - DISCOVERY: the search index.
  - Store and send references only, never QF text. Quran spans are never machine-translated, never indexed as text, and never used as SEO keywords or descriptions.
  - Any QF text shown comes from our API, with the attribution line. No QF credentials in any app.

## QF answers (2026-11-22)

QF answered yes to all five follow-up questions. Decision record: [QF1](decisions.md#qf1-quran-foundation-content-use).

> 1. The derived index is OK, **never for ML training, fine-tuning or evaluation**.
> 2. `mushafs:4` is available; `mushaf_word` rows carry the Uthmani text, linked to quran_core words by `word_id`.
> 3. A viewer may download the subtitle file for one video with the verse text filled at download time, unaltered, with the attribution inside the file.
> 4. Offline device copies refreshed from our synced backend at least every 7 days are fine.
> 5. Web pages and JSON-LD are OK if the text is served fresh.

**What changed ([AlUmmahNow#1734](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1734), live in v2026.11.22):**
- **Downloads:** `GET /api/v1/videos/:id/subtitles/:lang/download?format=vtt|srt` returns one video's track as a file.
  - The verse text is filled at download time exactly as it is served for viewing.
  - QF's attribution (en + ar) and the edition go in a `NOTE` block in VTT, or a first zero-length cue in SRT.
  - The response is `no-store`, built for each request and never stored.
  - The player's download button is a visual change and waits for the owner's review.
- **Content Sync:** syncs `quran_core:1;mushafs:4`.
  - Verses are cut into words by `mushaf_word.text` (`word_id`), which is not stored twice.
  - It falls back to the Imla'i spans, with a warning, if the mushaf words are missing, not Uthmani, or differ.
- **No-ML guard:** the rule is written where the index is built and read, and in spec §9.4 and §9.6.
  - Audit: no pipeline uses the index, the QF text or QF timings as training or evaluation data. Fixtures are synthetic.
  - One 2026-11-11 research timing measurement used QF word segments as ground truth. It predates the answer, its data was never kept, and it is not repeated.
- **Offline and pages:** never restricted in code. No app keeps an offline copy and no page renders verse text today.
  - A future offline copy must refresh from our backend at least every 7 days.
  - A future page renders the text live, with the attribution.

**Rules for TOOLS-ADMIN and DISCOVERY (added):**
- Never export the index, Quran text or QF timings as a dataset, eval set or ML input.
- A download or export holds one video and fills the text at the moment it is made.

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)
- [D10](decisions.md#d10-transcription-location): Transcription location (decided 2026-11-14: server by default, on-device option in desktop Studio)
- [QF1](decisions.md#qf1-quran-foundation-content-use): Quran Foundation content use (decided 2026-11-22: index never for ML, one-video downloads, `mushafs:4`)
- The open owner decisions O1–O15 (O12: QF granular scopes work, Search scope pending; **O13: answered by QF 2026-11-21, see [QF terms](#qf-terms-2026-11-21)**; O14: creator confirms Quran) (ElevenLabs/DeepL keys, tier minutes, budget, viewer-side titles, Quran editions) are in spec §14.
