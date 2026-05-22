# Ship Responsibly — Design Improvement Plan

Retrospective design review of the shipped landing page (`public/index.html` + `styles.css` + `script.js`), run via `/plan-design-review` on 2026-05-14. The live site was treated as the "plan." This document is the v1.1 work list. **No files in `public/` were modified by this review.**

Overall design score: **7/10 → ~8.5/10** once the decided changes land.

---

## Decisions made (13)

### D2 — Hero CTA hierarchy → CTA under the headline
The live hero buries the primary CTA in a 220px side rail where it competes visually with the secondary "skip to playbook" link. **Fix:** move the single primary CTA ("Take the 2-min assessment") into the main column directly under the lede. Side rail keeps only the file-copy line, the black notice box, and the ghost playbook link.
**Mockup:** `mockups/hero-v2.html` (built with real design tokens — open beside `public/index.html` to compare).

### D6 — `<noscript>` fallback content for each JS section
Assessment, horror stories, and pledge are all JS-rendered; a script failure leaves blank sections under live headings. **Fix:** each JS-dependent section gets a `<noscript>` block with real static fallback content (static "gist" card for the assessment, the 6 stories as plain HTML, a static oath for the pledge).

### D7 — Contextual playbook CTA in the certificate, tuned by level
The assessment result — peak intent — offers only "Download" and "Retake." `script.js:436` even calls `attachPlaybookTracking(root)` on a cert that has no playbook link. **Fix:** add a primary playbook CTA to the cert result, copy tuned by level (L3/L4/L5 urgent: "You scored 72. The field manual that fixes this → $19"; L1/L2 softer). This also makes the existing tracking call functional.

### D8 — Recolor risk levels within the page's own palette
`script.js:124-163` uses an uncoordinated second palette — green/amber/orange/red and **`#7B1FA2` purple for L5** — none are page tokens; the purple contradicts the page's orange identity and its own no-AI-slop discipline, and it ships on every shared certificate. **Fix:** map the 5 levels onto the existing system (low-risk greens from the spectrum's own `#D6ECC4`-range → accent orange → stamp-red `#c8321e` for critical). Promote the level colors to named `:root` tokens.

### D9 — Rebuild assessment options as real radio inputs
The core interaction is built from clickable `<div class="opt">` elements — no keyboard nav, no `role`/`aria-checked`, no screen-reader semantics. **Fix:** replace with visually-hidden `<input type="radio">` + styled `<label>`, preserving the exact square-checkbox `.ck` aesthetic via CSS. Native keyboard/focus/SR support for free, zero visual change.

### D10 — Make the spectrum `.lvl` cards real links
`styles.css:112` gives the 5 spectrum cards `cursor:pointer` + lift-on-hover but no handler. **Fix:** each `.lvl` becomes `<a href="#assess">` — clicking your suspected level routes you into the self-cert to confirm it. Keyboard-accessible for free; reinforces the existing "Not sure where you land?" link.

### D11 — Darken failing tokens, never use raw orange for text
Contrast failures: `--muted #6a6558` on paper ≈ 4.0:1; `.foot-bar #666` on ink ≈ 3.0:1; accent orange as interactive text on paper ≈ 2.6:1. **Fix:** bump `--muted` to ~`#5a5648` (4.5:1), lighten `.foot-bar` to ~`#8a8a8a` on ink. Orange stays as background/underline accent only — interactive text uses `--ink`, or the darkened stamp-red `#c8321e` (~4.6:1) where a warm color is needed.

### D12 — Full `@media print` treatment
The entire aesthetic is "an official printed advisory" but there is no print stylesheet. **Fix:** hide ticker/animations, flatten dark sections to paper+ink, ensure masthead/seal/§-tags print crisply, page-break between sections. The site becomes the printable advisory it pretends to be.

