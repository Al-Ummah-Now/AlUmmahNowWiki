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
| **Bunny collection** | A folder in a Bunny Stream library. Every video sits in its channel's collection, or its owner's for a channel-less upload. See [Video delivery](video-delivery.md#bunny-libraries-and-collections) |
| **Channel role** | A permission on one channel, held on the videos side. See [roles](roles.md) |
| **D1, R2, KV, Queues, Durable Objects** | Cloudflare's SQL database, object storage, key-value store, message queues and stateful objects |
| **Delivery switch** | The per-environment admin setting that picks Bunny, R2 or a split for playback. See [Video delivery](video-delivery.md) |
| **Display-name rule** | How a person's name is shown everywhere: display name, else first + last name, email only as a last resort. No `@handle` (handles belong to channels) |
| **DLQ** | Dead letter queue, for messages that repeatedly fail |
| **Entitlement** | A feature or limit granted by a plan (Epic 27) |
| **Epic** | A numbered body of product work. 1–8 are in [epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/epics.md), native work in [EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/native-apps/EPICS.md) |
| **Expand-only migration** | A schema change that only adds, so old code keeps working during a release |
| **Fanous** | The design system. See [theming](theming.md) |
| **Grandfathering** | Under Epic 27, limits block only new actions and never remove existing content |
| **Issuer** | The auth service for an environment, such as `auth.alummahnow.net` |
| **Leftover check** | A step at the end of an E2E job that fails when anything the run created is still stored. See [Testing and E2E](testing.md) |
| **Local stack** | Every monorepo worker plus the released Auth bundle in one local Miniflare, with fakes for Bunny and email, booted per CI job for E2E. See [Testing and E2E](testing.md) |
| **Lantern, Zujaj, Nahas, Fawanees** | The four [themes](theming.md) |
| **«المرئيات»** | The Arabic plural used for "videos" across the platform |
| **Own data** | The rule that an E2E spec creates, through builders, everything it reads or changes, and deletes it afterwards |
| **Placement** | Whether an E2E spec runs `local` (on the local stack) or `deployed` (QA or stage) |
| **OpenAuth** | The OAuth provider library. The organisation maintains a [fork](../repos/openauth.md) |
| **OpenNext** | Adapter that runs Next.js on Cloudflare Workers |
| **PKCE** | An OAuth protection for public clients that have no secret |
| **Quarantine** | A red spec marked `test.fixme` with `quarantined: #<issue> @<owner>` until fixed |
| **Promote** | Moving a new Worker version from 0% to 100% of traffic after smoke tests |
| **`queue` label** | Marks a GitHub issue as accepted follow-up work |
| **R2 delivery** | HLS transcoded into Cloudflare R2 by the `media` Worker and served through Cloudflare's CDN, beside Bunny. See [Video delivery](video-delivery.md) |
| **Release gates** | Checks that must pass before a PR merges or a release reaches production. See [Contributing](contributing.md) and [Release process](release-process.md) |
| **Run account** | A throwaway account an E2E job registers for itself (`e2e+<run>-<attempt>-<name>@e2e.alummahnow.net`) and deletes when it ends |
| **Scholar** | A site role for scholars who write articles in the CMS and have a scholar page on www |
| **Site role** | A platform-wide permission held in auth and issued in tokens. See [roles](roles.md) |
| **Soft delete** | An admin delete that hides an item at once and keeps it restorable for 30 days before an hourly purge. See [Deletion, erasure and cleanup](data-lifecycle.md) |
| **Stage** | Pre-production environment with production's config and separate data |
| **Studio** | The creator apps and tools for uploading and managing content |
| **Theme package** | A site theme as data (format v1): built-in or made in the theme builder, stored in R2 and D1 |
| **TUS** | A protocol for resumable uploads |
| **UniFFI** | Generates Swift, Kotlin and C# bindings for the Rust core |
| **Viewer** | The consumer-facing native app |
| **Workers** | Cloudflare's serverless platform, used for every server-side app |
| **Wrangler** | Cloudflare's CLI and config format |
| **www** | The public site, from [AlUmmahNowUI](../repos/AlUmmahNowUI.md) |
