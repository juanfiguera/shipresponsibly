# v2 → Production Swap Plan

The production-ready v2 lives in this folder:

- `v2/index.html` — full markup with SEO meta, OG/Twitter cards, gtag, `<main>` landmark, accessible SHIP wordmark, wired CTAs
- `v2/styles.css` — extracted token system + layout + contrast/a11y fixes
- `v2/script.js` — playbook click tracking (the only JS the page needs)

Static reference (no SEO/a11y/contrast fixes):
- `v2/playful-landing.html` — original design handoff (do not deploy this directly)
- `v2/README.md` — handoff documentation for the visual system

Helper renders (gitignored locally):
- `v2/.render-desktop.png`, `v2/.render-mobile.png`

## Fixes already applied to v2/

- `-webkit-text-stroke` fallback via `@supports` (SHIP wordmark stays legible on browsers that can't stroke transparent text)
- CTAs wired: `Get the manual` → `/playbook`, `Free sample chapter` → `/sample`, `Manual` nav anchor → on-page `#buy`
- `<main>` wraps hero through buy
- `:focus-visible` ring (pink-hot on light surfaces, ink on dark CTAs)
- `prefers-reduced-motion` neutralizes every transition + the mascot rotation
- `--ink-dim` darkened from `#98999f` → `#6e6f76` (2.7:1 → 5.0:1 on white)
- `.book .b-foot .pn` scoped to `--ink-soft` so it stays readable on lavender
- `.btn-primary:hover` swaps to ink-on-pink-hot (was white-on-pink-hot, 2.8:1 fail)
- `.nav-cta:hover` swaps to ink-on-pink-hot for the same reason
- Footer links: ink text + pink-hot underline (was pink-hot text, 2.8:1 fail)
- SHIP wordmark wrapped with `role="img" aria-label="Ship"`; individual letters `aria-hidden`
- Decorative pill glyphs, scrolltag arrow, audience SVGs, mascot, book cover all marked `aria-hidden`
- Brand link `href="/"` (was `href="#"`)
- `<noscript>` block restates the proposition for crawlers + JS-disabled users
- SEO meta: canonical, OG, Twitter cards, favicon SVG (paper plane in dark square)

## Swap to public/ — checklist

When you're ready to make v2 live (separate step from this work):

1. **Regenerate OG image to match v2 aesthetic.** Current `public/assets/og-image.png` is the Dept of Shipping orange-on-cream. v2 needs a pastel/white version (Plus Jakarta Sans + SHIP wordmark + paper plane). Use `generate-og.py` as the template or build a one-off.
2. **Move the files:**
   - `mv public/index.html public/index.dept-of-shipping.html.bak` (optional archive)
   - `mv public/styles.css public/styles.dept-of-shipping.css.bak`
   - `mv public/script.js public/script.dept-of-shipping.js.bak`
   - `cp v2/index.html public/index.html`
   - `cp v2/styles.css public/styles.css`
   - `cp v2/script.js public/script.js`
   - Update the two relative refs back to absolute: `href="styles.css"` → `href="/styles.css"`, `src="script.js"` → `src="/script.js"` (Vercel serves `public/` as root)
3. **Verify `vercel.json` redirects** still point at the right Gumroad URLs (`/playbook` and `/sample`).
4. **Archive `DESIGN-REVIEW.md` and `mockups/hero-v2.html`** with a note that they describe the previous direction. Don't delete — useful as a learning record.
5. **Update `README.md`** at project root: the "playbook" framing → "pre-flight manual"; the "Take the Are You Shipping Under the Influence? self-assessment" bullet is no longer applicable.
6. **Update `TODOS.md`**: D3 (story-submission endpoint) is obsolete — v2 has no story-submission card. Remove the entry, or replace with v2-specific TODOs (see "Carried forward" below).

## Strategic risks accepted by adopting v2 (from review)

These were locked in when you chose "adopt v2":

- **S1.** The engagement layer (assessment, certificate, pledge, horror stories) is gone. The shareable cert PNG conversion lever doesn't exist in v2.
- **S2.** "Department of Shipping" brand world (Issue №07, DS·2026·04·20, § notation, Developer General) is replaced by a pastel-editorial direction that's well-executed but less unique.
- **S3.** Product framing shifted from "what you'll be able to DO after reading this" (6 chapter promises) to "what's IN the manual" (severity model + checklist + prompts + postmortems).
- **S4.** Refund window changed 90 days → 30 days. Confirm intentional.

## Carried forward to track (post-swap)

- **OG image regeneration** to v2 aesthetic (blocking the swap, see step 1 above).
- **Real `/sample` destination** (currently a Gumroad free product redirect — confirm it still matches the "free sample chapter" promise).
- **Decision on whether to revive any engagement layer** (audience-targeted lightweight self-cert, a smaller pledge, etc.) — explicitly removed from v1.0 but worth a follow-up call.
