[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# alummahnow.dev: the project site for developers and partners

| | |
|---|---|
| **ID** | `AUN-DEV-SITE` |
| **Owning repos** | [AlUmmahNowUI](../repos/AlUmmahNowUI.md) (new app `apps/dev`) |
| **Status** | **in progress**: spec in this page; site in an AlUmmahNowUI PR held for the owner's screenshots |
| **Last updated** | 2026-11-14 |
| **Origin** | Owner request, 2026-11-14 (chat) |

## The owner's words

> "about the project, an islamic video sharing community, place to share news without censorship, to interact, get educated, and about the technical site and the infra for video and idea of having this as a waqf or charity org"

Everything on the site comes from three sources only: the code on each repo's `main`, this wiki, and the owner's words. No user counts, revenue, valuations, prices, growth figures or dates that are not already in the code or the wiki. Plans are written as plans ("we plan", "we are exploring"), and anything not shipped says so.

## Audiences

| Audience | What they come for | Where they go first |
|---|---|---|
| **Developers and contributors** | How the system is built, which repo does what, how to run and change it, how to report a security problem | Technology, Infrastructure, Open source |
| **Investors, donors and partners** | What the project is for, what exists today, how it is run and paid for, the waqf / charity direction, how to get in touch | Home, Community, Waqf, Contact |

One site serves both. Every page opens with a plain summary a non-technical reader can follow, then goes deeper for developers.

## Page map

Every page exists in English at `/en/…` and in Arabic at `/ar/…` (full RTL). `/` redirects to `/en/` (302).

| Page | Path | Contents | Sources |
|---|---|---|---|
| **Home** | `/{l}/` | The mission in one line; the four parts of the community (share videos, share news without censorship, interact, learn); what is live today (www, videos, scholar sites); one picture of the system; the waqf direction; links to the other pages | Owner's words; [README](../README.md); [Environments](../guides/environments.md) |
| **The community** | `/{l}/community/` | Video sharing (channels, Shorts, live, posts, playlists, comments, subscriptions, embeds); news without censorship and how moderation actually works (Community Guidelines, reports, AI that only holds and never deletes, humans decide, zero tolerance for CSAM); interaction; learning from what channels share; English and Arabic; invite-only uploads | Owner's words; [E06](E06-community-moderation.md); [E28](E28-ai-moderation.md); [AUN-VIDEO-REVIEW](AUN-VIDEO-REVIEW-pre-publication-review.md); [O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers); [Copy tone](../guides/copy-tone.md) |
| **Technology** | `/{l}/technology/` | The apps and what each runs on: Cloudflare Workers everywhere, Next.js videos site, Astro public sites, the OpenAuth fork for SSO and passkeys, bknd CMS under our own admin, native apps on a shared Rust core, the Fanous design system; status per item | [README](../README.md); [Authentication](../guides/authentication.md); [AUTH-PASSKEYS](AUTH-PASSKEYS-passkeys-everywhere.md); [AlUmmahNowCMS](../repos/AlUmmahNowCMS.md); [AlUmmahNowCore](../repos/AlUmmahNowCore.md); [Theming](../guides/theming.md) |
| **Infrastructure and video pipeline** | `/{l}/infrastructure/` | Upload → our original → Bunny Stream and our own FFmpeg transcode on Cloudflare Containers into R2 → the API chooses one play URL → fallback; signed URLs; live on two providers; environments (QA, stage, production); releases (tags, stage gate, 0% → 100%, auto-rollback); cost discipline; status page | [Video delivery](../guides/video-delivery.md); [D2](D2-video-delivery.md); [D3](D3-live-provider.md); [O31](decisions.md#o31-transcode-on-cloudflare-containers), [O32](decisions.md#o32-run-bunny-and-r2-side-by-side-before-switching); [Release process](../guides/release-process.md); [Status page](../guides/status-page.md); [O1](decisions.md#o1-whole-platform-cost-cap), [O26](decisions.md#o26-always-async-with-admin-visible-errors) |
| **Open source** | `/{l}/open-source/` | Every public repo with one line each; licence status stated as it is (see below); how to contribute (wiki contributing guide, spec → plan → implement); how to report a security problem privately | `gh repo list Al-Ummah-Now`; [Contributing](../guides/contributing.md); [LIC](decisions.md#lic-repo-licence-for-core-and-the-app-repos); each repo's `SECURITY.md` |
| **Waqf and charity** | `/{l}/waqf/` | The direction in the owner's words, as a plan: we are exploring running Al Ummah Now as a waqf or a charitable organisation; what that would mean (the platform held for the community's benefit, not for sale or profit); where things stand today (no legal entity exists, no monetisation at launch); what is still open; how to talk to us | Owner's words; [SM-4](decisions.md#sm-4-legal-entity); [D4](decisions.md#d4-monetisation) |
| **Contact** | `/{l}/contact/` | Who to contact for what: partnerships and donations → the platform's Contact form with the Partnership topic; general → the same form; code → GitHub issues; security → private vulnerability reports | [CHAT-CONTACT](CHAT-CONTACT-contact-us.md) |
| **404** | any unknown path | Plain not-found page in both languages with links home | — |

### Wording rules for this site

- **Owner's words win where they are explicit.** "News without censorship" and "get educated" are the owner's words for this site and appear as such. The [Copy Tone Guide](../guides/copy-tone.md) still applies everywhere else: the platform is described as content sharing (videos, Shorts, live, posts, channels), not as a lectures library, with no hype words, «مرئي / مرئيات» for video in Arabic.
- **"Without censorship" is paired with what moderation does.** The site never claims "anything goes". It says the community can share news freely within the law and the Community Guidelines, that AI moderation only holds content and never deletes it, that people decide, and that child sexual abuse material is removed and reported. This matches [E28](E28-ai-moderation.md) ("AI never deletes, only holds, and humans review") and AlUmmahNow `docs/specs/CSAM-RESPONSE.md`.
- **Status labels are real.** Each technical item carries *Live*, *Built, rolling out*, *In development* or *Planned*, taken from the wiki page it cites. Examples: passkeys are released in Auth, staff enforcement is built and off until the owner registers a passkey; native apps are in development with pre-releases on GitHub and none in a public store; captions are planned; AI moderation runs on QA in flag-only mode.
- **Licence.** The repos are public on GitHub. AlUmmahNowAuth and the openauth fork are MIT. The others have no licence file yet ([LIC](decisions.md#lic-repo-licence-for-core-and-the-app-repos) is open), so the site says "source available on GitHub; a licence has not been chosen yet for most repos" and never calls them open source under a licence they don't have. The page title "Open source" is kept for findability, with that line directly under it.
- **Waqf.** Always future or exploratory: "we plan", "we are exploring", "would". Never "Al Ummah Now is a waqf", "registered charity", "tax-deductible" or "donate now". No donation button and no payment flow: [D4](decisions.md#d4-monetisation) is "none at launch" and [SM-4](decisions.md#sm-4-legal-entity) records that no entity exists.
- **Costs.** No prices or totals. The site may say that the platform is built to a fixed monthly cost cap set by the owner ([O1](decisions.md#o1-whole-platform-cost-cap)) and that every cost line is measured on the admin Delivery and Operations pages, without quoting the figure.
- **No user, view or traffic numbers** anywhere.

## Content sources

| Content | Source of truth | How it reaches the site |
|---|---|---|
| Page copy (en + ar) | `apps/dev/src/i18n/en.ts` and `ar.ts` (same keys, a unit test checks they match) | Built into static HTML |
| Repo list | The org's public repos (`gh repo list Al-Ummah-Now`) and the org profile README | Written into `src/i18n` with one line each; checked by hand when a repo is added |
| Facts on Technology and Infrastructure | This wiki's guides and epics, each cited on the page by link | Written into `src/i18n`, with the wiki link next to the claim |
| Contact | The videos site's Contact form (`videos.alummahnow.net/{l}/contact?topic=partnership`), its admin inbox and mail queue ([CHAT-CONTACT](CHAT-CONTACT-contact-us.md)) | Links only. The dev site has no form, no data store and no cookies |

No CMS for v1: the copy changes rarely and goes through review as a PR, which also keeps it next to the facts it cites. Moving the copy into the CMS later is possible because every string is already keyed.

## Design

The brand is the Fanous lantern identity ([Theming](../guides/theming.md)), Fawanees tokens by default.

- **Tokens.** The site loads `packages/render/src/styles/fanous-themes.generated.css` and renders `data-theme="fawanees"`, so its colours are the same tokens as www, the scholar sites, the videos site and the CMS. Light and dark follow the shared rule: first visit follows the device, a **Light / Dark** toggle (never "System") saves the choice per device before first paint.
- **The memorable element.** The hero is a drawn lantern whose lattice is the eight-point star from the brand pattern, lit from inside. On Infrastructure, the video pipeline is drawn as a string of lanterns on a cable, one per stage, so the system diagram is the lantern street rather than a generic box chart.
- **Depth.** Night-blue surfaces stepped by elevation, gold hairline borders that brighten on the raised surface, radial gold light behind the hero, and a faint star lattice in section backgrounds. Card radius varies by hierarchy (section panels, then items, then chips) rather than one radius everywhere.
- **Type.** Arabic in Noto Naskh Arabic (self-hosted, as on www). Latin display in the platform's Old Style serif stack (`Iowan Old Style`, Palatino, Georgia) and body in the system sans stack, the same pairing www uses.
- **Reference patterns.** Kinds of project site that serve both engineers and funders: an infrastructure company's architecture-diagram-as-hero pages, a non-profit messaging app's plain "how we are funded" page, an encyclopedia foundation's "how the money is used" layout, and open-source framework homes that put the repo list and contribution path one click from the top. What we take: one plain promise at the top, a real system diagram, explicit status labels, and a funding page that says what is and is not true today. What we avoid: stat counters, logo walls, testimonials and "trusted by" rows, which we have no facts for.
- **Bilingual.** Both languages have the same structure. Arabic is not a mirrored copy: diagrams flow right-to-left, lantern cables hang from the right, numerals stay Western in code-like labels only.
- **Quality floor.** Keyboard focus visible on every control, reduced motion stops the lantern flicker, axe clean in both languages and both modes, WCAG 2.1 AA contrast from the shared tokens, no horizontal scroll at 320 px.

## Hosting

| | |
|---|---|
| **Where** | A new app `apps/dev` in [AlUmmahNowUI](../repos/AlUmmahNowUI.md), beside `apps/www` and `apps/sites`, importing the Fanous theme CSS from `packages/render`. It needs nothing else from the repo, which is why it is a sibling app and not part of www. |
| **How** | Astro `output: 'static'`. Deployed as **Cloudflare Workers static assets with no Worker script** (`wrangler.jsonc` has no `main`). No code runs on a request, the site has no bindings, vars or secrets, and an idle site costs nothing. Requests to static assets are not billed as Worker invocations. |
| **Hostnames** | Production `alummahnow.dev`; stage `stage.alummahnow.dev`; QA `qa.alummahnow.dev`. Custom domains attached by each deploy. `www.alummahnow.dev` is a Cloudflare Redirect Rule to the apex (owner step). |
| **Per environment** | The HTML is the same everywhere and its canonical links always name production. Only `robots.txt` and `_headers` differ: QA and stage send `X-Robots-Tag: noindex, nofollow` and `Disallow: /`. The release builds once and writes those two files per environment. |
| **Pipeline** | Same shape as the other UI apps: CI on every PR (lint, typecheck, unit, config check, build, Playwright with axe against `wrangler dev`); every push to `main` deploys QA and smokes it; a `vYYYY.MM.DD[.N]` tag on `main` releases stage → smoke → production → smoke, with `wrangler rollback` if the production smoke fails. Its jobs are separate from www's and the sites Worker's, so a dev-site failure never blocks or rolls back the others. |
| **Zone** | Each deploy first checks, read-only, that `alummahnow.dev` is an active zone on the account and that the release token can attach custom domains there. Until it is, the deploy steps skip with a notice instead of failing. The owner steps are in `apps/dev/docs/DOMAIN.md` and the PR. |
| **Security headers** | Strict CSP (`default-src 'none'`, scripts, styles, fonts and images from the site's own origin only, `form-action 'none'`, `frame-ancestors 'none'`), `nosniff`, HSTS, a narrow Permissions-Policy. No cookies. |
| **SEO** | Canonical and `hreflang` (en, ar, x-default → en) on every page, `sitemap.xml` with both languages, `robots.txt` per environment, Open Graph and Twitter cards, `Organization` and `WebSite` JSON-LD with only facts (name, URL, logo, the GitHub org). |

## Decisions

| ID | Decision | Status |
|---|---|---|
| DS-1 | One site for developers and partners, not two | proposed (this spec) |
| DS-2 | Static Astro app `apps/dev` in AlUmmahNowUI on Workers static assets, no Worker script | proposed |
| DS-3 | No CMS in v1; copy in `src/i18n` reviewed by PR | proposed |
| DS-4 | Contact links to the videos site's Contact form (Partnership topic); no new form or store | proposed |
| DS-5 | No donation button or payment flow until a legal entity exists and the owner decides | proposed, follows D4 and SM-4 |
| DS-6 | "Open source" page states the licence status as it is | proposed, follows LIC |

## Not in scope

Donations or payments, a blog or news feed on this site, analytics or cookies, a newsletter sign-up, investor documents (decks, financials). The owner can ask for any of these; none is implied by this spec.
