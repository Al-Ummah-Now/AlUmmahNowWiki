[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Creator tiers: invite-only uploads and channel creation

| | |
|---|---|
| **ID** | `CHAT-CREATOR-TIERS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-14 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#630, #660, #623, #659).

## Goal

Normal users can't upload or create channels until subscriptions exist; admins assign None / Creator / Unlimited; super admins hold Unlimited.

> Since [AUN-TIER-REQUESTS](AUN-TIER-REQUESTS-tier-requests.md) (2026-11-14), "None" is a real tier, **Member**, with capability flags (uploads, channels, pages, requestable), and users can request a tier on `/upgrade`; admins decide in the videos admin's Tier requests queue.

## Decisions and constraints

- [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers): Invite-only uploads with admin-assigned creator tiers (decided)
- [T1](decisions.md#t1-plans-are-admin-managed): Plans are admin-managed (decided)

Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Live streaming in tiers (in review, [AlUmmahNow#1373](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1373))

Videos admin → Tiers sets, per tier, **Live streaming: allowed / not allowed** plus three limits:

| Tier | Live | Hours a month | Streams at once | Longest stream |
|---|---|---|---|---|
| None (no tier) | off | – | – | – |
| Creator | on | 20 | 1 | 240 min |
| Unlimited, super admins | on | no limit | no limit | no limit |

- **Whose tier:** the channel **owner's** tier applies. A channel admin goes live under it, and only while they still manage live on the channel.
- **Enforcement** in api-videos:
  - create and ingest return 403 `live_not_in_tier`;
  - start returns 402 `live_hours_used` or 403 `live_concurrent_limit`;
  - the 5-minute live sweep ends streams past their limit (`end_reason: tier_limit`). A provider that won't stop flags the Errors page.
- **Hours** count streamed time in the UTC month and renew on the 1st.
- **Editing:** turning live off keeps the limits. Changes are audited through admin-api.
- **Studio** shows the month's usage. When the tier doesn't allow live, it shows why, with **Request access** → `/{lang}/upgrade`.

## Status evidence

- PRs [AlUmmahNow#630](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/630), [AlUmmahNow#660](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/660), [AlUmmahNow#623](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/623), [AlUmmahNow#659](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/659), [AlUmmahNow#675](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/675)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Conflicts with Epic 27's seed plans (Free / Plus / Pro / Institution, where Free can upload). See [Epic 27](E27-plans-entitlements.md).

## Sources

- [AlUmmahNow#630](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/630), [AlUmmahNow#660](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/660)
