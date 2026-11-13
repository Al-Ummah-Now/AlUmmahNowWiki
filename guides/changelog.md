[← Home](../README.md)

# Changelog

What changed across the Al Ummah Now repos, grouped by feature. Newest first. Each entry links the pull requests; the guides and repo pages describe how things work now.

## 2026-11-13: follow-ups

- **Event archive privacy:** the processor's archive of queue messages no longer holds raw user ids or free text. Ids become pseudonyms whose per-person secret is deleted when the account is erased, so an erased person's archived events can't be tied back to them. Older entries were rewritten once ([#1180](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1180), [#1177](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1177)). See [Deletion, erasure and cleanup](data-lifecycle.md#the-event-archive).
- **Copy tone:** the videos site, www and Desktop Studio stop describing Al Ummah Now as a lecture library and use neutral content-sharing words in English and Arabic, following the new [Copy Tone Guide](copy-tone.md) ([#1168](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1168), [UI#77](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/77), [Desktop#37](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/37)). The videos site's default title and description are now per language. Every repo's CLAUDE.md carries the rule.
- **Search engines (SEO defect fixes):** the first fixes from the SEO audit that need no owner decision ([Wiki#23](https://github.com/Al-Ummah-Now/AlUmmahNowWiki/pull/23), draft spec). See [Search engines](environments.md#search-engines-crawler-rules).
  - **Status codes:** a missing, private or deleted video or playlist is now a real 404 (it was a 200 "not found" marked indexable), and an API outage is a 503.
  - **Old watch URL:** `?vid=` links are a 301 to `/video/{id}`.
  - **Arabic title:** `/ar` pages without their own title use the Arabic site name.
  - **Non-production:** QA and stage videos are noindex with `Disallow: /`.
  - **Private hosts:** the auth, profile/account, admin, API, realtime, CMS and media hosts are noindex with `Disallow: /`. CMS public media stays crawlable.
  - **Viewer-only pages** on the videos site are noindex.
  - PRs: [#1158](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1158), [#1160](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1160), [Auth#342](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/342), [CMS#104](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/104).
- **Subscribe without a channel:** a signed-in viewer with no channel can subscribe on the watch and channel pages, as themselves; there is no "create a channel first" prompt any more. With a channel active, Subscribe still subscribes as that channel. Counts, the Subscriptions feed and list, notifications, privacy export and erase, and Studio analytics cover both kinds; subscriber analytics had always shown 0 and now report real numbers ([#1152](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1152)). See [Channel subscriptions](../repos/AlUmmahNow.md#channel-subscriptions).
- **Upload the same file again:** the single uploader now does what batch does when a file it already uploaded is picked again. It shows **Already uploaded** with a link to the video, plus **Upload again as a new video** and **Choose another file**, instead of silently creating a second video ([#1126](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1126)). Unfinished uploads still resume at their offset.
- **Session cookies:** the videos web app's session cookies are no longer Secure on a plain-http localhost, which lifts the WebKit quarantine on the local stack ([#1094](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1094)). Deployed hosts are unchanged.
- **Encode cap:** stage and QA E2E now run in two parallel parts (main and encode). The encode part shares run clips, which makes about 8 Bunny uploads per release, and fails above 10 ([#1061](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1061), merged). See [Testing and E2E](testing.md#encodes-and-load).
- **Sources:** epic and decision pages now cite PRs and issues instead of chat threads.
- **Repo docs:** stale docs were fixed in the repos themselves (monorepo CLAUDE.md, README and THEMES.md; the CMS architecture and roadmap; www's plan and README; openauth's release notes; Android's merge rule).
- **Issues closed after checking the code:** Auth [#251](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/251) and [#252](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/252), CMS [#45](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/45) and [#69](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/69), and Apple [#5](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/5).
- **Left open with what remains:** CMS [#46](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/issues/46) (the 80% warning) and Desktop [#15](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/issues/15) (store packaging and a Flathub source build).

## 2026-11-12: sweep of 2026-11-09 → 2026-11-12

About 670 pull requests merged across the organisation in four days: 432 in the monorepo, 62 in Auth, 66 in the CMS, 40 in www, 21 in openauth, 14 in Tools and 26 across Core and the native apps. Monorepo releases ran from `v2026.11.09` to `v2026.11.12.9`.

Short PR references below are monorepo PRs ([AlUmmahNow](https://github.com/Al-Ummah-Now/AlUmmahNow/pulls)).

### Testing moved off shared QA

- **Local E2E stack.** Every monorepo worker runs in one Miniflare per CI job, with the real Auth issuer from its released bundle and fakes for Bunny, the CDN and Resend. Nothing leaves the machine ([#962](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/962), [#1001](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1001), [#1002](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1002), [Auth#323](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/323)).
- **Local E2E** runs the release, admin and web suites on every PR, every push to `main`, nightly and in every release, and releases wait for it ([#965](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/965), [#985](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/985), [#987](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/987), [#1050](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1050), [#1053](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1053)).
- **Placement:** every spec is listed as `local` or `deployed` ([#958](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/958)).
- **Own data and cleanup:** specs seed their own data through builders and delete all of it even on failure. Leftover checks run locally and on QA, including Bunny and R2 ([#981](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/981), [#993](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/993), [#998](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/998), [#1004](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1004)).
- **Per-run accounts** for every E2E job, no shared-user queue ([#732](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/732), [Auth#303](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/303)).
- **Quarantine format and outcomes:** quarantines name an issue and an owner, and every web shard lists its skipped tests with reasons and keeps per-test results ([#801](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/801), [#1089](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1089)).
- **QA's wide suite is nightly only and gates nothing.** No spec stops running: specs leave it only by moving to the local stack ([#1054](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1054)).
- **Functional specs gate; load and timing specs report.** Encode-waiting specs run under a 2-slot lock, and slow third-party encodes skip ([#842](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/842), [#952](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/952)).
- **Cleanup jobs:** the stale run-account sweep runs hourly and drains its backlog ([#1087](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1087)). There is an hourly test-library census and guard ([#1063](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1063)), and a finder for orphaned Bunny collections ([#1092](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1092)).

Details: [Testing and E2E](testing.md).

### Releases

- Releases are gated on stage E2E, Local E2E and live secrets checks of stage and production. A rollback dry run follows every promote ([#692](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/692)).
- The translation store is synced with the repo and checked on every deploy; only admin-edited keys beat repo text ([#999](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/999), [#1005](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1005)).
- Releases deploy the media Worker with its own smoke and rollback ([#948](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/948)).
- Transient failures are re-run on the same tag; tags are never moved.
- www and the CMS wait for a new candidate to answer three times before the smoke ([UI#28](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/28), [CMS#49](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/49)).
- openauth releases from git tags ([openauth#27](https://github.com/Al-Ummah-Now/openauth/pull/27)).
- Native release pipelines exist for Apple, Android and Desktop ([Apple#19](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/19), [Android#10](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/10), [Desktop#27](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/27)).

Details: [Release process](release-process.md).

### Video delivery

- **R2 + Cloudflare CDN beside Bunny:** an FFmpeg transcoder on Cloudflare Containers, dual write, a playback switch with fallback to Bunny, QoE and cost per source, and an admin Delivery comparison page. Live in QA, stage and production since `v2026.11.12.3` ([#893](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/893)–[#897](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/897), [#948](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/948)).
- **We keep our own originals,** so R2 transcodes start at upload ([#972](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/972)).
- **The API picks the source and returns one playback URL;** players never choose ([#1013](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1013)).
- **New production Bunny library.** Production uploads go to library 498994, and every video is in its channel's or owner's collection ([#954](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/954)).
- **Signed URLs are made per response and never stored.** Share images are stable `/thumb/<id>.jpg` URLs on our domain ([#1038](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1038)).
- **Embed fixes:** Shorts embed at their own ratio, sound after a click, and the frame fills on the theme's night colour. Playlist embeds play the saved order ([#1034](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1034), [#1041](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1041), [#858](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/858)).

Details: [Video delivery](video-delivery.md).

### Privacy, deletion and cleanup

- **Admin deletes are soft deletes,** restorable for 30 days and then purged hourly. This covers the videos admin, Auth and the CMS ([#698](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/698), [#704](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/704), [Auth#293](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/293), [CMS#63](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/63)).
- **GDPR erasure** now covers Contact us messages, invites, error identity, category suggestions and upload traces ([#626](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/626), [#1077](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1077)).
- **Auth purges** remove the email → subject record and invite rows ([Auth#326](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/326), [Auth#335](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/335)).
- **Channel deletes** remove the channel's Bunny collections ([#1086](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1086)).
- **Pending "Delete videos data"** blocks a user's writes ([#836](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/836)).

Details: [Deletion, erasure and cleanup](data-lifecycle.md).

### Videos admin

- **Redesigned shell** that follows the site theme, with grouped navigation, breadcrumbs, ⌘K search and a shared list foundation ([#820](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/820), [#823](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/823)).
- **Action needed and History queues** for AI flags, contact messages, errors and reports. Warn user ([#821](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/821), [#822](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/822), [#824](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/824)).
- **Realtime over WebSockets:** admin channels with a role check and at most one update a second per topic. Producers for jobs, uploads, errors and moderation. Polling only as a fallback ([#967](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/967), [#971](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/971), [#973](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/973)).
- **Platform analytics in the admin:** the `cost-monitor` collector and the Operations page ([#974](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/974), [#976](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/976)).
- **Processing card** with Bunny and R2 side by side and per-rendition R2 progress ([#1011](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1011)).
- **Search pickers:** every search and lookup is an autocomplete, with no raw ids, and every picker opens with content ([#696](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/696), [#852](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/852)).
- **Live streaming page** for provider routing ([#871](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/871)), **creator invites** ([#715](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/715)), and **account actions requested from Auth** through a queue ([#574](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/574)).

### Videos site and Studio

- **Web Creator Studio** shipped ([#498](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/498)). Bulk rename and bulk edit with undo, ordering and per-language rules ([#765](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/765), [#809](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/809), [#812](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/812)). Creator trash ([#764](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/764)).
- **Live streaming:** both providers with round-robin assignment ([D3](../epics/D3-live-provider.md)), Studio Live and Go live ([#867](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/867), [#872](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/872)).
- **Playlists:** playback with a queue API and autoplay, bilingual names, and Watch later per user ([#856](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/856), [#833](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/833), [#847](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/847)).
- **Theme redesign** of the page frame, watch page and player ([#525](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/525)). Site-wide theme set by admins, Fawanees by default. Theme packages and the theme builder ([#492](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/492), [#575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/575), [#587](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/587), [#883](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/883)).
- **Dislikes** on videos and comments are hidden and their routes answer 410 ([#884](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/884), [#889](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/889)).
- **Scalability audit fixes:** atomic counters, conditional writes, index-backed reads and sharded websockets ([#504](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/504)–[#554](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/554), [#800](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/800)).

### Sign-in and accounts

- **PKCE** on every web client. Sign-out revokes refresh tokens. Sessions and revocations live in D1. Suspended and deleted accounts get no tokens ([Auth#276](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/276), [Auth#285](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/285), [Auth#286](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/286), [Auth#288](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/288), [#559](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/559), [#718](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/718)).
- **openauth on D1:** single-use codes, refresh rotation and atomic counters ([Auth#266](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/266), [openauth#29](https://github.com/Al-Ummah-Now/openauth/pull/29)–[#36](https://github.com/Al-Ummah-Now/openauth/pull/36)).
- **Rate limits** use Workers Rate Limiting, and codes and passwords have attempt limits ([Auth#264](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/264), [Auth#268](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/268)).
- **Moderation requests, invites and the Scholar role** in Auth admin ([Auth#275](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/275), [Auth#299](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/299), [Auth#298](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/298)).
- **Look and language:** sign-in pages are English unless `?lang=ar`, follow the site theme, and send one email design in one language ([Auth#261](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/261), [Auth#282](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/282), [Auth#319](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/319)).
- **JWKS and discovery** are edge-cached, with the last good copy served when D1 stalls ([Auth#333](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/333)).
- **Session cookies** are Secure everywhere except a plain-http localhost. This covers the Auth issuer's `__session` ([Auth#336](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/336), [openauth#41](https://github.com/Al-Ummah-Now/openauth/pull/41)) admin-web and the videos web app ([#1094](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1094), merged 2026-11-13).

Details: [Authentication and SSO](authentication.md), [Site roles and channel roles](roles.md).

### www and the CMS

- **CMS admin screens:** the CMS has its own admin screens, and bknd's admin UI is retired ([CMS#22](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/22), [CMS#30](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/30)).
- **Publishing tools:** scheduled publishing, revisions, draft previews and image variants ([CMS#41](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/41), [CMS#43](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/43), [CMS#38](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/38), [CMS#42](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/42)).
- **Home timeline** managed in the CMS and published to Workers KV. It rebuilds automatically when its format changes ([CMS#51](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/51), [UI#30](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/30), [CMS#72](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/72)).
- **One home list:** `/videos` and `/articles` are CMS list pages ([CMS#92](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/92), [UI#51](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/51)). News became Articles ([UI#31](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/31)).
- **Card posts** ([CMS#48](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/48), [UI#34](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/34)), **scholar pages** ([CMS#67](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/67), [UI#38](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/38)) and **header autocomplete search** ([UI#35](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/35)).
- **AI writing assist** on Workers AI, with pluggable providers and a budget, plus translation flags ([CMS#55](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/55), [CMS#65](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/65), [CMS#93](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/93)).
- **www follows the admin's site theme** in all four themes, light and dark ([UI#54](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/54)).

Details: [AlUmmahNowUI](../repos/AlUmmahNowUI.md), [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md), [Theming](theming.md).

### Platform-wide rules

- **One display-name rule:** display name, else first + last, email only as a last resort ([#1032](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1032), [Auth#327](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/327), [CMS#96](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/96), [UI#57](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/57), [Core#35](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/35)).
- **«المرئيات»** is the Arabic plural for videos everywhere ([#1033](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1033), [Auth#328](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/328), [CMS#97](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/97), [UI#58](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/58)).
- **In-app confirmation dialogs,** never browser prompts ([#697](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/697), [Auth#294](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/294), [CMS#61](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/61), [UI#33](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/33)).
- **Favicons** are the owner's art, cropped and resized, as exact-size PNGs ([#845](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/845), [UI#49](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/49), [CMS#86](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/86), [Auth#318](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/318)).
- **Cloudflare usage** was cut on QA and in Auth ([#863](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/863), [Auth#321](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/321), [CMS#94](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/94), [UI#52](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/52)).

### Native apps, Core and Tools

- **Studio MVP** on Apple ([Apple#16](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/16)–[#19](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/19), [Apple#25](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/25)), Android ([Android#7](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/7)–[#10](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/10)) and Desktop ([Desktop#24](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/24)–[#27](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/27), [Desktop#32](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/32)). It covers multi-account sign-in, a channel picker, resumable batch upload with set-for-all values, managing videos, bulk edit, soft delete and restore, and analytics.
- **The Apple apps follow the admin-set site theme** ([Apple#13](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/13), [Apple#14](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/14)).
- **Core `v0.3.0-rc.1`:** LoginPrompt, sign-out that revokes the refresh token, loopback redirects, `aun-search`, and upload resume through the proxy ([Core#22](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/22)–[#30](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/30)).
- **Tools:** importer idempotency and safety fixes TOOLS-1 to TOOLS-10, including the Bunny retry with `Retry-After`. Thumbnails keep the video's shape, and there is no hard delete of platform content ([Tools#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30)–[#41](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/41)).

Details: [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md).

### Decisions recorded

- **[D3](../epics/D3-live-provider.md), live provider:** decided 2026-11-11. Both providers ship together with round-robin assignment.
- **[D2](../epics/D2-video-delivery.md), video delivery:** the R2 side is implemented and running beside Bunny.

### Wiki pages added or changed in this update

New guides: [Testing and E2E](testing.md), [Video delivery](video-delivery.md), [Deletion, erasure and cleanup](data-lifecycle.md) and this changelog. Updated: every repo page's "Current state", [Release process](release-process.md), [Environments](environments.md), [Authentication](authentication.md), [Roles](roles.md), [Theming](theming.md), [Contributing](contributing.md), the [Glossary](glossary.md), the [epics index](../epics/README.md), the [decision log](../epics/decisions.md) and the epic pages whose status changed.
