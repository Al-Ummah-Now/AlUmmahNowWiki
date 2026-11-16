[← Home](../README.md)

# Help and the identity tour

The videos site explains itself in two ways:

- **Help** at `videos.alummahnow.net/{en|ar}/help`: seven topics in English and Arabic, with annotated pictures and three short clips.
- **The identity tour**: five steps over the real header and account menu. They show that you can act as yourself or as a channel, and how to switch.

The owner approved the design on 2026-11-13. It shipped (merged 2026-11-13) in AlUmmahNow [#1154](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1154) (the "Acting as" wording and post comments without a channel) and [#1157](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1157) (Help and the tour). www links to it from its footer ([UI#74](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/74)). The developer record is [`docs/features/HELP-AND-TOUR.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/features/HELP-AND-TOUR.md).

## Decisions

| | Decision |
|---|---|
| Where Help lives | On the videos site, in the repo, with both languages in `packages/shared-types/src/i18n-help.ts`. It is not in the CMS, so the text changes in the same PR as the screens it describes. An admin can still correct a sentence through the translation store. |
| When the tour shows | Once per account, after sign-in. It is remembered on the account (`GET/PUT /api/profile/onboarding`), not in the browser. Finishing it, skipping it or choosing "Not now" all count as seen. |
| Pictures | Annotated screenshots for every topic, plus three clips: switching identity, uploading and the mini player. A script makes them from the real site on the local stack, and it runs again for every release. |
| Wording | The account menu's identity section is labelled **Acting as** / «تتصرّف باسم». Identities follow the YouTube/Facebook pattern (owner decision 2026-11-15): you appear with your own picture and name (display name, else first + last, else email; never an @handle) and a small tag **Personal** / «حساب شخصي»; each channel with its logo, name and the tag **Channel** / «قناة». The picker lists you first, then your channels, and is headed **Acting as**. The words "none", "no channel" and "without a channel" are never used for your own identity. The native Studio apps (Apple [#53](https://github.com/Al-Ummah-Now/AlUmmahNowApple/pull/53), Android [#25](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/pull/25), Desktop [#51](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/pull/51)) use the same heading and **Channel** tag; Studio always needs a channel, so they list channels only. **Identity is chosen only in the account menu** (owner decision 2026-11-15): comments, replies, posts, likes, subscriptions and playlists always use the current acting identity, and nothing else offers a picker. Comment, reply and post boxes show only the acting identity's avatar (your photo or the channel's logo), the way YouTube does: no "Commenting as" / «تعلّق باسم» text and no Switch link. The avatar's accessible name is the identity's name ([#1474](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1474)). |
| Header | The header's account button shows the identity you act as: the active channel's logo and name, or your own picture and name when you act as yourself (Personal). Acting as yourself there is no **Upload** in the header or the phone tab bar (nothing to upload to; never a greyed-out button); it comes back when you pick a channel ([#1465](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1465)). |
| Tour card | A frosted-glass panel with flat buttons. On phones it sits above the tab bar. Its last step points at **Help**: the side menu's Help item on desktop (the card beside it), and **More** in the tab bar on phones, with the text "Help is under More". Step 1 says the account button shows who you are acting as ([#1465](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1465)). |
| Entry point | **Help** is in the side menu's More group only, next to the guidelines and Contact: a destination lives in one place among header, side menu and account menu (NAV-060). Empty states and channel messages link to the matching Help page. |
| Tone | A general content-sharing site. Arabic uses «مرئي / مرئيات». |

## What the guide says about identities

This is the behaviour on main once #1152 (subscribe as yourself), #1153 (video comments without a channel) and #1183 (playlists without a channel) are merged.

| Action | As yourself (Personal) | As a channel |
|---|---|---|
| Watch later, History | Belong to the account | The same lists |
| Comment and reply on videos and posts | Yes, with your display name and picture | Yes, with the channel's name and picture |
| Like videos and comments, vote in polls | Yes | Yes. Each identity's like counts separately |
| Subscribe | Yes | Yes. A separate subscription that counts separately |
| Playlists: Save, a video card's "Save to playlist", create, edit | Yes: your own playlists, in the Playlists section of You (/library) | Yes: the channel's playlists |
| Upload, Studio, schedule, go live | No | Yes |
| Write posts on the Community tab | No | The channel owner only |

Every playlist is public (listed and searchable), unlisted (link only: never in lists, channel sections, search or feeds) or private (only you, or the channel's playlist managers).

The Subscriptions feed, the manage page and the side menu are per account: each channel is listed once. **Unsubscribe** on the manage page removes every subscription the account has to that channel. The new-video bell is also per account.

## Pictures and clips

The capture script is `apps/web/e2e/help-capture/capture.help.ts`. It runs in `.github/workflows/help-pictures.yml`:

- **On PRs that change Help,** the pictures become the `help-pictures` artifact. Commit them with the PR.
- **On every release tag, and by hand,** the workflow opens "chore(help): refresh Help pictures" when anything changed. A PR opened by the workflow's token starts no checks, so push an empty commit to it before merging.

A unit test fails when a picture named in the text has no file.

## Tests

- **jest:** the content (English and Arabic have the same shape, the wording rule, links, a file for every picture), the pages and search, and the tour.
- **E2E** `apps/web/e2e/76-help-tour.spec.ts` in the local web suite:
  - the tour is offered once and not again on a second device;
  - "Not now" counts as seen;
  - it reopens from Help;
  - it works with the keyboard, mirrors in Arabic and has no motion with reduced motion;
  - axe passes in both languages and both modes.

An automated browser is never offered the tour, so it can't get in the way of other specs. The tour's spec opts in with `localStorage` `aun-tour-e2e=on`.
