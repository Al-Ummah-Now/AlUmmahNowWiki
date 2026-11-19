[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Site-wide subscriptions and tiers plan

| | |
|---|---|
| **ID** | `AUN-SUBS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (plans live in admin-api D1). It also touches [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md) and [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **building**: the payments framework is in review, off by default ([#1415](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1415), [#1418](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1418), [#1419](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1419)); the rest of the proposal waits on the owner |
| **Last updated** | 2026-11-15 |

> Full proposal: [`docs/plans/SUBSCRIPTIONS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/3c0327b4735c8c82840b66af36411222baadfc5e/docs/plans/SUBSCRIPTIONS.md) (merged in [#834](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/834)).

## Payments framework (building)

The owner, 2026-11-14: *"build the framework, no need to enable now, this is for payment, as i said, now its request. if a provider is enabled in admin it switches to pay flow and so on"*.

- **Plans stay creator tiers.** The creator tiers ([CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md), with the Member tier from [AUN-TIER-REQUESTS](AUN-TIER-REQUESTS-tier-requests.md)) are the only plans model. The separate [Epic 27](E27-plans-entitlements.md) plans PRs ([#390](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/390), [#391](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/391), [#427](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/427), [#428](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/428), [#429](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/429)) were closed as superseded.
- **Off by default.** `/upgrade` stays the request page while no provider is enabled. Once an admin enables one and prices a tier, that tier's card shows the price and Subscribe. A tier set to "By request only" is never sold. With no provider and "Allow tier requests" off, there is no Upgrade page at all ([O37](decisions.md#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature)): `404 feature_off`, no links to it, and the user's tier still shows in Settings › Tier. Settings › Billing follows the same rule: it is listed and opens only while a provider is on or the account has subscriptions or payments (feature key `billing`); otherwise it is the site's 404.
- **Providers.** One interface (checkout, webhook check, status, cancel, refund, portal, price sync) with the PayGood adapter, a test provider for QA and the local stack only, and `manual` for complimentary tiers. Never Stripe ([T2](decisions.md#t2-billing-provider)). [P1](decisions.md#p1-first-paid-providers) decided 2026-11-19: **PayGood only, off until the owner enables it**. Paddle, built from the S16 shortlist while P1 was open, was removed ([AlUmmahNow#1653](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1653)).
- **Webhooks.** The signature is checked on the raw body, then the event is stored once (idempotent) and handled by a queued job with retry, backoff and a DLQ. Events that match nobody are flagged on the admin Errors page with Retry.
- **Entitlement.** An active subscription assigns its tier. A higher tier an admin set is kept, and a lower one comes back when the subscription ends. Sweeps end comps and paid periods even if the provider's last event is lost.
- **Users.** Settings › Billing shows subscriptions, cancel at period end, the provider's portal, and payment history with receipts.
- **Admins.** The videos admin Payments page covers:
  - providers, with credentials written to Cloudflare Secrets Store and never shown back
  - test/live mode and enable
  - prices per tier, period and currency
  - tax details
  - subscriptions, cancel, refunds and complimentary tiers

  Every change is audited. Refunds and provider settings are for super admins only. Sensitive actions need a step-up.
- **Going live** needs a Cloudflare token for Secrets Store writes (`payments-secrets-token`), then the provider credentials and their api-videos bindings. Steps are in `docs/features/payments.md` ([#1415](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1415)).
- **Cost:** no new Workers, queues or databases. Provider fees are per transaction.

## Why

Each feature was inventing its own tiers: creator tiers, the [Epic 27](E27-plans-entitlements.md) seed plans, caption minutes ([AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md)), social limits ([AUN-SOCIAL](AUN-SOCIAL-social-media-management.md)) and AI moderation ([Epic 28](E28-ai-moderation.md)). The owner, on caption-minute tiers: *"what free tier? this needs planning with all subs on the site"*.

## The proposal in short

- **One plans system.** [Creator tiers](CHAT-CREATOR-TIERS-creator-tiers.md) fold into Epic 27 plans, and every limit is an entitlement key. The default plan is renamed **Member** and grants no creator allowances.
- **Watching is never gated.** Plans gate making, storing, processing and AI.
- **Lowest tier:** options A (free with small allowances), B (invite / admin grant only) and C (paid only). Option B now has a request page in front of it: [AUN-TIER-REQUESTS](AUN-TIER-REQUESTS-tier-requests.md) (the Member tier, `/upgrade`, the admin queue). The recommendation is **B at launch, with C added once the owner enables PayGood ([P1](decisions.md#p1-first-paid-providers), decided 2026-11-19: PayGood only, off until enabled)**. There is no public free creator tier.
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
| S16 | Payment provider shortlist (superseded 2026-11-19 by P1: PayGood only, off until the owner enables it) | Paddle or FastSpring + PayPal + Tap or Moyasar |
| S17 | Native apps sell nothing until Epic 24 | Yes |
| S18 | Inline title translation free with fair use | Yes |

## Status evidence

- Payments framework: [AlUmmahNow#1415](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1415) (backend, with tier requests), [#1418](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1418) (`/upgrade` pay flow, Settings › Billing), [#1419](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1419) (admin Payments pages)
- PR [AlUmmahNow#834](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/834) (proposal)
- Findings: [#827](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/827), [#828](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/828), [#829](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/829), [#830](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/830), [#831](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/831), [#832](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/832), [AlUmmahNowApple#20](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/20), [AlUmmahNowDesktop#30](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/30)
