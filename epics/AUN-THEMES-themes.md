[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Themes: Lantern, Zujaj, Nahas, Fawanees, and the theme builder

| | |
|---|---|
| **ID** | `AUN-THEMES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md), [openauth](../repos/openauth.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> Four themes with Fawanees as default (#455, #492), theme redesign (#525), theme packages and builder (#564, #571, #575, #587) merged. Since 2026-11-10: www follows the site theme (UI #54), the videos admin shell follows it (#820), Fawanees light 1.1.0 swaps page and surfaces (#883, synced to CMS #95 and Auth), builder preview fixes and a dark-header gate (#963), and the Apple apps follow the site theme (Apple #13). Open: native theme registry (#500), theme-builder packages on www (UI #55), a Fawanees light redesign (draft #1071).

## Goal

Every app and page ready for theme switching, for rebranding and seasons (Ramadan, Eid), with fallback themes.

## Scope

- Owner chat 2026-11-08 19:46 → 2026-11-10 03:35: golden Lantern theme; second theme with dark and light; Fawanees as main; themes extended to native apps; buildable themes as packages in admin

## Where things stand

See [Theming](../guides/theming.md) for which app follows the site theme and how. In short:

- One site theme, set by an admin, read at runtime by every web app and the Apple apps. Light and dark stay per viewer.
- The header is dark in every theme and both modes. The builder enforces it.
- www and the CMS vendor only the four built-in themes, so a package made in the builder doesn't reach them yet.

## Decisions and constraints

- [O18](decisions.md#o18-four-themes-fawanees-default): Four themes, Fawanees default (decided)
- [O19](decisions.md#o19-themes-in-the-native-apps-too): Themes in the native apps too (decided)
- [O20](decisions.md#o20-buildable-theme-packages-in-admin): Buildable theme packages in admin (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#454](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/454), [AlUmmahNow#455](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/455), [AlUmmahNow#456](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/456), [AlUmmahNow#490](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/490), [AlUmmahNow#492](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/492), [AlUmmahNow#525](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/525), [AlUmmahNow#526](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/526), [AlUmmahNow#530](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/530), [AlUmmahNow#564](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/564), [AlUmmahNow#571](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/571), [AlUmmahNow#575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/575), [AlUmmahNow#587](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/587); [AlUmmahNow#820](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/820), [AlUmmahNow#883](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/883), [AlUmmahNow#945](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/945), [AlUmmahNow#949](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/949), [AlUmmahNow#963](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/963), [AlUmmahNow#1018](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1018), [AlUmmahNow#1047](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1047); open [AlUmmahNow#500](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/500), draft [AlUmmahNow#1071](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1071)
- UI [AlUmmahNowUI#25](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/25), [AlUmmahNowUI#54](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/54), [AlUmmahNowUI#56](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/56); open issue [AlUmmahNowUI#55](https://github.com/Al-Ummah-Now/AlUmmahNowUI/issues/55)
- CMS [AlUmmahNowCMS#22](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/22), [AlUmmahNowCMS#95](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/95)
- Auth [AlUmmahNowAuth#257](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/257), [AlUmmahNowAuth#279](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/279), [AlUmmahNowAuth#282](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/282), [AlUmmahNowAuth#322](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/322)
- Apple [AlUmmahNowApple#13](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/13), [AlUmmahNowApple#14](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/14)

## Open questions

- Fawanees light: the owner asked for a rethink on 2026-11-12. Proposals are in draft [AlUmmahNow#1071](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1071); none is picked yet.
- Android and Desktop don't follow the site theme yet. They wait on the native theme registry ([AlUmmahNow#500](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/500)).

## Conflicts between sources

- Mechanism: the owner said switching happens "with a deploy, not realtime" and "config that leads to build" (2026-11-08/09). The built admin "Site theme" setting applies at runtime within about a minute, and the owner then asked for a runtime theme builder. In practice the web apps switch at runtime, and `THEMES.md` carries a note saying so, but its decision table still says "with a deploy".

## Sources

- [docs/design/THEMES.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/design/THEMES.md)
- [docs/themes/README.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/themes/README.md)
- [AlUmmahNowUI/src/lib/site-theme.ts](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/src/lib/site-theme.ts)
- Chat: thread `b3036b4f-e700-45ac-8658-dede17f5d691`, 2026-11-08 23:38–23:42 UTC, position 7842 (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/b3036b4f-e700-45ac-8658-dede17f5d691`)
- Chat: thread `c47d8fed-0a4a-44e7-b1fd-bc6b54ff3ffd`, 2026-11-10 03:35 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Afb56a035-d93a-45fa-80ca-07cf6fd15c9b%3Adelegate-task%3Ac47d8fed-0a4a-44e7-b1fd-bc6b54ff3ffd`)