### D13 — Dynamic OG image per assessment result
The cert/pledge render rich personalized PNGs, but shared results only ever unfurl the generic `og-image.png`. **Fix:** a serverless OG endpoint renders score/level into a share card; share URLs carry the encoded result (e.g. `/?r=L4-72`) so X/LinkedIn unfurl the personalized certificate. Adds backend scope (one serverless function).

### Deferred (carried to TODOs)
- **D3 — Story submission goes nowhere.** `script.js:320-324` fakes success; the user's story is silently discarded despite copy promising "we'll scrub anything identifying." **Review recommendation:** keep the *invitation*, kill the *open form* — replace with a mailto/social prompt (D3 option 3). Rationale: a solo project shipping a $19 playbook should not own an anonymous-UGC moderation pipeline or the defamation surface; the 6 curated stories already do the job. Build a real endpoint only if submissions ever become a flood worth systematizing.
- **D5 — Pledge count styled but never populated.** `styles.css:235` styles `.count strong` in accent orange for a number `script.js` never writes. A running count is the highest-leverage social-proof lever on the page. Deferred pending the broader backend decision.

---

## Obvious-fix plan items (no design alternatives — implement directly)

- Add `prefers-reduced-motion` guards: the 60s warning ticker, `.lvl` hover-scale, stamp transitions.
- Replace `catch {}` clipboard swallow (`script.js:434`) with a visible "copy failed" fallback.
- Swap `.lvl:hover` soft drop-shadow (`styles.css:113`, `0 18px 40px rgba(...)`) for a hard offset shadow consistent with `.form-panel`'s `8px 8px 0`.
- Remove redundant tokens: `--rule` (= `--ink`), `--accent-ink` (= `--ink`).
- Add landmarks: `<header>` for the masthead, `<main>` wrapping the content sections, `<nav>` if/when nav exists; `aria-labelledby` on each `<section>`.
- Add a global `:focus-visible` ring that is visible on both paper and dark (`.pledge`, footer) sections.
- Real `<label>` elements for the pledge-name input (`index.html:198`) and story-submit inputs (`script.js:317-318`) — kill the placeholder-as-label pattern.
- Bump `.cta.ghost` touch target from `padding:14px 4px` (~28px tall) to ≥44px.
- Drop `title="hover me"` on the stamp, or make the stamp flip tap-toggle on touch.
- Tablet spectrum (640–1000px): 5 cards in 2 columns leaves an orphaned 5th cell — adjust to a cleaner layout.

---

## NOT in scope (considered, deferred with rationale)

- **Dark mode** — the paper aesthetic is intentionally light-only; this is a deliberate brand decision, not a gap. Document it in DESIGN.md rather than building dark mode.
- **Returning-visitor state** (localStorage of "you pledged" / last score) — genuine nice-to-have, low traffic value; carried as a low-priority TODO, not v1.1.
- **Full backend** (story endpoint, pledge counter) — D3/D5 deferred; revisit as one "do we add a backend" decision. Note D13's dynamic-OG function is approved and stands on its own.
- **Redesign of the core aesthetic** — the Department-of-Shipping direction is strong (AI-slop pass 9/10); this review improves it, it does not replace it. The 6 `mockups/` directions remain archived, not revived.

---

## What already exists (reuse, don't reinvent)

- **Paper-grain texture** — `body::before` dual radial-gradient with `mix-blend-mode: multiply`.
- **Masthead + `§`-tag system** — works as persistent wayfinding; extend it, don't replace it.
- **`.cta` variant matrix** — primary / light / outline / ghost. The v1.1 work needs no new button styles.
- **`.form-panel`** — 3px border + `8px 8px 0` hard offset shadow; the canonical "official document" container.
- **The seal SVG** — hand-built, on-concept; reuse as-is.
- **Canvas cert/pledge renderers** (`script.js`) — the PNG generation logic is solid; D13 extends it server-side, D8 recolors its inputs.
- **Responsive scaffolding** — three breakpoints already cover most sections; D-items mostly refine, not rebuild.

