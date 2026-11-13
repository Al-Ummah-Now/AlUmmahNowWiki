[← Home](../README.md)

# Contributing

These rules apply across the organisation. Each repo's own guide adds detail: for example [AlUmmahNow](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CONTRIBUTING.md) and [AlUmmahNowAuth](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/main/CONTRIBUTING.md).

## Working in a repo

1. Branch from the default branch. That's `main`, except `master` in `openauth` and `AlUmmahNowTools`.
2. Keep pull requests small and focused, with clear conventional commit titles such as `fix(web): ...`.
3. Fixes go through a PR to the default branch, including hotfixes. Don't keep long-lived `hotfix`, `qa` or release branches.
4. Get CI green on the final commit. Default branches are protected and need a pull request.

## Merging

**Use rebase merges, never squash.**

```sh
gh pr merge --rebase
```

A GitHub squash commit is authored with the merging account's email, which would put a private address in a public repo. A rebase merge keeps each commit's author. Commit with your GitHub noreply address.

`CLAUDE.md` in [AlUmmahNowApple](https://github.com/Al-Ummah-Now/AlUmmahNowApple/blob/main/CLAUDE.md) and [AlUmmahNowAndroid](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/CLAUDE.md) still mentions squash merging. The rule on this page takes precedence.

## Tests are required

- Every change carries tests. The monorepo's [BEFORE_YOU_CODE.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/BEFORE_YOU_CODE.md) requires test-driven development.
- Never add `continue-on-error` to get past a failing check. Fix the code, the test or the workflow.
- User-facing work ships in English and Arabic, with RTL checked.
- E2E specs make their own data, clean all of it up even on failure, and run on the local stack unless they need a real deployment. A flaky test is a defect: fix it, or quarantine it with `quarantined: #<issue> @<owner>`. See [Testing and E2E](testing.md).
- Tests, CI and stage never spend money on paid AI providers. Use the mocked providers.
- Destructive actions use the in-app confirmation dialog, never `window.confirm`, `alert`, `prompt` or `beforeunload`. Lookups use the shared autocomplete, never a raw id box.

## Data changes

Change data through a migration or a checked script, never by hand.

- Migrations are **append-only and expand-only**. Never edit, rename or delete one that has been merged. Add a new one.
- In the monorepo, run `pnpm check:migrations` and `pnpm check:schema`, and commit updated schema snapshots with the migration. See [Release gates](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/CLAUDE.md#release-gates).
- In the CMS, follow [Changing the content model](https://github.com/Al-Ummah-Now/AlUmmahNowCMS/blob/main/README.md#changing-the-content-model).

## Spec → plan → implement

Larger work moves through three stages:

1. **Spec:** what and why, with decisions for the owner to review.
2. **Plan:** how it breaks into pull requests, tested against the spec.
3. **Implement:** small PRs that follow the plan.

See the [Specs index](specs-index.md). Examples: the [release pipeline spec](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/SPEC.md) and [plan](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/release-pipeline/PLAN.md).

## Follow-up work

Don't leave TODO comments. Implement the change now, or open a GitHub issue labelled `queue` and reference it.

## Product rules

Features must be tier-aware through the plans and entitlements system, managed by admins, and must not hard-code plans. See [Epic 27](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/specs/EPIC-27-PLAN.md).

## Secrets and security

All repositories are public. Never commit secrets, tokens, keys, `.env` or `.dev.vars` files, signing material or real user data. CI runs committed-secret checks in several repos.

Report vulnerabilities privately through the repo's **Security** tab, not in a public issue.
