# EstateHub.ph — Security Spec

*Part of the planning series. Unlike the UI/UX docs, several security controls here depend on architecture choices not yet made (hosting platform, where listing data lives, where inquiries land). This spec separates **binding-now rules** from **architecture-pending items**, and makes one flagged posture recommendation. Planning only.*

**Why security is a brand issue here, not just an IT issue:** EstateHub's entire positioning is "Trusted. Secure. Committed." — a brokerage whose emails and forms discuss ₱-multi-million transactions with PII from six audiences, including overseas buyers whose #1 anxiety (per `user-journeys.md`) is distance scams. A spoofed @estatehub.ph email or a defaced site doesn't just cost uptime; it attacks the exact promise the brand makes.

## ⚠️ Posture recommendation (flagged for confirmation, like the porcelain decision)

**Static-first, zero-admin-surface launch architecture.** Prerendered pages; listings as version-controlled content or a hosted headless CMS; exactly **one** dynamic endpoint (the inquiry form submission, serverless); no database, no user login, no admin panel on the public site. The attack surface collapses to roughly "one endpoint plus the operational accounts."

This aligns with everything already decided — accounts/saved-listings were deferred at the sitemap stage, inventory is small and broker-managed, and the site's job is lead-gen, not transactions. For a small brokerage with no security team, **the strongest control is not having the vulnerable thing at all.** Everything below assumes this posture unless overridden.

---

## 1. HTTPS

- **Platform-managed TLS** — host on a platform that auto-provisions and auto-renews certificates (Vercel/Netlify/Cloudflare Pages class). Zero-maintenance beats hand-managed certs for a team this size; certificate expiry outages are a self-inflicted classic.
- **All HTTP → HTTPS redirected at the platform level**, plus one canonical host chosen (www vs apex) with the other 301-redirecting — security and SEO in one decision.
- **HSTS** enabled after launch stabilizes — start with a short max-age (a week), raise once confident; consider preload only when the domain setup is final.
- **Zero mixed content**: every asset, embed, and script over HTTPS — fonts are self-hosted anyway (`next/font` pattern), Messenger SDK and any map embed load from their official HTTPS origins only.
- **Security headers ship with HTTPS** (same config surface): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, frame-ancestors restricted via CSP. A real Content-Security-Policy is written at build time — it must explicitly accommodate the Messenger widget's script/frame origins, which is exactly why it can't be fully specified before the architecture phase.
- **Domain layer — GoDaddy (confirmed registrar)**: the GoDaddy account is part of the admin-auth scope below. Enable GoDaddy's 2FA (authenticator app, not SMS) and the domain/transfer lock immediately on purchase. Check DNSSEC availability for `.ph` in the GoDaddy DNS console before relying on it — `.ph` registry support for DNSSEC has historically been limited, so verify rather than assume. DNS can stay on GoDaddy's nameservers or be delegated to the hosting platform/CDN at build time — either way, the GoDaddy account remains the root of control over the domain.

## 2. Strong authentication for admins

**Reality check: the sitemap has no site admin panel** — at launch, "admins" means the operational accounts that control the site from outside:

| Account | Why it's critical |
|---|---|
| Domain registrar + DNS (GoDaddy — confirmed) | Owns the domain — total takeover if lost. 2FA + transfer lock on day one |
| Hosting platform | Deploys and serves everything |
| Git host (private repo) | Source of truth for code and content |
| Meta Business Suite | The Messenger widget + FB page — a co-primary contact channel |
| Inquiry inbox / CRM | **Where all the PII lands** — as critical as hosting |
| Analytics | Lower stakes, still access-controlled |

Binding rules, all accounts:
- **MFA mandatory everywhere** — authenticator app or passkey preferred over SMS (SIM-swap risk); recovery codes stored offline, not in the same inbox they'd need to recover.
- **Unique passwords in a password manager** — no reuse, no shared spreadsheet of logins.
- **No shared accounts** — each team member gets their own login at the least privilege their role needs; a departure triggers an access-removal checklist, not a password change everyone shares.
- If a CMS is chosen later for listings: MFA on, public registration off, login attempts limited, admin URL unlinked from the site. Prefer a hosted CMS with SSO/passkey support.

## 3. Regular backups

- **Step zero, before anything else: version control.** This project is currently **not a git repository** — the first build-phase action is `git init` + a private remote (GitHub). Code, content, and these planning docs then inherit provider redundancy plus full history. Until then, the only copies of five months of decisions are one Windows folder and its zip.
- **Listing data + photos**: wherever they live (repo, CMS, or bucket), define the trio — *what* is backed up, *how often* (automated daily for anything dynamic; git content is continuous by nature), *where* (a second location, not a folder beside the original).
- **Restore test before launch, then periodically.** A backup that's never been restored is a hope, not a backup — one dry run proving "we can rebuild the site and its data from backups alone."
- **Inquiries/PII**: wherever submissions persist (inbox, CRM, sheet — an open intake question), that store needs backup *and* a retention limit aligned with the privacy policy — under the Data Privacy Act, hoarding PII indefinitely is itself a liability, so backups of it must expire too.

## 4. Software updates

