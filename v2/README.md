# Handoff: Ship Responsibly — Playful Landing Page

## Overview

A landing page for **Ship Responsibly** — a ~90-page pre-flight manual ($19, PDF + ePub) that helps people deploy AI-assisted software without shipping bugs to production. The page positions the manual for two distinct audiences simultaneously: first-time builders who shipped their first vibe-coded app, and senior engineers reviewing their AI agent's hundredth pull request today.

The aesthetic is playful and editorial — large bold sans-serif headlines, generous whitespace, pastel color blocks, and a decorative typographic moment in the hero. Inspired by indie-publishing landing pages (e.g. gumroad-style product pages) rather than enterprise SaaS.

## About the Design Files

The file in this bundle (`playful-landing.html`) is a **design reference created in HTML** — a prototype showing intended look, copy, and behavior, not production code to copy directly.

The task is to **recreate this design in the target codebase's existing environment** (React, Vue, Astro, Next.js, etc.) using its established patterns and component libraries. If no environment exists yet, choose the most appropriate framework for the project (a static site generator such as Astro or Next.js with static export is well-suited — there is no per-user dynamic content) and implement the design there.

The HTML uses inline `<style>` and inline `<script>` for portability — production should split these into the codebase's normal component / styling system.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, and interactions. Recreate pixel-perfectly using the codebase's existing libraries and patterns.

## Page Structure

The page is a single long-scroll layout with **six sections in order**:

1. **Nav** — fixed-height top bar (not sticky in this prototype)
2. **Hero** — headline + decorative SHIP wordmark with paper-plane mascot
3. **Audience** — "Who's flying today" with two side-by-side audience cards on a lavender section background
4. **How it works** — "Three steps" with three full-width rows of step illustrations
5. **Buy** — "Get the manual" with price, CTAs, and the book cover graphic
6. **Footer** — brand block + inspiration credits + bottom row

All sections share a `.wrap` container: `max-width: 1320px`, horizontal padding `56px` (`32px` at ≤1100px viewport, `22px` at ≤720px).

## Design Tokens

### Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `--bg` | `#ffffff` | Page background |
| `--bg-soft` | `#f6f5f1` | Off-white panel (buy section bg, nav glyph) |
| `--ink` | `#0d0e10` | Primary text, primary CTA bg |
| `--ink-soft` | `#25272c` | Secondary text |
| `--ink-mid` | `#5a5d65` | Body / muted text |
| `--ink-dim` | `#98999f` | Tertiary text, dashed rules |
| `--rule` | `#e6e5e1` | Hairline borders, dividers |
| `--lavender` | `#d6c4f0` | Audience card 1 accent, book cover bg, hero letter block |
| `--lavender-bg` | `#e7daf6` | Full-bleed lavender section background |
| `--mint` | `#b8e6c8` | Audience card 2 accent, step 1 bg, deco bar |
| `--pink` | `#ffb6d6` | Hero letter block, step 2 bg, deco bar |
| `--pink-hot` | `#ff4d97` | Primary accent — em text, CTAs on hover, period dots, badge bg |
| `--sky` | `#b6d4ee` | Hero letter block, step 3 bg, deco bar |
| `--yellow` | `#f5e69a` | Hero letter block |

### Typography

Two font families. No italics anywhere (browser default `<em>` italic is explicitly overridden to `font-style: normal`).

- **Display & body:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  - Loaded weights: 300, 400, 500, 600, 700, 800
- **Mono:** `'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace`
  - Loaded weights: 400, 500, 600

### Type scale

| Element | Size (clamp) | Weight | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- |
| `h1` (hero) | `clamp(48px, 7.4vw, 124px)` | 800 | 0.92 | -0.032em |
| `h2` (section) | `clamp(36px, 5.4vw, 80px)` | 800 | 0.92 | -0.032em |
| `h3` (card title) | `clamp(20px, 1.8vw, 26px)` | 700 | 1.2 | -0.018em |
| `.lede` (body intro) | `clamp(16px, 1.2vw, 19px)` | 400 | 1.55 | — |
| `.pill` | 13px | 500 | — | — |
| body `p` | 14–16px | 400 | 1.55 | — |

`h1`, `h2`, and `h3` are uppercase via `text-transform: uppercase`.

### Spacing & radius

