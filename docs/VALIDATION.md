# Release-candidate verification

Evidence cutoff: 12 September 2026. Candidate: 1.0.0-rc.1; owner editorial sign-off remains pending.

The canonical dataset passes JSON Schema/Ajv and TypeScript semantic validation. The production closure contains 15 institutions, 31 observed interfaces, eight context-specific attribute codings and four analytical assessments, supported by 73 published atomic propositions. The source catalog contains 39 primary documents. All 30 developer × family search cells record their research disposition; blocked retrievals are not recoded as unsupported relationships.

31 research tests cover identifier integrity, primary provenance/versioning, review hashes, separate coders/checkers, temporal status, succession, qualitative derivation, forbidden automatic inferences, publication gating, the coverage floor, explicit story states and the preserved v0.1 archive. Retired scoring tests were removed together with their obsolete implementation after the existing 78-test suite passed before retirement.

Browser acceptance runs in Chromium and WebKit. The 32 checks cover narrative/selection/evidence navigation, axe accessibility of the essay and evidence routes, all eight footnote/backlink focus pairs, reverse scroll, reload at depth, history, rotation, reduced motion a JavaScript-disabled evidence index and all four public translated drafts. Target sizes: 1440×900, 1280×800, 1024×768, 1180×820, 768×1024, 820×1180, 390×844, 430×932, 320×568 and 844×390. Screenshots were inspected manually for the opening, exploration and evidence-card states; a separate agent performed the visual finish review and its three interaction findings were addressed.

Typecheck and the production Next.js build pass. The build revalidates research and deterministically regenerates the published bundle. CI repeats schema, tests, typecheck, build, generated-file consistency and browser acceptance. Local browser testing uses the live development server; it does not substitute for human testing on physical iOS hardware or editorial approval of the research.

## Remaining research limits

Four CDAO award chains remain provisional because exact legal awardee identity is not resolved by the brand-level announcement. Private contract terms, measured migration costs, parity for a named operational function and September continuation remain incomplete. The March transition finding does not claim a measured minimum switching duration, a granted exception, a remote provider shutdown capability, or permanent irreplaceability. Byte-capture failures and incomplete primary registries are disclosed. Agent review is not external expert review.

## Repository audit

Canonical research is flattened into `research/`. Documentation and genuine retired research are under `docs/`. Active export tooling is under `tooling/`; obsolete synthetic generators, duplicate source snapshots, retired chart components and their dedicated styles/tests are deleted. `public/` stays at root for Next.js runtime assets. v0.1 is preserved under `research/releases/v0.1/`. Existing user-local configuration/reference directories and uncommitted retired-figure styling were preserved outside the PR changes.
