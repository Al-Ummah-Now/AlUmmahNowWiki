# CARDS · Community image cards

**Status:** Building

Creators can publish a designed card from one Quran verse, a قاف passage, or a short original message. The Studio community composer and the scholar CMS both publish through Videos. The community post shows the image, the complete text, and its citation. The image carries the same text and source in its alternative text.

## Layout

Quran.com shows how to give a verse a strong visual focus while keeping its original reading order. Canva’s quote cards and size guide inform the 1080 × 1080 and 1080 × 1350 canvases. [Quran.com](https://quran.com/product-updates) · [Canva quote templates](https://www.canva.com/templates/s/quote/) · [Canva size guide](https://www.canva.com/sizes/instagram/)

- **Fawanees:** Night blue, warm gold, a pointed arch enclosing the text, and a lantern-inspired ornament above a separate citation band.
- **Folio:** A warm manuscript surface, a vertical marginal rule aligned to the reading direction, and a contrasting colophon below the text.
- **Editorial:** A bold split background with a narrow source column and directional alignment that reverses for Arabic. The square version gives the source its own bottom band for long passages.

Each composition offers prescribed palettes and both aspect ratios. Use script-aware shaping and the Unicode bidirectional algorithm, wrap mixed-language runs, and fit the entire passage and citation before rendering. Measure line boxes including vowel marks. Use Amiri for Arabic and Source Serif 4 for Latin. Both use the SIL Open Font License 1.1. Ship their license notices with any bundled font. [Amiri](https://github.com/aliftype/amiri/blob/main/OFL.txt) · [Source Serif](https://github.com/adobe-fonts/source-serif/blob/release/LICENSE.md)

## Content and storage

Check the acting user’s creator tier and the Videos channel’s post management permission on the server. Pass original messages through post moderation. Resolve Qaf passages from server-side IDs and carry all citation entries in order, including repeated volumes.

Persist Quran keys and layout selections. Fetch whole ayat byte-for-byte from the current Content Sync copy. Hydrate the body and alt text from the current copy. Render Quran images into private R2 cache entries scoped by sync version and expire and physically delete them within seven days. Serve Quran images through the application so it can stop serving expired or superseded versions. Show Quran Foundation attribution on the image and link the source in the post. [QF1](decisions.md#qf1-quran-foundation-content-use) · [Developer terms](https://api-docs.quran.foundation/legal/developer-terms/)

## Delivery

Use queue retries with backoff, a dead-letter queue, and a stable card ID for image storage and post publication. Show failed render jobs, reasons, and logs in Videos Admin Errors and let operators retry them. Verify the complete flow in local or QA environments.

Use existing Workers, Queues and R2 without a paid AI or rendering API. Incremental costs depend on render CPU, image sizes, retention, queue operations and read volume. Measure those on QA before recording a monthly estimate.

## QA setup and cost

Track delivery in [AUN-830](https://linear.app/hamzalabs/issue/AUN-830/cards-community-image-cards). Videos uses its existing admin job queue, with the same retry budget, dead-letter routing and operator retry as other Videos jobs. Card PNGs and bundled font assets use private R2. The browser capture adapter uses Browser Run's Chromium screenshot endpoint, which supports shaping and mixed-direction text without any AI service.

Before enabling in QA, configure `CARD_RENDER_ACCOUNT`, a secret `CARD_RENDER_TOKEN` scoped to Browser Rendering, and `CARD_PUBLIC_ORIGIN` for the QA Videos API. Put the two licensed WOFF2 assets from Videos Web in the QA private media bucket under `cards/fonts/`, and set R2 lifecycle expiry on `cards/quran/` to six days. Verify deletion on QA before serving Quran card images. Include the OFL notices already linked above when copying the fonts. Leave production bindings untouched.

At 10,000 captures per month, including previews that are actually published and sync-version refreshes, two seconds per capture is 5.6 Browser Run hours. If the account has already used its included browser hours, those captures cost about $0.50. With 250 KiB per image, a month's new images add about 2.6 GB, or $0.04 per month at R2 Standard storage rates. Retained original and Qaf images accumulate month to month. One million image reads and 10,000 image writes add about $0.41 before free allowances, with Workers, D1 and queue overhead on the existing plan. Budget roughly $1 per month at this volume and measure actual capture duration, stored bytes, and traffic on QA. [Browser Run pricing](https://developers.cloudflare.com/browser-run/pricing/) · [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
