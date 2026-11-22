[← Epics](README.md) · [Home](../README.md)

# Decision log

Owner decisions that shape the epics, with their status and what each one blocks. Status values: **decided**, **pending** (waiting on the owner), **open** (only a recommendation exists so far), **deferred**, **rejected**.

IDs come from the source documents. Where two documents reuse an ID, the second one gets a prefix (see the note on `EMB-`).

| ID | Decision | Status | Date | Blocks |
|---|---|---|---|---|
| [D1](decisions.md#d1-app-stack) | App stack | **decided** | 2026-11-08 | Epics 11–19, 23, 30 |
| [D2](decisions.md#d2-video-delivery) | Video delivery | **decided** | 2026-11-10 | Was blocking 9.6 (R2 adapter), Epic 14 (downloads), D3 and through it Epics 17, 18.7 and 19.7, D11, and E4 (embed delivery cost). All unblocked now; the migration itself is AlUmmahNow#687. |
| [D3](decisions.md#d3-live-provider) | Live provider | **pending** | 2026-11-10 | Epic 17, 18.7, 19.7, 29.17 chat, 28.12, live-streaming Phase 2 |
| [D4](decisions.md#d4-monetisation) | Monetisation | **decided** | 2026-11-08 | Epic 24, 27.6 provider management, 27.7, P1 |
| [D5](decisions.md#d5-kids-content-policy) | Kids content policy | **open** | 2026-11-08 | Epic 20 |
| [D6](decisions.md#d6-fonts) | Fonts | **open** | 2026-11-08 | 10.2, 30.6 |
| [D7](decisions.md#d7-prayer-time-data) | Prayer-time data | **open** | 2026-11-08 | 21.1 |
| [D8](decisions.md#d8-brand-naming) | Brand naming | **open** | 2026-11-08 | Epics 10, 12, 15, 20 |
| [D9](decisions.md#d9-linux-ui-toolkit-for-c) | Linux UI toolkit for C# | **decided** | 2026-11-08 | Epics 16, 19 (Linux) |
| [D10](decisions.md#d10-transcription-location) | Transcription location | **decided** | 2026-11-14 | 18.9, 19.4, 30.4, 28.7 |
| [D11](decisions.md#d11-who-encodes-renditions) | Who encodes renditions | **decided** | 2026-11-14 | 19.3 |
| [T1](decisions.md#t1-plans-are-admin-managed) | Plans are admin-managed | **decided** | 2026-11-07 | Epic 27, every tiered feature |
| [T2](decisions.md#t2-billing-provider) | Billing provider | **decided** | 2026-11-07 | 27.7, Epic 24 |
| [P1](decisions.md#p1-first-paid-providers) | First paid providers | **decided** | 2026-11-19 | 27.7 |
| [QF1](decisions.md#qf1-quran-foundation-content-use) | Quran Foundation content use (QF's answers 2026-11-21 and 2026-11-22; the derived index is never used for ML training or evaluation) | **decided** | 2026-11-22 | AUN-CAPTIONS, TOOLS-ADMIN, DISCOVERY, any feature that shows Quran text |
| [AUN-SUBS](AUN-SUBS-subscriptions-plan.md) | Site-wide subscriptions plan (decisions S1–S18) | **pending** | 2026-11-11 | Epic 27, Epic 24, every tiered feature, P1 |
| [AUN-ADMIN-NATIVE](AUN-ADMIN-NATIVE-native-admin-app.md) | Native admin app (decisions AD1–AD14) | **decided** | 2026-11-13 | AUN-ADMIN-NATIVE build (held until the owner says go) |
| [AUN-MULTI-AUDIO](AUN-MULTI-AUDIO-multiple-audio-tracks.md) | Multiple audio tracks (decisions MA1–MA10: demuxed HLS alternate audio from R2, tier limit per video, review of each track) | **decided** | 2026-11-14 | AUN-MULTI-AUDIO build |
| [AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md) | Passkeys everywhere, required for staff (from AD6; PK1–PK8 built to recommendation, owner may change) | **built to recommendation** | 2026-11-13 | AUTH-PASSKEYS, AUN-ADMIN-NATIVE step 0b |
| [E1](decisions.md#e1-embed-host-domain) | Embed host domain | **deferred** | 2026-11-07 | 25.4 |
| [E2](decisions.md#e2-default-thread-scope) | Default thread scope | **open** | 2026-11-07 | 26.4 |
| [E3](decisions.md#e3-guest-commenting) | Guest commenting | **open** | 2026-11-07 | 26 |
| [E4](decisions.md#e4-delivery-cost-for-embeds) | Delivery cost for embeds | **open** | 2026-11-07 | 25.9 |
| [EMB-D1](decisions.md#emb-d1-embeds-on-the-videos-host) | Embeds on the videos host | **decided** | 2026-11-07 | 25.4 |
| [EMB-D10](decisions.md#emb-d10-discussions-v1-read-only) | Discussions v1 read-only | **decided** | 2026-11-07 | Epic 26 |
| [EMB-D11](decisions.md#emb-d11-no-signed-in-embeds-in-v1) | No signed-in embeds in v1 | **decided** | 2026-11-07 | 26 |
| [EMB-D12](decisions.md#emb-d12-embeds-consult-no-entitlement-in-v1) | Embeds consult no entitlement in v1 | **decided** | 2026-11-07 | 25.6, 27 |
| [Q27-1](decisions.md#q27-1-epic-27-is-plumbing-only) | Epic 27 is plumbing only | **decided** | 2026-11-08 | 27 |
| [Q27-2](decisions.md#q27-2-available-on-plan-is-plain-text) | "Available on {plan}" is plain text | **decided** | 2026-11-08 | 27 UI |
| [Q27-3](decisions.md#q27-3-who-manages-plans) | Who manages plans | **decided** | 2026-11-08 | 27.6 |
| [Q27-4](decisions.md#q27-4-free-has-real-limits) | Free has real limits | **decided** | 2026-11-08 | 27.4 |
| [M1](decisions.md#m1-extension-classifier-model) | Extension classifier model | **open** | 2026-11-07 | Epic 28 |
| [M2](decisions.md#m2-auto-hide-scope) | Auto-hide scope | **open** | 2026-11-07 | Epic 28 |
| [M3](decisions.md#m3-religious_authenticity-flags) | `religious_authenticity` flags | **open** | 2026-11-07 | Epic 28 |
| [M4](decisions.md#m4-csam-coverage-for-r2-served-media) | CSAM coverage for R2-served media | **open** | 2026-11-07 | Epic 28 |
| [M5](decisions.md#m5-reviewer-staffing--slas) | Reviewer staffing & SLAs | **open** | 2026-11-07 | Epic 28 |
| [M6](decisions.md#m6-transparency-reporting) | Transparency reporting | **open** | 2026-11-07 | Epic 28 |
| [SM-1](decisions.md#sm-1-network-priority) | Network priority | **decided** | 2026-11-09 | Social media management |
| [SM-2](decisions.md#sm-2-x-link-post-cost) | X link-post cost | **decided** | 2026-11-09 | Social media management |
| [SM-3](decisions.md#sm-3-default-for-auto-posts) | Default for auto-posts | **decided** | 2026-11-09 | Social media management |
| [SM-4](decisions.md#sm-4-legal-entity) | Legal entity | **decided** | 2026-11-09 | Social media management |
| [SM-5](decisions.md#sm-5-async-work-and-errors-standing-rule) | Async work and errors (standing rule) | **decided** | 2026-11-09 | Social media management |
| [SM-6](decisions.md#sm-6-register-a-business-for-meta) | Register a business for Meta? | **decided** | 2026-11-14 | Social media management |
| [O1](decisions.md#o1-whole-platform-cost-cap) | Whole-platform cost cap | **decided** | 2026-11-07 | D2, every epic's infrastructure |
| [O2](decisions.md#o2-native-apps-viewer-and-studio) | Native apps, viewer and Studio | **decided** | 2026-11-07 | Epics 9–24 |
| [O3](decisions.md#o3-embeds-comments-widget-everything-tiered) | Embeds, comments widget, everything tiered | **decided** | 2026-11-07 | Epics 25–27 |
| [O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans) | Pluggable payment providers, never Stripe, admin-managed plans | **decided** | 2026-11-07 | Epics 24, 27 |
| [O5](decisions.md#o5-ai-moderation-on-cloudflare) | AI moderation on Cloudflare | **decided** | 2026-11-07 | Epic 28 |
| [O6](decisions.md#o6-core-web-completion-epic) | Core web completion epic | **decided** | 2026-11-07 | Epic 29 |
| [O7](decisions.md#o7-start-sprint-a) | Start Sprint A | **decided** | 2026-11-07 | Epic 29 |
| [O8](decisions.md#o8-bunny-token-signing) | Bunny token signing | **decided** | 2026-11-07 | 9.6, Bunny delivery until the R2 move |
| [O9](decisions.md#o9-findings-are-actioned-at-once) | Findings are actioned at once | **decided** | 2026-11-07 | All work |
| [O10](decisions.md#o10-stage-slot-before-production-spec--plan--implement) | Stage slot before production; spec → plan → implement | **decided** | 2026-11-08 | Release pipeline |
| [O11](decisions.md#o11-production-only-from-tags-on-main) | Production only from tags on main | **decided** | 2026-11-08 | Release pipeline |
| [O12](decisions.md#o12-protect-main-merge-own-prs-when-green) | Protect main; merge own PRs when green | **decided** | 2026-11-08 | All repos |
| [O13](decisions.md#o13-signed-in-once-means-signed-in-everywhere) | Signed in once means signed in everywhere | **decided** | 2026-11-08 | Auth, all apps |
| [O14](decisions.md#o14-auth-is-a-separable-sso-provider) | Auth is a separable SSO provider | **decided** | 2026-11-09 | Identity platform, admin content |
| [O15](decisions.md#o15-account-is-only-a-redirect) | `account.*` is only a redirect | **decided** | 2026-11-09 | Account hub |
| [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership) | Channel roles separate from site roles; only super admins transfer ownership | **decided** | 2026-11-09 | Channel roles, claim/transfer |
| [O17](decisions.md#o17-super-admins-claim-and-assign-official-channels) | Super admins claim and assign official channels | **decided** | 2026-11-09 | Channel claim |
| [O18](decisions.md#o18-four-themes-fawanees-default) | Four themes, Fawanees default | **decided** | 2026-11-09 | Themes |
| [O19](decisions.md#o19-themes-in-the-native-apps-too) | Themes in the native apps too | **decided** | 2026-11-09 | Native themes |
| [O20](decisions.md#o20-buildable-theme-packages-in-admin) | Buildable theme packages in admin | **decided** | 2026-11-10 | Themes |
| [O21](decisions.md#o21-english-default-on-sign-in-and-profile) | English default on sign-in and profile | **decided** | 2026-11-09 | Auth, openauth, account hub |
| [O22](decisions.md#o22-cms-keeps-bknd-under-our-own-admin-screens) | CMS keeps bknd under our own admin screens | **decided** | 2026-11-09 | CMS admin UI |
| [O23](decisions.md#o23-www-is-the-ui-cms-its-admin-both-auth-clients) | www is the UI, CMS its admin; both auth clients | **decided** | 2026-11-08 | CMS/www |
| [O24](decisions.md#o24-cost-dashboard-per-channel-cost-later-opt-in-alerts) | Cost dashboard; per-channel cost later; opt-in alerts | **decided** | 2026-11-08 | Cost monitoring |
| [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers) | Invite-only uploads with admin-assigned creator tiers | **decided** | 2026-11-10 | Creator tiers, Epic 27 |
| [O26](decisions.md#o26-always-async-with-admin-visible-errors) | Always async, with admin-visible errors | **decided** | 2026-11-10 | All work |
| [O27](decisions.md#o27-one-short-rule) | One Short rule | **decided** | 2026-11-10 | Shorts |
| [O28](decisions.md#o28-home-timeline-in-weekly-kv-buckets) | Home timeline in weekly KV buckets | **decided** | 2026-11-10 | www home timeline |
| [O29](decisions.md#o29-keep-the-openauth-fork) | Keep the openauth fork | **decided** | 2026-11-07 | Auth |
| [O30](decisions.md#o30-social-media-answers) | Social media answers | **decided** | 2026-11-09 | Social media management |
| [O35](decisions.md#o35-arabic-uses-eastern-arabic-hindi-numerals) | Arabic uses Eastern Arabic (Hindi) numerals ٠–٩ everywhere | **decided** | 2026-11-15 | Every app and email; [Numbers and dates](../guides/numbers-and-dates.md) |
| [O37](decisions.md#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature) | Requests off and no payment provider: /upgrade is an off feature (404 feature_off, no entry points; the tier still shows in Settings) | **decided** | 2026-11-19 | [AUN-TIER-REQUESTS](AUN-TIER-REQUESTS-tier-requests.md), [AUN-SUBS](AUN-SUBS-subscriptions-plan.md) |
| [O38](decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000) | Numbers: Arabic never grouped («٤٨٨٧»); counts compact from 1,000, cut not rounded («٤٫٨ ألف», «١٫٢ م»); standalone «١٢ ألفًا»; Arabic separates values with «، »; replaces O35's «٬» and the «مليون» forms | **decided** | 2026-11-21 | Every app and email; [Numbers and dates](../guides/numbers-and-dates.md) |
| [O39](decisions.md#o39-one-features-page-server-enforced) | One Features page in the videos admin for every switchable feature; the server refuses an off feature (`feature_off`) and every client hides it; switches in the search D1, 30 s server bound, 2 min everywhere; admins change most, super admins only Uploads, Creating channels, Live and Caption download for viewers | **decided** | 2026-11-22 | [AUN-FEATURES](AUN-FEATURES-feature-switches.md) |
| [O40](decisions.md#o40-server-written-error-messages) | Server-written error messages: one envelope (`code`, localized `message`, `action`, `retryAfter`, `helpUrl`, `reference`) and one en/ar catalogue; unknown codes show the server's message; `feature_off` carries a message, shown once when an action still reaches an off feature (amends Hidden when off) | **decided** | 2026-11-22 | [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [Product rules](../guides/product-rules.md), every client |
| [LIC](decisions.md#lic-repo-licence-for-core-and-the-app-repos) | Repo licence for Core and the app repos | **open** | 2026-11-08 | Core 1.0, app repos |
| [GDPR](decisions.md#gdpr-gdpr-defaults-retention-consent) | GDPR defaults (retention, consent) | **open** | 2026-11-07 | Epic 1 story 1.3 |

## Native apps and platform (D-series, `docs/native-apps/EPICS.md` §9)

### D1: App stack

**Status:** decided · **Date:** 2026-11-08

Native everywhere: Swift (Apple incl. macOS), Kotlin (Android/TV), C# (Windows WinUI 3, Linux GTK 4, Tizen), shared Rust core, webOS as web. The owner overruled the earlier TypeScript/Tauri/.NET-Uno proposals (chat 2026-11-08 15:19 UTC, position 6381); recorded in PR #323.

**Blocks / affects:** Epics 11–19, 23, 30

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)

### D2: Video delivery

**Status:** decided · **Date:** 2026-11-10 · **Page:** [D2-video-delivery.md](D2-video-delivery.md)

**R2 + Cloudflare CDN.** Confirmed in writing by Cloudflare Support: HLS stored in R2 and served through a custom domain on our zone meets the CDN Service-Specific Terms on a self-serve plan (Workers Paid / Pro) while R2 is subscribed; no published usage level forces Enterprise. Whole-platform cost cap **≤ $500/month**. Cloudflare Stream ruled out. Details on the [D2 page](D2-video-delivery.md). Chat: the owner set the cap on 2026-11-07 02:09 UTC and pasted Cloudflare's written reply on 2026-11-10 16:55 UTC (positions 1216, 15208).

**Blocks / affects:** Was blocking 9.6 (R2 adapter), Epic 14 (downloads), D3 and through it Epics 17, 18.7 and 19.7, D11, and E4 (embed delivery cost). All unblocked now; the migration itself is AlUmmahNow#687.

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md); [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (merged 2026-11-10 as `f4cca7db`); [AlUmmahNow#687](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/687)

### D3: Live provider

**Status:** decided · **Date:** 2026-11-11 · **Page:** [D3-live-provider.md](D3-live-provider.md)

**Decided 2026-11-11:** both providers (Bunny Stream Live and self-hosted) ship to production together, new streams are assigned round-robin, and the choice is made on data. Built in [#867](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/867), [#871](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/871) and [#872](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/872). Earlier history: **unblocked** once D2 was decided. Recommendation: self-hosted RTMP/SRT ingest → HLS in the same R2 bucket (instead of Bunny Stream Live, which is in preview). **Owner decision pending.** Details on the [D3 page](D3-live-provider.md). Before the cost cap (2026-11-07 02:04 UTC) the assistant had called Bunny Stream Live the best fit.

**Blocks / affects:** Epic 17, 18.7, 19.7, 29.17 chat, 28.12, live-streaming Phase 2

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md); [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (merged 2026-11-10 as `f4cca7db`)

### D4: Monetisation

**Status:** decided · **Date:** 2026-11-08

None at launch. Payments parts of Epic 27 deferred.

**Blocks / affects:** Epic 24, 27.6 provider management, 27.7, P1

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md); [docs/specs/EPIC-27-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-27-PLAN.md)

### D5: Kids content policy

**Status:** open · **Date:** 2026-11-08

Recommendation: moderator-curated allow-list, age bands 3–6 and 7–12.

**Blocks / affects:** Epic 20

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)

### D6: Fonts

**Status:** open · **Date:** 2026-11-08

Tokens carry IBM Plex Sans Arabic + Plex and Noto Kufi Arabic + Inter (both OFL); active pair is `system` until the owner chooses.

**Blocks / affects:** 10.2, 30.6

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md); [docs/native-apps/EPIC-10-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPIC-10-PLAN.md); [AlUmmahNow#365](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/365)

### D7: Prayer-time data

**Status:** open · **Date:** 2026-11-08

Recommendation: on-device calculation (adhan-js).

**Blocks / affects:** 21.1

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)

### D8: Brand naming

**Status:** open · **Date:** 2026-11-08

Confirm "Lamahat", "Sakinah", "Ummah Kids", "Fanous" and Arabic forms. "Fanous" used for the token package meanwhile.

**Blocks / affects:** Epics 10, 12, 15, 20

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md); [AlUmmahNow#365](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/365)

### D9: Linux UI toolkit for C#

**Status:** decided · **Date:** 2026-11-08

GTK 4 + libadwaita via Gir.Core 0.8.1, not Avalonia: the Desktop CI spike found the editor (19.5) feasible with a small native shim. Decided by the spike's finding (2026-11-08 18:25 UTC); the owner didn't explicitly confirm.

**Blocks / affects:** Epics 16, 19 (Linux)

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md); [AlUmmahNowDesktop/docs/D9-FINDING.md](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/0bc3371825c4533b416d77293bf3a55e33e92c75/docs/D9-FINDING.md)

### D10: Transcription location

**Status:** decided · **Date:** 2026-11-14

**Decision (owner, 2026-11-14: "desktop decisions we do it", accepting the recommendation):** transcription runs on the server by default (Workers AI Whisper turbo plus the Quran layer). The desktop Studio also offers free on-device transcription (Core's whisper.cpp) as an option. Both produce the same caption draft, which the creator edits and publishes.

Earlier recommendation (2026-11-08): hybrid (on-device desktop and short mobile clips; server-side Workers AI for long uploads and web).

Evidence (2026-11-11, [AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md)):
- **Server:** Workers AI Whisper turbo costs $0.00051 per minute. Raw WER was 6% on Quran recitation and 13% on English.
- **Desktop:** Core's whisper.cpp turbo q5_0 on an M3 Ultra ran at 40× real time on GPU and 3× on CPU. Raw Quran WER was worse (33%), 7.6% after the Quran layer.
- **Spec proposal:** server by default, plus a free on-device option in the desktop Studio. Phones are not measured yet.

**Blocks / affects:** 18.9, 19.4, 30.4, 28.7

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)

### D11: Who encodes renditions

**Status:** decided · **Date:** 2026-11-14

**Decision (owner, 2026-11-14: "desktop decisions we do it", accepting the recommendation):** the server encodes renditions by default. The desktop Studio can pre-encode renditions locally as an option; the server verifies them before use and falls back to its own encode when they fail verification.

Earlier recommendation (2026-11-08): server by default; desktop pre-encode as an option once D2 settles. D2 is now settled.

**Blocks / affects:** 19.3

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)

## Plans, payments and embeds (`docs/specs/EMBEDS-COMMENTS-TIERS.md` §7)

### T1: Plans are admin-managed

**Status:** decided · **Date:** 2026-11-07

Plans are custom and fully admin-managed in admin-web (create, version, price, publish, retire). The Free/Plus/Pro/Institution table is seed data only.

**Blocks / affects:** Epic 27, every tiered feature

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)

### T2: Billing provider

**Status:** decided · **Date:** 2026-11-07

Pluggable `PaymentProvider` interface; manual provider always present; app-store adapters for IAP. **Never Stripe.**

Built 2026-11-14 under [AUN-SUBS](AUN-SUBS-subscriptions-plan.md), off by default: a PayGood adapter behind one interface (a Paddle adapter was removed 2026-11-19, P1), a `manual` provider for complimentary tiers, and a test provider for QA and local only. The build brief suggested Stripe, but this decision stands, so Stripe is not used. Creator tiers are the plans (no separate Epic 27 plans). [P1](#p1-first-paid-providers) is decided: PayGood only, off until the owner enables it.

**Blocks / affects:** 27.7, Epic 24

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)

### P1: First paid providers

**Status:** decided · **Date:** 2026-11-19

**PayGood only, off until the owner enables it** (owner, 2026-11-19: *"only PayGood, and off"*).

- PayGood is the one payment provider. It ships off: no provider is enabled until the owner turns it on in the videos admin Payments page.
- Paddle, built 2026-11-14 from the pending [S16](AUN-SUBS-subscriptions-plan.md) shortlist while P1 was open, was never the owner's choice. It was removed completely ([AlUmmahNow#1653](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1653)): adapter, webhook route, admin settings (tax category and tax mode included), copy, tests and docs. Search migration 0067 drops any stored Paddle config.
- The provider framework, `manual` (complimentary tiers) and the QA/local test provider stay. Never Stripe ([T2](#t2-billing-provider)).

Earlier wording (2026-11-07): pick one global merchant-of-record plus 1–2 MENA gateways by the 27.7 criteria; waits on D4.

**Blocks / affects:** 27.7

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)

### E1: Embed host domain

**Status:** deferred · **Date:** 2026-11-07

Spec: `embed.alummahnow.net`. v1 serves `{videos host}/embed/...` instead (EMB-D1); the move is queued.

**Blocks / affects:** 25.4

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md); [docs/embeds/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/embeds/PLAN.md)

### E2: Default thread scope

**Status:** open · **Date:** 2026-11-07

Recommendation: `shared` (one community per video). v1 ships the shared thread only.

**Blocks / affects:** 26.4

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)

### E3: Guest commenting

**Status:** open · **Date:** 2026-11-07

Recommendation: off by default; Pro+ with pre-moderation.

**Blocks / affects:** 26

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)

### E4: Delivery cost for embeds

**Status:** open · **Date:** 2026-11-07

Tie to D2 (now decided: R2 + CDN); meter per Site for fair use.

**Blocks / affects:** 25.9

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)

### EMB-D1: Embeds on the videos host

**Status:** decided · **Date:** 2026-11-07

Embeds served at `{videos host}/embed/...`, not yet `embed.alummahnow.net`.

**Blocks / affects:** 25.4

**Sources:** [docs/embeds/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/embeds/PLAN.md)

### EMB-D10: Discussions v1 read-only

**Status:** decided · **Date:** 2026-11-07

Epic 26 ships read-only first; posting needs a public OAuth client, Sites, moderation, anti-abuse (queued #261).

**Blocks / affects:** Epic 26

**Sources:** [docs/embeds/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/embeds/PLAN.md)

### EMB-D11: No signed-in embeds in v1

**Status:** decided · **Date:** 2026-11-07

Third-party cookies are blocked; the popup + token design waits on the auth client work.

**Blocks / affects:** 26

**Sources:** [docs/embeds/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/embeds/PLAN.md)

### EMB-D12: Embeds consult no entitlement in v1

**Status:** decided · **Date:** 2026-11-07

Everything in v1 is on every plan's Free tier until Epic 27 exists.

**Blocks / affects:** 25.6, 27

**Sources:** [docs/embeds/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/embeds/PLAN.md)

### Q27-1: Epic 27 is plumbing only

**Status:** decided · **Date:** 2026-11-08

Payment parts deferred per D4.

**Blocks / affects:** 27

**Sources:** [docs/specs/EPIC-27-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-27-PLAN.md)

### Q27-2: "Available on {plan}" is plain text

**Status:** decided · **Date:** 2026-11-08

No link and no price shown.

**Blocks / affects:** 27 UI

**Sources:** [docs/specs/EPIC-27-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-27-PLAN.md)

### Q27-3: Who manages plans

**Status:** decided · **Date:** 2026-11-08

Only `admin` and `super_admin` until `billing_admin` / `billing_viewer` exist (AlUmmahNowAuth#227).

**Blocks / affects:** 27.6

**Sources:** [docs/specs/EPIC-27-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-27-PLAN.md)

### Q27-4: Free has real limits

**Status:** decided · **Date:** 2026-11-08

Free plan has real limits; existing content is grandfathered.

**Blocks / affects:** 27.4

**Sources:** [docs/specs/EPIC-27-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-27-PLAN.md)

## AI moderation (`docs/specs/AI-MODERATION.md` §13)

### M1: Extension classifier model

**Status:** open · **Date:** 2026-11-07

Pick by golden-set eval (Arabic precision first); default `llama-4-scout-17b-16e-instruct` meanwhile.

**Blocks / affects:** Epic 28

**Sources:** [docs/specs/AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/AI-MODERATION.md); [docs/specs/EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-28-PLAN.md)

### M2: Auto-hide scope

**Status:** open · **Date:** 2026-11-07

Only spam/scam (high confidence + low trust) and CSAM matches; everything else hold-for-review. AI never deletes.

**Blocks / affects:** Epic 28

**Sources:** [docs/specs/AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/AI-MODERATION.md); [docs/specs/EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-28-PLAN.md)

### M3: `religious_authenticity` flags

**Status:** open · **Date:** 2026-11-07

Opt-in, scholar-review queue only; never auto-action.

**Blocks / affects:** Epic 28

**Sources:** [docs/specs/AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/AI-MODERATION.md); [docs/specs/EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-28-PLAN.md)

### M4: CSAM coverage for R2-served media

**Status:** open · **Date:** 2026-11-07

Confirm with Cloudflare whether the CSAM tool covers R2 custom-domain traffic; else perceptual hashing on upload. Relevant again now that D2 puts video on R2.

**Blocks / affects:** Epic 28

**Sources:** [docs/specs/AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/AI-MODERATION.md); [docs/specs/EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-28-PLAN.md)

### M5: Reviewer staffing & SLAs

**Status:** open · **Date:** 2026-11-07

E.g. 1 h for violent extremism/CSAM, 24 h for the rest. Nobody on call yet.

**Blocks / affects:** Epic 28

**Sources:** [docs/specs/AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/AI-MODERATION.md); [docs/specs/EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-28-PLAN.md)

### M6: Transparency reporting

**Status:** open · **Date:** 2026-11-07

Publish periodic moderation stats (en/ar).

**Blocks / affects:** Epic 28

**Sources:** [docs/specs/AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/AI-MODERATION.md); [docs/specs/EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EPIC-28-PLAN.md)

## Social media management (`docs/specs/social-media-management.md` §19)

### SM-1: Network priority

**Status:** decided · **Date:** 2026-11-09

Facebook and X first, then Telegram, Instagram, YouTube, TikTok, Threads, LinkedIn, Bluesky, Mastodon; share kits for WhatsApp Channels and Snapchat.

**Blocks / affects:** Social media management

**Sources:** [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)

### SM-2: X link-post cost

**Status:** decided · **Date:** 2026-11-09

Default everywhere is the video itself posted natively; on X the watch link is an opt-in reply showing its $0.20 price; platform-wide X spend cap (default $500/month).

**Blocks / affects:** Social media management

**Sources:** [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)

### SM-3: Default for auto-posts

**Status:** decided · **Date:** 2026-11-09

Whole video, Short and Link post offered equally per account; no automatic fallback to a link.

**Blocks / affects:** Social media management

**Sources:** [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)

### SM-4: Legal entity

**Status:** decided · **Date:** 2026-11-09

No entity exists. Ship what works without one; Meta networks only for own accounts + a 50-channel beta.

**Blocks / affects:** Social media management

**Sources:** [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)

### SM-5: Async work and errors (standing rule)

**Status:** decided · **Date:** 2026-11-09

Always async: queues, retry, DLQ; failures flag the admin Errors page.

**Blocks / affects:** Social media management

**Sources:** [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)

### SM-6: Register a business for Meta?

**Status:** decided · **Date:** 2026-11-14

No. The owner: *"no auto post to meta"*. No Facebook, Instagram or Threads auto-posting and no Meta Business Verification. Auto-post covers X, Telegram, Bluesky and Mastodon.

For creators who use a scheduler, the owner: *"if someone uses hootsuite or similar we need to be able help them somehow"*. So every channel gets RSS feeds, link previews (Open Graph, Twitter cards, oEmbed), signed webhooks and a Studio share kit, with a help page for Hootsuite and Buffer. A scheduler can then post to Meta networks for the creator.

(Recommendation before the decision: Business Verification would unlock Facebook/Instagram/Threads for every channel.)

**Blocks / affects:** Social media management

**Sources:** [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)

## Quran Foundation terms ([AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md))

### QF1: Quran Foundation content use

**Status:** decided · **Date:** 2026-11-22

**Decision (Quran Foundation's written answers, 2026-11-21 and 2026-11-22):**
- **Captions:** store verse keys and our own timestamps only. Text and translation are loaded when a track is served, from the Content API or from our Content Sync copy, which is synced at least every 7 days. Nothing else from QF is kept for more than a week.
- **The derived index** (normalised words + locations, built from the Content Sync copy) is allowed for matching. **It is never used to train, fine-tune or evaluate a machine-learning or AI model.** The same applies to the synced text and QF timings. Tests and evals use synthetic fixtures only.
- **`mushafs:4`** (Uthmani Hafs) is synced. Its `mushaf_word` rows, linked by `word_id`, cut verses into words and are not stored twice.
- **Subtitle downloads:** a viewer may download one video's subtitle file. The verse text is filled at download time, unaltered, and the attribution and edition go inside the file.
  - **Viewer downloads: built, off by owner decision 2026-11-22.** QF allows it, but the owner chose to ship it switched off: an admin switch (`viewerCaptionDownload`, default off) hides the player's row. While it is off, only the video's owner, its channel's caption editors and admins download, from Studio ([AlUmmahNow#1735](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1735), merged 2026-11-22, not released yet).
- **Offline device copies** are allowed when refreshed from our synced backend at least every 7 days. A copy expires only when a refresh is missed.
- **Web pages and JSON-LD** may carry verse text that is rendered fresh.
- **Every call to QF:** on HTTP 429, back off and honour `Retry-After`. Use granular scopes, and access QF only from the backend.
- **Attribution** wherever the text appears: "Quran data provided by Quran Foundation (https://quran.foundation/)", with the translation edition by name.

**Blocks / affects:** AUN-CAPTIONS, TOOLS-ADMIN, DISCOVERY, any feature that shows Quran text

**Sources:** AlUmmahNow spec `docs/specs/TRANSCRIPTION-TRANSLATION.md` §9.5–9.6; [AlUmmahNow#1716](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1716), [AlUmmahNow#1722](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1722), [AlUmmahNow#1734](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1734), [AlUmmahNow#1735](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1735)

## Owner decisions and standing rules recorded only in chat (O-series, wiki IDs)

### O1: Whole-platform cost cap

**Status:** decided · **Date:** 2026-11-07

"Anything that cost me more than 500 a month on millions of viewers is a no go", for the whole platform. Basis of D2.

**Blocks / affects:** D2, every epic's infrastructure

**Sources:** [AlUmmahNow#892](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/892), [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686)

### O2: Native apps, viewer and Studio

**Status:** decided · **Date:** 2026-11-07

"Spec epics for native apps on all platforms… both player apps and studio apps, get inspiration from youtube" → Epics 9–24.

**Blocks / affects:** Epics 9–24

**Sources:** [AlUmmahNow#164](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/164), [AlUmmahNow#323](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/323)

### O3: Embeds, comments widget, everything tiered

**Status:** decided · **Date:** 2026-11-07

Embeds with comments for third-party sites; all features have tiers built in for a future subscription system; videos shareable with our player → Epics 25–27.

**Blocks / affects:** Epics 25–27

**Sources:** [AlUmmahNow#164](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/164)

### O4: Pluggable payment providers, never Stripe, admin-managed plans

**Status:** decided · **Date:** 2026-11-07

"Plugable payment providers, never stripe, custom tier plans admin managed." Overrode an assistant suggestion of Stripe made minutes earlier; recorded as T1/T2.

**Blocks / affects:** Epics 24, 27

**Sources:** [AlUmmahNow#164](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/164)

### O5: AI moderation on Cloudflare

**Status:** decided · **Date:** 2026-11-07

"Spec using ai from cloudflare for moderation and flagging" → Epic 28.

**Blocks / affects:** Epic 28

**Sources:** [AlUmmahNow#164](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/164)

### O6: Core web completion epic

**Status:** decided · **Date:** 2026-11-07

Channels, posting, comments, profiles, likes, search, subscriptions and explore were incomplete and unowned → Epic 29 with Sprints A/B/C.

**Blocks / affects:** Epic 29

**Sources:** [AlUmmahNow#164](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/164)

### O7: Start Sprint A

**Status:** decided · **Date:** 2026-11-07

"Yes start on e spint a." Done and on QA the same day.

**Blocks / affects:** Epic 29

**Sources:** [AlUmmahNow#168](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/168), [AlUmmahNow#169](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/169), [AlUmmahNow#170](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/170)

### O8: Bunny token signing

**Status:** decided · **Date:** 2026-11-07

"Make it sign": Bunny embed-view token authentication with directory tokens, behind `BUNNY_SIGN_URLS`; prod key added the same evening. Today's 9.6 playback adapter wraps `lib/bunny-signing.ts`.

**Blocks / affects:** 9.6, Bunny delivery until the R2 move

**Sources:** [AlUmmahNow#182](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/182)

### O9: Findings are actioned at once

**Status:** decided · **Date:** 2026-11-07

Every finding is delegated right away or filed as a `queue` issue.

**Blocks / affects:** All work

**Sources:** Owner decision, 2026-11-07 (no public record yet)

### O10: Stage slot before production; spec → plan → implement

**Status:** decided · **Date:** 2026-11-08

Production gets a tested stage slot then a switch; CI tests for every app; data changes need migrations and checks.

**Blocks / affects:** Release pipeline

**Sources:** [AlUmmahNow#203](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/203), [AlUmmahNow#248](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/248)

### O11: Production only from tags on main

**Status:** decided · **Date:** 2026-11-08

Deploy production only from main through CI, using tags to control when.

**Blocks / affects:** Release pipeline

**Sources:** [AlUmmahNow#286](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/286)

### O12: Protect main; merge own PRs when green

**Status:** decided · **Date:** 2026-11-08

PRs required; agents merge when tests pass.

**Blocks / affects:** All repos

**Sources:** [AlUmmahNow#211](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/211), [AlUmmahNow#286](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/286)

### O13: Signed in once means signed in everywhere

**Status:** decided · **Date:** 2026-11-08

Every app uses SSO; the website shows all signed-in accounts.

**Blocks / affects:** Auth, all apps

**Sources:** [AlUmmahNowAuth#254](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/254), [AlUmmahNowUI#14](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/14)

### O14: Auth is a separable SSO provider

**Status:** decided · **Date:** 2026-11-09

Auth can be split out for other sites; auth and videos are separate apps; the videos admin doesn't link to auth; videos bans don't touch auth; videos admins send moderation requests to auth admins.

**Blocks / affects:** Identity platform, admin content

**Sources:** [AlUmmahNowAuth#275](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/275)

### O15: `account.*` is only a redirect

**Status:** decided · **Date:** 2026-11-09

`account.alummahnow.net` redirects to `profile.auth`; keep both DNS records. Scaled down a full account hub proposal.

**Blocks / affects:** Account hub

**Sources:** [AlUmmahNowAuth#253](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/253)

### O16: Channel roles separate from site roles; only super admins transfer ownership

**Status:** decided · **Date:** 2026-11-09

Owners can add admins but not transfer ownership; channel roles are unrelated to site roles.

**Blocks / affects:** Channel roles, claim/transfer

**Sources:** [AlUmmahNow#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462)

### O17: Super admins claim and assign official channels

**Status:** decided · **Date:** 2026-11-09

Spec only (PR #460, open).

**Blocks / affects:** Channel claim

**Sources:** [AlUmmahNow#460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460)

### O18: Four themes, Fawanees default

**Status:** decided · **Date:** 2026-11-09

Lantern, Zujaj, Nahas, Fawanees; Fawanees as main in production. Switching "with a deploy, not realtime" (see conflict on the themes page).

**Blocks / affects:** Themes

**Sources:** [AlUmmahNow#455](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/455), [AlUmmahNow#492](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/492)

### O19: Themes in the native apps too

**Status:** decided · **Date:** 2026-11-09

"I meant APPs, player APPs, native APPs."

**Blocks / affects:** Native themes

**Sources:** [AlUmmahNowApple#13](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/13), [AlUmmahNow#500](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/500)

### O20: Buildable theme packages in admin

**Status:** decided · **Date:** 2026-11-10

Each theme a JSON file and folder, a package, built in an admin theme builder.

**Blocks / affects:** Themes

**Sources:** [AlUmmahNow#564](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/564), [AlUmmahNow#587](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/587)

### O21: English default on sign-in and profile

**Status:** decided · **Date:** 2026-11-09

Sign-in and profile pages render RTL/LTR from a parameter, **English unless `?lang=ar`**, with no Accept-Language or cookie fallback.

**Blocks / affects:** Auth, openauth, account hub

**Sources:** [AlUmmahNowAuth#261](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/261), [openauth#21](https://github.com/Al-Ummah-Now/openauth/pull/21)

### O22: CMS keeps bknd under our own admin screens

**Status:** decided · **Date:** 2026-11-09

"Bknd UI is bad… I am with option one."

**Blocks / affects:** CMS admin UI

**Sources:** [AlUmmahNowCMS#21](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/21)

### O23: www is the UI, CMS its admin; both auth clients

**Status:** decided · **Date:** 2026-11-08

www hosts videos from the videos app through CMS and the embeds work.

**Blocks / affects:** CMS/www

**Sources:** [AlUmmahNowCMS#6](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/6), [AlUmmahNowUI#2](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/2)

### O24: Cost dashboard; per-channel cost later; opt-in alerts

**Status:** decided · **Date:** 2026-11-08

Alerts are register-based for admins who ask, and cover only our Workers.

**Blocks / affects:** Cost monitoring

**Sources:** [AlUmmahNow#266](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/266)

### O25: Invite-only uploads with admin-assigned creator tiers

**Status:** decided · **Date:** 2026-11-10

"No uploads should be allowed from normal users nor channel creation, tiers should be done so i can assign them"; super admins Unlimited.

**Blocks / affects:** Creator tiers, Epic 27

**Sources:** [AlUmmahNow#630](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/630), [AlUmmahNow#623](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/623)

### O26: Always async, with admin-visible errors

**Status:** decided · **Date:** 2026-11-10

"Always async, queues, retry, errors should flag admin for action"; UI errors reported to the server.

**Blocks / affects:** All work

**Sources:** [AlUmmahNow#589](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/589), [AlUmmahNow#607](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/607), [AlUmmahNow#584](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/584)

### O27: One Short rule

**Status:** decided · **Date:** 2026-11-10

≤ 3 min and vertical/square, uploader override, applied to old videos; sections don't skip Shorts unless there's a reels section.

**Blocks / affects:** Shorts

**Sources:** [AlUmmahNow#591](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/591)

### O28: Home timeline in weekly KV buckets

**Status:** decided · **Date:** 2026-11-10

Built on Workers KV after the owner asked whether KV beats R2; owner first said R2.

**Blocks / affects:** www home timeline

**Sources:** [AlUmmahNowCMS#51](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/51)

### O29: Keep the openauth fork

**Status:** decided · **Date:** 2026-11-07

Keep our fork; don't rebuild auth or move to OpenIddict/C#. The assistant recommended it and the owner didn't object.

**Blocks / affects:** Auth

**Sources:** Owner decision, 2026-11-07 (no public record yet)

### O30: Social media answers

**Status:** decided · **Date:** 2026-11-09

Facebook and X first; post the native video, not links; per-rule choice of whole video, Short or link. Given through an in-app prompt, recorded in the spec §19.

**Blocks / affects:** Social media management

**Sources:** [AlUmmahNow#581](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/581)

### O31: Transcode on Cloudflare Containers

**Status:** decided · **Date:** 2026-11-10

Our own transcoding (FFmpeg) for the R2 pipeline runs on Cloudflare Containers, billed per second while a job runs, rather than on a VPS. Keeping everything in one Cloudflare account is preferred.

**Blocks / affects:** [D2](D2-video-delivery.md), [R2 video migration](AUN-R2-MIGRATION-r2-video-migration.md)

**Sources:** [AlUmmahNow#687 comment](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/687#issuecomment-6774105975); [AlUmmahNow#892](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/892)

### O32: Run Bunny and R2 side by side before switching

**Status:** decided · **Date:** 2026-11-10

Keep Bunny and the new R2 + CDN delivery running at the same time to compare speed and cost on real traffic. New uploads go to both; an admin-managed switch picks which one serves each play (percentage, per video, forced per user), with Bunny as the fallback. The player reports startup time, rebuffering, bitrate and errors per provider, and an admin dashboard compares speed and cost per minute watched. Trial on QA, then a slice of production for 2–4 weeks; then decide whether to migrate and retire Bunny.

**Blocks / affects:** [D2](D2-video-delivery.md), [R2 video migration](AUN-R2-MIGRATION-r2-video-migration.md)

**Sources:** [AlUmmahNow#687 comment](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/687#issuecomment-6774105975); [AlUmmahNow#892](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/892)

### O33: Tiers by request during the beta

**Status:** decided · **Date:** 2026-11-14

An "upgrade subscription" page like other sites', except users *request* a tier instead of paying: every available tier shown, a short form (name, "tell us about yourself"), and a notice that during the beta access is granted on an acceptance basis and paid subscriptions open later. The normal user tier is a real tier (Member) so the owner can later choose whether normal users may create pages.

**Blocks / affects:** Creator tiers, AUN-SUBS, Epic 27

**Sources:** [AUN-TIER-REQUESTS](AUN-TIER-REQUESTS-tier-requests.md)

### O34: Pages are built from typed blocks, never HTML

**Status:** decided · **Date:** 2026-11-14

"there should be a way to add elements like squarespace, not pure html". CMS pages are ordered lists of typed blocks with a few theme-token style options (alignment, width, tone, spacing), edited in a picker-and-preview builder; no HTML or CSS input anywhere. One renderer and one stylesheet (canonical in AlUmmahNow `packages/shared-types`, vendored byte for byte by the CMS and UI) draw them in the editor preview, on www, on scholar sites and on the videos site.

**Blocks / affects:** [AUN-CMS-PAGE-BUILDER](AUN-CMS-PAGE-BUILDER-cms-page-builder.md), [CMS-PAGE-BLOCKS](CMS-PAGE-BLOCKS-cms-page-blocks.md)

**Sources:** owner in chat, 2026-11-14; [AlUmmahNowCMS#136](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/136)

### O35: Arabic uses Eastern Arabic (Hindi) numerals

**Status:** decided · **Date:** 2026-11-15

Arabic pages use Eastern Arabic (Hindi) numerals ٠–٩ everywhere: numbers, counts, dates, times, durations, percentages and money, on the public site, Studio, admin, emails and native apps. English uses Arabic numerals 0–9. Formatting is deterministic: one shared formatter per repo with an explicit numbering system (`ar-u-nu-arab`), so the server and every browser render the same. Messages carry no hard-coded digits (placeholders filled by the formatter). Money in Arabic uses the currency's Arabic name, «١٢٫٦٩ دولار أمريكي», never «US$». Code, ids, URLs, slugs, versions and what people type stay as written; typed numbers accept both digit systems. This replaces the admin's pin to 0–9 (AlUmmahNow#1473).

**Blocks / affects:** every app and email; [Numbers and dates](../guides/numbers-and-dates.md)

**Sources:** owner decision on [AlUmmahNow#1488](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1488) and [AlUmmahNow#1496](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1496), 2026-11-15

### O36: One frosted-glass surface primitive, flat Material elsewhere

**Status:** decided · **Date:** 2026-11-16

Every card, box, dialog panel and menu is frosted glass with a golden edge and glow, from one shared token set and class set, in every app. Everything else is flat Material: solid fills, no gradients, no inner sheen, no heavy shadows. Buttons are flat (filled primary for the main action only), and card buttons go in an end-aligned footer row. Menus are flat lists on the frosted panel, on-screen, mirrored in Arabic and keyboard accessible. Long lists and media cards use a no-blur variant for performance.

**Blocks / affects:** [Epic 10](E10-fanous-design-system.md), [AUN-CMS-PAGE-BUILDER](AUN-CMS-PAGE-BUILDER-cms-page-builder.md)

**Sources:** owner in chat, 2026-11-16; [AlUmmahNow#1523](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1523), [AlUmmahNowUI#125](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/125)

### O37: With tier requests off and no payment provider, /upgrade is an off feature

**Status:** decided · **Date:** 2026-11-19

The Upgrade page has three modes (shared-types `UPGRADE_MODES`): **pay** (a payment provider is on), **request** (no provider, "Allow tier requests" on) and **closed** (no provider, requests off). Closed follows the hidden-feature rule: /upgrade vanishes entirely, with no "not available" text and no hollow page.

- `GET /api/tiers/upgrade` and `POST /api/me/tier-requests` answer the standard `404 {"code":"feature_off"}`; the page renders the site's 404 (server side, and on the client if the mode changes after the page was served).
- No entry points: the header Request tier / Upgrade pill, the account menu's Upgrade item and Settings › Tier's "See all tiers" link are gone.
- The user's current tier still shows where tiers normally show: Settings › Tier reads it from `GET /api/me/tier`, which answers in every mode. Its request history goes with /upgrade while closed.
- A Creator's upload entry points work as usual, so the "request approved" card is not needed anywhere else.

**Blocks / affects:** [AUN-TIER-REQUESTS](AUN-TIER-REQUESTS-tier-requests.md), [AUN-SUBS](AUN-SUBS-subscriptions-plan.md), [Product rules → Hidden when off](../guides/product-rules.md)

**Sources:** owner decision in the SUBS review thread, 2026-11-19; AlUmmahNow [#1415](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1415), [#1418](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1418)


### O38: Numbers: never grouped in Arabic, counts compact from 1,000

**Status:** decided · **Date:** 2026-11-21 · **Replaces:** the thousands mark «٬» that [O35](#o35-arabic-uses-eastern-arabic-hindi-numerals) used (2026-11-15), and the million word forms «مليون / مليونا / ملايين» of the 2026-11-20 compact rule

One rule for every platform (web, admin, emails, Android, Apple, Desktop, Tools):

1. **Arabic numbers are never grouped.** «٫» is the only mark inside an Arabic number: «٤٨٨٧», «١٢٣٤٫٥», «٥٠٦٢٫٦ س». No «٬» (U+066C) and no space between digits (a narrow no-break space was tried on AlUmmahNow#1665 and dropped). English keeps its grouping: "4,887". **Why:** «٬» and «٫» are drawn in the same comma shape by most Arabic UI fonts (IBM Plex Sans Arabic, Noto Kufi Arabic, Amiri), so «١٥٬٤١٩٫٩» read as 15,419,9.
2. **Counts are compact from 1,000 on:** view counts, subscriber counts, stat tiles, chart ticks and cards. Cut to one decimal, never rounded up: 4,887 → "4.8K" / «٤٫٨ ألف»; 1,299 → "1.2K" / «١٫٢ ألف». Under 1,000 stays full: "887" / «٨٨٧».
3. **Arabic scale words.** Thousands and billions agree with the number shown: exactly 1 is the word alone («ألف مشاهدة», «مليار»), exactly 2 the dual alone («ألفان», «ألفا مشاهدة» before a noun; «ملياران», «مليارا»), whole 3–10 the plural («٣ آلاف مشاهدة», «٣ مليارات»), 11+ and every decimal the singular («١١ ألف مشاهدة», «١٫٣ ألف مشاهدة»). **Standing alone** (a stat tile or chart tick with no noun after it), a whole number whose last two digits are 11–99 takes the accusative: «١٢ ألفًا», «١٢٠ ألفًا», «٩٩ ألفًا», «١٢ مليارًا»; 100, 200 and decimals stay singular («١٠٠ ألف», «١١٫٥ ألف»). Before a noun it stays singular: «١٢ ألف مشاهدة». **Millions are always the digit and «م»:** «١ م», «٢ م», «١٫٢ م مشاهدة», «١٥ م». The noun after a scale word is singular. English: "1K", "1.2K", "1M", "1.2M views", "2B".
4. **Separators between values.** In Arabic a dot between two values («·» or « • ») reads as the digit zero next to Arabic digits («عام • ١٢ ألف» reads as «١٢٠ ألف»), so Arabic separates values with the Arabic comma: «الأمة الآن، ٣ م مشاهدة»; «١٢ ألف مشاهدة، قبل ٣ أيام». English keeps its mark: "Al Ummah Now · 3M views". Applies to cards, watch meta, channel rows, Studio rows, admin lists and tooltips.
5. **Exact values stay exact** (ungrouped in Arabic): analytics table cells where the exact figure is the point (Top content, traffic sources, a chart's data table and hover readout), admin list columns, watch-time hours («٥٠٦٢٫٦ س»), money («١٢٣٤٫٥٠ دولار أمريكي»), file sizes, small notices ("{count} selected") and screen-reader labels.

| Value | English | Arabic |
|---|---|---|
| 887 views | 887 views | ٨٨٧ مشاهدة |
| 1,000 views | 1K views | ألف مشاهدة |
| 2,000 views | 2K views | ألفا مشاهدة |
| 3,000 views | 3K views | ٣ آلاف مشاهدة |
| 4,887 (tile) | 4.8K | ٤٫٨ ألف |
| 12,000 (tile) | 12K | ١٢ ألفًا |
| 12,000 views | 12K views | ١٢ ألف مشاهدة |
| 120,000 (tile) | 120K | ١٢٠ ألفًا |
| 100,000 (tile) | 100K | ١٠٠ ألف |
| 11,500 (tile) | 11.5K | ١١٫٥ ألف |
| 12,000,000,000 (tile) | 12B | ١٢ مليارًا |
| 1,000,000 | 1M | ١ م |
| 1,250,000 views | 1.2M views | ١٫٢ م مشاهدة |
| 3,000,000,000 | 3B | ٣ مليارات |
| 4,887 (table cell) | 4,887 | ٤٨٨٧ |
| 5,062.6 hours | 5,062.6 hr | ٥٠٦٢٫٦ س |
| channel and views | Al Ummah Now · 3M views | الأمة الآن، ٣ م مشاهدة |

**How:** each repo has one formatter. AlUmmahNow: `numberFormat` in `@al-ummah/shared-types` locale-format sets `useGrouping: false` for Arabic whatever the caller asks (and the push service worker's copy); `formatCompact` builds the Arabic scale words (`beforeNoun` picks the singular before a noun; `formatCountNoun` passes it); `metaSeparator` / `joinMeta` give the separator (web `<MetaSep />` and admin `<Sep />` for rows of elements, admin message `common.sep`); tiles call `formatCompact` (admin `formatStat`), table cells `formatNumber`. Desktop: `Localizer.Stat` / `Compact` / `Views` (e684263); Desktop #69 and Android #51 add the standalone accusative and the Arabic comma. Typed numbers still accept «٬» or a space and drop it.

**Blocks / affects:** every app and email, native apps ([AlUmmahNowApple#75](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/75), commit 7d5b0fe); [Numbers and dates](../guides/numbers-and-dates.md)

**Sources:** owner decisions relayed by MOBILE-DESIGN, 2026-11-21; [AlUmmahNow#1665](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1665)

### O39: One Features page, server enforced

**Status:** decided · **Date:** 2026-11-22

Every feature that can be switched on or off is listed in one registry (`packages/shared-types/src/feature-registry.ts`) and switched on one page in the videos admin, **Features** (`/features`). Each row has the name, help text in English and Arabic that says what people lose while it is off, the switch, who changed it last and when, and dependency notes.

- **The server is the source of truth.** Every gated route and job is mapped to its key, and the server refuses an off feature with `404 feature_off`. `GET /api/me/features` includes the switches, and every client (web, Apple, Android, Desktop, Tools, www) hides what is off.
- **Storage:** the switches live in the search D1, with a change history and an admin audit entry. Servers refuse within 30 seconds of a change, and every surface follows within 2 minutes.
- **Who changes them:** admins and super admins (`features:manage`). Uploads, Creating channels, Live streaming and Caption download for viewers can be changed only by super admins. There is no new role and no Auth RBAC.
- **Existing switches move here.** Allow tier requests, YouTube import, Social, AI category suggestions, Caption translation, the Translate button and Translated titles keep their stored values. Their old pages keep their setup and show a status line.
- **Background jobs park** while their feature is off and resume when it is back on, through a queued job. If resuming gives up, the Errors page shows it with Retry.

**Blocks / affects:** [AUN-FEATURES](AUN-FEATURES-feature-switches.md), [Product rules](../guides/product-rules.md), [O37](#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature) (its switch moves, its rule doesn't change)

**Sources:** owner request 2026-11-22: "enable and disable features, from videos admin on one page for all features with help text, enforced on web and native apps"

### O40: Server-written error messages

**Status:** decided · **Date:** 2026-11-22 · **Amends:** [Product rules → The `feature_off` convention](../guides/product-rules.md#the-feature_off-convention)

Every API error carries one envelope:

- a stable `code`;
- a whole-sentence `message` in the request's language (`Accept-Language`, else `X-App-Locale`);
- an `action` (retry, sign in, update app, contact support, none);
- optionally `retryAfter`, `helpUrl` and a `reference`.

The messages come from one English and Arabic catalogue on the server. A client keeps its tailored handling for the codes it knows. For **any other code** it shows the server's message in one generic component (inline, toast or full page), so a client that doesn't know a code yet still shows it properly.

**`feature_off` now carries a message**, for example "Live streaming isn't available right now." / «البث المباشر غير متاح الآن.» Entry points the client knows about stay hidden, as before. The message appears only when an action still reaches an off feature: an old app version, or a page opened before the switch. It shows once, then the client re-reads the features and the entry point disappears. It never mentions tiers, never upsells and never links to /upgrade.

**Blocks / affects:** [AUN-FEATURES](AUN-FEATURES-feature-switches.md), every API and client

**Sources:** owner addition 2026-11-22: a generic server error so "errors coming from the server can be shown even when a client doesn't support them yet", e.g. "This feature is not currently available"; owner the same day: the server side is spelled out as its own stories

### LIC: Repo licence for Core and the app repos

**Status:** open · **Date:** 2026-11-08

Repos are `UNLICENSED`; asked 2026-11-08 18:21 UTC, no answer in chat.

**Blocks / affects:** Core 1.0, app repos

**Sources:** [AlUmmahNowCore/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/45d873a0b0fa908bead87d91f28bd33a2b41bedb/docs/PLAN.md); Licence question to the owner, 2026-11-08 (no public record yet)

### GDPR: GDPR defaults (retention, consent)

**Status:** open · **Date:** 2026-11-07

Proposed: 18 months history, 13 months raw events, consent re-asked every 6 months, legal review of watch history. No owner answer.

**Blocks / affects:** Epic 1 story 1.3

**Sources:** [docs/compliance/GDPR.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/compliance/GDPR.md) (proposed defaults, "Decision needed")
