# EstateHub.ph — User Journeys

*Grounded in the competitive research (`research-synthesis.md`), the approved sitemap (`sitemap.md`), and the confirmed brokerage model. Written before any design or build; this is the behavioral layer between the sitemap (where pages are) and the design phase (what each page looks like).*

## The one rule all journeys share

EstateHub is a full-service brokerage: **every journey converts to a conversation with a licensed broker** — never a checkout, never a self-serve listing flow. The website's whole job is to get six different kinds of people to that conversation with enough confidence and context that the broker's first reply is already useful. "Contact us" is the single conversion action everywhere; search/browse is the self-serve *on-ramp* for property-seekers, not a separate destination.

Shared stage framework used below:

**Arrive → Orient → Evaluate → Contact → Handoff**
(how they land) → (do they understand what EstateHub is?) → (do they trust it enough / find what fits?) → (the conversion moment) → (what happens after the form/Messenger message)

---

## Journey 1 — Home buyer (local)

**Who:** end-user or investor in the Philippines; browsing on mobile; comparison-shopping across Lamudi/Dot Property tabs at the same time.
**Arrives via:** Google search, Facebook ad, referral. Lands on `/` or directly on a shared `/properties/[slug]` link.

| Stage | Where | What they need | Drop-off risk |
|---|---|---|---|
| Arrive | `/` | Search above the fold, instantly | Hero clutter; slow mobile load |
| Orient | `/` | "This is a brokerage — an agent handles it for me" said plainly | Reads as just another portal; nothing differentiates |
| Evaluate | `/properties` → `/properties/[slug]` | Honest filters (location/type/budget/buy-rent), real photos, complete specs, price stated | Thin/fake-feeling inventory; missing prices ("price on request" fatigue) |
| Contact | Agent block on `/properties/[slug]` | Low-stakes ask ("inquire about this property"), Messenger option, a named licensed broker | Generic form with no human attached; fear of agent spam |
| Handoff | (broker responds) | Fast, personal reply referencing the exact property | Slow/no response — kills the trust the site built |

**Design demands:** persistent nav search (they bounce between listings repeatedly); property detail page is the real conversion surface, not the homepage; inquiry should carry the property context into the form automatically.

## Journey 2 — Renter

**Who:** tenant seeking a lease; fastest-moving, most mobile, most Messenger-native audience; often needs to close within weeks.
**Arrives via:** Facebook (groups/marketplace habits), Google, referrals.

Same browse path as Journey 1 (`/` or `/properties` filtered to rent → detail → inquire), with two differences:

- **Speed matters more than depth** — they'll message 5 listings tonight; whoever replies first wins. Messenger-first contact, minimal form friction.
- `/services/lease` serves the *process-anxious* subset (first-time renters, relocators): what the lease process is, what EstateHub handles, what it costs a tenant (if anything — to be confirmed by the business).

**Drop-off risk:** any friction before the message is sent. **Design demand:** on rent listings, Messenger should be at least as prominent as the form.

## Journey 3 — Property seller

**Who:** owner who wants to sell; older-skewing, trust-driven, likely burned by or wary of "post it yourself" portals and Facebook flippers.
**Arrives via:** referral (dominant for brokerages), Google "paano magbenta ng bahay/how to sell my house", About/brand curiosity.

| Stage | Where | What they need | Drop-off risk |
|---|---|---|---|
| Arrive | `/` | The homepage must say sellers are served too — not just buyers | Site reads buyer-only; seller leaves for a portal |
| Orient | `/services/sales` | **"We sell it for you"** stated immediately — portal-trained users will look for a "post listing" button that intentionally doesn't exist; the page must preempt that expectation, not just omit the button | Confusion → "where do I upload my property?" → exit |
| Evaluate | `/services/sales`, `/about` | How it works step-by-step (valuation → marketing → viewings → closing), commission model plainly explained, PRC-licensed brokers, real team | Vague process; hidden fees feeling; no faces |
| Contact | `/contact` (intent: selling) | A form that asks about *their property*, not just their email | Generic contact form that ignores their situation |
| Handoff | (broker responds) | A valuation conversation, not a sales pitch | Slow response; feeling processed |

**Design demand:** the Sales service page carries the heaviest explanatory burden on the site — it must convert a portal-shaped expectation into a brokerage-shaped one in one screen.

## Journey 4 — Property owner (management)

**Who:** landlord with one or more units — tired of self-managing, or acquiring their first rental. Includes the **remote-owner variant** (owner abroad or in another region) who is functionally an OFW-journey user; `/services/property-management` and `/overseas` cross-link for this reason.
**Arrives via:** referral, Google, or the homepage's owner path.

