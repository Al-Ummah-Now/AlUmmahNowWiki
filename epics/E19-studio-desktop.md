[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 19: Studio desktop (Windows, macOS, Linux)

| | |
|---|---|
| **ID** | `E19` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-18 |

> Studio MVP shipped on Mac, Windows and Linux (2026-11-11 to 11-12): sign-in with several accounts, channel picker, upload of files or a folder with set-for-all values, manage videos, bulk edit, analytics. Mac downloads, MSI, portable zip, `.deb` and Flatpak come from tag-driven release workflows (Desktop pre-release `v0.1.0-preview.1`; no Apple release cut yet). NAT-S2 (D10/D11 decided 2026-11-14): the server side is merged ([AlUmmahNow#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386), [AlUmmahNow#1378](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1378); needs an AlUmmahNow release) and Core v0.4.0-rc.1 is out ([AlUmmahNowCore#43](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/43), [AlUmmahNowCore#44](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/44)). Studio services and Core adapters are merged on Mac ([AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36), [AlUmmahNowApple#42](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/42)) and Desktop ([AlUmmahNowDesktop#43](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/43)). The screens for captions, analytics, institution mode, the editor and pre-encode wait for the owner's screenshot review: Mac [AlUmmahNowApple#37](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/37), [AlUmmahNowApple#39](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/39), [AlUmmahNowApple#43](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/43); Desktop [AlUmmahNowDesktop#45](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/45), [AlUmmahNowDesktop#46](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/46). 19.7 waits on D3.

## Goal

Encoding, transcription, batch upload and video editing on the desktop.

## Scope

- Depends on: 9, 11, 30

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 19.1 | Content library, bulk edit | Shipped: manage videos, live search, single and bulk edit ([AlUmmahNowApple#18](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/18), [AlUmmahNowDesktop#26](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/26)). |
| 19.2 | Batch upload & bulk import (absorbs AlUmmahNowTools) | Batch and folder upload shipped ([AlUmmahNowApple#17](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/17), [AlUmmahNowDesktop#25](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/25)); AlUmmahNowTools retires per the plan below. |
| 19.3 | Local encoding (hardware encoders) | Building (D11). Studio can encode the server's own ladder on the creator's computer and upload the rungs before the server transcodes. The server checks every rung (ladder, codecs, segments, every segment decoded, picture and sound matched against the source) and encodes itself when anything is off. Server contract: [AlUmmahNow#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386). Core ladder (matches the server across 30 sizes) and HLS packaging: [AlUmmahNowCore#43](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/43). Mac uploader: [AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36). Server encoding stays the default. Screens: [AlUmmahNowApple#43](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/43), [AlUmmahNowDesktop#45](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/45), [AlUmmahNowDesktop#46](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/46); Core adapters [AlUmmahNowApple#42](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/42). |
| 19.4 | Transcription & caption editor | Building (D10). Captions are transcribed on the server by default, or free on the creator's computer with whisper.cpp; on-device drafts go through the same Quran layer and spend no caption minutes. The editor splits, merges, nudges and deletes cues and keeps Quran segments as the server sent them. [AlUmmahNow#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386) (on-device transcript route), [AlUmmahNowCore#43](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/43) (whisper in the desktop builds, caption segmenting), [AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36) (caption clients, cue editing). Screens: [AlUmmahNowApple#37](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/37), [AlUmmahNowDesktop#45](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/45); on-device engine [AlUmmahNowApple#42](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/42), [AlUmmahNowDesktop#46](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/46). |
| 19.5 | Video editor | Building. Trim, cut, join, move and append on Core's EDL as atomic edits with undo/redo, flattened for playback and export ([AlUmmahNowCore#43](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/43); Mac composition and export in [AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36)). Editor timeline: [AlUmmahNowApple#43](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/43), [AlUmmahNowDesktop#46](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/46) (GES export on Linux, MediaComposition on Windows). Titles and lower thirds: Core edits `addTitle`, `setTitle` and `removeTitle` ([AlUmmahNowCore#46](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/46), v0.4.0-rc.2); desktop editor [AlUmmahNowDesktop#48](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/48), Mac editor [AlUmmahNowApple#44](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/44) (same rules and layout): add, reword, move, retime and remove with undo; Arabic and English lines, each shaped in its own direction; previewed over the picture and drawn into the export (Core Image on the Mac). |
| 19.6 | Analytics deep dive | Basic charts shipped ([AlUmmahNowApple#25](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/25), [AlUmmahNowDesktop#32](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/32)); deep dive building: summary, daily metrics over any range, retention curve and CSV export (UTF-8 with BOM so Excel opens Arabic) in [AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36). Screens: [AlUmmahNowApple#39](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/39), [AlUmmahNowDesktop#45](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/45). |
| 19.7 | Live control room (D3) | Waits on D3 (unblocked 2026-11-10). |
| 19.8 | Teams & roles | Channel roles spec (PR #462) supersedes "uses auth RBAC". |
| 19.9 | Institution mode | Building. Until organisations exist (AUN-SUBS S10), each account has one brand kit and one shared asset library (50 assets, 1 GB) used by all its channels and their teams; only the owner changes them; both are in the data export and erased with the account. [AlUmmahNow#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386), [AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36). Screens: [AlUmmahNowApple#39](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/39), [AlUmmahNowDesktop#45](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/45). The editor's titles take the saved kit's colours (bar, box or minimal template), side and logo ([AlUmmahNowDesktop#48](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/48), [AlUmmahNowApple#44](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/44)). |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## AlUmmahNowTools retirement plan

Tools writes straight to Bunny and R2 with operator keys. Studio uploads through api-videos, so the server owns delivery, moderation and quotas. Tools retires once Studio covers what operators still use it for.

| Tools feature | Studio replacement | State |
|---|---|---|
| Folder scan and bulk import with shared values | Batch and folder upload with set-for-all values (19.2) | Shipped |
| Resume interrupted uploads | Core resumable TUS upload ([AlUmmahNowCore#15](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/15), [#29](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/29)) | Shipped |
| Multi-channel organisation | Several accounts and the channel picker | Shipped |
| Filter presets, bulk metadata edits | Content library search and bulk edit (19.1) | Shipped |
| Thumbnails with the video's shape | Server thumbnails and the owner's legacy thumbnails | Shipped |
| Watch a folder, approve each file | Core folder watch (`aun-upload/watch`) with an approve queue in Studio | Next Studio step |
| Duplicate detection (SHA-256) | Hash before upload and skip files the channel already has | Next Studio step |
| DeepL title translation | Inline title translation (AUN-CAPTIONS P1) | Planned |
| Direct Bunny / R2 writes | None: uploads go through api-videos | Retired by design |

Retirement steps: Studio gets the watch-and-approve queue and duplicate check; the owner runs the last Tools import; the repo is archived read-only and the operator Bunny and R2 keys it used are revoked.

## Desktop design: Lantern Glass (owner-approved 2026-11-18)

The Windows and Linux Studio share one design language with the web and phone apps, built from the
Fawanees entry of the shared native theme registry (`packages/fanous-tokens`; vendored into
`AlUmmahNowDesktop/src/AlUmmahNow.App/Theme/fanous` by `scripts/sync-fanous.sh`). Proposal and mockups:
[review page](https://claude.ai/artifact/H4C79akpcL19v7qm2f5iUV). Rules:

- **Depth, not a recolour.** Night header band (title bar on Windows, header bars on Linux) in Light *and*
  Dark with the owner's lantern-string art (crop/resize only); frosted cards with a gold-tinted edge, a top
  sheen and a gold glow; gold for primary actions, the selected nav item, selected cards, progress and the
  playhead only.
- **Platform materials.** Windows 11: Mica window, in-app Acrylic sidebar/cards/menus; the gold glow is a
  coloured composition shadow (ThemeShadow is grey only). Linux: libadwaita, solid surfaces with the same
  edge, sheen and glow (GTK has no backdrop blur).
- **Shell.** A sidebar headed by the one identity menu (channels: name + Channel and role; people: name +
  Personal; Add another account, Add a passkey, Sign out) replaces the tab strip, the Channel picker and the
  Account menu. Settings sits at the sidebar's foot. Below 1200 px the sidebar is an icon rail; the window's
  minimum is 1024x700.
- **Cards.** Buttons go in the card's footer, end-aligned (left in Arabic). Layouts fill the window (two
  columns at 1440, more grid columns at 1920).
- **Light or Dark only**, saved in Studio's settings (Dark by default); no System option anywhere (an old
  saved System reads as Dark). Studio starts in the saved language (Arabic by default).
- **Never fatal.** A theme that fails to load is reported to the crash file and Studio keeps the stock look.

PRs (stacked, held for owner screenshots): shell and identity menu
[AlUmmahNowDesktop#55](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/55), Upload
[#56](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/56), Videos grid
[#57](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/57), Analytics
[#58](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/58), Timeline and Encode
[#59](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/59), Settings and sign-in cards, viewer tokens
and no System theme (PRs 6 and 7). Review frames come from the `review-shots` job (Linux) and the
"Lantern Glass review frames" step (Windows) in the Studio CI workflows.

## Decisions and constraints

- [D3](decisions.md#d3-live-provider): Live provider (pending), see the [D3 page](D3-live-provider.md)
- [D9](decisions.md#d9-linux-ui-toolkit-for-c): Linux UI toolkit for C# (decided)
- [D10](decisions.md#d10-transcription-location): Transcription location (decided 2026-11-14: server by default, on-device option in desktop Studio)
- [D11](decisions.md#d11-who-encodes-renditions): Who encodes renditions (decided 2026-11-14: server by default, optional desktop pre-encode verified server-side)
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
- NAT-S2 (2026-11-14): [AlUmmahNow#1386](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1386), [AlUmmahNow#1378](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1378) (media container build fix), [AlUmmahNowCore#43](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/43), [AlUmmahNowApple#36](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/36), Core `v0.4.0-rc.1` ([AlUmmahNowCore#44](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/44)), [AlUmmahNowApple#42](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/42), [AlUmmahNowDesktop#43](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/43); screens held for owner review: [AlUmmahNowApple#37](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/37), [AlUmmahNowApple#39](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/39), [AlUmmahNowApple#43](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/43), [AlUmmahNowDesktop#45](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/45), [AlUmmahNowDesktop#46](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/46)
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
