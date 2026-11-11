[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Site-wide subscriptions and tiers plan

| | |
|---|---|
| **ID** | `AUN-SUBS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (plans live in admin-api D1). It also touches [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md) and [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **planned**: a proposal waiting on the owner |
| **Last updated** | 2026-11-11 |

> Full proposal: [`docs/plans/SUBSCRIPTIONS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/13776a30f461e4d61c4ae452155e19ebe66141a9/docs/plans/SUBSCRIPTIONS.md) ([#834](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/834)).

## Why

Each feature was inventing its own tiers: creator tiers, the [Epic 27](E27-plans-entitlements.md) seed plans, caption minutes ([AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md)), social limits ([AUN-SOCIAL](AUN-SOCIAL-social-media-management.md)) and AI moderation ([Epic 28](E28-ai-moderation.md)). The owner, on caption-minute tiers: *"what free tier? this needs planning with all subs on the site"*.

## The proposal in short

- **One plans system.** [Creator tiers](CHAT-CREATOR-TIERS-creator-tiers.md) fold into Epic 27 plans, and every limit is an entitlement key. The default plan is renamed **Member** and grants no creator allowances.
- **Watching is never gated.** Plans gate making, storing, processing and AI.
- **Lowest tier:** options A (free with small allowances), B (invite / admin grant only) and C (paid only). The recommendation is **B at launch, with C added once a payment provider is chosen ([P1](decisions.md#p1-first-paid-providers))**. There is no public free creator tier.
- **Ladder (seeds):** Member, Creator, Creator Plus, Creator Pro, Institution, Staff. A viewer Supporter plan stays deferred ([D4](decisions.md#d4-monetisation)). Scholars hold a role, not a plan; they get a sponsored Creator Plus grant.
- **Add-ons** are additive grants: caption minutes, storage, upload hours, live hours, X posts.
- **Payments:** never Stripe. Candidates are listed but not decided. Lemon Squeezy, Gumroad and Polar are excluded because they run on Stripe.

## Cost against the $500 cap ([O1](decisions.md#o1-whole-platform-cost-cap))

| Scale | Viewers / month | Library | Everything on | Notes |
|---|---|---|---|---|
| S1 Launch | 20k | 500 h | ≈ $110 | Far inside the cap |
| S2 Growth | 300k | 2,500 h | ≈ $460 | Near the cap |
| S3 Target | 2M | 5,000 h | ≈ $1,425 | ≈ $660 with the levers; $500 needs budget stops and decision S3 |

Egress is free on R2 + CDN ([D2](D2-video-delivery.md)). The costs come from storage, transcoding, AI moderation, X posting, live and Workers Logs.

## Decisions waiting on the owner

| # | Decision | Recommendation |
|---|---|---|
| S1 | One plans system; creator tiers fold into plans | Yes |
| S2 | Lowest creator tier: A, B or C | B at launch, then C |
| S3 | Does the $500 cap count subscriber-paid usage? | No: the cap covers platform-funded spend; paid usage is tracked outside it |
| S4 | Rename "Free" to "Member", with no creator allowances | Yes |
| S5 | Tier names | Accept as seeds |
| S6 | The plan belongs to the user, not to each channel | Yes |
| S7 | Scholars get a sponsored Creator Plus | Yes |
| S8 | The key matrix (§3.4) as seeds | Accept |
| S9 | Viewers stay free with no plan until Epic 24 | Yes |
| S10 | Defer the organisation entity; a user holds Institution | Yes |
| S11 | X on Pro and up only; platform X cap $500 → $50 | Yes |
| S12 | 1080p on paid tiers; delete originals after 30 days; cold videos at 480p | Yes |
| S13 | Budget stops for transcode, moderation and live | Yes |
| S14 | Sample Workers Logs in production (~10%) | Yes |
| S15 | Add-ons as additive grants | Yes |
| S16 | Payment provider shortlist (P1 stays open) | Paddle or FastSpring + PayPal + Tap or Moyasar |
| S17 | Native apps sell nothing until Epic 24 | Yes |
| S18 | Inline title translation free with fair use | Yes |

## Status evidence

- PR [AlUmmahNow#834](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/834) (proposal)
- Findings: [#827](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/827), [#828](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/828), [#829](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/829), [#830](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/830), [#831](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/831), [#832](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/832), [AlUmmahNowApple#20](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/20), [AlUmmahNowDesktop#30](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/30)
