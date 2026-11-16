[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Contact us page and admin inbox

| | |
|---|---|
| **ID** | `CHAT-CONTACT` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md), [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-10 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#568, #584, #615, #626; www link UI #23).

## Goal

A Contact us page with an admin inbox; mail sent through a queue with retries.

## Decisions and constraints

- [O26](decisions.md#o26-always-async-with-admin-visible-errors): Always async, with admin-visible errors (decided)

Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## How the admin inbox works

The videos admin's **Contact messages** page ([#1480](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1480)):

- **Opening a message:** click anywhere on its row. Opening a message marks it read.
- **Read and unread are separate from the status.** The statuses are Open, In progress, Replied, Closed and Spam. A new message is Open and unread. Sending a reply marks it Replied and read.
- **The nav badge** counts unread messages. Spam never counts. Opening a message updates it at once. On the Contact pages it follows changes made anywhere without a reload. On other admin pages it is redrawn on the next refresh.
- **Views:** All, Unread, Open, In progress, Spam and Send failed, each with a count. Search, topic, date and assignee filters stay in the URL.
- **Bulk bar:** select rows to mark them read or unread, set a status, assign them, or delete them.
- **Delete** happens at once, with an **Undo** toast and no confirm. A deleted message also stays in **Recently deleted** for 30 days.
- **Assign** uses a live picker over the inbox's own roster: admins who can handle messages and opened the inbox in the last 180 days. Roles are never read from the auth server.
- **Spam:** each message keeps its **bot check** result (the Turnstile outcome when it was sent). A message goes straight to Spam, and gets no emails at all, when:
  - the check failed or was missing (monitor mode lets these through), or
  - the text reads as a sales pitch: two different pitch phrases (SEO, "online visibility", "rank higher on Google", a list of website builders, …) or three links or more.

  The detail page shows why a message is spam, and **Not spam** moves it back.

## Status evidence

- PRs [AlUmmahNow#1480](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1480) (complete inbox), [AlUmmahNow#568](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/568), [AlUmmahNow#584](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/584), [AlUmmahNow#615](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/615), [AlUmmahNow#626](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/626)

## Open questions

- None recorded in the sources.

## Sources

- [AlUmmahNow#568](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/568), [AlUmmahNow#584](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/584)
