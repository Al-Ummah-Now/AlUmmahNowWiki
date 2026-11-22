[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 24: Creator support & premium

| | |
|---|---|
| **ID** | `E24` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md) |
| **Status** | **planned** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |

> D4 (owner, 2026-11-08): no monetisation at launch.

## Goal

Donations to creators, viewer Premium and ethical sponsorship, later.

## Scope

- Depends on: D4
- Payments use the pluggable provider interface of Epic 27.7. Never Stripe.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 24.1 | Creator support (sadaqah/donations) | Specified in [AUN-MEMBERS](AUN-MEMBERS-creator-support.md) (2026-11-22): one-time and monthly support, collected by PayGood and paid to creators through a separate payout rail, 0% to the platform ([O41](decisions.md#o41-creator-support-is-a-gift-0-to-the-platform-never-hold-funds), [O42](decisions.md#o42-paygood-collects-only-creators-paid-through-a-separate-payout-rail)) |
| 24.2 | Premium membership (IAP + web checkout) | In Progress — both audits agree: AlUmmahNow#1418 (merged): web pay flow and Billing, off by default; AlUmmahNow#1419 (merged): providers, prices, tax and subscriptions, off by default; AlUmmahNow#1418; AlUmmahNow#1419 |
| 24.3 | Ethical sponsorship slots |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D4](decisions.md#d4-monetisation): Monetisation (decided)
- [T2](decisions.md#t2-billing-provider): Billing provider (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |

### Reconciled 2026-11-21

- **E24 (AUN-393): In Progress** — both audits agree: E24 / Premium membership (IAP + web checkout): Backlog → In Progress; AlUmmahNow#1418 (merged): web pay flow and Billing, off by default; AlUmmahNow#1419 (merged): providers, prices, tax and subscriptions, off by default; AlUmmahNow#1418; AlUmmahNow#1419
- **E24 / Premium membership (IAP + web checkout) (AUN-395): In Progress** — both audits agree: AlUmmahNow#1418 (merged): web pay flow and Billing, off by default; AlUmmahNow#1419 (merged): providers, prices, tax and subscriptions, off by default; AlUmmahNow#1418; AlUmmahNow#1419
## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
