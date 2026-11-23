[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Supporting creators: one-time and monthly support, 0% to the platform

| | |
|---|---|
| **ID** | `AUN-MEMBERS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web, web, processor), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (terms pages), [AlUmmahNowWiki](https://github.com/Al-Ummah-Now/AlUmmahNowWiki) |
| **Status** | **building**, behind the `creatorSupport` switch, which stays **off** in every environment until the organization exists and the lawyer, PayGood, Wise and PayPal sign off |
| **Last updated** | 2026-11-22 (revision 2: PayGood collects only; payouts through a separate rail) |
| **Origin** | Owner request 2026-11-22: "spec members supporting creators, legality, fees, taxes, international, sending funds, partners and vendors needed". Same-day changes: **no paid perks now** (support only; perks are a separate optional section behind their own switch, default off); **the platform takes nothing** (0% cut, no fee, no margin, no float); the platform is held by a **waqf / nonprofit organization** and the owner never touches money; and (revision 2) "how others do it, youtube patreon, **we will not use paygood to pay creators**". |
| **Linear** | [AUN-612](https://linear.app/hamzalabs/issue/AUN-612/aun-members-supporting-creators-one-time-and-monthly-support-0percent) (stories AUN-613 to AUN-633, AUN-635 and AUN-636) |

> **This page is research, not legal, tax or religious advice.** It collects current public sources (each cited with its date) so the owner and the organization can decide and brief professionals. Every point marked **Unverified** could not be confirmed on a primary source. Nothing here goes live until a US lawyer, an accountant and a scholar have answered the questions in [§14](#14-questions-for-a-lawyer-an-accountant-and-a-scholar), and PayGood and the payout rail have approved the model in writing.

## Goal

A viewer can support a creator they love: once, or every month. **PayGood collects** the gift into the organization's own merchant account. The organization keeps it, in a separate account that earns nothing, for a short hold, then **pays the creator through a payout rail** (Wise, with PayPal Payouts as the fallback, [§7.5](#75-recommendation-wise-primary-paypal-payouts-fallback)). Al Ummah Now takes nothing. The supporter sees, before paying, exactly what the payment provider and any tax take; the creator sees, before each payout, what the payout rail and currency exchange take. Nothing is unlocked in return: support is a gift.

The feature is one switch on the Features page, **off by default**, and it stays off until the organization exists. It can be turned off per country, per channel and all at once.

## Decisions and constraints

- **Support only, nothing in return** (owner, 2026-11-22). Badges, member-only posts, videos and live, and early access are designed in [§10](#10-optional-paid-perks-designed-not-scheduled) but are not in the build order and sit behind their own switch, default off.
- **0% to the platform** (owner, 2026-11-22, [O41](decisions.md#o41-creator-support-is-a-gift-0-to-the-platform-never-hold-funds)). "Fees" on this page means only what vendors (payment provider, payout rail, currency exchange, chargeback) and governments (tax) take.
- **PayGood collects; it never pays creators** (owner, 2026-11-22, [O42](decisions.md#o42-paygood-collects-only-creators-paid-through-a-separate-payout-rail)). PayGood stays the one payment provider for collecting ([P1](decisions.md#p1-first-paid-providers)). Creators are paid through a **separate payout rail** chosen in [§7.5](#75-recommendation-wise-primary-paypal-payouts-fallback) (owner decision [MEM-D17](#15-owner-decisions)). This replaces revision 1, where each creator was their own PayGood merchant.
- **Never Stripe** ([T2](decisions.md#t2-billing-provider)), including payout services built on Stripe.
- **The organization holds creators' money in trust, never the owner.** Gifts settle into a dedicated creator-funds account in the organization's name, separate from its operating money, earning no interest ([§3.4](#34-riba)). It is creators' money: never the organization's income, never lent, invested or used to pay its bills.
- **No legal entity exists yet** ([SM-4](decisions.md#sm-4-legal-entity)). The platform will be held by a **waqf / nonprofit organization**, formed through the lawyer engagement (owner, 2026-11-22). **Until it exists, creator support stays switched off.** PayGood and the payout rail contract with that organization ([§12](#12-partners-and-vendors)).
- **The owner never touches money** (owner, 2026-11-22). The owner is a tech employee of the organization with no access to its money, and keeps the code rights; the organization licenses the code. No flow on this page has the owner holding, signing for, approving or receiving money: vendor contracts, accounts, refunds, disputes, payout approvals and ledger adjustments are the organization's, done by people on its finance list ([§9.6](#96-admin-pages-videos-admin--support)).
- **Switchable feature, default off** ([O39](decisions.md#o39-one-features-page-server-enforced), [AUN-FEATURES](AUN-FEATURES-feature-switches.md)). Hidden when off ([Product rules](../guides/product-rules.md)); `feature_off` carries a server message ([O40](decisions.md#o40-server-written-error-messages)).
- **Always async** ([O26](decisions.md#o26-always-async-with-admin-visible-errors)): every money event and every payout goes through a queue with retry and a DLQ; failures flag the videos admin **Errors** page with **Retry**. Troubleshooting is done from the admin, never from Cloudflare or a vendor's dashboard.
- **Channel roles live in videos**, not Auth RBAC ([O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership), [roles](../guides/roles.md)). Only the channel **owner** sets up payouts, because the money is theirs.
- **Creators are invite-only** with admin-assigned tiers ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers), [CHAT-CREATOR-TIERS](CHAT-CREATOR-TIERS-creator-tiers.md)). Receiving support is a tier capability that admins set per tier.
- **Cost cap** $500/month for the whole platform ([O1](decisions.md#o1-whole-platform-cost-cap)). The recommended rails add about $0 a month in fixed vendor costs ([§5.3](#53-fixed-costs-against-the-500month-cap)).
- **Production has one user today** (the owner). The first live run uses the organization's own channel and payee, never the owner's ([§13](#13-build-order)).
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

**How other platforms do it** is researched in [§7.1](#71-how-other-platforms-pay-creators): who sells, who holds the money and for how long, payout rails, thresholds, fees, tax forms and country reach for YouTube, Patreon, Ko-fi, Buy Me a Coffee, Twitch, Substack and LaunchGood. What we copy: support from the channel header, simple amounts, a clear "manage support" page, a hold and a monthly payout cycle, tax forms before the first payout, LaunchGood's 0% and its zakat review model. What we avoid: any platform cut, Super Thanks tied to a single video, paid status symbols, Stripe as a rail, and holds kept for float rather than risk.

## 2. Flows

### 2.1 Supporter

1. Taps **Support** on a channel. The server has already said `support` and `supportReceive` are on for this person and channel ([§9.5](#95-server-side-checks-on-every-app)).
2. Picks **One time** or **Monthly**, an amount (presets or other, from the minimum), optionally "cover the fees", a private message and "don't show my name".
3. Sees the **breakdown** ([§5.4](#54-the-breakdown-before-paying-and-before-each-payout)): amount, tax, provider fee, currency exchange estimate, "Al Ummah Now takes $0.00", what the creator receives.
4. For monthly: ticks "Charge me {amount} every month until I stop" (express consent, the California standard, [§4.5](#45-consumer-law)).
5. Goes to PayGood's **hosted** checkout on the organization's merchant account. Card data never reaches us.
6. Comes back to a thank-you screen that says the gift reaches {channel} after the hold ([§2.6](#26-holds-thresholds-and-payout-schedule)). PayGood emails the receipt. We email a short confirmation with how to stop.

**Signed in only.** Support needs an account (age confirmation, cancel page, fraud checks). Signed-out viewers see the button and sign in first.

### 2.2 Stopping, reminders and refunds

- **Stop any time** from Settings › Support, one click and a confirm dialog in the page (no browser prompts). Stopping takes effect at once at PayGood: no future charges. There is no minimum term and no fee ([§3.3](#33-monthly-support-is-a-promise)).
- **Reminder** emails: 3 days before each renewal for the first one, then yearly ("you've supported {channel} monthly for a year"), and whenever the amount or PayGood's terms change.
- **Refunds:** support is a gift and is not refundable by default. Exceptions:
  - the supporter writes within **7 days** saying it was a mistake: the creator is asked, and the admin can refund with the creator's agreement (mutual consent, [§3.2](#32-hiba-gift-mechanics));
  - fraud, a duplicate charge or our error: an admin refunds;
  - where a law gives a right, that right applies.
  A refund is made from the organization's PayGood merchant account and debited from that creator's balance (pending first, then available; if already paid out, the balance goes negative, [MEM-D21](#15-owner-decisions)). It never comes from the organization's own money or another creator's.
- **Failed renewals:** PayGood retries on its own schedule. After the last retry the pledge ends and the supporter gets one email with a link to start again. No dunning beyond that.

### 2.3 Chargebacks, disputes and fraud

- **The organization is the PayGood merchant**, so every chargeback is raised against the organization's merchant account, with PayGood's fee. The amount and fee come out of that creator's balance ([§9.3](#93-data-model-search-d1-admin-api-owned-migrations)); the creator agreement says so ([§4.8](#48-terms)). If the creator has already been paid, their balance goes negative and future gifts net against it ([MEM-D21](#15-owner-decisions)). The organization's reserve covers only what can never be recovered, and that is reported to its board.
- The admin **Disputes** page shows every dispute and its due date, with our records ready (account, time, IP country, the consent line the supporter ticked). PayGood's public API has no dispute endpoints, so the organization's dispute handler answers in the PayGood dashboard and marks it done in the admin ([§12.1](#121-paygood-collecting-only)). The creator is asked for anything only they know.
- Fraud controls, all on the server: a minimum amount; per-account and per-card limits per day (admin-set); new accounts limited to small amounts for their first days; card testing blocked by PayGood's risk checks plus our rate limit and Turnstile on the support sheet ([bot protection](../guides/bot-protection.md)); self-support (a creator supporting their own channel) refused; the hold before payout ([§2.6](#26-holds-thresholds-and-payout-schedule)) gives time to catch stolen cards before money leaves.
- A creator with a dispute rate above an admin-set threshold is paused by a job, their payouts held, and flagged for an admin.

### 2.4 Creator

1. The channel owner opens **Studio › Support**. If their tier allows it, they see "Set up payouts".
2. They go to the **payout rail's** hosted onboarding ([§7.3](#73-payout-rails-compared)): identity, bank account or wallet, and the tax form (W-9 for US persons, W-8BEN for others). We never see bank details, ID documents or the tax form itself; we keep only "form on file: W-8BEN".
3. They return; `support.payee-sync` reads the payee's state. Studio shows what the rail still needs, in words.
4. Once the payee is active, they switch support on, choose presets and write a thank-you note.
5. Studio › Support shows supporters (names unless anonymous), messages, payments, refunds, disputes, the balance (**pending**, **available**, **paid out**), the next payout date and its estimated fee, and each past payout with its status.

Channel admins see the Support page read-only; editors and moderators don't see it.

### 2.5 Minors

- **Supporters:** 18 or over. The support sheet asks for a one-time confirmation; accounts that told us they are under 18 never see the button. Under-13s are not allowed on payment flows at all ([COPPA amended rule](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule), compliance from 22 Apr 2026).
- **Creators:** 18 or over to receive. PayGood and the payout rails require adult account holders. A creator under 18 cannot set up payouts; the lawyer is asked about guardian-held accounts and state child-influencer laws ([§14](#14-questions-for-a-lawyer-an-accountant-and-a-scholar)).

### 2.6 Holds, thresholds and payout schedule

Every platform researched holds money before paying out ([§7.1](#71-how-other-platforms-pay-creators)). We do the same, for chargebacks and stolen cards, never for float:

- **Hold:** a gift becomes **available** {hold} days after it succeeds (recommended 30, [MEM-D18](#15-owner-decisions)). A monthly supporter's first gift is held the same; later ones too.
- **Threshold:** a payout is made only when the available balance reaches the threshold (recommended $25, or the rail's minimum if higher, [MEM-D19](#15-owner-decisions)); otherwise it rolls over. The creator can raise their own threshold.
- **Schedule:** once a month, on a fixed day (recommended the 15th, for the previous month's available money). The batch needs approval by an organization-named approver ([§9.6](#96-admin-pages-videos-admin--support)), never the owner.
- **Fees:** the rail's payout fee and any FX come out of the payout, shown in Studio before the payout day ([MEM-D20](#15-owner-decisions)). The organization adds no margin and never chooses a worse rate to profit.
- **Never interest, never investment:** money waiting for payout sits in the creator-funds account, which earns nothing ([§3.4](#34-riba)).
- **Unclaimed money:** a balance whose creator never completes payout setup, or disappears, is handled under the state unclaimed-property rule the lawyer sets ([MEM-D22](#15-owner-decisions)); it never becomes the organization's.

## 3. Islamic compliance

Each source is cited inline with its date. Where scholars differ, this page says so and asks the scholar ([§14.3](#143-scholar-mufti)).

### 3.1 What the payment is

- **Support with nothing in return is a gift (hiba).** It is not a sale or a hire, so no price, defect or delivery questions arise. If a reward is promised, it becomes a gift for compensation (hibat al-thawab), treated like a sale; that is why perks are a separate section ([§10](#10-optional-paid-perks-designed-not-scheduled)).
- **Not sadaqa or zakat to a charity.** Zakat needs transfer of ownership to one of the eight categories (Qur'an 9:60). A creator is not a zakat recipient as such ([SeekersGuidance on tamlik](https://seekersguidance.org/answers/hanafi-fiqh/is-our-zakat-fund-for-abuse-survivors-properly-structured/), accessed 2026-11-22; [NZF distribution policy](https://nzf.org.uk/wp-content/uploads/2021/04/NZF-UK-Zakat-Distribution-Policy-v2-Apr-2021.pdf), Apr 2021). The sheet says so in plain words ([§11](#11-screens-and-copy-english-and-arabic-samples)). A supporter may of course intend sadaqa in the general sense of a good deed; we make no claim either way.
- **Teaching the religion:** accepting gifts for teaching Qur'an and knowledge is allowed by the majority (Malik, Shafi'i, Ahmad); early Hanafis disallowed wages, later Hanafis allowed them out of need ([SeekersGuidance](https://seekersguidance.org/answers/quran/is-it-permissible-to-receive-a-financial-gift-for-teaching-the-quran/), accessed 2026-11-22; Bin Bayyah via IslamQA.org (`https://islamqa.org/maliki/binbayyah/29781/can-a-quran-teacher-accept-gifts/`), accessed 2026-11-22).

### 3.2 Hiba (gift) mechanics

- A gift is complete on **possession (qabd)**. The majority allow taking it back before possession; Malikis hold it binding on the contract ([SeekersGuidance](https://seekersguidance.org/answers/fiqh-answers-2/is-it-permissible-to-take-back-a-gift-in-islam/), accessed 2026-11-22).
- After possession, taking a gift back is strongly disliked, but **return by mutual consent** is fine. So refunds after payment go through the creator's agreement, except fraud, error and legal orders ([§2.2](#22-stopping-reminders-and-refunds)).
- **Who holds the money matters, and now the organization does.** The money lands in the organization's PayGood merchant account, then its creator-funds account, and reaches the creator at payout. Whose agent the organization is decides when the gift is complete:
  - **the creator's agent (wakil)**, by the creator agreement: possession by the agent is possession by the creator, so the gift is complete when it settles to the organization; the hold before payout is then the creator's money waiting, and a refund needs the creator's agreement;
  - **the supporter's agent**: the gift is complete only at payout; until then the supporter could take it back, and money of a supporter who dies before payout belongs to their estate;
  - **a donation to the organization** (the charitable model, [§4.1](#41-money-transmission-the-organization-now-touches-the-money)): the gift is the organization's on receipt and the creator receives a grant from it, a different contract.
  The recommendation is the creator's agent, matching the legal structure the lawyer picks. The scholar confirms ([§14.3](#143-scholar-mufti), question 1).

### 3.3 Monthly support is a promise

- A monthly pledge is a promise (wa'd) of future gifts; each charge is a new gift under the supporter's standing instruction. The majority hold a promise religiously binding but not legally enforceable; some Malikis differ. The OIC Fiqh Academy's ruling on binding promises (resolutions 40–41, 1988) was made for murabaha financing ([IIFA](https://iifa-aifi.org/en/32332.html), accessed 2026-11-22).
- So: **stop any time, no penalty, no minimum term**, and wording "monthly support until you stop", never "commitment".

### 3.4 Riba

- **No float, no interest.** Money waiting for payout sits in the organization's creator-funds account, which must **earn no interest** and is never invested. Pre-funded balances at the payout rail earn nothing for us either. If any interest ever accrues by accident, it is given away as charity without expecting reward (IslamQA.org, Mufti Online (`https://islamqa.org/hanafi/muftionline/114377/using-bank-interest-for-charity-permissible-or-not/`), accessed 2026-11-22). The scholar is asked about vendors (PayGood, the rail, the bank) earning interest on balances in transit ([§14.3](#143-scholar-mufti), question 4).
- **No buy-now-pay-later, no instalments, no credit upsell.** We never promote a credit product.
- **Credit cards** are a real difference of opinion: AAOIFI Shari'ah Standard 2 allows a card when no interest is charged; OIC Fiqh Academy resolution 108 forbids an interest-conditioned card even if paid in the grace period ([IIFA 108](https://iifa-aifi.org/en/32584.html), accessed 2026-11-22). Accepting a card is not itself the riba contract (that is between the cardholder and their bank). Recommendation: accept cards, debit cards, wallets and bank transfer; promote none; ask the scholar.
- **Currency exchange (sarf)** must be spot. Conversion happens at the payout rail at payout, at its rate on that day; we offer no rate locks or forward rates ([AAOIFI SS 1](https://cis.aaoifi.com/ar/?p=1695), accessed 2026-11-22). The FX margin is the rail's, shown to the creator before payout; the organization adds none.

### 3.5 Gharar and maysir

- No paid randomness: no mystery rewards, raffles or "spin" for supporters. Paid loot boxes are gambling in the fatwas found ([Islamweb 379243](https://islamweb.net/en/fatwa/379243), accessed 2026-11-22; JFatwa, USIM (`https://jfatwa.usim.edu.my/index.php/jfatwa/article/view/685`), accessed 2026-11-22).
- All amounts and fees are known before paying (the breakdown, [§5.4](#54-the-breakdown-before-paying-and-before-each-payout)). No hidden fees.

### 3.6 Which channels can receive

- Only channels in good standing on an Islamic platform. Helping in wrongdoing is blameworthy (Qur'an 5:2), so a channel under moderation action loses its Support button until cleared. Disputed areas (for example music with instruments) follow the platform's content policy; the scholar is asked which view the policy follows ([§14.3](#143-scholar-mufti), question 9).

### 3.7 Charity creators (registered charities)

- A creator that is a registered charity takes **donations**, labelled sadaqa or donation, not "support". Zakat is only tagged after a review of that charity's zakat policy (the LaunchGood model: each campaign reviewed by a zakat team, LaunchGood zakat policy (`https://www.launchgood.com/zakatpolicy`), accessed 2026-11-22). No fee may come out of zakat without the donor's permission ([Darul Ifta Birmingham 06734](https://daruliftabirmingham.co.uk/fundraising-platform-taking-a-percentage-of-the-zakat-money/), 26 Aug 2023); card fees are shown as separate from the zakat.
- In the apps, charity collection follows store rules: Apple only for approved nonprofits with Apple Pay, otherwise on the web ([§8](#8-app-stores)).
- This route is behind its own switch, `charityDonations`, default off, and is last in the build order.

### 3.8 How other Islamic platforms do it

- **LaunchGood:** 0% platform fee, an optional tip to LaunchGood, card fees "not part of your zakat", zakat-verified campaigns (zakat policy (`https://www.launchgood.com/zakatpolicy`), [fees](https://support.launchgood.com/support/solutions/articles/35000179424-platform-fees), accessed 2026-11-22). It holds the money and pays out, as the organization now does ([§7.1](#71-how-other-platforms-pay-creators)), and still pays most Muslim-majority countries only to registered organizations by wire.
- **PayGood** (from the LaunchGood team) exists because Muslim businesses were "shut out by payment processors" ([paygood.com](https://paygood.com), accessed 2026-11-22).
- No widely recognised "halal payment gateway" was found. Compliance comes from how we route money (no float, spot FX, clear fees), not from a gateway's label.

## 4. Legality

### 4.1 Money transmission: the organization now touches the money

The owner's direction (2026-11-22) changes the money flow: **PayGood only collects**, into the organization's own merchant account, and the organization pays creators through a separate payout rail. The earlier design (each creator its own PayGood merchant, the platform never touching funds) is withdrawn. That makes this section the **largest legal risk on the page**, and the main question for the lawyer ([§14.1](#141-us-lawyer), questions 1–3).

- **The plain reading.** FinCEN defines a money transmitter as someone who accepts funds from one person and transmits them to another (31 CFR 1010.100(ff)(5), [eCFR](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-X/part-1010/subpart-A/section-1010.100), accessed 2026-11-22). Accepting a supporter's gift and paying it to a creator fits those words.
- **The usual exemptions are weak for gifts.** FinCEN's payment-processor exemption needs "the purchase of goods or services", and state "agent of the payee" exemptions (including the Money Transmission Modernization Act's) assume the payee sells something so the payer's debt is discharged on payment ([California DFPI opinion](https://dfpi.ca.gov/rules-enforcement/laws-and-regulations/opinion-letters-by-law-subject/opinion-letter-payment-processing-service-not-exempt-as-agent-of-payee-or-factoring), accessed 2026-11-22). A gift has none.
- **How the big platforms carry it** ([§7.1](#71-how-other-platforms-pay-creators)): they are the merchant (or merchant of record) and pay creators through a licensed payout partner or their own licensed affiliate, and their creators sell something (memberships, subscriptions) or the platform pays its own revenue share. A nonprofit passing on gifts has neither cover by default.
- **Structures for the lawyer to compare** (none chosen here):
  1. **Charitable model:** the gift is a **donation to the organization**, restricted to supporting that creator's work; the organization then makes **grants to individuals** under IRS grant rules. No transmission (the organization spends its own restricted funds), but it brings grant-making procedures, board control over each grant, possible deductibility, private-benefit limits and charitable-solicitation registration. It also changes the fiqh ([§3.2](#32-hiba-gift-mechanics)) and the store analysis ([§8](#8-app-stores)).
  2. **Agent of the creator:** the creator agreement appoints the organization as the creator's collection agent, money is held in trust in a segregated account, and the lawyer confirms whether federal and target-state agent-of-payee rules can reach a gift.
  3. **Licensed payout partner holds the funds:** PayGood settles straight into an account **at the payout rail held for the benefit of creators** (FBO), so the licensed rail, not the organization, holds and transmits. Depends on the rail offering FBO accounts to a small nonprofit.
  4. **Money-transmitter licences:** not realistic for a small nonprofit (49 states plus surety bonds and audits); listed only to rule out.
- **What stays true in every structure:** the owner never holds, signs for or receives money ([§9.6](#96-admin-pages-videos-admin--support)); the creator-funds account is separate from operating money; nothing launches until the lawyer has answered.
- Between 31 and 35 states have adopted the Money Transmission Modernization Act; sources disagree ([CSBS](https://www.csbs.org/node/231461), Sep 2026; [Womble Bond Dickinson](https://www.womblebonddickinson.com/us/node/21361), Aug 2026).

### 4.2 Who is the merchant

| Model | Who sells | Fits? |
|---|---|---|
| **The organization is the PayGood merchant** for every gift | The organization's own PayGood merchant account takes every payment; we book it to the creator | **This design** (owner, 2026-11-22). **Blocker:** PayGood's acceptable-use policy forbids "third party" payments ([§12.1](#121-paygood-collecting-only)). Collecting for creators needs PayGood's written OK (or the charitable model, where the gift is the organization's own donation) before anything is built against live PayGood. |
| Each creator its own PayGood merchant | The creator's own merchant account | Withdrawn 2026-11-22: PayGood must not pay creators, and it serves only US and Canadian merchants |
| Payment facilitator (PayFac) | The platform signs sub-merchants ([Visa PF model](https://usa.visa.com/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf), accessed 2026-11-22) | No: heavy card-network obligations |
| Merchant of record (Paddle, FastSpring, Dodo, Creem) | The vendor resells to the buyer | **No.** Their rules ban donations and tips (Paddle (`https://www.paddle.com/help/start/account-verification/what-am-i-not-allowed-to-sell-on-paddle`), Dodo (`https://docs.dodopayments.com/miscellaneous/prohibited-businesses-and-locations`), Creem (`https://docs.creem.io/faq/prohibited-products`), accessed 2026-11-22) |

### 4.3 Sanctions and high-risk countries

- **US comprehensive or regional embargoes** (November 2026): Cuba (tightened 29 Sep 2026, [OFAC recent actions](https://ofac.treasury.gov/recent-actions/20260929_33)), Iran ([Foley, Oct 2026](https://www.foley.com/insights/publications/2026/10/september-2026-u-s-sanctions-roundup-operation-economic-outcast-intensifies-against-iran-cuba-rules-tighten-and-ofac-overhauls-its-regulations)), North Korea, and Crimea, "DNR" and "LNR".
- **Syria is no longer comprehensively sanctioned by the US** since 1 July 2025 (E.O. 14312); Assad-linked persons stay sanctioned ([OFAC Syria page](https://ofac.treasury.gov/sanctions-programs-and-country-information/syria-sanctions-inactive-and-archived), accessed 2026-11-22). Providers may still refuse Syria, and UK, EU and export-control positions differ.
- **Russia and Belarus:** no country-wide US embargo, but broad service bans; most providers block them.
- **Lists to screen:** OFAC SDN (with the 50% ownership rule), UK OFSI, EU, UN. **PayGood** screens supporters as payers (**Unverified**, ask PayGood). **Creators are screened before every payout**: by the rail where it screens payees (PayPal through the creator's own account), otherwise by our own check against these lists through a screening service the organization picks ([§7.5](#75-recommendation-wise-primary-paypal-payouts-fallback)). A hit holds the payee's balance and flags the organization's compliance person, never auto-releases. We geo-block embargoed regions (IP and PayGood's billing country) and keep our decisions.
- **FATF** (October 2026 plenary): call for action on North Korea and Iran, enhanced diligence for Myanmar; about 18 jurisdictions under increased monitoring, including Iraq, Sudan, Syria and Kenya (FATF (`https://www.fatf-gafi.org/en/publications/Fatfgeneral/outcomes-fatf-plenary-october-2026.html`), [ComplyAdvantage summary](https://complyadvantage.com/insights/fatf-plenary-october-2026-four-grey-list-exits-a-virtual-asset-review-and-a-new-focus-on-scam-compounds/), accessed 2026-11-22; the full list is **Unverified**).
- **The Countries page** in the admin ([§9.6](#96-admin-pages-videos-admin--support)) holds a rule per country, for supporters and creators separately: allowed, blocked (with reason: sanctions, provider doesn't support, legal review, admin), or waitlist. Sanctioned regions are seeded blocked and can be changed only by a super admin with step-up.

### 4.4 KYC and AML

- **Supporters:** PayGood (Finix underneath) screens card payers as the organization's customers (**Unverified**, ask PayGood).
- **Creators (payees):** the **payout rail** verifies identity, bank or wallet ownership and screens against sanctions lists during its hosted onboarding ([§7.3](#73-payout-rails-compared)). We keep only the link between our channel and the rail's payee id, the status, the tax-form status and our block decisions. **Never ID documents, tax forms or bank details.**
- **The organization now needs its own programme** because it holds and pays out money: a written AML and sanctions policy, a named compliance person (not the owner), records, and terrorist-financing controls for a Muslim charity, which banks will ask for. The lawyer sets its scope ([§14.1](#141-us-lawyer)); the accountant sets record-keeping.

### 4.5 Consumer law

- **A gift is probably not a consumer contract for goods, services or digital content.** So the EU and UK 14-day withdrawal right is likely not engaged (EU Consumer Rights Directive 2011/83/EU, EUR-Lex (`https://eur-lex.europa.eu/eli/dir/2011/83/oj`)). No source addresses tips directly: **Unverified**. Any perk would change this ([§10](#10-optional-paid-perks-designed-not-scheduled)).
- **UK subscription rules (DMCC Act 2024)** exclude donations where the donor gets nothing (Birketts (`https://www.birketts.co.uk/legal-update/implications-for-charities-of-the-digital-markets-competition-and-consumers-act-2024/`), accessed 2026-11-22). They start in **spring 2027** ([UK government response](https://www.gov.uk/government/consultations/consultation-on-the-implementation-of-the-new-subscription-contracts-regime/outcome/government-response-to-consultation-on-the-implementation-of-the-new-subscription-contracts-regime-web-accessible-version), 2 Apr 2026).
- **US:** the FTC "click to cancel" rule was vacated by the Eighth Circuit in July 2025; the FTC restarted rulemaking in March 2026 with no proposed rule yet; ROSCA enforcement continues ([Gibson Dunn](https://www.gibsondunn.com/ftc-restarts-negative-option-rulemaking-after-eighth-circuit-vacatur-enforcement-under-rosca-continues/), [Kirkland, Mar 2026](https://www.kirkland.com/publications/kirkland-alert/2026/03/ftc-restarts-subscription-rulemaking)). **California's automatic renewal law** (as amended by AB 2863, from 1 Jul 2025) requires express consent, online cancel and an annual reminder (Fenwick (`https://fenwick.com/insights/publications/california-tightens-requirements-for-automatically-renewing-subscriptions`), accessed 2026-11-22). New York GBL 527-a applies too.
- Whether these cover recurring gifts is untested. **We meet the strictest standard anyway:** amount and frequency up front, a separate consent tick, a receipt each month, one-click stop, a reminder before the first renewal and yearly, and a 7-day "it was a mistake" window. It costs little and cuts chargebacks.

### 4.6 Data protection and card security

- **Supporting an Islamic creator can reveal religious belief**, which is special-category data under GDPR and UK GDPR (Art. 9). Supporter lists are private to the creator; there is no public supporter wall; a supporter can hide their name from the creator too. The lawyer is asked whether a DPIA is needed.
- PayGood and the payout rail are independent controllers for payment and payee data. We keep the minimum ([§9.3](#93-data-model-search-d1-admin-api-owned-migrations)).
- **PCI DSS:** hosted checkout keeps us in the lightest scope (SAQ A); we must still protect our pages that start the checkout ([PCI SSC](https://www.pcisecuritystandards.org/document_library/)).
- Erasure keeps payment rows as financial records under the erased placeholder, like billing today ([§9.8](#98-erasure-and-retention)).

### 4.7 Ages

See [§2.5](#25-minors): 18+ to support and to receive.

### 4.8 Terms

- **Creator agreement** (new): support is a voluntary gift and nothing may be promised in return; the organization collects gifts on the creator's behalf (or as restricted donations, per the structure the lawyer picks, [§4.1](#41-money-transmission-the-organization-now-touches-the-money)) and holds them in a separate account until payout; the hold, threshold, schedule and payout fees ([§2.6](#26-holds-thresholds-and-payout-schedule)); refunds and chargebacks come out of the creator's balance, and a negative balance nets against future gifts; the platform takes 0%; the creator onboards with the payout rail, accepts its terms and gives it a tax form; the creator alone handles their taxes; 18+; sanctions warranty; unclaimed balances; no fundraising for others or "zakat" claims unless a registered charity on the charity route; we can pause support and hold payouts for policy, fraud or legal reasons.
- **Supporter terms** (added to the site terms): support is a voluntary gift, nothing is received, the organization receives it and pays it to the creator after a hold, not tax-deductible (unless the charity route or the lawyer's structure makes it so); monthly terms and how to stop; the refund policy; 18+; country limits; PayGood's own terms apply; the privacy notice.
- **Changes** to terms: 30 days' notice for material changes; at least 15 days for business users in the EU under the P2B Regulation (EUR-Lex 2019/1150 (`https://eur-lex.europa.eu/eli/reg/2019/1150/oj`)).
- The lawyer drafts or reviews both before launch ([§14.1](#141-us-lawyer)).

## 5. Fees

**Al Ummah Now takes 0%.** All fees below are vendors' or governments'.

### 5.1 Collecting: PayGood fees

All from PayGood's site and docs, accessed 2026-11-22 ([paygood.com](https://paygood.com), [docs](https://docs.paygood.com/introduction)). The organization is the merchant.

| | PayGood |
|---|---|
| Card | 2.9% + 30¢; a nonprofit preset of 1.9% + 30¢ exists in onboarding (the organization may qualify); interchange-plus on request |
| Bank (ACH) | 0.5%, capped at $5 |
| Cross-border card surcharge | none published (**Unverified**) |
| Currencies | USD and CAD only. A supporter paying in another currency pays their card issuer's foreign-transaction fee (often 0–3%) |
| Chargeback | "as outlined in your merchant agreement" (amount **Unverified**) |
| Monthly or account fee | none published (**Unverified**) |
| Supporter covers the fee | "Customer can choose to cover the processing fee" exists for invoices; for subscriptions **Unverified** |
| Platform fee (ours) | $0 |

### 5.2 Paying out: payout rail fees

| Rail | Fixed | Per payout | Currency exchange |
|---|---|---|---|
| **Wise Business** (primary) | $31 once | "from 0.23%" of the amount; Wise covers predicted SWIFT correspondent fees on most USD routes ([pricing](https://wise.com/us/pricing/business)); exact fee per route **Unverified** until quoted | mid-market rate, included in the fee |
| **PayPal Payouts** (fallback) | $0 | US via API $0.25; international 2%, max $20 ([fees](https://pep.paypal.com/us/business/paypal-business-fees)) | 4% spread if the creator receives another currency; none if paid in USD |
| Trolley (upgrade) | $2,399/yr (+ $2,399/yr tax forms) | $1 ACH, $4 SEPA/FPS, $10 wire with FX, $25 USD wire ([pricing](https://trolley.com/pricing/)) | 2% |

### 5.3 Fixed costs against the $500/month cap

| Item | Monthly |
|---|---|
| PayGood account fees | $0 (none published, **Unverified**: confirm in writing) |
| Wise Business | $0 a month after $31 once |
| PayPal Payouts | $0 |
| Sanctions screening of payees (if the rail doesn't, [§7.5](#75-recommendation-wise-primary-paypal-payouts-fallback)) | **Unverified**; free OFAC list checks exist, paid screening APIs vary |
| Workers, D1 rows, queue messages for support | within today's plan; under $5 at S2 scale |
| Trolley, only if chosen later | about $200/month (Pay) to $500/month (Pay + Tax + Trust) |

**Business costs** (entity formation, registered agent, insurance, lawyer and accountant, [§12.4](#124-what-each-partner-covers-costs-and-needs)) are paid by the organization. Whether they count against the $500 cap is **owner decision [MEM-D14](#15-owner-decisions)**, with the numbers.

Vendor fees are never paid from creators' money for anyone else, and never marked up.

### 5.4 The breakdown before paying, and before each payout

`SupportCollector.quote()` returns PayGood's fee, any currency exchange estimate and tax for the supporter's country before checkout. The sheet shows every line ([§11.2](#112-breakdown-before-paying-always-shown)), including "Al Ummah Now takes: $0.00", and that the gift reaches the creator after the hold. `PayoutRail.quotePayout()` gives the creator the payout fee and exchange rate in Studio before payout day. If a quote can't be computed, the screen says so and does not let anyone pay blind.

### 5.5 Worked examples: 0% platform fee

**One gift, $5.00, card, supporter anywhere PayGood accepts the card.** Taxes: none, because a gift with nothing in return is outside VAT/GST ([§6](#6-taxes)).

| | Amount |
|---|---|
| Supporter pays | $5.00 (or $5.46 with "cover the fees") |
| PayGood fee (2.9% + 30¢) | −$0.45 (−$0.40 on the nonprofit preset, if the organization gets it) |
| Al Ummah Now | $0.00 |
| Added to the creator's balance | **$4.55** (pending for the hold, [§2.6](#26-holds-thresholds-and-payout-schedule)) |

**One month's payout of $45.50 (ten $5 gifts), by creator country**, estimates only; the real fee is quoted in Studio before payout day:

| Creator in | Rail | Payout fee (estimate) | FX | Creator receives (about) |
|---|---|---|---|---|
| US | Wise (ACH) | under $1 (**Unverified**) | none | $44.50–45.50 |
| UK, Germany | Wise (local) | about 0.3–0.6% (**Unverified**) | mid-market | ≈ $45.20 in GBP / EUR |
| Egypt, Pakistan, Bangladesh, Nigeria | Wise (local currency) | about 0.5–2% (**Unverified**) | mid-market | ≈ $44.60–45.30 in EGP / PKR / BDT / NGN |
| Saudi Arabia, Gulf | PayPal (USD) | 2% = $0.91 | none in USD | ≈ $44.59 |
| Jordan | PayPal (USD) | 2% = $0.91 | none in USD (4% if converted) | ≈ $44.59 |
| Algeria, Tunisia | Wise (USD SWIFT) | **Unverified** (SWIFT; Wise covers predicted correspondent fees) | none in USD | **Unverified** |

**Small amounts hurt.** The fixed 30¢ is 6% of $5, and a payout fee is easier to bear on a larger sum. Hence the $3 minimum gift, presets from $5 and a $25 payout threshold ([§15](#15-owner-decisions)).

## 6. Taxes

### 6.1 Indirect tax (VAT, GST, sales tax)

- **A gift with nothing in return is outside VAT** in the EU: in *Tolsma* (C-16/93, 1994), money given to a street musician was not consideration ([BAILII](https://mansfield.bailii.org/eu/cases/EUECJ/1994/C1693.html)). **UK HMRC:** donations "freely given … who receives nothing in return" are outside VAT ([VCHAR9200](https://www.gov.uk/hmrc-internal-manuals/vat-charities-manual/vchar9200)); optional tips are outside scope ([VATSC06130](https://www.gov.uk/hmrc-internal-manuals/vat-supply-and-consideration/vatsc06130)) (accessed 2026-11-22).
- **US sales tax** reaches sales of property and listed services; a gift is generally not a sale. **Elsewhere** (Saudi Arabia, UAE, Egypt, India, Indonesia, Malaysia, Nigeria, Turkey, Pakistan, Bangladesh, Canada, Australia) VAT/GST also needs a supply for consideration; likely the same, **Unverified** per country.
- **What breaks it:** any perk, badge, shout-out, early access or tier named after a benefit. Then the payment is consideration for a digital service and VAT applies at the supporter's location. The EU deemed-supplier rule (Art. 9a, Implementing Regulation 282/2011) would then likely make **us** the seller, **even at 0%**, because the test is control (setting terms, authorising the charge), not fees (legislation.gov.uk (`https://www.legislation.gov.uk/eur/2011/282/article/9a/data.htm`); *Fenix* C-695/20, [DLA Piper](https://www.dlapiper.com/en-jp/insights/publications/2023/03/validity-of-article-9a-of-council-implementing-regulation-282-2011-confirmed)). Some US marketplace-facilitator laws catch a platform that "makes payment processing available" ([MTC white paper](https://www.mtc.gov/wp-content/uploads/2023/02/Wayfair-and-Marketplace-White-Paper-FINAL-7-8-2021.pdf)). This is the biggest reason perks are off ([§10](#10-optional-paid-perks-designed-not-scheduled)).
- With a 0% cut we sell nothing to creators either, so there is no VAT on a platform commission.

### 6.2 Who is the seller of record

Nobody, for a pure gift: there is no supply. The organization is PayGood's merchant and passes the gift to the creator (as their agent, or as a grant under the charitable model, [§4.1](#41-money-transmission-the-organization-now-touches-the-money)). If perks are added, see above.

### 6.3 Creators' income tax and reporting

- **Support is generally taxable income for the creator**, not a tax-free gift: payments tied to someone's public work fail the *Duberstein* "detached generosity" test ([Journal of Accountancy, Sep 2024](https://www.journalofaccountancy.com/issues/2024/sep/taxation-of-influencers-gifts-with-strings-attached.html)). Studio says "You're responsible for tax on what you receive" and gives no advice. US creators may be able to use the "no tax on tips" deduction for digital content creators ([Hollywood Reporter on Treasury guidance](https://www.hollywoodreporter.com/business/business-news/no-tax-on-tips-guidance-creators-trump-treasury-1236366513)); the accountant confirms.
- **Supporters can't deduct** support to an individual (IRS Publication 526). Only the charity route, or the charitable model if the lawyer picks it ([§4.1](#41-money-transmission-the-organization-now-touches-the-money)), can give deductible receipts.
- **Now the organization pays creators, so it has reporting duties of its own.** PayGood files any 1099-K for the organization as its merchant. For creators, depending on the structure: Form **1099-NEC/MISC** (threshold $2,000 from 2026) or **1099-K** (if the organization is a third-party settlement organization; above $20,000 and 200 transactions again under the 2025 law, [IRS FAQ](https://irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000)), and **1042-S** for non-US creators if any payment is US-source. **W-9 / W-8BEN** are collected by the payout rail at onboarding ([§7.3](#73-payout-rails-compared)); rails that generate year-end forms are preferred. The accountant decides which forms apply ([§14.2](#142-accountant-or-tax-adviser)).
- **Withholding:** services performed abroad are foreign-source, so no US 30% withholding on non-US creators is expected ([IRS](https://www.irs.gov/node/1204)); gift-like income sourcing is **Unverified**. Backup withholding (24%) applies to US creators without a valid W-9; the rail's tax module or our payout job must apply it.
- **Platform reporting rules are now more likely to apply.** EU DAC7, UK digital platform reporting (from 1 Jan 2024, [GOV.UK](https://www.gov.uk/guidance/check-if-you-need-to-register-as-a-digital-platform-operator)), Canada Part XX and Australia's sharing economy regime follow the OECD model. A "relevant activity" needs **consideration**, and a pure gift may have none ([Wolters Kluwer on DAC7 and creators](https://legalblogs.wolterskluwer.com/international-tax-law-blog/dac7-and-digital-content-creators-opaque-transparency-for-influencers-streamers-and-other-content-creators/)), but a platform that collects and pays out is squarely a "platform operator" if anything is in scope. **The accountant decides.** The ledger holds what is reported (payee identity link, country, totals per quarter), and the rail's KYC holds the rest.

### 6.4 Our own tax

With 0% revenue, the platform has no income from support. The accountant is asked how the company is funded and taxed ([§14.2](#142-accountant-or-tax-adviser)).

## 7. International and sending funds

### 7.1 How other platforms pay creators

Researched 2026-11-22 from each platform's own help, terms and payout pages. Some help centres (Patreon, Ko-fi, Substack, Twitch) refuse automated reads; those facts come from search extracts of the same official pages and are marked **(extract)**: lower confidence, check before relying on them.

| Platform | Seller to the fan (tax) | Who holds the money, how long | Payout rails (processor) | Threshold, schedule | Taken from the creator | Tax forms |
|---|---|---|---|---|---|---|
| **YouTube** memberships, Super Chat, Super Stickers, Super Thanks | YouTube/Google (Apple when bought in the iOS app); Google collects sales tax and VAT | Google. Earnings finalised on the 3rd of the next month, paid the 21st–26th: about 50–55 days minimum ([AdSense timeline](https://support.google.com/adsense/answer/7164703)) | EFT, SEPA, wire, check, PayPal Hyperwallet, varying by country; Google's own rails ([methods](https://support.google.com/adsense/answer/1714397)) | $100, monthly ([thresholds](https://support.google.com/adsense/answer/1709871)) | 30% of net; YouTube absorbs card fees ([revenue share](https://support.google.com/youtube/answer/72902), [Super Thanks etc.](https://support.google.com/youtube/answer/14915707)) | W-9/W-8 required; 0–30% withholding on US-viewer earnings for non-US creators; 1042-S, 1099-MISC/K ([tax](https://support.google.com/youtube/answer/10391362)) |
| **Patreon** | Patreon is "the billing entity" (Patreon Ireland for non-US fans); collects VAT and US sales tax ([legal](https://www.patreon.com/policy/legal)) | Patreon. Pending up to 7 days (web), 75 days (iOS); reserves possible; 5-day lock after changing payout method (extract) | US: Stripe bank transfer ($0.25); elsewhere Payoneer (≈$0.50 local bank; $1 wallet); PayPal (1%, $0.25–$20) (extract) | ≈$10; automatic on the 5th or manual daily (extract) | 10% for new creators from 4 Aug 2025, plus 2.9% + 30¢ (more abroad), 2.5% FX (extract) | W-9 or W-8BEN(-E) before any payout; 1099-K (extract) |
| **Ko-fi** | The creator; Ko-fi collects no VAT ([terms](https://more.ko-fi.com/terms)) | The creator's own PayPal or Stripe account; Ko-fi "never processes or holds funds" | Whatever the creator's PayPal or Stripe offers | The processor's | 0% on tips, 5% on memberships and shop, plus processing (extract) | KYC and 1099-K by the processor; Ko-fi files DAC7/UK reports for goods and services (extract) |
| **Buy Me a Coffee** | The creator (Stripe Standard accounts); no VAT collected ([terms](https://buymeacoffee.com/terms)) | Briefly; first payout reviewed 7–14 days, then weekly (extract) | **Stripe only** | $10, weekly (extract) | 5% + 2.9% + 30¢ + 0.5% payout (+1% international) ([fees](https://help.buymeacoffee.com/en/articles/8105744)) | 1099-K from Stripe |
| **Twitch** subs and Bits | Twitch, under its [Terms of Sale](https://www.twitch.tv/p/en/legal/terms-of-sale/); buyer pays VAT | Twitch, "Net-15" after month end (extract) | ACH (US), local bank, SEPA, PayPal, wire, check (extract) | $50 ($100 wire), monthly (extract) | Subs 50% (60–70% on the Plus programme); Bits 1¢ each ([Twitch](https://blog.twitch.tv/en/2024/01/24/an-update-to-several-streamer-payout-programs/)) | Amazon tax interviews (W-9/W-8), 1099-MISC, 1042-S; a DAC7 interview for EU creators, payouts blocked without it (extract) |
| **Substack** | The writer (own Stripe); from 1 Dec 2026 Substack collects sales tax and VAT for them, with exclusions (extract) | The writer's own Stripe account; first payout 7–14 days (extract) | **Stripe only**, no PayPal (extract) | Stripe's; daily or weekly | 10% + 2.9% + 30¢ + 0.5% (extract) | 1099 from Stripe (extract) |
| **LaunchGood** campaigns | LaunchGood as a "fundraising technology platform"; the organising nonprofit issues receipts (terms (`https://www.launchgood.com/terms-of-use`)) | LaunchGood, paid within 90 days of a successful campaign; monthly for organizations; reserves on early payouts (terms) | Bank only: ACH (US), FPS (UK), EFT (CA) free; elsewhere USD or local wire $12–20, 5–10 business days ([payouts](https://support.launchgood.com/support/solutions/articles/35000013654), 4 Feb 2026) | 200 in the campaign currency raised | 0%, funded by donor tips; card ≈2.9% + 30¢ ([fees](https://launchgood.freshdesk.com/support/solutions/articles/35000179424-platform-fees)) | Government ID, bank statement, for organizations registration and controller; enhanced checks outside the G7 ([KYC](https://launchgood.freshdesk.com/support/solutions/articles/35000294469)); 1099 practice **Unverified** |

**Country reach** (can a creator living there be paid?). Y yes · P partial · N no · U unverified.

| Creator in | YouTube fan funding | Patreon | Ko-fi | Stripe-only (BMC, Substack) | LaunchGood |
|---|---|---|---|---|---|
| Saudi Arabia, Qatar, Kuwait, Bahrain, Oman | Y | Y (PayPal) | P (PayPal only) | N | P (organizations only) |
| UAE | Y | Y | Y | Y | N |
| Egypt | Y | U | U | N | P (org) |
| Jordan, Morocco | Y | Y (PayPal) | P (PayPal) | N | P (org) |
| Algeria | Y | U | N/U | N | P (org) |
| Tunisia, Iraq, Palestine | N (ads only) | U | N/U | N | Tunisia P (org); Iraq, Palestine N |
| Lebanon | Y | U | N/U | N | N |
| Turkey | Y | U | U | BMC Y (Express), Substack N | P (org) |
| Pakistan, Bangladesh | N (ads only) | U (Payoneer) | N | N | P (org) |
| Indonesia | Y | Y (PayPal) | P | Substack P | P (org) |
| Malaysia | Y | Y | Y | Y / Substack P | P (org) |
| Nigeria | Y | U | U | N | N |
| Somalia, Sudan, Afghanistan | N | U | N | N | N |
| Syria | N | N/U | N | N | N |
| Iran | N | N | N | N | N |
| US, UK, Canada, EU | Y | Y | Y | Y | Y (EU partial) |

### 7.2 What we take from them

- **Two models exist.** Either the platform is the seller, holds the money and pays out on a cycle through a payout network (YouTube, Twitch, Patreon), or the creator is the seller and money goes to the creator's own processor account (Ko-fi, Buy Me a Coffee, Substack). The second needs no holding but its reach is the processor's: Stripe-only services reach almost no Muslim-majority country, and we never use Stripe ([T2](decisions.md#t2-billing-provider)). The owner has chosen the first model with PayGood collecting only ([O42](decisions.md#o42-paygood-collects-only-creators-paid-through-a-separate-payout-rail)).
- **Holds are normal:** 7 days to about 55 days, longer for in-app purchases, plus reserves and chargeback claw-backs. Our recommended 30 days sits in that range ([§2.6](#26-holds-thresholds-and-payout-schedule)).
- **Thresholds and monthly cycles are normal:** $10 (Patreon), $50 (Twitch), $100 (YouTube), 200 raised (LaunchGood).
- **Every platform that pays creators collects W-9 / W-8BEN before the first payout** and issues 1099 or 1042-S forms; Twitch blocks EU creators without a DAC7 interview. We need the same, through the rail ([§6.3](#63-creators-income-tax-and-reporting)).
- **Reach follows the payout rail, not the platform.** PayPal adds the Gulf, Jordan, Morocco and Indonesia; only Google's own rails, Payoneer and bank wires reach Egypt, Pakistan and Bangladesh; nobody pays Iran, and Syria, Sudan, Somalia and Afghanistan are effectively unreachable.
- **LaunchGood is the closest model** (0% fee, Muslim audience, holds and pays out) and still pays most Muslim-majority countries only to registered organizations, by $12–20 wire, with enhanced checks.
- **What we don't copy:** any platform cut (all except Ko-fi tips and LaunchGood take one), Stripe as a rail, and long holds that exist for float rather than risk.

### 7.3 Payout rails compared

Never Stripe, including payout services that run on Stripe ([T2](decisions.md#t2-billing-provider)). Every rail below was checked for that. All from each vendor's own pricing, docs and acceptable-use pages, accessed 2026-11-22, unless marked.

| Rail | On Stripe? | Policy fit for a nonprofit paying gifts to creators | Payee onboarding, KYC | W-9 / W-8BEN, 1099 | Rails | FX | Fixed cost |
|---|---|---|---|---|---|---|---|
| **Wise Business** (batch payments, API) | No (Wise's own licences) | A registered US nonprofit and a US marketplace are allowed; gifts, tips and religion not banned. **But** money-service businesses "transmitting money … on behalf of third parties" are not supported ([AUP](https://wise.com/us/legal/acceptable-use-policy), 25 Mar 2026), so the model must be described to Wise and cleared in writing | None for payees: we send bank details through Wise's API; Wise screens the payments | None: we collect forms and file | Local bank in many currencies, plus USD SWIFT | Mid-market rate, fees "from 0.23%" ([pricing](https://wise.com/us/pricing/business)) | $31 once; no monthly fee |
| **PayPal Payouts** | No (PayPal) | Nonprofits, live streaming and "pays uploaders for content" need PayPal's approval ([AUP](https://pep.paypal.com/legalhub/acceptableuse-full)); Payouts access is requested separately | The creator's own PayPal account; PayPal does KYC | None | PayPal wallet, Venmo (US) | 4% spread when converting ([fees](https://pep.paypal.com/us/business/paypal-business-fees), 4 Nov 2026) | $0; US API payout $0.25; international 2%, max $20 |
| **Trolley** | No (Cross River Bank in the US, Currencycloud in EEA/UK; licensed money transmitter, [licences](https://trolley.com/trolley-regulatory-licenses/)) | Markets to creator platforms; gift/religion policy **Unverified** | White-label hosted portal; ID checks on the Trust module | Yes, Tax module (W-9/W-8, 1099 filing) | Bank, wire, PayPal, Venmo, debit card, check | 2% | $2,399/yr Pay module, + $2,399/yr Tax, + $1,199/yr Trust; per payout $1 ACH to $25 USD wire ([pricing](https://trolley.com/pricing/)) |
| Hyperwallet (PayPal) | No | Same PayPal policy (**Unverified**) | Hosted payee portal | Add-on (**Unverified**) | Bank, wire, PayPal, card, cash pickup | 2% majors, 4% others | Possible recurring fee (**Unverified**); $4.95 international bank payout |
| Payoneer | No | **Ruled out:** its prohibited list names "Religious and Political resources" and "gifts, donations … from friends and family" ([list](https://www.payoneer.com/legal/prohibited-transaction-list/)) | Hosted | **Unverified** | Bank, Payoneer wallet | **Unverified** | **Unverified** |
| Airwallex | No | **Poor fit:** charities, religious organizations, live-streaming platforms and "payouts or collecting funds on behalf of any other person" each need approval ([AUP](https://www.airwallex.com/us/terms/acceptable-use-policy)) | API | None | Local, SWIFT | 0.5–1% | $0 plan; payout API by sales |
| Tipalti | No (**Unverified**) | **Unverified** | Hosted portal | Yes | 50+ methods | **Unverified** | From $249/month ([pricing](https://tipalti.com/pricing/)) |
| dLocal, Thunes, Nium, Rapyd | No | **Unverified** | API | None | Bank, wallet, cash | **Unverified** | Enterprise, sales-led; Rapyd Disburse $5,000/month minimum (community post, 2022) |
| Own bank wire / ACH | No | n/a | None; we screen | None | SWIFT, ACH (US only) | Bank's margin | About $25–50 per international wire (**Unverified**) |
| Tremendous | No | Built for rewards | — | — | PayPal, some banks | — | 6% recipient fee: poor fit |
| Stripe Connect, Stripe Global Payouts, any service on Stripe | **Yes** | **Never** ([T2](decisions.md#t2-billing-provider)) | | | | | |

### 7.4 Coverage by country

Can a creator living there be paid? Y yes · P partial (USD SWIFT only, or a practical caveat) · N not listed · U unverified.

| Creator in | Wise | PayPal Payouts | Wise + PayPal | Trolley | Notes |
|---|---|---|---|---|---|
| US, Canada, UK, EU | Y | Y | **Y** | Y | |
| UAE | Y | Y | **Y** | Y | |
| Saudi Arabia, Qatar, Kuwait, Bahrain, Oman | P (USD SWIFT) | Y | **Y** | Y (wire) | PayPal wallet or USD wire |
| Egypt | Y | N | **Y** | Y (wire) | Wise local currency |
| Jordan | N | Y | **Y** | Y (wire) | PayPal only |
| Morocco | Y | Y | **Y** | Y | |
| Algeria, Tunisia | P (USD SWIFT) | N | **P** | Y | USD wire only |
| Lebanon | P (USD SWIFT) | N | **P** | P (USD wire) | Banking crisis makes receipt unreliable |
| Turkey | Y | Y (no FX conversion) | **Y** | Y | |
| Pakistan, Bangladesh | Y | N | **Y** | Y (wire) | Wise local currency |
| Indonesia, Malaysia | Y | Y | **Y** | Y | |
| Nigeria | Y | N | **Y** | Y (wire) | Wise local currency |
| Iraq, Palestine | N | N | **N** | P (USD wire) | Only Trolley or a bank wire |
| Somalia, Sudan, Afghanistan | N | N | **N** | N | No rail checked lists them; legal review |
| Syria | N | N | **N** | N | US programme changed in 2025; providers haven't returned ([§4.3](#43-sanctions-and-high-risk-countries)) |
| Iran | N | N | **N** | N | OFAC; never |

**Wise + PayPal pays creators in 22 of the 29 markets checked** (some by USD wire or PayPal wallet only). **Not covered: Iraq, Palestine, Somalia, Sudan, Afghanistan, Syria, Iran**; Lebanon is unreliable in practice.

### 7.5 Recommendation: Wise primary, PayPal Payouts fallback

**Primary: Wise Business** ([MEM-D17](#15-owner-decisions)).
- Reaches the most target countries of the low-cost rails, including Egypt, Pakistan, Bangladesh and Nigeria in local currency, which PayPal can't.
- $31 once, no monthly fee, mid-market FX: fits the $500/month cap at any volume we expect.
- A registered US nonprofit is an allowed customer.
- **What it costs us in work:** Wise does no payee onboarding, so we build it: Studio collects the creator's bank details and sends them straight to Wise's recipient API (we keep only Wise's recipient id, never the account number); we collect W-9 / W-8BEN ourselves through an e-signed form, stored encrypted and readable only by the organization's finance list; we screen payees against OFAC and the other lists before each payout (a screening API, or the rail's, [§4.3](#43-sanctions-and-high-risk-countries)); and the organization files year-end forms ([§6.3](#63-creators-income-tax-and-reporting)).
- **Blocker:** Wise's AUP excludes money-service businesses transmitting for third parties. The organization describes the model to Wise in writing before signing (MEM-1). Under the charitable model ([§4.1](#41-money-transmission-the-organization-now-touches-the-money)) the organization pays its own grants, which fits Wise's rules best.

**Fallback: PayPal Payouts.**
- For creators Wise can't reach (Jordan), creators who prefer a wallet, and as the second rail if Wise refuses or pauses us.
- $0 fixed; $0.25 per US payout, 2% (max $20) international, 4% FX when converting (paying in USD avoids the conversion).
- PayPal does the KYC through the creator's own PayPal account. Needs PayPal's approval for a nonprofit paying uploaders.

**Upgrade when volume pays for it: Trolley** ([MEM-D17](#15-owner-decisions)). $2,399 a year for payouts plus $2,399 for tax forms: a white-label payee portal with KYC, W-9/W-8 collection and 1099 filing, so we stop holding bank details and tax forms, and USD wires to Iraq and Palestine. Recommended once yearly payouts are large enough that $4,800 is under about 1% of them (about $480,000 a year), or sooner if the lawyer prefers a licensed money transmitter holding funds FBO creators ([§4.1](#41-money-transmission-the-organization-now-touches-the-money), structure 3).

**Not recommended:** Payoneer (bans gifts and religious resources), Airwallex (four restricted categories), Tipalti ($249/month minimum), Rapyd ($5,000/month minimum), dLocal/Thunes/Nium (enterprise only), Tremendous (6% to the recipient), anything on Stripe.

### 7.6 Creators no rail covers

For **Iraq, Palestine, Somalia, Sudan, Afghanistan, Syria** (and Lebanon in practice), there is no payout today:

- **No gifts are collected for them.** The Countries page marks them `external_link_only` or `blocked`; the server refuses checkout to a channel whose payee country can't be paid, so no money waits for a creator who can never receive it.
- **External support link** where the law allows: the creator's own LaunchGood page or another service they already use. We show it with "You'll leave Al Ummah Now. This page is run by {site}." and take nothing. Behind `supportExternalLinks`, default off; admins review each link once. The lawyer confirms per country (sanctions, [§14.1](#141-us-lawyer)).
- **Iraq and Palestine** can be added with Trolley's USD wire or the organization's bank wire, after a legal review ([MEM-D2](#15-owner-decisions)).
- **Iran** and any embargoed region: never.

## 8. App stores

Support with nothing in return and **100% of the funds to the creator** is the case every store treats most simply. With the organization collecting and paying out, 100% of the gift still goes to the creator, less only PayGood's and the payout rail's fees and nothing to us; whether Apple reads vendor fees, the hold and an intermediary as "100% to the receiver" is **Unverified** and goes in the written pre-clearance question. The [Apple guideline 3.2.1(vii)](https://developer.apple.com/app-store/review/guidelines/) (guidelines revised 16 Oct 2026): "Apps may enable individual users to give a monetary gift to another individual without using in-app purchase, provided that (a) the gift is a completely optional choice by the giver, and (b) 100% of the funds go to the receiver of the gift. However, a gift that is connected to or associated at any point in time with receiving digital content or services must use in-app purchase."

| Store | One-time and monthly support | Fee to the store | Notes |
|---|---|---|---|
| Apple, every storefront (iOS, iPadOS, macOS) | Our provider checkout, under 3.2.1(vii) | 0% | Button only on the channel page. Insight Timer precedent: profile donations stayed outside in-app purchase; donations tied to live events or meditations had to use it ([TechCrunch](https://techcrunch.com/2024/02/21/in-a-reversal-apple-is-now-demanding-30-of-the-donations-to-meditation-app-insight-timers-teachers/amp), 21 Feb 2024). **Unverified:** whether Apple counts card fees against "100%", and whether it accepts a recurring gift outside in-app purchase. Ask App Review in writing first. |
| Apple, US storefront | Also allowed: a button to web checkout, no entitlement needed (3.1.1(a), 3.1.3) | 0% today; the Ninth Circuit (11 Dec 2025) allows a future cost-based fee; no rate set as of this page (opinion, Ninth Circuit No. 25-2935, `https://cases.justia.com/federal/appellate-courts/ca9/25-2935/25-2935-2025-12-11.pdf`; [Supreme Court stay denied, 6 May 2026](https://9to5mac.com/2026/05/06/supreme-court-rejects-apples-stay-request-epic-games-case-to-head-back-to-district-court/)) | Fallback if App Review refuses 3.2.1(vii) |
| Apple tvOS | No checkout on TV. A **QR code** to the web support sheet on the channel page | 0% | Same 3.2.1(vii) basis; **Unverified** for tvOS |
| Apple, charity route | Only approved nonprofits with Apple Pay (3.2.1(vi)); every listed charity must be approved; otherwise web only (3.2.2(iv)) | 0% | |
| Google Play | Outside Play Billing as a **peer-to-peer payment** (the Payments policy excludes peer-to-peer payments and tax-exempt donations, [Play policy](https://support.google.com/googleplay/android-developer/answer/9858738), accessed 2026-11-22) | 0% | **Unverified** that creator support counts as peer-to-peer. Ask Play policy support in writing. In the US, EEA and UK, external links and own billing are also allowed through Google's programmes (fees from 1 Oct 2026: 10% subscriptions, 20% other, 20% external links on existing installs, [Play fees](https://support.google.com/googleplay/android-developer/answer/112622)). |
| Microsoft Store (Windows, non-game) | Our provider; donations **must** use our own or a third-party payment API (policy 10.8.2, [Store Policies 7.20](https://learn.microsoft.com/en-us/windows/apps/publish/store-policies), 14 Sep 2026) | 0% | Declare third-party commerce in Partner Center |
| Linux, Tizen, direct downloads | Our provider (Tizen TV: QR code) | 0% | |

**If a store refuses:** that app shows no Support button (hidden, per [Product rules](../guides/product-rules.md)), and the server's `support` key is off for that client. Support stays on the web. We never sell support through in-app purchase, because the store's cut would break "100% to the creator" and the owner's 0% rule.

**Perks** ([§10](#10-optional-paid-perks-designed-not-scheduled)) are digital content: in-app purchase on Apple outside the US, EU and Japan programmes; Play Billing outside Google's programmes; own commerce allowed on Windows. Web-bought perks can be honoured in the Apple app only if also sold as in-app purchase (3.1.3(b)).

## 9. Architecture

### 9.1 Principles

- **Two separate pipes.** PayGood **collects** from supporters into the organization's own PayGood merchant account; it never pays creators. A **payout rail** ([§7.3](#73-payout-rails-compared)) pays creators from the organization's creator-funds account. The two meet only in our ledger.
- **The organization holds creators' money in trust, never the owner.** Settlements land in a dedicated **creator-funds bank account** in the organization's name, separate from its operating account, that earns no interest ([§3.4](#34-riba)). The owner has no access to it, no signing authority and no `support:payouts` permission ([§9.6](#96-admin-pages-videos-admin--support)).
- **The ledger is the source of truth for balances.** Every cent a creator is owed is a sum of immutable double-entry rows in `support_ledger`. Nothing edits a row; corrections are new rows. Balances are computed from the ledger, never stored as a mutable number.
- **Three-way reconciliation every day:** the ledger against PayGood's settlements, the creator-funds bank statement and the payout rail's balance and payout reports. Any gap stops new payout batches and flags the admin **Errors** page.
- **Always async** ([O26](decisions.md#o26-always-async-with-admin-visible-errors)). Webhooks from PayGood and the rail are verified, stored once and handled by queued jobs with retry, backoff and a DLQ. Every payout is its own job. Anything that gives up shows on **Errors** with **Retry**, and on the job's own page with its log lines.
- **Idempotent money moves.** Every payout carries an idempotency key (`payout id`) the rail honours, so a retry can never pay twice. A payout whose result is unknown is never resent blind: the job first asks the rail for its status.
- **Server decides.** The server checks the feature switch, the country rules, the creator's payee state and the supporter's eligibility on every request. Clients only hide what the server says is off.
- **Troubleshooting from admin, never from Cloudflare, PayGood's or the rail's dashboard.** Each job, webhook, payee and payout has a page with its state, attempts, next retry, the vendor's last answer and the log lines.

### 9.2 Building on what exists

AUN-SUBS already shipped a payments framework, off by default: one `PaymentProvider` interface, `billing_events` (idempotent by provider, mode and event id), the `billing.webhook` admin job, sweeps, Settings › Billing and the admin Payments page (AlUmmahNow `docs/features/payments.md`). There the organization sells tiers and is the merchant. Creator support also has the organization as the PayGood merchant, so it **reuses the PayGood adapter's credentials, checkout and webhook verification**, but books every payment to a creator in its own ledger and never mixes it with tier revenue.

Two interfaces, next to `PaymentProvider`:

```ts
// Collecting: PayGood, on the organization's merchant account. Never pays creators.
interface SupportCollector {
  id: 'paygood' | 'test';
  createCheckout(input: SupportCheckoutInput): Promise<{ url: string; checkoutId: string }>; // hosted, PCI SAQ A
  cancelPledge(pledgeId: string, reason: CancelReason): Promise<void>;
  refund(paymentId: string, amount?: Money): Promise<RefundResult>;   // from the organization's merchant; debits the creator's ledger
  quote(input: QuoteInput): Promise<FeeQuote>;                        // card fee + FX estimate before paying (§5.4)
  verifyWebhook(req: Request, rawBody: ArrayBuffer): Promise<CollectorEvent[]>;
  listSettlements(since: string): Promise<Settlement[]>;              // for reconciliation; PayGood API coverage Unverified (§12.1)
}

// Paying: the payout rail (§7.3). Never collects from supporters.
interface PayoutRail {
  id: PayoutRailId;                                                  // e.g. 'paypal-payouts' | 'payoneer' | 'wise' | 'test'
  createPayeeLink(creator: CreatorRef, returnUrl: string): Promise<{ url: string; expiresAt: string }>; // hosted KYC, bank or wallet, tax form
  getPayee(payeeId: string): Promise<PayeeState>;                    // status, country, methods, tax form on file, sanctions hold
  quotePayout(payeeId: string, amount: Money): Promise<PayoutQuote>; // rail fee + FX, shown in Studio before the payout
  sendPayout(p: { payoutId: string; payeeId: string; amount: Money }): Promise<PayoutAck>; // idempotent on payoutId
  getPayout(payoutId: string): Promise<PayoutState>;
  getFundingBalance(): Promise<Money[]>;                             // pre-funded balance at the rail
  verifyWebhook(req: Request, rawBody: ArrayBuffer): Promise<RailEvent[]>;
}
```

It reuses the webhook route shape (`POST /webhooks/support/:vendor`), raw-body signature checks, the `admin_jobs` queue with its backoff (10 s × 2ⁿ up to 300 s, 5 tries, then `failed` and the DLQ), Secrets Store for credentials (write-only, "Set / Not set"), step-up for sensitive admin actions, the erasure rules in `apps/processor/src/erasure/user-traces.ts`, and the Features page switch ([AUN-FEATURES](AUN-FEATURES-feature-switches.md)).

### 9.3 Data model (search D1, admin-api owned migrations)

Amounts are integers in minor units with an ISO 4217 currency. Balances are never stored; they are sums over `support_ledger`.

| Table | One row per | Key columns |
|---|---|---|
| `support_payees` | creator's payee record at the payout rail | `id`, `channel_id`, `owner_user_id`, `rail`, `mode` (test/live), `rail_payee_id`, `country`, `payout_currency`, `method` (bank, wallet, PayPal, …, as the rail reports), `status` (`not_started`, `pending`, `action_needed`, `active`, `restricted`, `disabled`, `closed`), `tax_form` (`none`, `w9`, `w8ben`, `w8bene`, as the rail reports; never the form itself), `sanctions_status`, `updated_from_event_at` |
| `support_settings` | channel | `channel_id`, `enabled`, `one_time_enabled`, `monthly_enabled`, `presets` (JSON), `min_amount`, `thank_you_note`, `show_supporter_count` |
| `support_pledges` | monthly support | `id`, `supporter_user_id`, `channel_id`, `collector_subscription_id`, `amount`, `currency`, `supporter_covers_fees`, `status` (`active`, `past_due`, `canceled`, `ended`), `started_at`, `current_period_end`, `canceled_at`, `cancel_reason`, `anonymous` |
| `support_payments` | charge (one-time or a monthly renewal) | `id`, `pledge_id?`, `supporter_user_id`, `channel_id`, `collector_payment_id`, `gross`, `currency`, `collector_fee`, `tax`, `fx_rate?`, `status` (`succeeded`, `failed`, `refunded`, `partially_refunded`, `disputed`, `dispute_lost`, `dispute_won`), `available_at` (end of the hold, [§2.6](#26-holds-thresholds-and-payout-schedule)), `message?` (moderated), `anonymous`, `supporter_country`, `created_at` |
| `support_ledger` | immutable double-entry line | `id`, `entry_id` (groups the lines of one event, which sum to zero), `account` (`creator:{channelId}:pending`, `creator:{channelId}:available`, `creator:{channelId}:in_payout`, `clearing:paygood`, `bank:creator_funds`, `rail:funding`, `fees:paygood`, `fees:rail`, `fees:fx`, `loss:org_reserve`), `amount` (signed), `currency`, `kind` (`gift`, `collector_fee`, `release`, `refund`, `dispute`, `dispute_reversal`, `payout`, `payout_fee`, `payout_return`, `fx`, `adjustment`), `ref_table`, `ref_id`, `created_by` (`system` or an admin id for adjustments), `created_at` |
| `support_payouts` | one payout to one creator | `id` (the idempotency key), `batch_id`, `payee_id`, `amount`, `currency`, `rail_fee`, `fx_rate?`, `rail_payout_id?`, `status` (`queued`, `sent`, `unknown`, `paid`, `failed`, `returned`, `canceled`), `failure_reason?`, `attempts`, `sent_at`, `paid_at` |
| `support_payout_batches` | monthly (or manual) run | `id`, `period`, `status` (`draft`, `awaiting_approval`, `approved`, `funding`, `sending`, `done`, `stopped`), `total`, `count`, `approved_by` (an organization-named approver, never the owner), `approved_at`, `funding_reference` |
| `support_refunds` | refund | `id`, `payment_id`, `amount`, `reason`, `requested_by` (`creator`, `admin`, `collector`), `status`, `collector_refund_id` |
| `support_disputes` | chargeback / dispute | `id`, `payment_id`, `collector_dispute_id?`, `reason`, `amount`, `fee`, `status`, `evidence_due_at`, `outcome` |
| `support_events` | vendor webhook event (raw log) | `vendor` (`paygood`, rail id), `mode`, `event_id` (unique together), `type`, `received_at`, `payload` (emptied on erasure), `job_id`, `status`, `error?` |
| `support_reconciliations` | daily three-way check | `id`, `date`, `ledger_total`, `paygood_settled`, `bank_balance` (entered or imported by the organization's finance person), `rail_balance`, `gap`, `status` (`ok`, `gap`), `resolved_by?` |
| `support_country_rules` | country | `country`, `supporters` (`allowed`, `blocked`), `creators` (`allowed`, `blocked`, `waitlist`, `external_link_only`), `reason` (`sanctions`, `rail_unsupported`, `legal_review`, `admin`), `changed_by`, `changed_at` |
| `support_reports` | abuse / fraud report on a creator or payment | `id`, `target_kind`, `target_id`, `reporter_user_id`, `reason`, `status` |

Every admin change writes `admin_audit` with the old and new value. Creator-side actions (turn support on, change presets, connect a payee, refund a supporter) write `channel_audit` too.

**Ledger postings** (each entry sums to zero):

| Event | Lines |
|---|---|
| Gift succeeds ($5.00, PayGood fee $0.45) | `clearing:paygood` +5.00 · `creator:pending` −4.55 · `fees:paygood` −0.45 |
| PayGood settles to the creator-funds bank | `bank:creator_funds` +4.55 · `clearing:paygood` −4.55 (fees were netted by PayGood) |
| Hold ends ([§2.6](#26-holds-thresholds-and-payout-schedule)) | `creator:pending` +4.55 · `creator:available` −4.55 |
| Organization funds the rail | `rail:funding` +X · `bank:creator_funds` −X |
| Payout sent ($40.00, rail fee $1.00) | `creator:available` +40.00 · `creator:in_payout` −40.00; on `paid`: `creator:in_payout` +40.00 · `rail:funding` −39.00 · `fees:rail` −1.00 … with the fee shown to the creator before the batch |
| Refund or lost dispute | reverses the gift lines from `creator:pending` or `creator:available`; if those are short, the creator's balance goes negative and future gifts net against it ([MEM-D21](#15-owner-decisions)) |

(Signs follow "credit to the creator is negative"; the exact chart of accounts is set with the accountant, [§14.2](#142-accountant-or-tax-adviser).)

### 9.4 Webhooks and jobs

1. `POST /webhooks/support/:vendor` (PayGood or the rail) checks the signature on the raw body, then stores the event once in `support_events` (`vendor, mode, event_id`). A redelivery stores nothing new. It queues `support.webhook` and answers 200. A failure before the event is stored answers 503, so the vendor redelivers.
2. `support.webhook` maps the event and posts ledger entries keyed by the vendor's ids. It is idempotent. An older event never moves a status back.
3. Other jobs, all on `admin_jobs` with retry, backoff, the DLQ and per-job log lines (`admin_job_logs`):

| Job | When | What it does |
|---|---|---|
| `support.payee-sync` | after rail onboarding returns; on payee events; daily | Reads the payee's state, payout method, tax-form status and sanctions hold from the rail. |
| `support.release` | hourly | Moves gifts whose hold has ended from pending to available ([§2.6](#26-holds-thresholds-and-payout-schedule)). |
| `support.payout-plan` | monthly on the payout day, or when an approver starts a manual run | Builds a draft batch: every active payee whose available balance is at or above the threshold, with the rail's fee quote. A creator under the threshold rolls over. Blocked if the last reconciliation has a gap. |
| `support.payout-fund` | after the organization's approver approves the batch | Checks the rail's funding balance covers the batch; if not, flags **"Fund the rail: {amount} needed"** for the organization's finance person and waits. Never moves bank money itself. |
| `support.payout-send` | one job per payout once funded | Sends with the payout id as the idempotency key. On timeout or a 5xx, it reads the payout's status before any retry. After 5 tries, `failed` → DLQ → Errors with Retry. |
| `support.payout-status` | on rail events; every 6 hours for payouts still `sent` or `unknown` | Marks `paid`, `failed` or `returned`. A failed or returned payout puts the money back in the creator's available balance and tells the creator what to fix. |
| `support.reconcile` | daily | The three-way check ([§9.1](#91-principles)). A gap stops new batches and flags Errors. |
| `support.rail-balance` | daily and before each batch | Warns when the rail's funding balance is low against the next batch. |
| `support.dispute-deadline` | daily | Flags disputes whose evidence is due within 3 days to the organization's dispute handler. |
| `support.sanctions-recheck` | when a list changes and weekly | Re-reads the rail's screening; a hit pauses the payee and holds its balance (§4.3). |
| `support.country-apply` | when an admin blocks a country | Pauses pledges from or to that country, holds payouts to it, notifies the people affected. |
| `support.dormant` | monthly | Lists balances with no active payee for 6 and 12 months, for the unclaimed-property rule the lawyer sets ([§14.1](#141-us-lawyer)). |

Every failure that needs a person shows on **Errors** with a reason in words and **Retry** ("Couldn't pay Amina $40.00 through {rail}: the bank rejected the account number. Amina has been asked to fix it. Retry"). Nothing silently drops.

### 9.5 Server-side checks on every app

`GET /api/me/features` gets two keys: `support` (can this user support creators here) and `supportReceive` (can this channel receive support). Each is computed on the server from:

- the `creatorSupport` switch on the Features page (default **off**, and it cannot be turned on until the organization is recorded as formed, [MEM-D11](#15-owner-decisions));
- the country rule for the supporter's country (from PayGood's billing country, with the request's country as a first filter) and the creator's payee country;
- the creator's payee at the rail: `active`, with a tax form on file;
- the channel's own setting;
- the store rules for the app asking (§8).

A channel may receive gifts before its payee is active (the money waits in its balance) only if the admin setting "Collect before payout setup" is on (default **off**), so nobody gives to a creator who can never be paid.

The API refuses with `404 feature_off` and the O40 envelope when any check fails. The web, Apple, Android, Desktop and Tizen clients hide the Support button when the key is off.

Perks (§10) add one more key, `supportPerks`, also server-checked. Nothing is unlocked on the client.

### 9.6 Admin pages (videos admin → Support)

| Page | Shows | Actions | Permission |
|---|---|---|---|
| Overview | payments today, balances held for creators, next batch, failures, disputes due, last reconciliation | – | `support:read` |
| Creators | each creator's payee: status, country, payout method, tax form on file, sanctions status, balance (pending, available, in payout) | Re-sync, pause support for this channel, hold payouts | `support:read`, pause and hold need `support:manage` |
| Payments | every payment with fees, tax, net to the creator, status, ledger lines | Refund (full or part), with step-up | `support:refund` |
| Monthly support | pledges | Cancel, with step-up | `support:manage` |
| Disputes | disputes, due dates, our records | Download our records; mark evidence sent in PayGood | `support:disputes` |
| Payouts | batches and each payout with state, attempts, the rail's last answer | Approve batch (step-up), stop batch, retry a payout, cancel a queued payout | approve: `support:payouts`; retry/cancel: `support:manage` |
| Ledger | entries per creator and per account, the daily reconciliation | Post an adjustment (two people: one proposes, a second approves) | `support:ledger` |
| Countries | the country table (§4.3) | Block / allow supporters or creators per country, with a reason | `support:countries` |
| Jobs | each support job with state, attempts, next retry, log lines | Retry now, cancel | `support:manage` |
| Settings | PayGood and rail credentials (write-only), test/live, hold days, threshold, payout day, amount limits, presets | – | `support:providers` |

**Money permissions belong to the organization, not the owner.** `support:refund`, `support:disputes`, `support:payouts`, `support:ledger` and `support:providers` can be granted only to accounts on the organization's **finance list**, which the organization's board sets in the admin (two-person change, audited). The owner's account is never on it, and a server rule refuses to grant those permissions to any account marked `staff_role = tech`. Super-admin alone does not include them. Every action is audited. Permissions live in admin-api, like the rest of the videos admin; nothing uses Auth RBAC.

### 9.7 The Features switch and kill switches

- **`creatorSupport`** on the Features page, group `grow`, default **off**, super admins only, confirm both ways; it can't be turned on until the organization is recorded as formed and a finance-list approver exists. Off means: no Support button anywhere, the API refuses new checkouts, payee onboarding is hidden, and **existing monthly support keeps its schedule unless the admin also chooses "Pause all monthly support"** (a separate confirm in the dialog). **Payouts of money already received keep going** when the switch is off; only "Hold all payouts" stops them, because money received belongs to creators.
- **`supportExternalLinks`** (§7.6), default off, requires `creatorSupport`: creators in countries no rail covers can show their own support link.
- **`charityDonations`** (§3.7), default off, requires `creatorSupport`.
- **`supportPerks`** (§10), default off, requires `creatorSupport`.
- **Per-country** rules on the Countries page, for supporters and creators separately.
- **Per-channel** pause by an admin, and the creator's own on/off; **per-payee payout hold**.
- **Emergency stop**: one button on the Support settings page that pauses every pledge, disables checkout and holds every payout batch, for a vendor incident or a legal order. Audited, needs step-up.

### 9.8 Erasure and retention

Erasing an account keeps payment, ledger and payout rows as financial records under the erased placeholder (the same rule as billing), drops messages, collector customer ids and receipt links, and empties webhook payloads. A creator who erases their account with money still owed is paid out first (or told how to claim it), per the creator agreement. Retention follows the accountant's answer (§14).

## 10. Optional paid perks (designed, not scheduled)

**Not in the build order.** Behind the `supportPerks` switch, default off, which requires `creatorSupport`. Nothing here is built until the owner asks and the lawyer, accountant and scholar have answered the perk questions in [§14](#14-questions-for-a-lawyer-an-accountant-and-a-scholar).

**What changes the moment anything is unlocked:**

| Area | Support only | With perks |
|---|---|---|
| What it is (fiqh) | Gift (hiba) | Hire or sale (ijara / bay'): perks must be known, permissible and delivered ([§3.1](#31-what-the-payment-is)) |
| Consumer law | Likely no consumer contract | Digital service: EU/UK 14-day withdrawal unless waived on a durable medium; UK subscription rules from spring 2027; ROSCA and state auto-renewal laws apply ([§4.5](#45-consumer-law)) |
| VAT / sales tax | Outside scope | Taxable where the supporter is; the EU deemed-supplier rule likely makes **us** the seller even at 0% ([§6.1](#61-indirect-tax-vat-gst-sales-tax)); we'd need non-Union OSS, UK VAT, Saudi, UAE, India, etc. registrations, or a merchant of record that allows creator marketplaces (none found among non-Stripe MoRs) |
| App stores | 0% under 3.2.1(vii) and peer-to-peer | Apple in-app purchase (30%/15%, EU 26%/15%) except US link-out; Play Billing except its programmes ([§8](#8-app-stores)) |
| Platform money flow | The organization collects, holds in trust and pays out | Same, but the tax role may force a merchant-of-record arrangement |

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
| One time | Thank you. Your gift of $5.00 to {channel} is received. It's paid to them with their next payout. | جزاك الله خيرًا. استلمنا هديتك لـ{channel} (٥٫٠٠ دولار أمريكي)، وتُحوَّل إليها مع دفعتها التالية. |
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
| Empty state | Let your viewers support you. We pay what they give you once a month. Al Ummah Now takes nothing. | دع مشاهديك يدعمونك. نحوّل إليك ما يقدّمونه مرةً كل شهر، ولا تأخذ الأمة الآن شيئًا. |
| Start | Set up payouts | إعداد استلام المدفوعات |
| Payout setup | Add where we pay you (a bank account, or your PayPal) and your tax form. Your bank details go straight to {rail}; we keep only a reference. | أضف الحساب الذي نحوّل إليه دفعاتك (حسابًا مصرفيًا أو حساب PayPal) ونموذجك الضريبي. تُرسَل بياناتك المصرفية مباشرةً إلى {rail}، ولا نحتفظ إلا بمرجعٍ لها. |
| Action needed | {rail} needs more from you before payouts can start: {items}. | يحتاج {rail} إلى معلومات إضافية قبل بدء التحويلات: {items}. |
| Not available | Receiving support isn't available in {country} yet. | استلام الدعم غير متاح في {country} حتى الآن. |
| Balance | Waiting: {pending} · Ready to pay: {available} · Next payout: {date}, about {fee} in fees | قيد الانتظار: {pending}، جاهز للتحويل: {available}، الدفعة التالية: {date}، ورسومها نحو {fee} |
| Payout failed | We couldn't pay you {amount}: {reason}. Fix your payout details and we'll try again. | تعذّر تحويل {amount} إليك: {reason}. صحّح بيانات الاستلام وسنعيد المحاولة. |
| Taxes | You're responsible for tax on what you receive. We may send you a tax form at the end of the year. | أنت المسؤول عن ضريبة ما يصلك، وقد نرسل إليك نموذجًا ضريبيًا في نهاية العام. |

### 11.6 Admin (videos admin › Support)

| | English | Arabic |
|---|---|---|
| Country block | Block supporters in {country}? New payments stop now. {count} monthly supports are paused at the provider. | حظر الداعمين في {country}؟ تتوقف الدفعات الجديدة فورًا، ويُعلَّق {count} من الدعم الشهري لدى المزوّد. |
| Job failed | Couldn't pay {creator} {amount} through {rail}: {reason}. | تعذّر تحويل {amount} إلى {creator} عبر {rail}: {reason}. |
| Approve batch | Approve {count} payouts, {total} in all, through {rail}? | الموافقة على {count} دفعة بإجمالي {total} عبر {rail}؟ |
| Fund the rail | Fund {rail}: {amount} needed before this batch can be sent. | موّل {rail}: يلزم {amount} قبل إرسال هذه الدفعات. |
| Retry | Retry | إعادة المحاولة |
| Emergency stop | Stop all support now | إيقاف كل الدعم الآن |

## 12. Partners and vendors

### 12.1 PayGood: collecting only

Read from PayGood's public site, docs, API reference, [terms](https://paygood.com/terms) (10 Sep 2026) and [acceptable-use policy](https://paygood.com/acceptable-use) (17 Sep 2026) on 2026-11-22, and from our adapter (`apps/api-videos/src/lib/billing/paygood.ts`, AlUmmahNow PR 1653).

| Need | PayGood today | What it means here |
|---|---|---|
| Collect for creators on the organization's own merchant account | The AUP says merchants may not "Process transactions on behalf of a business or for a purpose other than what you disclosed to us" or "Engage in third party or prohibited payments"; the terms require using the account "only for the purposes you have stated" and notifying changes. The full restricted list is in the (non-public) merchant agreement. | **Blocker until PayGood approves in writing.** The organization describes the model to PayGood's underwriting (MEM-1). Under the charitable model ([§4.1](#41-money-transmission-the-organization-now-touches-the-money)) the gifts are the organization's own restricted donations, which may fit PayGood's rules more simply. |
| One merchant, many creators | Fits: one merchant account, our ledger splits by creator. | Solves revision 1's problem (no platform/connected-account API, one API key per merchant). |
| One-time support | **Yes**: catalog one-time prices, invoices with hosted checkout. | |
| Monthly support | **Yes**: fixed-amount subscriptions with hosted checkout ([subscriptions guide](https://docs.paygood.com/guides/subscriptions.md)). | Presets; "Other" amounts create a price on demand (PayGood dedupes equal prices). Metadata carries the channel id so each charge books to the right creator. |
| Cancel | **Immediate**, no cancel-at-period-end. | Fine for gifts. |
| Refunds | **Yes**, full or partial, through Finix; event `payments.PaymentRefunded`. | From the organization's merchant; debited from the creator's balance. |
| Disputes and chargebacks | **No dispute endpoints** in the public API. | The organization's dispute handler answers in the PayGood dashboard ([§2.3](#23-chargebacks-disputes-and-fraud)). Ask PayGood for dispute webhooks. |
| Payouts to creators | **None**: PayGood has no payout, transfer, split-payment or connected-account endpoints, and serves US and Canadian merchants only. | Not used, by the owner's decision. PayGood settles to the organization's creator-funds account only. |
| Settlement reports | Payouts of the organization's own settlements: **Unverified** in the public API. | Needed for the daily reconciliation; ask PayGood; otherwise the finance person imports the statement. |
| Webhooks | **Yes**, signed (`Merchant-Webhook-*`, HMAC-SHA256, 5-minute window), redelivery API. | One endpoint, the organization's. |
| Foreign supporters' cards | Not stated (**Unverified**). | Ask PayGood. |
| KYC and sanctions | PayGood/Finix verify the organization; screening of payers **Unverified**. | Payees are screened at payout ([§4.3](#43-sanctions-and-high-risk-countries)). |
| Tax | Not a merchant of record. 1099-K to the organization as merchant (**Unverified**). | The organization reports creator payouts itself ([§6.3](#63-creators-income-tax-and-reporting)). |

### 12.2 Recommended stack

- **Collect:** PayGood, one merchant account in the organization's name, settling to a dedicated non-interest **creator-funds** bank account.
- **Ledger:** ours, double-entry, reconciled daily against PayGood, the bank and the rail ([§9](#9-architecture)).
- **Pay:** **Wise Business** (primary) and **PayPal Payouts** (fallback), both pre-funded from the creator-funds account by the organization's finance person; **Trolley** when volume pays for its hosted onboarding and tax forms ([§7.5](#75-recommendation-wise-primary-paypal-payouts-fallback)).
- **Not covered:** external support links where the law allows ([§7.6](#76-creators-no-rail-covers)).

### 12.3 Other providers researched (for the record, not recommended)

Payoneer (bans gifts and religious resources), Airwallex (charities, religious organizations, live streaming and payouts for others all need approval), Tipalti ($249/month minimum), Rapyd ($5,000/month minimum), dLocal, Thunes and Nium (enterprise, sales-led), Hyperwallet (PayPal's enterprise payouts; coverage and nonprofit eligibility **Unverified**), Tremendous (6% to the recipient), merchants of record (Paddle, Dodo, Creem: ban donations), and anything on Stripe (never, [T2](decisions.md#t2-billing-provider)). Details in [§7.3](#73-payout-rails-compared).

### 12.4 What each partner covers, costs, and needs

| Partner | Covers | Cost | Setup steps | Done by (never the owner) |
|---|---|---|---|---|
| **PayGood** | Collecting one-time and monthly gifts; refunds; card KYC | Card 2.9% + 30¢ from the gift; platform $0 (**confirm**) | Written approval of collecting for creators (or of the charitable model); foreign cards; dispute webhooks; settlement reports; payer screening | The organization talks to PayGood, signs and holds the merchant account |
| **Wise Business** | Paying creators (primary) | $31 once; from 0.23% per payout | Describe the model; written OK given its rule on transmitting for third parties; API access | The organization opens and funds it |
| **PayPal Payouts** | Paying creators (fallback) | $0 fixed; $0.25–$20 per payout; 4% FX if converting | Request Payouts access; PayPal's approval for a nonprofit paying uploaders | The organization opens and funds it |
| **Trolley** (later) | Hosted payee onboarding, tax forms and 1099s, wider wires | $2,399–5,997/yr + per payout | Quote; check gift and religion policy | The organization |
| **Creator-funds bank account** | Holds creators' money between settlement and payout; non-interest | Often $0–15/month | Open as a separate (trust or FBO, per the lawyer) account | The organization opens it; the owner has no access |
| **Apple App Review, Google Play policy** | Store approval of support outside in-app purchase | $0 | Written pre-clearance questions ([§8](#8-app-stores)) | Sent from the developer accounts, held by the organization |
| **US lawyer** (fintech, money transmission, nonprofit, sanctions, privacy) | Questions in [§14.1](#141-us-lawyer); creator agreement and supporter terms | Estimate $3,000–10,000 one-off (**Unverified**, get quotes) | Brief with this page; the first engagement forms the organization | The organization's founders or board engage, sign and pay |
| **Accountant / tax adviser** | Questions in [§14.2](#142-accountant-or-tax-adviser); chart of accounts; year-end forms | Estimate $1,000–5,000 one-off, then yearly (**Unverified**) | Brief with this page | The organization engages |
| **Scholar (mufti)** | Questions in [§14.3](#143-scholar-mufti) | Often an honorarium (**Unverified**) | Send the questions | The organization chooses the scholar and accepts the ruling |
| **Waqf / nonprofit organization** | Holds the platform; the merchant at PayGood; holds creators' money in trust; licenses the code from the owner | Per the lawyer engagement: state nonprofit filing (often under $150) and, if it seeks 501(c)(3), IRS Form 1023 ($600) or 1023-EZ ($275) (**Unverified**) | Form and structure chosen with the lawyer ([MEM-D11](#15-owner-decisions)) | Its founders form it, appoint its board, officers and finance list; the owner is not a signatory |
| **Registered agent** | Legal address | About $50–300/yr (**Unverified**) | — | The organization |
| **Operating bank account** | Pays vendors; never holds creators' money | Often $0–15/month | — | The organization; the owner has no access |
| **Insurance** | General liability, cyber/privacy, tech E&O plus media liability, crime/fidelity (now that it holds others' money) | About $500–5,000/yr each (**Unverified**) | Broker quotes | The organization |
| **Bookkeeping** | The organization's books and the creator-funds liability | Free to $30/month tools | — | The organization |
| **DMCA designated agent** | Safe harbour for user content | $6 ([DMCA directory](https://www.copyright.gov/dmca-directory/)) | — | The organization |

**The agent never signs in anywhere as the owner or the organization and never creates vendor accounts.** Every row in the last column is the organization's, done by people it authorises; none is the owner's.

## 13. Build order

The whole design is specified; this is the order to build it, not a cut in scope.

1. **Organization, professionals and vendor approvals first** (no code waits on them except going live): the waqf / nonprofit organization through the lawyer engagement; the lawyer's structure choice ([§4.1](#41-money-transmission-the-organization-now-touches-the-money)); accountant; scholar; **PayGood's written approval** of collecting for creators; **Wise's and PayPal's written approval** of paying them; Apple and Google pre-clearance (MEM-1).
2. **Server foundation:** `SupportCollector` and `PayoutRail` interfaces with test implementations for QA and local only, the data model and ledger, webhook route and jobs, reconciliation, Errors and Jobs pages, the `creatorSupport` switch and server checks, the Countries table seeded with sanctions blocks, and the end-to-end tests on the local stack (MEM-2 to MEM-5, MEM-21, MEM-22).
3. **Payouts:** payee onboarding, the hold, threshold, batch, approval and send jobs against the test rail (MEM-22, MEM-23).
4. **Web:** Studio › Support (payee setup, balance, payouts), the support sheet with the breakdown, Settings › Support, emails (MEM-6, MEM-7, MEM-9).
5. **Admin Support pages**, including Payouts, Ledger and the finance list (MEM-8).
6. **Vendors:** the PayGood collecting adapter on the organization's merchant (MEM-10), then the Wise and PayPal Payouts rail adapters against their sandboxes (MEM-11).
7. **Legal pages and help** (MEM-16, MEM-17).
8. **Apps:** Core, then Apple, Android, Desktop/Tizen, after the store answers (MEM-12 to MEM-15).
9. **External support links** (MEM-18), then the **charity route** (MEM-19).
10. **First live run** on production, only once the organization exists and every approval in step 1 is in writing: a channel the organization holds, one real gift from a supporter it names, the hold shortened by an organization approver for this test only, a real payout through Wise to the organization's own payee, then the reconciliation. The owner's own channel and accounts are never the payee, the approver or the refunder. Then the switch stays off until the organization decides to turn it on.

**Perks** ([§10](#10-optional-paid-perks-designed-not-scheduled), MEM-20) are not in this order.

Visual stories go through the frames → audit → gallery → owner path. Non-visual PRs merge when green. Tests never use real money or real vendors: the QA and local stack use the test collector and test rail only ([No paid AI or spend in tests](../guides/testing.md)).

## 14. Questions for a lawyer, an accountant and a scholar

**The lawyer letter** (dated 2026-11-22, kept with the owner's legal papers, not in this wiki) carries these questions to counsel. Where they map: §14.1 questions 1–5 and 8 → the letter's section 3 (payments and creator support) and section 2, items 11–13 (PayGood, gaps, separation); question 11 → section 1 (the organization, the waqf and the owner's role); questions 9 and 12 → sections 9 (privacy) and 12 (sanctions); §14.2 → the accountant, referred from section 2 and section 3, item 5. The letter still describes revision 1 (gifts straight to creators through PayGood); the paragraphs to change are listed in the revision 2 pull request.

### 14.1 US lawyer

1. PayGood now only collects, into the organization's own merchant account, and the organization pays creators through a payout rail. Which structure keeps the organization out of money transmission under FinCEN and the target states: the charitable model (restricted donation, then a grant), the organization as the creator's collection agent, funds held FBO creators at a licensed payout rail, or another ([§4.1](#41-money-transmission-the-organization-now-touches-the-money))? Do agent-of-payee exemptions reach a gift with nothing in return?
2. Under the charitable model: may a 501(c)(3) or waqf pass supporter gifts to named individual creators? What grant procedures, board approvals, records and private-benefit limits apply, and can such gifts be deductible?
3. PayGood's acceptable-use policy forbids "third party" payments. Does collecting for creators breach it? What written permission or contract change do we need ([§12.1](#121-paygood-collecting-only))?
4. Holding money: must the creator-funds account be a trust or FBO account? What happens to it if the organization fails, is sued or is wound up? Which state unclaimed-property (escheat) rules reach dormant creator balances, and after how long?
5. The payout rail's contract: liability for failed or wrong payouts, funding, negative balances, termination, sanctions holds.
6. Are recurring voluntary gifts covered by ROSCA, California's automatic renewal law, New York GBL 527-a or other state laws? Is our flow ([§2.2](#22-stopping-reminders-and-refunds), [§4.5](#45-consumer-law)) enough?
7. EU and UK: is a supporter-to-creator gift a consumer contract? Does the 14-day right or the UK subscription regime apply? What changes with perks?
8. Sanctions and AML: which regions must we block (Cuba, Iran, North Korea, Crimea/DNR/LNR; Russia, Belarus?); the post-2025 Syria position; is the rail's payee screening plus PayGood's payer screening enough, or must the organization screen too? What AML and terrorist-financing programme must the organization run now that it holds and pays money? Material-support exposure (18 U.S.C. § 2339B) if a payout reaches a designated person?
9. Minors: age floors to support and to receive; COPPA; state child-influencer laws; guardian-held payout accounts.
10. Draft or review the creator agreement and supporter terms ([§4.8](#48-terms)): agency or donation wording, hold, threshold, fees, negative balances, unclaimed money, notice periods, governing law, disputes.
11. The waqf / nonprofit form (nonprofit corporation, charitable trust or another waqf structure), state, tax-exempt route, insurance and BOI status; the code licence from the owner to the organization; how to keep the owner, a tech employee, out of every money flow, signature and payout approval ([§9.6](#96-admin-pages-videos-admin--support)).
12. GDPR: is a supporter relationship with an Islamic creator special-category data? Do we need a DPIA? Transfer mechanism, now that payee data goes to a payout rail?
13. Wording: any charitable-solicitation registration risk from "sadaqa", "zakat", "donation" or "support", on the support route and the charity route?
14. The external support link ([§7.5](#76-creators-no-rail-covers)): any liability for linking to third-party payment pages?

### 14.2 Accountant or tax adviser

1. Are pure gifts outside VAT/GST in the EU, UK and each target country (Saudi Arabia, UAE, Egypt, India, Indonesia, Malaysia, Nigeria, Turkey, Pakistan, Bangladesh, Canada, Australia)? Does it change because the organization now collects them? What happens if any perk is added?
2. With perks: does EU Art. 9a (or the UK equivalent) make us the deemed supplier at 0%? Which registrations would we need?
3. US: are we a marketplace facilitator anywhere for gifts, or for future perks?
4. Are we now a reporting platform operator under DAC7, UK digital platform reporting, Canada Part XX or Australia's regime, since we collect and pay out? If yes, where do we register?
5. Which US information returns does the organization file for creators: 1099-NEC, 1099-MISC, 1099-K (as a third-party settlement organization) or 1042-S? Backup withholding? Can the payout rail's tax module file them for us?
6. Any withholding on payouts to non-US creators? How is gift-like income sourced?
7. How does the organization book creator money: as funds held for others (a liability) or as restricted contributions and grants? Effect on Form 990, public-support tests and audits.
8. The chart of accounts for the ledger and the daily three-way reconciliation ([§9.3](#93-data-model-search-d1-admin-api-owned-migrations)); which controls (two-person approval, segregation of duties) a nonprofit auditor will expect.
9. What may we tell creators about their tax without giving advice? US "no tax on tips" eligibility for creator support?
10. Our own tax and funding with 0% revenue; who pays the payout rail's fixed costs ([§5.3](#53-fixed-costs-against-the-500month-cap)).
11. How long must we keep the payment, ledger and payout records (US and EU)?

### 14.3 Scholar (mufti)

1. The organization receives each gift into its account and pays the creator later through a payout rail. If the creator appoints the organization as their agent (wakil), is the gift complete (qabd) on receipt by the organization? If instead the organization acts for the supporter, or treats the gift as a donation to itself and then gives a grant, what changes for refunds, for the hold before payout, and for a supporter or creator who dies before payout?
2. Is monthly support a series of separate gifts under a standing instruction? Is the supporter bound by the promise religiously, legally or not at all? Is "stop any time, no penalty" required or only recommended?
3. We take nothing. Is there any issue with PayGood's fee and the payout rail's fee being deducted from the gift, versus the supporter adding them on top ("cover the fees")?
4. Money waits in a non-interest account for at least the hold. PayGood, the rail or the bank may earn interest on balances in transit, though we earn nothing. Is that a concern?
5. May we accept credit cards, given AAOIFI SS 2 and OIC Fiqh Academy 108 differ? Should we warn, or limit methods?
6. Is currency conversion by the payout rail at its rate on the payout day valid sarf, given the creator's money was held in USD for weeks first?
7. Which acknowledgements keep it a pure gift: a private thank-you note, a supporter count, the supporter's name shown to the creator, a public supporter list, a badge? Where does it become a gift for compensation?
8. Are free giveaways to supporters permissible? Any random element if only supporters may enter?
9. Which channels may receive support: must we block channels whose content is disputed (for example music with instruments), and which view should the policy follow?
10. For registered-charity creators: what review is needed before tagging a campaign "zakat-eligible"? Who is the 'amil now that the organization holds the money? How should zakat and sadaqa be kept apart?
11. Is "support is a gift and isn't refundable except with the creator's agreement or by law" correct? May an admin refund on its own judgment for fraud or error, and may a chargeback the bank imposes after payout be taken from the creator's future gifts?
12. Unclaimed money: if a creator never sets up payouts or cannot be found, what should happen to their gifts (return to supporters, hold, give to charity), within what the law allows?
13. With perks: are member-only posts and videos a valid hire (ijara) given they are recurring and partly unknown in advance?

## 15. Owner decisions

Each decision has named options; the recommendation is first. Revision 2 (2026-11-22) withdrew MEM-D1 and MEM-D16 and added MEM-D17 to MEM-D24.

| ID | Decision | Options (recommended first) |
|---|---|---|
| MEM-D1 | ~~How we act for each creator's PayGood merchant~~ | **Withdrawn 2026-11-22:** PayGood no longer pays creators; the organization is the one merchant ([O42](decisions.md#o42-paygood-collects-only-creators-paid-through-a-separate-payout-rail)). |
| MEM-D2 | Creators the payout rails can't reach (Iraq, Palestine, Somalia, Sudan, Afghanistan, Syria; Lebanon in practice) | **"Creator's own support link where the law allows; no gifts collected for them"** (admin-reviewed, switch `supportExternalLinks`) · "Add Iraq and Palestine by Trolley or bank wire after a legal review" · "Not available" |
| MEM-D3 | Who pays the PayGood fee | **"Creator absorbs, supporter may cover"** (checkbox shown, unticked) · "Supporter always covers" · "Creator always absorbs, no checkbox" |
| MEM-D4 | Minimum and presets | **"$3 minimum; presets $5, $10, $25"** · "$1 minimum; presets $3, $5, $10" |
| MEM-D5 | Who may receive | **"A tier capability, owner 18+, channel in good standing, payee active"** (admins tick "Can receive support" per tier) · "Every channel owner 18+" |
| MEM-D6 | Supporter visibility | **"Private to the creator; supporter may hide their name"** · "Supporter count shown publicly on the channel" · "Public supporter list" (risks Apple 3.2.1(vii) and GDPR special-category data) |
| MEM-D7 | Messages with support | **"Allowed, private to the creator, moderated"** · "No messages" |
| MEM-D8 | Refund policy | **"Gift, not refundable; 7-day mistake window with the creator's agreement; the organization refunds fraud and errors"** · "Creator decides alone" · "Refund on request within 14 days" |
| MEM-D9 | Ages | **"18+ to support and to receive"** · "16+ to support with a guardian's confirmation" |
| MEM-D10 | Payment methods | **"Cards, debit, wallets and bank transfer; never BNPL or instalments"** (pending the scholar) · "Debit and bank transfer only" |
| MEM-D11 | Legal entity | **"Per the lawyer engagement: the waqf / nonprofit organization"** (owner direction 2026-11-22; form and state chosen with the lawyer). Until it exists, creator support stays switched off. The owner never holds, signs for, approves or receives money. |
| MEM-D12 | Charity route | **"Separate route behind `charityDonations`; zakat tag only after review"** · "No charity route" |
| MEM-D13 | Perks | **"Designed, switch stays off"** ([§10](#10-optional-paid-perks-designed-not-scheduled)) · "Build perks after support" |
| MEM-D14 | Business costs and the $500 cap (no default; owner decides) | Numbers from [§12.4](#124-what-each-partner-covers-costs-and-needs), all **Unverified** estimates. **One-off:** lawyer $3,000–10,000, accountant $1,000–5,000, formation under $150 plus $275–600 if seeking 501(c)(3), Wise $31, DMCA agent $6: about **$4,300–15,850**. **Yearly:** insurance $500–5,000 for each of 4 policies (now with crime/fidelity cover), registered agent $50–300: about **$2,050–20,300**, i.e. **$170–1,690/month**. **Monthly tools:** two bank accounts $0–30, bookkeeping $0–30. Recurring total about **$170–1,750/month**; Trolley would add $200–500/month. Options: "Outside the infrastructure cap" (as [S3](AUN-SUBS-subscriptions-plan.md)) · "Inside the cap" (the upper end alone exceeds $500/month) |
| MEM-D15 | When apps get the button | **"After written Apple and Google answers"** · "Web only for now" |
| MEM-D16 | ~~Disputes and payouts PayGood's API doesn't expose~~ | **Withdrawn 2026-11-22:** the organization is the merchant and answers disputes in PayGood ([§2.3](#23-chargebacks-disputes-and-fraud)); payouts go through the rail. |
| MEM-D17 | Payout rail | **"Wise Business primary, PayPal Payouts fallback; Trolley when volume pays for it"** ([§7.5](#75-recommendation-wise-primary-paypal-payouts-fallback)) · "Trolley from the start" ($2,399–5,997/yr: hosted onboarding, tax forms, Iraq and Palestine) · "PayPal Payouts only" (no Egypt, Pakistan, Bangladesh, Nigeria) · "Own bank wires only" ($25–50 each) |
| MEM-D18 | Hold before a gift is available | **"30 days"** (covers most card disputes raised early; inside the platforms' 7–55-day range) · "14 days" · "60 days" |
| MEM-D19 | Payout threshold and schedule | **"$25 (or the rail's minimum), monthly on the 15th; creator may raise their own threshold"** · "$10 monthly" · "$50 monthly" |
| MEM-D20 | Who bears payout and FX fees | **"The creator, from the payout, shown before payout day"** · "The organization, from its own funds" (costs money it doesn't have) · "Supporter's 'cover the fees' also covers an estimated payout fee" |
| MEM-D21 | Chargebacks after a payout | **"Creator's balance goes negative and nets against future gifts; the organization writes off only what is unrecoverable, reported to its board"** · "Hold a 10% reserve from each payout for 90 days" · "The organization absorbs them" |
| MEM-D22 | Unclaimed or dormant balances | **"Per the state unclaimed-property rule the lawyer sets; reminders at 3, 6 and 12 months; never the organization's income"** (scholar asked about returning to supporters or giving to charity) · "Refund to supporters after 12 months" |
| MEM-D23 | Gifts before the creator's payee is active | **"Not allowed: the Support button shows only once the payee is active"** · "Allowed; money waits in the balance" (setting "Collect before payout setup") |
| MEM-D24 | Who approves payout batches and ledger adjustments | **"Two people on the organization's finance list: one prepares, one approves; never the owner or any tech staff"** · "One finance-list approver" |

What doesn't need the owner and is decided here: 0% to the platform; PayGood collects only; creators' money in a separate non-interest account held by the organization, never the owner; hosted checkout only; the ledger as the source of truth with daily three-way reconciliation; idempotent payouts; no public perks; queues with retry, DLQ and Errors with Retry; per-country, per-payee and emergency stops; the switch default off until the organization exists.

## 16. Stories

| ID | Linear | Story | Repo | Kind |
|---|---|---|---|---|
| MEM-1 | [AUN-613](https://linear.app/hamzalabs/issue/AUN-613) | Organization, professional and vendor answers before going live: PayGood, Wise and PayPal written approvals (§12, §14, §15) | AlUmmahNowWiki | owner |
| MEM-2 | [AUN-614](https://linear.app/hamzalabs/issue/AUN-614) | SupportCollector and PayoutRail interfaces, test implementations and fee quotes (§9.2, §5.4) | AlUmmahNow | non-visual |
| MEM-3 | [AUN-615](https://linear.app/hamzalabs/issue/AUN-615) | Support data model, double-entry ledger and vendor-event log (§9.3) | AlUmmahNow | non-visual |
| MEM-4 | [AUN-616](https://linear.app/hamzalabs/issue/AUN-616) | Support webhooks, jobs and three-way reconciliation (§9.4) | AlUmmahNow | non-visual |
| MEM-5 | [AUN-617](https://linear.app/hamzalabs/issue/AUN-617) | Support switches, country rules and server checks (§9.5, §9.7, §4.3) | AlUmmahNow | non-visual |
| MEM-6 | [AUN-618](https://linear.app/hamzalabs/issue/AUN-618) | Studio › Support: payee setup, balance, payouts and records (§2.4, §11.5) | AlUmmahNow | visual |
| MEM-7 | [AUN-619](https://linear.app/hamzalabs/issue/AUN-619) | Support sheet, breakdown, checkout and Settings › Support (§2.1, §2.2, §5.4, §11) | AlUmmahNow | visual |
| MEM-8 | [AUN-620](https://linear.app/hamzalabs/issue/AUN-620) | Videos admin › Support pages, including Payouts, Ledger and the finance list (§9.6) | AlUmmahNow | visual |
| MEM-9 | [AUN-621](https://linear.app/hamzalabs/issue/AUN-621) | Support and payout emails and notifications (§2.2, §2.6) | AlUmmahNow | visual |
| MEM-10 | [AUN-622](https://linear.app/hamzalabs/issue/AUN-622) | PayGood collecting adapter on the organization's merchant (§12.1) | AlUmmahNow | non-visual |
| MEM-11 | [AUN-623](https://linear.app/hamzalabs/issue/AUN-623) | Payout rail adapters: Wise (primary) and PayPal Payouts (fallback) (§7.5, §9.2) | AlUmmahNow | non-visual |
| MEM-12 | [AUN-624](https://linear.app/hamzalabs/issue/AUN-624) | Core: support API and features keys (§9.5) | AlUmmahNowCore | non-visual |
| MEM-13 | [AUN-625](https://linear.app/hamzalabs/issue/AUN-625) | Apple apps: Support on the channel page (§8) | AlUmmahNowApple | visual |
| MEM-14 | [AUN-626](https://linear.app/hamzalabs/issue/AUN-626) | Android apps: Support on the channel page (§8) | AlUmmahNowAndroid | visual |
| MEM-15 | [AUN-627](https://linear.app/hamzalabs/issue/AUN-627) | Desktop and Tizen: Support on the channel page (§8) | AlUmmahNowDesktop | visual |
| MEM-16 | [AUN-628](https://linear.app/hamzalabs/issue/AUN-628) | Creator agreement, supporter terms and privacy notice (§4.8) | AlUmmahNowUI | visual |
| MEM-17 | [AUN-629](https://linear.app/hamzalabs/issue/AUN-629) | Help pages, wiki and alummahnow.dev entry (§11) | AlUmmahNowWiki | non-visual |
| MEM-18 | [AUN-630](https://linear.app/hamzalabs/issue/AUN-630) | External support links for countries no rail covers (§7.6) | AlUmmahNow | visual |
| MEM-19 | [AUN-631](https://linear.app/hamzalabs/issue/AUN-631) | Charity route for registered charities (§3.7) | AlUmmahNow | visual |
| MEM-20 | [AUN-632](https://linear.app/hamzalabs/issue/AUN-632) | Optional paid perks (designed, not scheduled) (§10) | AlUmmahNow | visual |
| MEM-21 | [AUN-633](https://linear.app/hamzalabs/issue/AUN-633) | Support tests on the local stack, including payouts (§13) | AlUmmahNow | non-visual |
| MEM-22 | [AUN-635](https://linear.app/hamzalabs/issue/AUN-635) | Payee onboarding: bank details straight to the rail, tax forms (W-9 / W-8BEN), payee screening (§2.4, §7.5, §6.3) | AlUmmahNow | non-visual |
| MEM-23 | [AUN-636](https://linear.app/hamzalabs/issue/AUN-636) | Payout jobs: hold, threshold, batch, approval, funding check, idempotent send, status and returns (§2.6, §9.4) | AlUmmahNow | non-visual |

MEM-20 (perks) stays in Backlog and is not in the [build order](#13-build-order).

## Build status

Building started 2026-11-22 on the owner's instruction: everything goes behind the `creatorSupport` switch ([AUN-FEATURES](AUN-FEATURES-feature-switches.md), registry entry in AlUmmahNow#1753), which stays off. Tests use only the test collector and the test rail. No live vendor adapter exists, and none is called.

| Story | PR | State |
|---|---|---|
| MEM-2 interfaces, test adapters, money rules | AlUmmahNow#1757 | merged 2026-11-22 |
| MEM-3 data model, ledger, settings, erasure | AlUmmahNow#1758 | merged 2026-11-22 |
| MEM-4 webhooks, jobs, reconciliation | AlUmmahNow#1761 | merged 2026-11-22 |
| MEM-23 payout batches: plan, approve, fund, send, status | AlUmmahNow#1763 | merged 2026-11-22; MEM-D21's reserve option is not built (AlUmmahNow#1762) |
| MEM-22 payee onboarding (hosted at the rail, tax form on file only) | AlUmmahNow#1764 | merged 2026-11-23 |
| Features switch wiring: `creatorSupport` read from the Features page, the turn-on precondition, routes in `FEATURE_ROUTES` | AlUmmahNow#1766 | merged 2026-11-23 |
| MEM-5 server checks: `support` and `supportReceive` in `/api/me/features` (countries, apps, payee state, pauses, decisions) | AlUmmahNow#1772 | merged 2026-11-23 |
| MEM-8 admin API: the finance list (two-person, never tech staff), decisions, organization formed, holds, payout batches, countries; step-up and audit | AlUmmahNow#1773 | merged 2026-11-23 |
| MEM-7 server: the support sheet, breakdown, hosted checkout, monthly consent, Settings › Support (stop at any time) | AlUmmahNow#1774 | merged 2026-11-23 |
| MEM-21 local-stack E2E: onboarding, one-time and monthly gifts, stop, feature_off when off | AlUmmahNow#1775 | merged 2026-11-23 |

**Open owner decisions are settings, not code.** Each one is a field of `SupportPolicy` (shared-types `support.ts`). It starts as *undecided* (null) and is never defaulted. `creatorSupport` can't be switched on while any of them is open (`supportCanTurnOnHook`, the Features page precondition). Code that depends on an open decision refuses with `decision_open` rather than guessing.

| Decision | Setting | Code it touches |
|---|---|---|
| MEM-D17 payout rail | `primaryRail`, `fallbackRail` | api-videos `lib/support/adapters.ts` `railForPayee`; `payees.ts` (onboarding refused while open); `supportReadiness` (a rail must be available); `payouts.ts` refuses to plan while open |
| MEM-D18 hold | `holdDays` | `lib/support/events.ts`: `available_at` stays empty while it is open; `releaseDueGifts` |
| MEM-D19 threshold and schedule | `payoutThresholdUsdMinor`, `payoutDayOfMonth`, `creatorMayRaiseThreshold` | `lib/support/payouts.ts` `planBatch`; `jobs.ts` `queueSupportCron` (the payout day); `support_settings.payout_threshold` |
| MEM-D20 payout and FX fees | `payoutFeeBearer` | `lib/support/ledger.ts` `payoutPaidLines`; `events.ts` `applyRailEvents` |
| MEM-D21 chargebacks after a payout | `negativeBalancePolicy` (+ `reserveBasisPoints`, `reserveDays`) | `lib/support/ledger.ts` `debitCreator` (refunds, disputes) |
| MEM-D22 dormant balances | `dormantPolicy`, `dormantReminderMonths` | `lib/support/jobs.ts` `runSupportDormantJob` (only lists the balances while the decision is open) |
| MEM-D23 gifts before the payee is active | `collectBeforePayeeActive` | `lib/support/eligibility.ts` `receiverEligibility` |
| MEM-D24 approvers | `batchApprovers`, `adjustmentApprovers` | `supportReadiness` (finance list size); `lib/support/payouts.ts` `approveBatch`; ledger adjustments (not built yet) |

Two more open decisions became settings with MEM-5:
- MEM-D5 (who may receive): `receiversRule`, with `CreatorTier.supportReceive`.
- MEM-D15 (the apps): `appsEnabled`.

Both are read in `lib/support/eligibility.ts`. MEM-D3, D4 and D9 are settings the same way (`collectorFeePayer`, `minimumUsdMinor` / `presetsUsdMinor`, `minSupporterAge` / `minCreatorAge`).

## Status evidence

- 2026-11-22: spec written (revision 1) with Linear epic AUN-612 and stories AUN-613 to AUN-633.
- 2026-11-22: revision 2 after the owner's "we will not use paygood to pay creators": PayGood collects only; payouts through Wise (primary) and PayPal Payouts (fallback); research on how YouTube, Patreon, Ko-fi, Buy Me a Coffee, Twitch, Substack and LaunchGood pay creators, and on ten payout rails, all accessed 2026-11-22 and cited inline; stories MEM-22 and MEM-23 added. Sources whose sites refuse automated link checks are written as plain-text URLs. No code yet.
- 2026-11-22: build started behind the switch (off everywhere): AlUmmahNow#1757 (MEM-2, merged), AlUmmahNow#1758 (MEM-3), AlUmmahNow#1761 (MEM-4), AlUmmahNow#1763 (MEM-23) and AlUmmahNow#1764 (MEM-22) merged.
- 2026-11-23: AlUmmahNow#1772 (MEM-5), #1773 (MEM-8), #1774 (MEM-7, server side) and #1775 (MEM-21, local-stack E2E) merged. The server side of creator support is complete behind the switch, which stays off. Still to do:
  - the visual stories: Studio › Support, the support sheet, Settings › Support, the admin Support pages and emails;
  - the MEM-D21 reserve option (AlUmmahNow#1762);
  - the ledger adjustments, refund and dispute admin endpoints;
  - the real vendor adapters (MEM-10 and MEM-11). These are held until the owner's decisions are in.
- 2026-11-23: AlUmmahNow#1766 merged. `creatorSupport` now reads the Features page switch, which is off and fails closed. The Features page refuses to turn it on (409 `feature_precondition`) until the organization is recorded as formed, the finance list has MEM-D24's approvers, every owner decision is recorded, and a collector and the chosen payout rail exist. The test collector and test rail exist only on QA and the local stack.
