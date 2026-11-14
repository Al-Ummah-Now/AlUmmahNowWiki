[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Native admin app (mobile-first moderation)

| | |
|---|---|
| **ID** | `AUN-ADMIN-NATIVE` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md) (iPhone, iPad, macOS), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) (Windows), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNow](../repos/AlUmmahNow.md) (admin-api, processor push, api-videos devices), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) (OAuth clients, roles, step-up) |
| **Status** | **in progress**: v1 spec, owner decisions AD1–AD14 recorded 2026-11-13. Phase 1 shipped on iPhone/iPad/macOS, Windows and Android phone, on fixtures until the review API deploys (see the Progress sections) |
| **Last updated** | 2026-11-13 |

Read from AlUmmahNow `origin/main` [`4029d59`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/4029d5971), the Apple, Android, Desktop and Core repos, and [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md) on 2026-11-13. Builds on [Epic 9](E09-native-platform-foundations.md) (push registry), [Epic 18](E18-studio-mobile.md) (Studio mobile), [Epic 19](E19-studio-desktop.md) (Studio desktop), [Epic 28](E28-ai-moderation.md) (AI moderation) and [CHAT-ERRORS](CHAT-ERRORS-error-reporting.md). Passkeys are their own epic: [AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md).

## Why

Admin is web only (admin-web + admin-api). The pre-publication review (AUN-VIDEO-REVIEW) holds a flagged video until a person approves it. Creators see "usually within 5 minutes" (VR6). A reviewer at a desk cannot meet that. A reviewer whose phone or computer alerts the moment a video is held can.

## Rules this spec keeps

