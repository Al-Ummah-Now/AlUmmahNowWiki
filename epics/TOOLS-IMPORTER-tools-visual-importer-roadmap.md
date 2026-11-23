[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Visual Importer roadmap: 6 sprints / milestones

| | |
|---|---|
| **ID** | `TOOLS-IMPORTER` |
| **Owning repos** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md) |
| **Status** | **superseded** by [TOOLS-ADMIN](TOOLS-ADMIN-admin-import-tool.md) (2026-11-21) |
| **Last updated** | 2026-11-21 |

> **Superseded.** The owner set the direction on 2026-11-21: AlUmmahNowTools is the admin import app, signed in through Auth and working through admin-api, specified in [TOOLS-ADMIN](TOOLS-ADMIN-admin-import-tool.md). Studio does not absorb it and it is not retired. The six-sprint roadmap below is kept as history; its open items are either in TOOLS-ADMIN's stories or dropped (the mobile app and Azure AI items were never asked for).

## Goal

Harden and extend the Windows bulk importer (.NET, Uno) for Bunny/R2 uploads.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Sprint 1 | Critical security & stability (P0-001…005) | In Progress — split one step: partially built, acceptance not fully met: Kimi: IMPLEMENTATION_ROADMAP.md:25-40 requires authentication, validation, SignalR and secure file operations; merged TOOLS fixes cover only part of Sprint 1.; GLM: The ten TOOLS-N fixes (#30-#39) merged 11-10 and shipped while the importer was still in use; completed work is not canceled by the later retirement. |
| Sprint 2 | Core functionality (P1-001…006) | In Progress — split one step: partially built, acceptance not fully met: Kimi: Sprint 2 has xUnit suites, loading UI and import work, but IMPLEMENTATION_ROADMAP.md:44-63 still lacks full refactor/caching/performance acceptance.; GLM: Wiki retirement rule triggered by native bulk import (Apple#17/Desktop#25/Android#8); the sprint never started. |
| Sprint 3 | Quality & docs (P1-007…010) | In Progress — split one step: partially built, acceptance not fully met: Kimi: SettingsViewModel.cs:181-367 persists settings and user docs exist, but Sprint 3 RBAC and audit logging remain unmet.; GLM: Wiki retirement rule triggered; never started. |
| Sprint 4 | Enhanced features (P2-001…006) | In Progress — split one step: partially built, acceptance not fully met: Kimi: FileWatchServiceIntegrationTests and service APIs provide partial Sprint 4 work; WCAG, email, backup and full REST acceptance remain open.; GLM: Wiki retirement rule triggered; never started. |
| Sprint 5 | Advanced features (P2-007…010) | In Progress — split one step: partially built, acceptance not fully met: Kimi: Splunk/logging and recent DB concurrency/index work are partial Sprint 5 progress; scheduling, full monitoring and export acceptance remain open.; GLM: Wiki retirement rule triggered; never started. |
| Sprint 6 | UI/UX incl. mobile app and AI features (P3) | In Progress — split one step: partially built, acceptance not fully met: Kimi: ModernImportView.xaml:47-49 implements drag/drop and themed resources exist, but localization, mobile and AI stories remain open.; GLM: Wiki retirement rule triggered; native apps own the mobile side now. |

## Decisions and constraints

- [O1](decisions.md#o1-cost-conscious-design): Cost-conscious design (decided)

Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Tools [AlUmmahNowTools#19](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/19), [AlUmmahNowTools#21](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/21), [AlUmmahNowTools#23](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/23), [AlUmmahNowTools#27](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/27), [AlUmmahNowTools#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30), [AlUmmahNowTools#31](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/31)
- Importer work merged 2026-11-09 to 11-10, not tracked against the sprint list. Scalability-audit fixes: idempotent imports [AlUmmahNowTools#34](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/34), session-scoped lookups [AlUmmahNowTools#31](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/31), one upload routine for import and Resume [AlUmmahNowTools#33](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/33), unique storage keys [AlUmmahNowTools#30](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/30). Other changes: thumbnails keep the video's shape [AlUmmahNowTools#40](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/40), no hard-delete of platform content [AlUmmahNowTools#41](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/41), channel autocomplete [AlUmmahNowTools#42](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/42), owner's icon art [AlUmmahNowTools#45](https://github.com/Al-Ummah-Now/AlUmmahNowTools/pull/45).

### Reconciled 2026-11-21

- **TOOLS-IMPORTER (AUN-555): In Progress** — split one step: partially built, acceptance not fully met: Kimi: EPICS.md:394-401 retires the importer only after all 19.2 acceptance ships; current native batch upload lacks the listed manifests/approval/dedup/scheduling features.; GLM: The wiki page's explicit rule — native Epic 19.2 absorbs bulk import and retires the .NET importer — has triggered (Apple#17/Desktop#25/Android#8 merged); Sprint 1 shipped first, sprints 2-6 never start.
- **TOOLS-IMPORTER / Critical security & stability (P0-001…005) (AUN-556): In Progress** — split one step: partially built, acceptance not fully met: Kimi: IMPLEMENTATION_ROADMAP.md:25-40 requires authentication, validation, SignalR and secure file operations; merged TOOLS fixes cover only part of Sprint 1.; GLM: The ten TOOLS-N fixes (#30-#39) merged 11-10 and shipped while the importer was still in use; completed work is not canceled by the later retirement.
- **TOOLS-IMPORTER / Core functionality (P1-001…006) (AUN-557): In Progress** — split one step: partially built, acceptance not fully met: Kimi: Sprint 2 has xUnit suites, loading UI and import work, but IMPLEMENTATION_ROADMAP.md:44-63 still lacks full refactor/caching/performance acceptance.; GLM: Wiki retirement rule triggered by native bulk import (Apple#17/Desktop#25/Android#8); the sprint never started.
- **TOOLS-IMPORTER / Quality & docs (P1-007…010) (AUN-558): In Progress** — split one step: partially built, acceptance not fully met: Kimi: SettingsViewModel.cs:181-367 persists settings and user docs exist, but Sprint 3 RBAC and audit logging remain unmet.; GLM: Wiki retirement rule triggered; never started.
- **TOOLS-IMPORTER / Enhanced features (P2-001…006) (AUN-559): In Progress** — split one step: partially built, acceptance not fully met: Kimi: FileWatchServiceIntegrationTests and service APIs provide partial Sprint 4 work; WCAG, email, backup and full REST acceptance remain open.; GLM: Wiki retirement rule triggered; never started.
- **TOOLS-IMPORTER / Advanced features (P2-007…010) (AUN-560): In Progress** — split one step: partially built, acceptance not fully met: Kimi: Splunk/logging and recent DB concurrency/index work are partial Sprint 5 progress; scheduling, full monitoring and export acceptance remain open.; GLM: Wiki retirement rule triggered; never started.
- **TOOLS-IMPORTER / UI/UX incl. mobile app and AI features (P3) (AUN-561): In Progress** — split one step: partially built, acceptance not fully met: Kimi: ModernImportView.xaml:47-49 implements drag/drop and themed resources exist, but localization, mobile and AI stories remain open.; GLM: Wiki retirement rule triggered; native apps own the mobile side now.
## Open questions

- None recorded in the sources.

## Conflicts between sources

- The roadmap budgets **$5,000–10,000/month** for infrastructure, which conflicts with cost-conscious design ([O1](decisions.md#o1-cost-conscious-design)).
- P3-005 (mobile app) overlaps the native-apps epics; P3-006 suggests Azure AI.
- `FEATURE_MATRIX` (21% health) and `IMPLEMENTATION_COMPLETE` (100%) disagree and aren't dated against each other.
- `EPICS.md` Epic 19 planned to retire this importer once 19.2 shipped. Withdrawn by the owner on 2026-11-21 ([TOOLS-ADMIN](TOOLS-ADMIN-admin-import-tool.md)).

## Sources

- [AlUmmahNowTools/IMPLEMENTATION_ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/cd9e20f563608b957f0ba325fa5bb93aef52f9cb/IMPLEMENTATION_ROADMAP.md)
- [AlUmmahNowTools/CONSOLIDATION_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowTools/blob/cd9e20f563608b957f0ba325fa5bb93aef52f9cb/CONSOLIDATION_PLAN.md)
- [docs/native-apps/EPICS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/native-apps/EPICS.md)
