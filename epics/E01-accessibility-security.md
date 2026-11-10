[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Epic 1: Critical accessibility & security compliance

| | |
|---|---|
| **ID** | `E01` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **shipped** |
| **Last updated** | 2026-11-08 |

> All code ACs done (audit 2026-11-08). Sign-off ACs (pen test, GDPR audit, usability test, screen-reader pass) need people: #349.

## Goal

Fix the WCAG 2.1 AA, security and GDPR problems in the video player reported in #87.

## Scope

- Colour contrast, scoped and validated listeners, CSP
- GDPR storage: encryption, access/export/delete, consent, retention
- Keyboard reach, skip links, help; 44px touch targets

## Stories

| Story | What | Status / acceptance notes |
|---|---|---|
| 1.1 | Fix WCAG colour contrast violations | Done. AC 1–5: contrast tests + control scrim test; axe 0 violations on QA. |
| 1.2 | Remove global event-listener vulnerabilities | Done (AC 1, 2, 4, 5: `isTrusted`, rate limit, scoped listeners, CSP live on QA). AC 3, 6 (pen test): needs people, #349. |
| 1.3 | GDPR-compliant data storage | Done (AC 1–5: encryption, privacy endpoints, consent, retention). AC 6 (GDPR audit): needs people. |
| 1.4 | Keyboard navigation | Done (AC 1–6). Manual screen-reader pass: #349. |
| 1.5 | Mobile touch targets | Done (AC 1–5, #333). AC 6 usability testing: needs people. |

## Decisions and constraints


Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md) (audit 2026-11-08)
- [docs/tech-spec-epic-1.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/tech-spec-epic-1.md) header: `Status: Complete`
- Issue [AlUmmahNow#87](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/87)
- PRs [AlUmmahNow#331](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/331), [AlUmmahNow#333](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/333), [AlUmmahNow#341](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/341)
- People-led follow-up [AlUmmahNow#349](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/349); CSS/perf cleanup [AlUmmahNow#348](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/348)

GitHub issues and PRs that name this epic (org-wide sweep, 2026-11-10):

| Repo | # | Type | Title | State | Updated |
|---|---|---|---|---|---|
| AlUmmahNow | [#165](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/165) | PR | Epic 1: security hardening (1.2) and GDPR compliance (1.3) | MERGED | 2026-11-07 |
| AlUmmahNow | [#166](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/166) | PR | feat(web): Epic 1 accessibility - WCAG contrast, keyboard navigation, touch targets (stories 1.1, 1.4, 1.5) | MERGED | 2026-11-07 |
| AlUmmahNow | [#331](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/331) | PR | fix(web): volume slider is localized and moves one step per key (#87) | MERGED | 2026-11-08 |
| AlUmmahNow | [#333](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/333) | PR | fix(web): 44px touch targets and 4s control auto-hide on the player (#87, #210) | MERGED | 2026-11-08 |
| AlUmmahNow | [#336](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/336) | PR | feat(web): report volume, playback rate and load milestones (#79) | MERGED | 2026-11-08 |
| AlUmmahNow | [#349](https://github.com/Al-Ummah-Now/AlUmmahNow/issues/349) | issue | Compliance sign-offs for the video player: pen test, GDPR review, WCAG audit, VPAT | OPEN | 2026-11-08 |
| AlUmmahNow | [#385](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/385) | PR | feat(entitlements): plans schema, Free seed, catalogue and resolver (Epic 27, 1/6) | MERGED | 2026-11-08 |
| AlUmmahNow | [#426](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/426) | PR | test(release): player accessibility, touch and analytics; Epics 1-4 status | MERGED | 2026-11-08 |

## Open questions

- Pen test, GDPR audit and usability testing have no owner yet (#349).

## Conflicts between sources

- `docs/tech-spec-epic-1.md` says **Complete**; STATUS-1-4 counts stories 1.2, 1.3 and 1.5 as **partly done** because their sign-off ACs need people. This wiki records *shipped* (code) with the sign-off gap noted.

## Sources

- [docs/epics.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics.md)
- [docs/archive/epics-original.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/archive/epics-original.md)
- [docs/tech-spec-epic-1.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/tech-spec-epic-1.md)
- [docs/epics/STATUS-1-4.md](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/epics/STATUS-1-4.md)
- [docs/stories/1-*](https://github.com/Al-Ummah-Now/AlUmmahNow/blob/56811623fceb866a556aabaef1bb6bc8bf6a1362/docs/stories/1-1-wcag-color-contrast.md)