- Section vertical padding: `110px` (desktop), `64px` (mobile)
- Card padding: `26px 28px 28px` (audience), `22–34px` (others)
- Border radius: `999px` (pills/buttons), `18px` (audience cards), `14px` (feature/icon tiles), `12px` (step illustrations, book cover), `10px` (verdict cards), `4–7px` (small elements)
- Common drop shadows are 6–12px solid (no blur) in `rgba(13, 14, 16, 0.x)` — see book cover and verdict cards for examples

## Section Details

### 1. Nav

- Container: `.wrap`, padding `22px 0`, no border
- Layout: flex row, `justify-content: space-between`, `gap: 24px`
- **Brand (left):** flex row, 10px gap
  - Glyph: 28×28px, `border-radius: 7px`, ink bg, white `✈` at 14px
  - Wordmark: "Ship Responsibly", 18px, weight 700, letter-spacing -0.012em
- **Nav links (center):** flex row, 32px gap, 14px ink-soft text, weight 500
  - Links: "For builders" (`#built`), "How it works" (`#how`), "Manual" (`#buy`)
  - Hover: text color → `--ink`
- **CTA (right):** pill button, `11px 18px`, ink bg, white text, 13px weight 600
  - Label: "Get the manual ↗"
  - Hover: bg → `--pink-hot`

### 2. Hero

- Container padding: `32px 0 56px`
- **Hero-top row** (flex `space-between`):
  - Left pill: white-bg `.pill` with `✈︎` glyph and label "Pre-Flight Manual · v.0.4"
  - Right tag: "Scroll down ↓" — 13px, `--ink-mid`, weight 500

- **Headline (`h1`):**
  - Text: "Anyone can ship now.<br/>Few do it <em>responsibly</em>."
  - The `<em>` is the only color/weight contrast — `color: var(--pink-hot)`, weight 800, no italic
  - Max-width: 16ch, uppercase
  - Margin top: 28px

- **Wordmark (`.wordmark`):**
  - Below headline, `margin-top: 64px`, `padding: 32px 0 12px`, bottom border 1.5px ink
  - Flex row, `align-items: flex-end`, `gap: clamp(8px, 1.4vw, 24px)`
  - 4 outlined letters: **S H I P**
    - Font: `clamp(120px, 24vw, 380px)`, weight 800, letter-spacing -0.04em, line-height 0.78
    - Each `.char` is rendered as `color: transparent` with `-webkit-text-stroke: 1.5px var(--ink)` — outline only
    - Each letter has an absolutely-positioned `.block` behind it (z-index 1, letter is z-index 2)
    - Block colors: S=lavender, H=pink, I=sky, P=yellow
    - Block positioning per letter (varies — see source):
      - `.l-s .block { top: 24%; bottom: 4%; left: 14%; right: 14%; }` (default)
      - `.l-h .block { top: 12%; }`
      - `.l-i .block { left: 8%; right: 8%; top: 22%; }`
      - `.l-p .block { top: 18%; }`
  - **Mascot:** inline SVG paper plane, `margin-left: auto`, `width: clamp(120px, 14vw, 220px)`, `transform: translateY(-12px) rotate(-8deg)`
    - White body with lavender inner triangle, 3px ink stroke, two speed lines
    - SVG markup in source

### 3. Audience ("Who's flying today")

- Full-bleed section: `background: var(--lavender-bg)`, padding `96px 0`
- **Header (`.head`, 2-col grid 1fr 1fr, 64px gap, align end):**
  - Left: pill ("Who's flying today" with ✦ glyph) + `h2` "The cockpit got <em style="color: var(--pink-hot); font-weight: 800;">much</em> more crowded."
  - Right: lede paragraph
