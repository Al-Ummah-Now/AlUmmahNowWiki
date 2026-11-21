[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Cost monitoring dashboard and alerts

| | |
|---|---|
| **ID** | `AUN-COST` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-21 |

> Spec merged (#266, 2026-11-08); phases P0–P4 are open issues #268–#272. On 2026-11-12 a first slice landed: the `apps/cost-monitor` collector (deployed by every release) feeds platform analytics per environment to the admin **Operations** page ([#974](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/974), [#976](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/976)), per the [admin analytics design](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/admin/LIVE_OPS.md). The Delivery page has daily cost inputs per source ([#896](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/896)). QA's own usage was cut in [#863](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/863). On 2026-11-14 COST-1 ([#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400), owner: "build infra, set a place in admin to set token") added the videos admin **Costs** page: super admins set a read-only Cloudflare token and optional Bunny and Resend keys there (AES-GCM sealed, only the last 4 shown, audited, with a connection test); the collector runs through a queue with retry and a DLQ (failures on the Errors page with Retry) and adds Containers, Bunny billing and Resend; the page shows month to date against the budget, the forecast, products, environments and top movers; budget, spike and weekly digest alerts go by email to admins who opt in and to the Errors page, with thresholds edited on the page. With no token it says so and nothing fails. On 2026-11-21 COST-GAPS ([#1729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1729), in review) made **Costs** the one place for spend: Cloudflare as billed (allowances once per account and month, whole units; reconciled to the cent with the owner's $262.51 invoice for 10-23 → 11-21) next to list price per invoice line, with Workers Logs, Logpush, CPU as billed and KV lists/deletes added and a shared-account note (Browser Run hours on the invoice are another project's); a super-admin **Fixed and other costs** list (Apple, domains, GitHub, Linear, AI subscriptions, DeepL, ElevenLabs; monthly or yearly, audited) in the budget, forecast and alerts; and the idle cost, per-source daily chart and drivers moved off **Operations**, which is now usage and health per environment only (owner 2026-11-21; the env switch now changes everything on the page). A read-only billing API exists (`/billing/usage/paygo`) but needs the Billing Read permission: not added without the owner's OK.

## Goal

Admin cost/usage dashboard with register-based alerts, built from the CloudFlareCostMonitor work, so the ≤ $500/month cap can be watched.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| P0 | Verify data sources, read-only token, CF notifications | Open #268; the read-only token is set in Costs → Connections and tested there ([#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400)); CF notifications not set up |
| P1 | Collector worker, costs D1, minimal overview | Done — both audits agree: AlUmmahNow#974, #976 (merged): collector and Operations page; AlUmmahNow#1400 (merged): queue-backed collector and Costs page; AlUmmahNow#974; AlUmmahNow#976; AlUmmahNow#1400 |
| P2 | Alert engine | Done — both audits agree: AlUmmahNow#1400 (merged): budget, spike, forecast and digest alerts; AlUmmahNow#1400 |
| P3 | Full dashboard | Done — both audits agree: AlUmmahNow#1400 (merged): Costs budget, forecast, products, environments, trends and movers; AlUmmahNow#1400 |
| P4 | Resend cost, invoice reconciliation | Resend cost by plan from the emails sent ([#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400)); invoice reconciliation: billing model reconciled to the 2026-11-21 invoice, billed vs list on Costs ([#1729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1729), in review); reading the bill itself needs Billing Read (owner's OK) — #272 |
| COST-GAPS | Every cost source; Operations usage only | [#1729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1729) in review: billed meters, fixed and other costs, spend moved from Operations, env switch E2E |

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
- PR [AlUmmahNow#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400) (COST-1)
- PR [AlUmmahNow#1729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1729) (COST-GAPS)
- Issue [AlUmmahNow#268](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/268)
- Issue [AlUmmahNow#269](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/269)
- Issue [AlUmmahNow#270](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/270)
- Issue [AlUmmahNow#271](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/271)
- Issue [AlUmmahNow#272](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/272)

### Reconciled 2026-11-21

- **AUN-COST / Collector worker, costs D1, minimal overview (HLB-440): Done** — both audits agree: AlUmmahNow#974, #976 (merged): collector and Operations page; AlUmmahNow#1400 (merged): queued collector and Costs page; AlUmmahNow#974; AlUmmahNow#976; AlUmmahNow#1400
- **AUN-COST / Alert engine (HLB-441): Done** — both audits agree: AlUmmahNow#1400 (merged): budget, spike, forecast and digest alerts; AlUmmahNow#1400
- **AUN-COST / Full dashboard (HLB-442): Done** — both audits agree: AlUmmahNow#1400 (merged): Costs budget, forecast, products, environments, trends and movers; AlUmmahNow#1400
## Open questions

- None recorded in the sources.

## Sources

- [docs/cost-monitoring/README.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/cost-monitoring/README.md)
- [AlUmmahNow#266](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/266)
