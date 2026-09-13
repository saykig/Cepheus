# Paused Cepheus visualizations

Archived on 12 September 2026. The essay now uses one institutional map.
The Gap Matrix, Friction Index and right-side capability/capacity chart do not
mount, fetch data or animate in development, preview or production.

`components/` holds verbatim source snapshots with `.txt` appended, including
the prior institutional map and chart stylesheet. `data/` holds the legacy
illustrative JSON, plus a snapshot of the essay source/footnote registry.
The three paused components also remain dormant at their original source paths
to preserve existing imports in research tests; no essay imports them.
Their old `/data/` endpoints are intentionally no longer served.

The complete pre-change tracked application is commit `8b0733b`. No branch was
created. To revisit a visual, copy its archived JSON back to `public/data/`,
restore its component/stylesheet from the snapshots if needed and deliberately
import it into a local experiment. Refer to that commit for its original essay
placement, captions, index entries and shared CSS. There is no environment flag
that silently restores the old charts on localhost.

The original research scaffold remains in `public/data/gap-matrix/`. It is
reference material for future methodology work, not input to the new map.
The archived synthetic weights and generated trajectories must not be presented
as observed evidence. Tests of archived data preserve history; they do not
endorse its measurement validity.
