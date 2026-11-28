[← Home](../README.md)

# Changelog

What changed across the Al Ummah Now repos, grouped by feature. Newest first. Each entry links the pull requests; the guides and repo pages describe how things work now.

## 2026-11-25: Change photo answers at once; saving a channel never shows the error screen

- **AlUmmahNow:** on profile edit and channel edit, Change photo opens the picker while the photo uploads (it was disabled until the upload was done), and Change photo and Change cover open it before the page has hydrated. The new photo shows at once. Uploads and removals of one photo run one after the other, the last photo picked is the one kept, and a photo picked before the profile has loaded waits for it ([#2077](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/2077), open). The session's channel list is refreshed by `POST /api/session/channels`, which does not render the page again. Saving a channel left while that render was still streaming, and Firefox showed the error screen ("Error in input stream"). An error boundary ignores a page stream cut off because the page is being left. An avatar or cover upload waits for six steps one after the other instead of eight for channels and seven for profiles. The cover's buttons wear the theme's media chrome, so they read on any cover in light mode too ([#2085](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/2085), open).

## 2026-11-25: the data export says what became of one's reports

- **AlUmmahNow:** each report a person filed has its outcome and the date of the decision in their data export ([#2068](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/2068)).

## 2026-11-25: content can be reported without an account, and child safety reports come first

- **AlUmmahNow:** `/report` takes a report with or without an account, and channels, posts and post comments have a report button ([#1934](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1934), on [#1947](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1947)). Child safety reports come first for moderators and alert super admins. Items under a takedown are shown to super admins only. See [E06](../epics/E06-community-moderation.md#content-reports) and [Data lifecycle](data-lifecycle.md).

## 2026-11-25: an erased account's stored media is removed

- **AlUmmahNow:** after an account erasure a job removes the stored media of its videos, streams, channels and profile, from 24 hours after the records, with retries and an admin Jobs page entry ([#2001](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/2001)). See [Media files](data-lifecycle.md#media-files).

## 2026-11-24: English and Arabic on the admin's channel, video, invite, category, status and theme forms

- **AlUmmahNow:** these forms have English and Arabic side by side with Translate, and the admin APIs read and save both ([#1814](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1814)). Staff give both languages when they create something. Editing a user's text that has one language offers the other without requiring it. See [Localized fields](localized-fields.md#when-staff-work-on-user-content). An edit changes only the languages it names, so edits of different languages both stay, and translations in other languages are kept. Creating a channel over the API still takes a plain name, for the released Admin Tools app only ([#1982](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1982)). The theme builder's problems and its "Publishing is blocked" line are in plain English and Arabic, and file buttons are translated ([#1987](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1987), open).

## 2026-11-24: account emails come from the sign-in account

- **AlUmmahNow:** a profile's email is the signed-in account's, and an `email` sent with a profile is ignored ([#1864](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1864)). Account mail, the admin user page, CSAM report facts, channel moves, admin user search and invites read the email from Auth by user id, and channels no longer carry a copy ([#1866](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1866)). A profile may have no email ([#1870](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1870)). Channel moves name the new owner by user id ([#1868](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1868)), and super admins can check and repair stored profile emails ([#1871](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1871)). See [Videos admin](../epics/CHAT-ADMIN-CONTENT-admin-content-management.md#account-emails-2026-11-24).

## 2026-11-24: Auth's API can't lose something a client uses unannounced (AUTH-R6)

- **AlUmmahNowAuth:** every pull request compares `openapi.json` with the one in the newest release. Removing or narrowing something a client uses fails, unless it was announced in a release and its date has passed ([#511](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/511)). A PR that corrects the spec to match the server records the exact change in `docs/api-exceptions.json`. Test users made by the admin specs are run accounts, deleted with the run ([#505](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/505)).
- **openauth:** v1.1.0 is the first release with a verified build attestation.

## 2026-11-23: Auth releases leave a record, the openauth package is safe to publish and verify (AUTH-R6)

- **AlUmmahNowAuth:** every production release creates a `vYYYY.MM.DD[.N]` GitHub release with its changes, migrations, worker versions and rollback link ([#491](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/491)). A sign-in writes its browser session in two database round trips instead of up to five ([#493](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/493)). The admin's Security page reads staff in one batch; before, it could hang for minutes ([#490](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/490)), and theme color pickers have their own names for screen readers again ([#496](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/496)). A written [versioning and deprecation policy](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/API_VERSIONING.md) ([#495](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/495)). Contributor docs, a code of conduct and private security reporting in place of a public form ([#494](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/494)). The hourly QA sweep no longer scans every user ([#497](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/497)).
- **openauth:** a release needs both checks green on the exact commit, happens only when the package changed, and its size follows the commits: breaking → major, `feat` → minor ([#59](https://github.com/Al-Ummah-Now/openauth/pull/59)). Releases carry the published file, its hashes and build provenance ([#62](https://github.com/Al-Ummah-Now/openauth/pull/62)). Upstream's release flow is gone ([#61](https://github.com/Al-Ummah-Now/openauth/pull/61)).

## 2026-11-22: supporting creators: building starts behind a switch that stays off (AUN-MEMBERS)

- **AlUmmahNow:** server foundation for [AUN-MEMBERS](../epics/AUN-MEMBERS-creator-support.md). Everything sits behind the `creatorSupport` switch, which stays off in every environment until the organization exists and the lawyer, PayGood, Wise and PayPal sign off. [#1757](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1757) adds:
  - money as integer minor units with an explicit currency, and fees with explicit rounding;
  - the collector and payout-rail interfaces, with test versions that move no money;
  - the open owner decisions as settings that start undecided.

  [#1758](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1758) adds the data model, an append-only double-entry ledger, the settings store and erasure. [#1761](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1761) adds the vendor webhooks, the queued jobs and the daily three-way reconciliation. [#1763](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1763) adds payout batches. A batch is planned, approved by the organisation's finance list, checked for funding, and sent idempotently, with statuses read back afterwards. No user-visible change.

## 2026-11-22: supporting creators, revision 2: PayGood collects, a payout rail pays (AUN-MEMBERS)

- **AlUmmahNowWiki:** [AUN-MEMBERS](../epics/AUN-MEMBERS-creator-support.md) revised after the owner's "we will not use paygood to pay creators" ([O42](../epics/decisions.md#o42-paygood-collects-only-creators-paid-through-a-separate-payout-rail)). PayGood only collects gifts into the organization's merchant account; the organization holds them in a separate non-interest account and pays creators monthly through a payout rail: Wise primary, PayPal Payouts fallback, Trolley later; never Stripe. New research on how YouTube, Patreon, Ko-fi, Buy Me a Coffee, Twitch, Substack and LaunchGood pay creators, and on ten payout rails with a country grid; Iraq, Palestine, Somalia, Sudan, Afghanistan, Syria and Iran stay uncovered. New ledger, hold, threshold and payout jobs with retry, DLQ and admin Errors; money permissions only for the organization's finance list, never the owner. Decisions MEM-D17 to MEM-D24 added, MEM-D1 and MEM-D16 withdrawn. Money transmission and PayGood's "third party payments" rule are the main open legal questions. Research, not legal advice. Linear AUN-612. No code yet.

## 2026-11-22: supporting creators specified (AUN-MEMBERS)

- **AlUmmahNowWiki:** new epic [AUN-MEMBERS](../epics/AUN-MEMBERS-creator-support.md): viewers support a creator once or monthly, the money goes straight to the creator's own PayGood merchant account, and Al Ummah Now takes nothing ([O41](../epics/decisions.md#o41-creator-support-is-a-gift-0-to-the-platform-never-hold-funds)). It covers Islamic compliance, legality, fees with worked examples, taxes, payouts by country, app store rules, partners and vendors, the architecture, English and Arabic copy, questions for a lawyer, an accountant and a scholar, and owner decisions MEM-D1 to MEM-D16. Paid perks are designed separately and stay off. The platform will be held by a waqf / nonprofit organization formed through the lawyer engagement; creator support stays off until it exists, and the owner never holds, signs for or receives money. Research, not legal advice. Linear AUN-612. No code yet.

## 2026-11-21: one number rule; Studio titles in the page language; Latin codes keep their order in Arabic admin text

- **AlUmmahNow:** Studio analytics days follow the viewer's time zone, the same way admin times do. At 7:30 pm in New York (already the next day in UTC), the chart still ends on today's date. Studio sends its IANA zone as `tz` with `dateFrom`/`dateTo` (`/api/analytics/channels/:id`, `/metrics`, `/videos/:id`, `/videos/:id/retention` and `/api/channels/:id/analytics/top-content`). Likes, comments and new subscribers are counted on their local day. Views and watch time are stored per UTC day and keep that date. Without `tz`, or with an unknown zone, days are UTC as before. Native Studio apps can send the same parameter ([#1665](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1665)).
- **AlUmmahNowUI:** www and the scholar sites follow the same rule. Arabic numbers are never grouped. Post likes and comments and the search total are compact from 1,000 («٤٫٨ ألف إعجاب، ١٫٢ ألف تعليق»; "4.8K likes · 1.2K comments"). Arabic meta lines on posts and the timeline join with «،» ([UI#141](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/141), held for the owner's screenshots).
- **AlUmmahNow:** in Arabic, values in a line are separated by the Arabic comma, not a dot, because a dot next to Arabic digits reads as zero: «الأمة الآن، ٣ م مشاهدة» on cards, watch meta, channel rows, Studio rows, admin lists and tooltips. English keeps its dot. Shared `metaSeparator` / `joinMeta`; web `<MetaSep />`, admin `<Sep />` and `common.sep`. Same as Android #51 and Desktop #69 ([O38](../epics/decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000)).
- **AlUmmahNow:** a compact count standing alone (stat tile, chart tick) whose whole number ends in 11–99 takes the accusative: «١٢ ألفًا», «١٢٠ ألفًا», «١٢ مليارًا». Before a noun it stays «١٢ ألف مشاهدة»; 100 and decimals stay «١٠٠ ألف», «١١٫٥ ألف». Studio's lifetime line now reads «… مشاهدة إجمالًا».
- **AlUmmahNow:** Arabic numbers are never grouped («٤٨٨٧», «٥٠٦٢٫٦ س»; English keeps "4,887"), and counts from 1,000 on are compact, cut to one decimal, with millions always «{n} م» («١٫٢ م مشاهدة»). Analytics table cells, watch-time hours, money and file sizes stay exact. The rule is [O38](../epics/decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000) ([#1665](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1665)).
- **AlUmmahNow:** Studio's Top content table and a video's analytics page show the title in the page's language, the same as the watch page: an English Studio page lists "Adhkar after Fajr", not the stored Arabic title (`top-content` now returns `titleLocalized`).
- **AlUmmahNow:** in the Arabic videos admin, Latin codes whose punctuation is part of the code sit in a left-to-right isolate, so the Errors search box reads «الرسالة أو رمز ERR-» and not «…رمز -ERR». The same applies to `re_`, `mer_`, `https://` and Alt+↑/↓, and a test checks the whole Arabic catalogue.

## 2026-11-21: the player resumes a saved position again; Player E2E runs on main and in releases

- **AlUmmahNow:** after next 16.4, Player E2E failed on `main`: in development (React Strict Mode) the player's two simultaneous progress reads lost a saved position that was still being moved into encrypted storage, so the "Start from beginning" pill never showed. On-device progress is now read and written one operation at a time, and the old plaintext copy is removed only after the encrypted copy is saved. A production build was not affected ([#1696](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1696), [#1697](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1697)).
- **AlUmmahNow:** Player E2E used to run only on PRs that touched the player, so the break went unseen for five days. It now also runs on every push to `main`, on PRs that change the lockfile, the web's `package.json` or `next.config.ts`, or resume storage, and it gates production in every release. See [Testing](testing.md).

## 2026-11-19: the invite email sends the admin's wording and the video card

- **AlUmmahNowAuth:** invite emails now use the wording saved in videos admin › Settings › Emails, and show the invite's video as a picture card that links to the watch page ([Auth#432](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/432), [Auth#433](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/433); approved with [#1551](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1551), rebased onto #430's Eastern Arabic digits). Merged 2026-11-19; Auth released on merge.
- **AlUmmahNow:** the seeded wording still described the old sign-in ("choose Create account", "you can still sign in after it expires"). Migration 0045 rewrites those sentences for the one-time link wherever an admin hasn't changed them, as a new version in History ([#1658](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1658), held for the owner's screenshots). See [Email templates](email-templates.md#versions).

## 2026-11-19: a complete Contact messages inbox

- **Why:** the admin's Contact messages badge always said 1 and rows looked read-only. Only the sender's name opened a message, so production's one message, an SEO sales pitch, was never opened and stayed "new". Its acknowledgement email went to the spammer.
- **Now:**
  - **Opening:** the whole row opens a message, and opening it marks it read. Read and unread are separate from the status, and "In progress" is a new status.
  - **Badge:** it counts unread messages and follows changes on every admin page without a reload.
  - **Bulk and delete:** a bulk bar marks messages read or unread, sets a status, assigns them, or deletes them. A delete happens at once with Undo.
  - **Assign:** a live picker lists every active Admin and Super Admin from the videos admin's own staff list, which each admin's sign-in token keeps up to date.
  - **Bot check and spam:** each message keeps its bot check result. A failed check or a sales pitch goes straight to Spam, and no email is sent for it.
  - **Layout:** the table no longer scrolls sideways on a phone or in Arabic.

  Merged in [#1480](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1480); see [Contact us](../epics/CHAT-CONTACT-contact-us.md#how-the-admin-inbox-works).
## 2026-11-19: Mark as spam on a contact message works on the first click

- **Why:** the owner: "clicking mark as spam on admin messages causes a flickr in all buttons and nothing". Every button on the message page shared one busy flag, so all of them flickered (production: four 200 PATCHes 1.5 s apart).
- **Then:** "actually its marked as spam now but button stil normal": the change was saved but the page only showed it through a refresh, which on production didn't show it.
- **Now:** only the clicked button says "Working…" while it saves. The status chip, the Not spam button and the Undo toast show as soon as admin-api confirms, without waiting for the page refresh. Inbox rows follow a bulk change at once. A failed change shows an error in English or Arabic and is reported to the Errors page. The inbox bulk bar got the same fix. E2E `30-contact-spam` ([#1662](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1662)).

## 2026-11-19: one family of error pages in every app (proposed, held for the owner)

- **Why:** the owner asked whether the site has custom error pages. Each app had its own: the videos 404 was a generic gray/blue template with a pulsing "404", Auth's error page a hard-coded navy and amber card, the CMS and scholar sites plain text.
- **Now (PRs held for screenshots):** 404, 410, 500, 503 and a crashed page are one frosted-glass card on the lantern street inside each app's header and footer, with the same words, "Error 404" / «خطأ ٤٠٤» line, icons and actions (Go to home, Go back, Search, Try again, the reference), noindex and the real status code. Purged videos, Shorts, playlists and channels show the 410 words. See [Error pages](error-pages.md).

## 2026-11-19: Invite links sign the person straight in

- **Why:** the owner asked why an invitee had to "Sign in" or "Create account" with an emailed code after clicking their invite, and why a second click told them to sign in when, as far as they knew, they had no account yet.
- **AlUmmahNowAuth:** **Continue** on the invite link signs the invited account in directly and makes it the active account (other signed-in accounts untouched), then offers a passkey with **Skip**. A used or expired link offers **Finish setting up your account** (emails a fresh link) while the account has no password or passkey, **You're already set up** + Sign in once it has one, and **This invite was withdrawn** when revoked. CSRF-checked, single use under concurrency, our origins only, en/ar from `?lang=` or the invite's language ([Auth#434](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/434)). Merged 2026-11-19 after the owner approved the screenshots; Auth released to production on merge.
- **AlUmmahNow:** new invites continue to the Studio of the invited channel (else account settings) with a first-run welcome, without `prompt=login` ([#1559](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1559)). Merged 2026-11-19 after the owner approved the screenshots; Auth released to production on merge.

## 2026-11-18: more context on admin errors; a read-only Prod errors report

- **Why:** the owner: "errors in admin need more context". An error sample showed the route, release and request id but not which Worker, video or channel, which dependency failed, or what ran before it.
- **Now:** each sample on the error detail page shows the route template, status, environment, Worker, release and version, request id, user/video/channel ids, the **failed call** (service + status), the queue **job** (queue, message id, attempt), the **steps before the error** and the reporter's details. Ids only, scrubbed twice ([#1575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1575), [#1576](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1576) held for the owner's screenshots, [Auth#435](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/435)).
- **Production errors found with it and fixed (2026-11-18, need a release):** api-videos answered 500 on `/api/videos/:id`, `/api/profile` and other routes when concurrent requests shared one pending categories read, which Workers refuse across requests ([#1578](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1578)); the daily Quran text sync failed on two-part Imla'i words written as one Uthmani word ([#1579](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1579)); cost-monitor opened one Errors item per failed hour and retried a rate-limited Containers list ([#1580](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1580)); the 404 page answered 500 for paths like `/qa/…` and for unmatched server actions ([#1583](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1583)); the site theme is read once per 30 s per isolate ([#1584](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1584)); discovery no longer reads share card images as videos ([#1582](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1582)); scanner 404s and closed-socket sends are no longer logged as errors ([Auth#436](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/436), [#1585](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1585)).
- **Prod errors workflow:** Actions → Prod errors prints production's (or stage's) error groups, open needs-action items and Worker warn/error logs, read-only ([#1574](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1574)). See [Error reporting](../epics/CHAT-ERRORS-error-reporting.md#reading-production-errors-without-touching-production-2026-11-18).

## 2026-11-16: the creator invite's wording is edited in the videos admin

- **Site › Emails › Creator invite:** admins edit every line of the invite email in English and Arabic, with Translate, placeholder chips (`{name}`, `{email}`, `{channels}`, `{expires}`, `{title}`) and checks. They set a default invite video per language, which only prefills new invites. The page has a live preview (en/ar, light/dark mail app, desktop/phone width), **Send test to me**, and versions with History, Restore and Undo. Super Admins and Admins only, and every change is audited. Version 1 is the old copy word for word. See [Email templates](email-templates.md).
- **Delivery:** the invite's create and resend requests carry the copy to Auth (`emailCopy`). Auth's own copy is an emergency default and logs each use.
- PRs: back end [#1550](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1550); page [#1551](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1551) (merged 2026-11-18); Auth [Auth#433](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/433), stacked on the invite video card (Auth#432). The other system emails follow in [#1549](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1549).

## 2026-11-16: CI test selection, shadow mode

- **AlUmmahNow:** Local E2E has a **Test selection** job. It maps a PR's changed files onto the dependency graph and reports which E2E suites it would run and skip, with the reason for each. A **CI gate** job records every job selection would have skipped that failed. Every suite still runs until the owner has reviewed the shadow data. Replayed on [#1521](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1521), it runs admin + release and skips the five web shards and Player E2E ([#1542](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1542)). See [CI test selection](ci-test-selection.md).

## 2026-11-16: Arabic shows Eastern Arabic (Hindi) numerals

- **Rule ([O35](../epics/decisions.md#o35-arabic-uses-eastern-arabic-hindi-numerals)):** Arabic pages and emails show ٠–٩ for every number, date, time, duration, percentage and amount of money; English keeps 0–9. Money in Arabic reads «١٢٫٦٩ دولار أمريكي». See [Numbers and dates](numbers-and-dates.md).
- **AlUmmahNow:** shared formatter `locale-format` and the `check:locale-format` guard ([#1503](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1503)); admin ([#1521](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1521)), web ([#1507](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1507)), emails and servers ([#1505](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1505)), held for the owner's screenshot check.
- **AlUmmahNowUI** (www, scholar sites, dev): `packages/render/src/format.ts` and its guard test ([UI#124](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/124)); **AlUmmahNowCMS**: `src/lib/format.ts`, number fields accept ٠–٩ ([CMS#142](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/142)); **AlUmmahNowAuth** (auth, profile, admin, emails): `packages/ui/src/format.ts`, codes typed in ٠–٩ are accepted, Arabic WebKit hydration job ([Auth#430](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/430)). All held for the owner's screenshot check.
- **Video player** ([#1543](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1543)): current time and duration, seek tooltip, live time, keyboard and touch feedback and speed labels show ٠–٩ in Arabic, read left to right; about 15 hand-built time helpers now use `formatClock`, and the guard fails on new ones. Held for the owner's screenshot check.

## 2026-11-16: Site visits page shows data

- **Why:** the admin **Site visits** page was empty in every environment. Visits and short link clicks were sent and queued, but the processor dropped every site counter before writing it ([#1476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1476)). Visits from X were also rejected because the source name has one letter.
- **Now:** site counters are written; X visits and clicks count; a counter the processor refuses is logged as an error. The days lost since 2026-11-13 were replayed from the message archive, aggregates only, at most once per day ([#1482](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1482), [#1477](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1477)). See [Site visits (admin)](../repos/AlUmmahNow.md#site-visits-admin).
## 2026-11-16: staff-set text needs English and Arabic

- **Rule:** every localizable field set by staff or the system (tiers, categories, CMS pages and blocks, templates, status page, help, settings and more) needs both English and Arabic. Forms no longer say "leave empty to use the other one". Each pair gets a **Translate** button (Workers AI, glossary, Qur'an never machine-translated), and older rows missing a language are flagged **Arabic missing**. User content is exempt. See [Localized fields](localized-fields.md). Merged so far: the staff translate service on Workers AI, which uses the CMS glossary ([#1486](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1486), [CMS#139](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/139)); the shared English | العربية field with Translate and **Translate missing** ([#1499](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1499), [#1519](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1519)); and Translate access for the Auth admin ([#1508](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1508)). Waiting for the owner's screenshot OK: the videos admin forms ([#1500](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1500)), tiers ([#1524](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1524)), the CMS timeline titles and page builder ([CMS#140](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/140), [CMS#143](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/143)), and Auth admin app names and themes ([Auth#425](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/425), [Auth#428](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/428)).

## 2026-11-15: identity is chosen only in the header

- **One place to choose who you act as:** the header's **Acting as** menu. Comments, replies, posts, likes, subscriptions and playlists always use the current acting identity. Comment, reply and post boxes show only that identity's avatar (your photo or the channel's logo), with no "Commenting as" text and no Switch link. The avatar is named after the identity for screen readers. The reply box used to show the avatar of the person you were replying to; it now shows yours ([#1474](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1474)). 

## 2026-11-15: R2 transcodes start reliably and a broken transcoder fails the release

- **Why:** a transcoder image built without one of its files crashed at every start from 2026-11-13 until release `v2026.11.14.6`. Stage transcodes never ran, and two production jobs waited 4 to 7 minutes. Retry delays that grew to 15 minutes kept them waiting after the fixed image was live, and the release test skipped the stuck transcode as "slow".
- **Now:** a job that can't start is tried again within seconds (15 s, 30 s, 1 min, 2 min, then every 5 min). After about 24 minutes it is marked failed on the Errors page with **Transcode again**. Deploys let running transcodes finish, and a job cut off by a deploy doesn't use up an attempt. The release smoke starts a real transcoder container after every media deploy, and the stage E2E fails a transcode that doesn't start within 2 minutes ([#1409](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1409)). See [Video delivery](video-delivery.md).

## 2026-11-14: status page subscriptions

- **Email and webhook updates from the status page:** people sign up at `/subscribe` in English or Arabic and confirm by email (double opt-in). Each email has one-click unsubscribe. Admins add signed webhooks on the videos admin **Status** page. A new incident or maintenance, each update and its resolution are sent from a queue with retries; failures land on the Errors page with **Retry**. Internal-only incidents are never sent ([#1380](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1380), [#1193](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1193)). See [Status page](status-page.md#subscriptions).

## 2026-11-13: every local E2E suite cleans up fully

- **Leftover checks gate everywhere:** the web and release suites' leftover checks were report-only; they now fail the job like the admin suite's, so a run that leaves anything of its own behind is red. The suites gained a teardown that erases accounts that signed up on the web page and runs the purges the deployed crons run ([#1256](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1256)). See [Testing and E2E](testing.md#cleanup-and-leftover-checks).
- **More erased on account erasure and permanent video deletes** (found by those checks): rate counters, creator tier, bot-check pass, upload sessions, undo records, subtitles, scheduler entries, playlist adds, file claims; deleted channels' search rows keep only their id; reorders of channel sections no longer fail in the queue ([#1251](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1251)). See [Deletion, erasure and cleanup](data-lifecycle.md#account-erasure).
- **Erased accounts leave no trace in kept history:** admin history is kept 2 years, and an erased account's titles, names and ids in it become "erased video" / "erased user" placeholders; an erased creator's titles and channel names in the event archive are replaced the same way; dead letters keep hashed user ids for 30 days; error reports that arrive after an erasure are stored anonymised ([#1288](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1288)). See [Deletion, erasure and cleanup](data-lifecycle.md#admin-history).

## 2026-11-13: bot protection

- **CAPTCHA and bot block:** Cloudflare Turnstile (no puzzles; almost everyone sees nothing) on sign-up, password reset and email codes, sign-in after 3 failed attempts, Contact us, reports, and an account's first comment or post. Rate limits at the edge on comments, posts, likes and votes, reports, upload starts and search. Scripted clients (curl and the like) are refused on writes in production. A new admin **Abuse** page counts checks and refusals per endpoint, with no personal data. Production starts with the checks off, then monitor, then enforce; QA and stage enforce with Cloudflare's test keys, so tests are never blocked ([Auth#358](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/358), [#1248](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1248), [CMS#120](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/120)). Owner steps for Bot Fight Mode, WAF rules and the edge rate limit: [Bot protection](bot-protection.md).

## 2026-11-13: status page

- **Public status page** at `status.alummahnow.net` (stage and QA have their own). Its own Worker and database, so it stays up when other services are down. It checks 13 components every 2 minutes, shows 90 days of uptime, and lists incidents and scheduled maintenance in English and Arabic, with feeds and a JSON endpoint. Admins post incidents from the new admin **Status** page; outages alert admins through the Errors page. Only user-facing services are public; the CMS, admins, APIs and email are monitored but shown only on the admin Status page ([#1232](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1232)). Linked from the videos sidebar and the www footer ([#1194](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1194), [UI#85](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/85); subscriptions: [#1193](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1193)). See [Status page](status-page.md).

## 2026-11-13: follow-ups

- **Site visits page:** admins see how people reach the videos site under Overview → Site visits: visits in the last 7, 30 or 90 days, visits per day, sources (search engines, social networks, our own sites, other websites, direct), the pages visits started on and the top referring websites. Counted without cookies as daily totals only ([#1184](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1184), [#1202](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1202)). See [Site visits (admin)](../repos/AlUmmahNow.md#site-visits-admin).
- **Short share links:** share buttons now copy a short link on `alummahnow.link` (`/v/<id>`, `/s/<id>`, `/@handle`, `/c/<id>`, `/p/<id>`, `/l/<id>`). It redirects to the real page, which keeps the Open Graph tags and canonical URL. `?lang=ar` opens Arabic; unknown or private ids get a 404 that names nothing; nothing on the host is indexed. Clicks are daily aggregate counters with no identifiers. New Share buttons on playlist and channel pages and a card menu Copy link ([#1192](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1192)). See [AUN-SHORT-LINKS](../epics/AUN-SHORT-LINKS-short-share-links.md).
- **Notification badge clears when the menu opens:** the bell now counts what is new since you last opened it, across tabs and devices, while each notification keeps its own read state (*Mark as read* / *Mark as unread*, *Mark all as read*). An admin setting (videos admin → Platform settings) chooses whether opening the menu only clears the badge (default) or also marks the shown notifications read; changes are audited ([#1197](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1197)). See [Notification badge and read state](../repos/AlUmmahNow.md#notification-badge-and-read-state).
- **Light / Dark, no System:** every mode control is now Light / Dark only. The first visit follows the device; after that the viewer's last choice is kept on that device, with no flash on load. Old saved "system" values become the device's mode once. **Menus stay on screen:** the www theme menu opened outside the screen on phones; the menu is gone, and every menu and popup in every app now stays inside the viewport at phone widths, in landscape and in Arabic, with an E2E per app ([#1172](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1172), [UI#76](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/76), [CMS#106](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/106), [Auth#346](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/346)). See [Light and dark](theming.md#light-and-dark).
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
- **Playlists without a channel, and Unlisted playlists:** a signed-in viewer with no channel saves videos to their own playlists from the watch page or a video card's menu, and manages them under You › Playlists. Every playlist can be Public, Unlisted (link-only) or Private. With a channel active, the channel's playlists behave as before ([#1183](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1183)). See [Playlists without a channel](../repos/AlUmmahNow.md#playlists-without-a-channel).
- **Comment without a channel:** a signed-in viewer with no channel can comment and reply on videos, like comments, and edit or delete their own comments, as themselves (their name and avatar). The comment box says who it posts as. With a channel active, comments and likes are still that channel's ([#1153](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1153), [#1151](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1151)). See [Video comments without a channel](../repos/AlUmmahNow.md#video-comments-without-a-channel).
- **Subscribe without a channel:** a signed-in viewer with no channel can subscribe on the watch and channel pages, as themselves; there is no "create a channel first" prompt any more. With a channel active, Subscribe still subscribes as that channel. Counts, the Subscriptions feed and list, notifications, privacy export and erase, and Studio analytics cover both kinds; subscriber analytics had always shown 0 and now report real numbers ([#1152](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1152)). See [Channel subscriptions](../repos/AlUmmahNow.md#channel-subscriptions).
- **Help and the identity tour:** the videos site has Help at `/help` in English and Arabic (in the side menu), and a tour shown once per account that explains acting as yourself or as a channel. The account menu labels the identity section **Acting as**, and comment boxes say **Commenting as …** with a **Switch** link. Members without a channel can comment, like and vote on community posts as themselves. Merged in [#1154](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1154) and [#1157](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1157); the www footer link ([UI#74](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/74)) follows the release. See [Help and the identity tour](help-and-tour.md).
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
