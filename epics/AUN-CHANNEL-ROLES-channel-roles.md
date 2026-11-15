[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Per-channel roles

| | |
|---|---|
| **ID** | `AUN-CHANNEL-ROLES` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-14 |

> Spec merged ([AlUmmahNow#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462)). Roles enforced per action across videos, posts, comments and live, merged ([AlUmmahNow#1374](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1374), on QA, not yet released). Invitations, the team Activity log and team notifications are in review ([AlUmmahNow#1389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1389)).

## What is built

- **Roles:** owner, channel admin, editor and channel moderator, with the capability matrix in [`channel-roles.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/packages/shared-types/src/channel-roles.ts). `api-videos` checks it on every write a member may make; any write not on the allow-list stays owner-only.
- **Team page** (Studio, `/settings/channel/{id}/team`): Team and Activity tabs. Invite by email or @handle, change a role, remove someone, cancel a pending invitation. Each person sees only the actions their role allows.
- **Invitations** ([AlUmmahNow#1389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1389)): a role is given only when the person accepts on `/settings/channel-invites`, which the account menu links to with a count. An invitation lasts 14 days. An email invitation never tells the inviter which account owns the address. A cancel, a demotion of the inviter or an account erasure during an accept always wins.
- **Activity log**: every team change is logged, newest first, and kept for a year. It never stores email addresses.
- **Losing a role** cancels the invitations that person sent and, if they could manage live, gives the channel a new stream key.
- **Ownership** is never transferred here: only a super admin can, from the videos admin ([O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership)).
- No new paid resources: invitations and the log are two tables in the existing search D1, swept by the existing daily cron.

## Goal

Per-channel team roles, separate from site roles in AlUmmahNowAuth.

## Decisions and constraints

- [O16](decisions.md#o16-channel-roles-separate-from-site-roles-only-super-admins-transfer-ownership): Channel roles separate from site roles; only super admins transfer ownership (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Merged [AlUmmahNow#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462) (spec), [AlUmmahNow#625](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/625) (My channels), [AlUmmahNow#1374](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1374) (roles enforced per action); open [AlUmmahNow#1389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1389) (invitations, Activity, notifications)

## Open questions

- Auth's `account.deleted` event, which would remove a purged account's memberships, doesn't exist yet ([Auth#291](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/291)). Erasing an account on the videos side already removes its memberships and cancels its invitations.

## Conflicts between sources

- Supersedes native 19.8's "uses auth RBAC"; Epic 29 calls team roles 19.6.

## Sources

- [CHANNEL-ROLES.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/CHANNEL-ROLES.md) · [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/CHANNEL-ROLES-PLAN.md)
- [Site roles and channel roles](../guides/roles.md)
- [AlUmmahNow#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462), [AlUmmahNow#625](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/625), [AlUmmahNow#1374](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1374), [AlUmmahNow#1389](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1389)
