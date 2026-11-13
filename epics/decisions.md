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
| [D10](decisions.md#d10-transcription-location) | Transcription location | **open** | 2026-11-08 | 18.9, 19.4, 30.4, 28.7 |
| [D11](decisions.md#d11-who-encodes-renditions) | Who encodes renditions | **open** | 2026-11-08 | 19.3 |
| [T1](decisions.md#t1-plans-are-admin-managed) | Plans are admin-managed | **decided** | 2026-11-07 | Epic 27, every tiered feature |
| [T2](decisions.md#t2-billing-provider) | Billing provider | **decided** | 2026-11-07 | 27.7, Epic 24 |
| [P1](decisions.md#p1-first-paid-providers) | First paid providers | **open** | 2026-11-07 | 27.7 |
| [AUN-SUBS](AUN-SUBS-subscriptions-plan.md) | Site-wide subscriptions plan (decisions S1–S18) | **pending** | 2026-11-11 | Epic 27, Epic 24, every tiered feature, P1 |
| [AUN-SCHOLAR-SITES](AUN-SCHOLAR-SITES-scholar-sites.md#12-decisions-for-the-owner) | Scholar sites (decisions SS1–SS18) | **pending** | 2026-11-13 | Scholar sites phases 1–4, the shared post schema |
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
| [SM-6](decisions.md#sm-6-register-a-business-for-meta) | Register a business for Meta? | **open** | 2026-11-09 | Social media management |
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

**Status:** open · **Date:** 2026-11-08

Recommendation: hybrid (on-device desktop and short mobile clips; server-side Workers AI for long uploads and web).

Evidence (2026-11-11, [AUN-CAPTIONS](AUN-CAPTIONS-transcription-translation.md)):
- **Server:** Workers AI Whisper turbo costs $0.00051 per minute. Raw WER was 6% on Quran recitation and 13% on English.
- **Desktop:** Core's whisper.cpp turbo q5_0 on an M3 Ultra ran at 40× real time on GPU and 3× on CPU. Raw Quran WER was worse (33%), 7.6% after the Quran layer.
- **Spec proposal:** server by default, plus a free on-device option in the desktop Studio. Phones are not measured yet.

**Blocks / affects:** 18.9, 19.4, 30.4, 28.7

**Sources:** [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)

### D11: Who encodes renditions

**Status:** open · **Date:** 2026-11-08

Recommendation: server by default; desktop pre-encode as an option once D2 settles. D2 is now settled.

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

**Blocks / affects:** 27.7, Epic 24

**Sources:** [docs/specs/EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/EMBEDS-COMMENTS-TIERS.md)

### P1: First paid providers

**Status:** open · **Date:** 2026-11-07

Pick one global merchant-of-record plus 1–2 MENA gateways by the 27.7 criteria. Waits on D4.

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

**Status:** open · **Date:** 2026-11-09

Open: Business Verification would unlock Facebook/Instagram/Threads for every channel.

**Blocks / affects:** Social media management

**Sources:** [docs/specs/social-media-management.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/social-media-management.md)

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
