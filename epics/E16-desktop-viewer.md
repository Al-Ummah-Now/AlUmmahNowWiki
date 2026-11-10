[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 16: Desktop viewer (Windows, macOS, Linux)

| | |
|---|---|
| **ID** | `E16` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-10 |

> Windows (WinUI 3) and Linux (GTK 4) viewer projects proven in CI; macOS viewer target in Apple.

## Goal

Native desktop viewers: macOS (Swift), Windows (WinUI 3), Linux (GTK 4).

## Scope

- Depends on: 10, 11, 13

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 16.1 | Native desktop shells |  |
| 16.2 | Distribution (Mac App Store, MSIX/winget, Flathub) |  |
| 16.3 | Mini-player, media keys, notifications |  |
| 16.4 | Downloads & Listen mode on desktop |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D9](decisions.md#d9-linux-ui-toolkit-for-c): Linux UI toolkit for C# (decided)
- [D1](decisions.md#d1-app-stack): App stack (decided)

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
| AlUmmahNowApple | [#9](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/9) | issue | Viewer stories after the first slice (Epics 12-17, 20-22) | OPEN | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Chat: Epic 16 was "PWA + Tauri" before D1 (2026-11-08).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
