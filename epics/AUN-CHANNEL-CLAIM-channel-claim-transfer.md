[← Epics](README.md) · [Decisions](decisions.md) · [Home](../README.md)

# Channel claim, transfer and self-service account move

| | |
|---|---|
| **ID** | `AUN-CHANNEL-CLAIM` |
| **Owning repos** | [AlUmmahNow](../repos/AlUmmahNow.md) |
| **Status** | **planned** |
| **Last updated** | 2026-11-10 |

> Spec PR #460 open.

## Goal

Claim imported channels, transfer ownership, move a channel between accounts.

## Decisions and constraints

- [O17](decisions.md#o17-super-admins-claim-and-assign-official-channels): Super admins claim and assign official channels (decided)

Platform-wide constraints that apply to every epic:

- Whole-platform infrastructure cost cap of **≤ $500/month** ([O1](decisions.md#o1-whole-platform-cost-cap), [D2](D2-video-delivery.md)).
- Payments go through pluggable providers; **never Stripe** ([O4](decisions.md#o4-pluggable-payment-providers-never-stripe-admin-managed-plans), [T2](decisions.md#t2-billing-provider)).
- Every feature is tiered, with plans **custom and admin-managed** ([T1](decisions.md#t1-plans-are-admin-managed)). Uploads and channel creation are invite-only through admin-assigned creator tiers until subscriptions exist ([O25](decisions.md#o25-invite-only-uploads-with-admin-assigned-creator-tiers)).
- UI is bilingual en/ar with RTL. Sign-in and profile pages default to **English unless `?lang=ar`** ([O21](decisions.md#o21-english-default-on-sign-in-and-profile)).

## Status evidence

- Open [AlUmmahNow#460](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460)

## Open questions

- Owner answered questions 1–3 in chat; question 4 got "what you mean?" and 5–7 have no answer.

## Conflicts between sources

- Overlaps Epic 29.18 (deletion/transfer).

## Sources

- [CHANNEL-CLAIM-AND-TRANSFER.md (PR #460)](https://github.com/Al-Ummah-Now/AlUmmahNow/pull/460)
- Chat: thread `88dac88f-5d24-4a1c-99f8-f9fedb3a4186`, 2026-11-09 02:57 UTC (`t3-thread://v2/2cc5e992-ec65-4390-8c9f-89a484014a6f/thread:delegated-task:command%3Amcp%3Aecc01bc5-fad0-4ead-b91b-d432567940f7%3Adelegate-task%3A88dac88f-5d24-4a1c-99f8-f9fedb3a4186`)
