[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Native admin app (mobile-first moderation)

| | |
|---|---|
| **ID** | `AUN-ADMIN-NATIVE` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNow](../repos/AlUmmahNow.md) (admin-api, processor push, api-videos devices), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (OAuth client, roles, step-up) |
| **Status** | **planned**: draft v1 spec, waiting on owner decisions AD1–AD14. Nothing is built |
| **Last updated** | 2026-11-13 |

Read from AlUmmahNow `origin/main` [`4029d59`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/4029d5971), the Apple, Android and Core repos, and the [AUN-VIDEO-REVIEW](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/44) draft (Wiki#44) on 2026-11-13. Builds on [Epic 9](E09-native-platform-foundations.md) (push registry), [Epic 18](E18-studio-mobile.md) (Studio mobile), [Epic 28](E28-ai-moderation.md) (AI moderation) and [CHAT-ERRORS](CHAT-ERRORS-error-reporting.md).

## Why

Admin is web only (admin-web + admin-api). The coming pre-publication review (AUN-VIDEO-REVIEW) holds a creator's video until a person approves it. The owner's target is that a creator waits **about 5 minutes**. A reviewer at a desk cannot meet that. A reviewer with a phone that buzzes the moment a video is held can.

## Rules this spec keeps

- **Never Stripe.** The app has no payments at all.
- **Every feature is admin-managed.** Who gets alerts, the on-call rota, quiet hours and escalation times are settings in admin-web. Which queues a person sees comes from their roles and permissions. Nothing is hard-coded per person.
- **No system prompts for decisions.** Destructive actions use the app's own accessible dialog (a sheet), never a bare system alert.
- **Undo over confirm.** Reversible actions apply at once and show an undo toast. Confirm stays only for ban, remove, transfer and permanent delete, as in admin-web ([admin UX decisions](decisions.md)).
- **Every search is a live autocomplete** that opens with results, using the existing `/suggest` endpoints.
- **Light and Dark only.** No System option. The first launch follows the device; after that, the last explicit choice.
- **Tests make no real AI calls** and no real pushes. Tests use the local stack and the log-only push provider.
- **$500/month cap at scale.** Judged per review item, not against today's small numbers.

## What exists today

| Piece | State | Where |
|---|---|---|
| Native Studio apps | Studio MVP shipped on iPhone, iPad and Android: SSO with several accounts, upload, manage, bulk edit, analytics, en/ar | Apple `Apps/StudioIOS`, `Apps/StudioMac`; Android `studio-mobile`; Desktop `AlUmmahNow.Studio.*` |
| Shared Core | Rust core with `aun-api`, `aun-auth`, `aun-i18n`, `aun-sync`, `aun-telemetry` and others; v0.3.0-rc.1 | AlUmmahNowCore |
| Viewer and Studio are already separate apps | Separate targets and bundle ids on Apple and Android | Apple `Apps/*`; Android `viewer-mobile`, `studio-mobile` |
| Push device registry | `PUT/DELETE /api/v1/devices/:installId`; table `push_devices` (install, user, platform, provider, token, locale, categories); at most 20 devices per user | api-videos `lib/push-devices.ts`; processor `migrations-notifications/0003` |
| Push senders | One interface for APNs, FCM, WNS and Web Push. **All four are log-only**: no credentials yet | processor `src/push/provider.ts`; issue [#414](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/414) (open) |
| Push latency | Push dispatch rides the `al-ummah-now-videos` queue with `max_batch_timeout: 30` s | processor `wrangler.jsonc` |
| Admin roles | `super_admin`, `admin`, `moderator`; permissions per role in one table; `permissionsFor(roles)` lets clients hide what a person cannot do | admin-api `lib/roles.ts` |
| Admin queues | Reports (Action needed / History), AI moderation, Errors, Status, Users, Channels, Abuse | admin-web `(protected)/*`; admin-api routers `reportQueue`, `moderation`, `errors`, `status`, `channels`, `suggest`, `authRequests` |
| Suspend and delete | Videos admin sends a moderation request to Auth (`auth_requests:send`, admins only) | admin-api `authRequests.router.ts` |
| Second factor | **None.** Auth has no MFA, passkeys, `max_age` or `auth_time` handling | AlUmmahNowAuth `src` |

### Findings

- **F1. The push registry does not know which app a device belongs to.** APNs needs the topic (bundle id) of the app that registered. A Studio, Viewer and Admin install on one phone would share a provider and platform but need different topics. Fix: add an `app` column (`viewer`, `studio`, `admin`) and send per app.
- **F2. All push senders are log-only (#414).** Nothing reaches a phone today. The admin app depends on #414.
- **F3. Push waits up to 30 s in a shared batch queue** behind video jobs. Review alerts need their own fast path.
- **F4. Admin accounts have no second factor.** A stolen admin password is enough to approve, reveal and suspend. A phone that is always signed in raises that risk.
- **F5. The review spec says a 24 h SLA (VR6); the owner now targets about 5 minutes.** VR6 should be updated to match whatever the owner picks in AD3.

## Recommendation in one paragraph

Build **a separate "Al Ummah Now Admin" app** on **iPhone/iPad and Android phone**, inside the existing Apple and Android repos, sharing Core and the Studio sign-in, player and i18n code. Distribute it **only through TestFlight internal testing and Play internal testing**, never as a public download. Use the **same SSO** with a new native OAuth client, a server-side role check on every call, **device unlock to open the app**, and **re-sign-in for high-risk actions**. Send alerts with **FCM for both platforms** (APNs key uploaded to Firebase), on a **dedicated review-alert queue**, with an on-call rota and escalation so the 5-minute target holds. Phase 1 is the video review queue alone; reports and AI moderation follow; Errors, Status and user lookup come last.

## Separate app or admin mode inside Studio (AD1)

| | Separate Admin app (recommended) | Admin mode inside Studio |
|---|---|---|
| Who installs it | About 5–50 staff | Every creator |
| Store review | Internal testing only: no App Review, no Play review, no reviewer demo account needed | Public Studio would ship moderation screens to the stores. Apple asks for a demo admin login, and "hidden features" questions follow |
| NSFW material in the binary's flows | Only in an app that only staff can install | In a public app's code paths, behind a role flag |
| Push | Its own bundle id and channel: "Review queue" alerts never mix with a creator's own channel news | Creator alerts and staff alerts share one app; muting one mutes both on iOS |
| Lock and session rules | Strict: device unlock on open, short sessions, screenshot shield | Strictness would also hit creators, or need two modes in one app |
| Build cost | One more target per platform; about 70% of the code is shared (sign-in, player, i18n, Core client, design) | Lowest code count |
| Staff who also create | Two apps on their phone | One app |

The two-apps cost for staff is small, and the separation removes the store-review and lock-screen problems. **Recommend a separate app.**

## Platforms (AD2)

- **Phase 1: iPhone, iPad and Android phone.** Reviewing is a phone job; iPad gets a split view (queue left, item right) for free from SwiftUI.
- **Not now: macOS, Windows, Linux, Android tablets as a target, TV.** On a desk, admin-web is already the better tool. Android tablets run the phone build.
- **Web gets the same alerts.** admin-web can offer Web Push for reviewers at a desk (the Web Push adapter is in #414 too), so the rota is not phone-only.

## Scope

### Phase 1: video review (needs AUN-VIDEO-REVIEW enforce mode)

1. **Sign-in and lock.** SSO, role check, device unlock (Face ID, Touch ID, fingerprint or device passcode) to open and after 5 minutes in the background.
2. **Review queue.** Action needed / History, grouped by item, sorted by SLA deadline then risk, as in admin-web. Each row shows the time left, the reasons (NSFW, minor present, extremism, metadata) and the channel's trust level. Search is a live autocomplete over titles, channels and reasons; filters are kept in a deep link.
3. **Claim.** Opening an item claims it so two reviewers never review the same video. The claim lasts 3 minutes and renews while the screen is open. Others see "Being reviewed by Name".
4. **Review screen.** Player, frame strip with the flagged frames first, AI reasons and scores, transcript snippet, metadata and thumbnail, channel history (past decisions, warnings). Everything NSFW is **blurred by default**.
5. **Decide.** Approve, Reject with a reason (from an admin-managed list), Escalate to senior, Request changes. Approve and Reject show an **undo toast for 10 s**. The server holds the side effects (publish, subscriber fan-out, creator notice) until the undo window closes, so an undo leaves no trace for the creator.
6. **Alerts.** Push the moment a video is held, with escalation (below).
7. **Audit.** Every claim, reveal, decision and undo is in the audit log with the device install id.

### Phase 2: reports and AI moderation

8. **Reports queue** (Action needed / History): hide or unhide, dismiss, warn user, escalate, open the reported item. Same blur and reveal rules.
9. **AI moderation queue** (Epic 28 flags on comments, posts, images, avatars and banners): approve, remove, warn.
10. **Warn user** uses the existing admin-web action: a notice to the user, a warning on their history and an audit entry.

### Phase 3: operations and people

11. **Errors**: the Errors page's groups with Acknowledge, Resolve, Ignore and Assign (permissions `errors:read` and `errors:manage`). Optional push when a new error group crosses the alert threshold.
12. **Status**: checks and incidents; post and update an incident (`status:manage`).
13. **User and channel lookup**: live autocomplete that opens with recent results, then a profile page with history, warnings, videos and reports.
14. **Suspend and unsuspend** a user or channel through the existing Auth moderation request. Suspend needs re-sign-in (step-up) and the in-app confirm sheet, because Auth enforces it right away.

Out of scope: platform settings, themes, plans, translations, sites, live operations, permanent deletes, payments. They stay in admin-web.

## Sensitive material

- **Blur by default** for every image, frame, thumbnail and player flagged NSFW or minor present. The blur is applied on the device to a low-resolution preview; the full-resolution media is fetched only after a reveal.
- **Reveal is per item and audited.** A "Show" button (a real button, labelled for screen readers) reveals one item. The server logs who, which item, when, from which device, and why the item was flagged. The item blurs again when the reviewer leaves it, the app goes to the background, or 60 s pass without interaction.
- **Senior-only minor items.** Items flagged "minor present" are visible only to the senior reviewer role. The server never sends them, their thumbnails or their push alerts to anyone else. The UI hiding them is a second layer, not the control.
- **Screen privacy.** The app switcher shows a plain cover instead of the screen (both platforms). Android sets `FLAG_SECURE` on review screens, which blocks screenshots and recording. iOS cannot block screenshots; it detects them, blurs the item and logs the event.
- **Nothing sensitive on disk.** Flagged media and frames are memory only, never written to the cache, never saved to the photo library, never shared out of the app. Signed media URLs expire in minutes and are never stored ([Bunny signing rule](../guides/)).
- **Nothing sensitive on the lock screen.** A push says "Video held for review · NSFW · 4 min left", never the title, channel name or a thumbnail.
- **Wellbeing.** A reviewer can turn on grayscale for revealed items. The app shows a gentle break reminder after 20 minutes of continuous review (admin-managed). These follow common trust-and-safety practice.

## Auth (AD5, AD6)

- **Same SSO.** Sign-in through the system browser sheet (ASWebAuthenticationSession / Custom Tabs) with PKCE, exactly like Studio. New public OAuth clients "Admin (iOS)" and "Admin (Android)" with redirect `alummahnow-admin://auth/callback`, one per environment.
- **Role check on the server, every call.** admin-api already checks roles per route. The app calls a `me` endpoint that returns `permissionsFor(roles)` and shows only the tabs a person can use. A person without a staff role sees "This app is for Al Ummah Now staff" and a sign-out button.
- **New roles** from VR7: `content_reviewer` (review queue) and `senior_reviewer` (adds minor items, escalations, appeals). They are added to the existing permission table, not hard-coded in the app.
- **Device unlock** on open and after 5 minutes in the background. If the device has no passcode, the app refuses to sign in.
- **Step-up for high-risk actions.** Suspend, unsuspend, ban, revealing a minor item and approving an escalated item require a sign-in within the last 15 minutes. The app opens the SSO sheet with `prompt=login` and `max_age=900`; Auth must return `auth_time` and admin-api must check it. This is new work in Auth (F4).
- **Real second factor (separate Auth epic).** Recommend passkeys for every account with a staff role, required before the app is offered to anyone outside the owner. Until then, step-up is a password re-entry.
- **Session length.** Admin refresh tokens last 7 days, like admin-web's session. Signing out on any device, or removing a staff role, revokes the token and the push device.
- **Lost phone.** admin-web lists each reviewer's admin devices with "Sign out this device", which revokes the token and deletes the push row.

## Alerts and the 5-minute target (AD3, AD4, AD7)

The target is that a creator's held video gets a decision in about 5 minutes. Budget: alert out in under 30 s, reviewer opens within 2 minutes, decision within 3.

**Pipeline**

1. The review service holds a video and writes the queue item.
2. It sends a message to a new **`al-ummah-now-review-alerts`** queue with `max_batch_size: 1` and `max_batch_timeout: 1`, separate from video jobs (F3).
3. The processor picks the on-call reviewers who may see the item (senior only for minor items) and sends to their admin-app devices.
4. **Escalation.** If nobody claims the item in 2 minutes, alert every eligible reviewer. At 4 minutes, alert the seniors and the owner. All times are admin-managed.
5. When the item is claimed, a silent push clears the alert on the other reviewers' phones.

**Sender: FCM for both platforms (recommended).** FCM's HTTP v1 API is free, works over plain HTTPS from a Worker, and delivers to iPhones through the APNs key uploaded to Firebase. The registry already allows `fcm` on iOS. Sending to APNs directly needs HTTP/2 with a signed JWT; whether a Worker can do that reliably is unproven, so it would need a spike. The cost of FCM is one Google dependency. Alternative: direct APNs plus FCM for Android only.

**On the phone**

- iOS: interruption level **Time Sensitive** (breaks through Focus when the reviewer allows it). Critical Alerts need Apple's special approval and are not proposed.
- Android: a **"Review queue" notification channel** with high importance, separate from other channels, and high-priority FCM messages.
- Actions on the notification: **Open** and **Claim**. Approve and reject are never offered from the lock screen, because the reviewer has to look first.
- In the app, a live connection (the existing realtime server) keeps the queue current while it is open. No polling.

**Rota and quiet hours.** Admin-web gets an on-call rota: who is on call, by day and hour, in each reviewer's time zone. Off-call reviewers get no push but still see the queue. When nobody is on call, creators see the honest ETA from the queue (for example "usually within 2 hours" at night). The rota, escalation times, the target shown to creators and quiet hours are all admin-managed settings.

**Measured.** Every item records held, alerted, opened, claimed and decided times. Admin-web shows the median and 90th percentile time-to-decision per day, so the owner can see whether 5 minutes holds.

## Offline, undo and conflicts (AD8)

- **Reading offline:** the queue list (no media) is cached for display, marked "Offline, last updated 3 min ago". Media is never cached.
- **Deciding offline: not allowed.** Approve, reject, warn and suspend need the network, because the item may have been decided by someone else. Buttons say "You're offline" instead of queueing actions that may be stale.
- **Undo:** 10 s toast for approve, reject, hide, dismiss and warn. The server delays the side effects for the same 10 s, so undo is clean. After 10 s, a decision can only be reversed from History (Reverse decision), which is audited and notifies the creator.
- **Conflicts:** every decision sends the item's version. If another reviewer got there first, the app shows "Already approved by Name 20 s ago" and moves on.
- **Confirm sheet** (in-app, not a system alert) stays for ban, remove and suspend.

## Language, accessibility and theme (AD9)

- **en and ar** with full RTL mirroring from day one, using Core `aun-i18n` and the shared translation store. Arabic uses «مرئي/مرئيات» for video. English is the default; the language follows the device and can be changed in the app.
- **Accessibility:** VoiceOver and TalkBack labels on every control; Dynamic Type and font scaling to the largest sizes; every swipe action also has a button; the blur reveal is a labelled button; minimum 44 pt / 48 dp targets; WCAG AA contrast in both modes; reduced motion respected; haptics paired with visible change; the SLA countdown is announced at most once a minute, not every second.
- **Theme:** Light and Dark only, no System. The app follows the site's active theme (Fawanees today) like admin-web does.

## Distribution (AD10)

- **Apple: TestFlight internal testing.** Up to 100 App Store Connect users, no App Review. Each reviewer gets an App Store Connect account with the minimum role. Builds expire after 90 days, so a release at least every 60 days is planned. Later option: an Unlisted App Store app.
- **Android: Play internal testing.** Up to 100 testers by email, no review. **No public APK** on GitHub Releases: the repos are public and staff tools should not be one click away. CI artifacts stay private to the repo.
- **Credentials the owner supplies** (requested through the secrets flow, never in chat): App Store Connect API key and team id (shared with Studio), the Admin bundle id's provisioning, the Play upload key and service account, the APNs auth key (.p8) and the Firebase service account JSON for #414.
- **Release gate:** UI flow tests on CI against the local stack with seeded review items and the log-only push provider. One manual smoke per release on a real phone against prod with a test video, using the mocked AI provider path documented in AUN-VIDEO-REVIEW.

## Cost against the $500/month cap (AD11)

Judged at scale: 5,000 uploads a month, 10% held for a person, 20 reviewers.

| Item | Unit | At scale per month |
|---|---|---|
| FCM and APNs | Free | $0 |
| Alert queue | About 3 messages per held item (alert, escalation, clear) | 1,500 messages: under $0.01 |
| Worker requests | About 60 API calls per reviewed item | 30,000: under $0.01 |
| D1 writes | About 12 rows per item (claim, reveal, decision, audit, timings) | 6,000 writes: under $0.01 |
| Media for review | Reviewer previews at low resolution from R2 behind the CDN | under $0.50 |
| Realtime connections | One while the app is open | under $1 |
| Apple Developer Program, Play account | Already paid for Studio | $0 new |
| **Total new infra** | | **under $2/month** |

The main cost is people's time, as AUN-VIDEO-REVIEW says. A 5-minute target needs someone on call at all hours. With a rota and honest ETAs at night, it needs no new infra.

What would break the cap: polling. Twenty phones polling every 15 s would be 3.5 M requests and D1 reads a month for nothing. The design uses push plus a live connection while the app is open, and never polls.

## Build plan (after decisions)

| Step | Repo | What |
|---|---|---|
| 0a | AlUmmahNow | #414: FCM HTTP v1 sender (and Web Push) with owner credentials; `push_devices.app` column (F1); review-alert queue (F3) |
| 0b | AlUmmahNowAuth | Admin OAuth clients; `content_reviewer` and `senior_reviewer` roles; `prompt=login` + `max_age` + `auth_time` (F4) |
| 0c | AlUmmahNow | admin-api: `me` permissions, claim and renew, reveal audit, delayed side effects for undo, version checks, rota settings, admin devices list |
| 0d | AlUmmahNowCore | Admin API client and models from the admin-api OpenAPI |
| 1 | Apple, Android | Admin app Phase 1: sign-in, lock, review queue, review screen, alerts |
| 2 | Apple, Android | Reports and AI moderation queues |
| 3 | Apple, Android | Errors, Status, user and channel lookup, warn and suspend |

Each step updates this page and the AUN-VIDEO-REVIEW page. Steps 0a–0c are useful to admin-web too (Web Push alerts, claims, rota).

## Decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| AD1 | Separate Admin app, or admin mode inside Studio | **Separate app** in the same repos, sharing Core and Studio code |
| AD2 | Platforms | **iPhone, iPad and Android phone** first. No desktop admin app; admin-web gets Web Push alerts |
| AD3 | Review target shown to creators | **5 minutes while someone is on call**, the honest queue ETA otherwise. Update VR6 from 24 h |
| AD4 | Who gets review alerts | **An admin-managed on-call rota** with escalation at 2 min (all eligible reviewers) and 4 min (seniors and owner) |
| AD5 | Step-up for high-risk actions | **Device unlock to open; re-sign-in within 15 min** for suspend, ban, minor-item reveal and escalated approvals |
| AD6 | Second factor for staff accounts | **Passkeys required for staff roles**, as an Auth epic, before the app goes beyond the owner |
| AD7 | Push sender | **FCM for Android and iOS** (APNs key in Firebase). Alternative: direct APNs after a spike |
| AD8 | Offline decisions | **Not allowed**: read-only offline list, no media cache, 10 s undo with delayed side effects |
| AD9 | Arabic and RTL | **en and ar with RTL from the first build** |
| AD10 | Distribution | **TestFlight internal and Play internal only**; no public APK |
| AD11 | Phase order | **Review queue first**, then reports and AI moderation, then Errors, Status and lookup |
| AD12 | Wellbeing features | **Grayscale option and a break reminder** at 20 min, admin-managed |
| AD13 | Senior-only minor items | **Server never sends them to non-seniors**, including push and thumbnails; every reveal needs step-up |
| AD14 | App name | **"Al Ummah Now Admin"**, Arabic name from the brand translations, with the admin favicon art, cropped and resized only |
