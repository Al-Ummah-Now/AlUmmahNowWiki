[← Home](../README.md)

# Numbers and dates

Owner decisions [O35](../epics/decisions.md#o35-arabic-uses-eastern-arabic-hindi-numerals) (2026-11-15) and [O38](../epics/decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000) (2026-11-21). Words used here: **Arabic numerals** are 0–9; **Eastern Arabic (Hindi) numerals** are ٠–٩. Never call 0–9 "Latin".

## The rule

- Arabic pages and emails show ٠–٩ for every number people read: counts, dates, times, durations, percentages and money. English shows 0–9.
- The numbering system is always explicit. Plain `ar` gives 0–9 in Node and Chromium but ٠–٩ in WebKit, so a page rendered on the server and hydrated in Safari disagreed (React #418, AlUmmahNow#1473). Arabic always formats as `ar-u-nu-arab`; English as `en-u-nu-latn`.
- **Arabic numbers are never grouped** ([O38](../epics/decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000), replacing «٬»): «٤٨٨٧», «١٢٣٤٫٥», «٥٠٦٢٫٦ س». «٫» is the only mark inside an Arabic number; no «٬» and no space between digits. «٬» and «٫» look alike in most Arabic UI fonts, so «١٥٬٤١٩٫٩» read as 15,419,9. English keeps "4,887". The formatter turns grouping off for Arabic whatever the caller passes.
- **Counts are compact from 1,000 on** (view and subscriber counts, stat tiles, chart ticks, cards), cut to one decimal and never rounded up: "4.8K" / «٤٫٨ ألف». Under 1,000 stays full. Arabic thousands and billions agree with the number shown («ألف مشاهدة», «ألفا مشاهدة», «٣ آلاف مشاهدة», «١٫٣ ألف مشاهدة»; «مليار / ملياران / ٣ مليارات»); millions are always «{n} م» («١ م», «١٫٢ م مشاهدة»). Standing alone (tile, chart tick), a whole number ending in 11–99 takes the accusative: «١٢ ألفًا», «١٢٠ ألفًا», «١٢ مليارًا»; before a noun it stays «١٢ ألف مشاهدة»; 100 and decimals stay «١٠٠ ألف», «١١٫٥ ألف». English: "1.2M views".
- **Separators between values:** Arabic uses the Arabic comma, never a dot («·» or « • » next to Arabic digits reads as zero): «الأمة الآن، ٣ م مشاهدة». English keeps " · " / " • ". Use `metaSeparator(locale)` / `joinMeta(locale, parts)` (shared-types); for a row of elements the web `<MetaSep lang gap />` and admin `<Sep />`; admin messages `t('common.sep')`.
- **Exact stays exact** (ungrouped in Arabic): analytics table cells, admin list columns, watch-time hours, money, file sizes, small notices and screen-reader labels. Full table with examples: [O38](../epics/decisions.md#o38-numbers-never-grouped-in-arabic-counts-compact-from-1000).
- **Money in Arabic** uses the currency's Arabic name: «١٢٫٦٩ دولار أمريكي» (`currencyDisplay: 'name'`). Never «US$» or «$US» inside Arabic text. English stays `$12.69`.
- **No hard-coded digits in messages**, in either language. A number in a message is a placeholder the formatter fills: a named one (`{days}`), or one written in the message itself: `{#30}` → «٣٠» / "30", `{#50%}` → «٥٠٪» / "50%", `{$0.011}` → money. In Arabic, `%` after a placeholder is written `٪`.
- **Left as written:** code, ids, URLs, slugs, versions (1.4.0), file names, header names, product names (R2, D1, SHA-256), JSON and config examples, status and exit codes, and machine data (JSON-LD, API fields).
- **Typed numbers** stay as typed in the field. Every parse accepts both systems: ٠–٩ (and Persian ۰–۹) become 0–9, «٫» is the decimal mark and «٬» (or a space between digits) is dropped.
- Charts use the same formatter, so a chart and the text beside it agree.
- **Clocks** (video times, durations, timestamps) read left to right in Arabic too: «١:٠٢:٠٥», and in the player «٠:٢٢ / ١:٣٠», current time before duration. The element showing a clock is `dir="ltr"` or isolated (`unicode-bidi: isolate`). Quality names (`720p`) stay as written.

## For builders (AlUmmahNow)

- Use `@al-ummah/shared-types` `locale-format`: `formatNumber`, `formatInteger`, `formatFixed` (instead of `toFixed` on screen), `formatCompact`, `formatPercent`, `formatMoney` / `moneyFormat`, `formatUnit`, `formatBytes`, `formatDate`, `formatTime`, `formatDateTime`, `formatRelativeTime`, `formatTimeAgo`, `formatClock`, `formatDurationWords`, `pluralCategory`, `fillTemplate`, `localizeDigits` (a pre-built numeric label), `parseDigits` / `parseLocaleNumber` (typed input). The cached `numberFormat` / `dateTimeFormat` / `relativeTimeFormat` give an `Intl` object when a component needs one.
- **Video player:** every time it shows goes through `apps/web/src/lib/video/player-time.ts` with the page locale: `formatPlayerTime` (whole seconds, as Video.js), `formatBehindLive`, `formatSeekStep` («+١٠ ث» / "+10s"), `formatPlaybackRate`, `formatLevel`. Video.js's own times (current time, duration, seek-bar value text) use `videojsTimeFormatter`, installed by `createVideoPlayer` for the page's language; English output is exactly Video.js's default.
- Never build a clock by hand (`${m}:${String(s).padStart(2, '0')}`): use `formatClock`. The guard fails on one; WebVTT cue times and other machine text say `// locale-format: machine`.
- Never call `new Intl.NumberFormat(...)`, `toLocaleString(...)` and similar directly, and never write `ar-SA`, `ar-EG`, `nu-latn` or `style: 'currency'` outside the formatter. `pnpm check:locale-format` (Release checks) fails on new ones; `scripts/ci/locale-format-baseline.txt` lists files not yet moved and can only shrink. A line that formats for a machine (time-zone maths) says so with `// locale-format: machine`.
- Tests: Arabic output has no 0–9 in formatted values and no grouping (shared-types `test/locale-format.test.ts` pins «٤٨٨٧», «١٢٣٤٫٥» and "4,887") (admin `test/arabic-numerals.test.ts`, shared-types `test/locale-format.test.ts`); the WebKit hydration specs load Arabic pages and fail on React #418/#423/#425.
- Native apps follow the same rule with their own single formatter.

## For builders (AlUmmahNowUI, AlUmmahNowCMS, AlUmmahNowAuth)

Each repo has one formatter with the same names, used on the server and in the browser:

| Repo | Formatter | Guard |
|---|---|---|
| AlUmmahNowUI (www, scholar sites, dev) | `packages/render/src/format.ts`; `fmt(template, vars, locale)` fills placeholders | `apps/www/tests/format-guard.test.ts`; `apps/www/e2e/arabic-digits.spec.ts` (WebKit via the iPhone project); a sites E2E |
| AlUmmahNowCMS | `src/lib/format.ts` (`src/admin/format.ts` wraps it) | format guard and admin render tests; Playwright WebKit test in the local E2E job |
| AlUmmahNowAuth (auth, profile, admin, emails) | `packages/ui/src/format.ts`; `clientFormatScript` for Profile's inline script | repo-wide guard and Arabic email/page tests; CI job "Arabic hydration (WebKit)" (`pnpm test:hydration`) |

- API: `intlLocale` (`ar-u-nu-arab`; English keeps the tag the page already used), `formatNumber`, `formatCompact`, `formatPercent`, `formatMoney` («١٢٣٤٫٥٠ دولار أمريكي» in Arabic, never grouped), `formatDate`, `formatTime`, `formatDateTime`, `formatRelative`, `formatDuration`, `formatList`, `fill`, `toAsciiDigits` and `toAsciiNumber`.
- Each guard fails on `Intl.*` or `toLocale*String` outside the formatter, and on `ar-SA`, `ar-EG` or `nu-latn` in source.
- **Auth trap:** pinning `nu-arab` is not enough for hydration. WebKit and Node also differ in the spaces and joins inside dates: a no-break space in «٩:٣٠ ص», and "at" where Node uses ",". Auth's formatter uses one plain space and joins date and time itself.
- **Sign-in and passkey codes** are emailed in Arabic numerals 0–9, the digits the user types. A code typed in ٠–٩ (or ۰–۹) is normalised before it is checked.
- **Vendored code:** UI's and the CMS's `page-blocks.generated.ts` comes from the monorepo and still formats with plain `ar` until it is re-vendored after the monorepo fix. The guards skip `*.generated.*` files.
