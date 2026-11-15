[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Videos admin: platform content management

| | |
|---|---|
| **ID** | `CHAT-ADMIN-CONTENT` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-14 |
| **Origin** | Chat only: no repo doc defines this epic |

> API (#576) and UI (#627) merged 2026-11-10. ADM-1 completeness (2026-11-14): purge completeness merged (#1370 and, for revoked invites, #1413; needs release); audit log page and names instead of ids (#1403), channel transfer with the shared autocomplete (#1405) and the remote config editor (#1410) are held for owner screenshots.

## Goal

Channels, videos, users and jobs managed inside the videos admin, with no links to the auth admin (owner reversed the first brief).

## Decisions and constraints

- [O14](decisions.md#o14-auth-is-a-separable-sso-provider): Auth is a separable SSO provider (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- ADM-1: [AlUmmahNow#1370](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1370), [AlUmmahNow#1413](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1413), [AlUmmahNow#1403](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1403), [AlUmmahNow#1405](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1405), [AlUmmahNow#1410](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1410)
- PRs [AlUmmahNow#576](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/576), [AlUmmahNow#627](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/627), [AlUmmahNow#636](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/636), [AlUmmahNow#645](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/645), [AlUmmahNow#649](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/649)

## Admin completeness (ADM-1, 2026-11-14)

- **Purge completeness** (#699, #700, #702, #814): a purge erases every copy of a video (its Bunny Storage thumbnails folder, caption jobs and their files, its place in its channel's sections and playlists, subtitles) and a post's images, and notifications of deleted content are hidden. [AlUmmahNow#1370](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1370), merged.
- **Revoked invite data** (#716): when a revoked, never-accepted invite reaches its purge and auth has removed the account, the hourly cleanup first gives any channel the invite moved from someone else back to its previous owner, then erases the provisioned profile, the channels made for the invite (freeing their @handles) and its creator tier, and only then drops the invite. A failure flags the admin on the Errors page with an Erase now retry. [AlUmmahNow#1413](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1413), merged.
- **Audit log page** (#711, #745): `/audit` in the videos admin lists every admin action, filtered by admin and item (autocomplete), area, action and dates, and every history card shows names instead of ids. [AlUmmahNow#1403](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1403).
- **Channel transfer** (#710, #713): the new owner is picked with the shared autocomplete (search by name, @handle or email; team members first; banned accounts can't be picked). [AlUmmahNow#1405](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1405).
- **Remote config editor** (#413, #415): see [E09](E09-native-platform-foundations.md) 9.5. [AlUmmahNow#1410](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1410).

## Open questions

- None recorded in the sources.

## Conflicts between sources

- The first brief linked the Users section to the auth admin; the owner reversed that minutes later. Docs written from the first brief would be wrong.

## Sources

- [AlUmmahNow#576](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/576), [AlUmmahNow#627](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/627)
