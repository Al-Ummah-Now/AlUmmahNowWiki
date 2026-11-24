[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Uploads survive deploys; upload rate limits

| | |
|---|---|
| **ID** | `CHAT-UPLOADS` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-24 |
| **Origin** | Chat only: no repo doc defines this epic |

> Merged 2026-11-10 (#578, #583, #592, #606, #612, #613, #634, #680; rate limits #522, #623).

## Goal

Uploads resume after deploys and failures, never from 0; stuck uploads are flagged and repairable from admin; orphan Bunny videos are reaped; admin-configurable rate limits where retries don't count.

## Decisions and constraints

- [O26](decisions.md#o26-always-async-with-admin-visible-errors): Always async, with admin-visible errors (decided)
- **A finished file picked again is never a silent duplicate** (owner, 2026-11-13). The single uploader and the batch uploader both show **Already uploaded** with a link to the video. A second video is created only through the explicit **Upload again as a new video** action, which is in-page with no browser prompt. An unfinished file still resumes at its offset ([AlUmmahNow#1126](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1126)).

- **Accepted video files** (**pending [AlUmmahNow#1944](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1944), not merged yet**; issue [#1938](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1938)). When it merges, the web upload forms (single, batch, and a file dropped on either drop zone) accept **MP4, M4V, MOV, WebM, MKV and AVI**. A file is taken by the type the browser reports (MOV is `video/quicktime`, AVI is `video/x-msvideo` or `video/avi`) or, when the type is empty or generic, by its extension in any case; a type that names another kind of file is refused. The type sent to the server is the format's own, whatever name the browser used. One list feeds the file picker, the help text and the error messages in English and Arabic.
  - Our ffmpeg transcoder was run on every format and codec in that list, and on 3GP, MPEG-2, WMV, FLV and OGV: all transcode, except a 5 s MPEG-TS clip, which fails at the stills step ([AlUmmahNow#1946](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1946)). The local E2E stack fakes Bunny and the transcoder container, so those runs used the transcoder's own image directly.
  - Bunny Stream: **by its documentation only** (all six containers are listed; its codec list has no Opus or Vorbis audio, no MPEG-4 part 2 and no MJPEG). Its real behavior is checked on QA after merge with `apps/web/e2e/manual/upload-formats-qa.manual.ts` (it also uploads WMV and FLV, which Bunny documents, to see whether the website can take them as Desktop Studio does).
  - Other surfaces: Desktop Studio takes mp4, mov, mkv, webm, avi, m4v, mts, ts, wmv, flv, 3gp, mpg and mpeg. Tools takes mp4, mkv, avi, mov, wmv, m4v, flv and webm. Android's picker is `video/*`. Apple Studio's picker takes `.movie` types, which leaves out MKV ([AlUmmahNowApple#101](https://github.com/Al-Ummah-Now/AlUmmahNowApple/issues/101)).

Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PRs [AlUmmahNow#522](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/522), [AlUmmahNow#578](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/578), [AlUmmahNow#592](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/592), [AlUmmahNow#606](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/606), [AlUmmahNow#612](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/612), [AlUmmahNow#613](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/613), [AlUmmahNow#623](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/623), [AlUmmahNow#634](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/634), [AlUmmahNow#680](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/680), [AlUmmahNow#1126](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1126)

## Open questions

- None recorded in the sources.

## Sources

- [AlUmmahNow#578](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/578), [AlUmmahNow#592](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/592), [AlUmmahNow#522](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/522)
