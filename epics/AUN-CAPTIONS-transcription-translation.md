[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Transcription, translation and inline translation (Quran-aware)

| | |
|---|---|
| **ID** | `AUN-CAPTIONS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (later AlUmmahNowCMS for the shared provider layer, and the native Studio apps) |
| **Status** | **planned** |
| **Last updated** | 2026-11-11 |

> The spec and research are in PR [#816](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/816): [spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/614c4e302fa1d11110f5d59a6494c2b213f99d21/docs/specs/TRANSCRIPTION-TRANSLATION.md) · [research and measurements](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/614c4e302fa1d11110f5d59a6494c2b213f99d21/docs/research/TRANSCRIPTION-TRANSLATION-RESEARCH.md).

## Goal

- **Subtitles on demand:** a creator can ask for subtitles on a video, in its own language and in other languages. Nothing is ever automatic: there is a Transcribe or Translate action in Studio, or a flag at upload.
- **Draft first:** the transcript is a draft that the creator corrects in an editor before publishing.
- **Translated metadata:** titles and descriptions get a Translate button, en↔ar first.
- **Quran:** recognised Quran is shown in the official Uthmani text, and its translation is a recognised edition, never machine translation.

## Recommendation (measured 2026-11-11)

| | Choice | Cost |
|---|---|---|
| Speech-to-text | Workers AI Whisper large-v3-turbo, with VAD **off** (VAD deleted speech in tests) | $0.034 per video-hour |
| High-accuracy fallback | ElevenLabs Scribe v3, admin-enabled (needs a key; not measured yet) | $0.20/h |
| Transcript translation | DeepSeek V4.1 Flash on Workers AI, falling back to Gemma 4 26B | $0.024/h per language |
| Inline title translation | Gemma 4 26B, falling back to DeepSeek. Free on every tier with a fair-use cap. | about $0.00002 per title |
| Not used | Bunny transcription ($6/h per language, no better), m2m100 (unusable), Cloudflare Stream captions (no Arabic) | |
| Quran text | Tanzil Uthmani 1.1, stored offline (CC BY 3.0, verbatim) | free |
| Quran translations | QuranEnc editions, stored offline; English default `english_saheeh` (Noor International) | free, with attribution and version |

**Scale:** about $6 a month at 100 h of jobs, $58 at 1,000 h and $578 at 10,000 h. Tier minutes and a $100 captions budget stop keep it inside the $500 cap.

## Stories (phases)

| Story | What | Status / acceptance notes |
|---|---|---|
| P0 | Provider interfaces, Quran data and detector, glossary, translation cache, additive entitlement grants | planned |
| P1 | Inline title/description translation (upload, Studio, Set values), Quran-aware titles | planned; p95 ≤ 2 s |
| P2 | On-demand transcription: jobs, queue, audio-extraction container, editor, publish, metering with refunds, budget stop | planned |
| P3 | Transcript translation with official Quran translations; bulk actions; upload flag; admin grants | planned |
| P4 | ElevenLabs/DeepL adapters, viewer-side translated titles (owner decision) | planned |
| P5 | Transcript search; native Studio Subtitles tab; on-device desktop transcription | planned |

Follow-ups found: [#813](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/813) (moderation still uses m2m100), [#814](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/814) (purge leaves subtitle files).

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)
- [D10](decisions.md#d10-transcription-location): Transcription location (open; measurements added 2026-11-11)
- The open owner decisions O1–O11 (ElevenLabs/DeepL keys, tier minutes, budget, viewer-side titles, Quran editions) are in spec §14.
