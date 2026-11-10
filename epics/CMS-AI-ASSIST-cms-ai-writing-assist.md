[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# CMS AI writing assist

| | |
|---|---|
| **ID** | `CMS-AI-ASSIST` |
| **Owning repos** | [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |

> Merged as CMS #47 (2026-11-10). Ships in its "not set up" state: no Anthropic key exists in any environment yet.

## Goal

Editor helpers that only suggest: translate en↔ar (Opus 5.5), SEO/sharing copy (Sonnet 5.5), pre-publish check. Nothing is saved or published by the AI.

## Scope

- Cost logged per call; monthly AI budget with a hard stop is queued (after the cost dashboard budgets, #266)

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| A1 | Migration `ai_jobs`, `ai_usage` |  |
| A2 | Queue bindings + consumers |  |
| A3 | Optional `ANTHROPIC_API_KEY` |  |
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

- CMS [AlUmmahNowCMS#47](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/47), issue [AlUmmahNowCMS#17](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/17)

## Open questions

- Owner to add `anthropic-api-key` to the Secrets Store.
- Monthly budget hard stop not built.

## Conflicts between sources

- This is a recorded exception to Epic 28's rule against third-party AI vendors (see [Epic 28](E28-ai-moderation.md)).

## Sources

- [AlUmmahNowCMS/docs/AI_ASSIST_SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/AI_ASSIST_SPEC.md)
- [AlUmmahNowCMS/docs/AI_ASSIST_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/6d9ea9ef7d34129325d39e48f8fc2cdc4b6f95a1/docs/AI_ASSIST_PLAN.md)
- Chat: thread `418f5c94-05c4-42b9-ae87-700818bcbd8a`, 2026-11-10 13:27 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Afb56a035-d93a-45fa-80ca-07cf6fd15c9b%3Adelegate-task%3A418f5c94-05c4-42b9-ae87-700818bcbd8a`)
