[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 27: Plans & entitlements framework

| | |
|---|---|
| **ID** | `E27` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **superseded**: creator tiers stay the only plans model; payments are built under [AUN-SUBS](AUN-SUBS-subscriptions-plan.md) |
| **Last updated** | 2026-11-21 |

> Plumbing plan approved 2026-11-08 (payments deferred per D4). On 2026-11-14 the plans PRs (#390, #391, #427, #428, #429) were closed as superseded: creator tiers are the plans, and payments for them are built in [AUN-SUBS](AUN-SUBS-subscriptions-plan.md).

## Goal

Every feature is tier-aware from day one: plans, versions, entitlement values, assignment, enforcement and metering, all admin-managed.

## Scope

- In scope: plans, plan versions, entitlement catalogue, assignment, overrides, trials, resolution, enforcement, usage counters, audit, admin and user UIs
- Deferred (D4): prices, payment providers, checkout, webhooks, IAP
- Plans are custom and admin-managed (T1); the Free/Plus/Pro/Institution table is seed data only
- Payments: pluggable `PaymentProvider` interface, manual provider always present, **never Stripe** (T2)

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 27.1 | Data model (D1, admin-api owned) |  |
| 27.2 | Resolution & enforcement |  |
| 27.3 | Plans are custom and admin-managed (T1, resolved) |  |
| 27.4 | Entitlement matrix seed values |  |
| 27.5 | Metering & limits (80% warn, 100% stop, grace period) |  |
| 27.6 | Admin tooling: Plans & Billing | Canceled — both cross-checks agree: E27 is explicitly superseded: #427/#428 closed unmerged and the wiki moves Plans & Billing to creator tiers plus AUN-SUBS.; Wiki marks E27 superseded (creator tiers are the plans; payments under AUN-SUBS) and the plans PRs #427/#428 were closed unmerged 11-15 — explicitly superseded. |
| 27.7 | Pluggable payment providers (T2, resolved: never Stripe) | Canceled — both cross-checks agree: E27 is explicitly superseded and payment providers moved to AUN-SUBS (#1418/#1419), so this story is Canceled rather than active E27 work.; Same supersession: the merged payments work (#1418/#1419) is AUN-SUBS scope, and Paddle removal (0067) confirms the model moved. |

## Decisions and constraints

- [T1](decisions.md#t1-plans-are-admin-managed): Plans are admin-managed (decided)
- [T2](decisions.md#t2-billing-provider): Billing provider (decided)
- [P1](decisions.md#p1-first-paid-providers): First paid providers (open)
- [D4](decisions.md#d4-monetisation): Monetisation (decided)
- [Q27-1](decisions.md#q27-1-epic-27-is-plumbing-only): Epic 27 is plumbing only (decided)
- [Q27-2](decisions.md#q27-2-available-on-plan-is-plain-text): "Available on {plan}" is plain text (decided)
- [Q27-3](decisions.md#q27-3-who-manages-plans): Who manages plans (decided)
- [Q27-4](decisions.md#q27-4-free-has-real-limits): Free has real limits (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Issues [AlUmmahNow#262](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/262), [AlUmmahNowAuth#227](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/227) (`billing_admin` / `billing_viewer` roles)
- Open PR [AlUmmahNow#429](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/429) (plan limits before uploads)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#255](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/255) | issue | Embeds: remaining player parameters and end screen (captions, chapters, speed, theme, color, branding, related, controls=0, comments=1) | OPEN | 2026-11-08 |
| AlUmmahNow | [#262](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/262) | issue | Epic 27: plans & entitlements framework | OPEN | 2026-11-08 |
| AlUmmahNow | [#385](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/385) | PR | feat(entitlements): plans schema, Free seed, catalogue and resolver (Epic 27, 1/6) | MERGED | 2026-11-08 |
| AlUmmahNow | [#390](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/390) | PR | feat(api-videos): resolve entitlements and add GET /api/entitlements (Epic 27, 2/6) | OPEN | 2026-11-09 |
| AlUmmahNow | [#391](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/391) | PR | feat(api-videos): enforce Free plan limits with grandfathering (Epic 27, 3/6) | OPEN | 2026-11-08 |
| AlUmmahNow | [#427](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/427) | PR | feat(admin-api): plan management, assignments and overrides (Epic 27) | OPEN | 2026-11-08 |
| AlUmmahNow | [#428](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/428) | PR | feat(admin-web): plans, assignments and overrides UI (Epic 27) | OPEN | 2026-11-08 |
| AlUmmahNow | [#429](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/429) | PR | feat(web): show plan limits and explain them before uploads (Epic 27) | OPEN | 2026-11-08 |
| AlUmmahNow | [#430](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/430) | issue | Epic 27: close enforcement gaps after limits ship | OPEN | 2026-11-08 |
| AlUmmahNowAuth | [#227](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/227) | issue | Add billing_admin and billing_viewer RBAC roles (Epic 27) | OPEN | 2026-11-08 |

### Reconciled 2026-11-21

- **E27 / Admin tooling: Plans & Billing (HLB-801): Canceled** — both cross-checks agree: E27 is explicitly superseded: #427/#428 closed unmerged and the wiki moves Plans & Billing to creator tiers plus AUN-SUBS.; Wiki marks E27 superseded (creator tiers are the plans; payments under AUN-SUBS) and the plans PRs #427/#428 were closed unmerged 11-15 — explicitly superseded.
- **E27 / Pluggable payment providers (T2, resolved: never Stripe) (HLB-802): Canceled** — both cross-checks agree: E27 is explicitly superseded and payment providers moved to AUN-SUBS (#1418/#1419), so this story is Canceled rather than active E27 work.; Same supersession: the merged payments work (#1418/#1419) is AUN-SUBS scope, and Paddle removal (0067) confirms the model moved.
## Open questions

- First paid providers (P1) open until monetisation is decided (D4).

## Conflicts between sources

- Chat 2026-11-10 05:36 UTC: the owner ruled that normal users may not upload or create channels until subscriptions exist, and that tiers are assigned by admins (**None / Creator / Unlimited**, super admins Unlimited). This is built ([AlUmmahNow#630](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/630), [#660](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/660)) beside Epic 27's seed plans **Free / Plus / Pro / Institution**, where Free can upload. The two tier models aren't reconciled in any doc. See [creator tiers](CHAT-CREATOR-TIERS-creator-tiers.md).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)
- [docs/specs/EPIC-27-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-27-PLAN.md)
