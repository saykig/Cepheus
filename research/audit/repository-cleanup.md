# Repository cleanup audit — 13 September 2026

The promoted v2 baseline passed CI at `d0e0f38` before structural changes began.
This pass changes repository organization, not UI behavior or research records.

## Deletion evidence

- `research/UI-BRIEF.md`: no tracked consumer or document link was found by a
  repository reference search before deletion. Its zero-edge overview and
  persistent analytical annotation describe the retired renderer. The approved
  v2 implementation and corrected `docs/CONSTELLATION-V2.md` supersede it.
  Git history at `d0e0f38` preserves the document; another archive copy adds no value.
- Root `tests/` and `tooling/`: removed only after moving every tracked file into
  `internal/` and confirming the directories were empty.

## Retained material

- `docs/CONSTELLATION-V2.md`: retained as the current implementation contract;
  obsolete pre-promotion status is removed and test paths are updated.
- `docs/archive/gap-matrix/`: all eight files are research methodology, rubrics,
  source/evidence records and coded assessments. They preserve the earlier
  methodological approach and its limitations; none is a runtime/build input.
- `docs/archive/visualizations/2026-09-12/`: the retirement note and source registry
  preserve bibliography context. No retired component, generator or executable
  implementation remains in this archive, so no implementation files were deleted.
- `public/`, root framework/package configuration and active pnpm `patches/`
  remain in place. Untracked personal tooling/reference directories are untouched.

## Paths

Unit tests: `internal/tests/unit/`; browser tests: `internal/tests/e2e/`;
validator/exporter: `internal/tooling/institutional-map.mts`.
Package scripts and Playwright configuration resolve those locations. CI invokes
those scripts, so it has no direct old test/tooling path to replace.

Review metadata references now name `research/audit/checker-notes.md`. This changes
only the document locator in review metadata, not material research or approval
hashes; the generated bundle is refreshed accordingly.