- **Never Stripe.** The app has no payments at all.
- **Every feature is admin-managed.** Who gets alerts, the on-call rota, quiet hours, escalation times, reject reasons and wellbeing settings are admin-web settings. Which queues a person sees comes from their roles and permissions. Nothing is hard-coded per person.
- **No system prompts for decisions.** Destructive actions use the app's own accessible dialog (a sheet), never a bare system alert.
- **Undo over confirm.** Reversible actions take effect at once and show an undo toast. Confirm stays only for ban, remove, suspend, transfer and permanent delete, as in admin-web.
- **Every search is a live autocomplete** that opens with results, using the existing `/suggest` endpoints.
- **Light and Dark only.** No System option. The first launch follows the device; after that, the last explicit choice.
- **Media is never stored.** Owner: *"never cache or download on phone or native app ever, only encrypted stream."* See [Media handling](#media-handling).
- **Tests make no real AI calls** and send no real pushes. Tests use the local stack and the log-only push provider.
- **$500/month cap at scale.** Judged per review item, not against today's small numbers.

## What exists today

| Piece | State | Where |
|---|---|---|
| Native Studio apps | Studio MVP on iPhone, iPad and Android: SSO with several accounts, upload, manage, bulk edit, analytics, en/ar. Desktop Studio on Windows and Linux in preview | Apple `Apps/StudioIOS`, `Apps/StudioMac`; Android `studio-mobile`; Desktop `AlUmmahNow.Studio.*` |
| Shared Core | Rust core with `aun-api`, `aun-auth`, `aun-i18n`, `aun-sync`, `aun-telemetry` and others; v0.3.0-rc.1 | AlUmmahNowCore |
| Viewer and Studio are separate apps | Separate targets and bundle ids | Apple `Apps/*`; Android `viewer-mobile`, `studio-mobile` |
| Push device registry | `PUT/DELETE /api/v1/devices/:installId`; table `push_devices`; at most 20 devices per user; platforms include `macos` (apns) and `windows` (wns) | api-videos `lib/push-devices.ts`; processor `migrations-notifications/0003` |
| Push senders | One interface for APNs, FCM, WNS and Web Push. **All four are log-only**: no credentials yet | processor `src/push/provider.ts`; [#414](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/414) |
| Push latency | Push dispatch rides `al-ummah-now-videos` with `max_batch_timeout: 30` s | processor `wrangler.jsonc` |
| Admin roles | `super_admin`, `admin`, `moderator`; permissions per role in one table; `permissionsFor(roles)` | admin-api `lib/roles.ts` |
| Admin queues | Reports (Action needed / History), AI moderation, Errors, Status, Users, Channels, Abuse | admin-web `(protected)/*`; admin-api routers |
| Suspend and delete | Videos admin sends a moderation request to Auth (`auth_requests:send`, admins only) | admin-api `authRequests.router.ts` |
| Second factor | **None.** No MFA, passkeys, `max_age` or `auth_time` | AlUmmahNowAuth |

### Findings

| # | Finding | Tracked |
|---|---|---|
| F1 | The push registry does not record which app a device belongs to. APNs needs the topic (bundle id) of the app that registered | [#1264](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1264) |
| F2 | All push senders are log-only. Nothing reaches a device today | [#414](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/414) |
| F3 | Push waits up to 30 s in a shared batch queue behind video jobs | [#1265](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1265) |
| F4 | Staff accounts have no second factor and Auth cannot ask for a recent sign-in | [AlUmmahNowAuth#361](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/361), [AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md) |
| F5 | The review spec said a 24 h target | Fixed: VR6 is now 5 minutes |

## Summary of the decided design

A **separate "Al Ummah Now Admin" app** on **iPhone, iPad, Android phone, macOS and Windows**, inside the existing Apple, Android and Desktop repos, sharing Core and the Studio sign-in, player and i18n code. Distributed **only internally**: TestFlight internal, Play internal testing, and signed desktop builds through internal distribution. **Same SSO** with new native OAuth clients, a server-side role check on every call, device unlock to open, a **passkey required for staff** ([AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md)), and a sign-in within 15 minutes for high-risk actions. Alerts go **straight to APNs** for iPhone, iPad and macOS, **FCM** for Android and **WNS** for Windows, on a dedicated review-alert queue with an on-call rota and escalation. Decisions take effect **immediately**; Undo reverses them and tells the creator. Media is **streamed encrypted and never stored**. Phase 1 is the video review queue; reports and AI moderation follow; Errors, Status and user lookup come last.

## Separate app (AD1, decided)

| | Separate Admin app (chosen) | Admin mode inside Studio |
|---|---|---|
| Who installs it | About 5–50 staff | Every creator |
| Store review | Internal distribution only: no App Review, no Play review, no demo account | Public Studio would ship moderation screens to the stores |
| Push | Its own bundle id and channel, separate from a creator's own notifications | Shared with creator alerts |
| Lock and media rules | Strict for every screen | Would hit every creator, or need two modes |
| Build cost | One more target per platform; about 70% of the code shared | Least code |

## Platforms (AD2, decided: changed)

| Platform | Built from | Notes |
|---|---|---|
| iPhone, iPad | AlUmmahNowApple, new `Apps/AdminIOS` | iPad gets a split view: queue left, item right |
| Android phone | AlUmmahNowAndroid, new `admin-mobile` module | Android tablets run the phone build |
| macOS | AlUmmahNowApple, new `Apps/AdminMac` (SwiftUI, shares AdminIOS views) | Keyboard shortcuts for every decision |
| Windows | AlUmmahNowDesktop, new `AlUmmahNow.Admin.Windows` (shares the Studio Windows shell) | Keyboard shortcuts; WNS alerts |

Not planned: Linux admin app, TV. admin-web stays the full tool and can also offer Web Push alerts.

## Scope

### Phase 1: video review

1. **Sign-in and lock.** SSO with a staff passkey, role check, device unlock (Face ID, Touch ID, fingerprint, Windows Hello or device passcode) on open and after 5 minutes in the background.
2. **Review queue.** Action needed / History, grouped by item, sorted by SLA deadline then risk, as in admin-web. Each row shows the time left, the reasons (NSFW, minor present, extremism, metadata) and the channel's trust level. Live autocomplete search over titles, channels and reasons; filters in a deep link.
3. **Claim.** Opening an item claims it so two reviewers never review the same video. The claim lasts 3 minutes and renews while the item is open. Others see "Being reviewed by Name".
4. **Review screen.** Player, frame strip with flagged frames first, AI reasons and scores, transcript snippet, metadata and thumbnail, channel history. Everything NSFW is **blurred by default**.
5. **Decide.** Approve, Reject with a reason (admin-managed list), Escalate to senior, Request changes. See [Undo](#offline-undo-and-conflicts-ad8-decided-changed).
6. **Alerts** the moment a video is held, with escalation.
7. **Audit.** Every claim, reveal, decision, undo and capture event is in the audit log with the device install id.

### Phase 2: reports and AI moderation

8. **Reports queue** (Action needed / History): hide or unhide, dismiss, warn user, escalate, open the reported item. Same blur and reveal rules.
9. **AI moderation queue** (Epic 28 flags on comments, posts, images, avatars and banners): approve, remove, warn.
10. **Warn user** uses the existing admin-web action: a notice to the user, a warning in their history and an audit entry.

### Phase 3: operations and people

11. **Errors**: groups with Acknowledge, Resolve, Ignore and Assign (`errors:read`, `errors:manage`). Optional alert when a new error group crosses the threshold.
12. **Status**: checks and incidents; post and update an incident (`status:manage`).
13. **User and channel lookup**: live autocomplete that opens with recent results, then a profile with history, warnings, videos and reports.
14. **Suspend and unsuspend** a user or channel through the existing Auth moderation request, with step-up and the in-app confirm sheet.

Out of scope: platform settings, themes, plans, translations, sites, live operations, permanent deletes, payments. They stay in admin-web.

## Media handling

Owner: *"never cache or download on phone or native app ever, only encrypted stream."* This applies to every video, frame, thumbnail, avatar and image the admin app shows, flagged or not.

- **Encrypted streaming only.** Media arrives over TLS from short-lived signed URLs (a few minutes) issued by admin-api per item and per reviewer. Signed URLs are never stored, logged or put in a push.
- **Nothing on disk, ever.** No file downloads, no "save" or "share", no drag out of the window on desktop, no photo library access.
- **No OS cache.**
  - Apple: `URLSession` with an ephemeral configuration and `URLCache` of zero disk capacity; AVPlayer streams without `AVAssetDownloadTask` or offline assets; images decoded in memory only.
  - Android: ExoPlayer/Media3 without `SimpleCache`; OkHttp and the image loader with no disk cache; no `MediaStore` writes.
  - Windows: WebView2 or the media player with the HTTP cache off and no `StorageFile` writes; a temporary in-memory stream only.
  - The app-switcher snapshot is an OS cache too: the app shows a plain cover before the OS takes it (iOS `sceneWillResignActive`, Android `FLAG_SECURE` also hides recents, macOS and Windows hide content when minimised).
- **Block screen capture where the OS allows it.**
  - Android: `FLAG_SECURE` on every window of the app. Screenshots and recordings come out black.
  - macOS: `NSWindow.sharingType = .none` on every window.
  - Windows: `SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)` on every window.
  - iOS and iPadOS cannot block screenshots. The app watches `UIScreen.capturedDidChangeNotification` and `userDidTakeScreenshotNotification`: during recording, mirroring or AirPlay every item blurs; after a screenshot the item blurs and the event is audited.
- **Blur by default** for anything flagged NSFW or minor present, applied on the device to a low-resolution preview stream. Full resolution streams only after a reveal.
- **Reveal is per item and audited.** A labelled "Show" button reveals one item. The server logs who, which item, when, from which device and why it was flagged. The item blurs again when the reviewer leaves it, the app goes to the background, or after 60 s without interaction.
- **Senior-only minor items.** Items flagged "minor present" are visible only to the senior reviewer role. The server never sends them, their media URLs or their alerts to anyone else. UI hiding is a second layer, not the control. Every reveal of one needs a sign-in within 15 minutes.
- **Nothing sensitive in a notification.** "Video held for review · NSFW · 4 min left". No title, channel, thumbnail or notification attachment.
- **Wellbeing (AD12).** Grayscale for revealed items and a break reminder after 20 minutes of continuous review, both admin-managed settings.

## Auth (AD5, AD6, decided)

- **Same SSO.** Sign-in through the system browser sheet with PKCE, like Studio. New public OAuth clients "Admin (iOS)", "Admin (Android)", "Admin (macOS)" and "Admin (Windows)" with redirect `alummahnow-admin://auth/callback`, one set per environment.
- **Role check on the server, every call.** The app calls a `me` endpoint that returns `permissionsFor(roles)` and shows only the tabs a person can use. Someone without a staff role sees "This app is for Al Ummah Now staff" and a sign-out button.
- **New roles** (VR7): `content_reviewer` and `senior_reviewer`, added to the existing permission table.
- **Passkey required for staff** (AD6). Every user on every site and app can sign in with a passkey; staff must. Specified in [AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md). The admin app and admin-api reject a staff token whose `amr` lacks `passkey`.
- **Device unlock** on open and after 5 minutes in the background. A device without a passcode cannot sign in.
- **Step-up within 15 minutes** (AD5) for suspend, unsuspend, ban, revealing a minor item and approving an escalated item. The app reopens sign-in with `prompt=login&max_age=900` (a passkey prompt), and admin-api checks `auth_time`.
- **Session length.** Refresh tokens last 7 days. Signing out on any device, or losing a staff role, revokes the token and the push device.
- **Lost device.** admin-web lists each reviewer's admin devices with "Sign out this device".

## Alerts and the 5-minute target (AD3, AD4, AD7, decided)

Creators see "usually within 5 minutes" while someone is on call, and the live queue time otherwise. Budget: alert out in under 30 s, reviewer opens within 2 minutes, decision within 3.

**Pipeline**

1. The review service holds a video and writes the queue item.
2. It sends a message to a new `al-ummah-now-review-alerts` queue with `max_batch_size: 1` and `max_batch_timeout: 1` (F3).
3. The processor picks the on-call reviewers who may see the item (seniors only for minor items) and sends to their admin-app devices.
4. **Escalation.** Unclaimed after 2 minutes: alert every eligible reviewer. After 4 minutes: alert the seniors and the owner. Times are admin-managed.
5. When the item is claimed, a silent push clears the alert on the other reviewers' devices.

**Senders (AD7, changed)**

| Platform | Sender | Notes |
|---|---|---|
| iPhone, iPad, macOS | **Direct APNs** | Token-based auth (.p8 key, ES256 JWT renewed every 20–60 minutes), topic = the Admin bundle id (F1). APNs speaks only HTTP/2, so step 0 is a spike that proves a Worker's `fetch` reaches `api.push.apple.com` reliably. If it does not, a small HTTP/2 relay (a Cloudflare Container) sends for the Worker |
| Android | **FCM** HTTP v1 | Service account JSON in Secrets Store |
| Windows | **WNS** | Already in the registry (`windows` → `wns`); package secret from the owner |

**On the device**

- iOS and iPadOS: interruption level **Time Sensitive**. Critical Alerts need Apple's approval and are not used.
- macOS: Time Sensitive banner. Windows: a high-priority toast in an "Admin · Review queue" group.
- Android: a **"Review queue" notification channel** with high importance and high-priority FCM messages.
- Notification actions: **Open** and **Claim**. Approve and reject are never offered from a notification.
- While the app is open, the existing realtime server keeps the queue live. No polling.

**Rota and quiet hours.** admin-web gets an on-call rota by day and hour in each reviewer's time zone. Off-call reviewers get no alerts but still see the queue.

**Measured.** Every item records held, alerted, opened, claimed and decided times. admin-web shows median and 90th-percentile time to decision per day.

## Offline, undo and conflicts (AD8, decided: changed)

- **Decisions take effect immediately.** Approve publishes at once; subscribers and the creator are told at once. Reject keeps the video private and tells the creator at once.
- **Undo reverses afterwards.** A 10 s undo toast follows every decision; after that, History has "Reverse decision". Either way:
  - **Undo an approve:** the video goes back to In review and private, the new-video notifications that were sent are withdrawn from subscribers' inboxes, and the creator gets a correction ("Your video is back in review; the earlier approval was a mistake").
  - **Undo a reject:** the video goes back to In review (or is approved, if that was the reviewer's next action), and the creator gets a correction.
  - Every undo is audited with both decisions.
- **No decisions offline.** The queue list (text only, no media) shows "Offline, last updated 3 min ago". Decision buttons say "You're offline". Nothing is queued to send later.
- **Conflicts:** every decision sends the item's version. If another reviewer got there first, the app shows "Already approved by Name 20 s ago".
- **Confirm sheet** (in-app) stays for ban, remove and suspend.

## Language, accessibility and theme (AD9, decided)

- **en and ar** with full RTL from the first build, using Core `aun-i18n` and the shared translation store. Arabic uses «مرئي/مرئيات» for video. English by default; the language follows the device and can be changed in the app.
- **Accessibility:** VoiceOver, TalkBack and Narrator labels on every control; Dynamic Type and font scaling to the largest sizes; every swipe action also has a button; full keyboard use on macOS and Windows; the reveal is a labelled button; 44 pt / 48 dp targets; WCAG AA contrast in both modes; reduced motion respected; the SLA countdown is announced at most once a minute.
- **Theme:** Light and Dark only, no System. Follows the site's active theme (Fawanees today) like admin-web.

## Distribution (AD10, decided)

- **iPhone, iPad and macOS: TestFlight internal testing.** Up to 100 App Store Connect users, no App Review. Builds expire after 90 days, so a release at least every 60 days.
- **Android: Play internal testing.** Up to 100 testers, no review.
- **Windows: signed internal builds.** An MSIX signed with the owner's code-signing certificate, delivered through an internal channel (a private, access-controlled download for signed-in staff, or the Microsoft Store private audience if the owner prefers). No public download.
- **No public builds anywhere.** No GitHub Releases for the admin app, since the repos are public. CI artifacts stay private.
- **Credentials the owner supplies** (through the secrets flow, never in chat): App Store Connect API key and team id, Admin bundle ids and provisioning (iOS and macOS), the APNs .p8 key and key id, the Play upload key and service account, the Firebase service account, the WNS package secret, and the Windows code-signing certificate.
- **Release gate:** UI flow tests on CI against the local stack with seeded review items and the log-only push provider. One manual smoke per release per platform against prod with a test video, on the mocked-AI path from AUN-VIDEO-REVIEW.

## Cost against the $500/month cap (AD11)

At scale: 5,000 uploads a month, 10% held, 20 reviewers.

| Item | Unit | Per month |
|---|---|---|
| APNs, FCM, WNS | Free | $0 |
| Alert queue | About 3 messages per held item | under $0.01 |
| Worker requests | About 60 calls per reviewed item | under $0.01 |
| D1 writes | About 12 rows per item (claim, reveal, decision, audit, timings) | under $0.01 |
| Review media streamed from R2 | Low-resolution previews, nothing cached on devices | under $0.50 |
| Realtime connections | One while the app is open | under $1 |
| APNs HTTP/2 relay, only if the spike fails | One small Container | under $5 |
| Apple and Play accounts | Already paid for Studio | $0 |
| **Total new infra** | | **under $2/month** (under $7 with the relay) |

Never caching means every review streams again. At 500 held items a month that is still small. The real cost is people on call. The design never polls.

## Progress: Windows, phase 1 (2026-11-13)

Shipped on AlUmmahNowDesktop `main` ([#41](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/41), `5159426`); details in its `docs/ADMIN_WINDOWS.md`.

- **Projects**: `AlUmmahNow.Admin` (shared, tested) and `AlUmmahNow.Admin.Windows` (WinUI 3, shares the Studio Windows CoreBridge, i18n and environment).
- **Auth**: OAuth client "Admin (Windows)" ([AlUmmahNowAuth#365](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/365), migration `0039`; QA `306b6f10-…`, stage/prod `288b80b9-…`), system browser + PKCE, `alummahnow-admin://auth/callback` through the protocol registration and a single-instance redirect. `GET /api/me` decides staff. Windows Hello on open and after 5 minutes minimised or locked. Step-up adds `max_age=900` to Core's authorize URL until Core has a step-up prompt ([AlUmmahNowCore#42](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/42)).
- **Queue**: built on the [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md) contract (admin-api #1280, #1297 field names), with a demo queue until the routes are deployed. Order SLA then risk, live search with suggestions, claim renewed every 90 s, Approve / Reject / Request changes (reason) / Escalate, 10-second undo, "Already approved by Name", text-only offline, single-key shortcuts (A R C E U S J K, `?` lists them).
- **Media rule**: HLS/DASH only (progressive files are refused: Media Foundation's network source can keep a disk cache), no-cache HTTP stack, frames decoded from memory, `WDA_EXCLUDEFROMCAPTURE`, hidden while minimised, audited Show for NSFW/minor with re-blur. CI streams a loopback HLS video and fails if its bytes are found anywhere on disk.
- **Push**: registration with `app: "admin"`, `provider: "wns"`; toast `open:`/`claim:` and raw `review_clear` handled. Off until the owner supplies the Partner Center identity. The server toast has no "Admin · Review queue" header yet ([AlUmmahNow#1307](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1307)).
- **Distribution**: `release-admin-windows.yml` (tag `admin-windows-v1.2.3` on main) builds and signs the MSIX and uploads it to a private R2 bucket; never GitHub Releases or workflow artifacts. It stops at its gate until these owner secrets exist: `ADMIN_WINDOWS_CERT_PFX_BASE64` + `ADMIN_WINDOWS_CERT_PASSWORD` (code-signing certificate), `ADMIN_WINDOWS_PACKAGE_NAME` + `ADMIN_WINDOWS_PUBLISHER` (Partner Center identity), `ADMIN_RELEASE_BUCKET`; the processor needs `WNS_PACKAGE_SID` + `WNS_CLIENT_SECRET` of that identity.
- No screenshot audit on Windows: the OS gives no screenshot event, and capture is blocked instead.

## Progress: Android phone, phase 1 (2026-11-13)

Shipped on AlUmmahNowAndroid `main` ([#22](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/22), `9ce807d`), module `admin-mobile` (`net.alummahnow.admin`, QA `net.alummahnow.admin.qa`). It shares `core-bridge`, `player`, `design` and the Studio sign-in.

- **Auth**: OAuth client "Admin (Android)" ([AlUmmahNowAuth#369](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/369), merged `163daa2`, migration `0040`; QA `5b44a4f7-…`, stage/prod `6634c4c9-…`). Sign-in runs in a Custom Tab with PKCE and returns on `alummahnow-admin://auth/callback`. Tokens sit in their own Keystore store, apart from Studio's. `GET /api/me` decides staff. The device unlock (BiometricPrompt or device credential) runs on open and after 5 minutes in the background, and sign-in is refused without a secure lock screen. Step-up adds `prompt=login&max_age=900` before revealing a minor item, before approving an escalated one, and when the server answers `step_up_required`.
- **Queue**: built on the VIDEO-REVIEW contract, with `FixtureReviewService` until the routes deploy. Order: escalated, then SLA, then risk. Live search. The claim is renewed every minute. Approve / Reject (reason) / Request changes / Escalate, a 10-second Undo toast, Reverse in History, "Already approved by Name". No decisions offline, and the offline list is text only, held in memory.
- **Media rule**: Media3 over a TLS-only, no-store OkHttp client (no `SimpleCache`, no downloads). The Coil image loader is memory-only, frames are decoded from memory, and there is no MediaStore, share or save. `FLAG_SECURE` is on every window. Android 14+ screenshot attempts are audited and re-blur the item. NSFW/minor items need an audited Show and blur again on leave, background, capture and 60 s idle. Debug builds only may use cleartext to loopback (local stack and tests). Robolectric and on-device tests fail if streamed or loaded media lands anywhere in the app's directories. A source test fails on cache, download or share APIs.
- **Push**: FCM on the `review_queue` channel (high importance). Actions are Open and Claim, with no images. `review_clear` removes the alert. The app registers with `app: "admin"`, `provider: "fcm"`. Without the owner's `google-services.json` the app builds and runs with alerts off, and Settings says so.
- **Distribution**: Play internal testing only, from the `play` job of `release.yml`. It never goes into a GitHub Release, and the CI APK artifact leaves it out. The `play` job stays gated until the owner provides: the upload key secrets `AUN_UPLOAD_KEYSTORE_BASE64`, `AUN_UPLOAD_KEYSTORE_PASSWORD`, `AUN_UPLOAD_KEY_ALIAS`, `AUN_UPLOAD_KEY_PASSWORD`; `PLAY_SERVICE_ACCOUNT_JSON` with Release manager on the app; the app `net.alummahnow.admin` created in Play Console with its first bundle uploaded there, after which the repo variable `ADMIN_PLAY_READY=true` is set; and `ADMIN_GOOGLE_SERVICES_JSON`, the Firebase config for `net.alummahnow.admin` and `.qa`, plus the matching FCM service account for the processor ([AlUmmahNow#1264](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1264)).

## Progress: iPhone, iPad and macOS, phase 1 (2026-11-13)

Shipped on AlUmmahNowApple `main` ([#33](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/33), `2a7b5bd`): targets `AdminIOS` (`net.alummahnow.admin`, QA `.admin.qa`) and `AdminMac` (`net.alummahnow.admin.mac`, QA `.admin.mac.qa`) and the package `AUNAdmin`. They share the Studio sign-in, player, i18n and design packages.

- **Auth**: public clients "Admin (iOS)" and "Admin (macOS)" ([AlUmmahNowAuth#362](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/362), merged). Sign-in runs in ASWebAuthenticationSession with PKCE on `alummahnow-admin://auth/callback`. Anyone without a staff role sees "This app is for Al Ummah Now staff" and a sign-out button. The device unlock runs on open and after 5 minutes in the background, and sign-in is refused without a passcode. Step-up adds `prompt=login&max_age=900`.
- **Queue**: built on the VIDEO-REVIEW contract with `FixtureReviewService` until the routes deploy (AlUmmahNow#1269/#1270). There are Action needed and History tabs, ordered escalated, then SLA, then risk. Search is live, and a 3-minute claim is renewed. Approve / Reject (reason) / Request changes / Escalate have a 10-second Undo, and a conflict says "Already approved by Name". When offline, the list is text only and decisions are off.
- **Media rule**: an ephemeral URLSession and a URLCache with no disk. Images are decoded in memory only, with no save, share or drag-out, and signed URLs are never stored or logged. The app switcher shows a cover. macOS sets `sharingType = .none`; on iOS the content blurs while the screen is captured and after a screenshot, with an audit event. NSFW and minor items need an audited Show and blur again after 60 s idle or on leave. There is no Now Playing, AirPlay or PiP. `PrivateMediaSessionTests` fails if a media response lands in a disk cache.
- **Push**: APNs, registered with `app: "admin"` through `PUT /api/v1/devices/:installId`. Alerts are Time Sensitive with Open and Claim actions and no attachments. A silent push clears delivered alerts.
- **CI**: the `admin` job (iPhone unit and UI flows, then iPad UI flows) and the `admin-mac` job run on fixtures only, with no network, pushes or AI.
- **Distribution**: TestFlight internal testing only, from `admin-release.yml` on `admin-vX.Y.Z` tags from main. There is no GitHub Release, artifact or `.dmg`. Without these the workflow builds unsigned and uploads nothing. The owner provides: the secrets `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (team key, role Admin); App IDs `net.alummahnow.admin`, `.admin.qa`, `.admin.mac`, `.admin.mac.qa`, each with Push Notifications and Time Sensitive Notifications (Mac: App Sandbox with outgoing network); App Store distribution profiles for the four; four App Store Connect records ("Al Ummah Now Admin" and "… QA", iOS and macOS) with an internal staff group; and one APNs `.p8` key for the processor, through the secrets flow. Full list: AlUmmahNowApple `docs/RELEASING.md`, "Releasing Al Ummah Now Admin".

## Build plan (when the owner says go)

| Step | Repo | What |
|---|---|---|
| 0a | AlUmmahNow | APNs HTTP/2 spike from a Worker; APNs, FCM and WNS senders with owner credentials (#414); `push_devices.app` column (#1264); review-alert queue (#1265) |
| 0b | AlUmmahNowAuth, openauth | [AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md) staff phase; admin OAuth clients; reviewer roles; `prompt=login`, `max_age`, `auth_time`, `amr` (AlUmmahNowAuth#361) |
| 0c | AlUmmahNow | admin-api: `me` permissions, claim and renew, reveal and capture audit, per-item signed stream URLs, undo with notification withdrawal and creator correction, version checks, rota settings, admin devices list |
| 0d | AlUmmahNowCore | Admin API client and models from the admin-api OpenAPI |
| 1 | Apple, Android, Desktop | Phase 1 on iPhone, iPad, Android, macOS and Windows: sign-in, lock, review queue, review screen, alerts |
| 2 | Apple, Android, Desktop | Reports and AI moderation queues |
| 3 | Apple, Android, Desktop | Errors, Status, user and channel lookup, warn and suspend |

Each step updates this page and the AUN-VIDEO-REVIEW page.

## Owner decisions (2026-11-13)

| # | Decision | Owner answer |
|---|---|---|
| AD1 | Separate app or admin mode in Studio | **Separate app**, sharing Core and Studio code |
| AD2 | Platforms | **Changed: iPhone, iPad, Android phone, macOS and Windows** |
| AD3 | Target shown to creators | **5 minutes while someone is on call**, live queue time otherwise (VR6 updated) |
| AD4 | Who gets review alerts | **Admin-managed on-call rota**, escalation at 2 min (all eligible) and 4 min (seniors and owner) |
| AD5 | Step-up | **Device unlock to open; sign-in within 15 min** for suspend, ban, minor-item reveal and escalated approvals |
| AD6 | Second factor | **Changed: passkeys for all users on every site and native app, required for staff.** Specified as [AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md) |
| AD7 | Push sender | **Changed: direct APNs for iPhone, iPad and macOS; FCM for Android only.** Windows uses WNS |
| AD8 | Undo and offline | **Changed: no delay.** Decisions take effect immediately; Undo reverses afterwards and sends the creator a correction. No decisions offline. **Media is never cached or downloaded, only streamed encrypted**; no OS cache; capture blocked where the OS allows |
| AD9 | Arabic and RTL | **en and ar with RTL from the first build** |
| AD10 | Distribution | **Internal only**: TestFlight internal, Play internal, signed internal desktop builds; no public download |
| AD11 | Phase order | **Review queue first**, then reports and AI moderation, then Errors, Status and lookup |
| AD12 | Reviewer wellbeing | **Grayscale option and a 20-minute break reminder**, admin-managed |
| AD13 | Minor items | **Server never sends them to non-seniors**; every reveal needs step-up |
| AD14 | App name | **"Al Ummah Now Admin"**, Arabic name from the brand translations, admin icon art cropped and resized only |
