[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Supporting creators: one-time and monthly support, 0% to the platform

| | |
|---|---|
| **ID** | `AUN-MEMBERS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web, web, processor), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (terms pages), [AlUmmahNowWiki](https://github.com/Al-Ummah-Now/AlUmmahNowWiki) |
| **Status** | **planned** (spec only, no code) |
| **Last updated** | 2026-11-22 |
| **Origin** | Owner request 2026-11-22: "spec members supporting creators, legality, fees, taxes, international, sending funds, partners and vendors needed". Two changes the same day: **no paid perks now** (support only, nothing unlocked; perks are a separate optional section behind their own switch, default off), and **the platform takes nothing** (0% cut, no fee, no margin, no float). |
| **Linear** | [AUN-612](https://linear.app/hamzalabs/issue/AUN-612/aun-members-supporting-creators-one-time-and-monthly-support-0percent) (stories AUN-613 to AUN-633) |

> **This page is research, not legal, tax or religious advice.** It collects current public sources (each cited with its date) so the owner can decide and brief professionals. Every point marked **Unverified** could not be confirmed on a primary source. Nothing here goes live until a US lawyer, an accountant and a scholar have answered the questions in [§14](#14-questions-for-a-lawyer-an-accountant-and-a-scholar).

## Goal

A viewer can support a creator they love: once, or every month. The money goes straight from the supporter to the creator's own merchant account at PayGood. Al Ummah Now takes nothing and never holds the money. The supporter sees, before paying, exactly what the payment provider and any tax take and what the creator receives. Nothing is unlocked in return: support is a gift.

The feature is one switch on the Features page, **off by default**, and it can be turned off per country, per channel and all at once.

## Decisions and constraints

- **Support only, nothing in return** (owner, 2026-11-22). Badges, member-only posts, videos and live, and early access are designed in [§10](#10-optional-paid-perks-designed-not-scheduled) but are not in the build order and sit behind their own switch, default off.
- **0% to the platform** (owner, 2026-11-22). "Fees" on this page means only what vendors (payment provider, currency exchange, payout, chargeback) and governments (tax) take.
- **Never hold funds.** The creator is the payee. No platform balance, no float, no interest ([§3](#3-islamic-compliance)).
- **PayGood only** ([P1](decisions.md#p1-first-paid-providers), decided 2026-11-19), off until the owner enables it, and **never Stripe** ([T2](decisions.md#t2-billing-provider)). This spec is built on PayGood. Where PayGood can't do something today, this page says so plainly and lists it as an owner decision ([§12.1](#121-paygood-what-it-can-and-cant-do), [§15](#15-owner-decisions)); it doesn't swap providers. The other providers researched are recorded only in [§12.3](#123-other-providers-researched-for-the-record-not-recommended), for the record.
- **Switchable feature, default off** ([O39](decisions.md#o39-one-features-page-server-enforced), [AUN-FEATURES](AUN-FEATURES-feature-switches.md)). Hidden when off ([Product rules](../guides/product-rules.md)); `feature_off` carries a server message ([O40](decisions.md#o40-server-written-error-messages)).
- **Always async** ([O26](decisions.md#o26-always-async-with-admin-visible-errors)): every money event goes through a queue with retry and a DLQ; failures flag the admin **Errors** page with **Retry**. Troubleshooting is done from the admin, never from Cloudflare or a provider's dashboard.
- **Channel roles live in videos**, not Auth RBAC ([O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership), [roles](../guides/roles.md)). Only the channel **owner** connects a payout account, because the money is theirs.
- **Creators are invite-only** with admin-assigned tiers ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers), [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md)). Receiving support is a tier capability that admins set per tier.
- **Cost cap** $500/month for the whole platform ([O1](decisions.md#o1-whole-platform-cost-cap)). This design adds about $0 a month in vendor costs ([§5.3](#53-fixed-costs-against-the-500month-cap)).
- **No legal entity exists yet** ([SM-4](decisions.md#sm-4-legal-entity)). Payment partners will want one ([§12](#12-partners-and-vendors)).
- **Production has one user today** (the owner). The first live run is the owner's own channel with the owner as supporter ([§13](#13-build-order)).
- Numbers follow [O38](decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000) and [Numbers and dates](../guides/numbers-and-dates.md): money in Arabic is «٥٫٠٠ دولار أمريكي», never «US$».

## 1. What "support" means here

| | Support (this epic) | Paid perks ([§10](#10-optional-paid-perks-designed-not-scheduled), off) |
|---|---|---|
| One-time | Any amount from a minimum, to one channel | — |
| Monthly | A fixed amount every month until the supporter stops | Tiers with perks |
| What the supporter gets | Nothing. A receipt and a thank-you. | Badge, member-only posts, videos and live, early access |
| What it is | A gift (hiba) to the creator | A purchase of a service |
| Platform share | 0% | 0% |

**Where it appears:** a **Support** button on the channel page and in the channel header on the watch page. Never on a single video, live stream or post, so the gift is never "associated with" a piece of content ([§8](#8-app-stores)).

**What we copy and what we avoid**

| Platform | Share kept by the platform (current) | Copy | Avoid |
|---|---|---|---|
| YouTube memberships, Super Thanks | 30%; YouTube covers card fees ([YouTube Help](https://support.google.com/youtube/answer/7491256), [Super Thanks](https://support.google.com/youtube/answer/10878910), accessed 2026-11-22) | Support from the channel header; simple amounts | The 30% cut; Super Thanks tied to a video |
| Patreon | 10% for pages from 4 Aug 2025, plus processing; Apple's cut on iOS outside the US (Patreon (`https://support.patreon.com/hc/en-us/articles/36426991446797`), accessed 2026-11-22) | Clear "manage support" page; US web checkout from iOS | Platform holds funds; fee stacking |
| Ko-fi | 0% on tips (free plan), 5% otherwise; money goes straight to the creator's PayPal (Ko-fi (`https://help.ko-fi.com/hc/en-us/articles/360002506494`), accessed 2026-11-22) | **Direct to the creator's own account** | Stripe as a rail |
| Buy Me a Coffee | 5%, Stripe only ([BMaC](https://buymeacoffee.com/ko-fi-alternative), accessed 2026-11-22) | One-screen support sheet | Stripe-only payouts |
| Twitch subs | 50/50, up to 70/30 ([Twitch](https://blog.twitch.tv/2024/01/24/an-update-to-several-streamer-payout-programs), 24 Jan 2024) | — | Large cuts, paid status symbols |
| LaunchGood | 0%, funded by optional donor tips; pays non-US/UK/Canada campaigners by $12–20 wire ([fees](https://support.launchgood.com/support/solutions/articles/35000179424-platform-fees), accessed 2026-11-22; [payouts](https://support.launchgood.com/support/solutions/articles/35000013654), 4 Feb 2026) | 0%; card fees shown as not part of the gift; zakat review model for charities | Holding funds and paying by wire |

## 2. Flows

### 2.1 Supporter

1. Taps **Support** on a channel. The server has already said `support` and `supportReceive` are on for this person and channel ([§9.5](#95-server-side-checks-on-every-app)).
2. Picks **One time** or **Monthly**, an amount (presets or other, from the minimum), optionally "cover the fees", a private message and "don't show my name".
3. Sees the **breakdown** ([§5.4](#54-the-breakdown-before-paying)): amount, tax, provider fee, currency exchange estimate, "Al Ummah Now takes $0.00", what the creator receives.
4. For monthly: ticks "Charge me {amount} every month until I stop" (express consent, the California standard, [§4.5](#45-consumer-law)).
5. Goes to the provider's **hosted** checkout. Card data never reaches us.
6. Comes back to a thank-you screen. The provider emails the receipt. We email a short confirmation with how to stop.

**Signed in only.** Support needs an account (age confirmation, cancel page, fraud checks). Signed-out viewers see the button and sign in first.

### 2.2 Stopping, reminders and refunds

- **Stop any time** from Settings › Support, one click and a confirm dialog in the page (no browser prompts). Stopping takes effect at once at the provider: no future charges. There is no minimum term and no fee ([§3.3](#33-monthly-support-is-a-promise)).
- **Reminder** emails: 3 days before each renewal for the first one, then yearly ("you've supported {channel} monthly for a year"), and whenever the amount or provider terms change.
- **Refunds:** support is a gift and is not refundable by default. Exceptions:
  - the supporter writes within **7 days** saying it was a mistake: the creator is asked, and the admin can refund with the creator's agreement (mutual consent, [§3.2](#32-hiba-gift-mechanics));
  - fraud, a duplicate charge or our error: an admin refunds;
  - where a law gives a right, that right applies.
  A refund comes out of the **creator's** provider account, never ours.
- **Failed renewals:** the provider retries on its own schedule. After the last retry the pledge ends and the supporter gets one email with a link to start again. No dunning beyond that.

### 2.3 Chargebacks, disputes and fraud

- The creator is the merchant, so a chargeback is raised against the creator's provider account, with the provider's fee. The creator agreement says so ([§4.8](#48-terms)).
- The admin **Disputes** page shows every dispute we learn of and its due date, with our records ready to send (account, time, IP country, the consent line the supporter ticked). PayGood's public API has no dispute endpoints, so the creator answers in their own PayGood dashboard; the page gives them our records as a download ([§12.1](#121-paygood-what-it-can-and-cant-do)).
- Fraud controls, all on the server: a minimum amount; per-account and per-card limits per day (admin-set); new accounts limited to small amounts for their first days; card testing blocked by the provider's own risk checks plus our rate limit and Turnstile on the support sheet ([bot protection](../guides/bot-protection.md)); self-support (a creator supporting their own channel) refused.
- A creator with a dispute rate above the provider's threshold is paused by a job and flagged for an admin.

### 2.4 Creator

1. The channel owner opens **Studio › Support**. If their tier allows it, they see "Set up payouts".
2. They go to the provider's hosted onboarding: identity, bank or wallet, tax forms. We never see bank details or ID documents.
3. They return; a job reads the account state. Studio shows what the provider still needs, in words.
4. Once active, they switch support on, choose presets and write a thank-you note.
5. Studio › Support shows supporters (names unless anonymous), messages, payments, refunds, disputes and payouts as the provider reports them.

Channel admins see the Support page read-only; editors and moderators don't see it.

### 2.5 Minors

- **Supporters:** 18 or over. The support sheet asks for a one-time confirmation; accounts that told us they are under 18 never see the button. Under-13s are not allowed on payment flows at all ([COPPA amended rule](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule), compliance from 22 Apr 2026).
- **Creators:** 18 or over to receive. The providers require adult account holders. A creator under 18 cannot connect payouts; the lawyer is asked about guardian-held accounts and state child-influencer laws ([§14](#14-questions-for-a-lawyer-an-accountant-and-a-scholar)).

## 3. Islamic compliance

Each source is cited inline with its date. Where scholars differ, this page says so and asks the scholar ([§14.3](#143-scholar-mufti)).

### 3.1 What the payment is

- **Support with nothing in return is a gift (hiba).** It is not a sale or a hire, so no price, defect or delivery questions arise. If a reward is promised, it becomes a gift for compensation (hibat al-thawab), treated like a sale; that is why perks are a separate section ([§10](#10-optional-paid-perks-designed-not-scheduled)).
- **Not sadaqa or zakat to a charity.** Zakat needs transfer of ownership to one of the eight categories (Qur'an 9:60). A creator is not a zakat recipient as such ([SeekersGuidance on tamlik](https://seekersguidance.org/answers/hanafi-fiqh/is-our-zakat-fund-for-abuse-survivors-properly-structured/), accessed 2026-11-22; [NZF distribution policy](https://nzf.org.uk/wp-content/uploads/2021/04/NZF-UK-Zakat-Distribution-Policy-v2-Apr-2021.pdf), Apr 2021). The sheet says so in plain words ([§11](#11-screens-and-copy-english-and-arabic-samples)). A supporter may of course intend sadaqa in the general sense of a good deed; we make no claim either way.
- **Teaching the religion:** accepting gifts for teaching Qur'an and knowledge is allowed by the majority (Malik, Shafi'i, Ahmad); early Hanafis disallowed wages, later Hanafis allowed them out of need ([SeekersGuidance](https://seekersguidance.org/answers/quran/is-it-permissible-to-receive-a-financial-gift-for-teaching-the-quran/), accessed 2026-11-22; Bin Bayyah via IslamQA.org (`https://islamqa.org/maliki/binbayyah/29781/can-a-quran-teacher-accept-gifts/`), accessed 2026-11-22).

### 3.2 Hiba (gift) mechanics

- A gift is complete on **possession (qabd)**. The majority allow taking it back before possession; Malikis hold it binding on the contract ([SeekersGuidance](https://seekersguidance.org/answers/fiqh-answers-2/is-it-permissible-to-take-back-a-gift-in-islam/), accessed 2026-11-22).
- After possession, taking a gift back is strongly disliked, but **return by mutual consent** is fine. So refunds after payment go through the creator's agreement, except fraud, error and legal orders ([§2.2](#22-stopping-reminders-and-refunds)).
- **Who holds the money matters.** In this design the money lands in the **creator's own** provider account. The provider acts for the creator, so possession is complete on settlement. The platform never holds it, so the question "whose agent is the platform?" mostly falls away. The scholar confirms this ([§14.3](#143-scholar-mufti), question 1).

### 3.3 Monthly support is a promise

- A monthly pledge is a promise (wa'd) of future gifts; each charge is a new gift under the supporter's standing instruction. The majority hold a promise religiously binding but not legally enforceable; some Malikis differ. The OIC Fiqh Academy's ruling on binding promises (resolutions 40–41, 1988) was made for murabaha financing ([IIFA](https://iifa-aifi.org/en/32332.html), accessed 2026-11-22).
- So: **stop any time, no penalty, no minimum term**, and wording "monthly support until you stop", never "commitment".

### 3.4 Riba

- **No float, no interest.** We hold no balances, so we earn nothing on money in transit. If any interest ever accrued to us by accident, it is given away as charity without expecting reward (IslamQA.org, Mufti Online (`https://islamqa.org/hanafi/muftionline/114377/using-bank-interest-for-charity-permissible-or-not/`), accessed 2026-11-22). The scholar is asked about provider balances that earn interest for the provider ([§14.3](#143-scholar-mufti), question 4).
- **No buy-now-pay-later, no instalments, no credit upsell.** We never promote a credit product.
- **Credit cards** are a real difference of opinion: AAOIFI Shari'ah Standard 2 allows a card when no interest is charged; OIC Fiqh Academy resolution 108 forbids an interest-conditioned card even if paid in the grace period ([IIFA 108](https://iifa-aifi.org/en/32584.html), accessed 2026-11-22). Accepting a card is not itself the riba contract (that is between the cardholder and their bank). Recommendation: accept cards, debit cards, wallets and bank transfer; promote none; ask the scholar.
- **Currency exchange (sarf)** must be spot. Conversion happens at the provider at settlement or withdrawal at the spot rate; we offer no rate locks or forward rates ([AAOIFI SS 1](https://cis.aaoifi.com/ar/?p=1695), accessed 2026-11-22).

### 3.5 Gharar and maysir

- No paid randomness: no mystery rewards, raffles or "spin" for supporters. Paid loot boxes are gambling in the fatwas found ([Islamweb 379243](https://islamweb.net/en/fatwa/379243), accessed 2026-11-22; [JFatwa, USIM](https://jfatwa.usim.edu.my/index.php/jfatwa/article/view/685), accessed 2026-11-22).
- All amounts and fees are known before paying (the breakdown, [§5.4](#54-the-breakdown-before-paying)). No hidden fees.

### 3.6 Which channels can receive

- Only channels in good standing on an Islamic platform. Helping in wrongdoing is blameworthy (Qur'an 5:2), so a channel under moderation action loses its Support button until cleared. Disputed areas (for example music with instruments) follow the platform's content policy; the scholar is asked which view the policy follows ([§14.3](#143-scholar-mufti), question 9).

### 3.7 Charity creators (registered charities)

- A creator that is a registered charity takes **donations**, labelled sadaqa or donation, not "support". Zakat is only tagged after a review of that charity's zakat policy (the LaunchGood model: each campaign reviewed by a zakat team, LaunchGood zakat policy (`https://www.launchgood.com/zakatpolicy`), accessed 2026-11-22). No fee may come out of zakat without the donor's permission ([Darul Ifta Birmingham 06734](https://daruliftabirmingham.co.uk/fundraising-platform-taking-a-percentage-of-the-zakat-money/), 26 Aug 2023); card fees are shown as separate from the zakat.
- In the apps, charity collection follows store rules: Apple only for approved nonprofits with Apple Pay, otherwise on the web ([§8](#8-app-stores)).
- This route is behind its own switch, `charityDonations`, default off, and is last in the build order.

### 3.8 How other Islamic platforms do it

- **LaunchGood:** 0% platform fee, an optional tip to LaunchGood, card fees "not part of your zakat", zakat-verified campaigns (zakat policy (`https://www.launchgood.com/zakatpolicy`), [fees](https://support.launchgood.com/support/solutions/articles/35000179424-platform-fees), accessed 2026-11-22). It holds the money and pays out; we will not.
- **PayGood** (from the LaunchGood team) exists because Muslim businesses were "shut out by payment processors" ([paygood.com](https://paygood.com), accessed 2026-11-22).
- No widely recognised "halal payment gateway" was found. Compliance comes from how we route money (no float, spot FX, clear fees), not from a gateway's label.

## 4. Legality

### 4.1 We are not a money transmitter, if we never touch the money

- FinCEN defines a money transmitter as someone who accepts funds from one person and transmits them to another (31 CFR 1010.100(ff)(5), [eCFR](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1010/subpart-A/section-1010.100), accessed 2026-11-22). If the supporter pays the creator's own PayGood merchant account and we never receive, hold, pool or direct the money, PayGood and its processor Finix do the transmitting.
- **Gifts weaken one usual defence.** FinCEN's payment-processor exemption needs "the purchase of goods or services". A gift has none. So our position rests on **never touching funds**, not on that exemption. State "agent of the payee" exemptions also assume a purchase (narrowly read, for example [California DFPI opinion](https://dfpi.ca.gov/rules-enforcement/laws-and-regulations/opinion-letters-by-law-subject/opinion-letter-payment-processing-service-not-exempt-as-agent-of-payee-or-factoring), accessed 2026-11-22).
- Between 31 and 35 states have adopted the Money Transmission Modernization Act; sources disagree ([CSBS](https://www.csbs.org/node/231461), Sep 2026; [Womble Bond Dickinson](https://www.womblebonddickinson.com/us/node/21361), Aug 2026).
- **Things we must never build**, because each would make us a transmitter: a platform bank account in the flow; balances, credits or wallets; paying creators ourselves; holding back or scheduling payouts; refunds or transfers from our own money; escrow.
- **Read the provider contract.** PayGood's terms (Delaware law) and any partner agreement must be checked for liability for creators' negative balances or chargebacks. That is credit risk, not transmission, but the lawyer reviews it ([§14.1](#141-us-lawyer)).

### 4.2 Who is the merchant

| Model | Who sells | Fits? |
|---|---|---|
| Payment facilitator (PayFac) | The platform signs merchants and receives settlement for them ([Visa PF model](https://usa.visa.com/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf), accessed 2026-11-22) | No: heavy obligations, and we would touch funds |
| Marketplace (card network sense) | The platform is the merchant for sellers' sales ([Visa risk guide](https://usa.visa.com/content/dam/VCOM/regional/na/us/partner-with-us/documents/visa-payment-facilitator-and-marketplace-risk-guide.pdf), accessed 2026-11-22) | No |
| Merchant of record (Paddle, FastSpring, Dodo, Creem) | The vendor resells to the buyer and takes a fee | **No.** Their rules ban donations and tips (Paddle (`https://www.paddle.com/help/start/account-verification/what-am-i-not-allowed-to-sell-on-paddle`), Dodo (`https://docs.dodopayments.com/miscellaneous/prohibited-businesses-and-locations`), Creem (`https://docs.creem.io/faq/prohibited-products`), accessed 2026-11-22), and a resale conflicts with a gift |
| **Direct: the creator is the merchant** | The creator's own PayGood merchant account receives the money; we start the hosted checkout | **Yes.** This design. PayGood's acceptable-use policy forbids "third party" payments, so we must never collect for creators |

### 4.3 Sanctions and high-risk countries

- **US comprehensive or regional embargoes** (November 2026): Cuba (tightened 29 Sep 2026, [OFAC recent actions](https://ofac.treasury.gov/recent-actions/20260929_33)), Iran ([Foley, Oct 2026](https://www.foley.com/insights/publications/2026/10/september-2026-u-s-sanctions-roundup-operation-economic-outcast-intensifies-against-iran-cuba-rules-tighten-and-ofac-overhauls-its-regulations)), North Korea, and Crimea, "DNR" and "LNR".
- **Syria is no longer comprehensively sanctioned by the US** since 1 July 2025 (E.O. 14312); Assad-linked persons stay sanctioned ([OFAC Syria page](https://ofac.treasury.gov/sanctions-programs-and-country-information/syria-sanctions-inactive-and-archived), accessed 2026-11-22). Providers may still refuse Syria, and UK, EU and export-control positions differ.
- **Russia and Belarus:** no country-wide US embargo, but broad service bans; most providers block them.
- **Lists to screen:** OFAC SDN (with the 50% ownership rule), UK OFSI, EU, UN. The **provider** screens supporters and creators as its customers. We geo-block embargoed regions (IP and the provider's billing country) and keep our decisions.
- **FATF** (October 2026 plenary): call for action on North Korea and Iran, enhanced diligence for Myanmar; about 18 jurisdictions under increased monitoring, including Iraq, Sudan, Syria and Kenya (FATF (`https://www.fatf-gafi.org/en/publications/Fatfgeneral/outcomes-fatf-plenary-october-2026.html`), [ComplyAdvantage summary](https://complyadvantage.com/insights/fatf-plenary-october-2026-four-grey-list-exits-a-virtual-asset-review-and-a-new-focus-on-scam-compounds/), accessed 2026-11-22; the full list is **Unverified**).
- **The Countries page** in the admin ([§9.6](#96-admin-pages-videos-admin--support)) holds a rule per country, for supporters and creators separately: allowed, blocked (with reason: sanctions, provider doesn't support, legal review, admin), or waitlist. Sanctioned regions are seeded blocked and can be changed only by a super admin with step-up.

### 4.4 KYC and AML

- The provider does identity checks, beneficial owners, bank account checks, sanctions screening and monitoring on creators, as its own merchants.
- We keep only: the link between our channel and the provider account, onboarding status, sanctions or block decisions, terms acceptance, moderation records. **Never ID documents or bank details.** Not touching funds also means we have no anti-money-laundering programme duty of our own (**lawyer to confirm**).

### 4.5 Consumer law

- **A gift is probably not a consumer contract for goods, services or digital content.** So the EU and UK 14-day withdrawal right is likely not engaged (EU Consumer Rights Directive 2011/83/EU, EUR-Lex (`https://eur-lex.europa.eu/eli/dir/2011/83/oj`)). No source addresses tips directly: **Unverified**. Any perk would change this ([§10](#10-optional-paid-perks-designed-not-scheduled)).
- **UK subscription rules (DMCC Act 2024)** exclude donations where the donor gets nothing (Birketts (`https://www.birketts.co.uk/legal-update/implications-for-charities-of-the-digital-markets-competition-and-consumers-act-2024/`), accessed 2026-11-22). They start in **spring 2027** ([UK government response](https://www.gov.uk/government/consultations/consultation-on-the-implementation-of-the-new-subscription-contracts-regime/outcome/government-response-to-consultation-on-the-implementation-of-the-new-subscription-contracts-regime-web-accessible-version), 2 Apr 2026).
- **US:** the FTC "click to cancel" rule was vacated by the Eighth Circuit in July 2025; the FTC restarted rulemaking in March 2026 with no proposed rule yet; ROSCA enforcement continues ([Gibson Dunn](https://www.gibsondunn.com/ftc-restarts-negative-option-rulemaking-after-eighth-circuit-vacatur-enforcement-under-rosca-continues/), [Kirkland, Mar 2026](https://www.kirkland.com/publications/kirkland-alert/2026/03/ftc-restarts-subscription-rulemaking)). **California's automatic renewal law** (as amended by AB 2863, from 1 Jul 2025) requires express consent, online cancel and an annual reminder (Fenwick (`https://fenwick.com/insights/publications/california-tightens-requirements-for-automatically-renewing-subscriptions`), accessed 2026-11-22). New York GBL 527-a applies too.
- Whether these cover recurring gifts is untested. **We meet the strictest standard anyway:** amount and frequency up front, a separate consent tick, a receipt each month, one-click stop, a reminder before the first renewal and yearly, and a 7-day "it was a mistake" window. It costs little and cuts chargebacks.

### 4.6 Data protection and card security

- **Supporting an Islamic creator can reveal religious belief**, which is special-category data under GDPR and UK GDPR (Art. 9). Supporter lists are private to the creator; there is no public supporter wall; a supporter can hide their name from the creator too. The lawyer is asked whether a DPIA is needed.
- The provider is an independent controller for payment data. We keep the minimum ([§9.3](#93-data-model-search-d1-admin-api-owned-migrations)).
- **PCI DSS:** hosted checkout keeps us in the lightest scope (SAQ A); we must still protect our pages that start the checkout ([PCI SSC](https://www.pcisecuritystandards.org/document_library/)).
- Erasure keeps payment rows as financial records under the erased placeholder, like billing today ([§9.8](#98-erasure-and-retention)).

### 4.7 Ages

See [§2.5](#25-minors): 18+ to support and to receive.

### 4.8 Terms

- **Creator agreement** (new): support is a voluntary gift and nothing may be promised in return; the creator contracts with the provider and is the merchant; the platform takes 0% and never holds funds; the creator alone handles their taxes; 18+; sanctions warranty; refunds and chargebacks are the creator's; no fundraising for others or "zakat" claims unless a registered charity on the charity route; we can pause support for policy reasons.
- **Supporter terms** (added to the site terms): support is a voluntary gift, nothing is received, not tax-deductible (unless the charity route); monthly terms and how to stop; the refund policy; 18+; country limits; the provider's own terms apply; the privacy notice.
- **Changes** to terms: 30 days' notice for material changes; at least 15 days for business users in the EU under the P2B Regulation (EUR-Lex 2019/1150 (`https://eur-lex.europa.eu/eli/reg/2019/1150/oj`)).
- The lawyer drafts or reviews both before launch ([§14.1](#141-us-lawyer)).

## 5. Fees

**Al Ummah Now takes 0%.** All fees below are vendors' or governments'.

### 5.1 PayGood fees

All from PayGood's site and docs, accessed 2026-11-22 ([paygood.com](https://paygood.com), [docs](https://docs.paygood.com/introduction)).

| | PayGood |
|---|---|
| Card | 2.9% + 30¢; a nonprofit preset of 1.9% + 30¢ exists in onboarding; interchange-plus pricing on request |
| Bank (ACH) | 0.5%, capped at $5 |
| Cross-border card surcharge | none published (**Unverified**) |
| Currencies | USD and CAD only. A supporter paying in another currency pays their card issuer's foreign-transaction fee (often 0–3%) |
| Payout to the creator's bank | none published (**Unverified**); US or Canadian bank only |
| Chargeback | "as outlined in your merchant agreement" (amount **Unverified**) |
| Monthly or account fee | none published (**Unverified**) |
| Supporter covers the fee | "Customer can choose to cover the processing fee" exists for invoices; for subscriptions **Unverified** |
| Platform fee (ours) | $0 |

### 5.2 Worked examples: $5.00 a month, 0% platform fee

The creator is in the **US or Canada** (the only places PayGood pays out, [§7](#7-international-and-sending-funds)). Taxes: none, because a gift with nothing in return is outside VAT/GST ([§6](#6-taxes)); the creator owes income tax on what they receive.

| Supporter in | PayGood fee | Creator receives | Supporter covers fees: pays | Supporter-side cost (not deducted) |
|---|---|---|---|---|
| US | $0.45 | **$4.56** | $5.46 | none |
| UK | $0.45 | **$4.56** | $5.46 | card issuer's foreign-transaction fee, GBP→USD, 0–3% |
| Germany | $0.45 | **$4.56** | $5.46 | EUR→USD, 0–3% |
| Egypt | $0.45 | **$4.56** | $5.46 | EGP cards often limited for USD spend (**Unverified**) |
| Pakistan | $0.45 | **$4.56** | $5.46 | PKR→USD; international card limits (**Unverified**) |
| Indonesia | $0.45 | **$4.56** | $5.46 | IDR→USD |
| Saudi Arabia | $0.45 | **$4.56** | $5.46 | mada debit cards may not work cross-border (**Unverified**) |
| Malaysia | $0.45 | **$4.56** | $5.46 | MYR→USD |
| Nigeria | $0.45 | **$4.56** | $5.46 | NGN card limits common (**Unverified**) |

Assumes PayGood accepts foreign cards with no surcharge (none published; ask PayGood, [§12.1](#121-paygood-what-it-can-and-cant-do)). A creator who is a registered nonprofit on the 1.9% + 30¢ preset receives $4.61. **A creator in any of those other countries can't receive through PayGood today** ([§7](#7-international-and-sending-funds)).

**Small amounts hurt.** The fixed 30¢ is 6% of $5. Hence the recommended $3 minimum and presets from $5 ([§15](#15-owner-decisions)).

### 5.3 Fixed costs against the $500/month cap

| Item | Monthly |
|---|---|
| PayGood platform or account fees | $0 (none published, **Unverified**: confirm in writing) |
| Workers, D1 rows, queue messages for support | within today's plan; under $5 at S2 scale |
| KYC, sanctions screening | $0 (PayGood's and Finix's, inside the card fee; **Unverified**) |
| Per-creator secrets (if creators connect their own API keys, [§12.1](#121-paygood-what-it-can-and-cant-do)) | $0: encrypted in D1 with a key from Secrets Store, not one Secrets Store entry per creator |

**Outside the infrastructure cap** (business costs, owner decision [S3](AUN-SUBS-subscriptions-plan.md)): entity formation, registered agent, insurance, lawyer and accountant ([§12](#12-partners-and-vendors)).

If PayGood ever adds per-account fees, the options are: show them to the creator in Studio as a plain line ("PayGood charges $X a month for your account"), or let the supporter cover them through "cover the fees". Never a platform margin.

### 5.4 The breakdown before paying

`SupportProvider.quote()` returns the provider fee, currency exchange estimate and tax for the supporter's country and the creator's account, before checkout. The sheet shows every line ([§11.2](#112-breakdown-before-paying-always-shown)), including "Al Ummah Now takes: $0.00". The receipt shows the final amounts from the provider's event. If the quote can't be computed (PayGood unreachable), the sheet says so and does not let the person pay blind.

## 6. Taxes

### 6.1 Indirect tax (VAT, GST, sales tax)

- **A gift with nothing in return is outside VAT** in the EU: in *Tolsma* (C-16/93, 1994), money given to a street musician was not consideration ([BAILII](https://mansfield.bailii.org/eu/cases/EUECJ/1994/C1693.html)). **UK HMRC:** donations "freely given … who receives nothing in return" are outside VAT ([VCHAR9200](https://www.gov.uk/hmrc-internal-manuals/vat-charities-manual/vchar9200)); optional tips are outside scope ([VATSC06130](https://www.gov.uk/hmrc-internal-manuals/vat-supply-and-consideration/vatsc06130)) (accessed 2026-11-22).
- **US sales tax** reaches sales of property and listed services; a gift is generally not a sale. **Elsewhere** (Saudi Arabia, UAE, Egypt, India, Indonesia, Malaysia, Nigeria, Turkey, Pakistan, Bangladesh, Canada, Australia) VAT/GST also needs a supply for consideration; likely the same, **Unverified** per country.
- **What breaks it:** any perk, badge, shout-out, early access or tier named after a benefit. Then the payment is consideration for a digital service and VAT applies at the supporter's location. The EU deemed-supplier rule (Art. 9a, Implementing Regulation 282/2011) would then likely make **us** the seller, **even at 0%**, because the test is control (setting terms, authorising the charge), not fees (legislation.gov.uk (`https://www.legislation.gov.uk/eur/2011/282/article/9a/data.htm`); *Fenix* C-695/20, [DLA Piper](https://www.dlapiper.com/en-jp/insights/publications/2023/03/validity-of-article-9a-of-council-implementing-regulation-282-2011-confirmed)). Some US marketplace-facilitator laws catch a platform that "makes payment processing available" ([MTC white paper](https://www.mtc.gov/wp-content/uploads/2023/02/Wayfair-and-Marketplace-White-Paper-FINAL-7-8-2021.pdf)). This is the biggest reason perks are off ([§10](#10-optional-paid-perks-designed-not-scheduled)).
- With a 0% cut we sell nothing to creators either, so there is no VAT on a platform commission.

### 6.2 Who is the seller of record

Nobody, for a pure gift: there is no supply. The creator is the **payee** and the provider's merchant. If perks are added, see above.

### 6.3 Creators' income tax and reporting

- **Support is generally taxable income for the creator**, not a tax-free gift: payments tied to someone's public work fail the *Duberstein* "detached generosity" test ([Journal of Accountancy, Sep 2024](https://www.journalofaccountancy.com/issues/2024/sep/taxation-of-influencers-gifts-with-strings-attached.html)). Studio says "You're responsible for tax on what you receive" and gives no advice. US creators may be able to use the "no tax on tips" deduction for digital content creators ([Hollywood Reporter on Treasury guidance](https://www.hollywoodreporter.com/business/business-news/no-tax-on-tips-guidance-creators-trump-treasury-1236366513)); the accountant confirms.
- **Supporters can't deduct** support to an individual (IRS Publication 526). Only the charity route can give deductible receipts ([§3.7](#37-charity-creators-registered-charities)).
- **US 1099-K** is filed by the **payment settlement entity** (the provider), above $20,000 and 200 transactions again under the 2025 law ([IRS FAQ](https://irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000)). **1099-NEC/MISC** ($2,000 from 2026) applies only if we pay creators ourselves, which we never do. W-9 / W-8BEN forms are collected by the provider during onboarding.
- **Withholding:** services performed abroad are foreign-source, so no US 30% withholding on non-US creators' support is expected ([IRS](https://www.irs.gov/node/1204)); gift-like income sourcing is **Unverified**. The provider handles any backup withholding.
- **Platform reporting rules still matter at 0%.** EU DAC7, UK digital platform reporting (from 1 Jan 2024, [GOV.UK](https://www.gov.uk/guidance/check-if-you-need-to-register-as-a-digital-platform-operator)), Canada Part XX and Australia's sharing economy regime follow the OECD model. A fee is not required to be in scope. But a "relevant activity" needs **consideration**, and a pure gift may have none, so a gift-only platform may be outside them ([Wolters Kluwer on DAC7 and creators](https://legalblogs.wolterskluwer.com/international-tax-law-blog/dac7-and-digital-content-creators-opaque-transparency-for-influencers-streamers-and-other-content-creators/)). **The accountant decides**. If we are in scope, the data model already holds what is reported (creator identity link, country, totals per quarter from the ledger), and the provider's KYC holds the rest.

### 6.4 Our own tax

With 0% revenue, the platform has no income from support. The accountant is asked how the company is funded and taxed ([§14.2](#142-accountant-or-tax-adviser)).

## 7. International and sending funds

### 7.1 Where creators can receive

**PayGood serves businesses in the United States and Canada only**, in USD and CAD, and pays out to a US or Canadian bank account ([paygood.com](https://paygood.com), [docs](https://docs.paygood.com/introduction), accessed 2026-11-22).

| Creator country | Through PayGood |
|---|---|
| US, Canada | **Yes** (a US or Canadian business or sole proprietor with a local bank; sole proprietors **Unverified**: PayGood's text says "small businesses") |
| UK, EU, Turkey, the Gulf, Jordan, Morocco, Senegal, Egypt, Pakistan, Bangladesh, Indonesia, Malaysia, India, Nigeria, Algeria, Tunisia, Lebanon, Iraq, Palestine, Somalia, Yemen, Afghanistan, every other country | **No** |
| Iran, Syria, Sudan, Cuba, North Korea, Crimea/DNR/LNR | No (sanctions or provider policy, [§4.3](#43-sanctions-and-high-risk-countries)) |

**Supporters** can be anywhere PayGood accepts the card (foreign cards **Unverified**) and that isn't blocked by sanctions or the Countries page.

**Payout rails:** bank only (US ACH, Canadian EFT). Schedule and minimum **Unverified**. No wallets (JazzCash, Easypaisa, bKash, GoPay, Vodafone Cash) and no foreign banks.

**This is the biggest gap.** Most Muslim creators live outside the US and Canada. PayGood can't pay them today. This page doesn't swap providers; it asks PayGood and lists the choices as an owner decision ([MEM-D2](#15-owner-decisions)).

### 7.2 Creators outside the US and Canada

What we can do **without another provider**:

- **Ask PayGood** about international merchants and payouts. The team behind it runs LaunchGood, which already pays campaigners worldwide by USD wire ($12–20, [LaunchGood payouts](https://support.launchgood.com/support/solutions/articles/35000013654), 4 Feb 2026), so they know the need (MEM-1).
- **A creator with a US or Canadian entity and bank** (for example a US LLC owned by a non-US creator, or a Canadian masjid) can use PayGood today if PayGood accepts them. Studio says so plainly; we give no tax or formation advice.
- **External support link** for the rest: the creator's own LaunchGood page, bank details shown on request, or another service they already use. We show it with "You'll leave Al Ummah Now. This page is run by {site}." and take nothing. It costs nothing, keeps us out of the money and satisfies Apple's gift rule because nothing is unlocked ([§8](#8-app-stores)). Behind its own switch, `supportExternalLinks`, default off; admins review each link once. The Countries page marks these countries "external link only".

Adding a second provider for those countries is listed only as a non-recommended option under MEM-D2, because it would change P1.

## 8. App stores

Support with nothing in return and **100% of the funds to the creator** is the case every store treats most simply. The [Apple guideline 3.2.1(vii)](https://developer.apple.com/app-store/review/guidelines/) (guidelines revised 16 Oct 2026): "Apps may enable individual users to give a monetary gift to another individual without using in-app purchase, provided that (a) the gift is a completely optional choice by the giver, and (b) 100% of the funds go to the receiver of the gift. However, a gift that is connected to or associated at any point in time with receiving digital content or services must use in-app purchase."

| Store | One-time and monthly support | Fee to the store | Notes |
|---|---|---|---|
| Apple, every storefront (iOS, iPadOS, macOS) | Our provider checkout, under 3.2.1(vii) | 0% | Button only on the channel page. Insight Timer precedent: profile donations stayed outside in-app purchase; donations tied to live events or meditations had to use it ([TechCrunch](https://techcrunch.com/2024/02/21/in-a-reversal-apple-is-now-demanding-30-of-the-donations-to-meditation-app-insight-timers-teachers/amp), 21 Feb 2024). **Unverified:** whether Apple counts card fees against "100%", and whether it accepts a recurring gift outside in-app purchase. Ask App Review in writing first. |
| Apple, US storefront | Also allowed: a button to web checkout, no entitlement needed (3.1.1(a), 3.1.3) | 0% today; the Ninth Circuit (11 Dec 2025) allows a future cost-based fee; no rate set as of this page ([opinion](https://cases.justia.com/federal/appellate-courts/ca9/25-2935/25-2935-2025-12-11.pdf); [Supreme Court stay denied, 6 May 2026](https://9to5mac.com/2026/05/06/supreme-court-rejects-apples-stay-request-epic-games-case-to-head-back-to-district-court/)) | Fallback if App Review refuses 3.2.1(vii) |
| Apple tvOS | No checkout on TV. A **QR code** to the web support sheet on the channel page | 0% | Same 3.2.1(vii) basis; **Unverified** for tvOS |
| Apple, charity route | Only approved nonprofits with Apple Pay (3.2.1(vi)); every listed charity must be approved; otherwise web only (3.2.2(iv)) | 0% | |
| Google Play | Outside Play Billing as a **peer-to-peer payment** (the Payments policy excludes peer-to-peer payments and tax-exempt donations, [Play policy](https://support.google.com/googleplay/android-developer/answer/9858738), accessed 2026-11-22) | 0% | **Unverified** that creator support counts as peer-to-peer. Ask Play policy support in writing. In the US, EEA and UK, external links and own billing are also allowed through Google's programmes (fees from 1 Oct 2026: 10% subscriptions, 20% other, 20% external links on existing installs, [Play fees](https://support.google.com/googleplay/android-developer/answer/112622)). |
| Microsoft Store (Windows, non-game) | Our provider; donations **must** use our own or a third-party payment API (policy 10.8.2, [Store Policies 7.20](https://learn.microsoft.com/en-us/windows/apps/publish/store-policies), 14 Sep 2026) | 0% | Declare third-party commerce in Partner Center |
| Linux, Tizen, direct downloads | Our provider (Tizen TV: QR code) | 0% | |

**If a store refuses:** that app shows no Support button (hidden, per [Product rules](../guides/product-rules.md)), and the server's `support` key is off for that client. Support stays on the web. We never sell support through in-app purchase, because the store's cut would break "100% to the creator" and the owner's 0% rule.

**Perks** ([§10](#10-optional-paid-perks-designed-not-scheduled)) are digital content: in-app purchase on Apple outside the US, EU and Japan programmes; Play Billing outside Google's programmes; own commerce allowed on Windows. Web-bought perks can be honoured in the Apple app only if also sold as in-app purchase (3.1.3(b)).

## 9. Architecture

### 9.1 Principles

- **We never hold money.** Every charge goes from the supporter to the creator's own account at the payment provider. The platform is not the payee, never has a balance, and earns nothing on float. Our database mirrors what the provider tells us. It never computes a balance that money moves on.
- **The provider is the source of truth.** Every number a creator sees about money ("received", "paid out", "pending") is read from provider events or the provider's API. If our mirror and the provider disagree, the provider wins and reconciliation flags the gap.
- **Always async** ([O26](decisions.md#o26-always-async-with-admin-visible-errors)). Webhooks are verified, stored once and handled by a queued job with retry, backoff and a DLQ. Anything that gives up shows on the admin **Errors** page with **Retry**, and on the job's own page with its log lines.
- **Server decides.** The server checks the feature switch, the country rules, the creator's account state and the supporter's eligibility on every request. Clients only hide what the server says is off.
- **Troubleshooting from admin, never from Cloudflare or the provider dashboard.** Each job, webhook and account has a page with its state, attempts, next retry, the provider's last answer and the log lines.

### 9.2 Building on what exists

AUN-SUBS already shipped a payments framework, off by default: one `PaymentProvider` interface, `billing_events` (idempotent by provider, mode and event id), the `billing.webhook` admin job, sweeps, Settings › Billing and the admin Payments page (AlUmmahNow `docs/features/payments.md`). That framework sells **tiers to the platform**: the platform is the merchant.

Creator support is different: the **creator** is the merchant, with their own PayGood merchant id, API access and webhook endpoint. So support gets its own adapter interface, `SupportProvider`, next to `PaymentProvider`, and its own tables. It reuses:

- the webhook route shape (`POST /webhooks/support/:provider`), raw-body signature check and the `admin_jobs` queue with its backoff (10 s × 2ⁿ up to 300 s, 5 tries, then `failed` and the DLQ);
- Secrets Store for credentials (write-only, "Set / Not set");
- step-up for sensitive admin actions;
- the erasure rules in `apps/processor/src/erasure/user-traces.ts`;
- the Features page switch ([AUN-FEATURES](AUN-FEATURES-feature-switches.md)).

```ts
interface SupportProvider {
  id: SupportProviderId;
  // Creator onboarding: PayGood hosts KYC, bank details and tax forms. Today this is our
  // merchant referral link plus the creator connecting their own merchant (§12.1).
  createAccountLink(creator: CreatorRef, returnUrl: string): Promise<{ url: string; expiresAt: string }>;
  getAccount(accountId: string): Promise<SupportAccountState>;      // status, country, currency, requirements due, payouts on/off
  // Supporter checkout, hosted by the provider (PCI SAQ A on our side).
  createCheckout(input: SupportCheckoutInput): Promise<{ url: string; checkoutId: string }>;
  cancelPledge(pledgeId: string, reason: CancelReason): Promise<void>;
  refund(paymentId: string, amount?: Money): Promise<RefundResult>;  // from the creator's account, never ours
  quote(input: QuoteInput): Promise<FeeQuote>;                       // vendor fees + tax + FX, before paying (§5.4)
  verifyWebhook(req: Request, rawBody: ArrayBuffer): Promise<ProviderEvent[]>;
  listPayouts?(accountId: string, since: string): Promise<ProviderPayout[]>; // PayGood's public API has none today
}
```

### 9.3 Data model (search D1, admin-api owned migrations)

No table holds a balance. Amounts are integers in minor units with an ISO 4217 currency.

| Table | One row per | Key columns |
|---|---|---|
| `support_accounts` | creator payout account at a provider | `id`, `channel_id`, `owner_user_id`, `provider`, `mode` (test/live), `provider_account_id`, `country`, `default_currency`, `status` (`not_started`, `pending`, `action_needed`, `active`, `restricted`, `disabled`, `closed`), `charges_enabled`, `payouts_enabled`, `requirements` (JSON, what the provider still needs), `sanctions_status`, `updated_from_event_at` |
| `support_settings` | channel | `channel_id`, `enabled`, `one_time_enabled`, `monthly_enabled`, `presets` (JSON amounts per currency), `min_amount`, `thank_you_note` (en/ar or the creator's language), `show_supporter_count` |
| `support_pledges` | monthly support | `id`, `supporter_user_id`, `channel_id`, `support_account_id`, `provider_subscription_id`, `amount`, `currency`, `supporter_covers_fees`, `status` (`active`, `past_due`, `canceled`, `ended`), `started_at`, `current_period_end`, `canceled_at`, `cancel_reason`, `anonymous` |
| `support_payments` | charge (one-time or a monthly renewal) | `id`, `pledge_id?`, `supporter_user_id`, `channel_id`, `provider_payment_id`, `gross`, `currency`, `provider_fee`, `tax`, `fx_rate?`, `net_to_creator` (as the provider reports it), `status` (`succeeded`, `failed`, `refunded`, `partially_refunded`, `disputed`, `dispute_lost`, `dispute_won`), `message?` (moderated), `anonymous`, `supporter_country`, `created_at` |
| `support_refunds` | refund | `id`, `payment_id`, `amount`, `reason`, `requested_by` (`creator`, `admin`, `provider`), `status`, `provider_refund_id` |
| `support_disputes` | chargeback / dispute | `id`, `payment_id`, `provider_dispute_id`, `reason`, `amount`, `fee`, `status`, `evidence_due_at`, `outcome` |
| `support_payouts` | provider payout to the creator's bank (mirror, read-only; empty until PayGood exposes payouts) | `id`, `support_account_id`, `provider_payout_id`, `amount`, `currency`, `rail`, `status`, `arrival_date`, `failure_reason?` |
| `support_events` | provider webhook event (the ledger) | `provider`, `mode`, `event_id` (unique together), `type`, `received_at`, `payload` (emptied on erasure), `job_id`, `status`, `error?` |
| `support_country_rules` | country | `country`, `supporters` (`allowed`, `blocked`), `creators` (`allowed`, `blocked`, `waitlist`), `reason` (`sanctions`, `provider_unsupported`, `legal_review`, `admin`), `changed_by`, `changed_at` |
| `support_reports` | abuse / fraud report on a creator or payment | `id`, `target_kind`, `target_id`, `reporter_user_id`, `reason`, `status` |

Every admin change writes `admin_audit` with the old and new value. Creator-side actions (turn support on, change presets, refund a supporter) write `channel_audit` too, so they show on the channel Team page's Activity tab.

### 9.4 Webhooks and jobs

1. `POST /webhooks/support/:provider` checks the signature on the raw body, then stores the event once in `support_events` (`provider, mode, event_id`). A redelivery stores nothing new. It queues `support.webhook` and answers 200. A failure before the event is stored answers 503, so the provider redelivers.
2. `support.webhook` maps the event and applies it to the tables above, keyed by the provider's ids. It is idempotent. An older event never moves a status back. A payment that arrives before its pledge retries.
3. Other jobs, all on `admin_jobs` with per-job log lines (`admin_job_logs`):

| Job | When | What it does |
|---|---|---|
| `support.account-sync` | after onboarding returns; on account events; daily | Reads the account state and requirements from the provider. |
| `support.payout-sync` | on payout events; daily (once PayGood exposes payouts, MEM-D16) | Mirrors payouts and failures. A failed payout flags the creator and the admin. |
| `support.reconcile` | hourly for pledges whose renewal is late; daily for all yesterday's payments | Compares our mirror with the provider's list. A gap is flagged on Errors with Retry. |
| `support.dispute-deadline` | daily | Flags disputes whose evidence is due within 3 days. |
| `support.sanctions-recheck` | when a sanctions list changes (provider event) and weekly | Re-reads screening results; a hit pauses the account (§4.3). |
| `support.country-apply` | when an admin blocks a country | Pauses pledges from or to that country through the provider, notifies the people affected. |

Every failure that needs a person shows on **Errors** with a reason in words and **Retry** ("Couldn't read Amina's PayGood account: PayGood answered 503. Retry"). Nothing silently drops.

### 9.5 Server-side checks on every app

`GET /api/me/features` gets two keys: `support` (can this user support creators here) and `supportReceive` (can this channel receive support). Each is computed on the server from:

- the `creatorSupport` switch on the Features page (default **off**);
- the country rule for the supporter's country (from the provider's billing country, with the request's country as a first filter) and the creator's account country;
- the creator's account: `active` with charges enabled;
- the channel's own setting;
- the store rules for the app asking (§8).

The API refuses with `404 feature_off` and the O40 envelope when any check fails. The web, Apple, Android, Desktop and Tizen clients hide the Support button when the key is off.

Perks (§10) add one more key, `supportPerks`, also server-checked. Nothing is unlocked on the client.

### 9.6 Admin pages (videos admin → Support)

| Page | Shows | Actions | Permission |
|---|---|---|---|
| Overview | accounts by status, payments today, failures, disputes due | – | `support:read` |
| Creators | each creator's account: status, country, what the provider still needs, payouts on/off, sanctions status | Re-sync, pause support for this channel, open the provider's own record id (copyable) | `support:read`, pause needs `support:manage` |
| Payments | every payment with fees, tax, net to the creator, status, the event trail | Refund (full or part), with step-up | `support:refund` (super admins) |
| Monthly support | pledges | Cancel, with step-up | `support:manage` |
| Disputes | disputes we learn of, with due dates | Download our records for the creator; upload evidence through PayGood's API once it has one (MEM-D16) | `support:manage` |
| Payouts | mirrored payouts and failures, once PayGood exposes them (MEM-D16); until then a link to the creator's PayGood dashboard | Re-sync | `support:read` |
| Countries | the country table (§4.3) | Block / allow supporters or creators per country, with a reason | `support:countries` (super admins) |
| Jobs | each support job with state, attempts, next retry, log lines | Retry now, cancel | `support:manage` |
| Settings | provider credentials (write-only), test/live, amount limits, presets | – | `support:providers` (super admins) |

Every action is audited. Permissions live in admin-api, like the rest of the videos admin. Nothing uses Auth RBAC.

### 9.7 The Features switch and kill switches

- **`creatorSupport`** on the Features page, group `grow`, default **off**, super admins only, confirm both ways. Off means: no Support button anywhere, the API refuses new checkouts, onboarding is hidden, and **existing monthly support keeps its schedule at the provider unless the admin also chooses "Pause all monthly support"** (a separate confirm in the dialog), because turning a feature off must not silently charge or silently stop people's gifts.
- **`supportExternalLinks`** (§7.2), default off, requires `creatorSupport`: creators in countries no provider covers can show their own support link.
- **`charityDonations`** (§3.7), default off, requires `creatorSupport`: the separate donation route for registered charities.
- **`supportPerks`** (§10), default off, requires `creatorSupport`.
- **Per-country** rules on the Countries page, for supporters and creators separately.
- **Per-channel** pause by an admin, and the creator's own on/off.
- **Emergency stop**: one button on the Support settings page that pauses every pledge at the provider and disables checkout, for a provider incident or a legal order. It is audited and needs step-up.

### 9.8 Erasure and retention

Erasing an account keeps payment rows as financial records under the erased placeholder (the same rule as billing), drops messages, provider customer ids and receipt links, and empties webhook payloads. Retention of financial records follows the accountant's answer (§14).

### 9.9 Features page entries

Added to the [AUN-FEATURES](AUN-FEATURES-feature-switches.md) registry, group `grow`, all **off**, super admins only, confirm both ways:

| Key | Name (en / ar) | Help: what people lose while it is off (en / ar) | Requires |
|---|---|---|---|
| `creatorSupport` | Supporting creators / دعم صنّاع المحتوى | Nobody can start supporting a creator, and creators can't set up payouts. Monthly support already running keeps its schedule unless you also pause it. / لا يستطيع أحد بدء دعم صانع محتوى، ولا يستطيع صنّاع المحتوى إعداد استلام المدفوعات. يستمر الدعم الشهري القائم في موعده ما لم توقفه أيضًا. | — |
| `supportExternalLinks` | Creators' own support links / روابط الدعم الخاصة بصنّاع المحتوى | Creators in countries no payment provider covers can't show their own support link. / لا يستطيع صنّاع المحتوى في البلدان التي لا يغطيها أي مزوّد دفع عرض رابط الدعم الخاص بهم. | `creatorSupport` |
| `charityDonations` | Donations to registered charities / التبرع للجمعيات الخيرية المسجّلة | Registered charities can't take donations on their channels. / لا تستطيع الجمعيات الخيرية المسجّلة تلقي التبرعات في قنواتها. | `creatorSupport` |
| `supportPerks` | Supporter perks / مزايا الداعمين | Nothing is unlocked for supporters. / لا يُفتح للداعمين أي محتوى. | `creatorSupport` |

## 10. Optional paid perks (designed, not scheduled)

**Not in the build order.** Behind the `supportPerks` switch, default off, which requires `creatorSupport`. Nothing here is built until the owner asks and the lawyer, accountant and scholar have answered the perk questions in [§14](#14-questions-for-a-lawyer-an-accountant-and-a-scholar).

**What changes the moment anything is unlocked:**

| Area | Support only | With perks |
|---|---|---|
| What it is (fiqh) | Gift (hiba) | Hire or sale (ijara / bay'): perks must be known, permissible and delivered ([§3.1](#31-what-the-payment-is)) |
| Consumer law | Likely no consumer contract | Digital service: EU/UK 14-day withdrawal unless waived on a durable medium; UK subscription rules from spring 2027; ROSCA and state auto-renewal laws apply ([§4.5](#45-consumer-law)) |
| VAT / sales tax | Outside scope | Taxable where the supporter is; the EU deemed-supplier rule likely makes **us** the seller even at 0% ([§6.1](#61-indirect-tax-vat-gst-sales-tax)); we'd need non-Union OSS, UK VAT, Saudi, UAE, India, etc. registrations, or a merchant of record that allows creator marketplaces (none found among non-Stripe MoRs) |
| App stores | 0% under 3.2.1(vii) and peer-to-peer | Apple in-app purchase (30%/15%, EU 26%/15%) except US link-out; Play Billing except its programmes ([§8](#8-app-stores)) |
| Platform money flow | Never holds funds | Same, but the tax role may force a merchant-of-record arrangement |

**Design, for when it is switched on:**

- **Tiers per channel:** up to 3, each with a monthly amount and a list of perks from a fixed catalogue: supporter badge next to the name in comments and chat; member-only posts; member-only videos (a visibility value next to Public, Unlisted, Private); member-only live; early access (a video is member-only for N days, then public).
- **Entitlements on the server only:** `support_entitlements(user_id, channel_id, tier_id, source_payment_id, valid_until)`, written by the webhook job, checked by api-videos on every member-only read (video manifest signing, post read, live join, chat badge). Signed playback URLs are issued only after the check. Clients never decide.
- **Grace:** access runs to the end of the paid period after a stop; a refund or lost dispute ends it at once.
- **Content rules:** perks must be permissible content; member-only videos go through the same review as public ones ([AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md)). No random rewards ([§3.5](#35-gharar-and-maysir)).
- **Price display:** each store's price where in-app purchase is required, with "Price differs in the app because of {store}'s fee" where the law allows saying so.
- **Admin:** a perk catalogue on the Support settings page, per-tier limits, and a Members tab on each channel.


## 11. Screens and copy (English and Arabic samples)

Copy follows the [Copy Tone Guide](../guides/copy-tone.md), the [Numbers and dates](../guides/numbers-and-dates.md) rule (Arabic ٠–٩, never grouped, money by currency name, values separated by «،») and the [glossary](../guides/glossary.md) («مرئي» for video). Amounts below are placeholders the formatter fills; they are written out here only so the samples read.

### 11.1 Support button and sheet (watch page, channel page)

| Element | English | Arabic |
|---|---|---|
| Button | Support | ادعم |
| Sheet title | Support {channel} | ادعم {channel} |
| What it is | Your support is a gift to {channel}. Nothing is unlocked in return. | دعمك هديةٌ إلى {channel}، ولا يُفتح لك مقابلها أي محتوى. |
| Not charity | This isn't zakat or sadaqa to a charity. {channel} is not a registered charity. | هذا ليس زكاةً ولا صدقةً لجمعية خيرية، فـ{channel} ليست جمعية خيرية مسجّلة. |
| Choice | One time · Monthly | مرة واحدة، شهريًا |
| Amount presets | $3 · $5 · $10 · Other | ٣ دولار أمريكي، ٥ دولار أمريكي، ١٠ دولار أمريكي، مبلغ آخر |
| Cover fees | Add {fees} so {channel} receives the full {amount} | أضف {fees} ليصل المبلغ كاملًا ({amount}) إلى {channel} |
| Message | Add a message (optional, public only if {channel} shows it) | أضف رسالة (اختياري، ولا تظهر للعامة إلا إذا عرضتها {channel}) |
| Anonymous | Don't show my name to {channel} | لا تُظهر اسمي لـ{channel} |
| Continue | Continue to payment | المتابعة إلى الدفع |

### 11.2 Breakdown before paying (always shown)

| Line | English | Arabic |
|---|---|---|
| You pay | You pay: $5.00 a month | تدفع: ٥٫٠٠ دولار أمريكي شهريًا |
| Tax | Tax ({country}): $0.00 | الضريبة ({country}): ٠٫٠٠ دولار أمريكي |
| Payment provider | Payment provider fee (estimate): $0.47 | رسوم مزوّد الدفع (تقديرية): ٠٫٤٧ دولار أمريكي |
| Currency exchange | Currency exchange (estimate): $0.00 | تحويل العملة (تقديري): ٠٫٠٠ دولار أمريكي |
| Al Ummah Now | Al Ummah Now takes: $0.00 | تأخذ الأمة الآن: ٠٫٠٠ دولار أمريكي |
| Creator receives | {channel} receives about $4.53 | يصل إلى {channel} نحو ٤٫٥٣ دولار أمريكي |
| Note | Fees are set by the payment provider and can change. The receipt shows the final amounts. | الرسوم يحددها مزوّد الدفع وقد تتغيّر، ويُظهر الإيصال المبالغ النهائية. |

### 11.3 After paying

| | English | Arabic |
|---|---|---|
| One time | Thank you. Your gift of $5.00 reached {channel}'s payment account. | جزاك الله خيرًا. وصلت هديتك (٥٫٠٠ دولار أمريكي) إلى حساب الدفع لدى {channel}. |
| Monthly | Thank you. You support {channel} with $5.00 a month. Next payment: {date}. You can stop any time in Settings › Support. | جزاك الله خيرًا. تدعم {channel} بمبلغ ٥٫٠٠ دولار أمريكي شهريًا. الدفعة التالية: {date}. يمكنك الإيقاف متى شئت من الإعدادات › الدعم. |

### 11.4 Settings › Support (supporter)

| | English | Arabic |
|---|---|---|
| Page title | Support | الدعم |
| Row | {channel} · $5.00 a month · next on {date} | {channel}، ٥٫٠٠ دولار أمريكي شهريًا، التالية في {date} |
| Stop | Stop monthly support | إيقاف الدعم الشهري |
| Stop dialog | Stop supporting {channel} monthly? No more payments will be taken. Past gifts aren't refunded. | هل تريد إيقاف دعمك الشهري لـ{channel}؟ لن تُخصم أي دفعات بعد الآن، ولا تُستردّ الهدايا السابقة. |
| Stopped | Stopped. No more payments will be taken. | تم الإيقاف، ولن تُخصم أي دفعات بعد الآن. |
| Renewal reminder email subject | Your monthly support for {channel} renews on {date} | يتجدّد دعمك الشهري لـ{channel} في {date} |

### 11.5 Creator: Studio › Support

| | English | Arabic |
|---|---|---|
| Empty state | Let your viewers support you. Payments go straight to your own payment account. Al Ummah Now takes nothing. | دع مشاهديك يدعمونك. تصل المدفوعات مباشرةً إلى حساب الدفع الخاص بك، ولا تأخذ الأمة الآن شيئًا. |
| Start | Set up payouts | إعداد استلام المدفوعات |
| Hand-off | You'll finish on {provider}'s site: your identity, your bank or wallet, and your tax details. We never see your bank details. | ستكمل الإعداد على موقع {provider}: هويتك، وحسابك المصرفي أو محفظتك، وبياناتك الضريبية. لا نطّلع على بياناتك المصرفية أبدًا. |
| Action needed | {provider} needs more from you before payouts can start: {items}. | يحتاج {provider} إلى معلومات إضافية قبل بدء التحويلات: {items}. |
| Not available | Receiving support isn't available in {country} yet. | استلام الدعم غير متاح في {country} حتى الآن. |
| Totals | Received this month: {amount} · Supporters: {count} | ما وصلك هذا الشهر: {amount}، الداعمون: {count} |
| Taxes | You're responsible for tax on what you receive. {provider} may send you a tax form. | أنت المسؤول عن ضريبة ما يصلك، وقد يرسل إليك {provider} نموذجًا ضريبيًا. |

### 11.6 Admin (videos admin › Support)

| | English | Arabic |
|---|---|---|
| Country block | Block supporters in {country}? New payments stop now. {count} monthly supports are paused at the provider. | حظر الداعمين في {country}؟ تتوقف الدفعات الجديدة فورًا، ويُعلَّق {count} من الدعم الشهري لدى المزوّد. |
| Job failed | Couldn't read {creator}'s payout account from {provider}: {reason}. | تعذّرت قراءة حساب الاستلام لـ{creator} من {provider}: {reason}. |
| Retry | Retry | إعادة المحاولة |
| Emergency stop | Stop all support now | إيقاف كل الدعم الآن |

## 12. Partners and vendors

### 12.1 PayGood: what it can and can't do

Read from PayGood's public site, docs and API reference on 2026-11-22 ([docs index](https://docs.paygood.com/llms.txt)) and from our adapter (`apps/api-videos/src/lib/billing/paygood.ts`, AlUmmahNow PR 1653).

| Need | PayGood today | What it means here |
|---|---|---|
| Creator is the merchant; platform never holds funds | **Yes.** Each business is its own PayGood merchant (Finix underneath) and is paid to its own bank. PayGood is not a merchant of record. | Fits. Each creator onboards as a PayGood merchant. |
| A platform onboarding many merchants (connected or sub-merchant accounts) | **Not in the public API.** API keys belong to one merchant ("Server-to-server integration surface for merchant API keys"); there is no platform/OAuth connect flow. There is a **merchant referral** API (a stable referral code per merchant). | We can send creators to PayGood with our referral code. To create checkouts for them we need either a partner arrangement from PayGood, or each creator's own API key. **Owner decision MEM-D1.** |
| One-time support | **Yes**: catalog one-time prices, invoices with hosted checkout. | |
| Monthly support | **Yes**: fixed-amount subscriptions (daily, weekly, monthly, yearly) with hosted checkout ([subscriptions guide](https://docs.paygood.com/guides/subscriptions.md)). A new amount needs a new price and offering. | Presets per creator; "Other" amounts create a price on demand (PayGood dedupes equal prices). |
| Cancel | **Immediate** at PayGood, no cancel-at-period-end. | Fine for gifts: stopping means no more charges. |
| Refunds | **Yes**, full or partial, synchronous through Finix; event `payments.PaymentRefunded`. | Refunds come out of the creator's merchant account. |
| Disputes and chargebacks | **No dispute endpoints** in the public API; fee per merchant agreement. | Creators answer disputes in their PayGood dashboard; our Disputes page shows what we know and hands them our records. Ask PayGood for dispute webhooks. |
| Payout list | **No payout endpoints** in the public API. | Studio links to the creator's PayGood dashboard for payouts; we don't mirror them. Ask PayGood. |
| Webhooks | **Yes**, per merchant endpoint, signed (`Merchant-Webhook-*`, HMAC-SHA256, 5-minute window), redelivery API. | One endpoint per creator merchant, registered through their key or by them. Each has its own signing secret. |
| Countries | **US and Canada** merchants; USD and CAD. | [§7](#7-international-and-sending-funds). **Owner decision MEM-D2.** |
| Foreign supporters' cards | Not stated (**Unverified**). | Ask PayGood. |
| Individuals (sole proprietors) | Not stated; text says "small businesses"; onboarding asks for every owner with 25% or more (**Unverified** for individuals). | Ask PayGood. |
| Donations and religious organisations | **Allowed.** The acceptable-use policy restricts weapons, drugs, adult content, gambling, investment schemes and deceptive fundraising claims; onboarding offers MCC 8398 (charitable) and 8661 (religious organisations). It forbids "third party" payments. | Creator support by the creator's own merchant fits; collecting for others doesn't. |
| KYC and sanctions | PayGood/Finix onboard and verify merchants (owners, bank). Sanctions screening of merchants and payers is **Unverified** in public text. | We still geo-block and keep the Countries page ([§4.3](#43-sanctions-and-high-risk-countries)). Ask PayGood. |
| Tax | Not a merchant of record; invoices can carry merchant-calculated tax. 1099-K filer **Unverified** (likely PayGood/Finix as payment settlement entity). | Gifts carry no tax; creators handle income tax ([§6](#6-taxes)). Ask PayGood who issues 1099-K. |
| Supporter covers the fee | Yes for invoices ("Customer can choose to cover the processing fee"); subscriptions **Unverified**. | Otherwise we gross up the amount ourselves and show it. |
| Customer portal | None. | Settings › Support is the place to stop, as with tiers today. |

### 12.2 Recommended stack (PayGood only)

- **PayGood**, with each creator as their own PayGood merchant, the creator as payee and **no platform fee**. Our adapter starts hosted checkouts for the creator's merchant, receives the creator's merchant webhooks, and never sees card or bank data.
- **How we act for a creator's merchant** (owner decision MEM-D1, recommended first):
  1. **"PayGood partner access"**: ask PayGood for a platform arrangement (referral onboarding plus a scoped key or OAuth per referred merchant). Cleanest; depends on PayGood.
  2. **"Creator connects their PayGood key"**: works with today's public API. The creator creates a PayGood API key in their dashboard and pastes it into Studio once. We encrypt it (key from Secrets Store, ciphertext in D1), never show it back, and use it only for checkout, subscriptions, refunds and webhook setup on their merchant. Revocable by the creator at PayGood at any time.
  3. **"Creator pastes checkout links"**: no API; the creator makes PayGood checkout links and pastes them. No breakdown, no tracking, no cancel in Settings. Last resort.
- **Outside the US and Canada:** the creator's own external support link ([§7.2](#72-creators-outside-the-us-and-canada)) until PayGood serves more countries.

### 12.3 Other providers researched (for the record, not recommended)

Recorded only so the owner sees what exists; P1 stands. PayPal Complete Payments (creator's own PayPal as payee, wide Muslim-majority coverage but not Pakistan, Bangladesh, North Africa beyond Morocco, Levant beyond Jordan); Adyen for Platforms (Western creators only, minimums); Mangopay (€249/month, holds wallets); payout-only services (Wise, Payoneer, Tipalti, Trolley: the platform would hold funds; Payoneer bans gifts); merchants of record (Paddle, Dodo, Creem: ban donations); anything on Stripe (never, [T2](decisions.md#t2-billing-provider)).

### 12.4 What each partner covers, costs, and needs

| Partner | Covers | Cost | Setup steps | Only the owner can do |
|---|---|---|---|---|
| **PayGood** | Creators' checkout, subscriptions, refunds, KYC, payouts to US/CA banks | Card 2.9% + 30¢ paid from the gift; platform $0 (**confirm**) | Written answers to the questions in [§12.1](#121-paygood-what-it-can-and-cant-do): partner access for referred merchants; individuals; foreign cards and surcharges; dispute and payout webhooks; sanctions screening; 1099-K filer; international plans; written OK for creator support with nothing in return | Talk to PayGood as the business; sign any partner agreement; hold the platform's own PayGood account |
| **Apple App Review, Google Play policy** | Store approval of support outside in-app purchase | $0 | Written pre-clearance questions ([§8](#8-app-stores)) | Send from the developer accounts |
| **US lawyer** (fintech, consumer, sanctions, privacy), licensed where the entity is formed | Questions in [§14.1](#141-us-lawyer); creator agreement and supporter terms | Estimate $3,000–10,000 one-off for the review and terms (**Unverified**, get quotes) | Brief with this page | Engage and pay; sign the engagement |
| **Accountant / tax adviser** with US and cross-border digital-platform experience | Questions in [§14.2](#142-accountant-or-tax-adviser) | Estimate $1,000–5,000 one-off, then yearly bookkeeping (**Unverified**) | Brief with this page | Engage |
| **Scholar (mufti)** or a recognised fatwa body | Questions in [§14.3](#143-scholar-mufti) | Often an honorarium (**Unverified**) | Send the questions | Choose the scholar; accept the ruling |
| **Business entity** (US) | Contracting party for PayGood, the stores, insurance | LLC filing about $50–500 by state; Delaware LLC tax $300/yr; Wyoming report from $60/yr (**Unverified**) | Choose state and type with the lawyer | Form it; sign; get an EIN (free, [IRS](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online)) |
| **Registered agent** | Legal address in the formation state | About $50–300/yr (**Unverified**) | — | Appoint |
| **Business bank account** | Receives nothing from support (we take 0%); pays vendors | Often $0–15/month | — | Open it in the entity's name |
| **Insurance** | General liability, cyber/privacy, tech E&O plus media liability | About $500–5,000/yr each (**Unverified**, get quotes) | Broker quotes | Buy |
| **Bookkeeping** | Our own expenses; no support money passes through us | Free to $30/month tools | — | Choose |
| **DMCA designated agent** | Safe harbour for user content (already relevant) | $6 at the Copyright Office ([DMCA directory](https://www.copyright.gov/dmca-directory/)) | — | Register |

**Not needed:** a tax engine (no taxable supply while support is a gift), a separate sanctions vendor (PayGood/Finix screen their merchants, **confirm**; we geo-block), a payout partner (PayGood pays creators directly), a money-transmitter licence (we never touch funds; lawyer confirms).

**The agent never signs in anywhere as the owner and never creates vendor accounts.** Every row in the last column is the owner's.

## 13. Build order

The whole design is specified; this is the order to build it, not a cut in scope.

1. **Owner and professionals first** (no code waits on them except going live): entity, lawyer, accountant, scholar, PayGood's written answers ([§12.1](#121-paygood-what-it-can-and-cant-do)), Apple and Google pre-clearance (MEM-1).
2. **Server foundation:** `SupportProvider` interface, the test provider for QA and local only, data model, webhook route and jobs, reconciliation, Errors and Jobs pages, the `creatorSupport` switch and server checks, the Countries table seeded with sanctions blocks, and the end-to-end tests on the local stack (MEM-2 to MEM-5, MEM-21).
3. **Web:** Studio › Support onboarding, the support sheet with the breakdown, Settings › Support, emails (MEM-6, MEM-7, MEM-9).
4. **Admin Support pages** (MEM-8).
5. **PayGood:** the creator connection the owner picks under MEM-D1 (MEM-11), then the PayGood support adapter against PayGood's sandbox (MEM-10).
6. **Legal pages and help** (MEM-16, MEM-17).
7. **Apps:** Core, then Apple, Android, Desktop/Tizen, after the store answers (MEM-12 to MEM-15).
8. **External support links** (MEM-18), then the **charity route** (MEM-19).
9. **First live run** on production: the owner's own channel, the owner supporting it with real money once, then refunding through the admin. Then the switch stays off until the owner turns it on.

**Perks** ([§10](#10-optional-paid-perks-designed-not-scheduled), MEM-20) are not in this order.

Visual stories go through the frames → audit → gallery → owner path. Non-visual PRs merge when green. Tests never use real money or real providers: the QA and local stack use the test provider only ([No paid AI or spend in tests](../guides/testing.md)).

## 14. Questions for a lawyer, an accountant and a scholar

### 14.1 US lawyer

1. With the creator as their own PayGood merchant and payee and no platform fee, does any step make us a money transmitter under FinCEN or any state, given gifts have no "goods or services" for the processor or agent-of-payee exemptions?
2. Does PayGood's merchant agreement, or any partner agreement, make us liable for creators' negative balances or chargebacks? Is that acceptable, and how do we limit it?
3. Are recurring voluntary gifts covered by ROSCA, California's automatic renewal law, New York GBL 527-a or other state laws? Is our flow ([§2.2](#22-stopping-reminders-and-refunds), [§4.5](#45-consumer-law)) enough?
4. EU and UK: is a supporter-to-creator gift a consumer contract? Does the 14-day right or the UK subscription regime apply? What changes with perks?
5. Sanctions: which regions must we block (Cuba, Iran, North Korea, Crimea/DNR/LNR; Russia, Belarus?); the post-2025 Syria position under OFAC, export controls, UK and EU; is provider screening enough for creators and supporters?
6. Minors: age floors to support and to receive; COPPA; state child-influencer laws; guardian-held payout accounts.
7. If creators connect their own PayGood API keys to us (MEM-D1), what must the creator agreement say about that access, and what is our liability?
8. Draft or review the creator agreement and supporter terms ([§4.8](#48-terms)); notice periods; governing law; disputes.
9. Entity type and state, insurance, BOI status.
10. GDPR: is a supporter relationship with an Islamic creator special-category data? Do we need a DPIA? Transfer mechanism?
11. Wording: any charitable-solicitation registration risk from "sadaqa", "zakat" or "donation", on the support route and the charity route?
12. The external support link ([§7.2](#72-countries-neither-covers)): any liability for linking to third-party payment pages?

### 14.2 Accountant or tax adviser

1. Are pure gifts outside VAT/GST in the EU, UK and each target country (Saudi Arabia, UAE, Egypt, India, Indonesia, Malaysia, Nigeria, Turkey, Pakistan, Bangladesh, Canada, Australia)? What happens if any perk is added?
2. With perks: does EU Art. 9a (or the UK equivalent) make us the deemed supplier at 0%? Which registrations would we need?
3. US: are we a marketplace facilitator anywhere for gifts, or for future perks?
4. Are we a reporting platform operator under DAC7, UK digital platform reporting, Canada Part XX or Australia's regime for gift-only flows at 0%? If yes, where do we register?
5. Confirm the provider is the payment settlement entity for 1099-K and that we have no 1099-NEC or W-8 duties.
6. Any withholding on support to non-US creators through the provider? How is gift-like income sourced?
7. What may we tell creators about their tax without giving advice? US "no tax on tips" eligibility for creator support?
8. Our own tax and funding with 0% revenue. Is a charity route (a 501(c)(3) partner or a donor-advised fund) feasible for deductible giving?
9. How long must we keep the payment records we mirror (US and EU)?

### 14.3 Scholar (mufti)

1. The supporter pays straight into the creator's provider account and we never hold the money. Is the gift complete (qabd) when it settles there? What follows for refunds before and after settlement, and for chargebacks the bank imposes?
2. Is monthly support a series of separate gifts under a standing instruction? Is the supporter bound by the promise religiously, legally or not at all? Is "stop any time, no penalty" required or only recommended?
3. We take nothing. Is there any issue with the provider's fee being deducted from the gift, versus the supporter adding it on top ("cover the fees")?
4. The provider may earn interest on balances in transit, though we earn nothing. Is that a concern for us, the supporter or the creator?
5. May we accept credit cards, given AAOIFI SS 2 and OIC Fiqh Academy 108 differ? Should we warn, or limit methods?
6. Is currency conversion at the provider's spot rate on settlement or withdrawal valid sarf?
7. Which acknowledgements keep it a pure gift: a private thank-you note, a supporter count, the supporter's name shown to the creator, a public supporter list, a badge? Where does it become a gift for compensation?
8. Are free giveaways to supporters permissible? Any random element if only supporters may enter?
9. Which channels may receive support: must we block channels whose content is disputed (for example music with instruments), and which view should the policy follow?
10. For registered-charity creators: what review is needed before tagging a campaign "zakat-eligible"? Who is the 'amil? How should zakat and sadaqa be kept apart?
11. Is "support is a gift and isn't refundable except with the creator's agreement or by law" correct? May an admin refund on its own judgment for fraud or error?
12. With perks: are member-only posts and videos a valid hire (ijara) given they are recurring and partly unknown in advance?

## 15. Owner decisions

Each decision has named options; the recommendation is first.

| ID | Decision | Options (recommended first) |
|---|---|---|
| MEM-D1 | How we act for each creator's PayGood merchant | **"PayGood partner access"** (ask PayGood for referral onboarding plus scoped access per referred merchant) · **"Creator connects their PayGood key"** (works with today's API; recommended until partner access exists) · "Creator pastes checkout links" (no API, no breakdown or tracking) |
| MEM-D2 | Creators outside the US and Canada (PayGood can't pay them today) | **"Creator's own support link until PayGood expands"** (admin-reviewed, switch `supportExternalLinks`; ask PayGood about international merchants) · "Not available outside the US and Canada" · "Add a second provider for other countries" (not recommended: changes [P1](decisions.md#p1-first-paid-providers)) |
| MEM-D3 | Who pays the provider fee | **"Creator absorbs, supporter may cover"** (checkbox shown, unticked) · "Supporter always covers" · "Creator always absorbs, no checkbox" |
| MEM-D4 | Minimum and presets | **"$3 minimum; presets $5, $10, $25"** · "$1 minimum; presets $3, $5, $10" |
| MEM-D5 | Who may receive | **"A tier capability, owner 18+, channel in good standing"** (admins tick "Can receive support" per tier) · "Every channel owner 18+" |
| MEM-D6 | Supporter visibility | **"Private to the creator; supporter may hide their name"** · "Supporter count shown publicly on the channel" · "Public supporter list" (risks Apple 3.2.1(vii) and GDPR special-category data) |
| MEM-D7 | Messages with support | **"Allowed, private to the creator, moderated"** · "No messages" |
| MEM-D8 | Refund policy | **"Gift, not refundable; 7-day mistake window with the creator's agreement; admins refund fraud and errors"** · "Creator decides alone" · "Refund on request within 14 days" |
| MEM-D9 | Ages | **"18+ to support and to receive"** · "16+ to support with a guardian's confirmation" |
| MEM-D10 | Payment methods | **"Cards, debit, wallets and bank transfer; never BNPL or instalments"** (pending the scholar) · "Debit and bank transfer only" |
| MEM-D11 | Legal entity | **"LLC in the owner's home state"** (lawyer confirms) · "Delaware C-corp" (if outside investment is planned) · "Wyoming LLC" |
| MEM-D12 | Charity route | **"Separate route behind `charityDonations`; zakat tag only after review"** · "No charity route" |
| MEM-D13 | Perks | **"Designed, switch stays off"** ([§10](#10-optional-paid-perks-designed-not-scheduled)) · "Build perks after support" |
| MEM-D14 | Business costs and the $500 cap | **"Outside the infrastructure cap"** (same as [S3](AUN-SUBS-subscriptions-plan.md)) · "Inside the cap" |
| MEM-D15 | When apps get the button | **"After written Apple and Google answers"** · "Web only for now" |
| MEM-D16 | Disputes and payouts PayGood's API doesn't expose | **"Creator handles them in PayGood; we show what we know and hand over our records"** · "Wait for PayGood dispute and payout webhooks before launch" |

What doesn't need the owner and is decided here: 0% to the platform; never holding funds; hosted checkout only; the creator is the merchant; no public perks; queues with retry, DLQ and Errors with Retry; per-country and emergency stops; the switch default off.

## 16. Stories

| ID | Linear | Story | Repo | Kind |
|---|---|---|---|---|
| MEM-1 | [AUN-613](https://linear.app/hamzalabs/issue/AUN-613) | Owner, professional and vendor answers before going live (§12, §14, §15) | AlUmmahNowWiki | owner |
| MEM-2 | [AUN-614](https://linear.app/hamzalabs/issue/AUN-614) | SupportProvider interface, test provider and fee quote (§9.2, §5.4) | AlUmmahNow | non-visual |
| MEM-3 | [AUN-615](https://linear.app/hamzalabs/issue/AUN-615) | Support data model and provider-event ledger (§9.3) | AlUmmahNow | non-visual |
| MEM-4 | [AUN-616](https://linear.app/hamzalabs/issue/AUN-616) | Support webhooks, jobs and reconciliation (§9.4) | AlUmmahNow | non-visual |
| MEM-5 | [AUN-617](https://linear.app/hamzalabs/issue/AUN-617) | Support switches, country rules and server checks (§9.5, §9.7, §4.3) | AlUmmahNow | non-visual |
| MEM-6 | [AUN-618](https://linear.app/hamzalabs/issue/AUN-618) | Studio › Support: creator onboarding and records (§2.4, §11.5) | AlUmmahNow | visual |
| MEM-7 | [AUN-619](https://linear.app/hamzalabs/issue/AUN-619) | Support sheet, breakdown, checkout and Settings › Support (§2.1, §2.2, §5.4, §11) | AlUmmahNow | visual |
| MEM-8 | [AUN-620](https://linear.app/hamzalabs/issue/AUN-620) | Videos admin › Support pages (§9.6) | AlUmmahNow | visual |
| MEM-9 | [AUN-621](https://linear.app/hamzalabs/issue/AUN-621) | Support emails and notifications (§2.2) | AlUmmahNow | visual |
| MEM-10 | [AUN-622](https://linear.app/hamzalabs/issue/AUN-622) | PayGood support adapter (§12.1) | AlUmmahNow | non-visual |
| MEM-11 | [AUN-623](https://linear.app/hamzalabs/issue/AUN-623) | PayGood creator connection (partner access or the creator's own key) (§12.1, §12.2) | AlUmmahNow | non-visual |
| MEM-12 | [AUN-624](https://linear.app/hamzalabs/issue/AUN-624) | Core: support API and features keys (§9.5) | AlUmmahNowCore | non-visual |
| MEM-13 | [AUN-625](https://linear.app/hamzalabs/issue/AUN-625) | Apple apps: Support on the channel page (§8) | AlUmmahNowApple | visual |
| MEM-14 | [AUN-626](https://linear.app/hamzalabs/issue/AUN-626) | Android apps: Support on the channel page (§8) | AlUmmahNowAndroid | visual |
| MEM-15 | [AUN-627](https://linear.app/hamzalabs/issue/AUN-627) | Desktop and Tizen: Support on the channel page (§8) | AlUmmahNowDesktop | visual |
| MEM-16 | [AUN-628](https://linear.app/hamzalabs/issue/AUN-628) | Creator agreement, supporter terms and privacy notice (§4.8) | AlUmmahNowUI | visual |
| MEM-17 | [AUN-629](https://linear.app/hamzalabs/issue/AUN-629) | Help pages, wiki and alummahnow.dev entry (§11) | AlUmmahNowWiki | non-visual |
| MEM-18 | [AUN-630](https://linear.app/hamzalabs/issue/AUN-630) | External support links for countries no provider covers (§7.2) | AlUmmahNow | visual |
| MEM-19 | [AUN-631](https://linear.app/hamzalabs/issue/AUN-631) | Charity route for registered charities (§3.7) | AlUmmahNow | visual |
| MEM-20 | [AUN-632](https://linear.app/hamzalabs/issue/AUN-632) | Optional paid perks (designed, not scheduled) (§10) | AlUmmahNow | visual |
| MEM-21 | [AUN-633](https://linear.app/hamzalabs/issue/AUN-633) | Support tests on the local stack (§13) | AlUmmahNow | non-visual |

MEM-20 (perks) stays in Backlog and is not in the [build order](#13-build-order).

## Status evidence

- 2026-11-22: spec written (this page) with Linear epic AUN-612 and stories AUN-613 to AUN-633. Research notes from three research passes on 2026-11-22 (payment providers and payouts; legal and tax; app stores and Islamic compliance); every source is cited inline with its date. Sources whose sites refuse automated link checks are written as plain-text URLs. No code yet.
