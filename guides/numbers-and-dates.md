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
- Other repos (UI, CMS, Auth, native) follow the same rule with their own single formatter.