---

## Current design system (catalog — no DESIGN.md exists yet)

Recommend running `/design-consultation` to formalize this into a `DESIGN.md`. Snapshot of what's actually in use:

**Color tokens** (`styles.css:1-11`)
| Token | Value | Use |
|---|---|---|
| `--paper` | `#f4f1ea` | primary background |
| `--paper-2` | `#ebe6db` | alt background (playbook section, hovers) |
| `--ink` | `#111111` | text, 2px rules |
| `--ink-2` | `#3a3a3a` | secondary text |
| `--muted` | `#6a6558` | tertiary text — **fails AA, see D11** |
| `--accent` | `#FF6A13` | safety orange — **not for text, see D11** |
| `--stamp` | `#c8321e` | red stamp (hero only today; D8 promotes it to the critical-level color) |
| `--rule`, `--accent-ink` | `#111111` | **redundant, remove** |

Off-system colors to fold in: spectrum swatches `#D6ECC4 / #F4E48A / #F5B86A / #E66A3A` and the JS level palette (D8 reconciles both into named tokens).

**Type:** Archivo (400–900) for body/UI, Archivo Black for display, JetBrains Mono for labels. Scale is `clamp()`-based but undocumented — many one-off sizes (9/10/11/15/16/17/22px). DESIGN.md should fix a named scale.

**Spacing:** no scale — ad-hoc px (14/16/24/32/40/64). Candidate for an 8px-based scale in DESIGN.md.

**Borders:** 2px black between sections, 1–1.5px internal. Mostly consistent; formalize the rule.

**Components:** `.cta` (5 variants), `.form-panel`, `.section-head`, `.lvl`, `.story`, `.notch`, masthead — none documented.

---

## Approved Mockups

| Screen/Section | Mockup Path | Direction | Notes |
|---|---|---|---|
| Hero | `mockups/hero-v2.html` | D2 — single primary CTA moved under the lede in the main column; side rail reduced to file-copy line + notice box + ghost playbook link | Built with real design tokens; renders correctly desktop + mobile breakpoints. Open beside `public/index.html` to compare. Render: `mockups/.hero-v2-render.png` |

---

## Pass-by-pass scores

| Pass | Before | After decided fixes |
|---|---|---|
| 1 — Information Architecture | 7/10 | ~9/10 (D2) |
| 2 — Interaction State Coverage | 4/10 | ~7/10 (D6 + obvious fixes; D3/D5 deferred cap it) |
| 3 — User Journey & Emotional Arc | 7/10 | ~9/10 (D7) |
| 4 — AI Slop Risk | 9/10 | 9/10 (1 trivial shadow nit) |
| 5 — Design System Alignment | 3/10 | ~8/10 (DESIGN.md + D8) |
| 6 — Responsive & Accessibility | 5/10 | ~8/10 (D9 + D10 + D11 + obvious fixes) |
| 7 — Unresolved Decisions | — | 2 resolved (D12, D13), 2 deferred (D3, D5), 2 low-pri notes |

---

## Recommended next steps

1. `/design-consultation` — formalize the cataloged system into `DESIGN.md` (Pass 5 is capped at ~8/10 until this exists).
2. `/plan-eng-review` — D9 (radio rebuild), D13 (serverless OG endpoint), and D6 (noscript) have architectural implications worth a pass before implementation.
3. Implement D2/D6/D7/D8/D10/D11/D12 + obvious-fix items as the v1.1 PR (mostly CSS/HTML/JS, no backend).
4. Decide the backend question (D3 + D5) separately.

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|---|---|---|---|---|---|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR (PLAN) | score: 7/10 → 9/10, 13 decisions, 2 deferred |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

- **UNRESOLVED:** 2 (D3 story-submission destination, D5 pledge count — both pending the broader backend-scope decision)
- **VERDICT:** Design Review CLEARED. Eng review required before implementation if `skip_eng_review` is not set globally.