- **Audience grid (2 cols, 20px gap, stretch):**
  - 2 cards, both `.aud` — white bg, `border-radius: 18px`, padding `26px 28px 28px`, 1px translucent ink border
  - **Card structure:**
    - `.aud-top`: flex space-between — tag pill on left, "01 / 02" pager on right (10.5px mono, ink-dim)
    - `.aud-ill`: 64×64px colored tile (lavender for card 1, mint for card 2), `border-radius: 12px`, holds a 40×40px line-art SVG
    - `.quote`: large quoted statement, `clamp(20px, 1.8vw, 26px)`, weight 700, max-width 22ch
      - One word/phrase is highlighted with a `.hl` span — a half-height background fill matching the card's accent color
    - `.desc-p`: 14px ink-mid body, max-width 42ch
    - `.aud-foot`: dashed top border, flex space-between — left meta (e.g., "Risk · high"), right "needs" tag in ink/weight 600
  - **Card 1 (lavender):**
    - Tag: "First-time builder"
    - Illustration: coffee cup with steam (5 SVG paths)
    - Quote: "I learned to code in the time my coffee got <hl>cold.</hl>"
    - Desc: "An AI built most of it. You're not totally sure what every file does — and definitely not what happens when a stranger types something rude into the form."
    - Foot: "Risk · high" | "Wants → a checklist for their phone"
  - **Card 2 (mint):**
    - Tag: "Career engineer"
    - Illustration: stack of 3 paper sheets with a checkmark
    - Quote: "My agent just opened its <hl>100th PR</hl> today."
    - Desc: "You used to read every line. The volume's too high now, the model's too confident, and you're still the last human signature on the deploy."
    - Foot: "Volume · high" | "Wants → the catch the agent missed"
- **Summary line (`.aud-summary`):** below cards, 36px top margin, flex centered, 28px gap
  - Three mono uppercase phrases joined by hot-pink bullets: "Same checklist · Same five minutes · Same weekend on the line"

### 4. How it works ("Three steps")

- Container padding: `110px 0 100px`
- **Header (2-col grid, end-aligned):**
  - Left: pill ("Three steps" with ↻) + `h2` "How Ship Responsibly works."
  - Right: lede "Three steps before every deploy. Five minutes total. Zero <em style="color: var(--pink-hot); font-weight: 700;">oh-no</em> mornings."
- **Three step rows** (`.step`, 3-col grid `0.7fr 360px 1fr`, 48px gap, top border):
  - Numeric label (`.num`): "01." / "02." / "03." in weight 500 sans, `clamp(48px, 5vw, 78px)`, letter-spacing -0.04em
  - Illustration (`.ill`): 200px tall, `border-radius: 12px`, colored bg, contains a mock product card
  - Copy (`.copy`):
    - `h3`: uppercase, weight 700
    - `p`: 14–15px ink-mid, max-width 44ch
    - `.arrow`: mono small-caps tag at bottom (e.g., "5 minutes →")

- **Step 1 — Pick your level (mint bg):**
  - Illustration: `.ill-card` (white card with drop shadow) inside the mint block
    - Header: "SEVERITY — STEP 1 OF 3" (left, ink/600) + "WHAT'S AT STAKE?" (right, mid)
    - `.ill-severity`: 5 rows, each with a 11px circle dot + label
    - Levels: Just you / Your team / **Other people's data** (active) / Other people's money / Other people's safety
    - Active row: ink bg, white text, mint-filled dot, mint checkmark on the right; row has 5px radius and -8px horizontal margin
  - Copy: "Pick your level" — body explains matching deploy to one of five severity tiers
  - Arrow tag: "30 seconds →"

- **Step 2 — Run the check (pink bg):**
  - Illustration: `.ill-card` with `.ill-checklist`
    - Header: "PRE-FLIGHT — STEP 2 OF 3" + "5 QUESTIONS"
    - 5 checklist rows, each with a 14×14px ink-bordered box + label
    - First 3 rows have `.done` class — ink-filled box with pink checkmark (clip-path), text strikethrough, ink-mid color
    - Progress line at bottom (dashed top border): "PROGRESS" | "**3 / 5** CLEARED"
  - Copy: "Run the check" — walk through the 5 questions for your tier
  - Arrow tag: "5 minutes →"

- **Step 3 — Cleared — or hold (sky bg):**
  - Illustration: `.ill-verdict` — two stacked `.vcard` rows (10px gap, 14px 18px padding each)
    - **Pass card:** ink bg, white text, mint-bg ink-text "✓" icon (32×32 circle), label "CLEARED" + right-aligned sub "SHIP IT"
    - **Hold card:** white bg, ink text, pink-bg ink-text "!" icon, label "HOLD" + sub "FIX 2 ITEMS"
    - Both have a 1.5px ink border and a 4px solid bottom shadow
  - Copy: "Cleared — or hold" — explains the binary outcome
  - Arrow tag: "Ship or stop →"

### 5. Buy ("Get the manual")

- Full-bleed section: `background: var(--bg-soft)`, padding `110px 0`, top + bottom 1px rule borders
- **2-col grid 1.2fr 0.8fr, 96px gap, center-aligned:**

