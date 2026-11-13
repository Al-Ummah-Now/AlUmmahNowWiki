[← Home](../README.md)

# Site roles and channel roles

Al Ummah Now has two permission systems. They are separate, and neither grants the other.

| | Site roles | Channel roles |
|---|---|---|
| Examples | Member, Scholar, Moderator, Admin, Super Admin | Owner, admin, editor, moderator |
| Scope | The whole platform | One channel |
| Stored in | AlUmmahNowAuth | The videos side (the R2 channel record) |
| In tokens | Yes (`roles`) | **Never** |
| Status | Live | Live since 2026-11-10 |

The rules below come from the [channel roles spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/91b5e794734f6c6c31fbb882a7d494507f534bad/docs/specs/CHANNEL-ROLES.md) (draft in [PR #462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462)). The code is the source of truth: [`channel-roles.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/packages/shared-types/src/channel-roles.ts).

## Site roles

Site roles are managed in AlUmmahNowAuth's RBAC tables and issued in the access token. A refreshed token carries the user's current roles ([Auth#284](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/284)). The auth migrations seed Member, Admin, Moderator and Scholar, and the code also recognises Super Admin. Role checks in several apps are case-insensitive.

Examples of what they control: the CMS maps Super Admin and Admin to bknd `admin`, and Moderator to `editor`. The auth repo's older docs describe a simple `admin`/`user` field, which no longer reflects the code.

**Scholar** ([Auth#298](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/298), migration [`0029_scholar_role.sql`](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/apps/auth/migrations/0029_scholar_role.sql)) is for scholars who write articles. In the CMS it maps to the `writer` role, which sees and edits only its own posts. Their articles appear on their scholar page on www and their channel's Community tab. An admin grants it in the auth admin, or through an invite: invites may add Scholar but never a privileged role ([USER_INVITES.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/USER_INVITES.md)).

Billing roles are proposed in [AlUmmahNowAuth #227](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/227).

## Channel roles

Each channel has one owner, stored as `channel.userId` on the videos side. The owner can add other accounts as channel **admin**, **editor** or **moderator**. A channel admin can add and remove members too, but can't manage other admins. Members are stored in `channel.members` on the R2 channel record, up to 50 per channel. The draft spec said `api-videos` D1; the code uses R2.

The members API is in [`channelMembers.ts`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/apps/api-videos/src/endpoints/channel/channelMembers.ts). "My channels" in the account menu lists every channel a user owns or holds a role on ([AlUmmahNow#625](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/625)).

## Rules

- A channel role is never written to auth and never added to a token.
- A channel role never grants a site role. A channel admin is not a site admin.
- A site role never grants a channel role. A site admin is not an admin of any channel.
- "Admin" and "moderator" exist on both sides. In UI and code, always say "channel admin" and "channel moderator".
- Existing site staff powers, such as content moderation, stay where they are and aren't modelled as channel roles.

## Ownership transfer

**Only a super admin can transfer channel ownership**, and only through the admin site. A channel owner can add other roles but can't change who owns the channel. There is no user-facing transfer.

This is specified in the [channel claim and transfer spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/aa6a9980ba9b5a346112f337c7d058d77105a18c/docs/specs/CHANNEL-CLAIM-AND-TRANSFER.md) (draft, [PR #460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460)). The transfer is on the videos admin's channel page. The super admin picks the new owner from a user search and confirms in the page ([AlUmmahNow#695](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/695)).

## Where the two meet

Only two cross-overs are specified:

1. A super admin (site role) can transfer channel ownership.
2. Auth's `account.deleted` event removes the deleted account's channel memberships. This event doesn't exist yet: auth has no way to tell apps that a user was purged ([Auth#291](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/291)).
