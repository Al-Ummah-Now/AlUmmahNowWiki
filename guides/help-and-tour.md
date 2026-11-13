[← Home](../README.md)

# Help and the identity tour

The videos site explains itself in two ways:

- **Help** at `videos.alummahnow.net/{en|ar}/help`: seven topics in English and Arabic, with annotated pictures and three short clips.
- **The identity tour**: five steps over the real header and account menu. They show that you can act as yourself or as a channel, and how to switch.

The owner approved the design on 2026-11-13. It was built in AlUmmahNow [#1154](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1154) (the "Acting as" wording and post comments without a channel) and [#1157](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1157) (Help and the tour). www links to it from its footer ([UI#74](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/74)). The developer record is [`docs/features/HELP-AND-TOUR.md`](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/features/HELP-AND-TOUR.md).

## Decisions

| | Decision |
|---|---|
| Where Help lives | On the videos site, in the repo, with both languages in `packages/shared-types/src/i18n-help.ts`. It is not in the CMS, so the text changes in the same PR as the screens it describes. An admin can still correct a sentence through the translation store. |
| When the tour shows | Once per account, after sign-in. It is remembered on the account (`GET/PUT /api/profile/onboarding`), not in the browser. Finishing it, skipping it or choosing "Not now" all count as seen. |
| Pictures | Annotated screenshots for every topic, plus three clips: switching identity, uploading and the mini player. A script makes them from the real site on the local stack, and it runs again for every release. |
| Wording | The account menu's identity section is labelled **Acting as** / «تتصرّف باسم». With no channel active it reads **Yourself (no channel)** / «اسمك الشخصي (بدون قناة)». The comment boxes say **Commenting as {name}** / «تعلّق باسم {name}», with a **Switch** link for members who have channels. |
| Tone | A general content-sharing site. Arabic uses «مرئي / مرئيات». |

## What the guide says about identities

This is the behaviour on main once #1152 (subscribe as yourself), #1153 (video comments without a channel) and #1183 (playlists without a channel) are merged.

| Action | As yourself (no channel) | As a channel |
|---|---|---|
| Watch later, History | Belong to the account | The same lists |
| Comment and reply on videos and posts | Yes, with your display name and picture | Yes, with the channel's name and picture |
| Like videos and comments, vote in polls | Yes | Yes. Each identity's like counts separately |
| Subscribe | Yes | Yes. A separate subscription that counts separately |
| Playlists: Save, a video card's "Save to playlist", create, edit | Yes: your own playlists, in the Library's Playlists section | Yes: the channel's playlists |
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
