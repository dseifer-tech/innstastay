# Deprecations

Items identified as candidates but not removed due to potential usage or requiring confirmation.

| Path/Symbol | Reason | What blocks deletion | How to unblock |
|---|---|---|---|
| styled-components (package.json) | No imports found | Might be used by downstream or planned features | Confirm unused with team; remove dep and run full build/tests |
| react-datepicker (package.json) | No component imports found; CSS token present | Visuals may rely on classes | Audit UI; if unused, remove dep and CSS |
| zod (package.json) | No imports found | May be planned for API validation | Confirm not planned; remove dep |
| lib/sanity.ts projectId fallback | Hard-coded fallback '6rewx4dr' (lib/sanity.ts:L5) | Removing fallback may break local dev without env | Document required env; update code to require env |
| dist/ static folder | Likely unused duplicate of public/ | If referenced externally or by docs | Validate no external references; then delete |
| legacy pricing paths | Marked as legacy but used for compatibility | Still referenced by services/tests | Keep until all dependent flows migrated |