- **Left column:**
  - Pill: "📕 The manual · ~90 pages"
  - `h2`: "Read it in an<br/>afternoon. Ship better<br/><em>by tomorrow.</em>" (em is hot pink 800)
  - Lede: "The five-level severity model. The 47-item Graduation Checklist. Thirty responsible prompt templates. Seven postmortems from real, recent incidents. Printable appendices for the wall above your desk."
  - Price row (flex baseline, 22px gap):
    - `.price`: "$19" — $ is `--ink-mid` weight 500, "19" is ink weight 800
    - Size: `clamp(64px, 7vw, 96px)`, weight 800, letter-spacing -0.04em
    - `.price-sub`: 2-line mono — "One-time" / "**30-day refund**"
  - CTAs (flex, 12px gap):
    - Primary: "Buy the manual ↗" — pill, ink bg, white text; hover bg → `--pink-hot`
    - Ghost: "Free sample chapter" — pill, transparent bg, ink border; hover ink bg / white text
  - Fine print: 3 mono uppercase items joined by " · " — "PDF + ePub · Ungated updates · Personal license"

- **Right column — Book cover (`.book`):**
  - Container: 5/7 aspect ratio, `--lavender` bg, `border-radius: 12px`, padding `34px 32px 28px`
  - Flex column, 18px gap, overflow hidden
  - 2-layer shadow for floating effect: `12px 12px 0 -1px var(--bg-soft), 12px 12px 0 0 var(--ink)`
  - **$19 badge** (top-right): hot-pink pill, 7px 12px, mono 10.5px weight 600, z-index 3
  - **Top strip (`.b-top`):** flex space-between, mono 10.5px uppercase
    - Left: "Manual" (weight 600)
    - Right: "v.0.4 · 2026" (ink-soft, opacity 0.75)
  - **Brand mark (`.b-mark`):** 58×58px circle-and-paper-plane SVG
    - White circle, 2.5px ink stroke
    - Hot-pink paper plane inside, 2.2px ink stroke
  - **Title (`h3.b-title`):** "Ship<br/>Responsibly<span class="dot">.</span>"
    - `clamp(44px, 5.6vw, 60px)`, weight 800, letter-spacing -0.04em, line-height 0.88, uppercase
    - The period dot is hot pink
  - **Hairline (`.b-rule`):** 44px wide, 3px tall, ink
  - **Subtitle (`.b-sub`):** "A pre-flight manual for the vibecoding era." — 16px ink-soft, max-width 22ch
  - **Decorative book-spine graphic (`.deco`):** flex row, centered, `margin-top: auto`, padding `16px 0 8px`, 6px gap between 7 vertical bars
    - Each bar 14px wide, varying heights (50–86px), border-radius 2px
    - Colors: ink, mint, ink, pink, ink, sky, ink (alternating ink with the 3 pastels)
  - **Footer (`.b-foot`):** flex wrap, 8px gap, 1.5px dashed top border (30% ink), padding-top 18px
    - "10 chapters · 47-pt checklist · ~90 pp" with `●` bullet separators (40% ink) and `~90 pp` in ink-mid weight 500

### 6. Footer

