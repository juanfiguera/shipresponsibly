# TODOs

## Post-v2 ship (2026-05-21)

### Confirm `/sample` destination still matches the v2 promise

**Source:** `vercel.json` redirect `/sample` → Gumroad free product (set up in commit `493d71e`).

**Problem.** v2 markets the free download as "Free sample chapter" of the pre-flight manual. The current Gumroad target was set up for the previous Department-of-Shipping playbook. Verify the linked Gumroad product is now the v2 sample (Pre-Flight Manual chapter excerpt), not the old playbook teaser. If still old, swap the redirect target.

**Pros of fixing:** trust signal — the CTA promise matches the asset.
**Cons of deferring:** users clicking "Free sample chapter" get a stylistically mismatched freebie that says "playbook," not "manual."

### Update the Gumroad product page itself

**Problem.** The `/playbook` redirect points to a Gumroad listing whose copy, title, and thumbnail are still "The Playbook" / Department of Shipping aesthetic. v2 ships a different positioning ("Pre-Flight Manual") and aesthetic. Either rename the Gumroad listing + replace the thumbnail (`public/assets/gumroad-thumbnail.png` needs regeneration to v2 style), or create a new listing and update `vercel.json`.

**Depends on:** new gumroad-thumbnail.png — `generate-og.py` produces the old Dept of Shipping square; needs a v2 equivalent.

### Decision: revive any engagement layer?

**Source:** v2 removed the live site's 5-question assessment, certificate, pledge, and horror stories. `DESIGN-REVIEW.md` (archived) documents the previous interactive layer.

**Question.** Is a lightweight engagement loop worth bringing back inside v2's visual system? Possible shapes: a 30-second "What level am I?" picker (just the severity tier), a one-click pledge with a v2-style downloadable card, or audience-specific landing variants for first-time vs career engineer. All optional; deliberately out of v1.0 scope.

**Depends on:** real traffic / conversion data from v2 first. Don't decide pre-emptively.
