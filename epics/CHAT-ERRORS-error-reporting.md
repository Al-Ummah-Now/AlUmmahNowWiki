[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Error reporting and the admin Errors page

| | |
|---|---|
| **ID** | `CHAT-ERRORS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-19 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#588, #589, #607, #608). 2026-11-18: error context on the detail page and the read-only **Prod errors** workflow (below).

## Goal

Every server and client error reaches an admin Errors page with needs-action items (owner: "errors should flag admin for action").

## Decisions and constraints

- [O26](decisions.md#o26-always-async-with-admin-visible-errors): Always async, with admin-visible errors (decided)

Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Error context (2026-11-18)

Owner 2026-11-18: "errors in admin need more context". Every sample on the error detail page shows what an admin needs to act without Cloudflare access:

- request: method, route as reported and its template (`/api/videos/:id`), HTTP status, request (ray) id
- where: app, environment, Worker script, release, Worker version id
- who/what: the user id, the video id and channel id involved (linked to their admin pages). Ids only.
- the **failed call**: the dependency that answered 5xx or did not answer (host or binding, templated path, status)
- the **job** for background work: queue, message id, attempt
- **Steps before the error**: the last 12 breadcrumbs (every outgoing fetch with its status, and steps the code records)
- **Details**: the reporter's small `extra` fields

Captured at ingest (`error_events.context_json`, admin-api migration `0037`); ingest adds the Worker name and the route's ids for every app, Auth included. Server apps record the trail with `@al-ummah/shared-types/error-trail` (api-videos, processor, admin-api: requests and queue batches). Everything is scrubbed in the reporter and again on ingest (no emails, tokens, names or bodies). How to use it in code: `docs/features/error-reporting.md` → "Error context". PRs: [AlUmmahNow#1575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1575) (ingest), [AlUmmahNow#1576](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1576) (detail page, held for the owner's screenshots), [AlUmmahNowAuth#435](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/435) (Auth reporter).

## Reading production errors without touching production (2026-11-18)

**Actions → Prod errors** (`.github/workflows/prod-errors.yml`, `scripts/ops/prod-errors.ts` in AlUmmahNow), environment `production` or `stage`, hours back (logs at most 72). It prints, as the job summary and a 7-day artifact:

Optional **paths** (comma-separated, each starting with `/`, e.g. `/passkeys,/api/callback`): also lists every request whose path contains one of them, per Worker, with the log lines of those requests (time, method, path without query, status, outcome, browser family; no query strings, headers, bodies or ids). The filter runs in the Observability query, so the event cap never hides a match (AlUmmahNow #1608).

- the Errors page groups seen in the window (app, kind, route, culprit, message, status, count, first/last seen and release) with the latest sample's method, status, release, Worker version, request id and top stack frames
- the open needs-action items
- warn/error log lines from Workers Observability for web, admin-web, api-videos, admin-api, media, processor, websocket, scheduler and Auth (auth, auth admin, profile), repeats collapsed with a count

Read-only: the reports D1 is read through the Cloudflare API with bounded SELECTs on indexed columns (no scans, no LIKE); the Observability query only reads; no app endpoint is called. Emails, tokens and URL query strings are scrubbed; at most user ids are printed. A pull request that changes it runs it against stage. It also prints the cost collector's failed runs (`collector_runs`, `cost_job_runs`). PRs: [AlUmmahNow#1574](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1574), [AlUmmahNow#1580](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1580).

## Request origin (2026-11-19)

Each error sample records where its request came from: surface (web, admin, iPhone/iPad/Mac/Android/TV/desktop apps, embed, API, bot), app and version, device class, country, source with referrer host and campaign, and entry page. No IP, User-Agent or URL is kept. The Errors list filters by origin, and each group shows a per-origin breakdown. The model, the native `X-AUN-Client` header and the analytics side are in [Request origin](AUN-ORIGIN-request-origin.md).

## Status evidence

- 2026-11-18: [AlUmmahNow#1574](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1574), [AlUmmahNow#1575](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1575), [AlUmmahNow#1576](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1576), [AlUmmahNowAuth#435](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/435)
- PRs [AlUmmahNow#588](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/588), [AlUmmahNow#589](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/589), [AlUmmahNow#607](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/607), [AlUmmahNow#608](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/608)

## Open questions

- None recorded in the sources.

## Sources

- [AlUmmahNow#589](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/589), [AlUmmahNow#607](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/607), [AlUmmahNow#608](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/608)
