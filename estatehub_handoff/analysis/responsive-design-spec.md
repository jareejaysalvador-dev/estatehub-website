# EstateHub.ph — Responsive Design Spec (Phone / Tablet / Desktop)

*Fills the one gap the competitive research explicitly left: the 8-site design audit was desktop-only (~1280px), so nothing about mobile behavior is competitor-validated — it has to be specified and tested first-hand. Globally, over half of web traffic is mobile; Philippine traffic skews heavier still, and per `user-journeys.md` three of our six journeys (local buyer, renter, OFW/overseas) are explicitly mobile-dominant. Planning only; builds on the locked `ui-design-system.md` without amending it.*

## Device classes

| Class | Breakpoint | Design target | Reality check |
|---|---|---|---|
| Phone | < 768px | **360×800 first** (mid-range Android), then 390×844 | The PH market skews Android mid-range, not flagship iPhone — if it works at 360px on a mid-tier device over mobile data, it works everywhere |
| Tablet | 768–1023px | 768×1024 portrait | Lowest-traffic class; must be correct, not specially optimized |
| Desktop | ≥ 1024px | 1280–1440 | The only class the competitive audit actually validated |

Grid per class (already locked): 1 column / 4 columns / 12 columns. Container 1280px max, 24px side padding phone, up to 48px desktop.

**Design order is phone → desktop, not desktop → shrink.** Every layout is specified mobile-first; desktop is the enhancement.

---

## 1. Button sizes

| | Phone | Tablet | Desktop |
|---|---|---|---|
| Touch/click target | **44×44px minimum, no exceptions** | Same — tablets are touch devices | Pointer precision allows visually smaller, but keep 44px hit areas via padding |
| Primary CTA width | **Full-width** in forms and closing sections | Content-width, min 200px | Content-width (pill padding 16/32px) |
| Adjacent targets | ≥ 8px gap between tappable elements (prevents mis-taps) | Same | Standard spacing scale |
| Hover states | **Don't exist.** Nothing may communicate by hover alone | Same | Full hover/active/focus matrix from the design system |

The design system's button-state matrix stands; the phone-specific addition is that pressed/active states do the visual-feedback work hover does on desktop — the `:active` darken (Deep Emerald) must be instant and visible on touch.

## 2. Readability

| | Phone | Tablet | Desktop |
|---|---|---|---|
| Body | 16px — **never smaller**; also the input font floor (below 16px, iOS auto-zooms on field focus) | 16px | 16px |
| H1 (EB Garamond) | 32px | 36–40px | 44px |
| Measure (line length) | Self-limiting at 360px; watch landscape | **Most at-risk class** — single-column text at 768px+ exceeds 65ch unless prose containers are capped. Cap them | 65ch cap on all prose |
| Long content | Service-page FAQs and the Overseas process become **accordions** — a wall of text on a phone is a bounce | Accordions optional | Full layout |
| Text over photos | Scrim mandatory (hero, card overlays) — already in the design system; matters most at phone sizes where text sits closer to busy image areas | Same | Same |

## 3. Navigation

The hardest area, because the audit's single best-rated pattern — **persistent nav-embedded search** — is exactly what typical mobile headers destroy by burying everything in a hamburger. The spec commits to keeping it reachable in one tap at every size:

