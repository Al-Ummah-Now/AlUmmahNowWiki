[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Cost monitoring dashboard and alerts

| | |
|---|---|
| **ID** | `AUN-COST` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **planned** |
| **Last updated** | 2026-11-10 |

> Spec merged (#266, 2026-11-08); phases P0–P4 are open issues #268–#272.

## Goal

Admin cost/usage dashboard with register-based alerts, built from the CloudFlareCostMonitor work, so the ≤ $500/month cap can be watched.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| P0 | Verify data sources, read-only token, CF notifications | Open #268 |
| P1 | Collector worker, costs D1, minimal overview | Open #269 |
| P2 | Alert engine | Open #270 |
| P3 | Full dashboard | Open #271 |
| P4 | Resend cost, invoice reconciliation | Open #272 |

## Decisions and constraints

- [O1](decisions.md#o1-whole-platform-cost-cap): Whole-platform cost cap (decided)
- [O24](decisions.md#o24-cost-dashboard-per-channel-cost-later-opt-in-alerts): Cost dashboard; per-channel cost later; opt-in alerts (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PR [AlUmmahNow#266](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/266)
- Issue [AlUmmahNow#268](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/268)
- Issue [AlUmmahNow#269](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/269)
- Issue [AlUmmahNow#270](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/270)
- Issue [AlUmmahNow#271](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/271)
- Issue [AlUmmahNow#272](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/272)

## Open questions

- None recorded in the sources.

## Sources

- [docs/cost-monitoring/README.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/cost-monitoring/README.md)
- Chat: thread `ca9c255e-341c-4821-ada6-54d23f461cd6`, 2026-11-08 11:57 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3A444e2ab3-52df-463a-848e-1004dbc78f19%3Adelegate-task%3Aca9c255e-341c-4821-ada6-54d23f461cd6`)
