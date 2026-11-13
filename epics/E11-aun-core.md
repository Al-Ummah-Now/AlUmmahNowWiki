[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 11: Shared core in Rust (`aun-core`) + per-platform app layers

| | |
|---|---|
| **ID** | `E11` |
| **Owning repos** | [AlUmmahNowCore](../repos/AlUmmahNowCore.md), [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-12 |

> aun-core 0.1.0 and 0.2.0 released 2026-11-08; pre-release `0.3.0-rc.1` on 2026-11-11 added `aun-search`, sign-out revocation, loopback sign-in and the upload resume fix. Studio on Apple, Android and Desktop pins `0.3.0-rc.1` for sign-in, uploads and search. The Apple and Android viewers still use temporary native bridges.

## Goal

One implementation of logic that must behave identically everywhere, with thin bindings per app.

## Scope

- Depends on: 9

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 11.1 | Workspace & bindings (UniFFI Swift/Kotlin, uniffi-bindgen-cs) |  |
| 11.2 | API client from the api-videos OpenAPI |  |
| 11.3 | Auth module: PKCE, device flow, multi-account, secure storage | Used by Studio on every platform. Added since: `LoginPrompt` ([AlUmmahNowCore#22](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/22)), refresh-token revocation and loopback redirects ([AlUmmahNowCore#27](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/27)). |
| 11.4 | i18n shared bundles, plurals, runtime locale |  |
| 11.5 | Player behaviour spec + conformance tests |  |
| 11.6 | Download & upload engines (`aun-upload`) | Studio uploads on every platform use it. Store locks ([AlUmmahNowCore#23](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/23)), resume through the proxy ([AlUmmahNowCore#29](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/29)). |
| 11.7 | Analytics & consent |  |
| 11.8 | Realtime client |  |
| 11.9 | Per-platform app layers | Studio adapters on all three platforms; viewers partly. |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints

- [D1](decisions.md#d1-app-stack): App stack (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Since 2026-11-09: [AlUmmahNowCore#22](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/22), [AlUmmahNowCore#23](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/23), [AlUmmahNowCore#24](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/24) (`aun-search`), [AlUmmahNowCore#27](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/27), [AlUmmahNowCore#28](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/28) (`request_path`), [AlUmmahNowCore#29](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/29), [AlUmmahNowCore#30](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/30) (`v0.3.0-rc.1`), [AlUmmahNowCore#35](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/35) (display-name rule, unreleased). `v0.3.0-rc.2` open as [AlUmmahNowCore#36](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/36).

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#2](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/2) | PR | chore: workspace, FFI facade, bindings smoke tests, CI and release pipeline | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#3](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/3) | PR | feat(aun-api): OpenAPI-generated client, retries, auth refresh, offline write queue | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#5](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/5) | PR | feat(aun-player): player behaviour model + conformance suite | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#6](https://github.com/Al-Ummah-Now/AlUmmahNowCore/issues/6) | issue | aun-api: expose response headers (ETag) and treat 304 Not Modified as a result, not an error | OPEN | 2026-11-08 |
| AlUmmahNowCore | [#14](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/14) | PR | feat(aun-auth): PKCE S256, device flow, multi-account, FFI facade | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#15](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/15) | PR | feat(aun-upload): resumable TUS upload engine, folder watching, FFI facade | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#17](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/17) | PR | feat(aun-i18n): translation catalog, CLDR plurals, formatting, bidi, API sync | MERGED | 2026-11-08 |
| AlUmmahNowCore | [#18](https://github.com/Al-Ummah-Now/AlUmmahNowCore/pull/18) | PR | feat(aun-telemetry): consent-gated telemetry, QoE tracker, breadcrumbs, sinks | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- `aun-upload` and `aun-i18n` both claim story **11.4** in their crate headers (EPICS.md: 11.4 = i18n, 11.6 = upload).
- Chat: Epic 11 was first a TypeScript core (`@al-ummah/app-core`, 2026-11-07); D1 on 2026-11-08 (PR #323) made it the Rust `aun-core`.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowCore/docs/PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/45d873a0b0fa908bead87d91f28bd33a2b41bedb/docs/PLAN.md)
- [AlUmmahNowCore/CHANGELOG.md](https://github.com/Al-Ummah-Now/AlUmmahNowCore/blob/45d873a0b0fa908bead87d91f28bd33a2b41bedb/CHANGELOG.md)
