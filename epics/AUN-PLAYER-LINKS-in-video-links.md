[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# In-video links: credits, info cards and end screens

| | |
|---|---|
| **ID** | `AUN-PLAYER-LINKS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web, web, processor), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **planned**. Phase 0 (the Quran Foundation credit) is being built on `feat/qf-short-credit`, with no PR yet; every other phase waits for the owner's answers in [§16](#16-owner-decisions) |
| **Last updated** | 2026-11-23 |
| **Origin** | Owner request 2026-11-23: in-video links that work like YouTube's: info cards, end screens and fixed credits. The first one is the linked "Source: Quran Foundation" credit that Quran Foundation (QF) requires next to its text ([QF1](decisions.md#qf1-quran-foundation-content-use)) |
| **Linear** | No Linear tool was available when this page was written. The stories are in [§15](#15-stories), ready to import |

## Goal

- The player can show **clickable elements over the video**, all drawn by one component on every surface (watch page, theater, fullscreen, mini player, embed, phone, and later the native apps and TV).
- There are three kinds of element:
  - **Credits**: a small fixed line such as "Source: Quran Foundation", shown while a condition holds and linked to the source.
  - **Info cards**: a short teaser at a chosen time that opens a card linking to a video, playlist, channel or approved website.
  - **End screens**: up to four clickable elements in the last 5 to 20 seconds.
- **The QF credit is phase 0.** It is the first `credit` element. Cards, end screens and creator-written credits later reuse the same layer, positioning, accessibility, analytics and safety code.
- Links inside Al Ummah Now work freely. **External links go only to allowlisted or verified domains**, always through a confirmation screen. They can be reported and taken down, and they never appear on content made for children or held for review.
- Like every creator feature, each element type has its own switch on the [Features page](AUN-FEATURES-feature-switches.md) (off by default, except the QF credit), is limited per [creator tier](CHAT-CREATOR-TIERS-creator-tiers.md) by admins, and is [hidden when off](../guides/product-rules.md#hidden-when-off).

## 1. How YouTube does it (research, 2026-11-23)

Sources are YouTube's help center and developer docs unless noted. Points no primary source confirmed are marked **Unverified**.

### 1.1 Info cards

- **Types:** video, playlist, channel and link. Link cards to external sites need the YouTube Partner Program (YPP). Channel cards need a custom message and teaser text; other types make them optional. Source: [Add cards to videos](https://support.google.com/youtube/answer/6140493).
- **Limit:** 5 cards per video, each with a start time set in Studio. The teaser shows at that time. Afterwards viewers open the cards from the card icon: on desktop by hovering over the player, on mobile whenever the controls are visible (same source).
- **Not shown:**
  - on videos set as made for kids (existing cards are hidden too);
  - when a Content ID claimant runs a campaign on the video;
  - alongside YouTube's call-to-action overlay (same source).
- **Retired card types:**
  - donation cards ended on April 2, 2019 ([YouTube Help](https://support.google.com/youtube/answer/9262742));
  - fan funding ended on February 28, 2017 ([Tubefilter](https://www.tubefilter.com/2017/01/12/youtube-live-streaming-super-chats-no-fan-funding/amp/));
  - poll cards existed ([Tubefilter, 2017](https://tubefilter.com/2017/03/17/youtube-phase-out-annotations-cards-end-screens/)), but when they ended is **Unverified**.
- **Unverified:** how long the teaser stays on screen, that the icon sits in the top right corner, and how cards behave on TV, in embeds and on Shorts.

### 1.2 End screens

- **Eligibility:** the video must be at least 25 seconds long. The end screen covers the last 5 to 20 seconds. Source: [Add end screens to videos](https://support.google.com/youtube/answer/6388789).
- **Elements:** up to 4 on a 16:9 video (fewer on other aspect ratios). The types are:
  - video or playlist (a specific video, the latest upload, or "best for viewer");
  - subscribe;
  - channel;
  - link.
- **Editing:** templates group elements. The editor has a grid with snap to grid and snap to element, and each element has its own timing (same source).
- **Not shown on:**
  - made-for-kids videos;
  - mobile web (iPad excepted);
  - YouTube Music and YouTube Kids;
  - 360° videos.
- **While an end screen shows,** card teasers and the channel watermark are suppressed. YouTube warns that end screens "may not always show, or may show differently than designed" (same source).
- **Hide button (December 17, 2025):** viewers can hide the end screen for the current video because "overlays can cover content". Source: [YouTube blog](https://blog.youtube/news-and-events/hiding-end-screens-what-youtube-creators-need-to-know/).
- **TV:** a 2023 forum report says the Apple TV app has no controls for end screens ([Apple Community](https://discussions.apple.com/thread/255088382)). How embeds and Shorts behave is **Unverified**.

### 1.3 External links and eligibility

- **YPP requirement:** link cards and end-screen links need YPP membership. Linked sites must follow the Community Guidelines and Terms of Service. A breach can remove the link, earn a strike, or terminate the channel (both help pages above).
- **Why YPP:** the requirement began around September 28, 2017, and YouTube said it was "meant to curb abuse" by channels reposting others' videos ([Engadget](https://www.engadget.com/2017/09/29/youtube-links-end-cards-new-requirements/)).
- **Associated website:** creators verify the site through Google Search Console ([Google Search Central, 2021](https://developers.google.com/search/blog/2021/02/search-console-associations)). The current steps on YouTube's own help pages are **Unverified**.
- **Fundraising:** end screens may link to approved fundraising sites such as GoFundMe and JustGiving ([YouTube Help](https://support.google.com/youtube/answer/9918203)). The current approved merch list is **Unverified**.
- **August 2023 changes**, made because of malware, phishing and scams ([TechCrunch](https://techcrunch.com/2023/08/10/youtube-is-disabling-links-on-shorts-to-cut-down-on-spam), [Malwarebytes](https://www.malwarebytes.com/blog/news/2023/08/youtube-makes-sweeping-changes-to-tackle-spam-on-shorts-videos)):
  - links in Shorts comments, Shorts descriptions and the vertical live feed stopped being clickable, the creator's own links included;
  - clickable social icons left channel banners;
  - profile links moved next to Subscribe;
  - Shorts got a "Related video" link that can point only to the creator's own long video ([YouTube Help](https://support.google.com/youtube/answer/14075157)).

### 1.4 Annotations, and why they were retired

- **What they were:** free-form clickable text boxes placed anywhere on a video, from 2008. They were built before mobile and never worked there.
- **Retirement:** the editor closed on May 2, 2017. YouTube said annotation use had fallen by more than 70% while cards and end screens got about 7 times more clicks ([YouTube blog](https://blog.youtube/news-and-events/keep-fans-engaged-with-cards-end/), [Search Engine Journal](https://www.searchenginejournal.com/youtube-kills-annotations-editor/190405/)).
- **Removal:** all annotations were removed on January 15, 2019 because they did not work on mobile ([Engadget](https://www.engadget.com/2018/11/27/youtube-remove-pop-up-annotations-january-15th/)).
- **Clutter:** press reported that viewers closed about 12 annotations for every one they clicked ([Tubefilter](https://tubefilter.com/2017/03/17/youtube-phase-out-annotations-cards-end-screens/)). That spam was an official reason is **Unverified**.

### 1.5 Analytics

- **Cards** (the [YouTube Analytics API metrics](https://developers.google.com/youtube/analytics/metrics)):
  - `cardTeaserImpressions`, `cardTeaserClicks` (an icon click counts for the last teaser shown) and `cardTeaserClickRate`;
  - `cardImpressions` (counted when the card panel opens), `cardClicks` and `cardClickRate`.
- **End screens:** Studio reports elements shown, element clicks and click rate, by element type and by video ([YouTube Help](https://support.google.com/youtube/answer/6388789)).

### 1.6 Embeds, controls and captions

- **Embed parameters** ([player parameters](https://developers.google.com/youtube/player_parameters)):
  - `iv_load_policy=3` hides annotations; that it also hides cards is **Unverified**;
  - since September 25, 2018, `rel=0` limits related videos to the same channel instead of turning them off.
- **Captions and controls:** most native players move captions up while controls show, and browsers differ ([Mux](https://www.mux.com/blog/if-you-can-read-this-your-browser-captions-are-broken)). How YouTube keeps end-screen elements clear of captions is **Unverified**. The nearest official answer is the 2025 Hide button.

### 1.7 Other platforms

- **Vimeo:** added cards and end screens for business plans in 2017, with click tracking ([Tubefilter](https://tubefilter.com/2017/05/31/vimeo-business-cards-end-screens/)), and now offers hotspots and calls to action by plan ([Vimeo Help](https://help.vimeo.com/hc/en-us/articles/46427252272145-What-interactive-features-are-available-with-my-plan)).
- **TikTok:**
  - "link in bio" scams lead to malware and phishing ([Bitdefender](https://bitdefender.com/en-us/blog/hotforsecurity/link-in-bio-scams/));
  - in 2024 an unvalidated redirect on TikTok's own domain sent people to a fake Microsoft sign-in page ([Cofense](https://cofense.com/blog/exploiting-social-media-tiktok-links-used-to-hijack-microsoft-accounts)).
  - Lesson: **we never run an open redirect.** External links go straight to the checked URL; no `/out?url=` endpoint exists.

### 1.8 What we take from this

| YouTube lesson | Our rule |
|---|---|
| Annotations died because they were free-form, cluttered and broke on mobile | Fixed element types and fixed slots only, no free placement except end-screen elements on a grid, and one layout engine that works from 240px to TV |
| Outbound links are gated behind a vetted program, with strikes for bad links | External links need a tier that allows them, an allowlisted or verified domain, and a channel in good standing; admins can take any link down |
| No cards or end screens on made-for-kids videos | The same here, and none on videos held in review ([§7.4](#74-where-links-never-show)) |
| Caps on count and timing; viewers can hide end screens | 5 cards and 4 end-screen elements at most, one teaser at a time, and a Hide button on the end screen |
| Teaser impressions, card clicks and end-screen click rate | The same counters, aggregated per day and never tied to a viewer ([§11](#11-analytics)) |
| `rel=0` and same-channel related videos in embeds | Embed end screens show only the same channel's videos ([Epic 25 §25.7](E25-sharing-embeds.md)), and `links=0` hides cards and end screens ([§12.2](#122-embeds)) |

## 2. What exists today (inventory, 2026-11-23)

Read from AlUmmahNow `main` at [`4486c20`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/4486c207b2837e69bb4ef315edc8bf89566ba1e8) and from the phase 0 working branch.

| Piece | Where | What it means for this epic |
|---|---|---|
| Web player | `apps/web/src/components/VideoPlayer/CustomVideoPlayer.tsx` (Video.js 8, the `vjs-fanous` skin), `VideoPagePlayer/` (chapters, watch layout), `embed/EmbedPlayer.tsx` | One player everywhere on the web. The links layer goes in here once and reaches the watch page, theater, fullscreen, the mini player and embeds |
| Player overlays | `VideoPlayer/PlayerOverlays.tsx`: the **ended** screen (Up next with an 8-second countdown, Watch again, two more suggestions) and the mini player's buttons | The creator end screen (last 5 to 20 seconds, while playing) is a different layer. At `ended`, the existing Up next screen takes over ([§6.5](#65-end-screen-vs-the-up-next-screen)) |
| Layers | `lib/video/player-layer.ts`, `usePlayerLayerHost.ts`: dialogs, menus and tooltips are portalled out of the frame and follow fullscreen | The cards panel and the external-link interstitial are layer members. Teasers, credits and end-screen elements are drawn *inside* the frame, because they belong to the picture |
| Captions | `player-skin.css`: `.vjs-text-track-display` sits 88px above the bottom while controls show and 16px while they're hidden, with a 200 ms transition | The credit attaches to the caption box and moves with it. End-screen elements never cover a cue ([§6](#6-placement-and-collisions)) |
| Chapter toast | `VideoPagePlayer/CurrentChapter.tsx`, `.vjs-fanous-chapter-toast`: top end corner, hidden while a player menu is open | The card teaser uses the same corner, so the two share one queue ([§6.3](#63-the-top-end-corner-chapter-toast-and-card-teaser)) |
| Chapters model | `shared-types/src/schemas/chapter.ts`: `{ id, startTime, endTime, title, titleLocalized }`, at most 100, stored in the video record | Card times are seconds on the same timeline. Studio draws chapters on the cards timeline |
| QF attribution today | [#1722](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1722) (merged): `GET /subtitles/:lang` ends every cue that shows Quran text or a translation with QF's attribution line in the track's language | Every player, native apps and embeds included, gets the credit as caption text with no app release |
| QF short credit (phase 0, in progress) | Branch `feat/qf-short-credit`: `QURAN_CREDIT` ("Source: Quran Foundation" / «المصدر: مؤسسة القرآن»), `QURAN_FOUNDATION_URL`, `quranCreditFor(language)`, `splitQuranCredit(cueText)`, and `credit` on `GET /api/v1/quran/passage` | The web player lifts the credit line out of the cue and shows it as a link. This epic makes that link the first `credit` element ([§13](#13-rollout)) |
| Native players | Apple `Packages/AUNPlayer` (its own `SubtitleOverlay.swift` draws the cue text), Android `player/` (Media3) and `viewer-tv/`, Desktop through CoreBridge | They show the credit as caption text today. They render cards and end screens in phase 4, from Core models |
| Feature switches | [AUN-FEATURES](AUN-FEATURES-feature-switches.md): `shared-types/src/feature-registry.ts`, `GET /api/me/features`, `404 feature_off` | Each element type adds one registry entry ([§9](#9-feature-switches)) |
| Tiers | `shared-types/src/creator-tiers.ts` (per-tier columns such as `audioTracksPerVideo`), the `entitlements.ts` catalogue | The per-video limits become tier columns, the pattern AUN-MULTI-AUDIO used ([§8](#8-tier-limits)) |
| Reports | admin-api `reports` (entity types `video`, `comment`, `channel`, `livestream`, `playlist`, `post`), the Reports queue (Action needed / History) | Adds the entity type `player_link` ([§7.6](#76-reports-and-takedown)) |
| Video flags | `madeForKids` and `ageRestricted` exist in upload defaults and in YouTube import, but not on the video record | Phase 1 needs a stored `madeForKids` on the video record ([PL-D11](#16-owner-decisions)) |
| Analytics | `POST /api/analytics/events` → queue → processor `CounterBatch` → `analytics_daily (entity_type, entity_id, day, metric, dim)` | The impression and click counters use this pipeline with a new entity type ([§11](#11-analytics)) |
| Embeds | [Epic 25](E25-sharing-embeds.md): `embed.alummahnow.net/v/{id}` with `start`, `captions`, `lang`, `related=channel\|none`…; privacy-enhanced until play; the embed end screen shows only the same channel's videos | Same rules, plus a `links=0` parameter ([§12.2](#122-embeds)) |
| Pickers | `components/ui/Autocomplete.tsx`; Channel sections' `VideoPicker`, `PlaylistPicker`, `ChannelPicker` | Studio's target pickers reuse these. They are live autocompletes and open with results already listed |

## 3. Element types

All elements are one TypeScript union, `PlayerLink`, in `packages/shared-types/src/player-links.ts`:

```ts
type PlayerLinkKind = 'credit' | 'card' | 'endElement';
type PlayerLinkTarget =
  | { type: 'video'; videoId: string }
  | { type: 'video'; dynamic: 'latestUpload' }        // end screen only
  | { type: 'playlist'; playlistId: string }
  | { type: 'channel'; channelId: string }
  | { type: 'subscribe' }                             // end screen only: the video's own channel
  | { type: 'url'; url: string };                     // external, §7
```

### 3.1 Credit

A small linked line that names a source: "Source: Quran Foundation" for QF's text, and later "Source: …" lines that creators write.

| Property | Rule |
|---|---|
| Who adds it | **System credits** come from a code registry, `SYSTEM_CREDITS` in shared-types, and nobody edits them in a UI. **Creator credits** come later (phase 5, [PL-D8](#16-owner-decisions)) |
| When it shows | A system credit shows while its condition holds. For `quranFoundation`, that is while the current cue ends with QF's credit line (`splitQuranCredit(cue).credited`). A creator credit shows during a time range |
| Where | Attached to the caption box when tied to cues ([§6.2](#62-captions-and-the-credit)). A creator credit sits at the bottom start corner, above the bar |
| Look | One line of 12px text (11px under 480px wide), in the cue's language and direction. Caption colors, the viewer's caption style opacity, an underline on hover and focus, and an external-link glyph |
| Link | System credits open their URL directly in a new tab, with no interstitial ([PL-D4](#16-owner-decisions)), and `rel="noopener"` without `noreferrer`, so QF sees where the visit came from. Creator credits follow the external link rules ([§7](#7-link-safety)) |
| Required | A system credit marked `required: true` (QF) cannot be hidden by the viewer, the embedder (`links=0`), the creator or the mini player. Its switch is tied to the content it credits ([§9](#9-feature-switches)) |

```ts
interface SystemCredit {
  id: 'quranFoundation';
  label: { en: string; ar: string };   // QURAN_CREDIT
  linkLabel: { en: string; ar: string };// "Source: Quran Foundation (opens in a new tab)"
  url: string;                          // QURAN_FOUNDATION_URL = https://quran.foundation/
  when: { cueCredit: 'quran' };         // shows while the cue carries QF's credit line
  required: true;
}
```

### 3.2 Info card

| Property | Rule |
|---|---|
| Targets | video, playlist, channel, and url (external, phase 3) |
| Count | 0 to the tier's `cardsPerVideo`, never more than **5** ([PL-D1](#16-owner-decisions)) |
| Time | `startMs` from 0 up to the video's length minus 5 s. Two cards' teasers must start at least **10 s** apart (Studio refuses a closer one) |
| Teaser | Optional, up to 40 characters, written by the creator (user content: one language, no Arabic copy required, [Localized fields](../guides/localized-fields.md) exempts it). Without a teaser, the target's title is used |
| Message | Optional line above the card, up to 60 characters. Required for channel cards, as on YouTube |
| Shows as | At `startMs` the teaser slides out of the card icon for **5 s**. The icon then stays while the controls show. Pressing the icon or the teaser opens the **cards panel**, which lists every card that has started so far |

### 3.3 End-screen element

| Property | Rule |
|---|---|
| Eligibility | The video is at least **25 s** long, isn't a Short, and isn't live |
| Window | The end screen lasts 5 to 20 s (default 20) and ends at the video's end. Each element may start later within that window |
| Targets | video (a chosen one or the latest upload), playlist, subscribe, channel, and url (phase 3). "Best for viewer" comes later, with feed ranking ([PL-D18](#16-owner-decisions)) |
| Count | 0 to the tier's `endElementsPerVideo`, never more than **4**. At least one must be a video or playlist, as on YouTube, so the end screen always offers something to watch |
| Position | A box in **normalized coordinates of the video picture** (x, y, w, h from 0 to 1, where the picture is drawn, not the letterbox). Video and playlist boxes are 16:9, while subscribe and channel are circles. Minimum width: 0.18 of the picture for video and playlist, 0.10 for circles. Boxes can't overlap, and each stays 0.04 inside the picture's edges |
| Templates | Studio offers 6 starting layouts (1 video; 2 videos; video + subscribe; 2 videos + subscribe; video + playlist + subscribe; 2 videos + channel + subscribe) |
| Viewer control | A **Hide** button (eye-off icon, "Hide end screen" / «إخفاء الشاشة الختامية») at the top end of the end screen. It hides the end screen for this video in this session |

**Positions don't mirror in RTL.** Elements are placed on the picture, for example beside the speaker. Flipping them for Arabic viewers would cover what the creator meant to keep clear. The text inside each element follows the viewer's language and direction.

### 3.4 Not in scope

- Free-form annotations, polls, quizzes and hotspots. Annotations were retired for good reasons ([§1.4](#14-annotations-and-why-they-were-retired)).
- Watermarks and branding.
- Donation, fundraising or payment cards ([§7.5](#75-money-fundraising-affiliate-and-endorsement)).
- Shopping and merch shelves.
- Links in live streams (cards may come to live later, after VOD proves out).

## 4. Who can add what

| Element | System | Creator (channel owner, managers, editors) | Admin |
|---|---|---|---|
| System credit | Defined in code, shown automatically | Can't add, edit or hide | Can switch the credit off on the Features page only through its content switch ([§9](#9-feature-switches)); can't edit the wording |
| Creator credit (phase 5) | — | Adds, edits and removes, if the tier allows | Takes down |
| Info card, internal | — | Adds, edits and removes, if the tier and switch allow | Takes down; can suspend a channel's links |
| End screen, internal | — | Same | Same |
| External link (card, end element, credit) | — | Only to an allowlisted domain or the channel's verified domain, if the tier allows external links and the channel is in good standing ([§7.2](#72-allowed-domains)) | Manages the allowlist and blocklist; takes down; suspends |

- **Roles:** channel roles decide who edits ([Site roles and channel roles](../guides/roles.md)). Owners, managers and editors can edit links. Viewers with the analytics role see only the counts. A team member works under the **channel owner's** tier, as uploads do.
- **Acting identity:** edits are made as the acting identity chosen in the nav menu; Studio has no identity picker ([Help and the identity tour](../guides/help-and-tour.md)). The subscribe element subscribes the viewer's acting identity and shows its avatar.

## 5. Timing rules

| Rule | Value |
|---|---|
| First card teaser | Not before 2 s, so it never covers the first frame or the resume pill |
| Teaser on screen | 5 s, then it shrinks back into the icon |
| Teasers at once | One. A teaser due while another is showing waits for it to finish. A teaser due while the chapter toast shows waits up to 3 s; if it still can't show, it is skipped, and the card is still in the panel |
| Teaser while paused or seeking | None shows. After a seek, only the latest card whose time was crossed may tease, and only if its time is within the last 10 s |
| Cards and the end screen | Once the end screen starts, no teaser shows and the card icon hides, as on YouTube |
| End screen start | The video's length minus the chosen window (5 to 20 s). If the viewer seeks into the window, the end screen shows at once. Seeking back out hides it |
| Hide | Lasts for the session and the video. A replay shows the end screen again only after a new page load |
| Playback speed | Times are media time, so they scale with speed |
| `end=` (embeds) and clips | The end screen follows the real end of the media. With an embed `end=` before the window, no end screen shows |

## 6. Placement and collisions

### 6.1 Zones

The frame has fixed zones. Elements stay in theirs, and higher priority wins:

| Priority | Zone | Who |
|---|---|---|
| 1 | Control bar, progress bar, open menus and dialogs | The player's controls. Nothing is ever drawn over them. While a player menu is open (`vjs-menu-open`), teasers, the card icon and end-screen elements hide. The credit stays unless the menu covers it |
| 2 | Caption box | Captions and the credit attached to them. Nothing covers a cue |
| 3 | Top start corner | The start-over pill (unchanged) |
| 4 | Top end corner | One of: the chapter toast, the card teaser, or the card icon ([§6.3](#63-the-top-end-corner-chapter-toast-and-card-teaser)) |
| 5 | End-screen elements | The picture area outside zones 1 to 4 |

### 6.2 Captions and the credit

- **Phase 0 (web):** the credit is drawn **directly under the cue, at the cue's end side**. That is the right corner for English and the left for Arabic: the cue's direction, not the page's. It sits inside the caption box, so it moves with the box when the controls show or hide (88px or 16px from the bottom).
  - The 2px gap and the line height are part of the caption box's own height, so a two-line cue plus the credit never overlaps the bar.
  - Under the viewer's Caption style, the credit uses the cue's text color and the window opacity, and its size is 70% of the cue's (at least 11px).
- **When no captions show:** a cue that carries no credit line shows no credit. QF's terms require the credit where QF text appears, and QF text appears only in captions today.
- **End-screen elements and cues:** a box that would overlap the current cue's box doesn't move. Instead, the **caption box moves to the top** of the frame (Video.js `line` position 1) while the overlap lasts. The cue stays fully visible and the creator's layout is kept.
- **Studio:** the end-screen editor draws the bottom caption band as a hatched guide, "Captions show here", and warns but doesn't block when a box covers it.

### 6.3 The top end corner: chapter toast and card teaser

- The chapter toast (CurrentChapter) and the card teaser share one **corner queue**: one at a time, chapter toast first (it is time-critical), the teaser after it.
- The card icon is a 36px round button (44px hit area) at the top end corner, 12px in from the edges. It shows while the controls show and is hidden while the chapter toast shows.
- In RTL pages the corner is the top left. This follows the page direction, like the chapter toast.

### 6.4 Every player size

| Surface | Credit | Card icon and teaser | Cards panel | End screen |
|---|---|---|---|---|
| Watch page, inline (≥ 640px wide) | Yes | Yes | A panel inside the frame at the end side, up to 360px wide, scrolling | Yes |
| Theater | Yes | Yes | Same | Yes |
| Fullscreen | Yes | Yes | Same; it moves with the layer host | Yes |
| Phone (< 480px frame) or the pinned phone player | Yes (11px) | The icon only while the controls show; the teaser is the icon plus at most 24 characters | Fills the frame, 8px in from every edge, like the settings menu on a small player | **Compact mode:** the creator layout is replaced by one bottom row of up to 2 elements, in the creator's order, each at least 44px tall, so taps are never smaller than a fingertip |
| Mini player (360px float) | Yes (required) | No | No | No. The Up next screen still shows at `ended`, as today |
| Shorts | Yes | No | No | No |
| Live | Yes (live captions carry no QF line today) | No (phase 1) | No | Not applicable |
| Embed | Yes, always | Yes, unless `links=0` | Yes | Yes, unless `links=0`; same-channel elements only ([§12.2](#122-embeds)) |
| Picture in picture | Shown by the page only if the browser draws captions; the PiP window shows none of our layers | No | No | No |
| Native phone and tablet (phase 4) | Yes: lifted into a link (in-app browser) | Yes | A bottom sheet | Yes, with the same compact rule under 480pt |
| TV (phase 4) | Yes, as text only (TVs have no browser) | No | No | Internal elements only, focusable with the remote; no url elements ([PL-D10](#16-owner-decisions)) |

### 6.5 End screen vs the Up next screen

- **While the video plays** its last 5 to 20 s, the creator's end screen shows over the picture.
- **At `ended`,** the creator's elements fade out and the existing Up next screen (`PlayerOverlays.tsx`) takes over unchanged: countdown, Play now, Watch again, more videos.
- **If the creator's end screen has a chosen video** and the viewer has no playlist or queue, that video is the Up next video. Otherwise Up next keeps its own pick ([PL-D9](#16-owner-decisions)).
- **Autoplay off:** Up next shows without the countdown, as today.

## 7. Link safety

### 7.1 Internal targets

- **Allowed targets:** videos, playlists, channels and the channel's own subscribe. A target must be **public or unlisted** when saved.
- **Checked when served:** if the target later becomes private, deleted, removed or held in review, the element is **left out of the served list**, and Studio marks it "Not shown: the video is no longer public".
- **Cross-channel targets:** creators may link other channels' public content, as on YouTube, except in embeds ([§12.2](#122-embeds)).

### 7.2 Allowed domains

An external URL is accepted only when **all** of these hold:

1. The scheme is `https`. No credentials, no IP address, and no port other than 443. The URL is at most 2,048 characters.
2. The host's registrable domain (from the public suffix list) is **allowed**. That means one of:
   - **The admin allowlist:** domains admins approved for everyone, each with a category such as `quran-and-hadith`, `education`, `scholar-site`, `publisher` or `organization`. The list starts with `quran.foundation`, `quran.com` and `sunnah.com`.
   - **The channel's verified domains:** domains the channel proved it controls, with a DNS TXT record `alummahnow-verify=<token>` or a file at `/.well-known/alummahnow-verify.txt`. The channel's scholar site domains and own domains (`siteDomains`) count as verified already.
3. The domain isn't on the **admin blocklist**. The blocklist always wins, even over the allowlist and over verification.
4. The URL is **not a shortener or redirector**. Known shorteners (`bit.ly`, `t.co`, `tinyurl.com` and others) are on the blocklist. A `HEAD` request at save time that redirects off the domain is refused.
5. **Display:** a domain in mixed scripts is shown in punycode in Studio, in the card and on the interstitial, so look-alike domains can't hide.
6. The scan passes ([§7.3](#73-scanning)).

The **allowlist and blocklist are one table**, `link_domains`, managed on the admin page *Player links › Domains*:

- search is a live autocomplete;
- each row records who added it, when, and the category;
- removing a row is a soft delete, restorable for 30 days.

### 7.3 Scanning

- **On save:** the domain is checked against the Cloudflare **URL Scanner** (Radar) and [Google Safe Browsing Lookup API v4](https://developers.google.com/safe-browsing/v4/lookup-api), which is free for non-commercial use (whether that covers us is [PL-D13](#16-owner-decisions)). A malicious verdict refuses the save. An unknown verdict saves the link, and the scan finishes in the background.
- **Re-check:** a daily queued job re-checks every distinct external domain in use, never every link (the domain count is small).
- **A domain that turns bad:** it is blocklisted automatically, every link to it is hidden at once, the channels are told in Studio, and an item opens in the admin Reports queue.
- **Jobs:** the jobs are queued, with retry and a dead-letter queue. A job that gives up shows on the admin Errors page with Retry ([O26](decisions.md#o26-always-async-with-admin-visible-errors)).

### 7.4 Where links never show

| Video or channel state | Credits | Internal cards and end screen | External links |
|---|---|---|---|
| Made for kids | Yes (required) | **No** | **No** |
| Age-restricted | Yes | Yes | No |
| Held in pre-publication review ([AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md)) or with an open report on the video | Yes | Yes | No, until resolved |
| The channel's links are suspended by an admin, or it has an active strike | Yes | No | No |
| A Short or a live stream | Yes | No | No |

These rules are enforced **when the links are served**. Studio still lists the elements, each with a plain reason ("Not shown on videos made for kids").

### 7.5 Money, fundraising, affiliate and endorsement

- **No payment, donation, zakat, sadaqah or crowdfunding links.** The only way to send money to a creator is the platform's own support flow ([AUN-MEMBERS](AUN-MEMBERS-creator-support.md)), behind its own switch. These domains (PayPal.me, GoFundMe, LaunchGood, Patreon, Ko-fi, Buy Me a Coffee and similar) are on the blocklist in the `payments` category.
  - **Why:** charitable solicitation rules, scams that misuse religious giving, and sanctions. A link that sends money to a sanctioned person or organization exposes the platform under [OFAC rules](https://ofac.treasury.gov/faqs/topic/1501). Admins can't allowlist a `payments` domain ([PL-D6](#16-owner-decisions)).
- **Merch, stores and affiliate links** are not in version 1 ([PL-D7](#16-owner-decisions)).
  - If allowed later, the creator must tick "Paid or affiliate link" / «رابط مدفوع أو بعمولة». The card then shows a "Paid link" / «رابط مدفوع» label, as the [FTC Endorsement Guides](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) expect.
  - A video already marked `paidPromotion` shows its existing disclosure; the links add nothing to it.
- **No endorsement by the platform:** the interstitial says the site isn't run by Al Ummah Now. System credits name a source; they don't endorse it.

### 7.6 Reports and takedown

- **Viewer reports:** every card, end-screen element and creator credit has "Report link" in its ⋮ menu (on the end screen, in the element's long-press or context menu). The interstitial has it too.
  - This adds the entity type `player_link` to `reports`. The `entity_type` CHECK is rebuilt, as migration 0020 did.
  - The reasons are the existing ones plus `misleading_link` and `malware`.
- **Admin actions** (from the Reports queue or from *Player links*):
  - **Hide this link:** a soft delete, restorable for 30 days ([admin soft delete](../guides/data-lifecycle.md)).
  - **Block the domain:** it joins the blocklist and every link to it hides.
  - **Suspend links for the channel:** it takes a reason, and the channel can't add or show cards or end screens until an admin lifts it.
  - **Warn the owner:** as the queue already does.
  - Each action uses the in-app undo or confirm dialog, never a browser prompt, and writes an audit entry.
- **What the creator sees:** a takedown appears in Studio on the element ("Removed by Al Ummah Now: misleading link"), with the reason in the creator's language from the server catalogue ([O40](decisions.md#o40-server-written-error-messages)).

## 8. Tier limits

New per-tier columns, edited on the admin *Tiers* page with en + ar labels and help:

| Column | Meaning | Free (`member`) | Creator | Unlimited |
|---|---|---|---|---|
| `playerCardsPerVideo` | Info cards per video (0 to 5) | 0 | 5 | 5 |
| `playerEndElementsPerVideo` | End-screen elements per video (0 to 4) | 0 | 4 | 4 |
| `playerExternalLinks` | May point cards and end elements at external URLs | false | false | true |
| `playerVerifiedDomains` | Domains a channel may verify | 0 | 0 | 5 |
| `playerCreatorCredits` (phase 5) | Creator credits per video (0 to 3) | 0 | 3 | 3 |

- The hard caps (5, 4, 3) are in code. The tier sets values up to them ([PL-D1](#16-owner-decisions)), and the defaults above are [PL-D17](#16-owner-decisions).
- A tier with 0 for a column **hides** that part of Studio ([Hidden when off](../guides/product-rules.md#hidden-when-off)). No "not in your tier" text and no upgrade prompt.
- **When a tier is lowered:**
  - existing elements over the new limit stay stored but **aren't served** beyond the limit (the first N by time, or by creator order);
  - Studio says plainly, at the point of editing: "Your plan shows 2 end-screen elements. The others are kept but not shown." There is no upsell;
  - saving more than the limit returns 402 `upgrade_required` with the entitlement `player.cardsPerVideo` (or the matching key), which Studio shows as that plain fact.

## 9. Feature switches

Registry entries in `feature-registry.ts`, all in the **grow** group:

| Key | Name (en / ar) | Help: what people lose while it is off (en / ar) | Default | Who toggles | Requires |
|---|---|---|---|---|---|
| `playerCredits` | Source credits in the player / ذكر المصادر في المشغّل | The player stops showing source credits, such as Quran Foundation's. Quran text in captions is switched off with it, because its source must be credited. / يتوقف المشغّل عن عرض ذكر المصادر، مثل مؤسسة القرآن. ويتوقف معه نص القرآن في الترجمة النصية، لأن ذكر مصدره شرط لعرضه. | **on** | superAdmin | — |
| `playerCards` | Info cards / بطاقات المعلومات | Creators can't add info cards, and viewers don't see the cards already added. The cards are kept and come back when it's on. / لا يستطيع صنّاع المحتوى إضافة بطاقات معلومات، ولا يرى المشاهدون البطاقات المضافة. تُحفظ البطاقات وتعود عند إعادة التشغيل. | off | admin | — |
| `playerEndScreens` | End screens / الشاشات الختامية | Creators can't add end screens, and viewers don't see the ones already added. The Up next screen at a video's end is not affected. / لا يستطيع صنّاع المحتوى إضافة شاشات ختامية، ولا يرى المشاهدون الشاشات المضافة. لا تتأثر شاشة «التالي» في نهاية المرئي. | off | admin | — |
| `playerExternalLinks` | Links to other websites / الروابط إلى مواقع أخرى | Cards and end screens can point only inside Al Ummah Now. External links already added are hidden. Source credits aren't affected. / تشير البطاقات والشاشات الختامية إلى محتوى داخل الأمة الآن فقط. تُخفى الروابط الخارجية المضافة. لا يتأثر ذكر المصادر. | off | superAdmin | — |

- **`playerCredits` and `quranText`:** `quranText` is an automatic key today (on while the QF copy is fresh). This epic makes it also require `playerCredits`, so the Quran text can never show without its credit ([PL-D5](#16-owner-decisions)). The confirm dialog for turning `playerCredits` off names that consequence.
- **`playerExternalLinks` has no effect on its own:** external links still need cards or end screens to be on. The registry has no "or" dependency, so the help text says this instead.
- **User feature keys** (`GET /api/me/features?channelId=`): `playerCards`, `playerEndScreens` and `playerExternalLinks`. Each is on only when the switch is on **and** the channel owner's tier allows it. Studio shows the matching sections only then.
- **Viewer side:** while a switch is off, the server leaves those elements out of `GET /api/v1/videos/:id/player-links`, so old app versions also stop drawing them. Gated write routes answer `404 feature_off` with the server message ([O40](decisions.md#o40-server-written-error-messages)).

## 10. Studio

### 10.1 Where

- A new section on the video edit page, **"Cards and end screen" / «البطاقات والشاشة الختامية»**, after Chapters (`components/videoEdit/`).
- It is shown only when at least one of `playerCards` or `playerEndScreens` is on for this channel. With both off, the section doesn't exist; no empty frame is left ([Hidden when off](../guides/product-rules.md#hidden-when-off)).
- Native Studio apps get it in phase 4.

### 10.2 Layout

- **Preview player** on top: the real player, with the links layer in preview mode. It has three toggles:
  - phone, desktop or TV frame;
  - English or Arabic interface (the RTL check);
  - a captions sample, which shows where cues and the credit fall.
- **Timeline** below, with lanes for:
  - chapters (read-only);
  - captions (read-only cue blocks);
  - cards (draggable markers);
  - the end screen window (a resizable block, 5 to 20 s).
  - Times are typed or set from the playhead ("Use current time"). They show as `m:ss` in the interface's digits: ٠–٩ in Arabic, through the shared formatter ([Numbers and dates](../guides/numbers-and-dates.md)).
- **Lists:** one for cards and one for end-screen elements, each row with type icon, target, time and status ("Shown", "Not shown: …", "Removed by Al Ummah Now").

### 10.3 Adding an element

1. **Pick a type:** Video, Playlist, Channel, Subscribe (end screen only), or Link (only with `playerExternalLinks`).
2. **Pick the target with a live autocomplete** (the shared `Autocomplete` and Channel sections' pickers):
   - it opens with results already listed: this channel's recent public videos, its playlists, or the channels it features;
   - it searches by title or @handle as you type, and accepts a pasted video, playlist or channel URL;
   - private targets aren't offered.
3. **Link:** a URL field with the domain status inline:
   - "Allowed (Quran Foundation, education)";
   - "Your verified domain";
   - "Not allowed: ask for this domain to be reviewed", which links to a form that sends the domain to the admin review queue;
   - "Blocked".
   - The verified-domains list sits under the channel's settings (Customization › Links), with the DNS or file instructions and a Verify button.
4. **Card only:** an optional teaser and message, each with a live character count.
5. **Disclosure** (only if [PL-D7](#16-owner-decisions) allows affiliate links): the "Paid or affiliate link" checkbox.
6. **Save:** checks run as you type. On save, the whole set for the video is sent at once with its version number. If someone else saved first, Studio says "Changed by {name} at {time}" and offers Reload.

### 10.4 End-screen canvas

- **Snapping:** a 16:9 canvas over a still from the video's last 20 s, with a 12-column snapping grid plus snap to element.
- **Editing:** dragging and resizing keep the minimum size and the margins. Templates fill the canvas in one click.
- **Keyboard:** arrows move the selected element by one grid step (Shift: fine steps), and Delete removes it with Undo (undo, not a confirm dialog).
- **Copy end screen from another video:** a picker (autocomplete) copies that video's elements. "Apply to selected videos" in Studio Videos is a later story.

### 10.5 Analytics in Studio

- **Per element:** impressions, clicks and click rate for the selected period, on the video's analytics page under "Cards and end screen".
- **Per channel:** "Top end-screen elements".
- **Format:** numbers use the shared formatter and compact counts; the charts use the shared value-axis scale.

## 11. Analytics

| Event | When it counts | Metric |
|---|---|---|
| `teaser_shown` | A card teaser is drawn (at most once per card per playback) | `card_teaser_impressions` |
| `card_opened` | The cards panel opens; counts each card listed in it | `card_impressions` |
| `card_click` | A card in the panel or a teaser is activated | `card_clicks` |
| `end_shown` | An end-screen element is drawn for at least 1 s | `end_impressions` |
| `end_click` | An end-screen element is activated | `end_clicks` |
| `end_hidden` | The viewer pressed Hide | `end_hides` |
| `credit_click` | A credit link is activated | `credit_clicks` |
| `external_continue` | The viewer pressed Continue on the interstitial | `external_continues` |

**Pipeline and storage:**

- Events are batched in the player and sent with the existing `POST /api/analytics/events` as kind `player_link`, at most once every 30 s and on `pagehide`. Then they go through the queue, the processor and `CounterBatch` into `analytics_daily`.
- `entity_type` is `player_link`, `entity_id` is the element id (or `credit:quranFoundation`), the metric is from the table, and `dim` is the surface (`web`, `embed`, `apple`, `android`, `desktop`, `tv`). `CounterBatch`'s entity list gets the new type: on 2026-11-16 it silently dropped a type missing from that list (#1476).

**Privacy:**

- Only daily counts per element are kept: no viewer id, IP address, user agent or referrer. The batch's `sessionId` is used for rate limiting and dedupe and is never stored, as with retention.
- Embeds send nothing before play and then follow the viewer's consent choice ([Epic 25 §25.4](E25-sharing-embeds.md)).
- External URLs get **no tracking parameters** (no `utm_*`) and never pass through our server ([PL-D12](#16-owner-decisions)).

**Cost:** one batched message per playback that shows a link, so about 3 queue operations per playback ($0.40 per million operations, [Cloudflare Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/)), plus rolled-up D1 rows per element per day. At 1 million such playbacks a month that is about **$1.20 a month**, about $0.0000012 per playback, within [O1](decisions.md#o1-whole-platform-cost-cap) at scale. No paid scanner is used.

## 12. Data model and API

### 12.1 Storage (search D1, migration `00xx_player_links.sql`)

```sql
CREATE TABLE player_links (
  id TEXT PRIMARY KEY,                 -- uuid
  video_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('card','endElement','credit')),
  target_type TEXT NOT NULL CHECK (target_type IN ('video','playlist','channel','subscribe','url')),
  target_id TEXT,                      -- video/playlist/channel id; NULL for url, subscribe, latestUpload
  target_dynamic TEXT,                 -- 'latestUpload' or NULL
  url TEXT,                            -- normalized https URL for url targets
  domain TEXT,                         -- registrable domain, for takedown by domain
  start_ms INTEGER NOT NULL,           -- card: teaser time; endElement: start within the window
  end_ms INTEGER,                      -- creator credit only
  box TEXT,                            -- endElement: JSON {x,y,w,h} in 0..1 of the picture
  sort INTEGER NOT NULL DEFAULT 0,
  teaser TEXT, message TEXT,           -- creator text (user content)
  paid INTEGER NOT NULL DEFAULT 0,     -- paid or affiliate disclosure
  state TEXT NOT NULL DEFAULT 'active' CHECK (state IN ('active','removed_by_admin','domain_blocked')),
  removed_reason TEXT, removed_by TEXT, removed_at TEXT,
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  deleted_at TEXT                      -- creator delete or admin hide: soft, purged after 30 days
);
CREATE INDEX idx_player_links_video ON player_links(video_id, deleted_at);
CREATE INDEX idx_player_links_domain ON player_links(domain) WHERE domain IS NOT NULL;
CREATE INDEX idx_player_links_channel ON player_links(channel_id, deleted_at);

