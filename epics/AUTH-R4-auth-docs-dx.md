[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: Documentation & developer experience

| | |
|---|---|
| **ID** | `AUTH-R4` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **planned** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |

> No evidence of SDKs or a developer portal. The roadmap (Dec 2024, links to the old `meywd/AlUmmahNowAuth`) still says **0/5 issues** for every epic and was never updated. Later work (Lanes, the openauth fork, JWT/RBAC docs, Epic 9) built much of it.

## Goal

Auth roadmap epic `category/docs` (P1, Beta).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | OpenAPI | In Progress — split one step: partially built, acceptance not fully met: Kimi: openapi.yaml documents core OAuth endpoints only and no interactive docs route exists; ROADMAP.md:67 requires a complete interactive specification.; GLM: AlUmmahNowAuth/openapi.yaml exists on main with the API reference from #48. |
| – | SDKs (JS/TS, Python, Go) | In Progress — both audits agree: AlUmmahNowAuth#48 (merged): TypeScript SDK documentation; AlUmmahNowAuth issue #18 (open): frontend SDK/client package; @al-ummah-now/openauth (npm) |
| – | Integration guides | Done — both cross-checks agree: CLIENT-INTEGRATION-GUIDE.md contains Next.js, React Router and Vue 3 sections plus runnable flow examples; #17 is closed.; Auth#17 (quickstart, API reference, migration guide) closed and #48 (API + SDK docs) merged. |
| – | Example apps | Done — both cross-checks agree: openauth examples/client contains Next.js, React, SvelteKit and API demo apps with real auth flows; #54 maintains them.; openauth/examples/ ships quickstart, client, issuer and enterprise examples (#54 upgraded them). |
| – | Developer portal | In Progress — both cross-checks agree: AlUmmahNowUI#110/#135 ship a general developer site, but ROADMAP.md:71 requires API testing, key management and usage analytics, which it lacks.; alummahnow.dev + the system-design section (UI#135) serve developers, but there is no auth-specific developer portal/console beyond the internal admin clients UI. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

### Reconciled 2026-11-21

- **AUTH-R4 / SDKs (JS/TS, Python, Go) (HLB-525): In Progress** — both audits agree: AlUmmahNowAuth#48 (merged): TypeScript SDK documentation; AlUmmahNowAuth issue #18 (open): frontend SDK/client package; @al-ummah-now/openauth (npm)
- **AUTH-R4 (HLB-523): In Progress** — both cross-checks agree: OpenAPI/guides/examples exist, but the developer portal and multi-language SDK acceptance remain incomplete, so AUTH-R4 is underway.; Mixed finals: OpenAPI/guides/examples Done, SDKs and developer portal In Progress — epic not complete.
- **AUTH-R4 / OpenAPI (HLB-524): In Progress** — split one step: partially built, acceptance not fully met: Kimi: openapi.yaml documents core OAuth endpoints only and no interactive docs route exists; ROADMAP.md:67 requires a complete interactive specification.; GLM: AlUmmahNowAuth/openapi.yaml exists on main with the API reference from #48.
- **AUTH-R4 / Integration guides (HLB-526): Done** — both cross-checks agree: CLIENT-INTEGRATION-GUIDE.md contains Next.js, React Router and Vue 3 sections plus runnable flow examples; #17 is closed.; Auth#17 (quickstart, API reference, migration guide) closed and #48 (API + SDK docs) merged.
- **AUTH-R4 / Example apps (HLB-527): Done** — both cross-checks agree: openauth examples/client contains Next.js, React, SvelteKit and API demo apps with real auth flows; #54 maintains them.; openauth/examples/ ships quickstart, client, issuer and enterprise examples (#54 upgraded them).
- **AUTH-R4 / Developer portal (HLB-528): In Progress** — both cross-checks agree: AlUmmahNowUI#110/#135 ship a general developer site, but ROADMAP.md:71 requires API testing, key management and usage analytics, which it lacks.; alummahnow.dev + the system-design section (UI#135) serve developers, but there is no auth-specific developer portal/console beyond the internal admin clients UI.
## Open questions

- None recorded in the sources.

## Conflicts between sources

- Roadmap status "0/5" disagrees with later implementation docs; status here comes from those docs.
- README says "Phase 1 Complete, Phase 2 In Progress"; `.github/copilot-instructions.md` has a different Phase 1–4 list with the same numbers.

## Sources

- [AlUmmahNowAuth/ROADMAP.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/ROADMAP.md)
- [AlUmmahNowAuth/.github/ISSUE_TEMPLATE/roadmap_epic.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/.github/ISSUE_TEMPLATE/roadmap_epic.md)
- [AlUmmahNowAuth#22](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/22)
- [AlUmmahNowAuth#8](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/issues/8) (closed roadmap issue)
