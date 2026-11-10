[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 10: Fanous design system

| | |
|---|---|
| **ID** | `E10` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-08 |

> 10.1 tokens done; 10.2 done except the font choice (D6); 10.3/10.4/10.7 components not started; 10.5/10.6 need a designer.

## Goal

One design language implemented natively per platform plus web.

## Scope

- Depends on: —

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 10.1 | Tokens as one JSON source generating SwiftUI, Compose, WinUI 3, GTK 4, Tizen NUI, web CSS | Done (`packages/fanous-tokens`). |
| 10.2 | Typography licensing & pairing (D6), Eastern Arabic numerals | Done except the choice (D6). |
| 10.3 | Component library | Not started (built per platform in Epics 12, 15, 16). |
| 10.4 | 10-foot components | Tokens done, components not started. |
| 10.5 | Iconography & illustration | Requirements doc; needs a designer. |
| 10.6 | App icons, splash, store art | Spec + size matrix; needs a designer. |
| 10.7 | Component catalogues | Not started. |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D6](decisions.md#d6-fonts): Fonts (open)
- [D8](decisions.md#d8-brand-naming): Brand naming (open)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNow | [#334](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/334) | PR | feat(fanous): design tokens package with per-platform generators (Epic 10) | MERGED | 2026-11-08 |
| AlUmmahNow | [#335](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/335) | PR | docs(fanous): iconography brief and app-icon size matrix (Epic 10.5, 10.6) | MERGED | 2026-11-08 |
| AlUmmahNow | [#364](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/364) | issue | Fanous: commission vector lantern, icon set and store art (owner, designer) | OPEN | 2026-11-08 |
| AlUmmahNow | [#365](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/365) | issue | Fanous: owner decisions D6 fonts, D8 naming, light-theme accent | OPEN | 2026-11-08 |
| AlUmmahNow | [#387](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/387) | issue | Fanous: remaining Epic 10 stories 10.3, 10.4 and 10.7 (components and catalogues) | OPEN | 2026-11-08 |
| AlUmmahNowApple | [#7](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/7) | issue | Swap interim seams: aun-core XCFramework and generated Fanous tokens | OPEN | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [docs/native-apps/EPIC-10-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPIC-10-PLAN.md)
