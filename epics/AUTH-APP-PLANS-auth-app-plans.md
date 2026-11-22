[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth app plans: admin enhancement, RBAC UI, refactor, M2M admin API, OpenAuth 1.0.9 migration

| | |
|---|---|
| **ID** | `AUTH-APP-PLANS` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> OpenAuth 1.0.9 migration phases 1–5 "✅ COMPLETED" (202/202 tests); JWT phases 0–4 complete; RBAC "97% complete"; admin enhancement, RBAC UI, refactor and M2M phases have no status.

## Goal

Per-app plans for the auth service and its admin app.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Admin enh. P1–P6 | Critical functionality, UX, RBAC, security, administrative, polish | In Progress — both audits agree: AlUmmahNowAuth#197, #299, #304, #320, #374, #375 (merged): admin users, invites, dialogs and accessibility; AlUmmahNowAuth issue #431 (open): Arabic admin pages remain partly English; apps/admin/app/routes/users._index.tsx; apps/admin/app/routes/audit.tsx |
| RBAC UI P1–P7 | Admin app to full RBAC | Done — both cross-checks agree: RBAC_UI_PLAN phases are wired on main: roles CRUD/permissions pages, user-role manager, dashboard stats and M2M APIs all exist.; Auth#76 (full RBAC impl) plus #374/#375/#437 (role pages, figures, M2M wiring) merged; roles list/detail admin UI on main. |
| Refactor P1–P4 | Use OpenAuth `clientAdminRoutes` | Done — both cross-checks agree: apps/auth/src/index.ts:347-359 mounts clientAdminRoutes; admin-api.server.ts uses PATCH and /rotate, and old client handlers are removed.; apps/auth/src/router.ts: client routes "now handled by adminClientApp (OpenAuth's clientAdminRoutes)" — the refactor landed in auth itself. |
| M2M P1–P6 | Admin app calls auth APIs with client_credentials | Done — both cross-checks agree: apps/admin/app/lib/admin-api.server.ts implements client_credentials and users/roles/clients/audit calls; route files use it rather than direct business-data D1 access.; Auth#197/#378/#394/#395/#437 merged: admin signs in as a confidential client and role/users pages call Auth with scoped M2M tokens. |
| Migration P1–P5 | Adopt openauth 1.0.9, delete ~3k LOC | Completed |
| JWT P0–P5 (#74) | Key management, token service, rotation | Completed |
| Audit tests P1–P5 (#65) | Edge-case tests for audit logging | Done — both cross-checks agree: audit-edge-cases.test.ts covers errors, large payloads, sinks and concurrent emits, and #65 is closed after the edge-case test expansion.; Tracking issue Auth#65 closed with the audit test suites (#60/#62/#72/#241) merged. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- None found on GitHub or in the repos.

### Reconciled 2026-11-21

- **AUTH-APP-PLANS / Critical functionality, UX, RBAC, security, administrative, polish (AUN-77): In Progress** — both audits agree: AlUmmahNowAuth#197, #299, #304, #320, #374, #375 (merged): admin users, invites, dialogs and accessibility; AlUmmahNowAuth issue #431 (open): Arabic admin pages remain partly English; apps/admin/app/routes/users._index.tsx; apps/admin/app/routes/audit.tsx
- **AUTH-APP-PLANS / Admin app to full RBAC (AUN-78): Done** — both cross-checks agree: RBAC_UI_PLAN phases are wired on main: roles CRUD/permissions pages, user-role manager, dashboard stats and M2M APIs all exist.; Auth#76 (full RBAC impl) plus #374/#375/#437 (role pages, figures, M2M wiring) merged; roles list/detail admin UI on main.
- **AUTH-APP-PLANS / Use OpenAuth clientAdminRoutes (AUN-79): Done** — both cross-checks agree: apps/auth/src/index.ts:347-359 mounts clientAdminRoutes; admin-api.server.ts uses PATCH and /rotate, and old client handlers are removed.; apps/auth/src/router.ts: client routes "now handled by adminClientApp (OpenAuth's clientAdminRoutes)" — the refactor landed in auth itself.
- **AUTH-APP-PLANS / Admin app calls auth APIs with client_credentials (AUN-80): Done** — both cross-checks agree: apps/admin/app/lib/admin-api.server.ts implements client_credentials and users/roles/clients/audit calls; route files use it rather than direct business-data D1 access.; Auth#197/#378/#394/#395/#437 merged: admin signs in as a confidential client and role/users pages call Auth with scoped M2M tokens.
- **AUTH-APP-PLANS / Edge-case tests for audit logging (AUN-83): Done** — both cross-checks agree: audit-edge-cases.test.ts covers errors, large payloads, sinks and concurrent emits, and #65 is closed after the edge-case test expansion.; Tracking issue Auth#65 closed with the audit test suites (#60/#62/#72/#241) merged.
## Open questions

- None recorded in the sources.

## Conflicts between sources

- `RBAC_IMPLEMENTATION_STATUS.md` describes `role-service.ts` / `permission-service.ts` as production ready, but the migration plan deleted them.

## Sources

- [AlUmmahNowAuth/apps/admin/ENHANCEMENT_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/apps/admin/ENHANCEMENT_PLAN.md)
- [AlUmmahNowAuth/apps/admin/RBAC_UI_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/apps/admin/RBAC_UI_PLAN.md)
- [AlUmmahNowAuth/apps/auth/REFACTOR_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/apps/auth/REFACTOR_PLAN.md)
- [AlUmmahNowAuth/apps/auth/docs/PLAN_M2M_ADMIN_API.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/apps/auth/docs/PLAN_M2M_ADMIN_API.md)
- [AlUmmahNowAuth/apps/auth/docs/MIGRATION_PLAN.md](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/blob/5d563e10662615e910a1e00d98e029a7b1e6329e/apps/auth/docs/MIGRATION_PLAN.md)