CREATE TABLE player_link_settings (     -- per video
  video_id TEXT PRIMARY KEY, end_window_ms INTEGER NOT NULL DEFAULT 20000, version INTEGER NOT NULL DEFAULT 1,
  updated_by TEXT, updated_at TEXT
);

CREATE TABLE link_domains (
  domain TEXT PRIMARY KEY, status TEXT NOT NULL CHECK (status IN ('allow','block')),
  category TEXT NOT NULL,              -- quran-and-hadith | education | scholar-site | publisher | organization | payments | shortener | malware | other
  source TEXT NOT NULL,                -- admin | scan | seed
  note TEXT, added_by TEXT, added_at TEXT NOT NULL, deleted_at TEXT
);

CREATE TABLE channel_link_domains (
  channel_id TEXT NOT NULL, domain TEXT NOT NULL, token TEXT NOT NULL,
  verified_at TEXT, last_checked_at TEXT, PRIMARY KEY (channel_id, domain)
);

ALTER TABLE channel ... -- links_suspended_at, links_suspended_reason (on the channel record, wherever channel flags live)
```

- The video record gets `madeForKids` and a `hasPlayerLinks` quick flag, like `hasChapters`.
- System credits aren't stored. They live in `SYSTEM_CREDITS` (shared-types) and are matched from the served cues.
- Every query is indexed by video, channel or domain. No admin view scans the whole table; the admin lists page with an index and a count first (no full D1 scans).

### 12.2 Embeds

- **Everything renders** on `embed.alummahnow.net` as on the watch page, except:
  - **End-screen elements that point to another channel are left out**, following [Epic 25 §25.7](E25-sharing-embeds.md): "never other channels' content on someone's website". Cards may point anywhere internal.
  - **Internal targets open on `videos.alummahnow.net` in a new top-level tab** (`target="_blank"`), never inside the iframe.
  - **Subscribe** uses the embed's popup sign-in.
- **`links=0`** hides cards and end screens. It never hides a required credit. It is listed in the oEmbed and embed docs on alummahnow.dev.
- **Player JavaScript API:** a new event, `linkclick { kind, targetType }`. It carries no URL and no ids of other channels.

### 12.3 Read API (viewers, every client)

`GET /api/v1/videos/:id/player-links`:

- **Public and cacheable:** 60 s at the edge, with an `ETag` from the video's links version plus the switch and tier state.
- **Fetched** after the player is ready, never blocking the first frame.
- **Enforced on the server, before anything is sent:**
  - switches, tier limits and the rules of [§7.4](#74-where-links-never-show);
  - target availability;
  - the blocklist;
  - embed filtering, with `?surface=embed`.
- Titles and thumbnails are resolved in the viewer's language (`Accept-Language`, else the video's language). Counts are formatted on the client.

```jsonc
{
  "version": 7,
  "cards": [
    { "id": "…", "startMs": 63000, "teaser": "Part 2", "message": null,
      "target": { "type": "video", "videoId": "…", "title": "…", "thumbnail": "…", "duration": 1260, "channelName": "…" } }
  ],
  "endScreen": {
    "windowMs": 20000,
    "elements": [
      { "id": "…", "startMs": 0, "box": { "x": 0.06, "y": 0.18, "w": 0.4, "h": 0.225 },
        "target": { "type": "playlist", "playlistId": "…", "title": "…", "thumbnail": "…", "count": 12 } },
      { "id": "…", "startMs": 0, "box": { "x": 0.7, "y": 0.2, "w": 0.16, "h": 0.284 },
        "target": { "type": "subscribe", "channelId": "…", "name": "…", "avatar": "…" } }
    ]
  },
  "credits": []          // creator credits (phase 5); system credits come from the cues
}
```

- An external target is served as `{ "type": "url", "url": "https://…", "domain": "example.org", "displayDomain": "example.org", "paid": false }`.
- With every switch off, or nothing to show, the answer is `{ "version": n, "cards": [], "endScreen": null, "credits": [] }` with status 200. A viewer never gets `feature_off` here.

### 12.4 Write API (Studio)

| Route | Does |
|---|---|
| `GET /api/videos/:id/player-links/edit` | The full stored set: every element with its status and reason, the limits, the window and the version |
| `PUT /api/videos/:id/player-links` | Replaces the set: `{ version, endWindowMs, cards[], endElements[] }`. It validates everything in §3, §5 and §7. Errors use the error envelope with field paths: `409 version_conflict`, `402 upgrade_required`, `422 link_domain_not_allowed`, `422 link_unsafe`, `404 feature_off` |
| `POST /api/videos/:id/player-links/copy-from` | Copies another video's elements: `{ fromVideoId }` |
| `GET /api/channels/:id/link-domains` · `POST …/link-domains` · `POST …/link-domains/:domain/verify` · `DELETE …` | Verified domains |
| `GET /api/link-domains/check?url=` | Studio's inline domain status |
| `POST /api/link-domains/requests` | Asks for an allowlist review |
| admin-api `GET/POST/PATCH/DELETE /api/player-links/domains`, `POST /api/player-links/:id/hide` · `/restore`, `POST /api/channels/:id/links-suspension` | Admin domain list, takedown, restore and channel suspension. Each writes an audit entry |

- **Pickers** use the existing `/suggest` endpoints, which return a first page when `q` is empty.
- **OpenAPI:** the routes are in the api-videos OpenAPI document. Core generates the models from it for the native apps (phase 4).

### 12.5 The interstitial

- Opened in the player layer when a `url` element is activated.
- It shows:
  - the destination domain, large;
  - the full URL, small and truncated in the middle;
  - "This site isn't run by Al Ummah Now." / «هذا الموقع لا تديره الأمة الآن.»;
  - the paid-link label, if any.
- **Buttons:** **Continue** (opens a new tab with `rel="noopener noreferrer"`), **Cancel**, and **Report link**.
- Focus starts on Cancel. Escape closes it and returns focus to the element.
- There is no "don't ask again" in version 1.

## 13. Rollout

### Phase 0: the Quran Foundation credit (in progress)

Built on `feat/qf-short-credit`, made the first `credit` element:

1. **shared-types:**
   - `QURAN_CREDIT`, `QURAN_FOUNDATION_URL`, `quranCreditFor()` and `splitQuranCredit()` (on the branch);
   - plus `player-links.ts` with the `SystemCredit` type and `SYSTEM_CREDITS = [quranFoundation]`.
2. **Server:** `fillCaptionQuranMarkers` ends each Quran or translation cue with the short credit in the cue's language (on the branch). Players that can't link (native today) show it as caption text, which still meets QF's terms.
3. **Web player:**
   - a `PlayerLinksLayer` component inside the frame, with the first child `PlayerCredit`;
   - it reads the active cue, strips the credit with `splitQuranCredit`, and draws the linked credit under the cue at the cue's end side ([§6.2](#62-captions-and-the-credit)).
   - This one component is what cards and end screens extend later: the same layer, zones, focus handling and analytics hook.
4. **Studio:** the Quran span card shows the same linked credit (on the branch).
5. **Feature registry:** the `playerCredits` entry (on, super admin), and `quranText` requires it.
6. **Tests:**
   - unit tests for `splitQuranCredit` (en, ar, the old long line from edge caches, no credit);
   - player harness specs: the credit shows only with a Quran cue, sits under the cue at the end side in en and ar, moves with the controls, stays clear of the bar at 320px, opens `https://quran.foundation/` in a new tab, and is a reachable link with the right name;
   - axe on the player with the credit showing.
