# Institutional constellation v2 study

Branch: `feat/institutional-constellation-story-v2`, from merged PR #2 (`d3264dc`).

## Boundary

The stable renderer continues serving canonical essays in development and production. Only the explicit development `/map-preview` route activates the v2 study. No research, publication status, source, evidence, or analytical record is changed. The older consolidated experiment remains recoverable in the named git stash; its evidence-disclosure and circle-port work informed this study, without restoring its production replacement.

## Interaction contract

A fixed 780 × 820 categorical field holds all 15 published institution identities and all 31 documented interface identities. Public/governance institutions occupy the left, developers the right, evaluation/research the middle/lower area. Position, routing lanes, motion, circle size, and distance are not research quantities. The public/private separation is 584 layout units and does not vary across states.

Opening foreground is DoD–Anthropic and their contested interface. Public decisions introduce named public actors and OpenAI; interfaces extend the developer/government field; technical knowledge introduces named evaluators and LLNL; provenance retains that world with an inspectable lineage; final exploration also reveals OpenMined and the complete published network. Reverse scrolling fades earlier-stage context rather than destroying identities. A followed relationship can reveal its counterpart while retaining the current story context.

Nodes remain mounted at fixed positions. A nearby 14-unit translation resolves using the tested critically damped settling curve; opacity resolves over 1.1 seconds and recedes over .9 seconds. SVG paths draw over 1.05 seconds after a .55-second endpoint lead-in; the selected mechanism caption follows at 1.6 seconds. Follow traces from the chosen institution and retains previous traced interfaces. Reduced motion is immediate. Pointer-wheel input belongs to essay scrolling. Manual zoom/pan and Fit remain available; story/follow never reframe the camera. Resize can fit the field again. Wide, short portrait-tablet frames use a viewport-only vertical projection (410-unit height), preserving horizontal separation and readable row spacing instead of shrinking the entire tall world into a narrow strip. Story state never changes this projection.

The study reuses the published projection, existing explicit story markers, locale-aware evidence routes and clearly labeled analytical assessments. The preview-only layout override that forced portrait tablets into side-by-side columns is removed; the existing v1 top-sticky tablet composition remains.

## Established patterns

- React Flow controlled nodes and viewport conventions: https://reactflow.dev/api-reference/react-flow
- SVG path-length drawing: https://motion.dev/docs/react-svg-animation
- IntersectionObserver chapter transitions: https://github.com/russellsamora/scrollama
- Categorical clustered marks: https://observablehq.com/@d3/clustered-bubbles

## Verification status

Research/model tests and typecheck pass. Model tests enforce stable identities/positions across forward and reverse stages, opening/final membership, endpoint validity, persistent Follow context, nonquantitative separation, monotonic bounded settling, and preview isolation.

`tests/e2e/constellation-study.spec.ts` records video and traces for desktop, landscape tablet, portrait tablet and phone, including initial load, chapter expansion, provenance, full exploration, Follow, manual pan/zoom and return. It captures stills and runs axe and keyboard checks. These browser acceptance tests have **not been executed locally**: the approved localhost browser access was denied because its admin policy could not be verified, and alternative localhost access cannot be used to bypass that denial. Recorded artifacts and human motion review remain required; code and unit tests do not constitute visual acceptance.

Promotion to the canonical essay is explicitly pending visual, responsive, motion and accessibility acceptance. Do not merge this study as a finished production renderer.
