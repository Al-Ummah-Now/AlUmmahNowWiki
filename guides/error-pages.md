[← Home](../README.md)

# Error pages

Every Al Ummah Now app shows the same error pages: one family for **404** (page not found), **410** (removed content), **500** (server error), **503** (temporarily unavailable) and a crashed page. Proposed 2026-11-19 (PRs below, held for the owner's screenshots).

## What a visitor sees

One **solid card with a gold edge and glow** on the lantern street, inside the app's own header and footer, in Light and Dark, English and Arabic (right to left). The street never shows through the card (owner, 2026-11-22). The header is the shared header with the theme's own material in every app: Fawanees is a gradient with a gold underline.

```
┌──────────────────────────────────────────────┐
│ [badge]  Error 404                           │
│          Page not found                      │
│ We couldn’t find this page. The link may be  │
│ wrong, or the page may have moved.           │
│ [ Search Al Ummah Now ............ ][Search] │  404/410, where the app has a search
│ ┌ Reference  ERR-XXXX-XXXX   Copy reference ┐│  500/503/crash, where a reference exists
│ └ Quote this reference if you contact us…   ┘│
│──────────────────────────────────────────────│
│ Still stuck? Contact us [Go back] [Home page]│  main action last, filled (gold)
└──────────────────────────────────────────────┘
```

- **Badge**: a filled square in the theme's primary colour with the screen's icon (compass for 404, a crossed-out page for 410, a warning sign for 500/503/crash). Icons are the same lucide shapes in every repo (`ERROR_PAGE_ICONS`).
- **Code line**: "Error 404" / «خطأ ٤٠٤», with Eastern Arabic digits in Arabic ([Numbers and dates](numbers-and-dates.md)). Client-only screens (offline, new version, session ended) have no code.
- **Actions**: the family's own buttons (`.ep-btn-primary` / `.ep-btn-secondary` in the shared sheet), never an app's button classes, so the gold, the 44px pill shape, the height and the type (the page's own font, 15px/600) are the same in every app. The main action is filled and sits at the end edge; the others are outlined. On a phone they stack full width, main action on top.
  - 404 and 410: **Go back** (only when there is history) and **Home page** (main), plus **Search** above them (videos site and www, which have a site search).
  - 500, 503 and a crashed page: **Home page** and **Try again** (main: the boundary's reset, or the same page; always a path on the app's own origin), and the **reference** with a copy button (videos, admin, Auth and www). Every app shows the same ERR-XXXX-XXXX format; www logs its reference with the request's `cf-ray`, the page's kind and its path. On a phone, Copy reference sits on its own line under the reference, starting where the label starts. No Go back.
  - The help line and the buttons share one row on desktop, in both languages. The card is 640px wide, so «ما زلت تواجه المشكلة؟ تواصل معنا» stays on one line beside the widest pair («حاول مرة أخرى» and «الصفحة الرئيسية»). In a narrower window the line wraps inside its own space, balanced, so it never sits alone above the buttons.
  - An app's own page-title plate (the Fawanees street plate) never applies inside the card: the card is already a solid surface.
  - **Still stuck? Contact us** links to the videos site's Contact us (www's `/contact` redirects there), with `?ref=` when there is a reference.
- **Words**: balanced lines (`text-wrap: balance` on the title, body, help line and reference hint, and a no-break space before the last word where a line could still end on it), so a heading or sentence never ends on one lone word. "Al Ummah Now" is kept on one line (no-break spaces).
- **Sentences**: the body is drawn one sentence per span (`.ep-s`, an inline block; `errorBodySentences` / `errorBodyHtml` in shared-types, the same split in UI, Auth and the CMS). Two sentences share a line only when both fit, so no line ends on the opening words of the next one («… الصفحة. ربما», “… a problem. Try”). The 410 rewrite writes the same spans.
- **Never**: a stack trace, a raw error message, a framework URL, a timestamp, or a pulsing/animated illustration.

## Words

Shared copy, the same in every app (canonical: `ERROR_SCREEN_STRINGS` in AlUmmahNow `packages/shared-types/src/error-reporting/i18n.ts`; the other repos keep a copy).

| Screen | English | Arabic |
|---|---|---|
| 404 | **Page not found** — We couldn’t find this page. The link may be wrong, or the page may have moved. | **الصفحة غير موجودة** — لم نعثر على هذه الصفحة. ربما الرابط غير صحيح أو نُقلت الصفحة. |
| 410 | **This was removed** — It’s no longer on Al Ummah Now. Search for something else, or go to the home page. | **حُذف هذا المحتوى** — لم يعد موجودًا على الأمة الآن. ابحث عن شيء آخر أو انتقل إلى الصفحة الرئيسية. |
| 500 | **We could not load this page** — Our server had a problem with this request. It has been reported. Please try again in a moment. (Every app records the failure with the reference the card shows: the Errors page on videos and admin, the Worker log with the Cloudflare Ray ID on www and Auth.) | **تعذّر تحميل هذه الصفحة** — واجه الخادم مشكلة في هذا الطلب، وقد أُبلغ عنها. يُرجى المحاولة بعد قليل. |
| 503 | **We’ll be back shortly** — Our server is not responding right now. Try again in a few minutes. (The same words on the videos site, admin, www and scholar sites. Auth: **Sign-in is temporarily unavailable**; CMS: **The CMS is temporarily unavailable**: those two say which service is down.) | **سنعود بعد قليل** — الخادم لا يستجيب حاليًا. حاول مرة أخرى بعد دقائق. (Auth: «تسجيل الدخول غير متاح مؤقتًا»؛ CMS: «نظام إدارة المحتوى غير متاح مؤقتًا») |
| Crash | **Something went wrong** — This part of the page ran into a problem. Try again, and if it keeps happening, let us know. | **حدث خطأ ما** — واجه هذا الجزء من الصفحة مشكلة… |
| Actions | Home page, Go back, Search, Try again, Copy reference, Still stuck? Contact us | الصفحة الرئيسية، رجوع، بحث، حاول مرة أخرى، انسخ الرقم المرجعي، ما زلت تواجه المشكلة؟ تواصل معنا |
| Tab title | {title} \| Al Ummah Now (every app, e.g. "Page not found \| Al Ummah Now") | {title} \| الأمة الآن |

Tone follows the [Copy Tone Guide](copy-tone.md): plain, no hype, «مرئي/مرئيات» for video. Apostrophes are curly (’). The reference code (ERR-XXXX-XXXX) is an exact value: it stays in Latin letters in Arabic, inside an LTR isolate.

## Status codes and SEO

- The page keeps the real status: 404, 410, 500, 503 (with `Retry-After`).
- Every error page is **noindex, nofollow**, with exactly one robots meta. www, scholar sites, Auth and the CMS send `<meta name="robots" content="noindex, nofollow">`. On the videos site and admin (Next.js), the one meta is Next's own `noindex`, which Next adds to every 4xx/5xx page, and `X-Robots-Tag: noindex, nofollow` carries the rest; search engines combine the two. The error routes set no robots of their own (`notFoundMetadata`), and the Workers drop any extra robots meta but never rewrite the one they keep: React adopts a server meta on hydration only when its content is unchanged, so a rewritten one gets a second `noindex` beside it. The videos site's sign-in failed page (`/auth/error`) is noindex too. Error pages have no canonical or hreflang.
- **410 Gone** (decision D-SEO-4, [AUN-SEO](../epics/AUN-SEO-search-visibility.md)): a deleted video, Short, playlist or channel is 404 during its 30-day restore window and 410 once purged. The videos Worker (`apps/web/src/lib/seo/gone.ts`) turns the 404 into a 410 and, with `HTMLRewriter`, rewrites the one card's badge icon, code line, title, body and tab title to the 410 words (the page has a single heading block; there is no hidden second block). www has no 410: D-SEO-4 covers videos content only, and www pages that go away are redirected or 404.
- **Tab title on the videos site and admin**: the error card sets it for as long as it is up (`useErrorTabTitle`), on any route and for every kind, and sets it again if the route's metadata title streams in later. When the card goes (Try again, navigation), the route's title comes back. A content route's 404 (missing video, playlist, channel, profile, post) carries the 404 page's title in its server HTML too.
- **503**: the videos Worker's 503 (`unavailable.ts`) tells the page its status (`window.__aunHttpStatus`), so the card shows **We’ll be back shortly** rather than the 500 words.

## Accessibility

- One `h1` per page (the dev site's bilingual 404: English `h1`, Arabic `h2`); the card is a `section` labelled by its heading. Auth's sign-in card wordmark (an `h1`) is not drawn on its error pages: the header carries the brand.
- Crash and 500 screens are `role="alert"`; 404/410 are a plain page.
- No animation at all (nothing to reduce), and no transparency: the card is solid, so nothing changes with `prefers-reduced-transparency`.
- axe WCAG 2.2 AA clean in every app, en and ar, Light and Dark (checked in the review frames and the apps' E2E).

## Where it lives

| App | Pages | Code |
|---|---|---|
| Videos site | 404/410 (`app/not-found.tsx`, `[locale]/not-found.tsx`), crash/500 (`[locale]/error.tsx`, upload, live, `global-error.tsx`), sign-in failed (`/[locale]/auth/error`) | `components/errors/ErrorScreen.tsx`; `NotFoundPage`, `FriendlyError` and `AuthErrorPage` use it |
| Admin | `not-found.tsx`, `error.tsx`, `(protected)/error.tsx`, `global-error.tsx` | `components/FriendlyError.tsx`; the signed-out 404 uses `PublicShell top`, so the card sits at the top on phones like every other app's |
| www | `404.astro`, `500.astro`, CMS-unavailable pages | `components/ErrorView.astro` → `packages/render/src/error-page.ts` |
| Scholar sites | `404.astro` (pages, posts and videos that are not there rewrite to it) | same renderer, in the site's own theme (Nahas has no lantern street by design: [Theming](theming.md) "A theme without a street compiles `--fanous-street-on: 0`", and its check "that other themes draw no street"; only Fawanees draws the street) |
| Dev site | `404.astro` (both languages: the address has no language) | same renderer |
| Auth | 500/503 (`ui/error-page.ts`), 404 for unknown pages opened in a browser | the family card itself on Auth's themed page, with the shared header. The lantern street is the sign-in pages' tile street (AlUmmahNowAuth#383): the server's variant on `<html>` |
| CMS | 404, 500 (`renderErrorStatus`) | `admin/ui/gate.tsx` family variant |

**The card's sheet** is one file: AlUmmahNow `packages/fanous-tokens/errors/aun-error-page.css`, used as is by the videos site and admin and vendored byte for byte by UI (`packages/render/src/styles/aun-error-page.css`) and the CMS (`src/admin/theme/error-page-css.vendored.ts`). `--fanous-*` tokens only. The card's surface is one solid colour worked out from the page's background with relative colour syntax: dark pages are lifted 11.9% toward white, light pages get 80% white (Fawanees: #263139 dark, #fdfcfa light, the same as the videos site's cards). Browsers without relative colours use the theme's surface. No `backdrop-filter`. Auth vendors it too (`apps/auth/src/ui/error-page-css.vendored.ts`) and draws the family card itself, not its sign-in card.

## PRs

- [AlUmmahNow#1641](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1641): videos site + admin + shared copy and sheet
- [AlUmmahNowUI#133](https://github.com/Al-Ummah-Now/AlUmmahNowUI/pull/133): www, scholar sites, dev site
- [AlUmmahNowAuth#443](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/443): Auth 500/503/404
- [AlUmmahNowCMS#148](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/pull/148): CMS 404/500

Review frames: `review-shots/error-pages/` (en/ar, Light/Dark, desktop 1280×800 and phone 390×844 at 2x).
