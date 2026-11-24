[← AUN-ADMIN-HELP](AUN-ADMIN-HELP-admin-setting-help.md) · [Epics](README.md) · [Home](../README.md)

# Admin settings inventory (AUN-ADMIN-HELP)

Every setting an admin can change in the three admin apps, read from the code on `main` on 2026-11-24 (AlUmmahNow `52b235a78`, AlUmmahNowAuth and AlUmmahNowCMS `main` the same day). **1252 settings**: 329 page settings, 819 fields of forms that define behavior (tiers, rules, themes, clients, page blocks), and 104 choices inside admin action dialogs. Each gets a "?" and a guide entry. The area PRs regenerate this page and replace these rows with the help ids.

Money values set per environment are not repeated here; the help text describes them in unit terms.

Known gaps found while collecting (filed as issues): the Features page has no admin-web screen yet (the switches are listed from `packages/shared-types/src/feature-registry.ts`); the backfill "One channel" field takes a raw channel id instead of a search picker; three Auth admin mismatches (see the Auth section notes).

## Summary

| App | Area | Settings |
|---|---|---|
| Videos admin (apps/admin-web) | [moderation](#alummahnow-moderation) | 122 |
| Videos admin (apps/admin-web) | [site-theme](#alummahnow-site-theme) | 116 |
| Videos admin (apps/admin-web) | [live-streaming](#alummahnow-live-streaming) | 40 |
| Videos admin (apps/admin-web) | [features](#alummahnow-features) | 39 |
| Videos admin (apps/admin-web) | [approval-rules](#alummahnow-approval-rules) | 30 |
| Videos admin (apps/admin-web) | [app-config](#alummahnow-app-config) | 25 |
| Videos admin (apps/admin-web) | [payments](#alummahnow-payments) | 25 |
| Videos admin (apps/admin-web) | [media-providers](#alummahnow-media-providers) | 23 |
| Videos admin (apps/admin-web) | [tiers](#alummahnow-tiers) | 23 |
| Videos admin (apps/admin-web) | [emails](#alummahnow-emails) | 19 |
| Videos admin (apps/admin-web) | [costs](#alummahnow-costs) | 17 |
| Videos admin (apps/admin-web) | [status](#alummahnow-status) | 17 |
| Videos admin (apps/admin-web) | [users](#alummahnow-users) | 17 |
| Videos admin (apps/admin-web) | [sites](#alummahnow-sites) | 16 |
| Videos admin (apps/admin-web) | [users-invites](#alummahnow-users-invites) | 14 |
| Videos admin (apps/admin-web) | [captions-settings](#alummahnow-captions-settings) | 13 |
| Videos admin (apps/admin-web) | [channels](#alummahnow-channels) | 12 |
| Videos admin (apps/admin-web) | [review-alerts](#alummahnow-review-alerts) | 12 |
| Videos admin (apps/admin-web) | [videos](#alummahnow-videos) | 12 |
| Videos admin (apps/admin-web) | [backfill](#alummahnow-backfill) | 11 |
| Videos admin (apps/admin-web) | [mobile-apps](#alummahnow-mobile-apps) | 10 |
| Videos admin (apps/admin-web) | [social](#alummahnow-social) | 9 |
| Videos admin (apps/admin-web) | [contact](#alummahnow-contact) | 7 |
| Videos admin (apps/admin-web) | [captions](#alummahnow-captions) | 6 |
| Videos admin (apps/admin-web) | [categories](#alummahnow-categories) | 6 |
| Videos admin (apps/admin-web) | [platform-settings](#alummahnow-platform-settings) | 6 |
| Videos admin (apps/admin-web) | [category-suggestions](#alummahnow-category-suggestions) | 5 |
| Videos admin (apps/admin-web) | [errors](#alummahnow-errors) | 4 |
| Videos admin (apps/admin-web) | [newsletter](#alummahnow-newsletter) | 4 |
| Videos admin (apps/admin-web) | [approvals](#alummahnow-approvals) | 2 |
| Videos admin (apps/admin-web) | [stale-uploads](#alummahnow-stale-uploads) | 2 |
| Videos admin (apps/admin-web) | [tier-requests](#alummahnow-tier-requests) | 2 |
| Videos admin (apps/admin-web) | [video-formats](#alummahnow-video-formats) | 2 |
| Videos admin (apps/admin-web) | [comments](#alummahnow-comments) | 1 |
| Videos admin (apps/admin-web) | [community](#alummahnow-community) | 1 |
| Videos admin (apps/admin-web) | [deleted](#alummahnow-deleted) | 1 |
| Videos admin (apps/admin-web) | [delivery](#alummahnow-delivery) | 1 |
| Videos admin (apps/admin-web) | [legacy-profiles](#alummahnow-legacy-profiles) | 1 |
| Videos admin (apps/admin-web) | [playlists](#alummahnow-playlists) | 1 |
| Videos admin (apps/admin-web) | [processing](#alummahnow-processing) | 1 |
| Videos admin (apps/admin-web) | [recently-deleted](#alummahnow-recently-deleted) | 1 |
| Videos admin (apps/admin-web) | [translations](#alummahnow-translations) | 1 |
| **Videos admin (apps/admin-web)** | **all** | **677** |
| Auth admin (apps/admin) | [theme-builder](#alummahnowauth-theme-builder) | 364 |
| Auth admin (apps/admin) | [oauth-clients](#alummahnowauth-oauth-clients) | 20 |
| Auth admin (apps/admin) | [themes](#alummahnowauth-themes) | 8 |
| Auth admin (apps/admin) | [users](#alummahnowauth-users) | 7 |
| Auth admin (apps/admin) | [roles](#alummahnowauth-roles) | 5 |
| Auth admin (apps/admin) | [moderation](#alummahnowauth-moderation) | 2 |
| Auth admin (apps/admin) | [security](#alummahnowauth-security) | 1 |
| **Auth admin (apps/admin)** | **all** | **407** |
| CMS admin (src/admin) | [page-blocks](#alummahnowcms-page-blocks) | 77 |
| CMS admin (src/admin) | [ai-settings](#alummahnowcms-ai-settings) | 34 |
| CMS admin (src/admin) | [content-editor](#alummahnowcms-content-editor) | 22 |
| CMS admin (src/admin) | [scholars](#alummahnowcms-scholars) | 9 |
| CMS admin (src/admin) | [site-settings](#alummahnowcms-site-settings) | 6 |
| CMS admin (src/admin) | [timeline](#alummahnowcms-timeline) | 5 |
| CMS admin (src/admin) | [translation-flags](#alummahnowcms-translation-flags) | 5 |
| CMS admin (src/admin) | [glossary](#alummahnowcms-glossary) | 4 |
| CMS admin (src/admin) | [navigation](#alummahnowcms-navigation) | 4 |
| CMS admin (src/admin) | [deletion](#alummahnowcms-deletion) | 1 |
| CMS admin (src/admin) | [videos-library](#alummahnowcms-videos-library) | 1 |
| **CMS admin (src/admin)** | **all** | **168** |
| **All apps** | | **1252** |

## Videos admin (apps/admin-web)

<a id="alummahnow-app-config"></a>

### AlUmmahNow · app-config (25)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Platforms | `flags[].platforms` | entity-field | checkbox | iPhone (iOS), iPad (iPadOS), Apple TV (tvOS), Mac (macOS), Android, Android TV, Fire TV, Windows, … 4 more | [] (none ticked = all platforms) | `apps/admin-web/src/components/app-config/RuleList.tsx:173` |
| Apps | `flags[].apps` | entity-field | checkbox | Viewer, Studio, Tools, Admin | [] (none ticked = all apps) | `apps/admin-web/src/components/app-config/RuleList.tsx:173` |
| Platforms | `config[].platforms` | entity-field | checkbox | iPhone (iOS), iPad (iPadOS), Apple TV (tvOS), Mac (macOS), Android, Android TV, Fire TV, Windows, … 4 more | [] (none ticked = all platforms) | `apps/admin-web/src/components/app-config/RuleList.tsx:173` |
| Apps | `config[].apps` | entity-field | checkbox | Viewer, Studio, Tools, Admin | [] (none ticked = all apps) | `apps/admin-web/src/components/app-config/RuleList.tsx:173` |
| Key | `flags[].key` | entity-field | text |  |  | `apps/admin-web/src/components/app-config/RuleList.tsx:226` |
| Key | `config[].key` | entity-field | text |  |  | `apps/admin-web/src/components/app-config/RuleList.tsx:226` |
| On | `flags[].enabled` | entity-field | checkbox |  | true | `apps/admin-web/src/components/app-config/RuleList.tsx:228` |
| On | `config[].enabled` | entity-field | checkbox |  | true | `apps/admin-web/src/components/app-config/RuleList.tsx:228` |
| From version | `flags[].minVersion` | entity-field | text |  | '' (no lower limit) | `apps/admin-web/src/components/app-config/RuleList.tsx:238` |
| From version | `config[].minVersion` | entity-field | text |  | '' (no lower limit) | `apps/admin-web/src/components/app-config/RuleList.tsx:238` |
| Up to version | `flags[].maxVersion` | entity-field | text |  | '' (no upper limit) | `apps/admin-web/src/components/app-config/RuleList.tsx:239` |
| Up to version | `config[].maxVersion` | entity-field | text |  | '' (no upper limit) | `apps/admin-web/src/components/app-config/RuleList.tsx:239` |
| Languages | `flags[].locales` | entity-field | text |  | '' (every language) | `apps/admin-web/src/components/app-config/RuleList.tsx:240` |
| Languages | `config[].locales` | entity-field | text |  | '' (every language) | `apps/admin-web/src/components/app-config/RuleList.tsx:240` |
| Rollout (%) | `flags[].rollout` | entity-field | number |  | '' (everyone) | `apps/admin-web/src/components/app-config/RuleList.tsx:241` |
| Rollout (%) | `config[].rollout` | entity-field | number |  | '' (everyone) | `apps/admin-web/src/components/app-config/RuleList.tsx:241` |
| Value (JSON) | `flags[].value` | entity-field | textarea |  | '' (flag gives true) | `apps/admin-web/src/components/app-config/RuleList.tsx:256` |
| Value (JSON) | `config[].value` | entity-field | textarea |  | "" (required) | `apps/admin-web/src/components/app-config/RuleList.tsx:256` |
| Note | `flags[].note` | entity-field | text |  | '' | `apps/admin-web/src/components/app-config/RuleList.tsx:263` |
| Note | `config[].note` | entity-field | text |  | '' | `apps/admin-web/src/components/app-config/RuleList.tsx:263` |
| App | `versions[].app` | entity-field | select | Viewer, Studio, Tools, Admin | viewer | `apps/admin-web/src/components/app-config/VersionList.tsx:92` |
| Platform | `versions[].platform` | entity-field | select | All platforms, iPhone (iOS), iPad (iPadOS), Apple TV (tvOS), Mac (macOS), Android, Android TV, Fire TV, … 5 more |  | `apps/admin-web/src/components/app-config/VersionList.tsx:109` |
| Minimum version | `versions[].minimumVersion` | entity-field | text |  |  | `apps/admin-web/src/components/app-config/VersionList.tsx:122` |
| Latest version | `versions[].latestVersion` | entity-field | text |  | '' (optional) | `apps/admin-web/src/components/app-config/VersionList.tsx:123` |
| Store link | `versions[].storeUrl` | entity-field | text |  | '' (optional) | `apps/admin-web/src/components/app-config/VersionList.tsx:125` |

<a id="alummahnow-approval-rules"></a>

### AlUmmahNow · approval-rules (30)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Approvals needed | `rule.approvalsNeeded` | entity-field | select | 0, 1, 2, 3 | per action (0 or 1) | `apps/admin-web/src/components/workflows/RuleEditor.tsx:150` |
| Super admins | `rule.approvers[role=super_admin]` | entity-field | checkbox |  | on for most non-money rules | `apps/admin-web/src/components/workflows/RuleEditor.tsx:162` |
| Admins and super admins | `rule.approvers[role=admin]` | entity-field | checkbox |  | off | `apps/admin-web/src/components/workflows/RuleEditor.tsx:163` |
| The finance list | `rule.approvers[kind=finance]` | entity-field | checkbox |  | on for money rules, off otherwise | `apps/admin-web/src/components/workflows/RuleEditor.tsx:164` |
| Finance list permission | `rule.approvers[kind=finance].permission` | entity-field | select | Any money permission, Refunds, Disputes, Payouts, Ledger, Providers and fees | per action (e.g. support:providers for fees) | `apps/admin-web/src/components/workflows/RuleEditor.tsx:172` |
| Add a person | `rule.approvers[kind=people].userIds` | entity-field | list |  | [] | `apps/admin-web/src/components/workflows/RuleEditor.tsx:198` |
| The person the change is about | `rule.exclusions.subject` | entity-field | checkbox |  | true (always, locked) | `apps/admin-web/src/components/workflows/RuleEditor.tsx:226` |
| Tech staff | `rule.exclusions.techStaff` | entity-field | checkbox |  | false (true and locked on money rules) | `apps/admin-web/src/components/workflows/RuleEditor.tsx:227` |
| The platform owner | `rule.exclusions.owner` | entity-field | checkbox |  | false (true and locked on money rules) | `apps/admin-web/src/components/workflows/RuleEditor.tsx:228` |
| Anyone who already took a step on the request | `rule.exclusions.oneStepPerPerson` | entity-field | checkbox |  | true | `apps/admin-web/src/components/workflows/RuleEditor.tsx:229` |
| Passkey check | `rule.stepUp` | entity-field | select | None, To approve, To ask and to approve | per action (none / approve / propose_and_approve) | `apps/admin-web/src/components/workflows/RuleEditor.tsx:235` |
| Requests expire after (hours) | `rule.expiryHours` | entity-field | number |  | 168 (7 days); 120 payouts; 24 emergency-stop lift | `apps/admin-web/src/components/workflows/RuleEditor.tsx:252` |
| Email the approvers and the person who asked | `rule.notify.email` | entity-field | checkbox |  | true | `apps/admin-web/src/components/workflows/RuleEditor.tsx:258` |
| Why change it | `workflows.rule.set request reason` | action-option | textarea |  | '' | `apps/admin-web/src/components/workflows/RuleEditor.tsx:262` |
| Change a creator-support fee | `workflow rule support.fees.set` | setting | other |  | per environment | `packages/shared-types/src/workflows.ts:132` |
| Approve a payout batch | `workflow rule support.payoutBatch.approve` | setting | other |  | 1; finance list (support:payouts); money exclusions; passkey ask+approve; 120 h; email on | `packages/shared-types/src/workflows.ts:140` |
| Post a ledger adjustment | `workflow rule support.ledger.adjust` | setting | other |  | 1; finance list (support:ledger); money exclusions; passkey ask+approve; 168 h; email on | `packages/shared-types/src/workflows.ts:150` |
| Add someone to the finance list | `workflow rule support.financeList.add` | setting | other |  | 1; super admins; excl. subject, one-step; passkey ask+approve; 168 h; email on | `packages/shared-types/src/workflows.ts:158` |
| Remove a tech-staff mark | `workflow rule support.techStaff.unmark` | setting | other |  | 1; super admins; excl. subject, one-step; passkey ask+approve; 168 h; email on | `packages/shared-types/src/workflows.ts:167` |
| Change creator-support settings | `workflow rule support.policy.set` | setting | other |  | 1; finance list (support:providers); money exclusions; passkey ask+approve; 168 h; email on | `packages/shared-types/src/workflows.ts:176` |
| Lift the creator-support emergency stop | `workflow rule support.emergencyStop.lift` | setting | other |  | 1; finance list (any); money exclusions; passkey ask+approve; 24 h; email on | `packages/shared-types/src/workflows.ts:184` |
| Change an approval rule (scope: default) | `workflow rule workflows.rule.set` | setting | other |  | 1; super admins; excl. subject, one-step; passkey to approve; 168 h; email on | `packages/shared-types/src/workflows.ts:192` |
| Change an approval rule (scope: money rules) | `workflow rule workflows.rule.set scope money` | setting | other |  | 1; finance list (any); money exclusions; passkey ask+approve; 168 h; email on | `packages/shared-types/src/workflows.ts:192` |
| Switch a feature on or off (scope: all / per switch) | `workflow rule features.set` | setting | other |  | 0 (direct); super admins; excl. subject, one-step; no passkey; 168 h; email on | `packages/shared-types/src/workflows.ts:201` |
| Switch a feature on or off (scope: creatorSupport) | `workflow rule features.set scope creatorSupport` | setting | other |  | 1; finance list (any); money exclusions; passkey to approve; 168 h; email on | `packages/shared-types/src/workflows.ts:201` |
| Change a creator tier | `workflow rule tiers.change` | setting | other |  | 0 (direct); super admins; no passkey; 168 h; email on | `packages/shared-types/src/workflows.ts:209` |
| Move a channel to another account | `workflow rule channels.transfer` | setting | other |  | 0 (direct); super admins; no passkey; 168 h; email on | `packages/shared-types/src/workflows.ts:217` |
| Approve a channel claim | `workflow rule channels.claim.approve` | setting | other |  | 0 (direct); super admins; no passkey; 168 h; email on | `packages/shared-types/src/workflows.ts:225` |
| Create a platform credential | `workflow rule credentials.create` | setting | other |  | 0 (direct); super admins; passkey ask+approve; 168 h; email on | `packages/shared-types/src/workflows.ts:233` |
| Rotate a platform credential | `workflow rule credentials.rotate` | setting | other |  | 0 (direct); super admins; passkey ask+approve; 168 h; email on | `packages/shared-types/src/workflows.ts:241` |

<a id="alummahnow-approvals"></a>

### AlUmmahNow · approvals (2)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Reason | `workflow request reject reason` | action-option | textarea |  |  | `apps/admin-web/src/components/workflows/RequestActions.tsx:104` |
| Approve / Reject / Withdraw / Try again | `workflow request decision` | action-option | other | Approve, Reject, Withdraw, Try again |  | `apps/admin-web/src/components/workflows/RequestActions.tsx:109` |

<a id="alummahnow-backfill"></a>

### AlUmmahNow · backfill (11)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Channel | `flip.channelId` | action-option | text |  |  | `apps/admin-web/src/app/(protected)/backfill/FlipSection.tsx:100` |
| Videos | `scope.kind` | action-option | radio | All videos, One channel, Upload dates, A list of videos | all | `apps/admin-web/src/app/(protected)/backfill/NewRun.tsx:82` |
| Channel | `scope.channelId` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/backfill/NewRun.tsx:96` |
| From | `scope.from` | action-option | date |  |  | `apps/admin-web/src/app/(protected)/backfill/NewRun.tsx:103` |
| To | `scope.to` | action-option | date |  |  | `apps/admin-web/src/app/(protected)/backfill/NewRun.tsx:107` |
| Videos | `scope.videoIds` | action-option | list |  | [] | `apps/admin-web/src/app/(protected)/backfill/NewRun.tsx:129` |
| Only missing renditions | `scope.onlyMissing` | action-option | checkbox |  | true | `apps/admin-web/src/app/(protected)/backfill/NewRun.tsx:157` |
| Grace period (days) | `retire.graceDays` | action-option | number |  | 30 | `apps/admin-web/src/app/(protected)/backfill/RetireSection.tsx:140` |
| Videos at a time | `run.settings.concurrency` | entity-field | number |  | 2 | `apps/admin-web/src/app/(protected)/backfill/RunPanel.tsx:246` |
| Seconds between starts | `run.settings.spacingSeconds` | entity-field | number |  | 30 | `apps/admin-web/src/app/(protected)/backfill/RunPanel.tsx:249` |
| Budget cap (USD) | `run.settings.budgetUsd` | entity-field | number |  | per environment | `apps/admin-web/src/app/(protected)/backfill/RunPanel.tsx:253` |

<a id="alummahnow-captions"></a>

### AlUmmahNow · captions (6)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Creators can translate caption tracks | `global_settings caption settings (api-videos lib/captions/jobs.ts readCaptionSettings).translation.enabled` | setting | toggle |  | true | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:96` |
| Use DeepL Pro | `global_settings caption settings (api-videos lib/captions/jobs.ts readCaptionSettings).translation.deepl` | setting | toggle |  | false | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:113` |
| Translate button on (turn off to pause it everywhere) | `global_settings caption settings (api-videos lib/captions/jobs.ts readCaptionSettings).inline.enabled` | setting | toggle |  | true | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:147` |
| Show viewers machine-translated titles | `global_settings caption settings (api-videos lib/captions/jobs.ts readCaptionSettings).viewerTitles.enabled` | setting | toggle |  | true | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:162` |
| Let viewers download captions | `global_settings caption settings (api-videos lib/captions/jobs.ts readCaptionSettings).viewerDownload.enabled` | setting | toggle |  | false | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:176` |
| Edition | `quran-translations/:language.id` | setting | select |  | Quran Foundation default edition for the language | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:338` |

<a id="alummahnow-captions-settings"></a>

### AlUmmahNow · captions-settings (13)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Monthly budget (USD) | `captions/settings.json monthlyBudgetUsd` | setting | number |  | per environment | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:88` |
| Creators can translate caption tracks | `captions/settings.json translation.enabled (overridden by feature switch captionsTranslate once set)` | setting | checkbox |  | true | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:96` |
| Model | `captions/settings.json translation.model` | setting | select | DeepSeek V4.1 Flash, Gemma 4 26B | @cf/deepseek-ai/deepseek-v4.1-flash-1017 | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:102` |
| Fallback model | `captions/settings.json translation.fallbackModel` | setting | select | DeepSeek V4.1 Flash, Gemma 4 26B | @cf/google/gemma-4-26b-a4b-it | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:102` |
| Use DeepL Pro | `captions/settings.json translation.deepl` | setting | checkbox |  | false | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:119` |
| DeepL languages | `captions/settings.json translation.deeplLanguages` | setting | list |  | [] (every language DeepL supports) | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:137` |
| Translate button on (turn off to pause it everywhere) | `captions/settings.json inline.enabled (overridden by feature switch inlineTranslate once set)` | setting | checkbox |  | true | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:147` |
| Texts per user per day | `captions/settings.json inline.dailyItems` | setting | number |  | 100 | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:153` |
| Monthly budget (USD) | `captions/settings.json inline.monthlyBudgetUsd` | setting | number |  | per environment | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:156` |
| Show viewers machine-translated titles | `captions/settings.json viewerTitles.enabled (overridden by feature switch viewerTranslatedTitles once set)` | setting | checkbox |  | true | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:168` |
| Let viewers download captions | `captions/settings.json viewerDownload.enabled (overridden by feature switch viewerCaptionDownload once set)` | setting | checkbox |  | false | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:182` |
| Language | `quran edition language` | setting | text |  |  | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:329` |
| Edition | `platform Quran edition per language (edition id)` | setting | select |  | Quran Foundation default edition for the language | `apps/admin-web/src/components/captions/CaptionSettingsView.tsx:338` |

<a id="alummahnow-categories"></a>

### AlUmmahNow · categories (6)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Move {name} up / down | `video_categories order` | setting | other |  | creation order | `apps/admin-web/src/app/(protected)/categories/CategoriesAdmin.tsx:163` |
| Retire / Restore | `video_categories.retired` | entity-field | toggle |  | false (active) | `apps/admin-web/src/app/(protected)/categories/CategoriesAdmin.tsx:172` |
| English name | `video_categories.label.en` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/categories/CategoriesAdmin.tsx:253` |
| Arabic name | `video_categories.label.ar` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/categories/CategoriesAdmin.tsx:258` |
| Value | `video_categories.value` | entity-field | text |  | slug suggested from the English name | `apps/admin-web/src/app/(protected)/categories/CategoriesAdmin.tsx:263` |
| What belongs in it (for AI suggestions) | `video_categories.hint` | entity-field | textarea |  | "" | `apps/admin-web/src/app/(protected)/categories/CategoriesAdmin.tsx:278` |

<a id="alummahnow-category-suggestions"></a>

### AlUmmahNow · category-suggestions (5)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Suggest categories with AI | `REPORTS_DB moderation_config categorize.enabled` | setting | toggle |  | true (no row = on; env AI_CATEGORIZE_ENABLED=false is the hard kill switch) | `apps/admin-web/src/app/(protected)/category-suggestions/CategorizeControls.tsx:57` |
| Daily neuron cap | `REPORTS_DB moderation_config categorize.dailyNeuronCap` | setting | number |  | per environment | `apps/admin-web/src/app/(protected)/category-suggestions/CategorizeControls.tsx:66` |
| Preselect threshold | `REPORTS_DB moderation_config categorize.threshold` | setting | number |  | 0.6 (CATEGORY_PRESELECT_THRESHOLD) | `apps/admin-web/src/app/(protected)/category-suggestions/CategorizeControls.tsx:71` |
| Dry run (count only) | `backfill dryRun` | action-option | checkbox |  | true | `apps/admin-web/src/app/(protected)/category-suggestions/CategorizeControls.tsx:124` |
| Change to | `change category to` | action-option | select |  |  | `apps/admin-web/src/components/CategorySuggestionsReview.tsx:117` |

<a id="alummahnow-channels"></a>

### AlUmmahNow · channels (12)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Name | `channels.name` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelActions.tsx:88` |
| Handle | `channels.handle` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelActions.tsx:92` |
| Description | `channels.description` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelActions.tsx:97` |
| Avatar | `channels.avatarUrl` | entity-field | other |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelActions.tsx:114` |
| Cover | `channels.coverUrl` | entity-field | other |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelActions.tsx:114` |
| Suspend channel / Unsuspend | `channels.isSuspended {reason}` | action-option | toggle |  | not suspended | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelActions.tsx:160` |
| Delete channel | `channel delete {reason}` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelActions.tsx:208` |
| New owner | `transfer newOwner` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelTransfer.tsx:143` |
| Keep the current owner on the team as channel admin | `transfer keepPreviousOwnerAsAdmin` | action-option | checkbox |  | false | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelTransfer.tsx:168` |
| Keep the public contact email | `transfer keepContactEmail` | action-option | checkbox |  | false | `apps/admin-web/src/app/(protected)/channels/[id]/ChannelTransfer.tsx:169` |
| Verified as | `channels.verified + verificationKind` | entity-field | radio | Scholar, Institution | not verified | `apps/admin-web/src/app/(protected)/channels/[id]/ScholarLabelDialog.tsx:88` |
| Reason | `verification reason` | action-option | textarea |  |  | `apps/admin-web/src/app/(protected)/channels/[id]/ScholarLabelDialog.tsx:99` |

<a id="alummahnow-comments"></a>

### AlUmmahNow · comments (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Delete (reason, optional) | `video comment delete {reason}` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/comments/page.tsx:94` |

<a id="alummahnow-community"></a>

### AlUmmahNow · community (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Delete (reason, optional) | `community post delete {reason}` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/community/page.tsx:92` |

<a id="alummahnow-contact"></a>

### AlUmmahNow · contact (7)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Status (bulk) | `contact_messages.status (bulk)` | action-option | select | Open, In progress, Replied, Closed, Spam | open | `apps/admin-web/src/app/(protected)/contact/ContactInbox.tsx:354` |
| Status | `contact_messages.status` | entity-field | select | Open, In progress, Replied, Closed, Spam | open | `apps/admin-web/src/app/(protected)/contact/[id]/ContactActions.tsx:133` |
| Assignee (Assign to me / Unassign) | `contact_messages.assignee` | entity-field | other |  | unassigned | `apps/admin-web/src/app/(protected)/contact/[id]/ContactActions.tsx:173` |
| Mark as spam / Not spam | `contact_messages spam flag` | entity-field | toggle |  | not spam | `apps/admin-web/src/app/(protected)/contact/[id]/ContactActions.tsx:206` |
| Reply | `reply body` | action-option | textarea |  |  | `apps/admin-web/src/app/(protected)/contact/[id]/ContactActions.tsx:268` |
| Email language | `reply locale` | action-option | radio | English, العربية | the sender’s language (the language they wrote in) | `apps/admin-web/src/app/(protected)/contact/[id]/ContactActions.tsx:281` |
| Note (staff only) | `internal note` | action-option | textarea |  |  | `apps/admin-web/src/app/(protected)/contact/[id]/ContactActions.tsx:304` |

<a id="alummahnow-costs"></a>

### AlUmmahNow · costs (17)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Budget alerts | `costs.subscriptions.me.kinds[budget]` | setting | checkbox |  | false (opt-in, nobody subscribed by default) | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:71` |
| Spend jumps | `costs.subscriptions.me.kinds[spike]` | setting | checkbox |  | false (opt-in, nobody subscribed by default) | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:71` |
| Weekly digest | `costs.subscriptions.me.kinds[digest]` | setting | checkbox |  | false (opt-in, nobody subscribed by default) | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:71` |
| Email language | `costs.subscriptions.me.locale` | setting | radio | English, العربية | the admin's saved alert language (me.locale) | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:82` |
| Monthly budget (USD) | `costs.settings.budgetUsd` | setting | number |  |  | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:165` |
| Budget alert levels (%) | `costs.settings.budgetLevels` | setting | list |  | per environment | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:166` |
| Alert when the month end is forecast over the budget | `costs.settings.projectedAlert` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:169` |
| Jump factor | `costs.settings.spikeFactor` | setting | number |  | 2 | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:178` |
| Minimum jump per resource (USD) | `costs.settings.spikeMinUsd` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:179` |
| Minimum jump per environment total (USD) | `costs.settings.spikeTotalMinUsd` | setting | number |  | 2 | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:180` |
| Send the weekly digest to those who opted in | `costs.settings.digestEnabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:188` |
| Day | `costs.settings.digestWeekday` | setting | select | Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday | 1 (Monday) | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:194` |
| Hour (New York time) | `costs.settings.digestHour` | setting | select | 00:00, 01:00, 02:00, 03:00, 04:00, 05:00, 06:00, 07:00, … 16 more | 9 | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:200` |
| Resend plan | `costs.settings.resendPlan` | setting | select | Free: 3,000 emails a month (a per-environment amount), Pro: a per-environment amount a month, 50,000 emails, Scale: a per-environment amount a month, 100,000 emails | free | `apps/admin-web/src/app/(protected)/costs/CostAlertForms.tsx:209` |
| New Cloudflare key | `costs.credentials.cloudflare` | setting | text |  |  | `apps/admin-web/src/app/(protected)/costs/CostConnections.tsx:148` |
| New Bunny key | `costs.credentials.bunny` | setting | text |  |  | `apps/admin-web/src/app/(protected)/costs/CostConnections.tsx:148` |
| New Resend key | `costs.credentials.resend` | setting | text |  |  | `apps/admin-web/src/app/(protected)/costs/CostConnections.tsx:148` |

<a id="alummahnow-deleted"></a>

### AlUmmahNow · deleted (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Restore / Delete permanently now | `deletion restore / permanent` | action-option | other | Restore, Delete permanently now |  | `apps/admin-web/src/app/(protected)/deleted/DeletionActions.tsx:21` |

<a id="alummahnow-delivery"></a>

### AlUmmahNow · delivery (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| New token | `troubleshoot-token` | setting | text |  |  | `apps/admin-web/src/app/(protected)/delivery/TranscodeTroubleshooting.tsx:555` |

<a id="alummahnow-emails"></a>

### AlUmmahNow · emails (19)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| English invites | `email_templates creator_invite defaultVideos.en` | entity-field | other |  | null (no video) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:241` |
| Arabic invites | `email_templates creator_invite defaultVideos.ar` | entity-field | other |  | null (no video) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:241` |
| Subject | `email_templates creator_invite copy.{en,ar}.subject` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Preview text | `email_templates creator_invite copy.{en,ar}.preheader` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Preview text when channels are attached | `email_templates creator_invite copy.{en,ar}.preheaderChannels` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Greeting | `email_templates creator_invite copy.{en,ar}.greeting` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Greeting when the invite has no name | `email_templates creator_invite copy.{en,ar}.greetingNoName` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Account sentence | `email_templates creator_invite copy.{en,ar}.account` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| When one new channel is attached | `email_templates creator_invite copy.{en,ar}.createdOne` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| When several new channels are attached | `email_templates creator_invite copy.{en,ar}.createdMany` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| When one existing channel is moved to them | `email_templates creator_invite copy.{en,ar}.transferredOne` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| When several existing channels are moved to them | `email_templates creator_invite copy.{en,ar}.transferredMany` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| How to sign in | `email_templates creator_invite copy.{en,ar}.how` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Button label | `email_templates creator_invite copy.{en,ar}.button` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Line above the video | `email_templates creator_invite copy.{en,ar}.videoIntro` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Picture description for screen readers | `email_templates creator_invite copy.{en,ar}.videoAlt` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Heading of the admin’s note | `email_templates creator_invite copy.{en,ar}.noteLabel` | entity-field | text |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Expiry line | `email_templates creator_invite copy.{en,ar}.expires` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |
| Why they got this email | `email_templates creator_invite copy.{en,ar}.reason` | entity-field | textarea |  | Seeded wording from admin-api migration 0036_email_templates.sql (updated by 0045 and 0049) | `apps/admin-web/src/app/(protected)/settings/emails/[slug]/EmailTemplateEditor.tsx:336` |

<a id="alummahnow-errors"></a>

### AlUmmahNow · errors (4)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Rebuild | `search index rebuild` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/errors/IndexRebuildButton.tsx:48` |
| Resolve / Ignore / Reopen | `error_groups.status` | entity-field | other | Resolve, Ignore, Reopen | new | `apps/admin-web/src/app/(protected)/errors/[id]/ErrorGroupActions.tsx:63` |
| Assign to me / Unassign | `error_groups.assignee` | entity-field | other |  | unassigned | `apps/admin-web/src/app/(protected)/errors/[id]/ErrorGroupActions.tsx:75` |
| Internal note | `error group note` | action-option | textarea |  |  | `apps/admin-web/src/app/(protected)/errors/[id]/ErrorGroupActions.tsx:133` |

<a id="alummahnow-features"></a>

### AlUmmahNow · features (39)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Uploads | `feature_switches.upload` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:126` |
| Creating channels | `feature_switches.createChannel` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:142` |
| Move from YouTube | `feature_switches.youtubeImport` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:158` |
| Bulk scheduling | `feature_switches.bulkSchedule` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:176` |
| Extra audio tracks | `feature_switches.audioTracks` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:191` |
| Live streaming | `feature_switches.live` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:206` |
| Live chat | `feature_switches.liveChat` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:223` |
| Video premieres | `feature_switches.livePremieres` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:240` |
| Live reminders | `feature_switches.liveReminders` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:257` |
| Live events | `feature_switches.liveEvents` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:274` |
| Transcription | `feature_switches.captionsTranscribe` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:292` |
| Caption translation | `feature_switches.captionsTranslate` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:309` |
| Translate button | `feature_switches.inlineTranslate` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:327` |
| Translated titles for viewers | `feature_switches.viewerTranslatedTitles` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:344` |
| Quran translation editions | `feature_switches.quranEditions` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:361` |
| Caption download for viewers | `feature_switches.viewerCaptionDownload` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:377` |
| Social auto-post | `feature_switches.socialAutopost` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:394` |
| AI category suggestions | `feature_switches.aiCategorySuggest` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:412` |
| Own domains | `feature_switches.siteDomains` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:430` |
| Creator support | `feature_switches.creatorSupport` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:446` |
| External support links | `feature_switches.supportExternalLinks` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:461` |
| Charity donations | `feature_switches.charityDonations` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:476` |
| Supporter perks | `feature_switches.supportPerks` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:491` |
| Prayer times | `feature_switches.prayerTimes` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:507` |
| Qibla direction | `feature_switches.qibla` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:522` |
| Hijri calendar | `feature_switches.hijriCalendar` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:537` |
| Ramadan and Islamic seasons | `feature_switches.ramadanMode` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:552` |
| Recitation tools | `feature_switches.recitationTools` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:567` |
| Intentional viewing | `feature_switches.intentionalViewing` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:582` |
| Private notes | `feature_switches.studyNotes` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:597` |
| Tier requests | `feature_switches.tierRequests` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:613` |
| Event calendar | `feature_switches.eventCalendar` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:630` |
| Notification quiet hours | `feature_switches.quietHours` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:646` |
| Newsletter sign-up | `feature_switches.newsletter` | setting | toggle | On, Off | true | `packages/shared-types/src/feature-registry.ts:663` |
| Listen mode | `feature_switches.listenMode` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:681` |
| Offline downloads | `feature_switches.offlineDownloads` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:696` |
| App update notices | `feature_switches.appUpdates` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:712` |
| Age rules | `feature_switches.ageRules` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:729` |
| Parents’ guide | `feature_switches.parentsGuide` | setting | toggle | On, Off | false | `packages/shared-types/src/feature-registry.ts:746` |

<a id="alummahnow-legacy-profiles"></a>

### AlUmmahNow · legacy-profiles (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Run | `legacy profile restore run` | action-option | other |  |  | `apps/admin-web/src/components/AdminJobActions.tsx:82` |

<a id="alummahnow-live-streaming"></a>

### AlUmmahNow · live-streaming (40)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Use the other provider when one fails to start a stream | `live routing fallback` | setting | toggle |  | true | `apps/admin-web/src/components/live/LiveStreamingView.tsx:241` |
| How new streams are assigned | `live routing mode` | setting | radio | Round-robin, Weighted split, Only Bunny, Only self-hosted | round_robin | `apps/admin-web/src/components/live/LiveStreamingView.tsx:337` |
| Split: Bunny / self-hosted | `live routing bunnyPercent` | setting | other |  | 50 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:359` |
| Enabled | `live routing providers.<provider>.enabled` | setting | toggle |  | true | `apps/admin-web/src/components/live/LiveStreamingView.tsx:470` |
| Bunny: Enabled | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.bunny.enabled` | setting | toggle |  | true | `apps/admin-web/src/components/live/LiveStreamingView.tsx:470` |
| Self-hosted: Enabled | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.selfhosted.enabled` | setting | toggle |  | true | `apps/admin-web/src/components/live/LiveStreamingView.tsx:470` |
| Drain | `live routing providers.<provider>.draining` | setting | toggle |  | false | `apps/admin-web/src/components/live/LiveStreamingView.tsx:471` |
| Bunny: Drain | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.bunny.draining` | setting | toggle |  | false | `apps/admin-web/src/components/live/LiveStreamingView.tsx:471` |
| Self-hosted: Drain | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.selfhosted.draining` | setting | toggle |  | false | `apps/admin-web/src/components/live/LiveStreamingView.tsx:471` |
| Reason (optional) | `live routing providers.<provider>.note` | setting | text |  | null | `apps/admin-web/src/components/live/LiveStreamingView.tsx:478` |
| Bunny: Reason (optional) | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.bunny.note` | setting | text |  | null | `apps/admin-web/src/components/live/LiveStreamingView.tsx:478` |
| Self-hosted: Reason (optional) | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.selfhosted.note` | setting | text |  | null | `apps/admin-web/src/components/live/LiveStreamingView.tsx:478` |
| Max concurrent streams | `live routing providers.<provider>.maxConcurrent` | setting | number |  | null (no limit) | `apps/admin-web/src/components/live/LiveStreamingView.tsx:483` |
| Bunny: Max concurrent streams | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.bunny.maxConcurrent` | setting | number |  | null (no limit) | `apps/admin-web/src/components/live/LiveStreamingView.tsx:483` |
| Self-hosted: Max concurrent streams | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.selfhosted.maxConcurrent` | setting | number |  | null (no limit) | `apps/admin-web/src/components/live/LiveStreamingView.tsx:483` |
| Monthly budget cap (USD) | `live routing providers.<provider>.monthlyBudgetUsd` | setting | number |  | null (no cap) | `apps/admin-web/src/components/live/LiveStreamingView.tsx:487` |
| Bunny: Monthly budget cap (USD) | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.bunny.monthlyBudgetUsd` | setting | number |  | null (no cap) | `apps/admin-web/src/components/live/LiveStreamingView.tsx:487` |
| Self-hosted: Monthly budget cap (USD) | `SEARCH_DB live settings (api-videos lib/live/store.ts).providers.selfhosted.monthlyBudgetUsd` | setting | number |  | null (no cap) | `apps/admin-web/src/components/live/LiveStreamingView.tsx:487` |
| Per stream-hour | `live routing rates.<provider>.perStreamHourUsd` | setting | number |  | bunny 0, selfhosted 0 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Per GB delivered | `live routing rates.<provider>.perDeliveredGbUsd` | setting | number |  | bunny 0.005, selfhosted 0 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Per million requests | `live routing rates.<provider>.perMillionRequestsUsd` | setting | number |  | bunny 0, selfhosted 0.3 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Per GB-month stored | `live routing rates.<provider>.perStoredGbMonthUsd` | setting | number |  | bunny 0.01, selfhosted 0.015 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Bunny: List-price rates (USD): Per stream-hour | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.bunny.perStreamHourUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Bunny: List-price rates (USD): Per GB delivered | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.bunny.perDeliveredGbUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Bunny: List-price rates (USD): Per million requests | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.bunny.perMillionRequestsUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Bunny: List-price rates (USD): Per GB-month stored | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.bunny.perStoredGbMonthUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Self-hosted: List-price rates (USD): Per stream-hour | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.selfhosted.perStreamHourUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Self-hosted: List-price rates (USD): Per GB delivered | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.selfhosted.perDeliveredGbUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Self-hosted: List-price rates (USD): Per million requests | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.selfhosted.perMillionRequestsUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Self-hosted: List-price rates (USD): Per GB-month stored | `SEARCH_DB live settings (api-videos lib/live/store.ts).rates.selfhosted.perStoredGbMonthUsd` | setting | number |  | per environment | `apps/admin-web/src/components/live/LiveStreamingView.tsx:504` |
| Low latency | `live routing selfhosted.lowLatency` | setting | toggle |  | false | `apps/admin-web/src/components/live/LiveStreamingView.tsx:535` |
| Record a replay (VOD) | `live routing selfhosted.recordVod` | setting | toggle |  | true | `apps/admin-web/src/components/live/LiveStreamingView.tsx:536` |
| Idle timeout (seconds) | `live routing selfhosted.idleTimeoutSec` | setting | number |  | 60 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:542` |
| QoE sample rate ({#0} to {#1}) | `live routing qoeSampleRate` | setting | number |  | 0.2 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:547` |
| QoE sample rate (0 to 1) | `SEARCH_DB live settings (api-videos lib/live/store.ts).qoeSampleRate` | setting | number |  | 0.2 | `apps/admin-web/src/components/live/LiveStreamingView.tsx:547` |
| Channel | `live overrides channelId` | entity-field | other |  |  | `apps/admin-web/src/components/live/LiveStreamingView.tsx:641` |
| Provider | `live overrides provider` | entity-field | select | Bunny, Self-hosted | selfhosted | `apps/admin-web/src/components/live/LiveStreamingView.tsx:646` |
| Note (optional) | `live overrides note` | entity-field | text |  | null | `apps/admin-web/src/components/live/LiveStreamingView.tsx:654` |
| Move next session to {provider} | `live session next provider` | action-option | other |  |  | `apps/admin-web/src/components/live/LiveStreamingView.tsx:811` |
| End | `live session end` | action-option | other |  |  | `apps/admin-web/src/components/live/LiveStreamingView.tsx:815` |

<a id="alummahnow-media-providers"></a>

### AlUmmahNow · media-providers (23)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Player fallbacks | `health.failureThreshold` | setting | number |  | 10 | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:38` |
| Within (minutes) | `health.windowMinutes` | setting | number |  | 5 | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:39` |
| Failed checks in a row | `health.probeFailures` | setting | number |  | 3 | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:40` |
| Stay out for (minutes) | `health.cooldownMinutes` | setting | number |  | 10 | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:41` |
| Bunny Stream on | `providers.bunny.enabled` | setting | toggle |  | true | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:270` |
| Cloudflare R2 on | `providers.r2.enabled` | setting | toggle |  | true | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:270` |
| Playback: Priority / Weighted | `playback.strategy` | setting | radio | Priority, Weighted | priority | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:320` |
| Draw | `playback.assign` | setting | radio | Per video, Per view | video | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:346` |
| Move playback off a failing provider | `health.enabled` | setting | toggle |  | true | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:362` |
| Custom thumbnails are stored in | `thumbnails.store` | setting | select | Bunny Stream, Cloudflare R2 | bunny | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:402` |
| Channel | `channels.<channelId>` | entity-field | other |  |  | `apps/admin-web/src/app/(protected)/media-providers/ProviderSettings.tsx:480` |
| Minimum at once | `media-transcode-limit.min` | setting | number |  | 4 | `apps/admin-web/src/app/(protected)/media-providers/R2Settings.tsx:140` |
| Maximum at once | `media-transcode-limit.max` | setting | number |  | 4 | `apps/admin-web/src/app/(protected)/media-providers/R2Settings.tsx:141` |
| Serves Bunny Stream | `playback.order[bunny]` | setting | checkbox |  | bunny: listed; r2: not listed | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:59` |
| Serves Cloudflare R2 | `playback.order[r2]` | setting | checkbox |  | bunny: listed; r2: not listed | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:59` |
| Weight for Bunny Stream | `playback.weights.bunny` | setting | number |  | bunny: 100; r2: 0 | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:81` |
| Weight for Cloudflare R2 | `playback.weights.r2` | setting | number |  | bunny: 100; r2: 0 | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:81` |
| New uploads go to: Bunny Stream | `ingest[bunny]` | setting | checkbox |  | true | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:111` |
| New uploads go to: Cloudflare R2 | `ingest[r2]` | setting | checkbox |  | true | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:111` |
| Choose upload providers for this channel | `channels.<channelId>.ingest` | entity-field | checkbox |  | unset (follows the global upload targets) | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:157` |
| Strategy | `channels.<channelId>.strategy` | entity-field | select | As above, Priority, Weighted | '' (as above) | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:175` |
| Choose playback providers for this channel | `channels.<channelId>.order / weights` | entity-field | checkbox |  | unset (follows the global order) | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:189` |
| Note (why) | `channels.<channelId>.note` | entity-field | text |  | '' | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:210` |

<a id="alummahnow-mobile-apps"></a>

### AlUmmahNow · mobile-apps (10)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Apple Team ID | `mobile_apps apple.teamId` | setting | text |  | '' (no Apple entries published) | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:200` |
| Bundle ids | `mobile_apps apple.apps[].bundleId + role` | setting | list | Viewer, Studio, Admin | viewer, viewer.mac, studio, studio.mac, admin, admin.mac under net.alummahnow.* (.qa suffix on QA/local) | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:227` |
| App Clip bundle id | `mobile_apps apple.appClipBundleId` | setting | text |  | net.alummahnow.viewer.clip (.qa on QA/local) | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:259` |
| App Attest | `mobile_apps apple.appAttest.enabled` | setting | checkbox |  | false | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:273` |
| App Attest environment | `mobile_apps apple.appAttest.environment` | setting | radio | Production (TestFlight and App Store builds), Development (Xcode builds) | production | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:284` |
| Android package | `mobile_apps android.apps[].packageName + role` | setting | list | Viewer, Studio, Admin | net.alummahnow.app, .studio, .admin (.qa on QA/local) | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:319` |
| SHA-256 signing certificate fingerprints, one per line | `mobile_apps android.apps[].sha256Fingerprints` | setting | textarea |  | [] (package left out of assetlinks.json) | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:327` |
| Play Integrity | `mobile_apps android.playIntegrity.enabled` | setting | checkbox |  | false | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:353` |
| Google Cloud project number | `mobile_apps android.playIntegrity.cloudProjectNumber` | setting | text |  | '' | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:369` |
| Client ids, one per line | `mobile_apps attestation.enforceClientIds` | setting | textarea |  | [] (proofs accepted, never required) | `apps/admin-web/src/app/(protected)/mobile-apps/MobileAppsForm.tsx:392` |

<a id="alummahnow-moderation"></a>

### AlUmmahNow · moderation (122)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Note (optional) | `note` | action-option | textarea |  |  | `apps/admin-web/src/app/(protected)/moderation/ai/[id]/actions.tsx:53` |
| Your review | `review decision` | action-option | other | Agree with AI, Disagree with AI |  | `apps/admin-web/src/app/(protected)/moderation/ai/[id]/actions.tsx:57` |
| Hide comment / Restore comment | `visibility` | action-option | other | Hide comment, Restore comment |  | `apps/admin-web/src/app/(protected)/moderation/ai/[id]/actions.tsx:70` |
| AI moderation enabled | `moderation_config.enabled` | setting | toggle |  | false (no D1 row = off; env AI_MODERATION_ENABLED=false also forces off) | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:84` |
| Platform categories classifier | `moderation_config.extensions_enabled` | setting | toggle |  | false | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:85` |
| Daily budget (neurons) | `moderation_config.daily_neuron_cap` | setting | number |  | per environment | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:88` |
| Live chat’s share of the daily neurons (%) | `moderation_config.live_chat_share` | setting | number |  | 25 (stored 0.25, DEFAULT_LIVE_CHAT_SHARE) | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:93` |
| Violent crimes: On | `moderation_config.policies.S1.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Non-violent crimes: On | `moderation_config.policies.S2.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Sex-related crimes: On | `moderation_config.policies.S3.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Child sexual exploitation: On | `moderation_config.policies.S4.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Defamation: On | `moderation_config.policies.S5.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Specialized advice: On | `moderation_config.policies.S6.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Privacy: On | `moderation_config.policies.S7.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Intellectual property: On | `moderation_config.policies.S8.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Indiscriminate weapons: On | `moderation_config.policies.S9.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Hate: On | `moderation_config.policies.S10.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Self-harm: On | `moderation_config.policies.S11.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Sexual content: On | `moderation_config.policies.S12.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Elections: On | `moderation_config.policies.S13.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Code interpreter abuse: On | `moderation_config.policies.S14.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Sectarian hate: On | `moderation_config.policies.sectarian_hate.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Violent extremism: On | `moderation_config.policies.violent_extremism.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Charity scam: On | `moderation_config.policies.charity_scam.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Impersonation: On | `moderation_config.policies.impersonation.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Harassment: On | `moderation_config.policies.harassment.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Spam: On | `moderation_config.policies.spam.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Sexual: On | `moderation_config.policies.sexual.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Health misinformation: On | `moderation_config.policies.misinfo_health.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Religious authenticity (scholar review): On | `moderation_config.policies.religious_authenticity.enabled` | setting | checkbox |  | false | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:126` |
| Violent crimes: Mode | `moderation_config.policies.S1.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Non-violent crimes: Mode | `moderation_config.policies.S2.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Sex-related crimes: Mode | `moderation_config.policies.S3.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Child sexual exploitation: Mode | `moderation_config.policies.S4.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Defamation: Mode | `moderation_config.policies.S5.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Specialized advice: Mode | `moderation_config.policies.S6.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Privacy: Mode | `moderation_config.policies.S7.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Intellectual property: Mode | `moderation_config.policies.S8.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Indiscriminate weapons: Mode | `moderation_config.policies.S9.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Hate: Mode | `moderation_config.policies.S10.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Self-harm: Mode | `moderation_config.policies.S11.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Sexual content: Mode | `moderation_config.policies.S12.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Elections: Mode | `moderation_config.policies.S13.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Code interpreter abuse: Mode | `moderation_config.policies.S14.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Sectarian hate: Mode | `moderation_config.policies.sectarian_hate.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Violent extremism: Mode | `moderation_config.policies.violent_extremism.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Charity scam: Mode | `moderation_config.policies.charity_scam.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Impersonation: Mode | `moderation_config.policies.impersonation.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Harassment: Mode | `moderation_config.policies.harassment.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Spam: Mode | `moderation_config.policies.spam.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Sexual: Mode | `moderation_config.policies.sexual.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Health misinformation: Mode | `moderation_config.policies.misinfo_health.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Religious authenticity (scholar review): Mode | `moderation_config.policies.religious_authenticity.mode` | setting | select | Shadow, Enforce | shadow | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:131` |
| Violent crimes: Threshold | `moderation_config.policies.S1.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Non-violent crimes: Threshold | `moderation_config.policies.S2.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Sex-related crimes: Threshold | `moderation_config.policies.S3.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Child sexual exploitation: Threshold | `moderation_config.policies.S4.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Defamation: Threshold | `moderation_config.policies.S5.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Specialized advice: Threshold | `moderation_config.policies.S6.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Privacy: Threshold | `moderation_config.policies.S7.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Intellectual property: Threshold | `moderation_config.policies.S8.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Indiscriminate weapons: Threshold | `moderation_config.policies.S9.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Hate: Threshold | `moderation_config.policies.S10.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Self-harm: Threshold | `moderation_config.policies.S11.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Sexual content: Threshold | `moderation_config.policies.S12.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Elections: Threshold | `moderation_config.policies.S13.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Code interpreter abuse: Threshold | `moderation_config.policies.S14.threshold` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Sectarian hate: Threshold | `moderation_config.policies.sectarian_hate.threshold` | setting | number |  | 0.7 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Violent extremism: Threshold | `moderation_config.policies.violent_extremism.threshold` | setting | number |  | 0.7 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Charity scam: Threshold | `moderation_config.policies.charity_scam.threshold` | setting | number |  | 0.9 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Impersonation: Threshold | `moderation_config.policies.impersonation.threshold` | setting | number |  | 0.7 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Harassment: Threshold | `moderation_config.policies.harassment.threshold` | setting | number |  | 0.7 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Spam: Threshold | `moderation_config.policies.spam.threshold` | setting | number |  | 0.9 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Sexual: Threshold | `moderation_config.policies.sexual.threshold` | setting | number |  | 0.7 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Health misinformation: Threshold | `moderation_config.policies.misinfo_health.threshold` | setting | number |  | 0.8 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Religious authenticity (scholar review): Threshold | `moderation_config.policies.religious_authenticity.threshold` | setting | number |  | 0.8 | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:138` |
| Violent crimes: Action | `moderation_config.policies.S1.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Non-violent crimes: Action | `moderation_config.policies.S2.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Sex-related crimes: Action | `moderation_config.policies.S3.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Child sexual exploitation: Action | `moderation_config.policies.S4.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Defamation: Action | `moderation_config.policies.S5.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Specialized advice: Action | `moderation_config.policies.S6.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Privacy: Action | `moderation_config.policies.S7.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Intellectual property: Action | `moderation_config.policies.S8.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Indiscriminate weapons: Action | `moderation_config.policies.S9.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Hate: Action | `moderation_config.policies.S10.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Self-harm: Action | `moderation_config.policies.S11.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Sexual content: Action | `moderation_config.policies.S12.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Elections: Action | `moderation_config.policies.S13.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Code interpreter abuse: Action | `moderation_config.policies.S14.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Sectarian hate: Action | `moderation_config.policies.sectarian_hate.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Violent extremism: Action | `moderation_config.policies.violent_extremism.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Charity scam: Action | `moderation_config.policies.charity_scam.action` | setting | select | None, Flag, Hide (reversible) | hide | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Impersonation: Action | `moderation_config.policies.impersonation.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Harassment: Action | `moderation_config.policies.harassment.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Spam: Action | `moderation_config.policies.spam.action` | setting | select | None, Flag, Hide (reversible) | hide | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Sexual: Action | `moderation_config.policies.sexual.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Health misinformation: Action | `moderation_config.policies.misinfo_health.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Religious authenticity (scholar review): Action | `moderation_config.policies.religious_authenticity.action` | setting | select | None, Flag | flag | `apps/admin-web/src/app/(protected)/moderation/ai/settings/SettingsForm.tsx:142` |
| Keep evidence for (days after the report) | `csam settings retentionDays (PUT /api/csam/settings)` | setting | number |  |  | `apps/admin-web/src/app/(protected)/moderation/csam/CsamAdmin.tsx:127` |
| Generate webhook secret / Replace webhook secret | `csam webhook secret` | setting | other |  | not set (alerts by email only) | `apps/admin-web/src/app/(protected)/moderation/csam/CsamAdmin.tsx:173` |
| CyberTipline report number | `case reportId` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/moderation/csam/[id]/CaseActions.tsx:125` |
| Submitted at (optional) | `case reportedAt` | entity-field | date |  |  | `apps/admin-web/src/app/(protected)/moderation/csam/[id]/CaseActions.tsx:142` |
| Put on legal hold / Lift the legal hold | `case legal hold {on, reason}` | entity-field | toggle |  | off | `apps/admin-web/src/app/(protected)/moderation/csam/[id]/CaseActions.tsx:168` |
| What the URL shows | `mapping.kind` | action-option | radio | A video, A community post, A profile picture or banner, A channel picture or banner | video | `apps/admin-web/src/app/(protected)/moderation/csam/[id]/CaseActions.tsx:265` |
| Which image | `mapping.field` | action-option | select | Picture (avatar), Banner (cover) | avatarUrl | `apps/admin-web/src/app/(protected)/moderation/csam/[id]/CaseActions.tsx:294` |
| Take Action | `action` | action-option | other | Issue Warning, Remove Content, Ban Content, Remove Permanently, Dismiss Report |  | `apps/admin-web/src/app/(protected)/moderation/reports/[id]/actions.tsx:117` |
| Notes (optional) | `notes` | action-option | textarea |  |  | `apps/admin-web/src/app/(protected)/moderation/reports/[id]/actions.tsx:140` |
| Turn on alerts / Alerts on | `review alerts (POST /api/review/alerts {on})` | setting | toggle |  | off | `apps/admin-web/src/app/(protected)/moderation/review/AlertsToggle.tsx:22` |
| Reason | `decision.reasonCode` | action-option | select | Sexual or indecent content, Child safety, Graphic violence, Self-harm, Hate speech, Violent extremism, Harassment, Spam or scam, … 6 more |  | `apps/admin-web/src/app/(protected)/moderation/review/[id]/ReviewWorkspace.tsx:249` |
| Note to the creator (optional) | `decision.note` | action-option | textarea |  |  | `apps/admin-web/src/app/(protected)/moderation/review/[id]/ReviewWorkspace.tsx:254` |
| Decision | `decision` | action-option | other | Approve, Reject, Escalate to a senior reviewer, Undo |  | `apps/admin-web/src/app/(protected)/moderation/review/[id]/ReviewWorkspace.tsx:256` |
| Mode | `video-review/settings.json:mode` | setting | radio | Off, Shadow (check and log only), Hold NSFW only, Full review | off | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:48` |
| Creator ETA for the automated check (minutes) | `video-review/settings.json:etaMinutes` | setting | number |  | 5 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:56` |
| Daily AI budget (USD) | `video-review/settings.json:dailyBudgetUsd` | setting | number |  | per environment | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:60` |
| Keep review media for (days after the decision) | `video-review/settings.json:mediaRetentionDays` | setting | number |  | 30 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:64` |
| Auto-approve below this risk | `video-review/settings.json:thresholds.autoApproveRisk` | setting | number |  | 0.15 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:73` |
| NSFW clear below | `video-review/settings.json:thresholds.nsfwClear` | setting | number |  | 0.1 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:73` |
| Stage 2 for frames from | `video-review/settings.json:thresholds.nsfwScreen` | setting | number |  | 0.2 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:73` |
| NSFW hit from (always holds) | `video-review/settings.json:thresholds.nsfwHit` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:73` |
| Escalate from | `video-review/settings.json:thresholds.escalate` | setting | number |  | 0.3 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:73` |
| Flag text from | `video-review/settings.json:thresholds.textFlag` | setting | number |  | 0.5 | `apps/admin-web/src/app/(protected)/moderation/review/settings/ReviewSettingsForm.tsx:73` |

<a id="alummahnow-newsletter"></a>

### AlUmmahNow · newsletter (4)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Subject (English) | `newsletter_issues.subject_en` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/newsletter/NewsletterAdmin.tsx:88` |
| Subject (Arabic) | `newsletter_issues.subject_ar` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/newsletter/NewsletterAdmin.tsx:88` |
| Text (English) | `newsletter_issues.body_en` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/newsletter/NewsletterAdmin.tsx:89` |
| Text (Arabic) | `newsletter_issues.body_ar` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/newsletter/NewsletterAdmin.tsx:89` |

<a id="alummahnow-payments"></a>

### AlUmmahNow · payments (25)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| User | `billing comp userId` | action-option | other |  |  | `apps/admin-web/src/components/payments/CompForm.tsx:116` |
| Tier | `billing comp tierId` | action-option | select |  |  | `apps/admin-web/src/components/payments/CompForm.tsx:125` |
| Until | `billing comp until` | action-option | date |  | empty (no end date) | `apps/admin-web/src/components/payments/CompForm.tsx:139` |
| Reason | `billing comp reason` | action-option | textarea |  |  | `apps/admin-web/src/components/payments/CompForm.tsx:148` |
| Sync prices to {provider} | `billing price sync` | action-option | other |  |  | `apps/admin-web/src/components/payments/PricesPanel.tsx:149` |
| Tier | `billing price tierId` | entity-field | select |  | first tier in the list | `apps/admin-web/src/components/payments/PricesPanel.tsx:179` |
| Period | `billing price period` | entity-field | select | Monthly, Yearly | month | `apps/admin-web/src/components/payments/PricesPanel.tsx:191` |
| Currency | `billing price currency` | entity-field | text |  | USD | `apps/admin-web/src/components/payments/PricesPanel.tsx:201` |
| Amount | `billing price amount` | entity-field | number |  |  | `apps/admin-web/src/components/payments/PricesPanel.tsx:214` |
| Active | `billing price active` | entity-field | toggle |  | true | `apps/admin-web/src/components/payments/PricesPanel.tsx:286` |
| Take payments with {provider} | `billing provider.enabled` | setting | toggle |  | false (payments off by default) | `apps/admin-web/src/components/payments/ProvidersPanel.tsx:130` |
| Mode | `billing provider.mode` | setting | radio | Test, Live | test | `apps/admin-web/src/components/payments/ProvidersPanel.tsx:141` |
| Merchant ID | `billing provider.settings merchantId.<mode>` | setting | text |  |  | `apps/admin-web/src/components/payments/ProvidersPanel.tsx:284` |
| API key | `Secrets Store billing credential <provider>.<field>.<mode>` | setting | text |  |  | `apps/admin-web/src/components/payments/ProvidersPanel.tsx:397` |
| Webhook signing secret | `Secrets Store billing credential <provider>.webhookSecret.<mode>` | setting | text |  |  | `apps/admin-web/src/components/payments/ProvidersPanel.tsx:397` |
| When | `billing cancel atPeriodEnd` | action-option | radio | At the end of the paid period, Now | at end of the paid period (when the provider allows it) | `apps/admin-web/src/components/payments/SubscriptionActions.tsx:64` |
| Amount to refund | `billing refund kind` | action-option | radio | Full refund, Part of it | full | `apps/admin-web/src/components/payments/SubscriptionActions.tsx:152` |
| Amount to refund | `billing refund amount` | action-option | number |  |  | `apps/admin-web/src/components/payments/SubscriptionActions.tsx:169` |
| Reason | `billing refund reason` | action-option | textarea |  |  | `apps/admin-web/src/components/payments/SubscriptionActions.tsx:179` |
| Legal name | `billing tax sellerName` | setting | text |  | null | `apps/admin-web/src/components/payments/TaxPanel.tsx:70` |
| VAT number | `billing tax taxId` | setting | text |  | null | `apps/admin-web/src/components/payments/TaxPanel.tsx:76` |
| Registered address | `billing tax sellerAddress` | setting | textarea |  | null | `apps/admin-web/src/components/payments/TaxPanel.tsx:85` |
| Country code | `billing tax sellerCountry` | setting | text |  | null | `apps/admin-web/src/components/payments/TaxPanel.tsx:92` |
| Tax rate shown to buyers (%) | `billing tax taxRatePercent` | setting | number |  | null (none shown) | `apps/admin-web/src/components/payments/TaxPanel.tsx:112` |
| Prices entered here include tax | `billing tax pricesIncludeTax` | setting | checkbox |  | true | `apps/admin-web/src/components/payments/TaxPanel.tsx:126` |

<a id="alummahnow-platform-settings"></a>

### AlUmmahNow · platform-settings (6)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Max download requests per day | `ops/download-rate-limit.json perDay` | setting | number |  | 100 | `apps/admin-web/src/app/(protected)/platform-settings/DownloadRateLimitSetting.tsx:160` |
| Burst limit per minute | `ops/download-rate-limit.json burstPerMinute` | setting | number |  | 10 | `apps/admin-web/src/app/(protected)/platform-settings/DownloadRateLimitSetting.tsx:190` |
| When the notification menu is opened | `ops/notifications.json menuOpen` | setting | radio | Clear the badge only, Mark the shown notifications as read | seen | `apps/admin-web/src/app/(protected)/platform-settings/NotificationMenuSetting.tsx:83` |
| Let creators import from YouTube | `youtube-import/settings.json enabled` | setting | checkbox |  | false | `apps/admin-web/src/app/(protected)/platform-settings/YoutubeImportSetting.tsx:196` |
| Google OAuth client ID | `youtube-import/settings.json clientId` | setting | text |  | '' (empty) | `apps/admin-web/src/app/(protected)/platform-settings/YoutubeImportSetting.tsx:217` |
| New client secret | `youtube-import client secret (sealed in api-videos settings; fallback Secrets Store google-oauth-client-secret[-qa\|-stage])` | setting | text |  |  | `apps/admin-web/src/app/(protected)/platform-settings/YoutubeImportSetting.tsx:303` |

<a id="alummahnow-playlists"></a>

### AlUmmahNow · playlists (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Delete (reason, optional) | `playlist delete {reason}` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/playlists/page.tsx:107` |

<a id="alummahnow-processing"></a>

### AlUmmahNow · processing (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Reason shown to the uploader (optional) | `markFailed.reason` | action-option | text |  | '' | `apps/admin-web/src/app/(protected)/processing/ProcessingTable.tsx:123` |

<a id="alummahnow-recently-deleted"></a>

### AlUmmahNow · recently-deleted (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Restore / Delete permanently now | `trash restore / purge` | action-option | other | Restore, Delete permanently now |  | `apps/admin-web/src/components/trash/RecentlyDeleted.tsx:69` |

<a id="alummahnow-review-alerts"></a>

### AlUmmahNow · review-alerts (12)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Send review alerts | `REPORTS_DB site_settings review-alerts:settings.enabled` | setting | toggle |  | true | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:175` |
| Alert every eligible reviewer after (minutes) | `REPORTS_DB site_settings review-alerts:settings.escalateAllAfterSeconds` | setting | number |  | 2 min (120 s) | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:185` |
| Alert senior reviewers and owners after (minutes) | `REPORTS_DB site_settings review-alerts:settings.escalateSeniorsAfterSeconds` | setting | number |  | 4 min (240 s) | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:186` |
| Owners (Add an owner) | `REPORTS_DB site_settings review-alerts:settings.owners` | setting | list |  | [] | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:204` |
| Senior reviewer | `REPORTS_DB site_settings review-alerts:settings.rota[].senior` | setting | checkbox |  | false | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:236` |
| Paused (no alerts at all) | `REPORTS_DB site_settings review-alerts:settings.rota[].paused` | setting | checkbox |  | false | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:243` |
| Days | `REPORTS_DB site_settings review-alerts:settings.rota[].shifts[].days` | setting | checkbox | Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday | [0,1,2,3,4] | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:257` |
| On-call rota (Add a reviewer) | `REPORTS_DB site_settings review-alerts:settings.rota[].userId` | setting | list |  | [] | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:286` |
| Sign out this device | `staff device push registration (DELETE /api/review-alerts/devices/:installId)` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/review-alerts/ReviewAlertsAdmin.tsx:464` |
| Time zone | `REPORTS_DB site_settings review-alerts:settings.rota[].timeZone` | setting | select |  | browser time zone, else UTC | `apps/admin-web/src/app/(protected)/review-alerts/fields.tsx:53` |
| From | `REPORTS_DB site_settings review-alerts:settings.rota[].shifts[].start` | setting | select |  | 09:00 | `apps/admin-web/src/app/(protected)/review-alerts/fields.tsx:163` |
| To | `REPORTS_DB site_settings review-alerts:settings.rota[].shifts[].end` | setting | select |  | 17:00 | `apps/admin-web/src/app/(protected)/review-alerts/fields.tsx:163` |

<a id="alummahnow-site-theme"></a>

### AlUmmahNow · site-theme (116)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Use this theme | `site_settings site.theme` | setting | radio | lantern, zujaj, nahas, fawanees, any published custom theme package | fawanees | `apps/admin-web/src/app/(protected)/site-theme/SiteThemePicker.tsx:52` |
| Use as site theme | `site.theme (from editor)` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:201` |
| Name (English) | `theme.json name.en` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:232` |
| Name (Arabic) | `theme.json name.ar` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:232` |
| Description (English) | `theme.json description.en` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:237` |
| Description (Arabic) | `theme.json description.ar` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:237` |
| Author | `theme.json author` | entity-field | text |  | Al Ummah Now | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:241` |
| background | `theme.json tokens.color.{light,dark}.background` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| surface | `theme.json tokens.color.{light,dark}.surface` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| surfaceRaised | `theme.json tokens.color.{light,dark}.surfaceRaised` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| heroStart | `theme.json tokens.color.{light,dark}.heroStart` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| heroEnd | `theme.json tokens.color.{light,dark}.heroEnd` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| textPrimary | `theme.json tokens.color.{light,dark}.textPrimary` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| textSecondary | `theme.json tokens.color.{light,dark}.textSecondary` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| textMuted | `theme.json tokens.color.{light,dark}.textMuted` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| link | `theme.json tokens.color.{light,dark}.link` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| successText | `theme.json tokens.color.{light,dark}.successText` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| errorText | `theme.json tokens.color.{light,dark}.errorText` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| primary | `theme.json tokens.color.{light,dark}.primary` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onPrimary | `theme.json tokens.color.{light,dark}.onPrimary` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| primaryHover | `theme.json tokens.color.{light,dark}.primaryHover` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onPrimaryHover | `theme.json tokens.color.{light,dark}.onPrimaryHover` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| primaryPressed | `theme.json tokens.color.{light,dark}.primaryPressed` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onPrimaryPressed | `theme.json tokens.color.{light,dark}.onPrimaryPressed` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| primaryDisabled | `theme.json tokens.color.{light,dark}.primaryDisabled` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onPrimaryDisabled | `theme.json tokens.color.{light,dark}.onPrimaryDisabled` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| primaryEdge | `theme.json tokens.color.{light,dark}.primaryEdge` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| primarySheen | `theme.json tokens.color.{light,dark}.primarySheen` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| motif | `theme.json tokens.color.{light,dark}.motif` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| secondary | `theme.json tokens.color.{light,dark}.secondary` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onSecondary | `theme.json tokens.color.{light,dark}.onSecondary` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| verifiedFill | `theme.json tokens.color.{light,dark}.verifiedFill` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onVerifiedFill | `theme.json tokens.color.{light,dark}.onVerifiedFill` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| errorFill | `theme.json tokens.color.{light,dark}.errorFill` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onErrorFill | `theme.json tokens.color.{light,dark}.onErrorFill` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| live | `theme.json tokens.color.{light,dark}.live` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| onLive | `theme.json tokens.color.{light,dark}.onLive` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| accent | `theme.json tokens.color.{light,dark}.accent` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| focusRing | `theme.json tokens.color.{light,dark}.focusRing` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| focusGlow | `theme.json tokens.color.{light,dark}.focusGlow` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| verifiedIcon | `theme.json tokens.color.{light,dark}.verifiedIcon` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| outline | `theme.json tokens.color.{light,dark}.outline` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| divider | `theme.json tokens.color.{light,dark}.divider` | entity-field | color |  | copied from the theme it was duplicated from | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:251` |
| night | `theme.json tokens.brand.night` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| nightDeep | `theme.json tokens.brand.nightDeep` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| nightShallow | `theme.json tokens.brand.nightShallow` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| lantern | `theme.json tokens.brand.lantern` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| glow | `theme.json tokens.brand.glow` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| earth | `theme.json tokens.brand.earth` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| parchment | `theme.json tokens.brand.parchment` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| verified | `theme.json tokens.brand.verified` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| error | `theme.json tokens.brand.error` | entity-field | color |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:262` |
| Page | `theme.json components.page.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Header | `theme.json components.header.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Navigation drawer | `theme.json components.drawer.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Side rail and tab bar | `theme.json components.sidebar.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Primary button | `theme.json components.buttonPrimary.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Secondary button | `theme.json components.buttonSecondary.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Ghost button | `theme.json components.buttonGhost.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Destructive button | `theme.json components.buttonDestructive.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Icon button | `theme.json components.buttonIcon.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Upload action | `theme.json components.upload.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Inputs and switches | `theme.json components.input.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Cards, pills and action buttons | `theme.json components.card.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Video card | `theme.json components.videoCard.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Channel card | `theme.json components.channelCard.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Hero and cover | `theme.json components.hero.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Tabs | `theme.json components.tabs.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Chips and segments | `theme.json components.segment.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Menus and popovers | `theme.json components.menu.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Dialogs | `theme.json components.dialog.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Toasts | `theme.json components.toast.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Badges | `theme.json components.badge.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Video player | `theme.json components.player.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Footer | `theme.json components.footer.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Links | `theme.json components.link.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Dividers | `theme.json components.divider.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Loading skeletons | `theme.json components.skeleton.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Empty states | `theme.json components.empty.{colors.light,colors.dark,style}` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:272` |
| Player controls | `theme.json components.player.chrome.*` | entity-field | other |  | copied from the source theme | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:296` |
| radius.sm | `theme.json materials.radius.sm` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:308` |
| radius.md | `theme.json materials.radius.md` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:308` |
| radius.lg | `theme.json materials.radius.lg` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:308` |
| radius.xl | `theme.json materials.radius.xl` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:308` |
| radius.pill | `theme.json materials.radius.pill` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:308` |
| Glow | `theme.json materials.glow` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:314` |
| Backdrop blur | `theme.json materials.blur` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:315` |
| Hover wash | `theme.json materials.hover` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:316` |
| radius.none | `theme.json tokens.radius.none` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:318` |
| radius.sm | `theme.json tokens.radius.sm` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:318` |
| radius.md | `theme.json tokens.radius.md` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:318` |
| radius.lg | `theme.json tokens.radius.lg` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:318` |
| radius.xl | `theme.json tokens.radius.xl` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:318` |
| radius.full | `theme.json tokens.radius.full` | entity-field | number |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:318` |
| Elevation low | `theme.json tokens.elevation.low.{offsetX,offsetY,blur,spread,color}` | entity-field | other |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:324` |
| Elevation medium | `theme.json tokens.elevation.medium.{offsetX,offsetY,blur,spread,color}` | entity-field | other |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:324` |
| Elevation high | `theme.json tokens.elevation.high.{offsetX,offsetY,blur,spread,color}` | entity-field | other |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:324` |
| Latin font | `theme.json typography.latin` | entity-field | select | Inter, IBM Plex Sans, IBM Plex Sans Arabic, Noto Kufi Arabic, Amiri, Source Serif 4, Georgia, system-ui, … 2 more |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:345` |
| Arabic font | `theme.json typography.arabic` | entity-field | select | Inter, IBM Plex Sans, IBM Plex Sans Arabic, Noto Kufi Arabic, Amiri, Source Serif 4, Georgia, system-ui, … 2 more |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:345` |
| Use these fonts for page text | `theme.json typography.body` | entity-field | checkbox |  | off (headings fonts used for page text) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:350` |
| Page text (Latin) | `theme.json typography.body.latin` | entity-field | select | Inter, IBM Plex Sans, IBM Plex Sans Arabic, Noto Kufi Arabic, Amiri, Source Serif 4, Georgia, system-ui, … 2 more |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:354` |
| Page text (Arabic) | `theme.json typography.body.arabic` | entity-field | select | Inter, IBM Plex Sans, IBM Plex Sans Arabic, Noto Kufi Arabic, Amiri, Source Serif 4, Georgia, system-ui, … 2 more |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:354` |
| Font files | `theme.json typography.faces[].{family,weight}` | entity-field | list | 300, 400, 500, 600, 700, 800 | [] | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:361` |
| logo | `theme.json imagery.logo.{light,dark}` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| wordmark | `theme.json imagery.wordmark.{light,dark}` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| headerGraphic | `theme.json imagery.headerGraphic.{light,dark}` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| pattern | `theme.json imagery.pattern` | entity-field | select |  | '' (no file) ('none' allowed) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| ornament | `theme.json imagery.ornament` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| backdrop | `theme.json imagery.backdrop` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| hero | `theme.json imagery.hero` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| loader | `theme.json imagery.loader` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| favicon | `theme.json imagery.favicon` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| ogImage | `theme.json imagery.ogImage` | entity-field | select |  | '' (no file) | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:374` |
| How the header art sits | `theme.json imagery.headerGraphicFrame` | entity-field | select | Inside the box, A band along the top edge, fading into the box | inset | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeEditor.tsx:398` |
| Name (English) | `new theme name.en (duplicate dialog)` | action-option | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeLibrary.tsx:97` |
| Name (Arabic) | `new theme name.ar (duplicate dialog)` | action-option | text |  |  | `apps/admin-web/src/app/(protected)/site-theme/builder/ThemeLibrary.tsx:100` |

<a id="alummahnow-sites"></a>

### AlUmmahNow · sites (16)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Make main address | `site primary host` | action-option | other |  |  | `apps/admin-web/src/components/sites/SiteDomainsPanel.tsx:94` |
| Domain | `site domains host` | entity-field | text |  |  | `apps/admin-web/src/components/sites/SiteDomainsPanel.tsx:116` |
| Own domains | `site limits.customDomainsMax (site.customDomains.max)` | entity-field | number |  | white-label 0, white-label-domain 2 | `apps/admin-web/src/components/sites/SitesView.tsx:76` |
| Pages | `site limits.pagesMax (site.pages.max)` | entity-field | number |  | white-label 20, white-label-domain 100 | `apps/admin-web/src/components/sites/SitesView.tsx:77` |
| Menu items | `site limits.navigationMax (site.navigation.max)` | entity-field | number |  | white-label 8, white-label-domain 12 | `apps/admin-web/src/components/sites/SitesView.tsx:78` |
| Al Ummah Now mark | `site limits.platformMark (site.platformMark)` | entity-field | select | Footer band, Small link, None | white-label minimal, white-label-domain none | `apps/admin-web/src/components/sites/SitesView.tsx:81` |
| Site analytics | `site limits.analytics (site.analytics)` | entity-field | checkbox |  | true | `apps/admin-web/src/components/sites/SitesView.tsx:88` |
| Branded sign-in | `site limits.brandedSignIn (site.brandedSignIn)` | entity-field | checkbox |  | white-label false, white-label-domain true | `apps/admin-web/src/components/sites/SitesView.tsx:92` |
| Channel | `site channelId` | entity-field | other |  |  | `apps/admin-web/src/components/sites/SitesView.tsx:150` |
| Tier | `site tier` | entity-field | select | White-label, White-label + domain | white-label | `apps/admin-web/src/components/sites/SitesView.tsx:162` |
| Subdomain | `site slug` | entity-field | text |  | suggested from the channel handle | `apps/admin-web/src/components/sites/SitesView.tsx:175` |
| Languages | `site locales` | entity-field | select | English and Arabic (English first), Arabic and English (Arabic first), English only, Arabic only | en,ar | `apps/admin-web/src/components/sites/SitesView.tsx:180` |
| Make live | `site status` | action-option | other |  |  | `apps/admin-web/src/components/sites/SitesView.tsx:254` |
| Suspend | `site status` | action-option | other |  |  | `apps/admin-web/src/components/sites/SitesView.tsx:260` |
| Take the site away | `site status` | action-option | other |  |  | `apps/admin-web/src/components/sites/SitesView.tsx:275` |
| Change subdomain | `site slug` | entity-field | text |  |  | `apps/admin-web/src/components/sites/SitesView.tsx:290` |

<a id="alummahnow-social"></a>

### AlUmmahNow · social (9)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Post to social networks | `social settings enabled (overridden by feature switch socialAutopost once set)` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:177` |
| Post to X | `social settings networks.x.enabled` | setting | checkbox |  | false | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:192` |
| Post to Telegram | `social settings networks.telegram.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:192` |
| Post to Bluesky | `social settings networks.bluesky.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:192` |
| Post to Mastodon | `social settings networks.mastodon.enabled` | setting | checkbox |  | true | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:192` |
| Monthly cap (US$) | `social settings xMonthlyCapUsd` | setting | number |  | per environment | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:212` |
| Client ID | `social credentials x.clientId` | setting | text |  |  | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:254` |
| Client secret | `social credentials x.clientSecret` | setting | text |  |  | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:258` |
| Bot token | `social credentials telegram.botToken` | setting | text |  |  | `apps/admin-web/src/app/(protected)/social/SocialPostingView.tsx:285` |

<a id="alummahnow-stale-uploads"></a>

### AlUmmahNow · stale-uploads (2)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Automatic clean-up: Turn on automatic deletion / Back to dry run | `uploads reaper mode (POST /api/stale-uploads/mode; api-videos /internal/uploads/mode)` | setting | toggle | Dry run, Live | dry-run | `apps/admin-web/src/app/(protected)/stale-uploads/ReaperPanel.tsx:128` |
| Delete now / Keep / Retry | `stale upload action` | action-option | other | Delete now, Keep, Retry |  | `apps/admin-web/src/app/(protected)/stale-uploads/StaleUploadsTable.tsx:101` |

<a id="alummahnow-status"></a>

### AlUmmahNow · status (17)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Type | `incident.kind` | entity-field | radio | Incident, Scheduled maintenance | incident | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:91` |
| Title (English) | `incident.titleEn` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:97` |
| Title (Arabic) | `incident.titleAr` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:97` |
| Message (English) | `incident.bodyEn` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:98` |
| Message (Arabic) | `incident.bodyAr` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:98` |
| Status | `incident.status` | entity-field | select | Investigating, Identified, Monitoring, Resolved, Scheduled (maintenance), In progress (maintenance), Completed (maintenance) | first in list: investigating / scheduled | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:102` |
| Impact | `incident.impact` | entity-field | select | No impact, Degraded performance, Partial outage, Major outage | partial | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:109` |
| Starts | `incident.startsAt` | entity-field | date |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:119` |
| Ends | `incident.endsAt` | entity-field | date |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:123` |
| Affected components | `incident.components` | entity-field | checkbox | Website, Videos site, Sign-in, Profile, Uploads, Playback, Live streaming, Notifications & realtime, … 7 more | none (at least one required) | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:134` |
| Status | `incidentUpdate.status` | entity-field | select | Investigating, Identified, Monitoring, Resolved, Scheduled, In progress, Completed | the incident's current status | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:177` |
| Impact | `incidentUpdate.impact` | entity-field | select | No impact, Degraded performance, Partial outage, Major outage | the incident's current impact | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:184` |
| Message (English) | `incidentUpdate.bodyEn` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:190` |
| Message (Arabic) | `incidentUpdate.bodyAr` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/status/StatusAdmin.tsx:190` |
| Name | `webhook.name` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/status/StatusSubscriptions.tsx:123` |
| URL (https) | `webhook.url` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/status/StatusSubscriptions.tsx:127` |
| Email address | `subscriber.email` | action-option | text |  |  | `apps/admin-web/src/app/(protected)/status/StatusSubscriptions.tsx:160` |

<a id="alummahnow-tier-requests"></a>

### AlUmmahNow · tier-requests (2)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Allow tier requests | `SEARCH_DB creator_tier_settings requests-allowed (Features switch tierRequests overlays it)` | setting | toggle |  | true (no row = allowed) | `apps/admin-web/src/components/tier-requests/AllowRequestsSwitch.tsx:65` |
| Approve / Decline | `tier request decision {decision, reason}` | action-option | other | Approve, Decline |  | `apps/admin-web/src/components/tier-requests/TierRequestActions.tsx:58` |

<a id="alummahnow-tiers"></a>

### AlUmmahNow · tiers (23)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Set as default | `creator_tier_settings.default_tier_id` | setting | other |  | member (DEFAULT_TIER_ID; "none" means no default) | `apps/admin-web/src/components/creators/DefaultTierButton.tsx:66` |
| Hidden | `creator_tiers.hidden` | entity-field | checkbox |  | false | `apps/admin-web/src/components/creators/TierEditor.tsx:103` |
| Unlimited (no limits at all) | `creator_tiers.unlimited` | entity-field | checkbox |  | false (fixed on for the shipped Unlimited tier) | `apps/admin-web/src/components/creators/TierEditor.tsx:241` |
| Name | `creator_tiers.name / name_ar` | entity-field | text |  |  | `apps/admin-web/src/components/creators/TierEditor.tsx:253` |
| Description | `creator_tiers.description / description_ar` | entity-field | textarea |  |  | `apps/admin-web/src/components/creators/TierEditor.tsx:265` |
| Upload videos | `creator_tiers.uploads` | entity-field | checkbox |  | true | `apps/admin-web/src/components/creators/TierEditor.tsx:282` |
| Create channels | `creator_tiers.channels` | entity-field | checkbox |  | true | `apps/admin-web/src/components/creators/TierEditor.tsx:283` |
| Can be requested | `creator_tiers.requestable` | entity-field | checkbox |  | false (Creator tier ships true) | `apps/admin-web/src/components/creators/TierEditor.tsx:295` |
| Uploads per hour | `creator_tiers.perHour` | entity-field | number |  | 300 | `apps/admin-web/src/components/creators/TierEditor.tsx:307` |
| Uploads per day | `creator_tiers.perDay` | entity-field | number |  | 2000 | `apps/admin-web/src/components/creators/TierEditor.tsx:308` |
| Uploads starting at once | `creator_tiers.maxConcurrent` | entity-field | number |  | 20 | `apps/admin-web/src/components/creators/TierEditor.tsx:309` |
| Channels they may own | `creator_tiers.max_channels` | entity-field | number |  | 3 (empty = no limit) | `apps/admin-web/src/components/creators/TierEditor.tsx:324` |
| Caption minutes per month | `creator_tiers.caption_minutes_month` | entity-field | number |  | 0 | `apps/admin-web/src/components/creators/TierEditor.tsx:331` |
| Audio tracks per video | `creator_tiers.audio_tracks_per_video` | entity-field | number |  | 0 | `apps/admin-web/src/components/creators/TierEditor.tsx:332` |
| Allowed | `creator_tiers.live` | entity-field | checkbox |  | false for a new tier (Creator ships true) | `apps/admin-web/src/components/creators/TierEditor.tsx:350` |
| Live hours per month | `creator_tiers.liveHoursMonth` | entity-field | number |  | 20 | `apps/admin-web/src/components/creators/TierEditor.tsx:359` |
| Streams live at once | `creator_tiers.liveMaxConcurrent` | entity-field | number |  | 1 | `apps/admin-web/src/components/creators/TierEditor.tsx:360` |
| Longest stream (minutes) | `creator_tiers.liveMaxStreamMinutes` | entity-field | number |  | 240 | `apps/admin-web/src/components/creators/TierEditor.tsx:361` |
| Live chat | `creator_tiers.liveChat` | entity-field | checkbox |  | true (unset follows Live) | `apps/admin-web/src/components/creators/TierEditor.tsx:366` |
| Premieres | `creator_tiers.livePremieres` | entity-field | checkbox |  | true (unset follows Live) | `apps/admin-web/src/components/creators/TierEditor.tsx:367` |
| Event tags | `creator_tiers.liveEvents` | entity-field | checkbox |  | true (unset follows Live) | `apps/admin-web/src/components/creators/TierEditor.tsx:368` |
| YouTube imports count against upload limits | `creator_tiers.import_counts_against_limits` | entity-field | toggle |  | true | `apps/admin-web/src/components/creators/TierEditor.tsx:395` |
| Rank | `creator_tiers.sort_order` | setting | list |  | Free lowest, Creator in between, Unlimited on top (new tier sortOrder 50) | `apps/admin-web/src/components/creators/TierRankList.tsx:100` |

<a id="alummahnow-translations"></a>

### AlUmmahNow · translations (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Value | `i18n translations <locale>.<section>.<key> (stored overrides)` | setting | textarea |  | the repo's static text for that key | `apps/admin-web/src/app/(protected)/translations/components/TranslationEditor.tsx:252` |

<a id="alummahnow-users"></a>

### AlUmmahNow · users (17)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Display name | `users.displayName (videos profile)` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/users/[id]/UserActions.tsx:54` |
| User name | `users.userName` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/users/[id]/UserActions.tsx:58` |
| Bio | `users.bio` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/users/[id]/UserActions.tsx:63` |
| Ban on videos / Lift the ban | `users ban {reason}` | action-option | toggle |  | not banned | `apps/admin-web/src/app/(protected)/users/[id]/UserActions.tsx:80` |
| Delete videos data | `users delete data {reason}` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/users/[id]/UserActions.tsx:94` |
| Requested action | `auth request action` | action-option | select | Suspend account, Delete account, Sign out everywhere, Require password reset, Other |  | `apps/admin-web/src/components/auth-requests/UserAuthRequestsPanel.tsx:207` |
| Reason | `auth request reason_category` | action-option | select | Spam, Harassment, Hate speech, Violent content, Sexual content, Impersonation, Copyright, Fraud, … 2 more |  | `apps/admin-web/src/components/auth-requests/UserAuthRequestsPanel.tsx:215` |
| What happened | `auth request reason` | action-option | textarea |  |  | `apps/admin-web/src/components/auth-requests/UserAuthRequestsPanel.tsx:223` |
| Note for the auth admins (optional) | `auth request note` | action-option | textarea |  |  | `apps/admin-web/src/components/auth-requests/UserAuthRequestsPanel.tsx:227` |
| Answer the auth admins | `auth request answer` | action-option | textarea |  |  | `apps/admin-web/src/components/auth-requests/UserAuthRequestsPanel.tsx:299` |
| Minutes | `caption grant minutes` | action-option | number |  | 60 | `apps/admin-web/src/components/creators/CaptionGrantControls.tsx:119` |
| Applies | `caption grant scope` | action-option | radio | This month only, Until used (any month, after the monthly allowance) | month | `apps/admin-web/src/components/creators/CaptionGrantControls.tsx:139` |
| Reason | `caption grant reason` | action-option | text |  |  | `apps/admin-web/src/components/creators/CaptionGrantControls.tsx:147` |
| Why it is revoked | `caption grant revoke reason` | action-option | text |  |  | `apps/admin-web/src/components/creators/CaptionGrantControls.tsx:236` |
| Change the tier of {name} | `creator tier assignment (tierId)` | entity-field | select |  | the admin-chosen default tier (Free/member if none) | `apps/admin-web/src/components/creators/CreatorTierControl.tsx:150` |
| Choose a tier | `creator tier assignment (bulk)` | action-option | select |  |  | `apps/admin-web/src/components/users/UsersTable.tsx:118` |
| Change the tier of {name} | `creator tier assignment (per row)` | entity-field | select |  | the admin-chosen default tier | `apps/admin-web/src/components/users/UsersTable.tsx:216` |

<a id="alummahnow-users-invites"></a>

### AlUmmahNow · users-invites (14)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Email language (Resend) | `invite resend locale` | action-option | radio | English, العربية | the invite’s saved language | `apps/admin-web/src/components/invites/InviteActions.tsx:87` |
| Revoke / Restore / Delete permanently now | `invite revoke/restore/purge` | action-option | other | Revoke, Restore, Delete permanently now |  | `apps/admin-web/src/components/invites/InviteActions.tsx:110` |
| Email | `invite.email` | entity-field | text |  |  | `apps/admin-web/src/components/invites/InviteForm.tsx:146` |
| Display name | `invite.name` | entity-field | text |  |  | `apps/admin-web/src/components/invites/InviteForm.tsx:195` |
| Tier | `invite.tierId` | entity-field | select |  | the admin-chosen default creator tier | `apps/admin-web/src/components/invites/InviteForm.tsx:201` |
| Scholar (writes articles on www) | `invite.scholar` | entity-field | checkbox |  | false | `apps/admin-web/src/components/invites/InviteForm.tsx:213` |
| Link works for (days) | `invite.days` | entity-field | number |  | 14 | `apps/admin-web/src/components/invites/InviteForm.tsx:218` |
| Note to them (optional) | `invite.note` | entity-field | textarea |  |  | `apps/admin-web/src/components/invites/InviteForm.tsx:222` |
| New channel name | `invite.channels.new[].name` | entity-field | text |  |  | `apps/admin-web/src/components/invites/InviteForm.tsx:255` |
| Handle (optional) | `invite.channels.new[].handle` | entity-field | text |  |  | `apps/admin-web/src/components/invites/InviteForm.tsx:265` |
| Give an existing channel | `invite.channels.transfer[]` | entity-field | list |  |  | `apps/admin-web/src/components/invites/InviteForm.tsx:283` |
| Email language | `invite email locale` | action-option | radio | English, العربية | the admin UI language | `apps/admin-web/src/components/invites/InviteForm.tsx:308` |
| Video (English) | `invite.videos.en` | entity-field | other |  | creator invite email default (English) | `apps/admin-web/src/components/invites/InviteVideoPickers.tsx:54` |
| Video (العربية) | `invite.videos.ar` | entity-field | other |  | creator invite email default (Arabic) | `apps/admin-web/src/components/invites/InviteVideoPickers.tsx:54` |

<a id="alummahnow-video-formats"></a>

### AlUmmahNow · video-formats (2)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Format backfill | `format backfill run mode` | action-option | other | Dry run, Run backfill |  | `apps/admin-web/src/app/(protected)/video-formats/VideoFormatActions.tsx:42` |
| Set format | `video format (per flagged video)` | action-option | other | Short, Video |  | `apps/admin-web/src/app/(protected)/video-formats/VideoFormatActions.tsx:77` |

<a id="alummahnow-videos"></a>

### AlUmmahNow · videos (12)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Title | `videos.title` | entity-field | text |  |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:83` |
| Description | `videos.description` | entity-field | textarea |  |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:87` |
| Visibility | `videos.isPublic` | entity-field | radio | Public, Private |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:93` |
| Thumbnail | `videos.thumbnail` | entity-field | other |  |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:104` |
| Unpublish / Republish | `videos.unpublished` | action-option | toggle |  | published | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:150` |
| Reprocess in Bunny | `reprocess` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:165` |
| Target channel | `move targetChannel` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:182` |
| Delete video | `video delete {reason}` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoActions.tsx:209` |
| Transcode to R2 / Retry | `R2 transcode` | action-option | other |  |  | `apps/admin-web/src/app/(protected)/videos/[id]/VideoR2Panel.tsx:68` |
| Reason shown to the uploader (optional) | `processing markFailed reason` | action-option | text |  |  | `apps/admin-web/src/app/(protected)/videos/extensions.tsx:63` |
| Choose playback providers | `video playback override.order` | entity-field | list |  | inherited order | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:184` |
| Note | `video playback override.note` | entity-field | text |  |  | `apps/admin-web/src/components/media/ProviderOrderEditor.tsx:211` |

## Auth admin (apps/admin)

<a id="alummahnowauth-moderation"></a>

### AlUmmahNowAuth · moderation (2)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Note for the requesting app, required to reject or to ask for more information | `moderation_requests.decision_note` | action-option | textarea |  |  | `apps/admin/app/routes/moderation.$id.tsx:214` |
| Decide | `moderation_requests decision (_action)` | action-option | radio | Approve / Approve and run, Reject, Request more info, Run action again, Mark actioned |  | `apps/admin/app/routes/moderation.$id.tsx:223` |

<a id="alummahnowauth-oauth-clients"></a>

### AlUmmahNowAuth · oauth-clients (20)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Client Name * | `oauth_clients.name` | entity-field | text |  |  | `apps/admin/app/routes/clients.tsx:621` |
| Redirect URIs (one per line) (create dialog) | `oauth_clients.redirect_uris` | entity-field | textarea |  |  | `apps/admin/app/routes/clients.tsx:631` |
| Grant Types: Authorization Code | `oauth_clients.grant_types[authorization_code]` | entity-field | checkbox | allowed, not allowed | true | `apps/admin/app/routes/clients.tsx:646` |
| Grant Types: Refresh Token | `oauth_clients.grant_types[refresh_token]` | entity-field | checkbox | allowed, not allowed | true | `apps/admin/app/routes/clients.tsx:646` |
| Grant Types: Client Credentials | `oauth_clients.grant_types[client_credentials]` | entity-field | checkbox | allowed, not allowed | false | `apps/admin/app/routes/clients.tsx:646` |
| Scopes: OpenID | `oauth_clients.scopes[openid]` | entity-field | checkbox | granted, not granted | true | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Profile | `oauth_clients.scopes[profile]` | entity-field | checkbox | granted, not granted | true | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Email | `oauth_clients.scopes[email]` | entity-field | checkbox | granted, not granted | true | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Offline Access | `oauth_clients.scopes[offline_access]` | entity-field | checkbox | granted, not granted | false | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Admin | `oauth_clients.scopes[admin]` | entity-field | checkbox | granted, not granted | false | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Admin: Users | `oauth_clients.scopes[admin:users]` | entity-field | checkbox | granted, not granted | false | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Admin: Roles | `oauth_clients.scopes[admin:roles]` | entity-field | checkbox | granted, not granted | false | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Admin: Clients | `oauth_clients.scopes[admin:clients]` | entity-field | checkbox | granted, not granted | false | `apps/admin/app/routes/clients.tsx:662` |
| Scopes: Admin: Audit | `oauth_clients.scopes[admin:audit]` | entity-field | checkbox | granted, not granted | false | `apps/admin/app/routes/clients.tsx:662` |
| Metadata (JSON) | `oauth_clients.metadata` | entity-field | textarea |  | {} | `apps/admin/app/routes/clients.tsx:674` |
| Redirect URIs (one per line) (edit dialog) | `oauth_clients.redirect_uris` | entity-field | textarea |  | current value | `apps/admin/app/routes/clients.tsx:707` |
| Allowed Grants: Authorization Code | `oauth_clients.grant_types[authorization_code]` | entity-field | checkbox | allowed, not allowed | current value | `apps/admin/app/routes/clients.tsx:721` |
| Allowed Grants: Refresh Token | `oauth_clients.grant_types[refresh_token]` | entity-field | checkbox | allowed, not allowed | current value | `apps/admin/app/routes/clients.tsx:721` |
| Allowed Grants: Client Credentials | `oauth_clients.grant_types[client_credentials]` | entity-field | checkbox | allowed, not allowed | current value | `apps/admin/app/routes/clients.tsx:721` |
| Reason (optional) (delete client) | `admin_deletions.reason` | action-option | textarea |  |  | `apps/admin/app/routes/clients.tsx:775` |

<a id="alummahnowauth-roles"></a>

### AlUmmahNowAuth · roles (5)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Name (edit role) | `rbac_roles.name` | entity-field | text |  |  | `apps/admin/app/routes/roles.$id.tsx:594` |
| Description (edit role) | `rbac_roles.description` | entity-field | text |  |  | `apps/admin/app/routes/roles.$id.tsx:602` |
| Permission | `rbac_role_permissions.permission_id` | entity-field | select |  |  | `apps/admin/app/routes/roles.$id.tsx:629` |
| Name (create role) | `rbac_roles.name` | entity-field | text |  |  | `apps/admin/app/routes/roles._index.tsx:304` |
| Description (create role) | `rbac_roles.description` | entity-field | text |  |  | `apps/admin/app/routes/roles._index.tsx:318` |

<a id="alummahnowauth-security"></a>

### AlUmmahNowAuth · security (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Staff passkeys | `auth_settings.staff_passkeys.enforced` | setting | toggle | Switch on, Switch off | false | `apps/admin/app/routes/security.tsx:136` |

<a id="alummahnowauth-theme-builder"></a>

### AlUmmahNowAuth · theme-builder (364)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Page background (light) | `tokens.color.light.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Page background (dark) | `tokens.color.dark.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Surface (light) | `tokens.color.light.surface` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Surface (dark) | `tokens.color.dark.surface` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Raised surface (light) | `tokens.color.light.surfaceRaised` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Raised surface (dark) | `tokens.color.dark.surfaceRaised` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Hero start (light) | `tokens.color.light.heroStart` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Hero start (dark) | `tokens.color.dark.heroStart` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Hero end (light) | `tokens.color.light.heroEnd` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Hero end (dark) | `tokens.color.dark.heroEnd` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Main text (light) | `tokens.color.light.textPrimary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Main text (dark) | `tokens.color.dark.textPrimary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Secondary text (light) | `tokens.color.light.textSecondary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Secondary text (dark) | `tokens.color.dark.textSecondary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Muted text (light) | `tokens.color.light.textMuted` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Muted text (dark) | `tokens.color.dark.textMuted` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Links (light) | `tokens.color.light.link` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Links (dark) | `tokens.color.dark.link` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Success text (light) | `tokens.color.light.successText` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Success text (dark) | `tokens.color.dark.successText` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Error text (light) | `tokens.color.light.errorText` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Error text (dark) | `tokens.color.dark.errorText` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (light) | `tokens.color.light.primary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (dark) | `tokens.color.dark.primary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (light) | `tokens.color.light.onPrimary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (dark) | `tokens.color.dark.onPrimary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (hover) (light) | `tokens.color.light.primaryHover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (hover) (dark) | `tokens.color.dark.primaryHover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (hover) (light) | `tokens.color.light.onPrimaryHover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (hover) (dark) | `tokens.color.dark.onPrimaryHover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (pressed) (light) | `tokens.color.light.primaryPressed` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (pressed) (dark) | `tokens.color.dark.primaryPressed` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (pressed) (light) | `tokens.color.light.onPrimaryPressed` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (pressed) (dark) | `tokens.color.dark.onPrimaryPressed` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (disabled) (light) | `tokens.color.light.primaryDisabled` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary (disabled) (dark) | `tokens.color.dark.primaryDisabled` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (disabled) (light) | `tokens.color.light.onPrimaryDisabled` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on primary (disabled) (dark) | `tokens.color.dark.onPrimaryDisabled` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary edge (light) | `tokens.color.light.primaryEdge` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary edge (dark) | `tokens.color.dark.primaryEdge` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary sheen (light) | `tokens.color.light.primarySheen` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Primary sheen (dark) | `tokens.color.dark.primarySheen` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Motif (light) | `tokens.color.light.motif` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Motif (dark) | `tokens.color.dark.motif` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Secondary (light) | `tokens.color.light.secondary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Secondary (dark) | `tokens.color.dark.secondary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on secondary (light) | `tokens.color.light.onSecondary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on secondary (dark) | `tokens.color.dark.onSecondary` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Verified fill (light) | `tokens.color.light.verifiedFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Verified fill (dark) | `tokens.color.dark.verifiedFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on verified (light) | `tokens.color.light.onVerifiedFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on verified (dark) | `tokens.color.dark.onVerifiedFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Error fill (light) | `tokens.color.light.errorFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Error fill (dark) | `tokens.color.dark.errorFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on error (light) | `tokens.color.light.onErrorFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on error (dark) | `tokens.color.dark.onErrorFill` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Live (light) | `tokens.color.light.live` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Live (dark) | `tokens.color.dark.live` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on live (light) | `tokens.color.light.onLive` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Text on live (dark) | `tokens.color.dark.onLive` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Accent (light) | `tokens.color.light.accent` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Accent (dark) | `tokens.color.dark.accent` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Focus ring (light) | `tokens.color.light.focusRing` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Focus ring (dark) | `tokens.color.dark.focusRing` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Focus glow (light) | `tokens.color.light.focusGlow` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Focus glow (dark) | `tokens.color.dark.focusGlow` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Verified icon (light) | `tokens.color.light.verifiedIcon` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Verified icon (dark) | `tokens.color.dark.verifiedIcon` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Outline (light) | `tokens.color.light.outline` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Outline (dark) | `tokens.color.dark.outline` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Divider (light) | `tokens.color.light.divider` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Divider (dark) | `tokens.color.dark.divider` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:470` |
| Brand colors | `tokens.brand.<name>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:606` |
| Component: page | `components.page.colors.{light,dark}.<part> / components.page.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: header (nav) | `components.header.colors.{light,dark}.<part> / components.header.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: drawer (drawer) | `components.drawer.colors.{light,dark}.<part> / components.drawer.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: sidebar | `components.sidebar.colors.{light,dark}.<part> / components.sidebar.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: buttonPrimary (button.primary) | `components.buttonPrimary.colors.{light,dark}.<part> / components.buttonPrimary.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: buttonSecondary (button.secondary) | `components.buttonSecondary.colors.{light,dark}.<part> / components.buttonSecondary.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: buttonGhost (button.ghost) | `components.buttonGhost.colors.{light,dark}.<part> / components.buttonGhost.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: buttonDestructive (button.destructive) | `components.buttonDestructive.colors.{light,dark}.<part> / components.buttonDestructive.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: buttonIcon (button.icon) | `components.buttonIcon.colors.{light,dark}.<part> / components.buttonIcon.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: upload (upload) | `components.upload.colors.{light,dark}.<part> / components.upload.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: input (form) | `components.input.colors.{light,dark}.<part> / components.input.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: card | `components.card.colors.{light,dark}.<part> / components.card.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: videoCard (card.video) | `components.videoCard.colors.{light,dark}.<part> / components.videoCard.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: channelCard (card.channel) | `components.channelCard.colors.{light,dark}.<part> / components.channelCard.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: hero | `components.hero.colors.{light,dark}.<part> / components.hero.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: tabs (tabs) | `components.tabs.colors.{light,dark}.<part> / components.tabs.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: segment (segment) | `components.segment.colors.{light,dark}.<part> / components.segment.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: menu (menu) | `components.menu.colors.{light,dark}.<part> / components.menu.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: dialog (dialog) | `components.dialog.colors.{light,dark}.<part> / components.dialog.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: toast (toast) | `components.toast.colors.{light,dark}.<part> / components.toast.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: badge (badge) | `components.badge.colors.{light,dark}.<part> / components.badge.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: player (player) | `components.player.colors.{light,dark}.<part> / components.player.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: footer (footer) | `components.footer.colors.{light,dark}.<part> / components.footer.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: link (link) | `components.link.colors.{light,dark}.<part> / components.link.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: divider (divider) | `components.divider.colors.{light,dark}.<part> / components.divider.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: skeleton (skeleton) | `components.skeleton.colors.{light,dark}.<part> / components.skeleton.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Component: empty (empty) | `components.empty.colors.{light,dark}.<part> / components.empty.style.<field>` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:630` |
| Every sign-in page › Page background | `x-auth.sections.base.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Page background image | `x-auth.sections.base.page.backgroundImage` | entity-field | select | As the theme’s base, No image, an uploaded image file |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Page text | `x-auth.sections.base.page.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card width | `x-auth.sections.base.card.width` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card padding | `x-auth.sections.base.card.padding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card corners | `x-auth.sections.base.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card background | `x-auth.sections.base.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card border | `x-auth.sections.base.card.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card text | `x-auth.sections.base.card.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card shadow | `x-auth.sections.base.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card backdrop | `x-auth.sections.base.card.blur` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Card content side padding | `x-auth.sections.base.card.contentPadding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Header graphic | `x-auth.sections.base.graphic.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Logo | `x-auth.sections.base.logo.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Logo glow | `x-auth.sections.base.logo.filter` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Site title | `x-auth.sections.base.title.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Site title font | `x-auth.sections.base.title.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Site title font (Arabic) | `x-auth.sections.base.title.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Page headings | `x-auth.sections.base.heading.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Page heading font | `x-auth.sections.base.heading.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Page heading font (Arabic) | `x-auth.sections.base.heading.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Field labels | `x-auth.sections.base.label.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Field background | `x-auth.sections.base.input.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Field text | `x-auth.sections.base.input.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Field border | `x-auth.sections.base.input.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Field corners | `x-auth.sections.base.input.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Button | `x-auth.sections.base.button.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Button text | `x-auth.sections.base.button.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Button corners | `x-auth.sections.base.button.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Button shadow | `x-auth.sections.base.button.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Button (hover) | `x-auth.sections.base.button.hover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Links | `x-auth.sections.base.link.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Message background | `x-auth.sections.base.alert.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Every sign-in page › Message text | `x-auth.sections.base.alert.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Page background | `x-auth.sections.signIn.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Page background image | `x-auth.sections.signIn.page.backgroundImage` | entity-field | select | As the theme’s base, No image, an uploaded image file |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Page text | `x-auth.sections.signIn.page.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card width | `x-auth.sections.signIn.card.width` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card padding | `x-auth.sections.signIn.card.padding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card corners | `x-auth.sections.signIn.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card background | `x-auth.sections.signIn.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card border | `x-auth.sections.signIn.card.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card text | `x-auth.sections.signIn.card.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card shadow | `x-auth.sections.signIn.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card backdrop | `x-auth.sections.signIn.card.blur` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Card content side padding | `x-auth.sections.signIn.card.contentPadding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Header graphic | `x-auth.sections.signIn.graphic.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Logo | `x-auth.sections.signIn.logo.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Logo glow | `x-auth.sections.signIn.logo.filter` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Site title | `x-auth.sections.signIn.title.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Site title font | `x-auth.sections.signIn.title.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Site title font (Arabic) | `x-auth.sections.signIn.title.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Page headings | `x-auth.sections.signIn.heading.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Page heading font | `x-auth.sections.signIn.heading.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Page heading font (Arabic) | `x-auth.sections.signIn.heading.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Field labels | `x-auth.sections.signIn.label.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Field background | `x-auth.sections.signIn.input.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Field text | `x-auth.sections.signIn.input.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Field border | `x-auth.sections.signIn.input.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Field corners | `x-auth.sections.signIn.input.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Button | `x-auth.sections.signIn.button.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Button text | `x-auth.sections.signIn.button.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Button corners | `x-auth.sections.signIn.button.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Button shadow | `x-auth.sections.signIn.button.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Button (hover) | `x-auth.sections.signIn.button.hover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Links | `x-auth.sections.signIn.link.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Message background | `x-auth.sections.signIn.alert.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Sign-in › Message text | `x-auth.sections.signIn.alert.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Page background | `x-auth.sections.register.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Page background image | `x-auth.sections.register.page.backgroundImage` | entity-field | select | As the theme’s base, No image, an uploaded image file |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Page text | `x-auth.sections.register.page.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card width | `x-auth.sections.register.card.width` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card padding | `x-auth.sections.register.card.padding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card corners | `x-auth.sections.register.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card background | `x-auth.sections.register.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card border | `x-auth.sections.register.card.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card text | `x-auth.sections.register.card.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card shadow | `x-auth.sections.register.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card backdrop | `x-auth.sections.register.card.blur` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Card content side padding | `x-auth.sections.register.card.contentPadding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Header graphic | `x-auth.sections.register.graphic.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Logo | `x-auth.sections.register.logo.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Logo glow | `x-auth.sections.register.logo.filter` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Site title | `x-auth.sections.register.title.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Site title font | `x-auth.sections.register.title.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Site title font (Arabic) | `x-auth.sections.register.title.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Page headings | `x-auth.sections.register.heading.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Page heading font | `x-auth.sections.register.heading.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Page heading font (Arabic) | `x-auth.sections.register.heading.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Field labels | `x-auth.sections.register.label.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Field background | `x-auth.sections.register.input.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Field text | `x-auth.sections.register.input.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Field border | `x-auth.sections.register.input.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Field corners | `x-auth.sections.register.input.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Button | `x-auth.sections.register.button.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Button text | `x-auth.sections.register.button.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Button corners | `x-auth.sections.register.button.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Button shadow | `x-auth.sections.register.button.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Button (hover) | `x-auth.sections.register.button.hover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Links | `x-auth.sections.register.link.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Message background | `x-auth.sections.register.alert.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Register › Message text | `x-auth.sections.register.alert.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Page background | `x-auth.sections.code.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Page background image | `x-auth.sections.code.page.backgroundImage` | entity-field | select | As the theme’s base, No image, an uploaded image file |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Page text | `x-auth.sections.code.page.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card width | `x-auth.sections.code.card.width` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card padding | `x-auth.sections.code.card.padding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card corners | `x-auth.sections.code.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card background | `x-auth.sections.code.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card border | `x-auth.sections.code.card.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card text | `x-auth.sections.code.card.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card shadow | `x-auth.sections.code.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card backdrop | `x-auth.sections.code.card.blur` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Card content side padding | `x-auth.sections.code.card.contentPadding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Header graphic | `x-auth.sections.code.graphic.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Logo | `x-auth.sections.code.logo.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Logo glow | `x-auth.sections.code.logo.filter` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Site title | `x-auth.sections.code.title.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Site title font | `x-auth.sections.code.title.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Site title font (Arabic) | `x-auth.sections.code.title.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Page headings | `x-auth.sections.code.heading.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Page heading font | `x-auth.sections.code.heading.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Page heading font (Arabic) | `x-auth.sections.code.heading.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Field labels | `x-auth.sections.code.label.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Field background | `x-auth.sections.code.input.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Field text | `x-auth.sections.code.input.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Field border | `x-auth.sections.code.input.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Field corners | `x-auth.sections.code.input.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Button | `x-auth.sections.code.button.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Button text | `x-auth.sections.code.button.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Button corners | `x-auth.sections.code.button.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Button shadow | `x-auth.sections.code.button.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Button (hover) | `x-auth.sections.code.button.hover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Links | `x-auth.sections.code.link.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Message background | `x-auth.sections.code.alert.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Code entry › Message text | `x-auth.sections.code.alert.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Page background | `x-auth.sections.reset.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Page background image | `x-auth.sections.reset.page.backgroundImage` | entity-field | select | As the theme’s base, No image, an uploaded image file |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Page text | `x-auth.sections.reset.page.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card width | `x-auth.sections.reset.card.width` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card padding | `x-auth.sections.reset.card.padding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card corners | `x-auth.sections.reset.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card background | `x-auth.sections.reset.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card border | `x-auth.sections.reset.card.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card text | `x-auth.sections.reset.card.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card shadow | `x-auth.sections.reset.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card backdrop | `x-auth.sections.reset.card.blur` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Card content side padding | `x-auth.sections.reset.card.contentPadding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Header graphic | `x-auth.sections.reset.graphic.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Logo | `x-auth.sections.reset.logo.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Logo glow | `x-auth.sections.reset.logo.filter` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Site title | `x-auth.sections.reset.title.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Site title font | `x-auth.sections.reset.title.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Site title font (Arabic) | `x-auth.sections.reset.title.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Page headings | `x-auth.sections.reset.heading.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Page heading font | `x-auth.sections.reset.heading.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Page heading font (Arabic) | `x-auth.sections.reset.heading.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Field labels | `x-auth.sections.reset.label.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Field background | `x-auth.sections.reset.input.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Field text | `x-auth.sections.reset.input.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Field border | `x-auth.sections.reset.input.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Field corners | `x-auth.sections.reset.input.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Button | `x-auth.sections.reset.button.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Button text | `x-auth.sections.reset.button.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Button corners | `x-auth.sections.reset.button.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Button shadow | `x-auth.sections.reset.button.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Button (hover) | `x-auth.sections.reset.button.hover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Links | `x-auth.sections.reset.link.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Message background | `x-auth.sections.reset.alert.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Forgot / reset password › Message text | `x-auth.sections.reset.alert.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Page background | `x-auth.sections.consent.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Page background image | `x-auth.sections.consent.page.backgroundImage` | entity-field | select | As the theme’s base, No image, an uploaded image file |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Page text | `x-auth.sections.consent.page.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card width | `x-auth.sections.consent.card.width` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card padding | `x-auth.sections.consent.card.padding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card corners | `x-auth.sections.consent.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card background | `x-auth.sections.consent.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card border | `x-auth.sections.consent.card.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card text | `x-auth.sections.consent.card.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card shadow | `x-auth.sections.consent.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card backdrop | `x-auth.sections.consent.card.blur` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Card content side padding | `x-auth.sections.consent.card.contentPadding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Header graphic | `x-auth.sections.consent.graphic.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Logo | `x-auth.sections.consent.logo.display` | entity-field | select | As the theme’s base, Shown, Hidden |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Logo glow | `x-auth.sections.consent.logo.filter` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Site title | `x-auth.sections.consent.title.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Site title font | `x-auth.sections.consent.title.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Site title font (Arabic) | `x-auth.sections.consent.title.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Page headings | `x-auth.sections.consent.heading.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Page heading font | `x-auth.sections.consent.heading.font` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Page heading font (Arabic) | `x-auth.sections.consent.heading.fontAr` | entity-field | select | As the page text, System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, … 3 more |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Field labels | `x-auth.sections.consent.label.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Field background | `x-auth.sections.consent.input.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Field text | `x-auth.sections.consent.input.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Field border | `x-auth.sections.consent.input.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Field corners | `x-auth.sections.consent.input.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Button | `x-auth.sections.consent.button.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Button text | `x-auth.sections.consent.button.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Button corners | `x-auth.sections.consent.button.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Button shadow | `x-auth.sections.consent.button.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Button (hover) | `x-auth.sections.consent.button.hover` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Links | `x-auth.sections.consent.link.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Message background | `x-auth.sections.consent.alert.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Device sign-in approval › Message text | `x-auth.sections.consent.alert.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Page background | `x-auth.sections.accountSwitcher.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Page text | `x-auth.sections.accountSwitcher.page.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Card background | `x-auth.sections.accountSwitcher.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Card padding | `x-auth.sections.accountSwitcher.card.padding` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Card corners | `x-auth.sections.accountSwitcher.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Card shadow | `x-auth.sections.accountSwitcher.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Account row | `x-auth.sections.accountSwitcher.item.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Account row border | `x-auth.sections.accountSwitcher.item.border` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Account row text | `x-auth.sections.accountSwitcher.item.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Account row corners | `x-auth.sections.accountSwitcher.item.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Avatar | `x-auth.sections.accountSwitcher.avatar.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Avatar text | `x-auth.sections.accountSwitcher.avatar.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Add account | `x-auth.sections.accountSwitcher.add.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Account switcher › Add account text | `x-auth.sections.accountSwitcher.add.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Page background | `x-auth.sections.profile.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Top bar | `x-auth.sections.profile.nav.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Cards | `x-auth.sections.profile.card.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Card border | `x-auth.sections.profile.card.border` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Card corners | `x-auth.sections.profile.card.radius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Card shadow | `x-auth.sections.profile.card.shadow` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Headings | `x-auth.sections.profile.heading.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Primary button | `x-auth.sections.profile.button.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Profile pages › Primary button text | `x-auth.sections.profile.button.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Sidebar | `x-auth.sections.adminShell.sidebar.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Sidebar text | `x-auth.sections.adminShell.sidebar.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Sidebar current item | `x-auth.sections.adminShell.sidebar.active` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Sidebar current item text | `x-auth.sections.adminShell.sidebar.activeText` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Header | `x-auth.sections.adminShell.header.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Header text | `x-auth.sections.adminShell.header.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Page background | `x-auth.sections.adminShell.page.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Admin shell › Accent | `x-auth.sections.adminShell.accent` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:678` |
| Page text | `typography.body.latin` | entity-field | select | System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, Reem Kufi, … 2 more | System | `apps/admin/app/routes/themes.$id.tsx:691` |
| Arabic pages | `typography.body.arabic` | entity-field | select | System, Cairo, Tajawal, Noto Kufi Arabic, IBM Plex Sans Arabic, Almarai, Amiri, Reem Kufi | System | `apps/admin/app/routes/themes.$id.tsx:697` |
| Component sm | `materials.radius.sm` | entity-field | number |  |  | `apps/admin/app/routes/themes.$id.tsx:708` |
| Component md | `materials.radius.md` | entity-field | number |  |  | `apps/admin/app/routes/themes.$id.tsx:708` |
| Component lg | `materials.radius.lg` | entity-field | number |  |  | `apps/admin/app/routes/themes.$id.tsx:708` |
| Component xl | `materials.radius.xl` | entity-field | number |  |  | `apps/admin/app/routes/themes.$id.tsx:708` |
| Component pill | `materials.radius.pill` | entity-field | number |  |  | `apps/admin/app/routes/themes.$id.tsx:708` |
| Sign-in form controls | `x-auth.radius` | entity-field | select | none, sm, md, lg, full | md | `apps/admin/app/routes/themes.$id.tsx:719` |
| Shadows: Low | `tokens.elevation.low` | entity-field | other |  |  | `apps/admin/app/routes/themes.$id.tsx:728` |
| Shadows: Medium | `tokens.elevation.medium` | entity-field | other |  |  | `apps/admin/app/routes/themes.$id.tsx:728` |
| Shadows: High | `tokens.elevation.high` | entity-field | other |  |  | `apps/admin/app/routes/themes.$id.tsx:728` |
| Site title (English) | `x-auth.title.en` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:746` |
| Site title (Arabic) | `x-auth.title.ar` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:747` |
| Use it as | `upload.target` | action-option | select | Just upload, Logo, Browser icon, Card header art (SVG), Background photo, Email header |  | `apps/admin/app/routes/themes.$id.tsx:764` |
| Logo | `imagery.logo` | entity-field | select | None, an uploaded file |  | `apps/admin/app/routes/themes.$id.tsx:779` |
| Browser icon | `imagery.favicon` | entity-field | select | None, an uploaded file |  | `apps/admin/app/routes/themes.$id.tsx:780` |
| Card header art | `imagery.headerGraphic` | entity-field | select | None, an uploaded file |  | `apps/admin/app/routes/themes.$id.tsx:781` |
| Email header | `email.headerImage` | entity-field | select | None, an uploaded file |  | `apps/admin/app/routes/themes.$id.tsx:782` |
| Background photos | `x-auth.photos.light` | entity-field | list |  |  | `apps/admin/app/routes/themes.$id.tsx:785` |
| Background | `email.background` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:825` |
| Text | `email.text` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:825` |
| Header and accents | `email.buttonBackground` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:825` |
| Header text | `email.buttonText` | entity-field | color |  |  | `apps/admin/app/routes/themes.$id.tsx:825` |
| Code box corners | `email.buttonRadius` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:834` |
| Name (English) | `name.en` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:842` |
| Name (Arabic) | `name.ar` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:843` |
| Description (English) | `description.en` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:844` |
| Description (Arabic) | `description.ar` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:845` |
| Version | `version` | entity-field | text |  |  | `apps/admin/app/routes/themes.$id.tsx:846` |

<a id="alummahnowauth-themes"></a>

### AlUmmahNowAuth · themes (8)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Make Auth default | `auth_theme_settings.default_theme` | setting | other | classic (built-in), fawanees (built-in), lantern (built-in), nahas (built-in), zujaj (built-in), any published custom theme | fawanees (BUILTIN_DEFAULT_THEME when unset) | `apps/admin/app/routes/themes._index.tsx:211` |
| App defaults | `auth_theme_client_defaults.theme_id` | setting | select | Auth default, classic, fawanees, lantern, nahas, zujaj, published custom themes |  | `apps/admin/app/routes/themes._index.tsx:258` |
| Theme id | `auth_themes.id` | entity-field | text |  | <source>-copy | `apps/admin/app/routes/themes._index.tsx:317` |
| Name (English) | `auth_themes.name_en` | entity-field | text |  | <source> copy | `apps/admin/app/routes/themes._index.tsx:323` |
| Name (Arabic) | `auth_themes.name_ar` | entity-field | text |  | <source> (نسخة) | `apps/admin/app/routes/themes._index.tsx:327` |
| Reason (optional) (delete theme) | `admin_deletions.reason` | action-option | textarea |  |  | `apps/admin/app/routes/themes._index.tsx:345` |
| Import as id (optional) | `import.id` | action-option | text |  | id in theme.json | `apps/admin/app/routes/themes._index.tsx:371` |
| Replace the draft of an existing custom theme with this id | `import.replace` | action-option | checkbox |  | false | `apps/admin/app/routes/themes._index.tsx:374` |

<a id="alummahnowauth-users"></a>

### AlUmmahNowAuth · users (7)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Add Role | `rbac_user_roles (add role)` | entity-field | select |  |  | `apps/admin/app/components/user-role-manager.tsx:165` |
| Email language | `setup-link.locale` | action-option | select | English, العربية | admin UI language (en unless ?lang=ar) | `apps/admin/app/routes/users.$id.passkeys.tsx:258` |
| Email (create user) | `users.email` | entity-field | text |  |  | `apps/admin/app/routes/users._index.tsx:692` |
| Initial Roles | `rbac_user_roles (initial roles)` | entity-field | checkbox |  | none ticked | `apps/admin/app/routes/users._index.tsx:723` |
| Email (edit user) | `users.email` | entity-field | text |  |  | `apps/admin/app/routes/users._index.tsx:885` |
| Role | `rbac_user_roles (primary role)` | entity-field | select |  | user's first role | `apps/admin/app/routes/users._index.tsx:893` |
| Reason (optional) (delete user) | `admin_deletions.reason` | action-option | textarea |  |  | `apps/admin/app/routes/users._index.tsx:928` |

## CMS admin (src/admin)

<a id="alummahnowcms-ai-settings"></a>

### AlUmmahNowCMS · ai-settings (34)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Enabled | `ai_settings.providers[].enabled` | entity-field | toggle |  | true for Workers AI; false for new HTTP providers | `src/admin/screens/ai-settings.tsx:55` |
| Name | `ai_settings.providers[].label` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:61` |
| ID | `ai_settings.providers[].id` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:64` |
| HTTP method | `ai_settings.providers[].method` | entity-field | select | POST, PUT, PATCH | POST | `src/admin/screens/ai-settings.tsx:67` |
| Endpoint URL | `ai_settings.providers[].url` | entity-field | text |  | https:// | `src/admin/screens/ai-settings.tsx:74` |
| How the key is sent | `ai_settings.providers[].auth.type` | entity-field | select | In a header, In a query parameter, No key | header | `src/admin/screens/ai-settings.tsx:77` |
| Secret name | `ai_settings.providers[].auth.secret` | entity-field | select | bound Worker secrets / Secrets Store bindings named AI_KEY_… | AI_KEY_ | `src/admin/screens/ai-settings.tsx:84` |
| Header name | `ai_settings.providers[].auth.header` | entity-field | text |  | Authorization | `src/admin/screens/ai-settings.tsx:87` |
| Value prefix | `ai_settings.providers[].auth.prefix` | entity-field | text |  | Bearer | `src/admin/screens/ai-settings.tsx:90` |
| Query parameter name | `ai_settings.providers[].auth.param` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:93` |
| Request body template | `ai_settings.providers[].bodyTemplate` | entity-field | textarea |  | { model, messages_with_system_json, max_tokens, temperature } template (blankHttpProvider) | `src/admin/screens/ai-settings.tsx:107` |
| Answer text | `ai_settings.providers[].response.text` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:115` |
| Answer as JSON (optional) | `ai_settings.providers[].response.json` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:115` |
| Input tokens (optional) | `ai_settings.providers[].response.inputTokens` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:115` |
| Output tokens (optional) | `ai_settings.providers[].response.outputTokens` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:115` |
| Error message (optional) | `ai_settings.providers[].response.error` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:115` |
| Stop reason (optional) | `ai_settings.providers[].response.finish` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:115` |
| Streaming (server-sent events) | `ai_settings.providers[].streaming` | entity-field | toggle |  | false | `src/admin/screens/ai-settings.tsx:132` |
| Timeout (seconds) | `ai_settings.providers[].timeoutMs` | entity-field | number |  | 120 (seconds) | `src/admin/screens/ai-settings.tsx:137` |
| USD per 1,000 input tokens | `ai_settings.providers[].pricing.inputPer1k` | entity-field | number |  | 0 | `src/admin/screens/ai-settings.tsx:140` |
| USD per 1,000 output tokens | `ai_settings.providers[].pricing.outputPer1k` | entity-field | number |  | 0 | `src/admin/screens/ai-settings.tsx:143` |
| Models | `ai_settings.providers[].models` | entity-field | list |  | [] for HTTP; [MODEL_ID] for Workers AI | `src/admin/screens/ai-settings.tsx:147` |
| Model to test | `testModel` | action-option | select | provider's models |  | `src/admin/screens/ai-settings.tsx:165` |
| Monthly cap (USD) | `ai_settings.monthlyBudgetUsd` | setting | number |  | DEFAULT_BUDGET_USD (src/lib/ai/settings.ts) | `src/admin/screens/ai-settings.tsx:233` |
| Translation › Provider | `ai_settings.features.translate.provider` | setting | select | Cloudflare Workers AI, each enabled HTTP provider | workers-ai | `src/admin/screens/ai-settings.tsx:251` |
| Search & sharing › Provider | `ai_settings.features.seo.provider` | setting | select | Cloudflare Workers AI, each enabled HTTP provider | workers-ai | `src/admin/screens/ai-settings.tsx:251` |
| Pre-publish check › Provider | `ai_settings.features.check.provider` | setting | select | Cloudflare Workers AI, each enabled HTTP provider | workers-ai | `src/admin/screens/ai-settings.tsx:251` |
| Fallback › Provider | `ai_settings.fallback.provider` | setting | select | Cloudflare Workers AI, each enabled HTTP provider, No fallback | null (no fallback) | `src/admin/screens/ai-settings.tsx:251` |
| Translation › Model | `ai_settings.features.translate.model` | setting | select | MODEL_ID (Workers AI default), any model listed on the chosen provider | @cf/deepseek-ai/deepseek-v4.1-flash-1017 | `src/admin/screens/ai-settings.tsx:256` |
| Search & sharing › Model | `ai_settings.features.seo.model` | setting | select | MODEL_ID (Workers AI default), any model listed on the chosen provider | @cf/deepseek-ai/deepseek-v4.1-flash-1017 | `src/admin/screens/ai-settings.tsx:256` |
| Pre-publish check › Model | `ai_settings.features.check.model` | setting | select | MODEL_ID (Workers AI default), any model listed on the chosen provider | @cf/deepseek-ai/deepseek-v4.1-flash-1017 | `src/admin/screens/ai-settings.tsx:256` |
| Fallback › Model | `ai_settings.fallback.model` | setting | select | MODEL_ID (Workers AI default), any model listed on the chosen provider |  | `src/admin/screens/ai-settings.tsx:256` |
| Header | `ai_settings.providers[].headers[].name` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:302` |
| Value | `ai_settings.providers[].headers[].value` | entity-field | text |  |  | `src/admin/screens/ai-settings.tsx:306` |

<a id="alummahnowcms-content-editor"></a>

### AlUmmahNowCMS · content-editor (22)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Title | `pages.title / posts.title` | entity-field | text |  |  | `src/admin/screens/content.tsx:507` |
| Address | `pages.slug / posts.slug` | entity-field | text |  | generated from the title (Arabic titles get an English slug via AI, transliteration fallback) | `src/admin/screens/content.tsx:516` |
| Summary | `pages.summary` | entity-field | textarea |  |  | `src/admin/screens/content.tsx:541` |
| Excerpt | `posts.excerpt` | entity-field | textarea |  |  | `src/admin/screens/content.tsx:541` |
| Post type | `posts.kind` | entity-field | radio | Article, Cards | article | `src/admin/screens/content.tsx:556` |
| Author | `posts.author_name` | entity-field | text |  |  | `src/admin/screens/content.tsx:630` |
| Tags | `posts.tags` | entity-field | list |  | [] | `src/admin/screens/content.tsx:644` |
| Search title | `seo_title` | entity-field | text |  | empty = title | `src/admin/screens/content.tsx:687` |
| Search description | `seo_description` | entity-field | textarea |  | empty = summary/excerpt | `src/admin/screens/content.tsx:697` |
| Show on home timeline | `posts.show_on_timeline` | entity-field | toggle |  | true | `src/admin/screens/content.tsx:719` |
| List in the sitemap | `pages.show_in_sitemap` | entity-field | toggle |  | true | `src/admin/screens/content.tsx:730` |
| Publish / Unpublish | `status` | entity-field | other | Draft, Published | draft | `src/admin/screens/content.tsx:800` |
| Go live at | `publish_at` | entity-field | date |  | null (publish at once) | `src/admin/screens/content.tsx:816` |
| Cover image | `cover` | entity-field | other |  |  | `src/admin/screens/content.tsx:860` |
| Description for screen readers | `media.metadata.alt` | entity-field | text |  |  | `src/admin/screens/content.tsx:868` |
| Page type | `pages.list_kind` | entity-field | radio | Content page, Curated list, Filter | '' (content page) | `src/admin/screens/page-type.tsx:33` |
| Show these kinds: Articles | `pages.list_filter.kinds[article]` | entity-field | checkbox |  | false | `src/admin/screens/page-type.tsx:81` |
| Show these kinds: Card posts | `pages.list_filter.kinds[cards]` | entity-field | checkbox |  | false | `src/admin/screens/page-type.tsx:81` |
| Show these kinds: Videos | `pages.list_filter.kinds[video]` | entity-field | checkbox |  | false | `src/admin/screens/page-type.tsx:81` |
| Show these kinds: Playlists | `pages.list_filter.kinds[playlist]` | entity-field | checkbox |  | false | `src/admin/screens/page-type.tsx:81` |
| Show these kinds: Channels | `pages.list_filter.kinds[channel]` | entity-field | checkbox |  | false | `src/admin/screens/page-type.tsx:81` |
| Tag (optional) | `pages.list_filter.tag` | entity-field | text |  | null | `src/admin/screens/page-type.tsx:96` |

<a id="alummahnowcms-deletion"></a>

### AlUmmahNowCMS · deletion (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Reason (optional) | `trash.reason` | action-option | textarea |  |  | `src/admin/ui/dialogs.tsx:32` |

<a id="alummahnowcms-glossary"></a>

### AlUmmahNowCMS · glossary (4)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Direction | `translation_glossary.source_locale/target_locale` | entity-field | select | Arabic → English, English → Arabic | ar (Arabic → English) when the admin UI is English; en when the admin UI is Arabic | `src/admin/screens/glossary.tsx:95` |
| Term | `translation_glossary.source_term` | entity-field | text |  |  | `src/admin/screens/glossary.tsx:106` |
| Translation | `translation_glossary.target_term` | entity-field | text |  |  | `src/admin/screens/glossary.tsx:110` |
| Note | `translation_glossary.note` | entity-field | text |  |  | `src/admin/screens/glossary.tsx:114` |

<a id="alummahnowcms-navigation"></a>

### AlUmmahNowCMS · navigation (4)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Order (move up/down, drag) | `nav_items.sort` | entity-field | other |  | max+10 for new links | `src/admin/screens/site.tsx:35` |
| Visible on the site | `nav_items.status` | entity-field | toggle | Published, Draft | published (new links) | `src/admin/screens/site.tsx:53` |
| Label | `nav_items.label` | entity-field | text |  |  | `src/admin/screens/site.tsx:99` |
| Link | `nav_items.url` | entity-field | text |  |  | `src/admin/screens/site.tsx:105` |

<a id="alummahnowcms-page-blocks"></a>

### AlUmmahNowCMS · page-blocks (77)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Hero › Button link | `blocks[type=hero].buttons[].url` | entity-field | text |  |  | `src/admin/screens/blocks.tsx:374` |
| Hero › Button style | `blocks[type=hero].buttons[].variant` | entity-field | radio | Main, Outline | primary | `src/admin/screens/blocks.tsx:377` |
| Stats or features › Icon | `blocks[type=stats].items[].icon` | entity-field | radio | none, Play, Shorts, Live, Posts, News, Book, People, … 9 more |  | `src/admin/screens/blocks.tsx:493` |
| Hero › Width | `blocks[type=hero].appearance.width` | entity-field | radio | Text, Wide, Full | full | `src/admin/screens/blocks.tsx:537` |
| Text › Width | `blocks[type=markdown].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Image › Width | `blocks[type=image].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Gallery › Width | `blocks[type=gallery].appearance.width` | entity-field | radio | Text, Wide, Full | wide | `src/admin/screens/blocks.tsx:537` |
| Columns › Width | `blocks[type=layout].appearance.width` | entity-field | radio | Text, Wide, Full | wide | `src/admin/screens/blocks.tsx:537` |
| Text beside an image › Width | `blocks[type=columns].appearance.width` | entity-field | radio | Text, Wide, Full | wide | `src/admin/screens/blocks.tsx:537` |
| Cards › Width | `blocks[type=cardgrid].appearance.width` | entity-field | radio | Text, Wide, Full | wide | `src/admin/screens/blocks.tsx:537` |
| Call to action › Width | `blocks[type=cta].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Quote or callout › Width | `blocks[type=quote].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| FAQ › Width | `blocks[type=faq].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Video › Width | `blocks[type=video].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Video shelf › Width | `blocks[type=videos].appearance.width` | entity-field | radio | Text, Wide, Full | wide | `src/admin/screens/blocks.tsx:537` |
| Posts › Width | `blocks[type=posts].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Card posts › Width | `blocks[type=cards].appearance.width` | entity-field | radio | Text, Wide, Full | wide | `src/admin/screens/blocks.tsx:537` |
| Stats or features › Width | `blocks[type=stats].appearance.width` | entity-field | radio | Text, Wide, Full | wide | `src/admin/screens/blocks.tsx:537` |
| Divider or space › Width | `blocks[type=divider].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Contact › Width | `blocks[type=contact].appearance.width` | entity-field | radio | Text, Wide, Full | content | `src/admin/screens/blocks.tsx:537` |
| Hero › Alignment | `blocks[type=hero].appearance.align` | entity-field | radio | Start, Centre | center | `src/admin/screens/blocks.tsx:538` |
| Text › Alignment | `blocks[type=markdown].appearance.align` | entity-field | radio | Start, Centre | start | `src/admin/screens/blocks.tsx:538` |
| Columns › Alignment | `blocks[type=layout].appearance.align` | entity-field | radio | Start, Centre | start | `src/admin/screens/blocks.tsx:538` |
| Cards › Alignment | `blocks[type=cardgrid].appearance.align` | entity-field | radio | Start, Centre | start | `src/admin/screens/blocks.tsx:538` |
| Call to action › Alignment | `blocks[type=cta].appearance.align` | entity-field | radio | Start, Centre | start | `src/admin/screens/blocks.tsx:538` |
| Quote or callout › Alignment | `blocks[type=quote].appearance.align` | entity-field | radio | Start, Centre | start | `src/admin/screens/blocks.tsx:538` |
| Stats or features › Alignment | `blocks[type=stats].appearance.align` | entity-field | radio | Start, Centre | center | `src/admin/screens/blocks.tsx:538` |
| Contact › Alignment | `blocks[type=contact].appearance.align` | entity-field | radio | Start, Centre | start | `src/admin/screens/blocks.tsx:538` |
| Text › Background | `blocks[type=markdown].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| Columns › Background | `blocks[type=layout].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| Text beside an image › Background | `blocks[type=columns].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| Cards › Background | `blocks[type=cardgrid].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| Call to action › Background | `blocks[type=cta].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | accent | `src/admin/screens/blocks.tsx:547` |
| Quote or callout › Background | `blocks[type=quote].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| FAQ › Background | `blocks[type=faq].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| Video shelf › Background | `blocks[type=videos].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| Posts › Background | `blocks[type=posts].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | none | `src/admin/screens/blocks.tsx:547` |
| Stats or features › Background | `blocks[type=stats].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | soft | `src/admin/screens/blocks.tsx:547` |
| Contact › Background | `blocks[type=contact].appearance.tone` | entity-field | radio | None, Soft, Card, Accent, Night | raised | `src/admin/screens/blocks.tsx:547` |
| Hero › Spacing | `blocks[type=hero].appearance.space` | entity-field | radio | Small, Medium, Large | l | `src/admin/screens/blocks.tsx:558` |
| Text › Spacing | `blocks[type=markdown].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Image › Spacing | `blocks[type=image].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Gallery › Spacing | `blocks[type=gallery].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Columns › Spacing | `blocks[type=layout].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Text beside an image › Spacing | `blocks[type=columns].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Cards › Spacing | `blocks[type=cardgrid].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Call to action › Spacing | `blocks[type=cta].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Quote or callout › Spacing | `blocks[type=quote].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| FAQ › Spacing | `blocks[type=faq].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Video › Spacing | `blocks[type=video].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Video shelf › Spacing | `blocks[type=videos].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Posts › Spacing | `blocks[type=posts].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Card posts › Spacing | `blocks[type=cards].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Stats or features › Spacing | `blocks[type=stats].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Divider or space › Spacing | `blocks[type=divider].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Contact › Spacing | `blocks[type=contact].appearance.space` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:558` |
| Hero › Background | `blocks[type=hero].background` | entity-field | radio | Theme gradient, Image, Plain | gradient | `src/admin/screens/blocks.tsx:587` |
| Hero › Height | `blocks[type=hero].height` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:588` |
| Gallery › Images per row | `blocks[type=gallery].columns` | entity-field | radio | 2, 3, 4 | 3 | `src/admin/screens/blocks.tsx:619` |
| Columns › Columns | `blocks[type=layout].columns` | entity-field | radio | 2, 3 | 2 | `src/admin/screens/blocks.tsx:635` |
| Cards › Cards per row | `blocks[type=cardgrid].columns` | entity-field | radio | 2, 3, 4 | 3 | `src/admin/screens/blocks.tsx:652` |
| Stats or features › Show as | `blocks[type=stats].variant` | entity-field | radio | Numbers, Features | features | `src/admin/screens/blocks.tsx:679` |
| Contact › Link to | `blocks[type=contact].kind` | entity-field | radio | The contact page, An email address | page | `src/admin/screens/blocks.tsx:700` |
| Contact › Email address | `blocks[type=contact].email` | entity-field | text |  |  | `src/admin/screens/blocks.tsx:703` |
| Posts › Which posts | `blocks[type=posts].mode` | entity-field | radio | Latest, With a tag, Picked by hand | latest | `src/admin/screens/blocks.tsx:715` |
| Posts › How many | `blocks[type=posts].limit` | entity-field | number |  | 3 | `src/admin/screens/blocks.tsx:719` |
| Posts › Tag | `blocks[type=posts].tag` | entity-field | text |  |  | `src/admin/screens/blocks.tsx:723` |
| Card posts › Only card posts with this tag (optional) | `blocks[type=cards].tag` | entity-field | text |  |  | `src/admin/screens/blocks.tsx:749` |
| Card posts › Cards per page | `blocks[type=cards].page_size` | entity-field | number |  | 12 | `src/admin/screens/blocks.tsx:753` |
| Card posts › Let readers filter by tag | `blocks[type=cards].filter` | entity-field | toggle |  | true | `src/admin/screens/blocks.tsx:757` |
| Call to action › Button link | `blocks[type=cta].url` | entity-field | text |  |  | `src/admin/screens/blocks.tsx:824` |
| Call to action › Button style | `blocks[type=cta].tone` | entity-field | radio | Main, Outline | primary | `src/admin/screens/blocks.tsx:828` |
| Text beside an image › Image position | `blocks[type=columns].image_side` | entity-field | radio | Image first, Image second | end | `src/admin/screens/blocks.tsx:844` |
| Quote or callout › Style | `blocks[type=quote].variant` | entity-field | radio | Quote, Callout | quote | `src/admin/screens/blocks.tsx:850` |
| Divider or space › Style | `blocks[type=divider].style_kind` | entity-field | radio | Line, Space | line | `src/admin/screens/blocks.tsx:862` |
| Divider or space › Size | `blocks[type=divider].size` | entity-field | radio | Small, Medium, Large | m | `src/admin/screens/blocks.tsx:863` |
| Text position | `posts.slides[].position` | entity-field | radio | Top, Middle, Bottom | bottom | `src/admin/screens/blocks.tsx:959` |

<a id="alummahnowcms-scholars"></a>

### AlUmmahNowCMS · scholars (9)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Name in English | `scholars.name_en` | entity-field | text |  | account name | `src/admin/screens/scholars.tsx:84` |
| Name in Arabic | `scholars.name_ar` | entity-field | text |  | account name | `src/admin/screens/scholars.tsx:93` |
| Page address | `scholars.slug` | entity-field | text |  |  | `src/admin/screens/scholars.tsx:103` |
| Bio in English | `scholars.bio_en` | entity-field | textarea |  |  | `src/admin/screens/scholars.tsx:111` |
| Bio in Arabic | `scholars.bio_ar` | entity-field | textarea |  |  | `src/admin/screens/scholars.tsx:117` |
| Photo | `scholars.avatar_media_id` | entity-field | other |  |  | `src/admin/screens/scholars.tsx:128` |
| Your channels | `scholars.channel_ids` | entity-field | checkbox |  |  | `src/admin/screens/scholars.tsx:153` |
| List page | `page_entries (add to page)` | action-option | select | curated list pages in the post's language |  | `src/admin/screens/scholars.tsx:544` |
| Feature on main site | `posts.featured_at` | entity-field | toggle |  | not featured | `src/admin/screens/scholars.tsx:564` |

<a id="alummahnowcms-site-settings"></a>

### AlUmmahNowCMS · site-settings (6)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Network | `site_settings.social[].kind` | setting | select | YouTube, X, Instagram, Facebook, Telegram, WhatsApp, TikTok, Other | youtube | `src/admin/screens/site.tsx:161` |
| Address | `site_settings.social[].url` | setting | text |  |  | `src/admin/screens/site.tsx:173` |
| Site name | `site_settings.site_title` | setting | text |  |  | `src/admin/screens/site.tsx:206` |
| Tagline | `site_settings.tagline` | setting | text |  |  | `src/admin/screens/site.tsx:211` |
| Hero title | `site_settings.hero_title` | setting | text |  |  | `src/admin/screens/site.tsx:215` |
| Hero text | `site_settings.hero_body` | setting | textarea |  |  | `src/admin/screens/site.tsx:219` |

<a id="alummahnowcms-timeline"></a>

### AlUmmahNowCMS · timeline (5)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Timeline date | `timeline_entries.entry_date` | entity-field | date |  |  | `src/admin/screens/timeline.tsx:78` |
| Show for | `timeline_entries.locale` | entity-field | select | Both languages, English, Arabic | all | `src/admin/screens/timeline.tsx:86` |
| Title on the site | `timeline_entries.title_override` | entity-field | text |  |  | `src/admin/screens/timeline.tsx:97` |
| Pin to top | `timeline pinned (+ pin order)` | entity-field | toggle |  | false | `src/admin/screens/timeline.tsx:113` |
| Hide | `timeline hidden` | entity-field | toggle |  | false | `src/admin/screens/timeline.tsx:116` |

<a id="alummahnowcms-translation-flags"></a>

### AlUmmahNowCMS · translation-flags (5)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| What is wrong? | `translation_flags.reason` | action-option | radio | Wrong meaning, Wrong term, Islamic term or honorific, Qur'an or hadith wording, Grammar or style, Other | meaning | `src/admin/ui/translation-flags.tsx:88` |
| This is Qur'an | `translation_flags.is_quran` | action-option | checkbox |  | false | `src/admin/ui/translation-flags.tsx:93` |
| Suggested correction (optional) | `translation_flags.suggestion` | action-option | textarea |  |  | `src/admin/ui/translation-flags.tsx:100` |
| Note (optional) | `translation_flags.note` | action-option | textarea |  |  | `src/admin/ui/translation-flags.tsx:104` |
| Flagged text changed | `resolve flags on save` | action-option | radio | Keep open, Mark resolved | keep | `src/admin/ui/translation-flags.tsx:160` |

<a id="alummahnowcms-videos-library"></a>

### AlUmmahNowCMS · videos-library (1)

| Setting | Key | Kind | Control | Options | Default | File |
|---|---|---|---|---|---|---|
| Show for | `cms_videos.locale` | entity-field | select | Both languages, English, Arabic | all | `src/admin/screens/videos-library.tsx:110` |
