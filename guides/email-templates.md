[← Home](../README.md)

# Email templates (Settings › Emails)

Admins edit the wording of the system emails in the videos admin under **Site › Emails**. Only the **creator invite** is editable today; the other system emails follow the same model ([#1549](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1549)).

## Who

Super Admins and Admins (admin-api permission `emails:manage`). Moderators do not see the page. Every save, restore, undo and test send is in the **Audit log** (`email_template.saved`, `.restored`, `.undone`, `.test_sent`).

## The creator invite

| Part | Fields | Placeholders |
|---|---|---|
| Subject and preview text | Subject; preview text; preview text when channels are attached | `{name}`; `{channels}` required in the channels version |
| Greeting | Greeting (needs `{name}`); greeting when the invite has no name | `{name}` |
| Account paragraph | Account sentence; one new channel; several new channels; one moved channel; several moved channels | `{name}`, `{email}`; the channel sentences need `{channels}` |
| Sign-in instructions | How to sign in | `{name}`, `{email}` |
| Button and note | Button label; heading of the admin's note (shown only with a note) | none |
| Video card | Line above the video; picture description | `{name}`; `{title}` required in the description |
| Expiry line | Expiry line (needs `{expires}`) | `{expires}`, `{email}` |
| Footer | Why they got this email | `{email}` |

- **Both languages are required**, with no fallback. Each field has **Translate** in both directions ([Localized fields](localized-fields.md)); the suggestion is checked like typed text.
- **Placeholders** are inserted with the chips under each field, at the caret of the language last focused. A save is refused when a field uses a placeholder it may not use, drops one it needs, uses an unknown one, or leaves a stray `{` or `}`. The same checks run in the browser as the admin types (`checkEmailTemplate` in `packages/shared-types/src/email-templates.ts`).
- `{expires}` is the link's expiry date in the email's language (Arabic in ٠–٩); `{channels}` is the attached channels' names joined with "and" / «و».
- **Default invite video** per language (live video search; may be empty). Only a public, visible video can be saved. The default only **prefills** the video pickers of a new invite (`GET /api/email-templates/creator_invite/default-videos`, readable by whoever may invite); an admin who clears a language's picker sends that invite with no video in that language. It is never added at send time.
- **Video card** (when the invite has a video in its language): the line above it and the picture's description for screen readers (`{title}`) are editable too.
- **Language of a sent invite** is still the one the admin picks next to Send.

## Preview and test

- The preview is the real layout rendered by admin-api (`lib/email/invite.ts`, twin of Auth's builder) with a made-up person, in English or Arabic, in a light or dark mail app, at desktop or phone (375 px) width, with no channel, one, two or a moved channel. It shows unsaved changes.
- **Send test to me** emails the preview's language, with unsaved changes, to the signed-in admin's address. The subject starts with "[Test]" / «[تجربة]» and a notice at the top says the button accepts nothing. Five tests per admin per hour.

## Versions

- Every save is a new version; nothing is overwritten. **History** lists each version with who and when (names, never stored emails) and **Restore**, which makes a new version with the old text. Save and Restore both offer **Undo** for a few seconds.
- An editor opened before someone else saved gets "Someone saved this email while you were editing" and cannot overwrite it.
- Version 1 is the copy Auth sent before the page existed (migration `0036_email_templates.sql`).
- A wording fix shipped by a migration is its own version, by the system, shown in History as **Updated by Al Ummah Now** / «حدّثته الأمة الآن» (action `update`), and can be restored like any other. It only replaces a sentence that still equals the seeded text, so an admin's own edits are never overwritten. First one: migration `0045_invite_wording_link_flow.sql` ([#1658](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1658)) rewrote the sign-in sentences (`how`, `expires`, en and ar) for the one-time invite link from [Auth#434](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/434): the button signs the person in, the link works once, and an old link asks for a new one.

## Delivery

- admin-api stores the templates (`email_templates`, `email_template_versions` in the reports D1).
- The invite's create and resend requests to Auth carry `emailCopy`: the current version's copy in the invite's language (`{ key, version, locale, copy }`). Auth never reads the admin DB.
- Auth renders with that copy, video card included ([Auth#432](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/432), [Auth#433](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/433), live since 2026-11-19). Its built-in copy (the same words as the default copy in shared-types) is an emergency default only, also used for an invitee's own "Email me a new link", used when the request has no copy, copy in another language or an incomplete one, and each use logs `[invites] Built-in invite copy used` with the reason.

## Making another email editable

Add its key and fields to `EMAIL_TEMPLATES` (shared-types), seed today's exact copy in a migration, render it from the stored copy with a logged built-in default, add a preview sample, and cover edit, preview and restore in E2E. The list of emails still to move is in [#1549](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1549).
