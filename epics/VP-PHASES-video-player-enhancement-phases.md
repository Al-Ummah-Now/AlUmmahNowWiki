[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Video player enhancement plan, Phases 1–5 (`[Phase N.M]` issues)

| | |
|---|---|
| **ID** | `VP-PHASES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2025-11-05 |

> Phases 1–4 complete per `docs/epics.md`; Phase 5 (#68, #71) became Epic 4.

## Goal

The 2025 custom Video.js player rebuild, tracked as issues #45–#71 titled `[Phase N.M]`.

## Scope

- Labels `phase-1` … `phase-5`, `video-player`

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Phase 1–4 | Player infrastructure, controls, analytics, UX | Done |
| Phase 5.24 | E2E suite (#68) | → Epic 4 |
| Phase 5.27 | Migration and rollout (#71) | → Epic 4 (superseded) |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Issues [AlUmmahNow#68](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/68) and [AlUmmahNow#71](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/71) still open

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#45](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/45) | issue | [Phase 1.1] Set up Video.js Infrastructure and Dependencies | CLOSED | 2025-10-13 |
| AlUmmahNow | [#46](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/46) | issue | [Phase 1.2] Implement BunnyStreamService for URL Generation | CLOSED | 2025-10-13 |
| AlUmmahNow | [#47](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/47) | issue | [Phase 1.3] Build CustomVideoPlayer React Component | CLOSED | 2025-10-13 |
| AlUmmahNow | [#48](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/48) | issue | [Phase 1.4] Implement Error Handling and Fallbacks | CLOSED | 2025-10-15 |
| AlUmmahNow | [#49](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/49) | issue | [Phase 1.5] Set up Basic Analytics Event Tracking | CLOSED | 2025-10-15 |
| AlUmmahNow | [#50](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/50) | issue | [Phase 2.6] Implement Quality Selector with ABR | CLOSED | 2025-10-18 |
| AlUmmahNow | [#51](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/51) | issue | [Phase 2.7] Add Playback Speed Control | CLOSED | 2025-10-18 |
| AlUmmahNow | [#52](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/52) | issue | [Phase 2.8] Implement Keyboard Shortcuts | CLOSED | 2025-10-18 |
| AlUmmahNow | [#53](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/53) | issue | [Phase 2.9] Add Progress Bar with Thumbnail Preview | CLOSED | 2025-10-18 |
| AlUmmahNow | [#54](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/54) | issue | [Phase 2.10] Implement Volume Persistence | CLOSED | 2025-10-18 |
| AlUmmahNow | [#55](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/55) | issue | [Phase 2.11] Add Fullscreen and Picture-in-Picture | CLOSED | 2025-10-18 |
| AlUmmahNow | [#56](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/56) | issue | [Phase 3.12] Implement Detailed Analytics Tracking | CLOSED | 2025-10-16 |
| AlUmmahNow | [#57](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/57) | issue | [Phase 3.13] Build Watch Progress Tracking | CLOSED | 2025-10-19 |
| AlUmmahNow | [#58](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/58) | issue | [Phase 3.14] Add Resume Playback UI | CLOSED | 2025-10-19 |
| AlUmmahNow | [#59](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/59) | issue | [Phase 3.15] Integrate WebSocket Real-Time Metrics | CLOSED | 2025-10-19 |
| AlUmmahNow | [#60](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/60) | issue | [Phase 3.16] Add Engagement Tracking (Likes/Views/Shares) | CLOSED | 2025-10-19 |
| AlUmmahNow | [#61](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/61) | issue | [Phase 4.17] Design Custom Control Skin (YouTube-like) | CLOSED | 2025-10-18 |
| AlUmmahNow | [#62](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/62) | issue | [Phase 4.18] Implement Full RTL Support | CLOSED | 2025-10-18 |
| AlUmmahNow | [#63](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/63) | issue | [Phase 4.19] Add Mobile Touch Controls and Gestures | CLOSED | 2025-10-18 |
| AlUmmahNow | [#64](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/64) | issue | [Phase 4.20] Implement Loading States and Buffering UX | CLOSED | 2025-10-18 |
| AlUmmahNow | [#65](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/65) | issue | [Phase 4.21] Ensure Accessibility Compliance (WCAG 2.1 AA) | CLOSED | 2025-10-18 |
| AlUmmahNow | [#66](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/66) | issue | [Phase 5.22] Implement Lazy Loading and Code Splitting | CLOSED | 2025-10-19 |
| AlUmmahNow | [#67](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/67) | issue | [Phase 5.23] Optimize CDN Configuration | CLOSED | 2025-10-19 |
| AlUmmahNow | [#68](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/68) | issue | [Phase 5.24] Create E2E Test Suite with Playwright | OPEN | 2025-10-12 |
| AlUmmahNow | [#69](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/69) | issue | [Phase 5.25] Set Up Performance Monitoring | CLOSED | 2025-10-19 |
| AlUmmahNow | [#70](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/70) | issue | [Phase 5.26] Build A/B Testing Framework | CLOSED | 2025-10-19 |
| AlUmmahNow | [#71](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/71) | issue | [Phase 5.27] Execute Migration and Rollout Plan | OPEN | 2025-10-12 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- `[Phase 1.2]` etc. look like epic.story ids but are not (e.g. Phase 1.2 ≠ Story 1.2).

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
