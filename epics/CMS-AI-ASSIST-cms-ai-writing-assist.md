[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# CMS AI writing assist

| | |
|---|---|
| **ID** | `CMS-AI-ASSIST` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-12 |

> Merged as CMS #47 (2026-11-10), then moved to Cloudflare Workers AI the same day (CMS #55), so it works with no key. Admins can add other providers as configuration, with a fallback and a monthly budget stop (CMS #65). Translation flags and a glossary followed (CMS #93).

## Goal

Editor helpers that only suggest: translate en↔ar, SEO and sharing copy, and a pre-publish check. Nothing is saved or published by the AI.

All three run on Cloudflare Workers AI by default, through the Worker's AI binding, so the text stays in Cloudflare and no key is needed. The default model ids are in [`src/lib/ai/prompts.ts`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/src/lib/ai/prompts.ts). An admin can add any other AI service with an HTTP API on the AI assist screen (`/ai-settings`), with no code, and pick a provider and model per feature ([`docs/AI_PROVIDERS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/AI_PROVIDERS.md)).

## Scope

- Cost logged per call. A monthly budget per environment (default $50, at most $500) stops new jobs and running jobs once reached (CMS #65).
- Editors can flag a word or sentence of a translation, fix it, re-translate it, and add terms to a glossary that the translate prompt uses (CMS #93, [`docs/TRANSLATION_FLAGS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/TRANSLATION_FLAGS.md)).
- Arabic titles get a short English address, with AI translation as the second choice after a linked English title (CMS #91).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| A1 | Migration `ai_jobs`, `ai_usage` |  |
| A2 | Queue bindings + consumers |  |
| A3 | Optional provider key | Replaced: Workers AI needs no key (CMS #55) |
| A4 | AI library (prompts, policy, pricing) |  |
| A5 | Admin AI API |  |
| A6 | Queue + DLQ consumers, cleanup |  |
| A7 | UI cards en/ar |  |
| A8 | Local E2E harness |  |
| A9 | QA E2E |  |
| A10 | Docs |  |

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- CMS [AlUmmahNowCMS#47](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/47), [AlUmmahNowCMS#55](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/55), [AlUmmahNowCMS#59](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/59), [AlUmmahNowCMS#65](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/65), [AlUmmahNowCMS#91](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/91), [AlUmmahNowCMS#93](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/93), issue [AlUmmahNowCMS#17](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/17)

## Open questions

- Two queue issues look done in code but are still open: [AlUmmahNowCMS#45](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/45) (a key for the old provider, not needed on Workers AI) and [AlUmmahNowCMS#46](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/46) (the monthly budget stop, shipped in CMS #65). They can be closed.
- Quran text: a flag on a Qur'an span offers "Use official text", which opens the ayah on quran.com. Inserting the official text and a recognised translation automatically is a gap noted in [`docs/TRANSLATION_FLAGS.md`](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/TRANSLATION_FLAGS.md).

## Conflicts between sources

- The first version was an exception to Epic 28's rule against third-party AI vendors (see [Epic 28](E28-ai-moderation.md)). Moving to Workers AI (CMS #55) removed it. Third-party providers are now optional and only an admin can switch one on.

## Sources

- [AlUmmahNowCMS/docs/AI_ASSIST_SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/AI_ASSIST_SPEC.md)
- [AlUmmahNowCMS/docs/AI_PROVIDERS.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/AI_PROVIDERS.md)
- [AlUmmahNowCMS/docs/AI_ASSIST_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/AI_ASSIST_PLAN.md)
- Chat: thread `418f5c94-05c4-42b9-ae87-700818bcbd8a`, 2026-11-10 13:27 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Afb56a035-d93a-45fa-80ca-07cf6fd15c9b%3Adelegate-task%3A418f5c94-05c4-42b9-ae87-700818bcbd8a`)
