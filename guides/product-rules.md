[← Home](../README.md)

# Product rules

Rules every user-facing surface follows, in every app (web, Apple, Android, Desktop). Owner rule, 2026-11-16.

## Hidden when off

A feature that a person can't use is **not shown to them**. It is not disabled, explained or advertised.

### Three different situations

| Situation | Example | What the person sees |
|---|---|---|
| **Off or not configured**: an admin switched it off, or a provider key, OAuth client, secret or binding is missing | Social auto-post with no network set up; own domains while Cloudflare for SaaS isn't set up; Move from YouTube with no Google client | Nothing. No tab, nav item, button, link, help entry, sitemap entry or empty state. |
| **Not in the tier**: the person's creator tier (or, for channel work, the channel owner's tier) leaves it out | Live on a tier without live; caption minutes on the Creator tier; extra audio tracks; uploads without any tier | Nothing, exactly as above. |
| **Quota used up**: the feature is in the tier, but this period's allowance is spent | Live hours used; caption minutes used; upload limit; channel limit | The feature stays. At the moment of the action, a plain fact with no link: "You've used all of this month's caption minutes. They reset on Dec 1." |

Never:

- "Not available", "not in your tier", "your plan doesn't include", "by invitation", "coming soon";
- an upsell, a "Contact us to upgrade" link, or a control greyed out with a reason;
- a link to /upgrade anywhere except the two entry points below.

The only upgrade entry points are the header **Request tier / Upgrade** button and the **/upgrade** page.

If something already exists and the feature is then switched off (a downgrade), the person can still manage what they have, but can't add more. For example, existing audio tracks or own domains can be edited or removed, but there is no Add button and no limit text.

### The contract: `GET /api/me/features`

One server-computed answer that every client reads. Clients never work it out for themselves from tiers, settings or roles.

```http
GET /api/me/features                 # the signed-in person
GET /api/me/features?channelId=<id>  # work on that channel: its owner's tier, the caller's role there
```

```json
{ "success": true, "version": 1, "features": { "upload": true, "live": false, "captionsTranscribe": false, "…": false } }
```

- **Keys** (api-videos, `packages/shared-types/src/features.ts`): `upload`, `createChannel`, `live`, `captionsTranscribe`, `captionsTranslate`, `inlineTranslate`, `viewerTranslatedTitles`, `quranEditions`, `audioTracks`, `siteDomains`, `socialAutopost`, `youtubeImport`, `aiCategorySuggest`, `bulkSchedule`, `quranText` (true only while the Quran Foundation copy is synced and less than 7 days old; AlUmmahNow #1506), and `billing` (Settings › Billing: a payment provider is on, or the account has subscriptions or payments; AlUmmahNow #1418). Keys may be added, never renamed.
- **Fail closed.** A key that is missing, not `true`, or unknown to the client means hidden. While a client can't read the answer, everything is hidden.
- **Signed-out visitors** get every creator feature off. The web doesn't ask for them at all.
- **Live** is also off while an account deletion is pending. Live hours used is a quota and doesn't hide Live.
- **Own domains** need Cloudflare for SaaS (one Cloudflare API probe, cached about 10 minutes per isolate) and a site that allows at least one domain.

On the web:

- client components use `useFeatures(channelId?)` and `refreshFeatures(channelId?)` (`apps/web/src/hooks/useFeatures.ts`);
- server pages use `getFeatures(channelId?)` (`apps/web/src/lib/features/server.ts`);
- Studio passes the features into `lib/studio/nav.ts`, so a tab whose feature is off isn't listed, and its path answers 404;
- Help blocks, table rows and whole sections can carry a `feature` tag, and they are left out of the page, "On this page" and search while that feature is off.

In Desktop Studio (Windows and Linux, AlUmmahNowDesktop):

- `FeaturesClient` in CoreBridge reads the answer after sign-in, on an account or channel switch, and when the window comes to the foreground (at most once a minute). A failed read keeps the last answer; with none, gated pages stay hidden;
- `StudioPages` decides the tabs: Upload follows `upload`, and Analytics is left out when its API answers `feature_off` or 402. The window moves to Videos, then back to the startup tab once it exists.

In Apple Studio (iPhone, iPad and Mac, AlUmmahNowApple):

- `StudioServicing.features(channelID:)` in AUNCoreBridge reads the answer. `StudioSession` reads it after sign-in, when the app comes to the foreground, and on an account or channel switch. A failed read keeps the last answer; with none, gated entries stay hidden;
- the Upload tab (iPhone, iPad) and the Upload section (Mac) follow `upload`. Bulk schedule follows `bulkSchedule`. When Analytics answers `feature_off`, the Analytics tab, the Mac section and the per-video stats are left out until the channel changes. A tab that disappears never stays selected;
- a 402, `upgrade_required` or `uploads_by_invitation` refusal shows no text. An upload refused this way leaves the queue, and the app reads the features again.

### The `feature_off` convention

A gated API whose feature is off for the caller answers:

```http
HTTP/1.1 404 Not Found
{"success": false, "code": "feature_off"}
```

There is no message for a person. Clients check `code`, never the text. A client that gets `feature_off` (for example after the feature was switched off while the page was open) reads the features again, and the entry point disappears. It doesn't show an error.

A whole page that belongs to an off feature is the site's 404, not a hollow page or a "not available" notice. Example: with tier requests off and no payment provider, `/upgrade` answers `feature_off`, renders the 404 page and loses every link to it, while the user's tier still shows in Settings › Tier ([O37](../epics/decisions.md#o37-with-tier-requests-off-and-no-payment-provider-upgrade-is-an-off-feature)).

Quota refusals keep their own codes and plain-fact messages (`live_hours_used`, `upload_limit`, `channel_limit`, caption minutes).

### Building a feature

1. Add a key to `USER_FEATURE_KEYS` with a comment saying what turns it on. Then compute it in `apps/api-videos/src/lib/features`.
2. Gate the API with `404 feature_off`.
3. Hide every entry point behind the key: nav, tabs, buttons, links, help (with a `feature` tag), sitemap and empty states. Then remove the "not available" strings in both en and ar.
4. Write tests:
   - unit tests for the on and off states;
   - an API test for the 404 `feature_off` answer;
   - a local E2E spec that switches the feature off and on again using its own data, in en and ar, and checks there is no upsell text.
5. Add an entry to the [feature registry](../features/README.md).

Related: [Site roles and channel roles](roles.md), [Help and the identity tour](help-and-tour.md), [Copy Tone Guide](copy-tone.md).
