[← Home](../README.md)

# Glossary

| Term | Meaning |
|---|---|
| **Al Ummah Now / الأمة الآن** | The platform and organisation |
| **api-videos** | The videos API Worker, in the [monorepo](../repos/AlUmmahNow.md) |
| **aun-core, aun-media** | Rust crates in [AlUmmahNowCore](../repos/AlUmmahNowCore.md). "AUN" stands for Al Ummah Now |
| **bknd** | The backend framework the [CMS](../repos/AlUmmahNowCMS.md) is built on |
| **Build once** | A release builds one set of bundles and promotes the same bundles through stage and production |
| **Bunny.net, Bunny Stream** | Third-party video streaming and image storage |
| **Channel role** | A permission on one channel, held on the videos side. See [roles](roles.md) |
| **D1, R2, KV, Queues, Durable Objects** | Cloudflare's SQL database, object storage, key-value store, message queues and stateful objects |
| **DLQ** | Dead letter queue, for messages that repeatedly fail |
| **Entitlement** | A feature or limit granted by a plan (Epic 27) |
| **Epic** | A numbered body of product work. 1–8 are in [epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/epics.md), native work in [EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/native-apps/EPICS.md) |
| **Expand-only migration** | A schema change that only adds, so old code keeps working during a release |
| **Fanous** | The design system. See [theming](theming.md) |
| **Grandfathering** | Under Epic 27, limits block only new actions and never remove existing content |
| **Issuer** | The auth service for an environment, such as `auth.alummahnow.net` |
| **Lantern, Zujaj, Nahas, Fawanees** | The four [themes](theming.md) |
| **OpenAuth** | The OAuth provider library. The organisation maintains a [fork](../repos/openauth.md) |
| **OpenNext** | Adapter that runs Next.js on Cloudflare Workers |
| **PKCE** | An OAuth protection for public clients that have no secret |
| **Promote** | Moving a new Worker version from 0% to 100% of traffic after smoke tests |
| **`queue` label** | Marks a GitHub issue as accepted follow-up work |
| **Release gates** | Checks that must pass before a release. See [Contributing](contributing.md) |
| **Site role** | A platform-wide permission held in auth and issued in tokens. See [roles](roles.md) |
| **Stage** | Pre-production environment with production's config and separate data |
| **Studio** | The creator apps and tools for uploading and managing content |
| **TUS** | A protocol for resumable uploads |
| **UniFFI** | Generates Swift, Kotlin and C# bindings for the Rust core |
| **Viewer** | The consumer-facing native app |
| **Workers** | Cloudflare's serverless platform, used for every server-side app |
| **Wrangler** | Cloudflare's CLI and config format |
| **www** | The public site, from [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
