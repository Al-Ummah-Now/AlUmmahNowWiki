[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 23: Release engineering & store compliance

| | |
|---|---|
| **ID** | `E23` |
| **Owning repos** | [AlUmmahNowApple](../repos/AlUmmahNowApple.md), [AlUmmahNowAndroid](../repos/AlUmmahNowAndroid.md), [AlUmmahNowDesktop](../repos/AlUmmahNowDesktop.md), [AlUmmahNowCore](../repos/AlUmmahNowCore.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-14 |

> Release pipelines exist (Fastlane/TestFlight in Apple, Gradle Play Publisher internal track in Android, tag-triggered `release.yml` in Desktop) but store signing waits on owner accounts.
>
> **NAT-REL (2026-11-14): store release infrastructure is built and waits only for the owner's ids** ("app store not now, build infra, dont be the blocker"). Every store step skips with a notice when its secrets are missing; universal-link / App Links files are served from videos admin → Mobile apps (empty means not served, every change audited); App Attest and Play Integrity hooks are off until configured. What to paste where: [store release checklist](../guides/store-release-checklist.md).

## Goal

CI/CD, signing, betas, staged rollouts, store listings and monitoring for every app.

## Scope

- Depends on: —

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 23.1 | CI/CD per platform | Android: tag → signed bundles, Play internal track per app and Amazon Appstore edit, each skipped with a notice until the owner adds its secrets and IDs (AlUmmahNowAndroid#24, `docs/RELEASE.md`). Apple (all apps) and Desktop (MSIX, Microsoft Store): NAT-REL in progress |
| 23.2 | Signing & store accounts (needs D-U-N-S) | Waits on the owner: [store release checklist](../guides/store-release-checklist.md). Universal links, App Links and attestation are set in videos admin → Mobile apps |
| 23.3 | Beta channels | Android: Play internal track (AlUmmahNowAndroid#24). Apple: TestFlight for Studio. Each skips until its account exists |
| 23.4 | Staged rollouts + kill switches |  |
| 23.5 | Store listings en/ar | Android: listings in en/ar for viewer, TV and Studio, checked in CI; data safety answers from the code; store screenshots generated from the app screens (AlUmmahNowAndroid#24). Apple and Desktop: NAT-REL in progress |
| 23.6 | Monitoring (Sentry, QoE gates) |  |
| 23.7 | Accessibility & RTL QA matrix |  |

Full story text and acceptance criteria are in the source spec. Bilingual (en/ar, RTL) and Epic 1 accessibility are implicit ACs for every UI story.

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence


GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#309](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/309) | PR | docs: native apps epics (9–24), embeds/discussions/tiers (25–27), AI moderation (28) — onto main | MERGED | 2026-11-08 |

## Open questions

- None recorded in the sources.

## Conflicts between sources

- Release tags differ: Desktop uses SemVer `v1.2.3`; Apple, Android, CMS and www use `vYYYY.MM.DD`.
- Apple and Android `CLAUDE.md` say squash-merge; the project rule (and Desktop's `CLAUDE.md`) is `gh pr merge --rebase --admin`.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
- [AlUmmahNowAndroid/docs/RELEASE.md](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/4e7eb38a5a18a3f255ca83697e5c806b3a524160/docs/RELEASE.md)
