[← Home](../README.md)

# Site roles and channel roles

Al Ummah Now has two permission systems. They are separate, and neither grants the other.

| | Site roles | Channel roles |
|---|---|---|
| Examples | Member, Moderator, Admin, Super Admin | Owner, admin, editor, moderator |
| Scope | The whole platform | One channel |
| Stored in | AlUmmahNowAuth | The videos side |
| In tokens | Yes (`roles`) | **Never** |
| Status | Live | Owner is live. Other roles are a draft spec |

The rules below come from the [channel roles spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/91b5e794734f6c6c31fbb882a7d494507f534bad/docs/specs/CHANNEL-ROLES.md), which is still a draft in [PR #462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462).

## Site roles

Site roles are managed in AlUmmahNowAuth's RBAC tables and issued in the access token. The auth migrations seed Member, Admin and Moderator, and the code also recognises Super Admin. Role checks in several apps are case-insensitive.

Examples of what they control: the CMS maps Super Admin and Admin to bknd `admin`, and Moderator to `editor`. The auth repo's older docs describe a simple `admin`/`user` field, which no longer reflects the code.

Billing roles are proposed in [AlUmmahNowAuth #227](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/227).

## Channel roles

Today, each channel has one owner, stored as `channel.userId` on the videos side. Other channel roles aren't implemented yet.

Under the draft spec, an owner can invite other accounts as channel **admin**, **editor** or **moderator**, stored on the videos side in `api-videos` D1.

## Rules

- A channel role is never written to auth and never added to a token.
- A channel role never grants a site role. A channel admin is not a site admin.
- A site role never grants a channel role. A site admin is not an admin of any channel.
- "Admin" and "moderator" exist on both sides. In UI and code, always say "channel admin" and "channel moderator".
- Existing site staff powers, such as content moderation, stay where they are and aren't modelled as channel roles.

## Ownership transfer

**Only a super admin can transfer channel ownership**, and only through the admin site. A channel owner can add other roles but can't change who owns the channel. There is no user-facing transfer.

This is specified in the [channel claim and transfer spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/aa6a9980ba9b5a346112f337c7d058d77105a18c/docs/specs/CHANNEL-CLAIM-AND-TRANSFER.md) (draft, [PR #460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460)). The screen doesn't exist yet: today nothing can move a channel between users.

## Where the two meet

Only two cross-overs are specified:

1. A super admin (site role) can transfer channel ownership.
2. Auth's `account.deleted` event removes the deleted account's channel memberships.