Path: `/` → `/services/property-management` → `/contact` (intent: management). No browsing — this is a services-evaluation journey.

**What they need to see:** exactly what's covered (tenants, maintenance, collections, payouts, reporting), the fee model, and proof of professionalism. The remote-owner variant additionally needs: how oversight works from afar (reports, remittance of income, who holds keys) — that content lives on `/overseas` with the PM page linking to it.

**Drop-off risk:** vagueness about scope/fees — management is a recurring-trust purchase, higher commitment than one transaction.

## Journey 5 — OFW / overseas buyer

**Who:** Filipino abroad (Middle East, Singapore, HK, US, Canada, EU) buying for family, retirement, or investment. The confirmed differentiator audience — Dot Property serves them with a cluttered ad-heavy portal; nobody serves them with a clean brokerage.
**Arrives via:** Facebook ad/share targeted abroad, family referral ("kausapin mo ito"), Google from overseas. **Lands on `/overseas` directly** (it's the ad/referral destination), or reaches it from the homepage strip.

| Stage | Where | What they need | Drop-off risk |
|---|---|---|---|
| Arrive | `/overseas` | Immediate recognition: "buying from abroad, handled" — in the first screen | Generic homepage that ignores distance |
| Orient | `/overseas` | The remote process end-to-end: what happens without them present, **who can act for them (POA, explained simply)**, what documents from abroad | Process feels impossible/risky → paralysis |
| Evaluate | `/overseas` → `/properties` → `[slug]` | Same real inventory as everyone; extra weight on photos/videos since they can't visit; trust signals against distance-scam fear (licensed brokers, real company, real address) | Distance-scam suspicion — the #1 anxiety of this audience |
| Contact | `/contact` (timezone-aware) | Async-first contact (Messenger), preferred-time field that respects their timezone, no "call us 9–5 Manila" wall | A contact flow that assumes they're in Manila |
| Handoff | (broker responds) | Async continuation; scheduled calls at their hours; consistent single broker ("one point of contact" is literally the brand promise here) | Being bounced between agents across timezones |

**Two hard content rules:** POA and remote-purchase steps are explained as *process orientation*, with the broker conversation as the place for specifics — the website gives no legal or financial advice. And nothing about remittances/payments beyond "your broker walks you through it."

## Journey 6 — Business client

**Who:** SME or corporate rep needing commercial space, or an investor seeking advisory; researching during office hours, possibly comparing formal proposals.
**Arrives via:** referral, LinkedIn, Google.

Path: `/` → `/services/business-solutions` → `/contact` (intent: business). Evaluation is about **capability proof**: what asset types (office/retail/industrial), what engagement forms (site-finding, advisory, portfolio management), and professional signals (About, team, licenses). Tone matters most here — this journey is where the "established and secure, bank-like" brief is tested hardest.

**Drop-off risk:** the page reading as consumer-residential with a business paragraph bolted on.

---

## What the journeys demand of each surface (consolidated)

- **Homepage** routes all six journeys in one screen order: search (J1/J2/J5-evaluate) → audience paths (J3/J4/J6 + overseas strip to `/overseas`) → trust → one CTA. Every journey's Orient stage happens here or on its landing page — the brokerage-not-portal statement must be homepage-explicit, not implied.
- **Nav search, persistent** — J1/J2/J5 re-enter browse constantly from any page.
- **Property detail** is the property-seekers' conversion surface: agent block with a named licensed broker, form pre-filled with the property, Messenger parallel path.
- **Contact page** must capture: intent (buy/rent/sell/manage/business/overseas), property reference when arriving from a listing, preferred channel, and preferred time + timezone (J5's non-negotiable).
- **Messenger widget site-wide** — primary for J2, co-primary for J5, fallback everywhere.
- **Service pages** each carry one journey's Orient+Evaluate load — step-by-step "how it works" is mandatory on all four; Sales additionally preempts the portal expectation head-on.
- **About** is a shared Evaluate stop for J3/J4/J6 (and J5's scam-check) — real team, real licenses, or it undermines all four.
- **Mobile-first throughout** — J1/J2/J5 are mobile-dominant; the audit never validated mobile, so nothing desktop-proven is assumed to transfer.

## Open items for the business (needed before Handoff stages can be honest)

Not design questions — operating facts the site will promise on:

1. Response-time commitment after an inquiry (same-day? 24h?) — the Handoff stage of every journey depends on it.
2. Which channels are actually staffed: Messenger confirmed? Viber/WhatsApp? Phone hours?
3. Real inventory source and count at launch (J1/J2/J5 evaluate against it).
4. Broker/team roster with PRC license numbers for `/about` and listing agent blocks.
5. Whether tenants pay any fee (J2's `/services/lease` must state it or say "none").
