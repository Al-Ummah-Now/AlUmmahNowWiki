# Platform credentials

Some keys that our Workers use to reach other providers can be replaced from the videos admin, so a rotated or revoked key doesn't need someone with Cloudflare access. ([AlUmmahNow#1547](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1547))

## Where

Videos admin → **Platform settings** → **Credentials**. Only Super Admins see the section, and admin-api checks the `credentials:manage` permission, which only the `super_admin` role holds.

## What it covers today

| Credential | Secrets Store entry | Read by | Used for |
|---|---|---|---|
| Cloudflare media token | `media-cdn-api-token` | api-videos `MEDIA_CDN_API_TOKEN`, `MEDIA_ANALYTICS_TOKEN`; admin-api `CF_ANALYTICS_TOKEN` | Purging a video's cached copies when it goes private or is removed; R2 storage and media traffic in delivery costs; Web vitals; abuse counters |

The Google OAuth client secret of Move from YouTube has its own write-only field on the same page (YouTube import, [AUN-YT-IMPORT](../epics/AUN-YT-IMPORT-move-from-youtube.md)).

[AlUmmahNow#1546](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/1546) tracks the remaining Secrets Store entries. It separates the third-party keys that suit this editor (Resend, Turnstile, Sites SaaS, Bunny, Quran Foundation, push) from the internal keys that stay in the Secrets Store: `internal-api-key`, `media-sign-key`, `csam-evidence-key`, `live-ingest-secret` and the VAPID pair.

## How it works

- **Write only.** **Replace** opens an empty password field. The value goes to admin-api once and is never sent back, logged or shown again. The page shows only:
  - where the value in use comes from (set here, or the Secrets Store entry);
  - for a value set here, its last four characters, who set it and when;
  - the last test.
- **Sealed.** admin-api encrypts the value with AES-256-GCM. The key is derived (HKDF-SHA256) from the environment's `INTERNAL_API_KEY`, and the credential id is the associated data. The result is stored in the `global-settings` bucket as `credentials/<id>.json`. Both admin-api and api-videos bind that bucket and that key.
- **Read first.** Every Worker that uses the credential reads the admin-set value before its Secrets Store binding (`resolvePlatformCredential` in shared-types). Each isolate keeps the lookup for a minute, so a replacement reaches every Worker within a minute.
- **Rotated `INTERNAL_API_KEY`.** A value sealed under the old key no longer opens. The Workers fall back to the Secrets Store entry, and the page asks for the value to be set again.
- **Test** checks what the value in use can do without changing anything:
  1. Cloudflare's token verify.
  2. Account Analytics: an R2 storage read.
  3. Zone Analytics on alummahnow.net.
  4. Cache Purge on alummahnow.net. The test purges a made-up URL that nobody ever requests.

  Each missing permission is named in Cloudflare's words, with what stops working without it. Saving a new value runs the test straight away.
- **Audited.** Replace and Test each write a `site_settings_log` row (`platform-credential:<id>`): the source, last four characters, test result and missing checks. The value is never logged. The rows show on the admin Audit log page under Settings.

## The Cloudflare media token's permissions

| Permission | Without it |
|---|---|
| Account → Account Analytics → Read | No R2 storage in delivery costs, no Web vitals, no abuse counters |
| Zone → Analytics → Read (alummahnow.net) | No media traffic or cache hit ratio in delivery costs |
| Zone → Cache Purge → Purge (alummahnow.net) | A video made private can stay cached on the media host until its copies expire |

## Testing

- admin-api `test/platform-credentials.test.ts` covers permissions, write-only, sealing, audit, the binding fallback and test outcomes against a fake Cloudflare.
- admin-web `test/platform-credentials.test.ts` covers the states, the copy (en/ar) and the rendered section.
- The local-stack spec `apps/admin-web/e2e/29-platform-credentials.spec.ts` is shared-state. It uses the stack's fake Cloudflare API, where a fake token's name says what it lacks: `-noacct`, `-nozone`, `-nopurge` or `-expired`.
