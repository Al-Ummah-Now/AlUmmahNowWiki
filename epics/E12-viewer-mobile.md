[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 12: Viewer mobile apps (iOS / iPadOS / Android)

| | |
|---|---|
| **ID** | `E12` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> iOS/iPadOS viewer (Apple step 3) and Android phone/tablet viewer (Android step 3, PR #4) merged; sign-in waits on Epic 9 native clients.

## Goal

Native viewer apps at parity with the core web experience plus mobile strengths.

## Scope

- Depends on: 9, 10, 11, 13

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 12.1 | Onboarding |  |
| 12.2 | Home | Done — both audits agree: AlUmmahNowApple#4 (merged): iOS/iPadOS home rails; AlUmmahNowAndroid#4 (merged): phone/tablet/foldable home rails; AlUmmahNowApple#4; AlUmmahNowAndroid#4 |
| 12.3 | Watch page (autoplay off by default) | In Progress — both cross-checks agree: Android WatchScreen.kt:103-116 sets playWhenReady=true when a video loads, violating EPICS.md:266-270 autoplay-off acceptance.; WatchScreen.kt PlayVideoEffect sets playWhenReady=true (autoplay ON), and the spec's watch ACs (subscribe, like, playlist, share, comments) are absent — acceptance not met. |
| 12.4 | Lamahat (short reflections) |  |
| 12.5 | Subscriptions feed |  |
| 12.6 | Library |  |
| 12.7 | Search (Arabic diacritics-insensitive) | In Progress — both audits agree: AlUmmahNowCore#24 (merged): search suggestions, grouping, recent searches and Arabic normalisation; AlUmmahNowApple issue #15 and AlUmmahNowAndroid issue #6 (open): native search UI; AlUmmahNowCore#24; AlUmmahNowApple Packages/AUNCoreKit/Sources/AUNCoreKit/CoreSearchService.swift |
| 12.8 | Channel page |  |
| 12.9 | Community posts |  |
| 12.10 | Comments |  |
| 12.11 | Profile & accounts (incl. deletion 9.7) | In Progress — split one step: partially built, acceptance not fully met: Kimi: Android AppContainer.kt:13-16 installs GuestOnlyAuthBridge and Apple viewer has no account UI; Core/Desktop auth does not complete the mobile story.; GLM: aun-auth (Core#14) is built and used by mobile Studio, but neither mobile viewer signs in and #433 (deletion orchestration) is open. |
| 12.12 | Tablet & foldable layouts | Done — both cross-checks agree: Android WatchScreen.kt:157-177 implements expanded-width two-pane watch and Apple#4 supplies the iPadOS viewer.; Android#4: "Two-pane layout on expanded widths (tablets, unfolded foldables)" with a phone+tablet en/ar screenshot matrix; Apple#4 covers iOS+iPadOS. |
| 12.13 | Widgets & shortcuts |  |
| 12.14 | Deep links | In Progress — both cross-checks agree: Apple AppLink.swift and ViewerRootIOS.swift route video links, but ViewerBootstrap.swift:15-22 says playlists/posts/channels have no screen and Android routing is absent.; AASA + assetlinks.json verification shipped (#411 closed), but in-app deep-link routing is open (Apple#6). |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNowApple | [#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9) | issue | Viewer stories after the first slice (Epics 12-17, 20-22) | OPEN | 2026-11-08 |

### Reconciled 2026-11-21

- **E12 / Home (AUN-291): Done** — both audits agree: AlUmmahNowApple#4 (merged): iOS/iPadOS home rails; AlUmmahNowAndroid#4 (merged): phone/tablet/foldable home rails; AlUmmahNowApple#4; AlUmmahNowAndroid#4
- **E12 / Search (Arabic diacritics-insensitive) (AUN-296): In Progress** — both audits agree: AlUmmahNowCore#24 (merged): search suggestions, grouping, recent searches and Arabic normalisation; AlUmmahNowApple issue #15 and AlUmmahNowAndroid issue #6 (open): native search UI; AlUmmahNowCore#24; AlUmmahNowApple Packages/AUNCoreKit/Sources/AUNCoreKit/CoreSearchService.swift
- **E12 / Watch page (autoplay off by default) (AUN-292): In Progress** — both cross-checks agree: Android WatchScreen.kt:103-116 sets playWhenReady=true when a video loads, violating EPICS.md:266-270 autoplay-off acceptance.; WatchScreen.kt PlayVideoEffect sets playWhenReady=true (autoplay ON), and the spec's watch ACs (subscribe, like, playlist, share, comments) are absent — acceptance not met.
- **E12 / Profile & accounts (incl. deletion 9.7) (AUN-300): In Progress** — split one step: partially built, acceptance not fully met: Kimi: Android AppContainer.kt:13-16 installs GuestOnlyAuthBridge and Apple viewer has no account UI; Core/Desktop auth does not complete the mobile story.; GLM: aun-auth (Core#14) is built and used by mobile Studio, but neither mobile viewer signs in and #433 (deletion orchestration) is open.
- **E12 / Tablet & foldable layouts (AUN-301): Done** — both cross-checks agree: Android WatchScreen.kt:157-177 implements expanded-width two-pane watch and Apple#4 supplies the iPadOS viewer.; Android#4: "Two-pane layout on expanded widths (tablets, unfolded foldables)" with a phone+tablet en/ar screenshot matrix; Apple#4 covers iOS+iPadOS.
- **E12 / Deep links (AUN-303): In Progress** — both cross-checks agree: Apple AppLink.swift and ViewerRootIOS.swift route video links, but ViewerBootstrap.swift:15-22 says playlists/posts/channels have no screen and Android routing is absent.; AASA + assetlinks.json verification shipped (#411 closed), but in-app deep-link routing is open (Apple#6).
## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowApple/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/e1777cba481c31a0967befa9e25ac5672125a092/docs/PLAN.md)
- [AlUmmahNowAndroid/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/4e7eb38a5a18a3f255ca83697e5c806b3a524160/docs/PLAN.md)
