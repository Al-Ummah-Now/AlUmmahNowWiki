[← Home](../README.md) · [Store release checklist](store-release-checklist.md) · [Product rules](product-rules.md) · [Epic 20](../epics/E20-system-parental-controls.md)

# Store compliance checklist

This page tracks what the App Store and Google Play require of our apps, and where each app stands. The [store release checklist](store-release-checklist.md) covers what the owner pastes into the consoles; this page covers what the apps themselves must do.

**Last full audit:** 2026-11-24, against App Store Review Guidelines "Last Updated: October 16, 2026" and the Play Developer Policy Center (2026-10-29 update). Re-check at every release and whenever a feature adds sign-in, writing, money, a permission, an SDK or a network call.

## Apps

| App | Store | Bundle ID / package |
|---|---|---|
| Viewer (iPhone, iPad) | App Store | `net.alummahnow.viewer` |
| Viewer for Mac | Mac App Store | `net.alummahnow.viewer.mac` |
| Viewer TV | App Store (tvOS) | `net.alummahnow.viewer.tv` |
| Studio (iPhone, iPad) | App Store | `net.alummahnow.studio` |
| Studio for Mac | Developer ID, outside the store | `net.alummahnow.studio.mac` |
| Admin (iOS, Mac, Android) | Internal testing only | `net.alummahnow.admin`, `.admin.mac` |
| Viewer (Android) | Google Play | `net.alummahnow.app` |
| TV (Android TV, Fire TV) | Play, Amazon | `net.alummahnow.tv` |
| Studio (Android) | Google Play | `net.alummahnow.studio` |

Desktop ships through the Microsoft Store, Flatpak and Samsung, never the Mac App Store.

## Status (2026-11-25)

"On main" means merged and in the next release of that app; no Android build has been released since 2026-11-11.

