[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Multiple audio tracks

| | |
|---|---|
| **ID** | `AUN-MULTI-AUDIO` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) (api-videos, media, processor, admin-api, admin-web, web); the native apps read the contract through AlUmmahNowCore |
| **Status** | **in progress** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |

> Owner, 2026-11-14: "multiple audio support, spec, design, build". Videos with more than one audio track, e.g. the original plus an Arabic/English/Urdu dub, a translation voice-over, or audio description.

## Goal

- A creator adds extra audio tracks to a video in Studio. Each track comes from an uploaded audio file (one per language) or from a track found in the video's own file (a multi-track source).
- Each track has a **language**, a **label** and a **kind**: `original`, `dub`, `commentary` or `description`. Exactly one track is the **default**.
- Viewers pick a track from the player's Audio menu. The player remembers their choice and, when there is no saved choice, starts on the track in the viewer's site language if one matches. Otherwise it plays the default.
- Every new track goes through the same automated review as an upload before viewers can hear it.
- Admins set **audio tracks per video** for each creator tier.

## Decisions (MA-series)

Built to these recommendations; the owner may change any of them.

| ID | Decision | Why |
|---|---|---|
| MA1 | **Delivery is HLS alternate audio** (`EXT-X-MEDIA TYPE=AUDIO`, one `GROUP-ID`), with **demuxed renditions**: video-only rungs plus one audio-only rendition per track, the original included. | Measured 2026-11-14 with video.js 8.23.4 and VHS 3.17 (the web player's versions): our current rungs carry their own audio. With a muxed rung plus an alternate, picking the alternate never played it (the muxed audio kept playing) and a seek stalled playback. With demuxed renditions, switching took under a second both ways, after seeks too. Demuxed is also what Bunny recommends and what AVPlayer and Media3 expect. |
| MA2 | **Only videos with an extra track get the demuxed package.** It is built from the ready R2 rendition with stream copy: video rungs copied without audio, the original audio copied from the top rung, each extra track encoded once. No video is re-encoded. Videos without extra tracks are untouched. | Zero change, cost or risk for every other video. |
| MA3 | **The package has its own master playlist with a versioned name** (`master_a<n>.m3u8`) under the rendition's prefix, and the API hands out that URL. | `/pub/` is served by the R2 custom domain with a 5-minute playlist cache and no Worker; a new file name needs no purge and is never stale. Moves between `pub/` and `priv/` copy the whole prefix, so the package moves with the rendition. |
| MA4 | **Bunny: tracks play from R2.** Bunny Stream takes extra audio only inside the uploaded source file ("If your original file already contains multiple audio streams, our system will respect this…"). Its API has no way to add an audio file to an existing video, and an existing video needs a re-encode from its original. So a video with extra tracks plays its R2 package first. If the video has no R2 rendition yet, adding the first track queues one. Bunny stays the fallback, with the original audio only. We do **not** turn on Bunny's `EnableMultiAudioTrackSupport`: the track list would then come from file metadata, not from Studio. | One track list, one review path, one player behaviour. |
| MA5 | **Tracks are matched to the video's length.** A shorter file is padded with silence and a longer one is cut at the video's end, so seeking and switching stay in sync. The original audio cannot be deleted; its language and label can be edited. | Alternate renditions must cover the same timeline. |
| MA6 | **Track languages** are the caption languages (ar, en, ur, fr, id, tr, ms, bn, de, es). The label defaults to the language's name in that language (e.g. «العربية», "English", «اردو») and the creator can change it. | Same list as subtitles; the menu reads the same in both site languages. |
| MA7 | **Viewer choice:** stored on the device by language and kind (`aun.player.audio`), so one choice applies across videos. With no saved choice, the player starts on the track in the site language (on embeds, the embed's `lang`). With no match, it plays the creator's default. Choosing a track in the menu saves it. | A dub-in-my-language viewer should not have to pick it on every video. |
| MA8 | **Review:** each new track's audio goes through the review pipeline's speech checks (transcription, text guard, Quran matcher) as subject `audio_track`, under the same mode as uploads (off, shadow, enforce_nsfw, enforce). In `enforce`, a track waits for an approve, or for a reviewer when the check holds it. A rejected track is never played and the creator sees the reason. In other modes the track plays as soon as it is ready, and the check is recorded. | "Each new track goes through the same review/AI checks as uploads." |
| MA9 | **Tier limit:** `audioTracksPerVideo` per creator tier counts the extra tracks (the original is not counted). It is 0 on the default Creator tier and unlimited on the Unlimited tier, the same starting point as caption minutes; super admins are unlimited. Over the limit, the API answers 402 `upgrade_required` with entitlement `audio.tracksPerVideo`. | Admin-managed (T1), like every tiered feature. |
| MA10 | **Captions are independent of the audio track.** Picking a dub does not change the captions. Transcription (AUN-CAPTIONS) always transcribes the original audio. An `description` track is flagged `public.accessibility.describes-video`, so players that support it list it as audio description. | Viewers who need captions keep them; there is no surprise switching. |

## Delivery

```
<pub|priv>/<videoId>/<rev>/
  master.m3u8, 360p/ … 1080p/        the normal rendition (muxed audio; untouched)
  a/v/<rung>/index.m3u8 …           video-only copies of each rung (stream copy)
  a/orig/index.m3u8 …               the original audio (stream copy from the top rung)
  a/<trackId>/index.m3u8 …          each extra track: AAC-LC 128 kb/s stereo, 6 s fMP4 segments
  master_a<n>.m3u8                  EXT-X-MEDIA per track + EXT-X-STREAM-INF per rung, AUDIO="aud"
```

- `NAME` is the track label, `LANGUAGE` the language code, and `DEFAULT=YES` is set on the default track. `AUTOSELECT=YES` is on every track. A `description` track also carries `CHARACTERISTICS="public.accessibility.describes-video"`.
- A rejected, failed or deleted track is not in the master. When the set changes (add, delete, default, label), a new master is written, the record points at it, and the old master and the removed track's folder are deleted.
- After a re-transcode (new rev), the package is rebuilt for the new rev from the stored tracks before the old rev is deleted.
- The uploaded file is normalised once to `audio/<videoId>/<trackId>/track.m4a` in the originals bucket, which is private, and packaging copies from that file. Uploaded parts are deleted after the file is normalised. Deleting the video deletes the tracks.

## Cost (within the $500/month budget)

| Item | Estimate |
|---|---|
| Storage per extra track | ≈ 58 MB per hour of audio (128 kb/s) → ≈ $0.0009/month per track-hour on R2 |
| Video-only copy of the ladder (once per multi-audio video) | ≈ 1–1.5 GB per hour of video → ≈ $0.015–0.02/month per hour of video |
| Container time | Normalising an hour of audio and stream-copying an hour of video take a few minutes on `standard-4`: ≈ $0.01 per job |
| Review | Same Workers AI speech check as uploads (≈ $0.034 per audio-hour), only where review is on |
| Egress | R2 egress is free; Bunny is not used for extra tracks |

Nothing runs while idle: jobs only run when a creator adds, edits or deletes a track. At today's volume (no multi-audio videos yet) the running cost is under $1/month.

## API

All routes need `video.edit` on the video (the owner, or a channel role that has it).

| Route | Does |
|---|---|
| `GET /api/videos/:id/audio-tracks` | The tracks, the package state, the tier limit and use, and the audio streams found in the source file (`detected`) |
| `POST /api/videos/:id/audio-tracks` | Add a track: `{ language, label, kind, isDefault, source: { type: 'upload', bytes, fileName, contentType } \| { type: 'source_stream', streamIndex } }`. 402 when over the tier limit |
| `PUT /api/videos/:id/audio-tracks/:trackId/upload?offset=N` | One chunk of the file (≤ 10 MB; files up to 2 GB; mp3, m4a/aac, wav, flac, ogg/opus) |
| `POST /api/videos/:id/audio-tracks/:trackId/complete` | The upload is whole: normalising is queued |
| `PATCH /api/videos/:id/audio-tracks/:trackId` | Language, label, kind, default |
| `DELETE /api/videos/:id/audio-tracks/:trackId` | Remove an extra track |
| `POST /api/videos/:id/audio-tracks/detect` | Look for audio streams in the video's own file (older videos were not probed for them) |

`GET /api/videos/:id` (and the native contract, `VideoView`) gains `audioTracks: [{ id, language, label, kind, isDefault }]`: only tracks that viewers can hear. The R2 source in `sources` is then the package's master playlist. Contract version 1.4.0.

## Jobs (queue, retry, DLQ, Errors page)

All on `al-ummah-now-transcode[-env]` (8 retries with backoff, DLQ `al-ummah-now-transcode-dlq`), each on its own Transcoder Durable Object:

| Kind | DO | Container route | Does |
|---|---|---|---|
| `audio_track` | `audio:<videoId>` | `POST /audio-track` | Probe, pad or trim to the video's length, encode `track.m4a`, extract the review audio (16 kHz chunks) |
| `audio_package` | `<videoId>` (waits while a transcode runs) | `POST /audio-package` | Video-only rungs (once per rev), original audio, each track's rendition, the new master |
| `audio_probe` | `audio:<videoId>` | `POST /audio-probe` | List the source file's audio streams (index, language tag, title, channels) |

A job that gives up flags the admin Errors page with a Retry (`/internal/audio-tracks/retry`), and the track shows "Failed" in Studio with a Try again button. A later success clears the Errors item.

## Player

- The Audio row in the player's settings menu lists the tracks as "label · kind" (the label alone when it already names the kind), with a check on the current one. It is hidden with one track. Keyboard: arrows move, Enter or Space picks, Escape closes; arrows swap in RTL. Screen readers hear a menu of radio items, with the label and its language (`lang` on each item).
- The choice is re-applied after a source fallback (the master changes) and on the next video.
- Embeds behave the same, defaulting to the embed's `lang`.

## Studio

The video editor gets an **Audio tracks** panel below Subtitles:

- One row per track: language, label, kind, a Default radio, a status (Uploading n%, Processing, Checking, Ready, Rejected with the reason, Failed with Try again) and Edit or Delete. The original's row has no Delete.
- **Add audio track** opens a form with the source (Upload a file, or From this video's file with the detected tracks listed, and "Look for tracks" when none were found), language, label (pre-filled), kind and "Make default".
- Shows the limit: "2 of 3 audio tracks used". Over the limit, the Add button explains the tier limit instead.

## Admin

- **Tiers:** "Audio tracks per video" in the tier editor, 0 to 16. Unlimited tiers ignore it.
- **Errors:** failed track and package jobs, with Retry.
- **Review queue:** held tracks appear as "Audio track" items with an audio player, the transcript findings and Approve or Reject.
- **Renamed tracks:** a new label on a cleared track is checked again as text (trigger `metadata_edit`). A rename while the first check runs is checked once that check ends, so an approval never covers a name it did not see.
- **Withdrawal:** when a track stops being audible (rejected, failed or deleted), its rendition folder is removed from the package at once and the API hands out the plain master until the new package is written.

## SEO

`VideoObject.inLanguage` lists the languages viewers can hear (the original first) when a video has more than one track.

## Tests

- Unit: master playlist writer, track validation and limits, the menu model (default by site language, saved choice), package and track job decisions, and the review subject.
- E2E on QA and stage (`apps/web/e2e/release/audio-tracks.player.spec.ts`): upload a second track to a QA video through the API, wait until it is ready, open the watch page, switch tracks in the Audio menu and check that the dub's rendition is the one loaded, then delete it and check that viewers no longer get it.
- Local player harness (`apps/web/e2e/player/audio-tracks.spec.ts`): a demuxed fixture package written by `packageMaster`. Checks the first track by site language (the dub on /en, the original on /ar), the menu's labels and `lang`, switching, the saved choice and keyboard use in RTL.

## Stories

| Story | What | Status |
|---|---|---|
| MA-S1 | Spec, decisions, research (this page) | done 2026-11-14 |
| MA-S2 | Schema, API, tier limit, jobs, packaging, review subject, contract | in review ([#1397](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1397)) |
| MA-S3 | Player (default by language, saved choice), Studio panel, admin tier field and review item | in review ([#1412](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1412)) |
| MA-S4 | E2E on QA, wiki status, feature registry | written; the QA run follows the merge |

## Status evidence

### Reconciled 2026-11-21

- **AUN-MULTI-AUDIO (AUN-37): Done** — both audits agree: AlUmmahNow#1397 (merged): audio-track API, jobs, packaging and review; AlUmmahNow#1412 (merged): player Audio menu, Studio panel and admin fields; AlUmmahNow#1397; AlUmmahNow#1412
## Sources

- [Bunny Stream: multi audio](https://docs.bunny.net/stream/multi-audio) · [Bunny blog: multi-audio support](https://bunny.net/blog/hop-to-new-territories-with-bunny-streams-new-multi-audio-support/)
- Player measurement, 2026-11-14: our `ladder.mjs` output (muxed) vs a demuxed package, in video.js 8.23.4, with Web Audio peaks at the two test tones