7. **Screenshots for the owner:** dark first, en and ar, desktop, phone and fullscreen, in real-browser viewport frames.

**Phase 0 accessibility:** the credit is a real link in the frame's tab order, after the big play button and before the control bar. If it has focus or the pointer when its cue ends, it **stays until blur or pointer leave**, so focus is never lost. For screen-reader and keyboard users who can't catch a passing cue, the watch page's description area gets a fixed "Sources: Quran Foundation" line with the same link whenever the video's captions contain QF text. The server reports this as `sources: ['quranFoundation']` on the video view.

### Phase 1: the layer and internal info cards (web)

- Data model, read and write API, `playerCards` switch, tier columns, and the stored `madeForKids` flag.
- Card icon, teaser, cards panel and corner queue. Studio section with the timeline, pickers and preview.
- Analytics events and counters, Studio counts, embed rules, and the `links=0` parameter.

### Phase 2: end screens (web)

- `playerEndScreens`, the canvas editor, templates, compact phone mode, the Hide button, the caption move, Up next hand-off, and Copy from video.

### Phase 3: external links

- `playerExternalLinks`, the `link_domains` admin page, channel domain verification, scanning jobs, the interstitial, `player_link` reports, takedown and suspension, and the audit log.

### Phase 4: native apps and TV

