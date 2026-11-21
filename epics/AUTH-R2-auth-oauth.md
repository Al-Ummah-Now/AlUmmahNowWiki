[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Auth v1.0 roadmap: OAuth & external authentication

| | |
|---|---|
| **ID** | `AUTH-R2` |
| **Owning repos** | [AlUmmahNowAuth](../repos/AlUmmahNowAuth.md) |
| **Status** | **shipped** (reconciled 2026-11-21; see Status evidence) |
| **Last updated** | 2026-11-21 |

> PKCE, client management, introspection, native clients (9.1), device flow (9.2) shipped; SAML/LDAP not built. The roadmap (Dec 2024, links to the old `meywd/AlUmmahNowAuth`) still says **0/5 issues** for every epic and was never updated. Later work (Lanes, the openauth fork, JWT/RBAC docs, Epic 9) built much of it.

## Goal

Auth roadmap epic `category/oauth` (P0, Alpha).

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| – | OAuth 2.0/OIDC compliance | Issue #__ (never filed) |
| – | Authorization code + PKCE | Issue #__ (never filed) |
| – | Client management | Issue #__ (never filed) |
| – | Social auth | Issue #__ (never filed) |
| – | SAML 2.0, LDAP/AD | Issue #__ (never filed) |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- 2026-11-15, AUTH-1: public clients must send PKCE on `/authorize` ([Auth#392](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/392)); confidential clients authenticate with their secret on the code and refresh grants ([openauth#52](https://github.com/Al-Ummah-Now/openauth/pull/52), [Auth#394](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/394), [Auth#395](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/395)); `/select-account` finds the client by id ([Auth#391](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/391)); `/password/change` is no longer an open redirect ([Auth#384](https://github.com/Al-Ummah-Now/AlUmmahNowAuth/pull/384)). See [Authentication](../guides/authentication.md#signing-in).

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
