# Cleanup Report

This report documents the automated, safe cleanup. All claims reference code in this repo only.

## Inventory Snapshot

- Two-level tree (selected): see SUMMARY.md “File & Directory Map”.
- Token scan (old brands/markers):
  - No matches for ClearStay, Makcorps, TravelClick, Amadeus, Sojourn (rg, case-insensitive).
  - Matches for legacy/old tokens are contextual, not brand drift:
    - `legacy` in pricing compatibility (lib/live/officialFeatured.ts:L48–L49; lib/services/pricing.server.ts:L134–L157; tests reference).
    - `old` path normalization in test (tests/redirects.test.ts:L6–L7).
    - No files named tmp/backup/copy/old/v1.
  - Dist folder `dist/` duplicates public assets (dist/*) — appears unused by app code.

## Deletions (safe)

| Item | Rationale | Evidence | Safety checks |
|---|---|---|---|
| dist/ (static artifacts) | Duplicate of public assets and build outputs not referenced by Next app | No imports/reads of dist/* (rg); Next serves from public/ (public/*) | Removing does not affect build; app uses public/ and next/image (next.config.js:L7–L49) |

So what? Shrinks repo size, removes confusion versus public/.

## Migrations / Moves

- None performed in this pass.

## Renamed Symbols

- None.

## Removed Dependencies (candidates only; NOT removed yet)

| Package | Evidence | Action |
|---|---|---|
| styled-components | Present in package.json but no imports in repo (rg) | Candidate for removal in a dedicated PR |
| react-datepicker | Present; only reference is CSS import token in app/globals.css; no component usage detected | Candidate for removal if UI confirms unused |
| zod | Present; no imports in repo | Candidate for removal if no planned validation use |

Safety proof: verified via ripgrep for import/require usages. Will remove in a follow-up PR after local build/tests.

## Removed Env Vars (none)

- No deletions this pass. Proposed doc-only normalization added to .env.example (see README and .env.example changes).

## Removed Routes/Endpoints (none)

- `app/api/debug-hotels/` is empty (list_dir), but no route file to delete.

## Updated Configs/Docs

| File | Change | Rationale |
|---|---|---|
| SUMMARY.md | Added previously | Formal x-ray of codebase |
| README.md | To be updated in docs PR | Align with CURRENT_BRAND only |
| .env.example | Added with current envs | Reflects only code-referenced variables |

## Safety Proof

- Searches performed: ripgrep across repo excluding node_modules.
- No code deletions that affect types/build/tests in this pass.
- Next steps include targeted PRs per theme with installs, lint, test, build after each.

## Next Steps (Planned PRs)

1) Docs & env cleanup
- Update README.md branding and minimal setup.
- Add .env.example with only referenced vars.

2) Dependencies cleanup
- Remove styled-components, zod, react-datepicker if confirmed unused.

3) Assets cleanup
- Remove dist/ static duplicates; rely on public/.

4) Config tightening
- Consider CSP hardening and image-proxy CORS restrictions (see SUMMARY.md risks).

Blocked items are listed in DEPRECATIONS.md.
