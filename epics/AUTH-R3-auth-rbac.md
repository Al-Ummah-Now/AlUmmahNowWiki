[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: RBAC & user management

| | |
|---|---|
| **ID** | `AUTH-R3` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> RBAC "97% complete" and migrated to OpenAuth RBAC; tenants implemented (Lane 5); deletion/export shipped (9.7). The roadmap (Dec 2024, links to the old `meywd/AlUmmahNowAuth`) still says **0/5 issues** for every epic and was never updated. Later work (Lanes, the openauth fork, JWT/RBAC docs, Epic 9) built much of it.

## Goal

Auth roadmap epic `category/rbac` (P1, Beta v0.9.0).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | Role hierarchy | Done — both audits agree: AlUmmahNowAuth#75, #76 (merged): role hierarchy and RBAC; openauth#7, #32, #46 (merged): RBAC and permission-cache hardening; openauth rbac/admin-endpoints.ts; apps/admin/app/routes/roles._index.tsx |
| – | Profile management | Done — both audits agree: AlUmmahNowAuth#254, #327, #339 (merged): profile, display names and cross-app name updates; apps/profile; apps/auth/src/services/d1-user-service.ts |
| – | Organisation/tenant support | Done — both audits agree: openauth#5, #21, #36 (merged): multi-tenant issuer and tenant theming; AlUmmahNowAuth#173 (merged): tenant route authentication; apps/auth/src/adapters/tenant-adapter.ts |
| – | Import/export (GDPR) | Done — both audits agree: AlUmmahNowAuth#233 (merged): in-app account deletion and export; AlUmmahNowAuth#293, #326, #335, #351 (merged): erasure cleanup; apps/auth/src/routes/account-routes.ts |
| – | Self-service features | In Progress — split one step: partially built, acceptance not fully met: Kimi: ROADMAP.md:63 requires profile updates, password change and deletion; account-routes has DELETE /account but no hub deletion UI or account.deleted delivery.; GLM: Deletion/export (#233), passkeys (#366), profile hub and password change (apps/auth/src/security/password-change-redirect.ts) all merged. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

### Reconciled 2026-11-21

- **AUTH-R3 / Role hierarchy (AUN-123): Done** — both audits agree: AlUmmahNowAuth#75, #76 (merged): role hierarchy and RBAC; openauth#7, #32, #46 (merged): RBAC and permission-cache hardening; openauth rbac/admin-endpoints.ts; apps/admin/app/routes/roles._index.tsx
- **AUTH-R3 / Profile management (AUN-124): Done** — both audits agree: AlUmmahNowAuth#254, #327, #339 (merged): profile, display names and cross-app name updates; apps/profile; apps/auth/src/services/d1-user-service.ts
- **AUTH-R3 / Organisation/tenant support (AUN-125): Done** — both audits agree: openauth#5, #21, #36 (merged): multi-tenant issuer and tenant theming; AlUmmahNowAuth#173 (merged): tenant route authentication; apps/auth/src/adapters/tenant-adapter.ts
- **AUTH-R3 / Import/export (GDPR) (AUN-126): Done** — both audits agree: AlUmmahNowAuth#233 (merged): in-app account deletion and export; AlUmmahNowAuth#293, #326, #335, #351 (merged): erasure cleanup; apps/auth/src/routes/account-routes.ts
- **AUTH-R3 / Self-service features (AUN-127): In Progress** — split one step: partially built, acceptance not fully met: Kimi: ROADMAP.md:63 requires profile updates, password change and deletion; account-routes has DELETE /account but no hub deletion UI or account.deleted delivery.; GLM: Deletion/export (#233), passkeys (#366), profile hub and password change (apps/auth/src/security/password-change-redirect.ts) all merged.
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
