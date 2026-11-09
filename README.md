# Al Ummah Now Wiki

Al Ummah Now (الأمة الآن) is an Islamic video and community platform, available in English and Arabic (RTL throughout). It has a public website, a video site, a single sign-on service, a content management system and native apps for phones, TVs and desktops.

This wiki explains how the [Al-Ummah-Now](https://github.com/Al-Ummah-Now) repositories fit together. It links to the source instead of copying it. If a page and the code disagree, the code wins, and a fix to the page is welcome.

Facts here were read from each repo's default branch on 2026-11-09. "Current state" sections are snapshots from that date. Anything that couldn't be confirmed is marked **Unverified**.

## Index

**Repositories**

| Page | What it is |
|---|---|
| [AlUmmahNow](repos/AlUmmahNow.md) | Monorepo: videos web, APIs, processor, realtime, scheduler, admin |
| [AlUmmahNowAuth](repos/AlUmmahNowAuth.md) | SSO provider, account profile, auth admin, audit consumer |
| [openauth](repos/openauth.md) | Fork of OpenAuth used by the auth service |
| [AlUmmahNowUI](repos/AlUmmahNowUI.md) | Public website (www) |
| [AlUmmahNowCMS](repos/AlUmmahNowCMS.md) | Staff content admin for www |
| [AlUmmahNowCore](repos/AlUmmahNowCore.md) | Shared Rust core for the native apps |
| [AlUmmahNowApple](repos/AlUmmahNowApple.md) | iOS, iPadOS, tvOS and macOS apps |
| [AlUmmahNowAndroid](repos/AlUmmahNowAndroid.md) | Android phone, tablet, TV, Fire TV and Auto apps |
| [AlUmmahNowDesktop](repos/AlUmmahNowDesktop.md) | Windows, Linux and Samsung Tizen apps |
| [AlUmmahNowTools](repos/AlUmmahNowTools.md) | Bulk video importer and related .NET tools |

**Guides**

| Page | Covers |
|---|---|
| [Environments and domains](guides/environments.md) | QA, stage and production hostnames |
| [Release process](guides/release-process.md) | How each repo reaches production |
| [Contributing](guides/contributing.md) | Branches, PRs, tests, migrations, spec → plan → implement |
| [Authentication and SSO](guides/authentication.md) | How sign-in works across the apps |
| [Site roles and channel roles](guides/roles.md) | Two separate permission systems |
| [Theming](guides/theming.md) | Lantern, Zujaj, Nahas and Fawanees |
| [Specs index](guides/specs-index.md) | Every spec in the monorepo, with status |
| [Glossary](guides/glossary.md) | Terms used across the project |

## System map

```mermaid
flowchart TB
    subgraph clients["People and clients"]
        browser["Web browsers"]
        native["Native apps<br/>Apple, Android, Desktop, Tizen"]
        importer["AlUmmahNowTools<br/>bulk importer"]
    end

    subgraph identity["AlUmmahNowAuth"]
        auth["auth.*<br/>OpenAuth SSO provider"]
        profile["profile.auth.*"]
        authadmin["admin.auth.*"]
        audit["audit-consumer"]
    end

    subgraph marketing["Public site"]
        www["AlUmmahNowUI<br/>www.*"]
        cms["AlUmmahNowCMS<br/>cms.*"]
    end

    subgraph videos["AlUmmahNow monorepo"]
        web["web<br/>videos.*"]
        api["api-videos<br/>videos.api.*"]
        adminweb["admin-web<br/>admin.*"]
        adminapi["admin-api<br/>admin.api.*"]
        processor["processor"]
        realtime["websocket-server<br/>realtime.*"]
        scheduler["scheduler"]
    end

    subgraph cloudflare["Cloudflare data services"]
        r2[("R2")]
        d1[("D1")]
        kv[("KV")]
        queues[["Queues"]]
    end

    bunny["Bunny.net<br/>video and image delivery"]
    openauth["openauth fork<br/>npm package"]
    core["AlUmmahNowCore<br/>Rust library"]

    browser --> www
    browser --> web
    browser --> adminweb
    native --> api
    core -. "linked into" .-> native
    importer --> bunny
    importer --> r2

    www -- "service binding" --> cms
    www --> api
    web --> api
    adminweb --> adminapi
    adminapi --> api

    openauth -. "dependency" .-> auth
    auth --> audit
    web -. "sign-in" .-> auth
    www -. "sign-in" .-> auth
    cms -. "sign-in" .-> auth
    adminweb -. "sign-in" .-> auth
    native -. "sign-in" .-> auth
    profile -. "sign-in" .-> auth
    authadmin -. "sign-in" .-> auth

    api --> r2
    api --> d1
    api --> kv
    api --> queues
    api --> bunny
    adminapi --> r2
    adminapi --> d1
    queues --> processor
    processor --> d1
    processor --> r2
    processor --> realtime
    scheduler --> r2
    scheduler --> queues
```

Everything server-side runs on Cloudflare Workers. Hostnames for each environment are in [Environments and domains](guides/environments.md).

## How the pieces work together

- **Identity.** [AlUmmahNowAuth](repos/AlUmmahNowAuth.md) is the only sign-in service. Every app is one of its OAuth clients, and it knows nothing about the apps: apps depend on auth, never the reverse. See [Authentication and SSO](guides/authentication.md).
- **Videos.** The [monorepo](repos/AlUmmahNow.md) holds the videos product. `api-videos` stores metadata in R2 and D1, talks to Bunny.net for streaming and images, and sends events to Cloudflare Queues. `processor` consumes those queues and `websocket-server` delivers live updates. `admin-web` and `admin-api` are the staff tools.
- **Public site.** [AlUmmahNowUI](repos/AlUmmahNowUI.md) serves `www`, with editorial content from [AlUmmahNowCMS](repos/AlUmmahNowCMS.md) and video data from `api-videos`.
- **Native apps.** [Apple](repos/AlUmmahNowApple.md), [Android](repos/AlUmmahNowAndroid.md) and [Desktop](repos/AlUmmahNowDesktop.md) use native UI and players. Shared logic is moving into [AlUmmahNowCore](repos/AlUmmahNowCore.md).
- **Content import.** [AlUmmahNowTools](repos/AlUmmahNowTools.md) is a .NET tool set for bulk uploads to Bunny.net and R2.

## Reporting a problem

Open an issue in the repo concerned. For a security problem, don't open a public issue: use **Security → Report a vulnerability** in that repo, as its `SECURITY.md` describes ([example](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/SECURITY.md)).

To improve this wiki, open a pull request. Links are checked in CI, so a broken link fails the PR.
