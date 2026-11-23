[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Cost monitoring dashboard and alerts

| | |
|---|---|
| **ID** | `AUN-COST` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **in progress** |
| **Last updated** | 2026-11-22 |

> Spec merged (#266, 2026-11-08); phases P0–P4 are open issues #268–#272. On 2026-11-12 a first slice landed: the `apps/cost-monitor` collector (deployed by every release) feeds platform analytics per environment to the admin **Operations** page ([#974](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/974), [#976](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/976)), per the [admin analytics design](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/main/docs/admin/LIVE_OPS.md). The Delivery page has daily cost inputs per source ([#896](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/896)). QA's own usage was cut in [#863](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/863). On 2026-11-14 COST-1 ([#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400), owner: "build infra, set a place in admin to set token") added the videos admin **Costs** page: super admins set a read-only Cloudflare token and optional Bunny and Resend keys there (AES-GCM sealed, only the last 4 shown, audited, with a connection test); the collector runs through a queue with retry and a DLQ (failures on the Errors page with Retry) and adds Containers, Bunny billing and Resend; the page shows month to date against the budget, the forecast, products, environments and top movers; budget, spike and weekly digest alerts go by email to admins who opt in and to the Errors page, with thresholds edited on the page. With no token it says so and nothing fails. On 2026-11-22 COST-GAPS ([AlUmmahNow#1729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1729), building, stacked on [AlUmmahNow#1665](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1665)) makes Costs cover every platform cost:
- **Every Cloudflare invoice line:** a billing model of 23 meters, with allowances applied once per account per month and whole-unit billing. A unit test reproduces the 2026-10-23 → 11-21 invoice line by line, to the cent.
  - New meters come from the collector's existing GraphQL query: Workers CPU, KV lists and deletes, Workers Logs events and Logpush requests.
  - The budget, forecast, idle cost and alerts use the billed estimate. A "list price and billed" panel shows each line.
  - Lines we have no source for are marked: Browser Run (another project), Analytics Engine (not billed) and Images.
- **Fixed and other costs:** a list super admins edit (Apple Developer, domains, GitHub, Linear, AI subscriptions, DeepL, ElevenLabs). Yearly items are spread monthly. Every change is audited, and the items count in the budget and alerts.
- **Idle cost for every resource:** each resource gets its own idle figure against the single $50 platform target, not just the top 15.
- **Alert settings on the page:** budget levels, forecast alert, jump factor and minimums, and the weekly digest day and hour (New York time).
- **Daily chart on the viewer's calendar:** each bar holds the UTC days its sources report, and tapping a bar names them. Cents are rounded so finished days never change and the month adds up to the month to date.
- **Operations** keeps usage and health per environment; spend moved to Costs.

## Goal

Admin cost/usage dashboard with register-based alerts, built from the CloudFlareCostMonitor work, so platform spend can be monitored.

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| P0 | Verify data sources, read-only token, CF notifications | Open #268; the read-only token is set in Costs → Connections and tested there ([#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400)); CF notifications not set up |
| P1 | Collector worker, costs D1, minimal overview | Done — both audits agree: AlUmmahNow#974, #976 (merged): collector and Operations page; AlUmmahNow#1400 (merged): queue-backed collector and Costs page; AlUmmahNow#974; AlUmmahNow#976; AlUmmahNow#1400 |
| P2 | Alert engine | Done — both audits agree: AlUmmahNow#1400 (merged): budget, spike, forecast and digest alerts; AlUmmahNow#1400 |
| P3 | Full dashboard | Done — both audits agree: AlUmmahNow#1400 (merged): Costs budget, forecast, products, environments, trends and movers; AlUmmahNow#1400 |
| P4 | Resend cost, invoice reconciliation | Resend cost by plan from the emails sent ([AlUmmahNow#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400), merged). Invoice reconciliation is building in [AlUmmahNow#1729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1729): every Cloudflare line against the invoice, plus fixed costs ([AlUmmahNow#272](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/272)) |

## Decisions and constraints

- [O1](decisions.md#o1-cost-conscious-design): Cost-conscious design (decided)
- [O24](decisions.md#o24-cost-dashboard-per-channel-cost-later-opt-in-alerts): Cost dashboard; per-channel cost later; opt-in alerts (decided)

Platform-wide constraints that apply to every epic:

- Cost-conscious design: prefer low per-video and per-view unit costs ([O1](decisions.md#o1-cost-conscious-design), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- PR [AlUmmahNow#266](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/266)
- PR [AlUmmahNow#1400](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1400) (COST-1)
- PR [AlUmmahNow#1729](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/1729) (COST-GAPS, building)
- Linear [AUN-1](https://linear.app/hamzalabs/issue/AUN-1/aun-cost-cost-monitoring-dashboard-and-alerts)
- Issue [AlUmmahNow#268](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/268)
- Issue [AlUmmahNow#269](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/269)
- Issue [AlUmmahNow#270](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/270)
- Issue [AlUmmahNow#271](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/271)
- Issue [AlUmmahNow#272](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/272)

### Reconciled 2026-11-21

- **AUN-COST / Collector worker, costs D1, minimal overview (AUN-3): Done** — both audits agree: AlUmmahNow#974, #976 (merged): collector and Operations page; AlUmmahNow#1400 (merged): queued collector and Costs page; AlUmmahNow#974; AlUmmahNow#976; AlUmmahNow#1400
- **AUN-COST / Alert engine (AUN-4): Done** — both audits agree: AlUmmahNow#1400 (merged): budget, spike, forecast and digest alerts; AlUmmahNow#1400
- **AUN-COST / Full dashboard (AUN-5): Done** — both audits agree: AlUmmahNow#1400 (merged): Costs budget, forecast, products, environments, trends and movers; AlUmmahNow#1400
## Open questions

- None recorded in the sources.

## Sources

- [docs/cost-monitoring/README.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/cost-monitoring/README.md)
- [AlUmmahNow#266](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/266)
