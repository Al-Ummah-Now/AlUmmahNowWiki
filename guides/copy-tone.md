[← Home](../README.md)

# Copy Tone Guide

How every user-facing string reads, in English and Arabic, on the videos site, www, the CMS's public texts, Auth and Profile, emails, the native apps and store listings. Owner-approved on 2026-11-13 after the [copy audit](https://claude.ai/artifact/2uDxhXjZi1vj76Jy7vqNdT).

Al Ummah Now is a content-sharing site, not a lectures library. Write the way YouTube's interface does: neutral, plain, about formats and actions.

## Rules

1. **Name the formats, not a curriculum.** Say videos, Shorts, live streams, posts, playlists and channels. Don't describe the platform as lessons, lectures, courses or a library.
   - Yes: "Watch videos and Shorts, subscribe to channels and save playlists."
   - No: "Watch lessons and talks."
2. **Call people channels, creators, viewers and the community.** Say "scholar" only for the Scholars feature and scholar pages. Don't vouch for anyone ("scholars you can trust").
3. **Use YouTube's verbs:** watch, upload, share, subscribe, save, explore, go live. Channels are *subscribed to*, never *followed*. Don't use "learn", "study" or "keep learning" for what the platform does.
   - Yes: "Explore videos, or create an account to subscribe to channels."
   - No: "Browse the video library… and keep learning."
4. **Leave the content's words to the content.** A creator may title a video "Lesson 3"; the interface doesn't call things lessons. Content categories (Tafsir, Fiqh, Quran recitation, Islamic Lectures) keep their names.
5. **Neutral, not entertainment.** No music, movie or show language, and no hype: no "binge", "stars", "hits", "blockbuster", "thousands of viewers".
6. **Keep the Islamic identity factual.** "An Islamic video and community platform" is fine in descriptions. Don't claim value for the content ("beneficial knowledge", "trusted"). The [Community Guidelines](../repos/AlUmmahNow.md) carry the religious-content rules, which stay as they are.
7. **Arabic: plain modern Arabic, the same terms everywhere.** «مرئي / مرئيات» for video ([glossary](glossary.md#arabic-wording-for-video)), «المقاطع القصيرة» for Shorts, «قناة»، «اشترك»، «شارك»، «استكشف»، «المجتمع»، «صنّاع المحتوى». Avoid «دروس، محاضرات، مكتبة، العلم النافع، واصل التعلّم» when describing the platform.
   - Yes: «شاهد وشارك واستكشف المجتمع»
   - No: «العلم النافع، في متناول يدك»
8. **Say what is there and what to do next.** Empty states name what will appear and how to add it; intros are one sentence.
   - Yes: "Save videos to watch later and they will appear here."

## Where texts live

- Repo strings: each repo's i18n files (en and ar with the same keys). Each repo's CLAUDE.md carries a short form of these rules.
- www hero, tagline, About and list intros: edited in the CMS by editors. `AlUmmahNowUI/src/content/fallback/` holds the copy shown when the CMS is unreachable and must match.

## Open owner decisions (2026-11-13)

- **"Library" → "You" / «أنت»** for the videos site's personal hub: not approved yet; mockups are on the review page.
- **www tagline**: being rewritten without the word "Islamic"; options are on the review page.
