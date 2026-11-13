[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Transcription, translation and inline translation (Quran-aware)

| | |
|---|---|
| **ID** | `AUN-CAPTIONS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (later AlUmmahNowCMS for the shared provider layer, and the native Studio apps) |
| **Status** | **in progress** (owner go 2026-11-13) |
| **Last updated** | 2026-11-13 (build started: mode A) |

> v1 spec merged in [#816](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/816). The v2 update is in PR [#819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/819): [spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/72b76733fe10c4aa4185433ac3f1b23bdb47f93c/docs/specs/TRANSCRIPTION-TRANSLATION.md) · [research](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/72b76733fe10c4aa4185433ac3f1b23bdb47f93c/docs/research/TRANSCRIPTION-TRANSLATION-RESEARCH.md). v2 adds the zero-mistake Quran design, Quran identify-vs-store split (QF permission email drafted), DeepL measured, and the full price comparison. v3 ([#826](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/826)): quran.com-only Quran fetched live, "Confirm all suggested", DeepL tested on lectures.

> **2026-11-13, owner go:** build now with **mode A**, a local index from the Quran Foundation Content Sync copy. QF search (mode B) is not used because the `search` scope is not granted. The Arabic text comes from our daily Content Sync copy; translations stay live; captions store references only. QA and stage sync from production QF, each into its own bucket. Tests use fixtures only. Stacked PRs: [#1303](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1303) Quran foundations (Content Sync job, matcher, passage API) → [#1271](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1271) (the video review uses the matcher) → caption drafts → [#1296](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1296) (review transcript → caption draft). As built: spec §5.5.1.

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
| Quran: source | **quran.com (Quran Foundation) only**. Captions store references. The Arabic text is served from our daily **Content Sync copy** (owner 2026-11-13); translations are fetched live. A copy not synced for 7 days is deleted (QF terms) → reference plus a quran.com link | free |
| Quran: identify | **Mode A:** a local index built from the Content Sync copy, rebuilt after each daily sync (27/55 auto, 0 wrong, 0/20 false). QF search isn't used (no `search` scope); an index built from regular API responses isn't allowed | free |
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

## Stories (phases)

| Story | What | Status / acceptance notes |
|---|---|---|
| P0 | QF Content Sync copy and index (daily, queued, retry + DLQ, admin flag, 7-day deletion), zero-mistake Quran matcher, `GET /api/v1/quran/passage`; then provider interfaces, glossary, translation cache, additive entitlement grants | in progress: [#1303](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1303) |
| P1 | Inline title/description translation (upload, Studio, Set values), Quran-aware titles | planned; p95 ≤ 2 s |
| P2 | On-demand transcription: jobs, queue, audio-extraction container, editor, publish, metering with refunds, budget stop | planned |
| P3 | Transcript translation with official Quran translations; bulk actions; upload flag; admin grants | planned |
| P4 | ElevenLabs/DeepL adapters, viewer-side translated titles (owner decision) | planned |
| P5 | Transcript search; native Studio Subtitles tab; on-device desktop transcription | planned |

Follow-ups found: [#813](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/813) (moderation still uses m2m100), [#814](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/814) (purge leaves subtitle files).

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)
- [D10](decisions.md#d10-transcription-location): Transcription location (open; measurements added 2026-11-11)
- The open owner decisions O1–O15 (O12: QF granular scopes work, Search scope pending; **O13: QF permission email sent 2026-11-11, awaiting reply**; O14: creator confirms Quran) (ElevenLabs/DeepL keys, tier minutes, budget, viewer-side titles, Quran editions) are in spec §14.
