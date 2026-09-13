# Institutional constellation v2

Branch: `feat/institutional-constellation-story-v2`, from merged PR #2 (`d3264dc`).

## Boundary

Following the user's approval after PR #3 merged, the editorial constellation now serves every canonical essay in development and production. The development `/map-preview` route shows the same renderer. The old production renderer and its unused CSS have been removed; Git history preserves them. No research, publication status, source, evidence, or analytical record is changed.

## Interaction contract

A fixed 780 × 820 categorical field holds all 15 published institution identities and all 31 documented interface identities. Public/governance institutions occupy the left, developers the right, evaluation/research the middle/lower area. Position, routing lanes, motion, circle size, and distance are not research quantities. The public/private separation is 584 layout units and does not vary across states.

Opening foreground is DoD–Anthropic and their contested interface. Public decisions introduce named public actors and OpenAI; interfaces extend the developer/government field; technical knowledge introduces named evaluators and LLNL; provenance retains that world with an inspectable lineage; final exploration also reveals OpenMined and the complete published network. Reverse scrolling fades earlier-stage context rather than destroying identities. A followed relationship can reveal its counterpart while retaining the current story context.

Nodes remain mounted at fixed positions. A nearby 14-unit translation resolves using the tested critically damped settling curve; opacity resolves over 1.1 seconds and recedes over .9 seconds. SVG paths draw over 1.05 seconds after a .55-second endpoint lead-in. Follow traces from the chosen institution and retains previous traced interfaces. Reduced motion is immediate. Pointer-wheel input belongs to essay scrolling. Manual pan/pinch zoom and keyboard zoom/reset remain available; story/follow never reframe the camera. Resize can fit the field again. Wide, short portrait-tablet frames use a viewport-only vertical projection (410-unit height), preserving horizontal separation and readable row spacing instead of shrinking the entire tall world into a narrow strip. Story state never changes this projection.

The study reuses the published projection, existing explicit story markers, locale-aware evidence routes and clearly labeled analytical assessments. The preview-only layout override that forced portrait tablets into side-by-side columns is removed; the existing v1 top-sticky tablet composition remains.

## Established patterns

- React Flow controlled nodes and viewport conventions: https://reactflow.dev/api-reference/react-flow
- SVG path-length drawing: https://motion.dev/docs/react-svg-animation
- IntersectionObserver chapter transitions: https://github.com/russellsamora/scrollama
- Categorical clustered marks: https://observablehq.com/@d3/clustered-bubbles

## Verification

The promoted baseline passed research validation, all 46 unit tests, typecheck,
production build, deterministic export and all 46 Chromium/WebKit browser checks
in CI at `d0e0f38`. The author approved the v2 visual for the public essay.

`internal/tests/e2e/constellation-study.spec.ts` records video, traces and stills for
desktop, landscape tablet, portrait tablet and phone. It checks opening framing,
chapter transitions, full exploration, Follow, manual pan/zoom, label/edge
alignment, keyboard access, reduced motion and axe accessibility. The companion
reading tests cover additional viewport sizes, evidence routes, notes and languages.
Tests run remotely in CI; these results do not imply local interactive browser access.

## Production promotion

The complete motion/geometry acceptance suite now targets `/essays/what-we-owe-to-each-other`, including the production renderer's evidence cards and full-network exploration. PR #3 passed all 46 browser checks before promotion. The promotion is a renderer selection change, not a second visual implementation.
