[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Production video player (themed, token-driven)

| | |
|---|---|
| **ID** | `AUN-VIDEO-PLAYER` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-13 |

> Spec and plan merged 2026-11-10 (#472); player fixes and release tests merged the same day (#536, #538, #556, #561); native theme registry PR #500 open.

## Goal

One production web player on Video.js with every colour from fanous-tokens, so each theme (Lantern, Zujaj, Nahas, Fawanees) gets its own player.

## Scope

- Player tokens per theme
- Build-time theme selection
- Defect fixes from the theme-demo comparison

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Watch page behaviour (2026-11-13)

How the player behaves on the watch page, after the owner's reports of 2026-11-13.

- **Seamless next ([AlUmmahNow#1122](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1122)).** The watch page lives in the `/[locale]/video` layout (`components/video/WatchShell.tsx`), above the `[id]` segment. Moving to another video keeps the same `<video>` element and only swaps its source. That covers Next, the end-of-video advance, a playlist item, a related card (`/video?vid=`) and Back.
  - Details, comments and the playlist pane's highlight update in place; the previous video stays on screen until the next one's details arrive, so there is no blank frame.
  - The URL is pushed to history, so Back works. The tab title and, on `/video/<id>`, the Open Graph tags follow the video.
  - The next video's details are preloaded after 5 s of playback; in a playlist its stream manifest is prefetched too.
  - Unchanged: autoplay with the muted fallback, captions and quality preferences, one view and one QoE session per video.
  - The release spec `seamless-next.player.spec.ts` checks the same element across Next, auto-advance and Back, and that no frame is blank.
- **Mini player ([AlUmmahNow#1118](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1118)).** From 640px wide, a playing video floats in the end corner once less than a quarter of it shows.
  - Below 1024px it floats above the tab bar. Before this fix it floated under the tab bar and lost its controls.
  - A vertical video (Short) floats in a 9:16 box; its bar keeps play, mute, time, settings and fullscreen on one row.
  - `e2e/player/mini-player.spec.ts` checks it is on screen, uncovered and painting.
- **Phones ([AlUmmahNow#1122](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1122)).** Portrait phones (under 640px) keep the player pinned to the top while details, comments and related videos scroll beneath it, YouTube-mobile style.
  - The pinned player keeps the frame's own width, so pinning doesn't jump. A vertical video pins at 45svh.
  - Landscape and fullscreen are unaffected. Pinning persists across a seamless next.
- **Autoplay switch ([AlUmmahNow#1119](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1119)).** The thumb shows a play glyph when autoplay is on and a pause glyph when it is off.
  - "Autoplay" / «التشغيل التلقائي» sits beside it on players 760px wide or wider.
  - A themed tooltip "Autoplay is on/off" shows on hover and keyboard focus.

## Status evidence

- PRs [AlUmmahNow#472](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/472), [AlUmmahNow#536](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/536), [AlUmmahNow#538](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/538), [AlUmmahNow#556](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/556), [AlUmmahNow#561](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/561); open [AlUmmahNow#500](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/500), [AlUmmahNow#480](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/480)

## Open questions

- None recorded in the sources.

## Conflicts between sources

- No epic number assigned; it continues Epic 1/2/8 player work and Epic 10 tokens.

## Sources

- [docs/specs/VIDEO-PLAYER.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/VIDEO-PLAYER.md)
- [docs/specs/VIDEO-PLAYER-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/specs/VIDEO-PLAYER-PLAN.md)
- [AlUmmahNow#472](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/472)
