[← Home](../README.md)

# Specs index

For the epics these specs belong to, and their status across every repo, see [Epics](../epics/README.md) and the [decision log](../epics/decisions.md).

All specs and plans in [`AlUmmahNow/docs/specs`](https://github.com/Al-Ummah-Now/AlUmmahNow/tree/main/docs/specs), checked on 2026-11-09.

Status meanings:

- **Current:** merged to `main`. Several of these still have "Draft v1 for review" in their own header, noted below.
- **Draft (open PR):** proposed in an open pull request, not on `main`. Links point at the PR's latest commit on that date.
- **Superseded:** replaced by something newer.

## Current

| Document | Topic | Header status | Notes |
|---|---|---|---|
| [AI-MODERATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/AI-MODERATION.md) | Epic 28: AI-assisted moderation | Draft v1 for review | |
| [EPIC-28-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/EPIC-28-PLAN.md) | Epic 28 plan | Phase A in progress | |
| [CORE-WEB-EXPERIENCE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/CORE-WEB-EXPERIENCE.md) | Epic 29: core web experience | Draft v1 for review | |
| [EPIC-29-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/EPIC-29-PLAN.md) | Epic 29 plan and audit | None | Audit dated 2026-11-08 |
| [EMBEDS-COMMENTS-TIERS.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/EMBEDS-COMMENTS-TIERS.md) | Epics 25–27: embeds, comments, plans | Draft v1 for review | |
| [EPIC-27-PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/EPIC-27-PLAN.md) | Epic 27 plan | None | Payments deferred by owner decision |
| [TRANSCRIPTION-TRANSLATION.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/TRANSCRIPTION-TRANSLATION.md) | [AUN-CAPTIONS](../epics/AUN-CAPTIONS-transcription-translation.md): transcription, translation, inline titles, zero-mistake Quran | Draft v1 for review | v1 merged in #816; v2 (Quran design, QF Content Sync, DeepL, prices) in [#819](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/819) |

## Draft (open PR)

| Document | Topic | PR |
|---|---|---|
| [CREATOR-STUDIO.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/5ed0e6c85517757e03db9ba7cbc91f71144e1aac/docs/specs/CREATOR-STUDIO.md) · [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/5ed0e6c85517757e03db9ba7cbc91f71144e1aac/docs/specs/CREATOR-STUDIO-PLAN.md) | Web Creator Studio | [#476](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/476) |
| [VIDEO-PLAYER.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/7d1d3d923d8c581159f93e56e7d95329c06890c4/docs/specs/VIDEO-PLAYER.md) · [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/7d1d3d923d8c581159f93e56e7d95329c06890c4/docs/specs/VIDEO-PLAYER-PLAN.md) | Production video player | [#472](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/472) |
| [CHANNEL-ROLES.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/91b5e794734f6c6c31fbb882a7d494507f534bad/docs/specs/CHANNEL-ROLES.md) · [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/91b5e794734f6c6c31fbb882a7d494507f534bad/docs/specs/CHANNEL-ROLES-PLAN.md) | Per-channel roles | [#462](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/462) |
| [CHANNEL-CLAIM-AND-TRANSFER.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/aa6a9980ba9b5a346112f337c7d058d77105a18c/docs/specs/CHANNEL-CLAIM-AND-TRANSFER.md) · [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/aa6a9980ba9b5a346112f337c7d058d77105a18c/docs/specs/CHANNEL-CLAIM-AND-TRANSFER-PLAN.md) | Channel claim and transfer | [#460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460) |

PR [#213](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/213) also shows spec files as added, but only because its branch predates them landing on `main`. It isn't a separate proposal.

## Superseded

None of the files in `docs/specs` is marked superseded.

The channel roles draft says it supersedes the "(uses auth RBAC)" note in native Epic 19.8, which is outside this folder.

## Specs elsewhere

These live outside `docs/specs`:

- [Release pipeline spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/SPEC.md) and [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/PLAN.md)
- [Themes](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/design/THEMES.md)
- [Native apps epics](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/native-apps/EPICS.md)
- [Embeds plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/embeds/PLAN.md)
- [Account hub](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/docs/account-hub/SPEC.md), in AlUmmahNowAuth
- [www](https://github.com/Al-Ummah-Now/AlUmmahNowUI/blob/main/docs/SPEC.md) and [CMS](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/docs/SPEC.md), in their own repos
