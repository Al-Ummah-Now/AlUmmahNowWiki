[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# OpenAuth enterprise admin APIs

| | |
|---|---|
| **ID** | `OA-ADMIN-APIS` |
| **Owning repos** | [openauth](../repos/openauth.md), [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **shipped** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |

> Checked against openauth `master` and AlUmmahNowAuth `main` on 2026-11-14. Every file the six task plans list exists in `packages/openauth/src` (two were renamed: `client/d1-adapter.ts` is `client/client-d1-adapter.ts`, and the `rbac/api-types.ts` types live in `rbac/types.ts`). Auth mounts the user, RBAC and client admin APIs behind M2M tokens with an admin scope.

## Goal

Tenant-scoped M2M, user, RBAC, identity-provider, client and scope admin REST APIs.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| Phase 1 | M2M authentication | ✅ Done. `client_credentials` grant in `issuer.ts`, [`m2m/`](https://github.com/Al-Ummah-Now/openauth/tree/master/packages/openauth/src/m2m) with tests. Auth's admin APIs require an M2M token with an admin scope ([Auth#378](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/378)) |
| Phase 2 | User management | ✅ Done. [`user/`](https://github.com/Al-Ummah-Now/openauth/tree/master/packages/openauth/src/user) (D1 adapter, service, API) with tests. Auth mounts `userApiRoutes` on its admin users API |
| Phase 3 | RBAC REST APIs | ✅ Done. [`rbac/admin-endpoints.ts`](https://github.com/Al-Ummah-Now/openauth/tree/master/packages/openauth/src/rbac/admin-endpoints.ts), service and D1 adapter. Auth mounts `rbacAdminEndpoints` |
| Phase 4 | Dynamic identity providers | ✅ Built in openauth: [`dynamic-provider/`](https://github.com/Al-Ummah-Now/openauth/tree/master/packages/openauth/src/dynamic-provider) (encryption, cache, loader, API) with tests. Auth doesn't mount it; Auth configures its providers in code |
| Phase 5 | Scope authorization / client management | ✅ Done (client management). [`client/`](https://github.com/Al-Ummah-Now/openauth/tree/master/packages/openauth/src/client) (secret generator, validation, D1 adapter, API) with tests. Auth mounts `clientAdminRoutes` |
| Phase 6 | Security & audit / scope authorization | ✅ Built in openauth: [`middleware/`](https://github.com/Al-Ummah-Now/openauth/tree/master/packages/openauth/src/middleware) (bearer auth, require-scope, tenant isolation, rate limit) with tests. Auth uses its own `requireAdmin` (`apps/auth/src/middleware/admin-auth.ts`) instead |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- openauth `master`: `packages/openauth/src/{m2m,user,rbac,dynamic-provider,client,middleware}` with tests.
- AlUmmahNowAuth `main`: `apps/auth/src/index.ts` mounts `userApiRoutes`, `rbacAdminEndpoints` and `clientAdminRoutes` behind `requireAdmin()`; [Auth#378](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/378).

### Reconciled 2026-11-21

- **OA-ADMIN-APIS (AUN-542): In Progress** — both cross-checks agree: openauth dynamic-provider and middleware are built but not adopted by Auth, so phases 4 and 6 remain incomplete.; Phases 4 and 6 are built in openauth but unmounted (Auth uses its own requireAdmin) — the epic's stories are mixed, so not Done.
## Open questions

- None recorded in the sources.

## Conflicts between sources

- Phases 5 and 6 differ: IMPLEMENTATION_PLAN says 5 = scope auth, 6 = security & audit; `tasks/README` says 5 = client management, 6 = scope authorization. Both versions are built, so the difference no longer matters.

## Sources

- [openauth/docs/enterprise-admin-apis/IMPLEMENTATION_PLAN.md](https://github.com/Al-Ummah-Now/openauth/blob/8529f59fe365137438a6a47147ad1748d2a762b2/docs/enterprise-admin-apis/IMPLEMENTATION_PLAN.md)