- **Automated dependency alerts from day one**: Dependabot/Renovate on the repo; routine monthly update pass, immediate pass for critical advisories.
- **Triage over reflex**: distinguish build-time-only tooling advisories from runtime exposure (the archived first build's `npm audit` flags were largely dev-tooling — real, but not equivalent to a runtime hole). Never blind `npm audit fix --force` — it can jump majors and break the build for a dev-only issue.
- **Stay on a supported framework major** — plan the Next.js (or whatever is re-confirmed) upgrade path rather than pinning to end-of-life versions.
- **Prefer platform-managed runtime** (serverless) — the host patches OS/runtime, removing a whole maintenance surface. Fits the static-first posture.
- **If a CMS enters later: hosted/SaaS over self-hosted.** Self-hosted CMS maintenance (the WordPress-class patch treadmill) is a permanent tax a small brokerage shouldn't take on — worth naming explicitly because "real estate site on self-hosted WordPress" is the industry default trap.
- Third-party scripts (Messenger SDK) load from the official CDN — auto-updated; review the third-party list annually and remove anything unused.

## 5. Spam protection

Target: the contact form — the single conversion surface. The UX docs spent five documents reducing friction there, so spam controls are **tiered, invisible-first**, and a visible challenge is the last resort, not the default:

1. **Honeypot field + minimum-time-to-submit check** — invisible, zero friction, kills most low-effort bots.
2. **Server-side rate limiting** on the submit endpoint (per IP and per session).
3. **Format validation** (email/phone) — doubles as data quality.
4. **Only if spam persists in practice:** Cloudflare Turnstile (invisible-first, free) — added in response to data, not preemptively. A visible CAPTCHA on the sole conversion surface taxes exactly what the site exists to produce.

Two adjacent notes:
- **The Messenger path is spam-resistant by design** (requires a Facebook account) — a quiet extra benefit of it being co-primary.
- **SPF + DKIM + DMARC on estatehub.ph is mandatory**, both directions: broker replies must land in inboxes (deliverability — a reply that lands in spam kills the renter journey's speed-wins dynamic), and nobody should be able to spoof @estatehub.ph to a client mid-transaction (anti-phishing — for a brokerage, email spoofing is the highest-damage cheap attack there is).

## 6. Input validation

- **Principle: client-side validation is UX; server-side validation is security.** Every field re-validated on the server no matter what the front end enforced.
- **Contact form**: enums validated against allowlists (intent, preferred channel); length caps on all free text; email/phone format checks; unexpected fields rejected; output always encoded (no raw-HTML rendering of user input anywhere — React's default escaping stands, `dangerouslySetInnerHTML` with user content is banned).
- **Header-injection guard**: the inquiry payload gets forwarded (email/CRM) — strip newlines/control characters from name and email fields before they touch any email header construction; this is the classic contact-form exploit.
- **Search/filter params** on `/properties`: validated against allowlists (property type, budget ranges, location tokens), capped and normalized — even with static data, unvalidated params are a weird-state and abuse surface.
- **No file uploads anywhere at launch** — none are in the sitemap, and keeping it that way deliberately avoids an entire attack class. If listing-photo upload tooling is ever needed, it lives in the CMS (their problem), not the public site.
- **Errors never leak internals** — stack traces and framework errors off in production responses.

## Cross-cutting: PII and the Data Privacy Act

- **Collect the minimum**: the form asks only what the journeys require (already the design); no birthdays, no IDs, no financial details through the website, ever — that belongs in the broker relationship, stated plainly on the form.
- Privacy policy states purpose, retention period, and contact for data concerns (`/privacy` is already in the sitemap for exactly this).
- PII access limited to the brokers who need it (least privilege on the inbox/CRM); transported only over TLS.
- **Incident basics**: keep a one-page runbook — how to rotate each credential fast, registrar/host support contacts, and awareness that a personal-data breach can trigger DPA notification duties (NPC + affected individuals, 72-hour window) — specifics with counsel if it ever happens, but the runbook exists *before* it's needed.

## Verification checklist (joins the responsive + accessibility checklists as the build-phase gate)

- [ ] SSL Labs grade A; http→https and www/apex canonicalization verified
- [ ] Security headers present and sane (securityheaders.com pass; CSP accommodates Messenger without wildcarding everything)
- [ ] MFA verified account-by-account: registrar, DNS, host, git, Meta Business, inquiry inbox
- [ ] Git repo private, secrets only in platform env vars, `.env*` gitignored, no secrets in history
- [ ] One full restore test performed before launch
- [ ] Dependabot enabled; current `npm audit` triaged with notes
- [ ] Form server-side validation tested: bad enums, oversized text, and header-injection strings all rejected; honeypot and rate limit verified working
- [ ] SPF, DKIM, DMARC records verified with a checker
- [ ] Error pages leak nothing in production

## What's new vs. already locked

**Already locked elsewhere, restated:** privacy/terms pages in sitemap; minimum-collection form design; Messenger as co-primary channel; no user accounts at launch.

**New in this doc, flagged:** the static-first zero-admin-surface posture (the one item needing your confirmation); SPF/DKIM/DMARC as mandatory; git-as-step-zero-of-backups; the tiered no-visible-CAPTCHA spam ladder; the operational-accounts MFA table; the incident runbook.

**Confirmed by the user mid-planning:** the domain comes from **GoDaddy** — reflected in the HTTPS domain-layer rules and the MFA account table above.

**Pending architecture decisions (can't be fully specified yet):** exact CSP, hosting platform, listing data store, inquiry destination — all resolve in the build-phase architecture step, against the rules above.
