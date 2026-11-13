[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 19: Studio desktop (Windows, macOS, Linux)

| | |
|---|---|
| **ID** | `E19` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> Studio MVP shipped on Mac, Windows and Linux (2026-11-11 to 11-12): sign-in with several accounts, channel picker, upload of files or a folder with set-for-all values, manage videos, bulk edit, analytics. Mac downloads, MSI, portable zip, `.deb` and Flatpak come from tag-driven release workflows (Desktop pre-release `v0.1.0-preview.1`; no Apple release cut yet). Local encoding, transcription, the editor and the live control room are still to do; 19.7 waits on D3.

## Goal

Encoding, transcription, batch upload and video editing on the desktop.

## Scope

- Depends on: 9, 11, 30

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 19.1 | Content library, bulk edit | Shipped: manage videos, live search, single and bulk edit ([AlUmmahNowApple#18](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/18), [AlUmmahNowDesktop#26](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/26)). |
| 19.2 | Batch upload & bulk import (absorbs AlUmmahNowTools) | Batch and folder upload shipped ([AlUmmahNowApple#17](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/17), [AlUmmahNowDesktop#25](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/25)); AlUmmahNowTools not yet retired. |
| 19.3 | Local encoding (hardware encoders) |  |
| 19.4 | Transcription & caption editor |  |
| 19.5 | Video editor |  |
| 19.6 | Analytics deep dive | Basic charts shipped ([AlUmmahNowApple#25](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/25), [AlUmmahNowDesktop#32](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/32)); deep dive not started. |
| 19.7 | Live control room (D3) | Waits on D3 (unblocked 2026-11-10). |
| 19.8 | Teams & roles | Channel roles spec (PR #462) supersedes "uses auth RBAC". |
| 19.9 | Institution mode |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D3](decisions.md#d3-live-provider): Live provider (pending), see the [D3 page](D3-live-provider.md)
- [D9](decisions.md#d9-linux-ui-toolkit-for-c): Linux UI toolkit for C# (decided)
- [D10](decisions.md#d10-transcription-location): Transcription location (open)
- [D11](decisions.md#d11-who-encodes-renditions): Who encodes renditions (open)
- [D1](decisions.md#d1-app-stack): App stack (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- D2/D3 update: [AlUmmahNow#686](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/686) (merged 2026-11-10 as `f4cca7db`)

- Studio MVP, Desktop: [AlUmmahNowDesktop#24](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/24), [AlUmmahNowDesktop#25](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/25), [AlUmmahNowDesktop#26](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/26), [AlUmmahNowDesktop#27](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/27) (release packages), [AlUmmahNowDesktop#32](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/32) (merged 2026-11-11)
- Studio MVP, Mac: [AlUmmahNowApple#16](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/16) to [AlUmmahNowApple#19](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/19) (notarized downloads on a tag), [AlUmmahNowApple#25](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/25) (merged 2026-11-12)
- Core: loopback sign-in for desktop and upload resume fix, [AlUmmahNowCore#27](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/27), [AlUmmahNowCore#29](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/29), released as `v0.3.0-rc.1` ([AlUmmahNowCore#30](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/30))

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNow | [#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462) | PR | docs(specs): per-channel roles spec and plan (cites 19.8) | OPEN | 2026-11-10 |
| AlUmmahNowApple | [#10](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/10) | issue | Studio stories after the spikes (Epics 18, 19, 30) | OPEN | 2026-11-08 |
| AlUmmahNowCore | [#15](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/15) | PR | feat(aun-upload): resumable TUS upload engine, folder watching, FFI facade | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Epic 29 and STATUS-5-8 refer to team roles as "native 19.6"; EPICS.md numbers Teams & roles **19.8** (19.6 is analytics).
- Chat: Epic 19 was Tauri-based before D1.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowDesktop/docs/D9-FINDING.md](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/0bc3371825c4533b416d77293bf3a55e33e92c75/docs/D9-FINDING.md)
