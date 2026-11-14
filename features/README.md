[← Home](../README.md)

# Feature registry

[`registry.json`](registry.json) lists every user-visible feature of Al Ummah Now with its status, its apps, the wiki page it comes from and the release it shipped in. It is the single source for feature status. Owner rule, 2026-11-14: "dont forget to have wiki docs dev site updated with all features we do".

- **alummahnow.dev reads it at build time.** AlUmmahNowUI `apps/dev` fetches this file from `main` and pins the commit it built from. Every status chip and the feature list on the site come from here, so the site cannot say something the registry doesn't. A push here that changes the file asks UI to rebuild (`.github/workflows/registry.yml`). UI also checks every few hours on its own (`dev-registry.yml`).
- **Each repo's PR template** has a "Wiki / feature registry updated" line.
- **Each release run** (AlUmmahNow, UI, CMS and Auth) lists, as a warning in its run summary, the merged PRs since the last release that no wiki change or registry entry mentions. The warning does not block the release.
- **CI** (`scripts/check-registry.mjs`) rejects a registry that breaks the rules below.

## Statuses

| Status | Site label (en / ar) | Means |
|---|---|---|
| `live` | Live / يعمل الآن | In a production release: an AlUmmahNow, UI or CMS tag whose release run's production job succeeded, or an Auth `main` release run whose production job succeeded. `release` names it. |
| `rolling` | Built, rolling out / مكتمل، قيد الإطلاق | Merged to `main` (on QA), but no successful production release contains it yet, or it is released but switched on for only part of the platform. `note` says which. |
| `building` | In development / قيد التطوير | Open PRs, or some stories merged and others not. |
| `planned` | Planned / مخطط له | Specified in the wiki, with no code yet. |

Only real statuses go in. Don't mark anything `live` without the release run that proves it.

## Fields

```json
{
  "id": "creator-tiers",
  "name": { "en": "Creator tiers", "ar": "مستويات صنّاع المحتوى" },
  "status": "live",
  "apps": ["videos", "videos-admin"],
  "wiki": "epics/CHAT-CREATOR-TIERS-creator-tiers.md",
  "release": { "repo": "AlUmmahNow", "tag": "v2026.11.10" },
  "prs": ["AlUmmahNow#1234"],
  "note": "Optional, English: what is limited or still to come."
}
```

- `id`: kebab-case and stable, because the site links to it.
- `name`: English and Arabic. The Arabic follows the [glossary](../guides/glossary.md): «مرئي / مرئيات» for video, never «فيديو».
- `apps`: one or more of `videos`, `videos-admin`, `api`, `www`, `sites`, `status`, `cms`, `auth`, `profile`, `auth-admin`, `dev`, `native`.
- `wiki`: the epic or guide page, relative to the wiki root.
- `release`: only for `live`. It takes one of these forms:
  - `{ "repo", "tag" }`: the first production release tag that contains the feature.
  - `{ "repo": "AlUmmahNowAuth", "run", "sha" }`: Auth has no tags, so this is the release run and its commit.
  - `{ "repo", "before" }`: shipped before the repo's first tag, which is named here.
- `prs`: the PRs, as `Repo#number`. Required for `rolling` and `building`. The release warning matches on these.

## Updating it

In the same wiki PR that documents the work:

1. Add or change the feature's entry.
2. Bump the epic's status line if the epic moved.
3. Once a release containing the feature passes production, set `status` to `live` and add `release`.

Check it locally with `node scripts/check-registry.mjs`.