- Container: white bg, padding `56px 0 32px`
- **Grid (1.2fr 1.6fr, 80px gap, start-aligned):**
  - Left brand block:
    - Brand wordmark with glyph (same as nav, 32×32px, 22px text)
    - Tagline: mono "PRE-FLIGHT · VIBECODING ERA", 11px ink-mid
  - Right block:
    - `h4`: mono "INSPIRED BY"
    - Paragraph crediting Peter Steinberger (Lex Fridman link), Simon Willison (Lenny's Podcast link)
    - `.small` line: disclaimer that they have not endorsed and are not affiliated
- **Bottom strip:** 1px rule, flex space-between, 24px gap, mono 11px uppercase ink-mid
  - "© 2026 · Ship Responsibly"
  - "Vibecoded with ❤️ by [@juanbfiguera](https://x.com/juanbfiguera)" (link: ink text, hot-pink underline; hover: hot-pink text, ink underline)
  - "v.0.4"

## Interactions & Behavior

This is a static landing page — no JavaScript except for one optional copy-as-prompt button (not present in this version).

- **Hover states:**
  - Nav links: text color shifts from `--ink-soft` to `--ink`
  - Nav CTA: bg flips from `--ink` to `--pink-hot`
  - `.btn-primary`: bg flips from `--ink` to `--pink-hot`
  - `.btn-ghost`: bg fills with `--ink`, text inverts to white
  - Footer bottom link: text → `--pink-hot`, underline → ink
  - All transitions: `.15s` ease (background, color, border-color, transform)
- **Active state:** All `.btn` elements translate `1px` down on `:active`
- **Scroll behavior:** Anchor nav links use standard browser smooth scroll (none configured — uses default)

## Responsive Behavior

Two breakpoints:

### ≤ 1100px (tablet / narrow desktop)

- `.wrap` padding reduces from 56px to 32px
- Built section grid (header) stacks to single column with 32px gap
- How section header stacks
- Step rows collapse from 3-col grid to single column, 24px gap
- Step illustrations get a fixed 180px height
- Buy section grid stacks (book moves below copy), 56px gap
- Footer grid stacks
- Audience cards stay side-by-side (2 cols) down to 720px

### ≤ 720px (mobile)

- `.wrap` padding reduces to 22px
- Hero padding tightens: `24px 0 40px`
- Hero-top row stacks vertically (16px gap)
- Hero headline margin-top: 16px
- Wordmark margin-top: 36px, gap: 4px
- Wordmark mascot is hidden (`display: none`)
- Audience cards finally stack to single column (16px gap)
- Audience card padding shrinks to `22px 20px 24px`
- Summary line: 12px gap, 11px font
- Nav links are hidden (only brand and CTA shown)
- All section padding drops to `64px 0`

## State Management

None required — the page is fully static.

If a developer wants to wire up real functionality:
- The "Get the manual" CTAs should open a Stripe / Lemon Squeezy / Gumroad checkout URL
- "Free sample chapter" should link to a PDF download or email-capture form
- Inspiration footer links open in new tabs (`target="_blank" rel="noopener"`)

## Assets

All assets are inline SVG, drawn from scratch in the prototype. No external image files.

- **Paper plane hero mascot** — inline SVG with body, fold line, inner triangle (lavender fill), and 2 speed lines
- **Coffee cup illustration** (audience card 1) — inline SVG, 5 strokes
- **Stacked PR illustration** (audience card 2) — inline SVG, 3 stacked rectangles + checkmark + line
- **Step icons** — inline SVGs for various small icons (clock, checkbox, etc.)
- **Brand mark on book cover** — inline SVG of a paper plane inside a circle

Fonts are loaded from Google Fonts via a `<link>` in the `<head>`:
- Plus Jakarta Sans (300, 400, 500, 600, 700, 800)
- IBM Plex Mono (400, 500, 600)

Production should consider self-hosting these for performance / privacy.

## Files

- `playful-landing.html` — the complete design reference (single self-contained HTML file with inline styles and scripts)

## Implementation Notes

- **No italics anywhere** — `<em>` elements are explicitly `font-style: normal` and styled with `font-weight: 600 + color: var(--pink-hot)`. Preserve this — italics break the visual system.
- **The SHIP wordmark is the design signature** — the outlined-letter-with-colored-block treatment should be replicated faithfully. Use `-webkit-text-stroke` for outline; behind each letter, an absolutely-positioned colored `<span>` (z-index 1) sits behind the letter (z-index 2). The blocks have per-letter `top` offsets so the colored area aligns with each letterform's interior visually.
- **Color usage is restrained** — most of the page is white + ink with pastel accents reserved for specific moments (audience tiles, step illustrations, full-bleed lavender section, book cover, hero wordmark). Don't add color elsewhere.
- **Type is strict** — only two families, no italics, headlines all uppercase, body sentence case. The contrast between heavy display (h1/h2) and light body is the rhythm.
- **The book cover is a CSS-only graphic** — no images. Recreate using the same flex layout, custom drop shadows, and inline SVG brand mark.

## Open Questions for the Developer

- **Checkout integration**: which payment platform is the manual sold through? CTA URLs need to be wired up.
- **Sample chapter download**: PDF link or email-capture flow?
- **Analytics**: any tracking events to fire on CTA clicks, scroll milestones, etc.?
- **SEO / Open Graph**: a real implementation should add OG tags, structured data, sitemap, robots.txt.
- **Accessibility audit**: prototype includes basic `aria-hidden` on decorative SVGs and semantic HTML, but a full a11y pass (focus styles, keyboard nav, color contrast on pastel cards) should happen before production.
