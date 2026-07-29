# EstateHub.ph — Project Context

This file is a handoff from a Claude (Cowork) research/design session so a
Claude Code session in this folder has full context without re-explaining
everything. Read this before making changes.

## What EstateHub.ph is

A premium, trust-first Philippine real estate website. Positioning line from
the founder's own homepage mockup: *"Building generational wealth, one move
at a time."* Services: Lease, Property Management, Sales, Business Solutions.
Tone: established and secure (bank-like), not playful (startup-like).

## What's been done so far (in order)

### 1. Competitive research — `research/PH_Real_Estate_Competitive_Landscape.xlsx`
Landscape of 8 major PH real estate portals: Lamudi Philippines, Dot Property
Philippines, OnePropertee, Homes & Land Philippines, Hoppler, MyProperty.ph,
RentPad, Real.ph. Compares ownership, target audience, features, pricing
model, relative traffic, strengths/weaknesses. Key finding: MyProperty.ph is
a re-skin of Lamudi (same parent company, EMPG).

### 2. Design/UX audit — `design-audit/PH_Real_Estate_Design_Audit.docx`
Live visual audit (screenshots + analysis) of the same 8 sites, scored on
layout, navigation, CTA placement, colors, typography, features, strengths,
weaknesses. **Cross-site findings that should inform this build:**

- Put a real search widget directly in the hero, above the fold, on every
  device (Homes & Land's biggest miss — no visible search bar at all).
- Pick ONE brand accent color, reserve it exclusively for the primary
  action. Don't let secondary buttons share the primary's color.
- Cap the primary nav at 5–6 visible items; use dropdowns for the rest.
- One primary CTA + at most one secondary CTA in the header. Move tertiary
  actions (pricing, register, etc.) into an account menu.
- Use authentic local photography over generic stock interiors — a real
  differentiator, most competitors skip it.
- A persistent, nav-embedded search box (RentPad's pattern) beats search
  confined only to the hero.
- Add a Messenger/WhatsApp-style chat widget, not a generic chat bubble —
  matches how Filipino users contact businesses.
- Keep any ad/affiliate placements below the fold — an above-the-fold ad
  banner (DotProperty) visibly hurts trust.
- Avoid the default blue/orange/green real-estate palette if brand recall
  matters — most competitors cluster around the same few hues.

### 3. Logo — `logo-kit/`
Four initial directions were explored (`logo-kit/estatehub_logo_plan.html`):
A) Hub Frame monogram, B) Golden Tower skyline icon, C) pure wordmark,
D) shield crest. **Concept A (Hub Frame monogram) was selected.**

A color study then compared gold (matching the original mockup) vs. emerald
green (`logo-kit/estatehub_concept_a_emerald.html`). **Emerald was selected**
— specifically the "primary lockups" treatment: a midnight-navy rounded
tile with an emerald-green ("EH" fused monogram) mark inside, paired with
the ESTATEHUB.PH wordmark.

**Final logo assets are in `logo-kit/`:**
- `svg/icon-primary.svg` — master icon (navy tile + emerald mark). Use this
  as the app icon / favicon source / avatar everywhere a self-contained
  square icon is needed.
- `svg/icon-mark-emerald-transparent.svg` / `svg/icon-mark-navy-transparent.svg`
  — linework only, no tile, for placing directly on dark or light surfaces.
- `png/icon-{16,32,48,64,128,180,192,256,512}.png` — pre-rendered sizes.
- `favicon/favicon.ico` — multi-res favicon, ready to drop into `public/`.
- `lockups/lockup-dark-transparent.png` — icon + wordmark, white text,
  transparent background, for use on dark/photo backgrounds (e.g. the
  homepage hero).
- `lockups/lockup-light-transparent.png` — icon + wordmark, navy text,
  transparent background, for light backgrounds.
- `lockups/lockup-dark-card.png` / `lockup-light-card.png` — same lockups
  pre-composited on solid navy / porcelain cards.
- `lockups/header-stamp.png` — compact, tighter-tracked version already
  sized for a website header (this is what's used in the preview mockup).
- `preview/homepage-with-new-logo.png` — the new logo composited into the
  founder's original homepage mockup header, for reference.
- `README.md` (inside `logo-kit/`) — full usage rules (clear space, no
  gradients/shadows, don't recolor, etc.) and font specs (Montserrat +
  Inter, both free via Google Fonts).

**Colors:**
| Token | Hex | Use |
|---|---|---|
| Midnight Navy | `#0E1A2C` | primary background / logo tile |
| Deep Ink | `#091120` | darker backgrounds |
| Emerald | `#22B573` | **new primary accent — logo mark, .PH, should become the site's CTA/accent color** |
| Deep Emerald | `#178A57` | emerald fills / hover states |
| Mint | `#8FDCBD` | emerald tint / on-dark secondary text |
| Estate Gold | `#E3A94D` | **legacy accent from the original mockup — see open decision below** |
| Champagne | `#F2CE8C` | gold tint |
| Porcelain | `#F5F2EB` | light backgrounds |

**Fonts:** Montserrat (headings/wordmark — ESTATE in Light 300, HUB in Bold
700, .PH in SemiBold 600 emerald) + Inter (body/UI). Both free on Google
Fonts.

## ⚠️ Open decision — resolve before building the full site

The original homepage mockup (`mockup/original-homepage-mockup.png`) uses
**gold** throughout (headline accent word, divider line, arrow icons, CTA
buttons). The new logo is **emerald**. These were never reconciled — the
`preview/homepage-with-new-logo.png` composite deliberately shows this
mismatch (swapped logo only, nothing else changed) as a flag, not a
recommendation.

Pick one before implementing the real site:
1. **Full emerald** — carry emerald through as the site's primary accent
   (CTAs, dividers, .PH, hover states); drop gold entirely.
2. **Split** — keep gold as the site's UI accent color; treat emerald as a
   distinct "brand mark" color used only in the logo itself.

If no decision has been made yet, ask the user before touching the CTA/
accent colors in code.

## Suggested next steps

1. Resolve the gold-vs-emerald accent decision above.
2. Scaffold the actual site (framework not yet chosen — ask if unclear).
3. Build the homepage hero with a real, functional search bar above the
   fold (see audit finding — this was the #1 gap found in competitors).
4. Wire up `favicon/favicon.ico` and `png/icon-192.png` / `icon-512.png` /
   `icon-180.png` (apple-touch-icon) in the site's `<head>`.
5. Re-check the design audit's do/don't list before finalizing nav and CTA
   layout.
