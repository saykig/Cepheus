# Cepheus design system

Cepheus is a warm-paper publication with quiet, inspectable institutional figures. Canonical references are `public/brand/cepheus-brand-home.png` and `public/brand/cepheus-brand-essay.png`. The homepage watercolor interaction remains distinct from the research constellation.

Use the existing `app/global.css` tokens: paper, brown ink, olive accents and subtle rules. IM Fell English provides headings and institution labels; Libre Baskerville provides prose. No dashboard panels, multicolor clusters, ranking, numeric importance or decorative metrics.

## Essay composition

Title/subtitle share the prose's left edge. At ≥1000px width and ≥700px height, prose and sticky visual use approximately 53/47 of the available width with a 24–48px gap. The figure starts beside the opening and releases before Notes. At 700–999px width and ≥700px height, a compact top-sticky view uses roughly 32–40% of the viewport, then releases at exploration. Phones and short windows read in normal flow, with only three deliberate visual moments.

Phone prose remains 18px at 1.65 line-height with 20px page padding. Superscript notes are .65em, transparent, with enlarged touch targets and exact backlinks. Hover or keyboard focus previews a floating paper tooltip card; click/tap keeps it open without scrolling. Escape, Close, or an outside press dismisses it. “View in Notes” explicitly navigates to the numbered endnote. Cards keep citation links usable and fit within the viewport. Header and content accommodate 320px width, safe areas, zoom and orientation changes.

## Constellation contract

THESIS: Institutions assemble beside an argument, and any finding can be audited.
OWN-WORLD: Cepheus paper, brown ink, olive selection and established typography.
STORY: Read → inspect one interface → distinguish analysis → audit its provenance.
FIRST VIEWPORT: Prose at left; Anthropic and DoD show the dated contested interface.
FORM: Deterministic clustered institutional marks; no permanent network web.

Sorted institution IDs and fixed D3 collision ticks generate categorical coordinates during export. React renders the marks; no runtime force simulation mutates the DOM. Equal circles do not measure power. Functional clusters are categorical and not mutually exclusive political classifications. Distance means no quantity.

One contextual line/token represents a directly documented mechanism. A separate restrained label identifies reviewed analysis. Opening, public decisions, interfaces, technical knowledge, provenance and exploration are explicit narrative states. Overview starts with zero edges. User selection exposes a compact nonmodal card; full evidence lives on its own route.

Interaction targets are at least 44px; visible circles are smaller. Keyboard focus, arrow navigation, Enter/Space, Escape, reduced motion, normal scrolling and non-hover evidence access are required. No state-by-state screen-reader announcements. Responsive presentations use the same publication dataset and story model. Small layouts expand the plot vertically rather than shrinking typography into illegibility.

## Local map motion study

The development-only `/en/map-preview` reuses the essay and published research bundle. React Flow renders transparent editorial labels and olive marks above a fading graph-paper surface. Scroll markers select the existing six story states; clicking explores a trail and panning/zooming can reveal earlier institutions. Hover/focus opens reading details, with touch actions available.

This preview uses a bounded D3 simulation on copied presentation nodes: target springs, equal collision radii and weak link attraction let institutions settle after each section change. Forces encode no research quantity. Motion animates presence and labels; forward/reverse scroll chooses entry and exit direction. Transitions are cancelled on replacement/unmount and reduced motion uses stationary target positions. Production constellation behaviour remains governed by the contract above.