- Core models and client for `player-links`, generated from OpenAPI.
- Apple (iOS, iPadOS, macOS, tvOS), Android (phone, tablet, TV, Fire TV) and Desktop (Windows, Linux, Tizen) renderers, following [§6.4](#64-every-player-size).
- Credits lifted into links on phones and desktops (in-app browser: SFSafariViewController or Custom Tabs).
- Native Studio editing on tablets and desktops (the canvas needs room; phones get the lists and pickers without the canvas).

### Phase 5: creator credits and extras

- Creator "Source: …" credits ([PL-D8](#16-owner-decisions)), dynamic "best for viewer", bulk apply, and the channel-level end-screen default.

**Default state:** every creator switch stays **off** on stage and production until the owner turns it on after a QA review. QA turns them on for the release tests.

## 14. Accessibility

- **Keyboard order inside the frame:** start-over pill, card icon, credit link (while shown), end-screen elements (in reading order, while shown), then the control bar.
  - Nothing steals focus when it appears. A teaser never takes focus.
  - The new shortcut **I** opens the cards panel; it is free in `keyboard-shortcuts.ts` and listed in the shortcuts dialog. Escape closes the panel and returns focus to the icon.
- **Accessible names:**
  - Card icon: "Info cards, 3" / «بطاقات المعلومات، ٣» (count in the interface's digits).
  - Card: "Video: {title}, {channel}, {duration}".
  - End element: the same, plus "Subscribe to {channel}" or "Playlist: {title}, {count} videos" (Arabic uses «مرئي/مرئيات» with the count grammar from the [glossary](../guides/glossary.md)).
  - External element: "Link to {domain}, opens a confirmation".
  - Credit: "Source: Quran Foundation (opens in a new tab)".
- **Announcements:**
  - A teaser is **not** announced; it would interrupt the audio every time.
  - The end screen's start is announced once through the player's polite live region: "End screen: 3 links". The Hide button is reachable.
- **Reduced motion:** no slide or scale; the teaser fades in place (or appears instantly), and the end-screen elements appear without zoom.
- **Hit targets and contrast:**
  - at least 44 × 44px, with compact mode guaranteeing it on phones;
  - text over video sits on the theme's `scrim` with at least 4.5:1 contrast in all four themes, checked by the existing pixel and axe contrast sweep.
- **Captions first:** link UI never covers a cue ([§6.2](#62-captions-and-the-credit)), and the viewer's caption style applies to the credit.
- **TV:** elements are focusable with the D-pad in a predictable grid order, with a visible focus ring.

## 15. Stories

| Story | What | Phase | Repos | Status |
|---|---|---|---|---|
| PL-0 | Spec, research and decisions (this page) | — | Wiki | done 2026-11-23 |
| PL-1 | QF short credit: shared-types credit constants, served cue line, Studio card (branch `feat/qf-short-credit`) | 0 | AlUmmahNow | building |
| PL-2 | `PlayerLinksLayer` + `PlayerCredit` in the web player, `SYSTEM_CREDITS`, the watch-page "Sources" line, harness specs and screenshots | 0 | AlUmmahNow (web, shared-types, api-videos) | planned |
| PL-3 | `playerCredits` switch; `quranText` requires it | 0 | AlUmmahNow | planned |
| PL-4 | Schema (`player_links`, `player_link_settings`), video `madeForKids` + `hasPlayerLinks`, read API, write API, OpenAPI | 1 | AlUmmahNow | planned |
| PL-5 | Tier columns (cards, end elements, external, domains), Tiers page fields en + ar, 402 entitlements | 1 | AlUmmahNow | planned |
| PL-6 | `playerCards` switch + user feature key; card icon, teaser, panel and corner queue (with the chapter toast) | 1 | AlUmmahNow (web) | planned |
| PL-7 | Studio "Cards and end screen" section: preview player, timeline, pickers, cards list, version conflicts | 1 | AlUmmahNow (web) | planned |
| PL-8 | Analytics events, `player_link` counters in `CounterBatch`, Studio per-element counts | 1 | AlUmmahNow (web, api-videos, processor) | planned |
| PL-9 | Embed rules: same-channel end elements, `links=0`, `linkclick` event, docs on alummahnow.dev | 1 | AlUmmahNow, AlUmmahNowUI (dev) | planned |
| PL-10 | `playerEndScreens` switch; end-screen renderer, compact phone mode, Hide, caption move, Up next hand-off | 2 | AlUmmahNow (web) | planned |
| PL-11 | End-screen canvas editor: grid, templates, keyboard editing, Copy from video | 2 | AlUmmahNow (web) | planned |
| PL-12 | `link_domains` admin page (allow/block, categories, autocomplete search, soft delete), seed list, review requests | 3 | AlUmmahNow (admin-api, admin-web) | planned |
| PL-13 | Channel domain verification (DNS TXT / well-known file; scholar-site and own domains count) | 3 | AlUmmahNow | planned |
| PL-14 | URL checks on save, daily domain re-scan job (queue, DLQ, Errors page), auto-blocklist | 3 | AlUmmahNow (api-videos, processor) | planned |
| PL-15 | `playerExternalLinks` switch; interstitial; paid-link label | 3 | AlUmmahNow (web) | planned |
| PL-16 | `player_link` reports, takedown, restore, channel link suspension, audit, creator notices | 3 | AlUmmahNow (admin-api, admin-web, web) | planned |
| PL-17 | Core: player-links models and client | 4 | AlUmmahNowCore | planned |
| PL-18 | Apple renderers (iOS, iPadOS, macOS, tvOS) + credit link | 4 | AlUmmahNowApple | planned |
| PL-19 | Android renderers (phone, tablet, TV, Fire TV) + credit link | 4 | AlUmmahNowAndroid | planned |
| PL-20 | Desktop renderers (Windows, Linux, Tizen) + credit link | 4 | AlUmmahNowDesktop | planned |
| PL-21 | Native Studio editing (tablet and desktop canvas; lists on phones) | 4 | Apple, Android, Desktop | planned |
| PL-22 | Creator credits, latest-upload and best-for-viewer elements, bulk apply, channel default end screen | 5 | AlUmmahNow | planned |
| PL-23 | E2E: release specs per phase on the local stack with each spec's own data and cleanup; feature registry and wiki status | all | AlUmmahNow, Wiki | planned |

## 16. Owner decisions

Each question has a recommendation. Phase 0 is built to the recommendations for PL-D4 and PL-D5. Nothing else is built until the owner answers.

| # | Question | Recommendation |
|---|---|---|
| PL-D1 | Hard caps per video: 5 cards and 4 end-screen elements, as on YouTube, with tiers set at or below them? | **Yes.** More than that brings back annotation clutter |
| PL-D2 | Who may add external links? | **Only tiers with `playerExternalLinks`** (none by default; Unlimited yes), and only channels in good standing (no active strike, no link suspension) |
| PL-D3 | Domain policy: allowlist only (admin list + the channel's verified domains), or any domain except a blocklist? | **Allowlist only.** The blocklist still wins over both |
| PL-D4 | Interstitial for every external link, system credits included? | **Creator links: always. System credits (QF): no interstitial**, a direct link in a new tab, as QF asked |
| PL-D5 | Can admins switch the QF credit off? | **Only with the Quran text.** `playerCredits` stays a super-admin switch, and `quranText` requires it, so Quran text never shows without its credit |
| PL-D6 | Payment, donation, zakat and crowdfunding links? | **Never**, including for admins. Money goes only through [AUN-MEMBERS](AUN-MEMBERS-creator-support.md) |
| PL-D7 | Merch, stores and affiliate links? | **Not in version 1.** If added later: allowlisted store domains only, with a required "Paid link" label |
| PL-D8 | Creator-written credits ("Source: …") as fixed overlays? | **Yes, in phase 5:** text plus an optional link under the same external rules, for a time range, 3 per video, a separate tier column |
| PL-D9 | When the creator's end screen has a chosen video, should it become the Up next video at the end? | **Yes,** unless the viewer is in a playlist or queue. The Up next countdown and autoplay setting are unchanged |
| PL-D10 | TV behavior? | **End-screen internal elements only, with the remote.** No cards and no external links; credits as text |
| PL-D11 | Store `madeForKids` on every video (set at upload and in Studio, imported from YouTube) so links can be withheld? | **Yes.** It is needed anyway for [Epic 20](E20-ummah-kids.md) |
| PL-D12 | Add tracking parameters (`utm_source=alummahnow`) to external links? | **No.** Daily counts are enough, and destinations see only the referrer origin |
| PL-D13 | URL scanning provider? | **Cloudflare URL Scanner + Google Safe Browsing Lookup** (no paid service). Ask Google whether a nonprofit platform counts as non-commercial; if not, Cloudflare plus the allowlist alone |
| PL-D14 | Links on age-restricted videos, and on videos held in review or with an open report? | **Age-restricted: internal only. Held or reported: internal only** until resolved. Made for kids: none |
| PL-D15 | Default switch state at launch? | **All creator switches off** on stage and production; on in QA for review; `playerCredits` on everywhere |
| PL-D16 | Teaser and message text: one language (user content) or en + ar? | **One language**, as user content. The Translate button can be offered but isn't required |
| PL-D17 | Tier defaults? | **Free: none. Creator: 5 internal cards, 4 internal end elements, no external links. Unlimited: everything, 5 verified domains** |
| PL-D18 | Dynamic elements ("latest upload", "best for viewer")? | **Latest upload in phase 2**; best for viewer after the feed ranking work (AUN-FEED-RANKING) ships |
| PL-D19 | Cross-channel targets on the watch page? | **Allowed** (other channels' public content), as on YouTube; never in embeds |
| PL-D20 | Should viewers get a setting to hide all cards and end screens site-wide? | **Not in version 1.** The per-video Hide button and `links=0` in embeds cover it; revisit with usage data |

## Sources

- Owner request 2026-11-23 (relayed by the orchestrator).
- QF terms: [QF1](decisions.md#qf1-quran-foundation-content-use), [AlUmmahNow#1722](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1722), [AlUmmahNow#1716](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1716), and the `feat/qf-short-credit` branch (QF 2026-11-23: the short credit linked to https://quran.foundation/).
- Code at AlUmmahNow [`4486c20`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/4486c207b2837e69bb4ef315edc8bf89566ba1e8):
  - [`docs/specs/VIDEO-PLAYER.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/docs/specs/VIDEO-PLAYER.md) (§5 layout, end screen, layers, RTL);
  - [`docs/specs/EMBEDS-COMMENTS-TIERS.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/docs/specs/EMBEDS-COMMENTS-TIERS.md) (§25.4 to §25.7);
  - [`PlayerOverlays.tsx`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/apps/web/src/components/VideoPlayer/PlayerOverlays.tsx);
  - [`player-skin.css`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/apps/web/src/styles/player-skin.css);
  - [`creator-tiers.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/packages/shared-types/src/creator-tiers.ts);
  - [`features.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/packages/shared-types/src/features.ts);
  - [`schemas/chapter.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/packages/shared-types/src/schemas/chapter.ts);
  - admin-api [`0020_reports_queue.sql`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/4486c207b2837e69bb4ef315edc8bf89566ba1e8/apps/admin-api/migrations/0020_reports_queue.sql).
- Research: the links in [§1](#1-how-youtube-does-it-research-2026-11-23), all read on 2026-11-23.
