[← Home](../README.md)

# Numbers and dates

Owner decision [O35](../epics/decisions.md#o35-arabic-uses-eastern-arabic-hindi-numerals) (2026-11-15). Words used here: **Arabic numerals** are 0–9; **Eastern Arabic (Hindi) numerals** are ٠–٩. Never call 0–9 "Latin".

## The rule

- Arabic pages and emails show ٠–٩ for every number people read: counts, dates, times, durations, percentages and money. English shows 0–9.
- The numbering system is always explicit. Plain `ar` gives 0–9 in Node and Chromium but ٠–٩ in WebKit, so a page rendered on the server and hydrated in Safari disagreed (React #418, AlUmmahNow#1473). Arabic always formats as `ar-u-nu-arab`; English as `en-u-nu-latn`.
- **Money in Arabic** uses the currency's Arabic name: «١٢٫٦٩ دولار أمريكي» (`currencyDisplay: 'name'`). Never «US$» or «$US» inside Arabic text. English stays `$12.69`.
- **No hard-coded digits in messages**, in either language. A number in a message is a placeholder the formatter fills: a named one (`{days}`), or one written in the message itself: `{#30}` → «٣٠» / "30", `{#50%}` → «٥٠٪» / "50%", `{$0.011}` → money. In Arabic, `%` after a placeholder is written `٪`.
- **Left as written:** code, ids, URLs, slugs, versions (1.4.0), file names, header names, product names (R2, D1, SHA-256), JSON and config examples, status and exit codes, and machine data (JSON-LD, API fields).
- **Typed numbers** stay as typed in the field. Every parse accepts both systems: ٠–٩ (and Persian ۰–۹) become 0–9, «٫» is the decimal mark and «٬» is dropped.
- Charts use the same formatter, so a chart and the text beside it agree.

## For builders (AlUmmahNow)

- Use `@al-ummah/shared-types` `locale-format`: `formatNumber`, `formatInteger`, `formatFixed` (instead of `toFixed` on screen), `formatCompact`, `formatPercent`, `formatMoney` / `moneyFormat`, `formatUnit`, `formatBytes`, `formatDate`, `formatTime`, `formatDateTime`, `formatRelativeTime`, `formatTimeAgo`, `formatClock`, `formatDurationWords`, `pluralCategory`, `fillTemplate`, `localizeDigits` (a pre-built numeric label), `parseDigits` / `parseLocaleNumber` (typed input). The cached `numberFormat` / `dateTimeFormat` / `relativeTimeFormat` give an `Intl` object when a component needs one.
- Never call `new Intl.NumberFormat(...)`, `toLocaleString(...)` and similar directly, and never write `ar-SA`, `ar-EG`, `nu-latn` or `style: 'currency'` outside the formatter. `pnpm check:locale-format` (Release checks) fails on new ones; `scripts/ci/locale-format-baseline.txt` lists files not yet moved and can only shrink. A line that formats for a machine (time-zone maths) says so with `// locale-format: machine`.
- Tests: Arabic output has no 0–9 in formatted values (admin `test/arabic-numerals.test.ts`, shared-types `test/locale-format.test.ts`); the WebKit hydration specs load Arabic pages and fail on React #418/#423/#425.
- Native apps follow the same rule with their own single formatter.

## For builders (AlUmmahNowUI, AlUmmahNowCMS, AlUmmahNowAuth)

Each repo has one formatter with the same names, used on the server and in the browser:

| Repo | Formatter | Guard |
|---|---|---|
| AlUmmahNowUI (www, scholar sites, dev) | `packages/render/src/format.ts`; `fmt(template, vars, locale)` fills placeholders | `apps/www/tests/format-guard.test.ts`; `apps/www/e2e/arabic-digits.spec.ts` (WebKit via the iPhone project); a sites E2E |
| AlUmmahNowCMS | `src/lib/format.ts` (`src/admin/format.ts` wraps it) | format guard and admin render tests; Playwright WebKit test in the local E2E job |
| AlUmmahNowAuth (auth, profile, admin, emails) | `packages/ui/src/format.ts`; `clientFormatScript` for Profile's inline script | repo-wide guard and Arabic email/page tests; CI job "Arabic hydration (WebKit)" (`pnpm test:hydration`) |

- API: `intlLocale` (`ar-u-nu-arab`; English keeps the tag the page already used), `formatNumber`, `formatCompact`, `formatPercent`, `formatMoney` («١٬٢٣٤٫٥٠ دولار أمريكي» in Arabic), `formatDate`, `formatTime`, `formatDateTime`, `formatRelative`, `formatDuration`, `formatList`, `fill`, `toAsciiDigits` and `toAsciiNumber`.
- Each guard fails on `Intl.*` or `toLocale*String` outside the formatter, and on `ar-SA`, `ar-EG` or `nu-latn` in source.
- **Auth trap:** pinning `nu-arab` is not enough for hydration. WebKit and Node also differ in the spaces and joins inside dates: a no-break space in «٩:٣٠ ص», and "at" where Node uses ",". Auth's formatter uses one plain space and joins date and time itself.
- **Sign-in and passkey codes** are emailed in Arabic numerals 0–9, the digits the user types. A code typed in ٠–٩ (or ۰–۹) is normalised before it is checked.
- **Vendored code:** UI's and the CMS's `page-blocks.generated.ts` comes from the monorepo and still formats with plain `ar` until it is re-vendored after the monorepo fix. The guards skip `*.generated.*` files.
