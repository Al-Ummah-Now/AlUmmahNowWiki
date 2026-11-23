[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Feature switches: one Features page, enforced everywhere

| | |
|---|---|
| **ID** | `AUN-FEATURES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (shared-types, api-videos, admin-api, admin-web, web, processor), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowTools](../repos/AlUmmahNowTools.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (www) |
| **Status** | **build** (phase 3 of 3; design runs alongside). FEAT-1 merged; FEAT-3, FEAT-4 and FEAT-2 in review |
| **Last updated** | 2026-11-23 |
| **Origin** | Owner request 2026-11-22: "enable and disable features, from videos admin on one page for all features with help text, enforced on web and native apps, spec -> design -> build and keep it tracked." Addition the same day: a generic server error, so that "errors coming from the server can be shown even when a client doesn't support them yet". |
| **Linear** | [AUN-594](https://linear.app/hamzalabs/issue/AUN-594/aun-features-feature-switches-one-features-page-enforced-everywhere) (stories AUN-595 to AUN-611) |

## Goal

One page in the videos admin lists every feature that can be switched on or off. Each row has the feature's name, help text that says what people lose when it is off, an on/off switch, who changed it last and when, and any dependency notes. A change takes effect on the server first: the API refuses an off feature with `feature_off`. Every client follows it too. The web, Apple, Android, Desktop and Tools all hide what is off.

Next to that, one error envelope for every API we own. Each error carries a stable `code` and a message in the user's language, written on the server. A client that doesn't know a code can still show that message correctly, including the `feature_off` message.

## Decisions and constraints

- [O39](decisions.md#o39-one-features-page-server-enforced): one Features page in the videos admin, enforced by the server (this epic, decided by the owner's request).
- [O40](decisions.md#o40-server-written-error-messages): server-written error messages; `feature_off` carries a message ([§5.2](#52-server-error-envelope-and-catalogue-feat-3)).
- [Product rules → Hidden when off](../guides/product-rules.md#hidden-when-off) (owner, 2026-11-16) stays. A client that knows a feature is off shows no entry point for it: no tab, button, link or help entry. **O40 changes one thing:** when an action still reaches `feature_off`, the person sees the server's short message once (inline or as a toast), and the entry point then disappears. Today nothing is shown. This happens when an old app version predates the switch, or when the feature was switched off while the page was open. The message never says "not in your tier", never upsells and never links to /upgrade.
- [O37](decisions.md#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature): the Upgrade page mode is decided only by payment providers and "Allow tier requests". That switch moves to the Features page and keeps its value; no new input is added.
- Videos admin, not the Auth admin ([O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership), [videos admin manages its own permissions](../guides/roles.md)). Permissions are checked in admin-api, and nothing uses Auth RBAC.
- [O26](decisions.md#o26-always-async-with-admin-visible-errors): background work respects switches through its queues, with retry and a dead-letter queue. Anything that gives up shows on the Errors page with Retry.
- [O38](decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000): Arabic numbers are never grouped, Arabic separates values with «،», and times in the admin are local with the zone and a UTC tooltip, using the shared formatter.
- [O18](decisions.md#o18-four-themes-fawanees-default) and the [Fawanees solid surfaces](../guides/theming.md) rule: the page is designed in all four themes, dark first, en and ar, phone and desktop.
- [QF1](decisions.md#qf1-quran-foundation-content-use): `viewerCaptionDownload` is the first new switch. It is **off**: the owner decided on 2026-11-22 that there are no caption downloads for viewers.
- [O1](decisions.md#o1-whole-platform-cost-cap): no new paid service. Switches live in the search D1, which is already bound to every worker that needs them.

## 1. What exists today (inventory, 2026-11-22)

| Piece | Where | What it does | Gap this epic closes |
|---|---|---|---|
| `GET /api/me/features` | api-videos `lib/features/index.ts`, shared-types `features.ts` | 16 keys, computed on the server from configuration, tier and channel role. It fails closed. | No admin master switch over it, no ETag, and signed-out callers aren't cached. |
| `404 {"code":"feature_off"}` | api-videos `lib/features/off.ts`, admin-api newsletter and site domains | Gated APIs refuse with it. | No user message (O40). |
| `GET /public/features` | admin-api `lib/public-features.ts`, read by www `apps/www/src/lib/features.ts` | `{ newsletter }`, cached for 30s. | Not switchable: "on" means the Resend key and the queue are bound. |
| `GET /api/v1/app-config` flags and update policy | api-videos `lib/feature-flags.ts`, `lib/app-config.ts`, the admin's Remote config page | Rule-based remote flags and the minimum app version. | **No client reads it.** No app has a forced-update screen. Core's generated path is `/api/app-config`, not `/api/v1/app-config`. |
| On/off switches on other pages | Tier requests (`creator_tier_settings.tier_requests_enabled`), Platform settings › YouTube import (`global_settings` `youtube-import/settings.json` `enabled`), Social (`readPlatformSettings().enabled`), Category suggestions (`CATEGORIZE_VISIBILITY_KEY`), Captions settings (`captions/settings.json`: `translation.enabled`, `inline.enabled`, `viewerTitles.enabled`) | Each page has its own switch, permission and storage. | Six places to look, with no shared history. |
| Environment kill switch | `AI_CATEGORIZE_ENABLED=false` (api-videos, processor) | Turns AI categorisation off for an environment. | Stays as an operations override. The page shows it as "Off in this environment". |
| Apple Studio | AUNCoreBridge `StudioService.features`, `Features.swift` | Reads `/api/me/features` after channels load, on a channel switch and after `feature_off`. | Not read on foreground. Not saved to disk. Viewer and admin apps aren't gated. |
| Android Studio | core-bridge `CoreStudioRepository`, `StudioFeaturesViewModel` | Reads on resume. Only `upload` is used. | Not re-read after `feature_off`. `bulkSchedule` and other keys aren't used. Not saved to disk. |
| Desktop Studio | CoreBridge `FeaturesClient`, `StudioShellViewModel` | Reads on sign-in, on window activation (at most once a minute) and after `feature_off` or 402. | Not saved to disk. Viewer isn't gated. |
| Core (Rust) | `aun-common/src/error.rs` | Maps 404 to `NotFound(message)`. | **Drops `code`**, so the apps search the error text for `feature_off`. |
| Tools | `AdminApiClient.CheckStaffAsync` | Checks staff status (`imports:manage`) at sign-in only. | No features, no `feature_off` handling, no generic errors. |
| Error bodies | api-videos: 448 `{success:false,error}` and 68 `{success:false,code}`; admin-api: 189 and 80; chanfana 400 `{success:false,errors:[…]}` | Three shapes. `error` is sometimes a code and sometimes English text. | No localized message, no action hint. |

## 2. The registry

One TypeScript list in `packages/shared-types/src/feature-registry.ts`, the single source for every switchable feature. The admin page, admin-api, api-videos, the processor, the web, the OpenAPI document and the [feature registry](../features/registry.json) all read it. Native apps receive what they need in API answers; they don't copy the list.

```ts
interface FeatureDefinition {
  key: FeatureKey;                    // stable, camelCase, never renamed
  group: 'create' | 'captions' | 'grow' | 'people' | 'site';
  name: { en: string; ar: string };
  help: { en: string; ar: string };   // what people lose while it is off
  offMessage?: { en: string; ar: string }; // the feature_off message (§5.2); default "{name} isn't available right now."
  default: boolean;                   // the value before anyone changes it
  toggle: 'admin' | 'superAdmin';     // who may change it (§4)
  confirm: 'never' | 'off' | 'on' | 'both'; // when the confirm dialog shows (§3)
  requires: FeatureKey[];             // on only while these are on (§2.2)
  userFeatureKeys: UserFeatureKey[];  // /api/me/features keys it switches off
  publicFeatureKeys?: ('newsletter')[]; // /public/features keys it switches off
  setup?: { href: string; ready: 'configured' | 'always' }; // where it is configured, if anywhere
  legacy?: LegacySwitchSource;        // where the value lived before (§5.3)
  jobs?: JobQueue[];                  // queues that respect it (§5.4)
  offline: 'lastKnownElseHidden';     // client behaviour while the answer can't be read (§6.2)
}
```

CI checks (`feature-registry.test.ts`):

- every key has non-empty en and ar `name` and `help`;
- the English uses typographic quotes and apostrophes, and the Arabic follows the number rule (no «٬», Eastern Arabic digits) and the video word «مرئي»;
- `requires` has no cycles and names only real keys;
- every `UserFeatureKey` is either listed by an entry's `userFeatureKeys` or named in `AUTOMATIC_FEATURE_KEYS` with a reason. That list holds `quranText` (on while the Quran Foundation copy is fresh) and `billing` (on while a payment provider is on, or the account has records, per O37).

### 2.1 Version 1 entries

Defaults equal today's behaviour, so the first deploy changes nothing for anyone. The only exception is `viewerCaptionDownload`, which is new and off.

| Key | Group | Name (en / ar) | Help: what people lose while it is off (en / ar) | Default | Who toggles | Confirm | Requires |
|---|---|---|---|---|---|---|---|
| `upload` | create | Uploads / الرفع | Nobody can upload new videos: Studio on the web and in the apps, and imports in Tools, pause. Videos already uploaded keep processing and stay published. / لا يستطيع أحد رفع مرئيات جديدة: يتوقف الرفع في الاستوديو على الويب والتطبيقات، وتتوقف عمليات الاستيراد في الأدوات. تكمل المرئيات المرفوعة معالجتها وتبقى منشورة. | on | superAdmin | both | — |
| `createChannel` | create | Creating channels / إنشاء القنوات | Nobody can create a new channel. Existing channels and their teams keep working. / لا يستطيع أحد إنشاء قناة جديدة. تبقى القنوات الحالية وفرقها تعمل. | on | superAdmin | off | — |
| `youtubeImport` | create | Move from YouTube / النقل من يوتيوب | Creators can't start moving a channel from YouTube. Moves already running pause and continue when it's back on. / لا يستطيع صنّاع المحتوى بدء نقل قناة من يوتيوب. تتوقف عمليات النقل الجارية مؤقتًا وتكمل عند إعادة التشغيل. | on | admin | off | `upload` |
| `bulkSchedule` | create | Bulk scheduling / الجدولة الجماعية | Studio loses "Schedule selected". Videos already scheduled still publish on time. / يختفي «جدولة المحدد» من الاستوديو. تُنشر المرئيات المجدولة مسبقًا في موعدها. | on | admin | never | — |
| `audioTracks` | create | Extra audio tracks / المسارات الصوتية الإضافية | Creators can't add audio tracks. Tracks already added keep playing and can still be removed. / لا يستطيع صنّاع المحتوى إضافة مسارات صوتية. تبقى المسارات المضافة تعمل ويمكن حذفها. | on | admin | never | `upload` |
| `live` | create | Live streaming / البث المباشر | Nobody can start a new live stream. Streams already on air continue to their end. / لا يستطيع أحد بدء بث مباشر جديد. يستمر البث الجاري حتى نهايته. | on | superAdmin | off | — |
| `captionsTranscribe` | captions | Transcription / التفريغ النصي | Creators can't create captions from a video's speech. Queued transcriptions wait and run when it's back on. Captions already made stay. / لا يستطيع صنّاع المحتوى إنشاء ترجمة نصية من كلام المرئي. تنتظر عمليات التفريغ في الطابور وتعمل عند إعادة التشغيل. تبقى الترجمات الموجودة. | on | admin | off | — |
| `captionsTranslate` | captions | Caption translation / ترجمة الترجمة النصية | Creators can't translate captions into other languages. Queued translations wait. Translations already made stay. / لا يستطيع صنّاع المحتوى ترجمة الترجمة النصية إلى لغات أخرى. تنتظر الترجمات في الطابور. تبقى الترجمات الموجودة. | on | admin | never | — |
| `inlineTranslate` | captions | Translate button / زر الترجمة | The Translate button beside titles and descriptions disappears from Studio. / يختفي زر الترجمة بجانب العناوين والأوصاف من الاستوديو. | on | admin | never | — |
| `viewerTranslatedTitles` | captions | Translated titles for viewers / العناوين المترجمة للمشاهدين | Viewers see titles only in the language they were written in. / يرى المشاهدون العناوين بلغتها الأصلية فقط. | on | admin | never | — |
| `quranEditions` | captions | Quran translation editions / ترجمات معاني القرآن | Quran passages in captions show without a translation edition. / تظهر الآيات في الترجمة النصية دون ترجمة لمعانيها. | on | admin | never | — |
| `viewerCaptionDownload` | captions | Caption download for viewers / تنزيل الترجمة للمشاهدين | Viewers can't download a video's caption file from the player. Channel owners and editors still download their own captions in Studio. / لا يستطيع المشاهدون تنزيل ملف الترجمة النصية من المشغّل. يبقى أصحاب القنوات ومحرروها قادرين على تنزيل ترجماتهم من الاستوديو. | **off** | superAdmin | on | — |
| `socialAutopost` | grow | Social auto-post / النشر التلقائي على مواقع التواصل | New videos aren't posted to channels' social accounts. Posts waiting to go out pause and are sent when it's back on. / لا تُنشر المرئيات الجديدة على حسابات القنوات في مواقع التواصل. تتوقف المنشورات المنتظرة مؤقتًا وتُرسل عند إعادة التشغيل. | on | admin | off | — |
| `aiCategorySuggest` | grow | AI category suggestions / اقتراحات التصنيف الآلية | The upload and edit forms stop suggesting categories. Creators still pick categories themselves. / تتوقف نماذج الرفع والتعديل عن اقتراح التصنيفات. يختار صنّاع المحتوى التصنيفات بأنفسهم. | on | admin | never | — |
| `siteDomains` | grow | Own domains / النطاقات الخاصة | Scholar sites can't add their own domain. Domains already added keep working and can still be removed. / لا تستطيع مواقع العلماء إضافة نطاق خاص. تبقى النطاقات المضافة تعمل ويمكن حذفها. | on | admin | never | — |
| `tierRequests` | people | Tier requests / طلبات الفئات | While no payment provider is on, the Upgrade page and every link to it disappear, and nobody can ask for a tier. Requests already sent stay in the admin queue. / ما دام لا يوجد مزوّد دفع مفعّل، تختفي صفحة الترقية وكل الروابط إليها، ولا يستطيع أحد طلب فئة. تبقى الطلبات المرسلة في قائمة الإدارة. | on | admin | off | — |
| `newsletter` | site | Newsletter sign-up / الاشتراك في النشرة البريدية | The sign-up form leaves the www footer and the newsletter page answers "not found". People already subscribed can still unsubscribe. Issues waiting to go out pause. / يختفي نموذج الاشتراك من تذييل الموقع، ولا تُعرض صفحة النشرة. يبقى بإمكان المشتركين إلغاء الاشتراك. تتوقف الأعداد المنتظرة مؤقتًا. | on | admin | off | — |

Each entry's `userFeatureKeys` is the key with the same name. The only exceptions are `tierRequests`, which feeds the Upgrade mode, and `newsletter`, which feeds `/public/features`. A new key, `viewerCaptionDownload`, is added to `USER_FEATURE_KEYS`; keys are added, never renamed.

### 2.2 Dependencies

`effective(key) = stored(key) ∧ every effective(required)`. Turning a required feature off never rewrites a dependant's stored value. The dependant shows "Off while Uploads is off" and comes back by itself when Uploads is switched on again. The confirm dialog for a required feature lists the dependants that go dark with it.

Version 1 has two edges, both on `upload`: `youtubeImport` (a move creates uploads) and `audioTracks` (a new track is an upload).

### 2.3 Adding a feature later

One registry entry, plus enforcement in the API and in the clients that show it. The registry test fails if a new `UserFeatureKey` has no entry, so a gated feature can't skip the page.

## 3. The Features page (videos admin)

Route `/features`, in the sidebar's **Site** group, labelled "Features" / «الميزات». Every admin role can open it. Switches are enabled only for people allowed to change them (§4); everyone else sees the same page read-only.

- **Header:** title, one line of explanation ("Switch features on or off for everyone. Changes reach every app within 2 minutes."), and a search box that filters by name and help text in the current language.
- **Groups**, in registry order: Creating, Captions and translation, Growth and sharing, People, Public site. Each group is a solid card (Fawanees: opaque surfaces) with one row per feature.
- **Row:** the name; the help text (always visible, no tooltip); the switch with its state in words ("On" / "Off"); a status line; a "History" link.
  - The status line reads "Changed by {name}, {local time}". The time is local, with the zone, and the UTC time shows on hover (the shared `<LocalTime>`). A value never changed reads "Default".
  - Notes appear under the help text when they apply:
    - "Off while Uploads is off" (§2.2);
    - "On, but needs setup: no Google client yet", with a link to the setup page;
    - "Off in this environment" for the `AI_CATEGORIZE_ENABLED` override, with the switch locked.
- **Acting:** a switch whose `confirm` doesn't cover the direction acts at once, like the existing "Allow tier requests". It shows an Undo toast for 10 seconds, and Undo is audited too. A switch that needs confirmation opens a dialog that names the feature, repeats the help text, lists any dependants that go dark, and shows two buttons: "Switch off" (or "Switch on") and "Cancel". For `viewerCaptionDownload` the dialog also says that the owner decided on 2026-11-22 that viewers don't download captions.
- **History** opens a side sheet with every change to that feature, newest first, 50 per page: who, when (same time format), old → new, and whether it came from the Features page or from Undo. Changes are also listed on the Audit page under the area "Features".
- **Two admins at once:** each write sends the version it saw. If someone else changed the feature in the meantime, the switch snaps back and a short note says "{name} changed this a moment ago". The row refreshes.
- **States:** loading skeleton rows; a failed load shows an error alert with Retry; a failed write keeps the old value and shows the server's message (§5.2).
- **Other pages:** the old switches go away. Captions settings, Social, Platform settings, Category suggestions and Tier requests keep their setup (budgets, keys, networks, models) and show the feature's state as one line, "Transcription is on · Change on the Features page", with a link to its row (`/features#captionsTranscribe`).

The full look (phone and desktop, en and ar, four themes, dark first) is designed in phase 2 (FEAT-5 design). The research covers how mature consoles present switches: LaunchDarkly, Vercel, GitHub repository settings, Cloudflare dashboard toggles and the Google Play Console.

## 4. Who may change a switch

- **Read:** every admin role, through the new admin-api permission `features:read`.
- **Change:** the new permission `features:manage`, held by admins and super admins (`ADMIN_ROLE_IDS`, the same people who change these switches today). An entry with `toggle: 'superAdmin'` (Uploads, Creating channels, Live streaming, Caption download for viewers) can be changed only by a super admin. These four take something away from every creator at once, or carry a licence condition.
- No new role. Content and senior reviewers don't see the page, just as they don't see other settings.
- The check runs in admin-api on every write. The page only hides switches the person can't use.

## 5. Server side

The owner asked on 2026-11-22 for the server side to be explicit. Each part below is its own story, PR and test suite, separate from client work. The server is the source of truth: no client decides on its own whether a feature may run.

### 5.1 Server feature gate (FEAT-2)

One gate that every server path uses before it acts.

- **`requireFeature(key)`** is a Hono middleware. It runs in api-videos and admin-api and in the auth-facing routes we own in them. While the effective switch is off, it answers `404 feature_off` with the §5.2 envelope (`feature: key`). It runs before validation, so an old client's request in an old shape is refused in the same way.
- **`featureGate(env, key)`** is the same check as a function, for code that isn't a route: queue consumers, cron handlers and the processor. It returns `{ on: true }` or `{ on: false, reason: 'switched_off' | 'required_off' | 'env_override' }`.
- **The realtime worker** (`websocket-server`, Durable Objects) has no search D1, so it reads the switches from api-videos (`GET /internal/features/switches` over its service binding), memoised for 30 seconds like everywhere else. In version 1 nothing in it is gated: switching Live off stops new streams, and the chat and viewer counts of streams already on air continue. The gate is wired in so that a future gated message type only needs the mapping.
- **The `*Configured` readers** in `lib/features/index.ts` call `featureGate` first. `/api/me/features` and the APIs therefore keep agreeing, and the "needs setup" state stays separate from the switch.
- **The route map.** `FEATURE_ROUTES` in the registry lists, per key, the routes (method and path pattern) and job types it gates. `requireFeature` is applied from this map, not by hand. Gated areas are path prefixes owned by a feature, such as `/api/live/*`, `/api/youtube-import/*`, `/api/captions/jobs*`, `/api/social/*`, `/internal/newsletter*` and `/api/sites/*/domains*`. A test lists every route registered in api-videos and admin-api (chanfana's route table). It **fails if a route under a gated area has neither a mapping nor an explicit exemption with a reason**: for example, deleting an audio track or unsubscribing from the newsletter always work.

Version 1 mapping (each route also listed in `FEATURE_ROUTES`):

| Key | Refused while off |
|---|---|
| `upload` | Upload initiate and TUS create (`middleware/upload-limits.ts`), admin import uploads (`/api/admin/import/*` creates) |
| `createChannel` | Channel create |
| `youtubeImport` | Import start and OAuth connect |
| `bulkSchedule` | `videoBulkStudio` schedule |
| `audioTracks` | Track add (removal exempt) |
| `live` | Stream create and session start (running sessions continue) |
| `captionsTranscribe`, `captionsTranslate` | Caption job create |
| `inlineTranslate`, `viewerTranslatedTitles` | `translate` endpoints |
| `quranEditions` | `quranTranslations` |
| `viewerCaptionDownload` | `GET /api/v1/videos/:id/subtitles/:lang/download` for anyone who isn't the channel's owner, a channel admin or editor, or a site admin (QF1). The route already exists (AlUmmahNow#1734). The gate takes a `bypass(c)` for those people. |
| `socialAutopost` | Connecting networks and queueing posts |
| `aiCategorySuggest` | The suggestion endpoint |
| `siteDomains` | Domain add (admin-api `siteDomains.router.ts`); removal exempt |
| `tierRequests` | Upgrade mode (unchanged rule, O37): `GET /api/tiers/upgrade`, `POST /api/me/tier-requests` |
| `newsletter` | `/public/features` → `newsletter: false`; `/internal/newsletter` sign-up (unsubscribe exempt) |

### 5.2 Server error envelope and catalogue (FEAT-3)

Owner, 2026-11-22: errors from the server must be shown properly "even when a client doesn't support them yet". The example given was "This feature is not currently available".

**The envelope.** Every error answer from api-videos and admin-api (and the auth-facing routes we own in them) has this shape:

```json
{
  "success": false,
  "code": "feature_off",
  "message": "Live streaming isn't available right now.",
  "lang": "en",
  "action": "none",
  "retryAfter": 30,
  "helpUrl": "https://alummahnow.com/help/…",
  "reference": "ERR-7K2M-Q9XD",
  "feature": "live",
  "error": "feature_off"
}
```

- `code` (always): stable snake_case. Clients branch on it, never on the text.
- `message` (always): a whole sentence for a person, in `lang`.
- `action`: `retry`, `sign_in`, `update_app`, `contact_support` or `none`. The client shows the matching button.
- `retryAfter` (seconds) is optional and matches the `Retry-After` header. `helpUrl` is optional.
- `reference` comes on 5xx: the existing ERR-XXXX-XXXX reference, which the Errors page can search.
- `feature`: on `feature_off`, the registry key.
- **Fields for old clients:** `error` keeps its old value during the transition, because clients read it today. `errors` (chanfana's field list) stays on 400s. The status code doesn't change: `feature_off` stays 404.

**The type.** `ApiErrorBody` and `parseApiError(status, body)` live in `packages/shared-types/src/errors/`. The parser never throws: a body without the envelope gives `{ code: 'http_<status>', message: undefined }`, so the client uses its own offline or generic text.

**Choosing the language.** The language the user chose in the app, never the browser's (owner rule, 2026-11-22: English unless the user chose Arabic). The server reads `X-App-Locale` (`en` or `ar`), else the request's own `?lang=` or `/ar/`·`/en/` path prefix, else English. `Accept-Language` is never read, so a user on the English interface with an Arabic browser gets English. Every client sends its in-app language in `X-App-Locale` on every call (FEAT-9 to FEAT-16). The answer carries `lang`, `Content-Language` and `Vary: X-App-Locale`.

**The catalogue.** `packages/shared-types/src/errors/catalogue.ts` maps each code to `{ status, action, en, ar }`, plus a fallback per status class. Examples:

- 401: "Please sign in again." / «يُرجى تسجيل الدخول مرة أخرى.»
- 5xx: "Something on our side failed. We've been told, so please try again in a moment." / «حدث خطأ من جهتنا وأُبلغنا به. يُرجى المحاولة بعد قليل.»
- `feature_off`: the registry entry's `offMessage`, else "{name} isn't available right now." / «{name} غير متاحة الآن.» With no feature: "This feature isn't available right now." / «هذه الميزة غير متاحة الآن.»

The catalogue test checks:

- typographic quotes in the English;
- the Arabic number rule, and «،» between values;
- no Latin letters in the Arabic except product names;
- the video word «مرئي».

Messages never contain a stack trace, an internal name, a binding or a provider error. Free-text `error` strings are never copied into `message`.

**Migrating compatibly.** A response middleware in both workers fills in the envelope for every `success:false` JSON answer that has no `message`:

- `code` is the existing `code`, else `error` when it looks like a code;
- otherwise `code` is the status class fallback (`bad_request`, `not_found`, `server_error`, and so on);
- chanfana 400s become `invalid_request`.

Every existing client keeps working on day one. Endpoints then move to `apiError(c, code, opts)` file by file. A lint check stops new hand-written error bodies.

**OpenAPI.** `ApiError` becomes a shared component in `apps/api-videos/openapi/v1.json` and in the admin-api document, referenced by every 4xx and 5xx response, with the catalogue's codes as an enum and an extensible note. The Core client is generated from it (FEAT-11).

### 5.3 Source of truth and propagation (FEAT-4)

**Storage.** Two tables in the search D1, with the migration in `apps/api-videos/migrations/search/`. The search D1 is already bound to admin-api, api-videos and the processor.

```sql
CREATE TABLE feature_switches (
  key TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE feature_switch_changes (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  old_enabled INTEGER,          -- NULL: the default was in force
  new_enabled INTEGER NOT NULL,
  actor_id TEXT NOT NULL,
  source TEXT NOT NULL,         -- 'features_page' | 'undo'
  created_at TEXT NOT NULL
);
CREATE INDEX feature_switch_changes_key ON feature_switch_changes (key, created_at DESC);
```

The migration copies `tier_requests_enabled` from `creator_tier_settings` in SQL.

**Reading.** `readFeatureSwitches(db)` is shared code. For each key, the stored value comes from:

1. the `feature_switches` row;
2. if there is no row, the legacy value: the R2 JSON `enabled` fields, or the categorize visibility file;
3. the registry `default`.

The first write of a key creates its row, and from then on the legacy field is no longer read. The legacy writers are removed along with the old switches.

**Write path (admin-api).**

| Route | Permission | Answer |
|---|---|---|
| `GET /api/features` | `features:read` | One item per registry entry, in order: `key`, `enabled` (stored), `effective`, `blockedBy` (required keys that are off), `ready` and `setupNote` (from api-videos `GET /internal/features/readiness`, the same `*Configured` readers), `envOverride`, `version`, `updatedAt`, `updatedBy` (display name), `canToggle`. |
| `PUT /api/features/:key` | `features:manage`, plus super admin where the entry says so | Body `{ enabled, expectedVersion, undo? }`. Writes the row and the change in one D1 batch, then the admin audit log entry (area `features`, action `feature.switch`, `old → new`). Answers `{ previous, enabled, version }`. A stale `expectedVersion` gets `409 feature_changed` with the current state. |
| `GET /api/features/:key/history?cursor=` | `features:read` | Changes, newest first, 50 per page, with actor display names. |

**How fast a change takes effect (the bound).**

| Where | Cache | Bound |
|---|---|---|
| api-videos, admin-api, processor isolates (API refusals, jobs) | per-isolate memo of `readFeatureSwitches`, 30 s | **30 s** |
| websocket-server Durable Objects | memo of `/internal/features/switches`, 30 s, on top of api-videos' memo | 60 s |
| `/api/me/features`, signed out | `public, max-age=30` at the edge, ETag | 60 s |
| `/api/me/features`, signed in | `private, max-age=0, must-revalidate`, ETag | 30 s from the server; clients poll (§6.1) |
| `/public/features` → www | admin-api memo 30 s, edge 30 s, www instance 30 s with stale-while-revalidate | 90 s |

The rule: **every server refuses within 30 seconds, and every surface follows within 2 minutes.** The admin page says "Changes reach every app within 2 minutes." There is no push invalidation in version 1, because the memo is one indexed D1 read per isolate every 30 seconds. A write also clears the memo in the isolate that served it, so the admin page reads its own change at once.

**The endpoint clients read.** `GET /api/me/features` stays the one answer. It is the same contract plus the new key, with the effective switches ANDed in. The ETag is a hash of the body; a matching `If-None-Match` gets `304`. Signed out it returns only the viewer keys (the same for everyone), so the web and the viewer apps can ask without signing in. www keeps `GET /public/features`, now ANDed with the `newsletter` switch.

### 5.4 Background work (FEAT-5)

A switch never drops work and never fails it. A job whose feature is off is **parked**, then resumes when the feature is on again.

- **Checked at start and on every retry.** Each consumer calls `featureGate` when it picks up a message, including redelivered and retried ones. A cron handler checks once per run.
- **Parking.** The consumer marks the job `parked` with reason `feature_off:<key>` in its job table (caption jobs, YouTube imports, social posts, newsletter issues) and acks the message. Nothing is retried while parked, so the dead-letter queue and the retry budget are untouched. The payload stays where it is, so no data is lost.
- **Resuming.** Switching a feature on enqueues one `features.resume` admin job. It is queued and idempotent, and requeues the feature's parked jobs in pages of 100. It retries with backoff, and messages that keep failing go to the dead-letter queue. If it gives up, an Errors-page entry ("Resuming parked transcriptions failed") offers Retry.
- **Real failures are unchanged.** A job that fails for any other reason still retries, goes to the dead-letter queue and shows on the Errors page with Retry, exactly as today.
- **Seen in admin.** The Jobs page shows parked jobs with the state "Parked" and the reason "Transcription is switched off", next to running and failed jobs. The Features page row shows "{count} parked" while there are any, so nobody needs Cloudflare access to see what happened.

| Key | Queue / job | While off |
|---|---|---|
| `captionsTranscribe`, `captionsTranslate` | caption jobs (processor, `TRANSCODE_QUEUE` / `queue`) | Parked. |
| `youtubeImport` | `YT_IMPORT_QUEUE` and its step jobs | Parked. The creator's import shows "Paused". |
| `socialAutopost` | social delivery | Parked. A post parked more than 7 days becomes `expired_feature_off` and is listed on the Errors page, because a week-old "new video" post would be wrong. |
| `newsletter` | issue sends on `CONTACT_MAIL_QUEUE` | Parked. Confirmation emails for sign-ups made before the switch still go out. |
| `upload` | Tools import items (client side, §6.1); transcodes of videos already uploaded are **not** parked | Uploads already received finish processing. |
| `aiCategorySuggest` | categorize job | Skipped (it only gives advice). Nothing to resume. |

### 5.5 Server observability (FEAT-6)

- **Every envelope error is logged** in one place, the response middleware, as one structured log line: `code`, `status`, `feature`, route pattern (not the raw path), app, platform and version (from the request headers), reference, and `usr_` id when signed in.
- **Metrics.** The same fields go to a Workers Analytics Engine dataset, `API_ERRORS`, which is free within our volume. The Errors page gains a "Refused requests" panel: counts by code and feature over 24 hours and 7 days, with the top routes. A sudden rise in `feature_off` from one app version shows there.
- **5xx** still go to the Errors pipeline with the reference, as today.
- **Client fallbacks.** When a client shows the generic error for a code it doesn't know, it reports `client_error_fallback` with the code (§6.3), so the Errors page shows which codes need tailored handling.
- **No internals in messages.** The catalogue is the only source of `message`. A test sends every route a forced failure in development and checks that no message contains a stack frame, a binding name, a URL of an internal service or a provider's error text.

### 5.6 Server tests (FEAT-7)

- **Off-state E2E per gated feature.** `E2E_FEATURES_OFF=<keys|all>` starts the local api-videos and admin-api with `wrangler dev --var FEATURES_FORCE_OFF:<keys>`, which forces those switches off without touching D1. One suite per key calls every route in its `FEATURE_ROUTES` entry. It expects `404 feature_off` with the full envelope in en and ar while off, and success while on.
- **Envelope contract tests** across both APIs: for a sample of every error code and status class, the body matches `ApiErrorBody`, `lang` follows the headers, `Vary` is set, `Retry-After` matches `retryAfter`, and the old `error` field is present.
- **Old-client compatibility.** Recorded requests from the current Apple, Android, Desktop and Tools builds, which send no `X-App-Locale` or `If-None-Match`, are replayed. They must be refused with `feature_off` where gated, still find `error` and `code` where they read them today, and keep working everywhere else.
- **Propagation.** A miniflare test flips a switch and checks that the refusal starts within one memo window. Jobs are tested for park and resume through the queue, and for the Errors entry when resume gives up.
- **Route map completeness** (§5.1) and the registry checks (§2) run in unit CI.
- admin-api is deployed before the clients that read the new fields. No paid AI in any test.

## 6. Clients

### 6.1 When they read the switches

| Client | Reads at | Notes |
|---|---|---|
| Web (`useFeatures`, `getFeatures`) | each server render; on the client at focus (at most once a minute) and every 5 minutes while visible; after any `feature_off` | The signed-out player reads `viewerCaptionDownload` from the public answer. |
| Apple (viewer, Studio, admin app) | launch, return to foreground (at most once a minute), every 5 minutes in the foreground, account or channel switch, after any `feature_off` | Adds the foreground read that's missing today, and gates the viewer (caption download) as well as Studio. |
| Android (viewer, Studio) | the same | Adds the re-read after `feature_off`, and uses every key it shows (`bulkSchedule`, `live`, captions keys), not only `upload`. |
| Desktop (viewer, Studio) | the same (window activation counts as foreground) | Already re-reads; adds saving to disk. |
| Tools | sign-in, window activation (at most once a minute), every 5 minutes, after any `feature_off` | Reads `/api/me/features` with the staff token. The import queue **pauses** while `upload` is off: items stay queued, the queue shows "Paused: uploads are switched off" and resumes by itself. Today Tools checks only staff status, at sign-in. |
| Core (Rust) | — | Adds a generated `/api/me/features` operation with ETag support, keeps the error envelope (§6.3), and fixes the app-config path to `/api/v1/app-config`. |

All of them send `If-None-Match` and `X-App-Locale`.

### 6.2 Offline or unreachable

Every version 1 entry has `offline: 'lastKnownElseHidden'`:

- **Last known answer.** Each app saves the last answer per account, with its ETag and time. While the answer can't be read, the app uses the saved one, whatever its age. The server still refuses anything that has since been switched off, and the app then shows the message and re-reads.
- **No saved answer** (first launch offline): the feature is hidden, as today's fail-closed rule says.
- **Viewing doesn't depend on switches.** Downloaded videos, playback and reading keep working offline.

### 6.3 The generic error component (FEAT-9 and each app's story)

Known codes keep their tailored handling: quota facts, `upgrade_required` handled silently, sign-in redirects. **Any other code** goes to one generic error component that shows `message` as sent, the button for `action`, and the reference when there is one. It never shows a raw code, never English text in an Arabic UI, and never "Something went wrong" when the server sent a message. The client's own generic text appears only when there is no message at all, for example offline.

Three variants, designed in phase 2:

- **inline:** inside a form, panel or row;
- **toast:** after an action;
- **full page:** when a page's main load fails.

On `feature_off`, the client shows the toast or inline message once, re-reads the features, and the entry point disappears.

| Client | Work |
|---|---|
| web, admin-web | `ApiErrorView` with inline, toast and page variants; `settle-action` passes `message` and `action` through; the error boundary uses the page variant. |
| Core (Rust) | `Error::Api { status, code, message, action, retry_after, reference, feature }` replaces the 404 mapping that drops `code`; the bindings expose it to Swift, Kotlin and C#. |
| Apple, Android, Desktop | One native generic error view per platform (inline, toast and full screen), fed by Core's error. |
| Tools | `ImportApiException` carries the envelope; the generic view shows it. |
| www | The newsletter form shows `message` for codes it doesn't know. |

### 6.4 Old app versions

The server refuses them in the same way whatever they show (§5.1, tested in §5.6). Each version that ships the generic component shows the server's message for any code added after it. Versions older than that still fail closed, which is today's behaviour. For anything a refusal can't cover, the existing app-config minimum version forces an update. Version 1 adds the forced-update screen to Apple, Android and Desktop, because none of them reads app-config today.

## 7. Client and admin tests

- **Web:** off-state E2E (`E2E_FEATURES_OFF`) checks that every entry point is gone, that each page of an off feature is the 404, and that a stale page shows the message once and then loses the entry point. Generic error component unit tests cover all three variants in en and ar.
- **Admin page E2E:**
  - toggle, Undo and the confirm dialog;
  - dependants and the conflict note;
  - history;
  - read-only for a reviewer, and super-admin-only rows for an admin.
- **Apple, Android, Desktop, Tools:** off-state runs through their fixture flags (`-AUNFixtureFeaturesOff`, the Desktop demo backend's `_off` set, a new Android fixture, a Tools fake API), the saved answer offline, the generic error view for an unknown code in en and ar, and one run against stage.

## 8. Stories

| ID | Linear | Story | Repo | Kind |
|---|---|---|---|---|
| FEAT-1 | [AUN-595](https://linear.app/hamzalabs/issue/AUN-595) | Registry in shared-types, `viewerCaptionDownload` key, registry tests | AlUmmahNow | non-visual |
| FEAT-2 | [AUN-596](https://linear.app/hamzalabs/issue/AUN-596) | **Server** feature gate: `requireFeature`, `featureGate`, `FEATURE_ROUTES`, route map completeness test, realtime worker read (§5.1) | AlUmmahNow | non-visual |
| FEAT-3 | [AUN-597](https://linear.app/hamzalabs/issue/AUN-597) | **Server** error envelope and catalogue: shared type, en/ar catalogue, language choice, `feature_off` per-feature message, compatibility middleware, `apiError`, OpenAPI (§5.2) | AlUmmahNow | non-visual |
| FEAT-4 | [AUN-598](https://linear.app/hamzalabs/issue/AUN-598) | **Server** source of truth and propagation: tables, legacy fallback, admin-api routes with audit and history, memo and bounds, ETag on `/api/me/features`, `/public/features` (§5.3) | AlUmmahNow | non-visual |
| FEAT-5 | [AUN-599](https://linear.app/hamzalabs/issue/AUN-599) | **Server** background work: gate at start and on retry, park, `features.resume`, Jobs page state, Errors entries (§5.4) | AlUmmahNow | non-visual (the Jobs page "Parked" chip uses the existing chip) |
| FEAT-6 | [AUN-600](https://linear.app/hamzalabs/issue/AUN-600) | **Server** observability: one log line per envelope error, `API_ERRORS` dataset, Errors page "Refused requests" panel, no-internals test (§5.5) | AlUmmahNow | visual (one panel) |
| FEAT-7 | [AUN-601](https://linear.app/hamzalabs/issue/AUN-601) | **Server** tests: off-state E2E per gated feature, envelope contract tests, old-client compatibility, propagation (§5.6) | AlUmmahNow | non-visual |
| FEAT-8 | [AUN-602](https://linear.app/hamzalabs/issue/AUN-602) | Features page: design (phase 2) and build; old switches replaced by a status line (§3) | AlUmmahNow | visual |
| FEAT-9 | [AUN-603](https://linear.app/hamzalabs/issue/AUN-603) | Generic error component: design (phase 2), web and admin-web `ApiErrorView` (§6.3) | AlUmmahNow | visual |
| FEAT-10 | [AUN-604](https://linear.app/hamzalabs/issue/AUN-604) | Web enforcement: polling, the player's caption download behind its key, off-state E2E (§6.1) | AlUmmahNow | visual where entry points move |
| FEAT-11 | [AUN-605](https://linear.app/hamzalabs/issue/AUN-605) | Core: `Error::Api` envelope, generated features operation with ETag, app-config path fix | AlUmmahNowCore | non-visual |
| FEAT-12 | [AUN-606](https://linear.app/hamzalabs/issue/AUN-606) | Apple: features in every app, foreground and periodic reads, saved answer, generic error view, forced update | AlUmmahNowApple | visual |
| FEAT-13 | [AUN-607](https://linear.app/hamzalabs/issue/AUN-607) | Android: the same, every key used, re-read after `feature_off` | AlUmmahNowAndroid | visual |
| FEAT-14 | [AUN-608](https://linear.app/hamzalabs/issue/AUN-608) | Desktop: saved answer, viewer gating, generic error view, forced update | AlUmmahNowDesktop | visual |
| FEAT-15 | [AUN-609](https://linear.app/hamzalabs/issue/AUN-609) | Tools: features read, import queue pause, generic error view | AlUmmahNowTools | visual |
| FEAT-16 | [AUN-610](https://linear.app/hamzalabs/issue/AUN-610) | www: the `newsletter` switch through `/public/features`, the generic message on the form, off-state E2E | AlUmmahNowUI | non-visual |
| FEAT-17 | [AUN-611](https://linear.app/hamzalabs/issue/AUN-611) | Docs: product rules, API docs, the alummahnow.dev registry entry, repo pages | AlUmmahNowWiki | non-visual |

Order: FEAT-1 → FEAT-3 → FEAT-4 → FEAT-2 → FEAT-5, FEAT-6, FEAT-7. Then FEAT-8 to FEAT-10 and FEAT-16, then FEAT-11 → FEAT-12 to FEAT-15. Design (FEAT-8, FEAT-9) runs alongside the server work. Visual work goes through the frames → AUDIT-2 → gallery → owner path. Non-visual PRs merge when green.

## Status evidence

- 2026-11-22: spec written (this page), with decisions [O39](decisions.md#o39-one-features-page-server-enforced) and [O40](decisions.md#o40-server-written-error-messages). Server stories split out on the owner's instruction the same day.
- 2026-11-23: FEAT-1 merged ([AlUmmahNow#1753](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1753)): the registry in shared-types, with the four creator support switches (AUN-MEMBERS; off, super admin, `creatorSupport` required by the other three). The error language rule was changed to the app's choice only (above). FEAT-3 ([#1754](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1754)), FEAT-4 ([#1755](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1755)) and FEAT-2 ([#1756](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1756)) are in review.
