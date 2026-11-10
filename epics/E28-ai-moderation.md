[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 28: AI-assisted moderation & flagging (Cloudflare Workers AI)

| | |
|---|---|
| **ID** | `E28` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> Phase A in progress (EPIC-28-PLAN, 2026-11-08): schema, processor, producers, admin-api and admin-web PRs; later phases are `queue` issues. Chat (Epic 28 thread): merged and on QA in shadow / flag-only mode.

## Goal

Workers AI signals on comments, posts and videos in shadow mode first; AI never deletes, only holds, and humans review.

## Scope

- Phase A: 28.1, 28.3, 28.4, 28.5 + kill switch, daily budget cap, usage logging (shadow mode)
- Phase B: enable holds for spam/scam/sexual once eval targets are met
- Phase C: media, transcripts, creator controls, appeals
- Phase D: live chat, triage assistant
- Cost: daily neuron budget cap per environment, within the platform's ≤ $500/month cap

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 28.1 | Moderation queue, `moderation_signals` schema, decision engine | P0, Phase A |
| 28.2 | Fast path: normalisation, keyword/link rules, trust score | P0, queued |
| 28.3 | Text pipeline: language detect → translate → Llama Guard + extension classifier | P0, Phase A |
| 28.4 | Golden evaluation set + CI eval + shadow mode | P0, Phase A |
| 28.5 | Admin queue UI | P0, Phase A |
| 28.6 | Media pipeline (vision) | P1, queued |
| 28.7 | Whisper transcripts, draft captions | P1, queued |
| 28.8 | Spam clustering (bge-m3) | P1, queued |
| 28.9 | CSAM Scanning Tool + reporting runbook | P0, queued |
| 28.10 | Creator & Site moderation controls | P1, queued |
| 28.11 | Appeals flow + notices (en/ar) | P1, queued |
| 28.12 | Live chat fast path | P2, queued |
| 28.13 | Admin config, model/prompt versioning | P1, queued |
| 28.14 | Report triage assistant | P2, queued |

## Decisions and constraints

- [M1](decisions.md#m1-extension-classifier-model): Extension classifier model (open)
- [M2](decisions.md#m2-auto-hide-scope): Auto-hide scope (open)
- [M3](decisions.md#m3-religiousauthenticity-flags): `religious_authenticity` flags (open)
- [M4](decisions.md#m4-csam-coverage-for-r2-served-media): CSAM coverage for R2-served media (open)
- [M5](decisions.md#m5-reviewer-staffing--slas): Reviewer staffing & SLAs (open)
- [M6](decisions.md#m6-transparency-reporting): Transparency reporting (open)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#328](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/328) | PR | docs(epic-28): AI moderation implementation plan | MERGED | 2026-11-08 |
| AlUmmahNow | [#330](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/330) | PR | feat(epic-28): AI moderation D1 schema and shared types | MERGED | 2026-11-08 |
| AlUmmahNow | [#343](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/343) | PR | feat(epic-28): processor moderation consumer on Workers AI (shadow mode) | MERGED | 2026-11-08 |
| AlUmmahNow | [#366](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/366) | PR | feat(epic-28): api-videos sends ModerationScan on content writes | MERGED | 2026-11-08 |
| AlUmmahNow | [#381](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/381) | PR | feat(epic-28): admin-api review endpoints for AI moderation | MERGED | 2026-11-08 |
| AlUmmahNow | [#384](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/384) | PR | feat(epic-28): admin-web AI moderation queue, review and settings (en/ar) | MERGED | 2026-11-08 |
| AlUmmahNow | [#386](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/386) | issue | Release regressions (qa): uploads and sign-up specs fail intermittently on PRs | OPEN | 2026-11-08 |
| AlUmmahNow | [#392](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/392) | issue | Epic 28.2: moderation fast path and trust score | OPEN | 2026-11-08 |
| AlUmmahNow | [#393](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/393) | issue | Epic 28 Phase B: automatic reversible hide for spam/charity_scam | OPEN | 2026-11-08 |
| AlUmmahNow | [#394](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/394) | issue | Epic 28.6: vision checks for thumbnails, avatars, banners, post images and video frames | OPEN | 2026-11-08 |
| AlUmmahNow | [#395](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/395) | issue | Epic 28.7: Whisper transcripts, transcript safety and draft captions | OPEN | 2026-11-08 |
| AlUmmahNow | [#396](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/396) | issue | Epic 28.8: spam clustering with bge-m3 embeddings and bulk takedown | OPEN | 2026-11-08 |
| AlUmmahNow | [#397](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/397) | issue | Epic 28.9: CSAM Scanning Tool enablement and NCMEC/regional reporting runbook | OPEN | 2026-11-08 |
| AlUmmahNow | [#398](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/398) | issue | Epic 28.10: creator and site moderation controls with entitlements | OPEN | 2026-11-08 |
| AlUmmahNow | [#399](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/399) | issue | Epic 28.11: appeals flow and user notices (en/ar) | OPEN | 2026-11-08 |
| AlUmmahNow | [#400](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/400) | issue | Epic 28: hide/restore for community posts and post comments | OPEN | 2026-11-08 |
| AlUmmahNow | [#401](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/401) | issue | Epic 28: scan channel/profile names and bios (impersonation) | OPEN | 2026-11-08 |
| AlUmmahNow | [#402](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/402) | issue | Epic 28.12/28.13/28.14: live chat fast path, staged model/prompt rollout, report triage assistant | OPEN | 2026-11-08 |
| AlUmmahNow | [#403](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/403) | issue | Cost dashboard: add Workers AI (moderation) usage | OPEN | 2026-11-08 |
| AlUmmahNow | [#404](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/404) | issue | Epic 28: route Workers AI through AI Gateway | OPEN | 2026-11-08 |
| AlUmmahNow | [#405](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/405) | PR | fix(epic-28): null top category for all-zero moderation scores | MERGED | 2026-11-08 |
| AlUmmahNow | [#407](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/407) | issue | Epic 28: calibrate thresholds on shadow data (short-text spam, Llama Guard S13 false positives) | OPEN | 2026-11-08 |
| AlUmmahNowCMS | [#17](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/17) | issue | AI writing assist for editors (translate en↔ar, SEO meta, content checks) | CLOSED | 2026-11-10 |
| AlUmmahNowCMS | [#47](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/47) | PR | feat: AI writing assist for editors (translate en↔ar, SEO copy, pre-publish checks) | MERGED | 2026-11-10 |

## Open questions

- Q2: create the AI Gateway per environment now or after shadow?
- Q3/M5: reviewer staffing and SLAs.
- Q4: production cap of 100k neurons/day acceptable?
- Q5/M4: CSAM tool coverage for Bunny/R2-served images.

## Conflicts between sources

- AI-MODERATION.md phasing puts 28.9 (CSAM) in Phase A; EPIC-28-PLAN lists 28.9 under later `queue` issues.
- CMS AI writing assist sends staff drafts to the Claude API, recorded in `AlUmmahNowCMS/docs/AI_ASSIST_SPEC.md` as a "deliberate, scoped exception" to this epic's rule that content stays inside Cloudflare with no third-party AI vendors.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/specs/AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/AI-MODERATION.md)
- [docs/specs/EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-28-PLAN.md)
