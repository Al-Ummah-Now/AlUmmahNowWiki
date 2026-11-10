[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Live streaming plan, Phases 1–3 (`[Phase 2] Task 2.N` issues)

| | |
|---|---|
| **ID** | `LIVE-PHASES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2025-11-06 |

> Phase 1 (browse: `/live` list, status, viewer count) exists; Phase 2 go-live wizard issues #126–#140 are open; real provider waits on D3 (unblocked 2026-11-10, owner decision pending).

## Goal

39-task plan (Nov 2025): browse live streams, go-live creator tools, real-time features.

## Scope

- Phase 1 Browse experience (12 tasks)
- Phase 2 Go-live creator tools (15 tasks, Bunny Stream assumed)
- Phase 3 Real-time features (12 tasks)

## Decisions and constraints

- [D2](decisions.md#d2-video-delivery): Video delivery (decided), see the [D2 page](D2-video-delivery.md)
- [D3](decisions.md#d3-live-provider): Live provider (pending), see the [D3 page](D3-live-provider.md)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Issues #126–#140 (`[Phase 2] Task 2.N`, label `live-streaming`), all open
- Update on D3: [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (open, head `e689549`)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#126](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/126) | issue | [Phase 2] Task 2.1: GoLiveForm Wizard Structure (4 Steps) | OPEN | 2026-01-21 |
| AlUmmahNow | [#127](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/127) | issue | [Phase 2] Task 2.2: Stream Details Form with Zod Validation | OPEN | 2026-01-21 |
| AlUmmahNow | [#128](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/128) | issue | [Phase 2] Task 2.3: Thumbnail Upload to Bunny.net | OPEN | 2026-01-21 |
| AlUmmahNow | [#129](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/129) | issue | [Phase 2] Task 2.4: RTMP Server/Key Setup Display | OPEN | 2026-01-21 |
| AlUmmahNow | [#130](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/130) | issue | [Phase 2] Task 2.5: Review & Confirm Step with Preview | OPEN | 2026-01-21 |
| AlUmmahNow | [#131](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/131) | issue | [Phase 2] Task 2.6: StreamSetup Component (Wizard Controller) | OPEN | 2026-01-21 |
| AlUmmahNow | [#132](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/132) | issue | [Phase 2] Task 2.7: StreamControls Component (Start/Stop/Pause) | OPEN | 2026-01-21 |
| AlUmmahNow | [#133](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/133) | issue | [Phase 2] Task 2.8: /en/go-live Page (English) | OPEN | 2026-01-21 |
| AlUmmahNow | [#134](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/134) | issue | [Phase 2] Task 2.9: /ar/go-live Page (Arabic RTL) | OPEN | 2026-01-21 |
| AlUmmahNow | [#135](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/135) | issue | [Phase 2] Task 2.10: Stream Dashboard (Live Status & Analytics) | OPEN | 2026-01-21 |
| AlUmmahNow | [#136](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/136) | issue | [Phase 2] Task 2.11: Real-time Viewer Count (WebSocket) | OPEN | 2026-01-21 |
| AlUmmahNow | [#137](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/137) | issue | [Phase 2] Task 2.12: Real-time Stream Status Updates (WebSocket) | OPEN | 2026-01-21 |
| AlUmmahNow | [#138](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/138) | issue | [Phase 2] Task 2.13: Error Handling (Network, Validation, RTMP) | OPEN | 2026-01-21 |
| AlUmmahNow | [#139](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/139) | issue | [Phase 2] Task 2.14: Success States & Notifications | OPEN | 2026-01-21 |
| AlUmmahNow | [#140](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/140) | issue | [Phase 2] Task 2.15: Testing & Validation (E2E + Integration) | OPEN | 2026-01-21 |

## Open questions

- Phase 2 assumes Bunny Stream Live; D3's recommendation is self-hosted RTMP/SRT → HLS in R2. The plan needs rewriting once the owner decides D3.

## Conflicts between sources

- `Task 2.N` ids look like Epic 2 stories but are not.
- Overlaps native Epic 17 and Epic 29.17; neither doc references the other.
- Chat: D3 was "Bunny Stream Live, best fit" on 2026-11-07 02:04 UTC, before the cost cap; after D2 the recommendation is self-hosted RTMP → R2.

## Sources

- [docs/live-streaming/phases-overview.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/live-streaming/phases-overview.md)
- [docs/live-streaming/FINAL_STATUS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/live-streaming/FINAL_STATUS.md)
