[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Transcription, translation and inline translation (Quran-aware)

| | |
|---|---|
| **ID** | `AUN-CAPTIONS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (later AlUmmahNowCMS for the shared provider layer, and the native Studio apps) |
| **Status** | **planned** |
| **Last updated** | 2026-11-11 (v2) |

> v1 spec merged in [#816](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/816). The v2 update is in PR [#819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/819): [spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/5e677cdee1e595f1c0370e68c5196dbb09cb030c/docs/specs/TRANSCRIPTION-TRANSLATION.md) · [research](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/5e677cdee1e595f1c0370e68c5196dbb09cb030c/docs/research/TRANSCRIPTION-TRANSLATION-RESEARCH.md). v2 adds the zero-mistake Quran design, Quran Foundation Content Sync as the Quran source, DeepL measured, and the full price comparison.

## Goal

- **Subtitles on demand:** a creator can ask for subtitles on a video, in its own language and in other languages. Nothing is ever automatic: there is a Transcribe or Translate action in Studio, or a flag at upload.
- **Draft first:** the transcript is a draft that the creator corrects in an editor before publishing.
- **Translated metadata:** titles and descriptions get a Translate button, en↔ar first.
- **Quran, zero mistakes:** ASR text is never shown for Quran. A confirmed span renders the official Uthmani text for its exact word range; anything uncertain shows a reference only, with no text. Quran is never machine-translated or machine-spoken.

## Recommendation (measured 2026-11-11)

| | Choice | Cost |
|---|---|---|
| Speech-to-text | Workers AI Whisper large-v3-turbo, with VAD **off** (VAD deleted speech in tests) | $0.034 per video-hour |
| High-accuracy STT (higher tiers) | DeepL Voice on the owner's API Pro account. Measured best on Arabic (Al-Mulk 2.1% WER vs 6.2%), but real-time streaming only. ElevenLabs Scribe is still unmeasured | $1.85/h (Scribe $0.20/h) |
| Premium translation (higher tiers) | DeepL API Pro with a glossary: fast, and the glossary fixes names. It still made meaning slips the default didn't | $27.50 per 1M chars ≈ $1.00/h of speech |
| Transcript translation | DeepSeek V4.1 Flash on Workers AI, falling back to Gemma 4 26B | $0.024/h per language |
| Inline title translation | Gemma 4 26B, falling back to DeepSeek. Free on every tier with a fair-use cap. | about $0.00002 per title |
| Not used | Bunny transcription ($6/h per language, no better), m2m100 (unusable), Cloudflare Stream captions (no Arabic) | |
| Quran text | **Quran Foundation Content Sync** (`quran_core:1`, `mushafs:4`): a local copy synced at least every 7 days, crediting QF. Tanzil **XML** is the fallback (the TXT export glues the basmala onto ayah 1) | free; needs a QF Developer Console app |
| Quran translations | QF Content Sync `translations:<id>` for public editions, with QuranEnc as fallback; English default Saheeh International | free, with attribution and version |

## Zero-mistake Quran: measured on 20 clips (2026-11-11)

The clips cover 10 reciters, murattal and mujawwad, partial ayat cut at word boundaries, a lecture quote and 6 production lectures.

| Risk | Result |
|---|---|
| Wrong ayah shown | **0** (96 of 110 recited ayat auto-suggested; the rest go to review) |
| Words shown that weren't recited | **0** (91% of recited words shown) |
| False Quran candidates in lectures | 6, all sent to review, **none shown** |
| Ayah-start timing | median **33 ms**, p90 278 ms, after snapping to recitation pauses |

Every Quran span still needs creator confirmation before it is published (O14).

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

**Cap:** tier minutes and a $100 captions budget stop keep usage inside the $500 cap.

## Stories (phases)

| Story | What | Status / acceptance notes |
|---|---|---|
| P0 | Provider interfaces, QF Developer Console app + Content Sync job, zero-mistake Quran detector, glossary, translation cache, additive entitlement grants | planned |
| P1 | Inline title/description translation (upload, Studio, Set values), Quran-aware titles | planned; p95 ≤ 2 s |
| P2 | On-demand transcription: jobs, queue, audio-extraction container, editor, publish, metering with refunds, budget stop | planned |
| P3 | Transcript translation with official Quran translations; bulk actions; upload flag; admin grants | planned |
| P4 | ElevenLabs/DeepL adapters, viewer-side translated titles (owner decision) | planned |
| P5 | Transcript search; native Studio Subtitles tab; on-device desktop transcription | planned |

Follow-ups found: [#813](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/813) (moderation still uses m2m100), [#814](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/814) (purge leaves subtitle files).

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)
- [D10](decisions.md#d10-transcription-location): Transcription location (open; measurements added 2026-11-11)
- The open owner decisions O1–O15 (including O12: register the QF Developer Console app; O13: questions for QF; O14: mandatory Quran confirmation) (ElevenLabs/DeepL keys, tier minutes, budget, viewer-side titles, Quran editions) are in spec §14.
