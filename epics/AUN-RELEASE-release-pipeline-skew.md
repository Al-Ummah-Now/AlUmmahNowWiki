[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Release pipeline, tagged releases and skew protection

| | |
|---|---|
| **ID** | `AUN-RELEASE` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-12 |

> Spec #203, tag-only production #286 merged 2026-11-08; skew protection (pages open during a deploy keep working) #583, #618, #620 merged 2026-11-10.

## Goal

Stage slot tested before switching production, production only from `vYYYY.MM.DD` tags on main through CI, auto-rollback, and deploy-safe open pages.

## Decisions and constraints

- [O10](decisions.md#o10-stage-slot-before-production-spec--plan--implement): Stage slot before production; spec → plan → implement (decided)
- [O11](decisions.md#o11-production-only-from-tags-on-main): Production only from tags on main (decided)
- [O12](decisions.md#o12-protect-main-merge-own-prs-when-green): Protect main; merge own PRs when green (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Since 2026-11-10: Local E2E gates every release ([#1050](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1050)); translation store synced on every deploy ([#1005](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1005)); media Worker deployed and smoke-tested in releases ([#948](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/948)); rollback dry run after every promote ([#692](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/692)); `RELEASE_SKIP_STAGE_E2E` emergency override ([#690](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/690)); load specs never block ([#952](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/952)). Current process: [Release process](../guides/release-process.md).
- PRs [AlUmmahNow#203](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/203), [AlUmmahNow#223](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/223), [AlUmmahNow#286](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/286), [AlUmmahNow#583](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/583), [AlUmmahNow#618](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/618), [AlUmmahNow#620](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/620)

## Open questions

- None recorded in the sources.

## Sources

- [docs/release-pipeline/SPEC.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/release-pipeline/SPEC.md)
- [docs/release-pipeline/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/release-pipeline/PLAN.md)
- [docs/release-pipeline/SKEW-PROTECTION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/release-pipeline/SKEW-PROTECTION.md)
- [AlUmmahNow#203](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/203), [AlUmmahNow#248](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/248), [AlUmmahNow#286](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/286)
