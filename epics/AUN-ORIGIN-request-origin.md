[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Request origin: where a request came from

| | |
|---|---|
| **ID** | `AUN-ORIGIN` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), AlUmmahNowCore, AlUmmahNowApple, AlUmmahNowAndroid, AlUmmahNowDesktop, AlUmmahNowAuth |
| **Status** | **in progress** |
| **Last updated** | 2026-11-19 |
| **Origin** | Owner, 2026-11-18: "can we include where the request came from, this is for analytics, and included on sources, errors and so on" |

## Goal

Every error, audit row, queued job and analytics counter can say **where the request came from**: which app or site, which device class, which country, how the visitor got there and which page they entered on. It is one model, shared by errors, analytics and audit, so the answers agree everywhere.

## What is recorded (and what never is)

One `RequestOrigin`, built by `originOf(request, …)` in `@al-ummah/shared-types` (`packages/shared-types/src/request-origin.ts`):

| Field | Values | From |
|---|---|---|
| `surface` | `web`, `admin`, `ios`, `ipados`, `macos`, `android`, `android_tv`, `apple_tv`, `windows`, `linux`, `tizen`, `embed`, `api`, `bot`, `unknown` | the native `X-AUN-Client` header's OS; otherwise the app and the User-Agent family |
| `app`, `appVersion` | e.g. `aun-studio`, `1.4.0` | `X-AUN-Client` (native apps only) |
| `release` | the deploy's release tag | the Worker's release var |
| `source` | `direct`, `site`, `platform`, `short_link`, `embed`, `email`, `push`, `campaign`, `search:<engine>`, `social:<network>` | the Referer's **host** and `utm_medium` |
| `referrerHost` | e.g. `www.google.com` | the Referer's host only |
| `campaign` | `utm_source`, lower-case, at most 40 characters | the entry URL |
| `entry` | a route template, e.g. `/:locale/video/:id` | the entry path, with ids replaced |
| `country` | ISO code (`EG`) | `cf.country` |
| `device` | `phone`, `tablet`, `desktop`, `tv`, `unknown` | `Sec-CH-UA-Mobile` and the UA family |

**Never stored:** IP address, User-Agent string, full URL, query string, cookies or any new identifier. No new cookie or id is set anywhere. The User-Agent is read to classify, then dropped. `scrubOrigin()` re-checks every field against its pattern before anything is stored or shown.

### Native apps: `X-AUN-Client`

Native apps send `X-AUN-Client: <app>/<version> (<OS> <OS version>)`, for example `aun-studio/1.4.0 (iPadOS 18.1)`, `aun-admin/2.0 (Android 15)` or `aun-studio/1.4.0 (Windows 10.0)`. The OS name decides the surface (`iPadOS` → `ipados`, `tvOS` → `apple_tv`, …). It carries no device id, user or install.

- **aun-core** sends it on every API request: `ApiClientConfig.client` (FFI, default `aun-core/<version> (<OS>)`), from **v0.4.0-rc.3** ([AlUmmahNowCore#49](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/49), [#50](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/50)).
- **Apple:** `AUNClient` in AUNCoreBridge (iPad or iPhone from the hardware model, no UIKit). It is set on the aun-core config and the Studio, Admin and catalog request builders.
- **Android:** `AunClient` in core-bridge. Studio passes it to aun-core, and the Admin app's `PrivateHttp` adds it.
- **Desktop:** `AunClient.FromUserAgent` in CoreBridge (Windows, Linux, macOS, Tizen). It is set on the aun-core transports, `StudioHttpClient` and the Admin review service.

## Where it shows

### Errors page (videos admin)

- Each sample shows **Origin** (app and version), **Device**, **Country** (named in the page language), **Came from** (source, referrer host and campaign) and **Entry page**.
- A **Where it came from** card counts the group's stored samples per surface. Each row links to the list filtered by it.
- The Errors list has an **Origin** filter (`/errors?origin=ios`).
- Storage: `error_events.context_json.origin` holds the full origin, plus two indexed columns, `origin_surface` and `origin_source` (admin-api migration 0040).
- Browser errors take their origin from headers the admin-api ingest vouches for. Server errors take it from the request (`withErrorReporting`). Queued jobs carry the originating request's origin on the message (`QueueMessage.origin`), so an error in a consumer still says where the request began.
- **Actions → Prod errors** prints each sample's origin line.

### Audit and jobs

`site_settings_log` and `admin_audit_log` get an `origin` column holding surface, app, app version, device and country (admin-api migration 0041). Every admin write records it. Queue messages sent by api-videos carry `origin`, and the processor opens its error trail with it.

### Analytics

- `analytics_daily` counts four more dimensions per day: `surface` (max 16), `device` (max 5), `country` (top 50, the rest as `other`) and `campaign` (utm_source, top 30). Each dimension is capped, so cardinality stays low.
- Video views (`POST /api/videos/:id/view`) and site visits both count them.
- **Studio analytics** (channel and video): a **Where viewers watch** section under Traffic sources, with App or site, Device, Country (top 10, then "Other countries") and Campaign links. It appears only once something has been collected.
- **Admin Site visits:** App or site, Device, Country (top 10 + other countries) and Campaigns (utm_source) tables.

## Cost

- No new reads on hot paths: the origin is computed in memory from the request.
- Writes: a few more `analytics_daily` rows per day per entity (bounded by the caps above) and two short columns per error sample. Audit rows gain one small JSON column.
- The Errors page's breakdown is one indexed `GROUP BY` over the group's stored samples, which are capped per group. The list filter is one `EXISTS` on an indexed column, only when the filter is set.

## PRs

| Part | PR | State |
|---|---|---|
| Model, errors ingest and storage, Prod errors report | [AlUmmahNow#1597](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1597) | merged |
| Audit rows and queued jobs | [AlUmmahNow#1602](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1602) | merged |
| Analytics counters and API fields | [AlUmmahNow#1603](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1603) | merged |
| Errors page: filter, sample origin, breakdown (visual) | [AlUmmahNow#1616](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1616) | held for the owner |
| Studio and Site visits breakdowns (visual) | [AlUmmahNow#1619](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1619) | held for AUDIT and the owner |
| Auth errors carry the origin | [AlUmmahNowAuth#439](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/439) | merged |
| aun-core `X-AUN-Client` and v0.4.0-rc.3 | [AlUmmahNowCore#49](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/49), [#50](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/50) | released |
| Native apps send the header | [AlUmmahNowAndroid#39](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/39), [AlUmmahNowDesktop#62](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/62), [AlUmmahNowApple#65](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/65) | open |

## Related

- [Error reporting and the admin Errors page](CHAT-ERRORS-error-reporting.md)
- [Search visibility: D-SEO-9 analytics and Site visits](AUN-SEO-search-visibility.md)