**Phone (< 768px):** sticky header, 56–64px tall, containing exactly four things:
1. **Logo mark** (the emerald monogram tile alone — full wordmark doesn't fit at 360px)
2. **"Contact us" pill** (compact) — stays in the header per `ux-recommendations.md`, never only inside the menu
3. **Search icon (44×44)** — one tap expands a full-width search field overlaying the header, focused, keyboard up. One tap from *any* page to searching: the pattern survives
4. **Hamburger (44×44)** — opens a full-height panel: Properties, Services (accordion, 4 items), Overseas Buyers, About — each row ≥ 48px tall; Messenger link at panel bottom

At 360px this fits: mark (~28px) + pill (~110px) + two 44px targets + gaps ≈ 290px of 312px available. Verified arithmetic, but confirm on a real device at design time.

**Tablet (768–1023px):** full wordmark returns; search becomes an always-visible inline field (~200px); nav links still collapse into the hamburger (four text links + search + CTA + wordmark exceed 768px). Same panel as phone.

**Desktop (≥ 1024px):** the full locked spec — Properties · Services ▾ · Overseas Buyers · About · search field · Contact us. Dropdown opens on **click as well as hover** (touch-screen laptops exist; hover-only dropdowns strand them).

**Breadcrumbs** (property detail, service pages): desktop/tablet show the full trail; phone shows a single **"← Properties"** back link instead — a truncated breadcrumb at 360px is noise.

**New pattern this doc introduces — sticky inquiry bar on phone property-detail pages:** since the property detail page is the conversion surface for the three mobile-dominant journeys, on phones it gets a **sticky bottom bar with "Inquire" + a Messenger button side by side** (each ≥ 44px tall, safe-area padded). The renter journey's whoever-replies-first dynamic makes always-visible contact on listings worth the screen space. Contradicts nothing locked; it's the mobile expression of "the agent block is the conversion."

## 4. Forms

| | Phone | Tablet | Desktop |
|---|---|---|---|
| Layout | Single column, always | Single column (locked: pairing is desktop-only) | Short pairs (first/last name) may sit 2-across; form container capped ~600px — full-container-width inputs read badly |
| Submit | Full-width, loading state mandatory | Full-width within form container | Content-width or full form-width |
| Keyboards | **Correct `type`/`inputmode` per field**: `email` → email keyboard, phone → `tel`, budget → `inputmode="numeric"`. Wrong-keyboard friction is a silent killer on the exact device class our conversions come from | Same | n/a |
| Autofill | `autocomplete` attributes on name/email/tel — one tap fills the form a renter would otherwise abandon | Same | Same |
| Selects | **Native selects/pickers** — the OS-native control beats any custom dropdown on touch | Native | Custom styling allowed if keyboard-accessible |
| Errors | Inline below field + summary at top on submit (locked pattern); error text never relies on color alone | Same | Same |

Contact-form content requirements (intent selector, property auto-reference, preferred channel, preferred time + timezone) are already locked in `user-journeys.md` / `ui-design-system.md` and apply identically at every size.

## 5. Images

| | Phone | Tablet | Desktop |
|---|---|---|---|
| Property cards | Full-width, 4:3, lazy-loaded below the viewport | 2-up grid | 3-up grid |
| Hero | **Art-directed crop, not a scaled-down desktop image** — if desktop is a wide split composition, phone gets a taller crop with the subject centered and scrim for text | Intermediate crop | Full composition |
| LCP image | Hero is **preloaded/priority — never lazy**; everything below the fold is lazy | Same | Same |
| Formats & sizes | `srcset` responsive sizes; AVIF/WebP with JPEG fallback; serve ~720–1080w to phones (360–430 CSS px × 2–3 dpr) — never the 1920w desktop asset | Mid sizes | Full sizes |
| Weight budgets | **Hero ≤ 200KB, card thumbnails ≤ 60KB** on the wire — concrete numbers, checked in CI/review, chosen for PH mobile-data reality | Same assets | Slightly relaxed but same pipeline |
| Detail gallery | Swipeable carousel with position counter ("3 / 12"), tap to full-screen | Carousel or 2-up | Thumbnail grid + lightbox |

Alt-text rules (real descriptions on property photos) are locked in `ux-recommendations.md` and size-independent.

---

## Testing checklist (how this spec gets verified, per the working agreement's build phase)

Per device class — phone testing on a **real mid-range Android over a throttled/real mobile connection**, not only a desktop browser simulator:

- [ ] Every interactive element ≥ 44×44px; no adjacent-target mis-taps (Button sizes)
- [ ] No text below 16px; no prose line over ~65ch; no iOS zoom-on-focus (Readability)
- [ ] Search reachable in one tap from every page at every size; "Contact us" visible without opening the menu; menu rows ≥ 48px (Navigation)
- [ ] Correct mobile keyboard appears per field; autofill works; native pickers on touch (Forms)
- [ ] Hero LCP < 2.5s on mid-tier mobile; no lazy-loaded LCP; budgets met; phone receives phone-sized assets, verified in network panel (Images)
- [ ] Sticky inquiry bar present on phone property-detail pages, doesn't overlap content or the Messenger bubble
- [ ] Everything above re-checked at 360px, 390px, 768px, 1024px, 1280px — plus one landscape-phone pass

## What this doc adds vs. what was already locked

**Already locked, unchanged:** breakpoints, grids, type scale, 44px targets, single-column mobile forms, image pipeline principle, LCP < 2.5s, alt text, accordion-vs-wall guidance direction.

**Newly specified here:** the exact phone/tablet header compositions (mark + pill + expanding search + hamburger), click-as-well-as-hover dropdowns, phone back-link replacing breadcrumbs, sticky phone inquiry bar on property detail, per-field mobile keyboard/autofill requirements, native-picker rule, art-directed hero crops, concrete image weight budgets (200KB/60KB), 360px-first design target, and the per-class testing checklist.
