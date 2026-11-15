[← Home](../README.md)

# Status page

`status.alummahnow.net` tells people whether Al Ummah Now works right now. Stage: `status.stage.alummahnow.net`; QA: `status.qa.alummahnow.net`. English at `/`, Arabic at `/ar` (right to left). Source: [AlUmmahNow `apps/status`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/apps/status), full spec in [`docs/status-page/README.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/status-page/README.md).

## Why it stays up

It is its own Worker with its own D1 database. Showing the page never calls the API, sign-in or the admin, so it answers while they are down. Pages are edge-cached for 30 seconds.

## What it watches

**On the public page:** website, videos site, sign-in, profile, uploads, playback (R2 and Bunny), live streaming, notifications and realtime, and search.

**Admin only:** the videos API, CMS, videos admin, admin API, accounts admin and email. They are checked and alerted on exactly like the public ones but shown only on the videos admin's **Status** page (owner, 2026-11-13: "You shouldn't show admin status unless this page is only for admins"). The public page, its JSON and feeds never list them or show check details or internal hostnames.

A cron checks each one every 2 minutes in production (every 5 on QA and stage) with anonymous, read-only requests. The uploads check sends a TUS request without a token and expects 401, so no video is ever created. Email and Bunny follow their providers' status pages.

- **States:** Operational, Degraded performance, Partial outage, Major outage, Under maintenance.
- **No flapping:** a state changes only after two checks in a row agree, both when it breaks and when it recovers.
- **Uptime:** 90 daily bars per component. A major outage counts as down, a partial outage as 30% down, slow as up; maintenance is left out. Phones show the last 30 days.

## Incidents and maintenance

Admins and super admins post them on the videos admin **Status** page (Operations group), always in English and Arabic. The same page lists every component, public and admin-only, with its last result and 90-day uptime:

- **Incident:** title, message, affected components, impact, and status from Investigating to Resolved. Each update adds to its timeline. An open incident makes its components look at least as bad as its impact.
- **Scheduled maintenance:** a time window and components. The page lists it ahead of time and shows "Under maintenance" while it runs; no outage alerts are sent for those components.
- **Public or not:** an incident appears publicly only with its public components. One that affects only admin-only components (say, the CMS) stays on the admin Status page.
- **Delete** hides it from the page and feeds. It can be restored for 30 days, then it is purged ([Deletion, erasure and cleanup](data-lifecycle.md)).

People can follow incidents with the Atom and RSS feeds (`/feed.atom`, `/feed.rss`, `/ar/…`), `/api/status.json`, email, or a webhook (below).

## Subscriptions

Built in [#1380](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1380) (issue [#1193](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1193)); on QA once merged, in production with the next release.

**What is sent:** a new incident or maintenance, each update posted to it, and its resolution, within a minute or two. Only incidents with a public component are sent, and only their public components are named. Internal-only incidents are never sent. Editing an update's text does not send it again.

**Email:**
- **Sign-up:** anyone signs up at `/subscribe` (`/ar/subscribe`) and chooses English or Arabic emails. The main page links there ("Get email updates") and so does the footer ("Email updates").
- **Double opt-in:** nothing is sent until the address is confirmed. The confirmation email links to a page whose button confirms; opening the link alone changes nothing. Unconfirmed addresses are deleted after 7 days.
- **Unsubscribe:** every email has an unsubscribe link and the `List-Unsubscribe` headers, so mail clients offer one-click unsubscribe. Unsubscribing deletes the address.
- **Abuse limits:** a few sign-ups per network per hour (no IP address is stored), a hidden honeypot field, a 10-minute wait before a confirmation email is sent again, and form posts from other sites are refused.
- **Delivery:** emails go out through Resend, the same sender as the rest of the platform.

**Webhooks:** only admins add them, on the videos admin **Status** page (up to 20, https and a public host name).
- **Format:** each update is posted as JSON.
- **Signature:** `x-aun-signature: sha256=<hex>` is an HMAC-SHA256 of `<x-aun-timestamp>.<body>` with the webhook's signing secret. The secret is shown once, when the webhook is added. The other headers are `x-aun-event` (`incident.created`, `incident.updated`, `incident.resolved`) and `x-aun-delivery` (a delivery id; a receiver can use it to drop repeats).
- **Responses:** redirects are not followed. A 4xx answer is final; 408, 429, 5xx and timeouts are retried.

**Admin:** the **Subscriptions** card on the **Status** page shows confirmed and waiting counts (never the addresses). From the card an admin:
- adds or deletes webhooks, and sees each one's last delivery
- removes an address on request
- sees the last 20 notifications with recipients, delivered and failed counts, and **Send failed again**

Every action is audited.

**Retries and errors:** everything is sent from a queue (`al-ummah-now-status-notify`, consumed by the admin API). Each delivery is recorded, so a retry never sends twice. Failures are retried with backoff (30 seconds, doubling up to 15 minutes, 6 tries in all), then go to the dead-letter queue and open an item on the admin **Errors** page with a **Retry** action.

**Cost:** one Resend email per subscriber per update. Queue and database use stays inside the included usage, and nothing runs while idle.

## Alerts

When a component reaches a partial or major outage, an item opens on the admin **Errors** page (`status:<component>`), and production emails it like every other critical item. It closes by itself when the component recovers. If the admin itself is down, production also emails the alert directly.

## Links to it

The videos site's sidebar (More → Status) and the www footer (Service status) open the status page of their own environment.
