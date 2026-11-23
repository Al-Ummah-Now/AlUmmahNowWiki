[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 15: TV apps

| | |
|---|---|
| **ID** | `E15` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> tvOS target (Apple), `viewer-tv` Android TV/Fire TV module, and a Tizen app that compiles and packages in CI but has never run on a TV.

## Goal

Apple TV (Swift), Android TV / Fire TV (Kotlin), Tizen (C#), webOS (web).

## Scope

- Depends on: 9 (device flow), 10, 11, 13

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 15.1 | Sign-in with device code + QR | In Progress — split one step: partially built, acceptance not fully met: Kimi: openauth#19/Auth#231 provide only the backend grant; no TV sign-in or QR screen exists and Apple#6 remains open.; GLM: Device grant + bilingual activate page merged (openauth#19, Auth#231), but no TV client signs in (Apple#6 open). |
| 15.2 | Profiles on TV |  |
| 15.3 | 10-foot home | In Progress — both cross-checks agree: EPICS.md:330 requires Continue watching, Live now and Ramadan rails in addition to hero/rails; Apple#11/Desktop#7 ship only the base 10-foot home.; tvOS (#11) and Tizen (#7) homes are merged, but the spec AC also requires Continue watching, Live now and a Ramadan rail, and Desktop#13 (real-TV run) is open. |
| 15.4 | Watch on TV | In Progress — both cross-checks agree: EPICS.md:331 requires chapters and Up next off as well as player/subtitles/speed; TVViews.swift has no chapter UI and Desktop#13 still requires real-TV validation.; tvOS/Tizen full-screen players merged, but the AC's subtitles/speed/Up-next are unverified on TV and Desktop#13 (device validation) is open. |
| 15.5 | Search | In Progress — split one step: partially built, acceptance not fully met: Kimi: Core#24 is a shared search client, but Apple/Android/Desktop TV issues #15/#6/#23 confirm no TV search UI.; GLM: Shared aun-search client merged (Core#24); TV search UI tracked open on all three platforms. |
| 15.6 | Phone as remote / cast target |  |
| 15.7 | "Sakinah" ambient mode |  |
| 15.8 | Platform integrations | In Progress — split one step: partially built, acceptance not fully met: Kimi: Apple has Top Shelf artwork and tvOS/Tizen platform shells, but EPICS.md:336-337 still lacks Watch Next, Top Shelf service and Fire TV catalogue integration.; GLM: The AC names Android TV channels/Watch Next, tvOS Top Shelf and Fire TV — none exist; Kimi's citations (D-pad focus, TPK, SMTC) belong to 15.3/15.4 and E16. |
| 15.9 | Certification |  |

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
| AlUmmahNowDesktop | [#13](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/13) | issue | Run the Tizen viewer on a real Samsung TV or emulator | OPEN | 2026-11-08 |

### Reconciled 2026-11-21

- **E15 / 10-foot home (AUN-325): In Progress** — both cross-checks agree: EPICS.md:330 requires Continue watching, Live now and Ramadan rails in addition to hero/rails; Apple#11/Desktop#7 ship only the base 10-foot home.; tvOS (#11) and Tizen (#7) homes are merged, but the spec AC also requires Continue watching, Live now and a Ramadan rail, and Desktop#13 (real-TV run) is open.
- **E15 / Watch on TV (AUN-326): In Progress** — both cross-checks agree: EPICS.md:331 requires chapters and Up next off as well as player/subtitles/speed; TVViews.swift has no chapter UI and Desktop#13 still requires real-TV validation.; tvOS/Tizen full-screen players merged, but the AC's subtitles/speed/Up-next are unverified on TV and Desktop#13 (device validation) is open.
- **E15 / Sign-in with device code + QR (AUN-323): In Progress** — split one step: partially built, acceptance not fully met: Kimi: openauth#19/Auth#231 provide only the backend grant; no TV sign-in or QR screen exists and Apple#6 remains open.; GLM: Device grant + bilingual activate page merged (openauth#19, Auth#231), but no TV client signs in (Apple#6 open).
- **E15 / Search (AUN-327): In Progress** — split one step: partially built, acceptance not fully met: Kimi: Core#24 is a shared search client, but Apple/Android/Desktop TV issues #15/#6/#23 confirm no TV search UI.; GLM: Shared aun-search client merged (Core#24); TV search UI tracked open on all three platforms.
- **E15 / Platform integrations (AUN-330): In Progress** — split one step: partially built, acceptance not fully met: Kimi: Apple has Top Shelf artwork and tvOS/Tizen platform shells, but EPICS.md:336-337 still lacks Watch Next, Top Shelf service and Fire TV catalogue integration.; GLM: The AC names Android TV channels/Watch Next, tvOS Top Shelf and Fire TV — none exist; Kimi's citations (D-pad focus, TPK, SMTC) belong to 15.3/15.4 and E16.
## Open questions

- None recorded in the sources.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowDesktop/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/0bc3371825c4533b416d77293bf3a55e33e92c75/docs/PLAN.md)