| Requirement | Apple | Android | Tracked in |
|---|---|---|---|
| Report and block in every app that shows other people's content (videos, channels, chat, comments) | In review ([Apple#99](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/99)) | On main ([Android#70](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/70)); the report page it opens is live ([#1934](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1934)). The TV app shows no content yet | [Apple#91](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/91), [Android#61](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/61), [#1912](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1912), [#1934](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1934) |
| Delete the account from inside every app that can create one | In review ([Apple#97](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/97)) | On main ([Android#68](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/68)) | [Apple#92](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/92), [Android#62](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/62) |
| A web page to delete the account (Play Data safety URL) | — | Live ([Auth#533](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/533), [#1933](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1933)) | [Auth#532](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/532) |
| A privacy policy page and terms page, linked in the listing and in the app | Page live ([UI#155](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/155)); app link in review ([Apple#98](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/98)) | Page live ([UI#155](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/155)); app links on main ([Android#69](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/69)). TV: [Android#71](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/71) | [#1929](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1929), [Apple#93](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/93), [Android#61](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/61) (viewer), [Android#65](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/65) (Studio) |
| Help and contact link in the app | In review ([Apple#98](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/98)) | On main ([Android#69](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/69)). TV: [Android#71](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/71) | [Apple#93](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/93), [Android#61](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/61), [Android#65](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/65) |
| Terms accepted before the first upload or channel (Studio) | In review ([#1931](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1931), [Apple#98](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/98)) | App on main ([Android#69](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/69), [Android#72](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/72)); server in review ([#1931](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1931)) | [Android#65](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/65), [Apple#93](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/93), [#1929](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1929) |
| Privacy manifests with required-reason APIs | On main | — | [Apple#90](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/90) |
| Studio held comments can be acted on in the app | Read-only | Read-only | [Apple#94](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/94), [Android#63](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/63) |
| Export compliance answer true for apps that link aun-core | To decide | — | [Apple#95](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/95) |
| Play declarations: foreground services, financial features | — | Steps written; the owner fills them in the Console | [Android#64](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/64) |
| Switch-gated features visible to App Review | Process to adopt | Same | [#1930](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1930) |
| Privacy labels and Data safety match the code | Yes (`store/apple/app-privacy.md`) | In review ([Android#76](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/76), `store/play/data-safety.md`): the viewer declares Device or other IDs, processed ephemerally (the live viewer ID). TV: nothing collected | — |
| Age rating 13+, answers recorded | Yes (`store/apple/age-rating.md`) | Yes (`store/play/content-rating.md`) | [E20](../epics/E20-system-parental-controls.md) |
| Target SDK / build SDK | Xcode 27.1 | targetSdk 37, 16 KB pages | — |
| No payments in the apps | Yes | Yes | — |

When an item is done, update its row in the same PR.

## The checklist

### User-generated content (Apple 1.2, Play UGC)

Applies to any app that **shows** content from users, not only apps where people write. Creators' videos count.

- [ ] Report on every video, channel, comment, chat message and post the app shows, sent to the existing report queue (videos admin → Reports).
- [ ] Block a user or channel, everywhere people can see each other's content.
- [ ] Filtering: comment holds, word lists and AI moderation run on the server for content shown in the apps.
- [ ] Contact: Help and contact in the app's menu.
- [ ] Terms accepted before a person first creates content from an app (Play): Studio's first upload or channel today, and the first comment, chat message or post when an app adds writing.
  The server asks for it behind the super admins' switch `creatorTerms` (Features page, default **off**, [#1931](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1931)); it stays off until the native Studio apps can accept. See [Creator Terms](#creator-terms-creatorterms).
- [ ] Before the first post from an app: date of birth asked (E20 §5.2), and the app's age rating answers changed in the same PR (Apple "Messaging and chat", Play "Users interact").
- [ ] Content above the app's 13+ rating (age-restricted videos) plays only for a signed-in 18+ account (Apple 1.2.1(a), E20 §5.4). Made-for-kids videos have comments and chat off.

#### Creator Terms (`creatorTerms`)

- **Who:** each account accepts the Terms of Service («شروط الاستخدام») and Community Guidelines once per version, super admins included. Staff imports and system jobs are exempt. Table `creator_terms_acceptances` (one row per account, read by primary key; in the privacy export, erased with the account).
- **What is refused** until then (`403 terms_required`; `503` when the switch or the table can't be read): uploading (single, batch, Move from YouTube), creating a channel, a new live stream, its encoder settings and going live, scheduling, starting or changing a premiere, opening a draft or private video (single, bulk and bulk undo), scheduling and publish now, adding an audio track. Closing a video and editing an open one are not refused. In a bulk request one video that can't be read fails alone.
- **Stream keys** handed out before the switch, or before a new version, keep working until that stream ends.
- **Accepting:** `POST /api/me/creator/terms` with the version shown. `409 terms_version_changed` is the only 409 of that route. A newer acceptance is never replaced by an older one.
- **Web:** one prompt (`useCreatorTermsPrompt`) on every gated screen. Nothing typed is lost; accepting does the refused action again once; dismissed or refused again, the screen says so with **Review Terms** and does not ask in a loop. Batch upload rows and a Move from YouTube import wait and go on after accepting; a waiting import is never shown as finished.

### Accounts

- [ ] Every app that can create an account (the Auth page's "Create account" counts) has **Delete account** inside the app (Apple 5.1.1(v), Play). It deletes the account and its data, not just deactivates it. The shared client contract is in [Self-service account deletion](data-lifecycle.md#self-service-account-deletion-shared-client-rules) (the web page is live, Android Studio is on main, Apple Studio is in review).
- [ ] A public web page where a person can delete the account without the app; its URL is in Play's Data safety form (not yet submitted).
- [ ] Sign in with Apple is needed only if we add a third-party or social login (Apple 4.8). Email, sign-in link and passkeys are first-party.

### Privacy

- [ ] A privacy policy URL in each store listing and a link inside each app (Apple 5.1.1(i), Play User Data).
- [ ] App Privacy (`store/apple/app-privacy.{md,json}`) and Data safety (`store/play/data-safety.{md,csv}`) are updated in the same PR as any new network call, sign-in, SDK or push.
- [ ] Each Apple app target has `Apps/<target>/PrivacyInfo.xcprivacy`. Its required-reason APIs: UserDefaults `CA92.1` everywhere, file timestamps `C617.1` and boot time `35F9.1` where aun-core is linked, and disk space `E174.1` with offline downloads. Its data types match App Privacy. CI checks this.
- [ ] No tracking: no ads, attribution or analytics SDK, so no App Tracking Transparency prompt.

### Money

**Owner decision, 2026-11-24: creator support is web only.** Creator support (AUN-MEMBERS, `creatorSupport`) stays hidden in every native app: iPhone, iPad, Mac, Apple TV, Android and Android TV. It stays hidden until Apple and Google confirm in writing that our gifts count as person-to-person gifts: Apple 3.2.1(vii), "100% of the funds go to the receiver", and Play's tips rule. Nothing about it shows in the apps: no button, link, price or "support on the web" text. The server already hides it from native clients unless an admin gives their platform and storefront a mode in the support settings for the apps (MEM-D15), so no app mode is set. Setting one needs both written answers and a new owner decision.

- [ ] No purchase, price, upgrade text or link in any native app while creator support and paid tiers are web only. Refusals for a tier or plan hide the feature ([Hidden when off](product-rules.md#hidden-when-off)).
- [ ] Before any money flow appears in a native app:
  - read the current Apple 3.1.1, 3.1.3, 3.2.1(vi)/(vii) and Play Payments pages;
  - get the owner's decision;
  - get the store's written confirmation for gifts outside in-app purchase.
- [ ] Never Stripe.

### Review visibility (Apple 2.5.19)

> **Owner decision, 2026-11-24: list and enable for review.** Every switch-gated feature in a build is listed in the App Review Notes and turned on for the reviewer account. A money or posting feature goes live in an app only after a reviewed build has shown it. Other switches stay direct: the admin turns them on without an App Review step.

- [ ] App Review Notes list every switch-gated feature in the build, and those switches are on for the reviewer account.
- [ ] A money or writing feature turns on in an app for the first time only after a reviewed build showed it.

### Platform

- [ ] Background modes only for what the app does: audio for playback in the viewer, remote notifications in Admin.
- [ ] Play foreground service declaration per type, with a short recording: viewer `mediaPlayback`, Studio `dataSync` (moving to user-initiated data transfer jobs on Android 14+: [Android#66](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/issues/66)).
- [ ] Photo picker only, no broad media permission. Notifications are asked for in context and are optional.
- [ ] Apple: built with the SDK Apple currently requires (iOS 26 SDK since 2026-04-28; iOS 27 SDK from April 2027).
- [ ] Play: targetSdk at or above the required level (36 for phones since 2026-08-31). Native libraries are aligned for 16 KB pages.
- [ ] Android TV: leanback launcher, touchscreen not required, everything reachable with the D-pad, playback pauses when leaving.
- [ ] Export compliance: `ITSAppUsesNonExemptEncryption` is true to what the app does (OS TLS only, or not).

### Religious content

- [ ] Quran text is the official text with recognized translations, never machine output (Apple 1.1.5 bans inaccurate quotations of religious texts).
- [ ] Moderation catches attacks on any faith or group (Apple 1.1.1, Play hate speech).

## Sources

All read 2026-11-24:

| Rule | Page |
|---|---|
| App Store Review Guidelines | https://developer.apple.com/app-store/review/guidelines/ |
| Account deletion (5.1.1(v)) | https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion |
| Required-reason APIs | https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api |
| App Privacy details | https://developer.apple.com/app-store/app-privacy-details/ |
| Export compliance | https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations |
| Age ratings | https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions |
| Apple upcoming requirements | https://developer.apple.com/news/upcoming-requirements/ |
| Play User Generated Content | https://support.google.com/googleplay/android-developer/answer/9876937 |
| Play account deletion | https://support.google.com/googleplay/android-developer/answer/13327111 |
| Play Data safety | https://support.google.com/googleplay/android-developer/answer/10787469 |
| Play Payments, tips | https://support.google.com/googleplay/android-developer/answer/9858738, https://support.google.com/googleplay/android-developer/answer/10281818 |
| Play US changes | https://support.google.com/googleplay/android-developer/answer/15582165 |
| Play target API | https://support.google.com/googleplay/android-developer/answer/11926878 |
| Play foreground services | https://support.google.com/googleplay/android-developer/answer/13392821 |
| Play photo and video permissions | https://support.google.com/googleplay/android-developer/answer/14115180 |
| Play Families, target audience | https://support.google.com/googleplay/android-developer/answer/9893335 |
| Android TV quality | https://developer.android.com/docs/quality-guidelines/tv-app-quality |
