# Cepheus Design System

The visual language of Cepheus: a warm-paper publication whose essays hold live instruments. This document is the source of truth. Tokens defined here live in `app/global.css` under `:root`; component styles reference tokens, never raw values.

Aesthetic lane: **antique-paper editorial meets quiet scientific instrument.** Think a letterpress monograph with working diagrams tipped in, not a product dashboard. Cajal's ink drawings, Kawase's dusk washes, the restraint of *ma*.

---

## Canonical visual references

The following files are the approved visual references for Cepheus:

- `public/brand/cepheus-brand-home.png`
- `public/brand/cepheus-brand-essay.png`

For future UI, branding, social-preview, or visual work, inspect these image files directly.

Do not recreate or reinterpret the brand from a written description when these references are available. The images themselves are the canonical visual references.

---

## 1. Color

OKLCH throughout. Neutrals are tinted toward the paper hue (never `#000` / `#fff`). Strategy: **restrained brand surface** (paper + ink + one olive accent), with a **committed categorical palette used only inside instruments**.

### Neutrals (warm paper + brown ink)

| Token | OKLCH | Role |
|---|---|---|
| `--paper` | `oklch(0.949 0.020 84)` | Page background (the cream, ≈ old #f5efe1) |
| `--paper-bright` | `oklch(0.976 0.013 86)` | Brightest sheet; card sheen, highlights |
| `--paper-raise` | `oklch(0.963 0.016 85)` | Tool-card surface (a fresh sheet on the desk) |
| `--paper-deep` | `oklch(0.905 0.028 82)` | Deeper cream; tracks, insets (≈ old #ece0c8) |
| `--paper-sink` | `oklch(0.886 0.030 81)` | Chart plot wells, pressed areas |
| `--ink` | `oklch(0.285 0.043 47)` | Primary text, headings (≈ old #3a2118) |
| `--ink-soft` | `oklch(0.405 0.050 44)` | Body text (≈ old #5d3b2c) |
| `--ink-muted` | `oklch(0.520 0.038 46)` | Captions, secondary labels |
| `--ink-faint` | `oklch(0.620 0.028 50)` | Axis ticks, meta, disabled |

### Accent (olive, load-bearing)

| Token | OKLCH | Role |
|---|---|---|
| `--olive` | `oklch(0.470 0.083 133)` | The accent: links, active state, kicker (≈ #3f5d32) |
| `--olive-soft` | `oklch(0.565 0.078 122)` | Lighter olive, secondary accent (≈ #6f7d48) |
| `--olive-deep` | `oklch(0.400 0.075 137)` | Pressed / high-emphasis accent |

### Lines (derived, so alpha tracks ink)

`--rule: color-mix(in oklab, var(--ink) 16%, transparent)` · `--rule-soft: … 9% …` · `--rule-strong: … 26% …`

### Categorical data palette (instruments only)

Six muted, earthen, equal-weight hues, spaced around the wheel and legible on cream. Assign by *meaning* and hold the assignment across all three tools (a topic keeps its color).

| Token | OKLCH | Cast | Typical meaning |
|---|---|---|---|
| `--series-1` | `oklch(0.520 0.090 142)` | sage green | AI / governance |
| `--series-2` | `oklch(0.530 0.115 42)` | terracotta | security / defense |
| `--series-3` | `oklch(0.550 0.065 245)` | slate blue | infrastructure |
| `--series-4` | `oklch(0.660 0.100 78)` | ochre | resources / minerals |
| `--series-5` | `oklch(0.500 0.075 355)` | dusty plum | health / bio |
| `--series-6` | `oklch(0.520 0.060 196)` | pine teal | institutions |

Rules: never rely on hue alone (direct-label series; use position, order, shape too). Fills are the same hue via `color-mix(... 14-22% ..., transparent)`. Keep chroma modest so nothing screams on paper.

---

## 2. Typography

Two families, already loaded via `next/font`. No third family; the "label" voice is the text face in tracked caps.

- **Display** `--font-display` = *IM Fell English* (antique letterpress serif). Headings, large numerals, node/point labels.
- **Text** `--font-text` = *Libre Baskerville*. Body, captions, and **micro-labels** (uppercase, `letter-spacing: 0.14em`) for eyebrows like `TOPIC MOMENTUM OVER TIME`, axis titles, panel field labels.

### Scale (fluid, ratio ≥ 1.25)

| Token | Value | Use |
|---|---|---|
| `--t-hero` | `clamp(3rem, 7vw, 5.2rem)` | Essay / landing H1 |
| `--t-h2` | `clamp(1.95rem, 3.4vw, 2.55rem)` | Section headings |
| `--t-h3` | `clamp(1.35rem, 2.1vw, 1.62rem)` | Sub-headings |
| `--t-tool` | `clamp(1.3rem, 2vw, 1.5rem)` | Tool titles |
| `--t-lead` | `1.2rem` | Subtitle / lead |
| `--t-body` | `1.02rem` | Body (line-height 1.8) |
| `--t-small` | `0.9rem` | Captions, panel text |
| `--t-label` | `0.72rem` | Tracked-caps micro-labels |
| `--t-tick` | `0.66rem` | Axis ticks |

Body measure **62–68ch**. Numerals in data prefer tabular alignment (`font-variant-numeric: tabular-nums lining-nums`).

---

## 3. Space & rhythm

Scale (rem): `--space-3xs .25` · `--space-2xs .5` · `--space-xs .75` · `--space-sm 1` · `--space-md 1.5` · `--space-lg 2.25` · `--space-xl 3.5` · `--space-2xl 5.5`.

Vary spacing for rhythm; do not pad everything equally. Section gap is generous (`--space-2xl`); tight groupings inside instruments. Reading layout: `220px` rail + `minmax(0, 720px)` column; instruments may break the column to a wider `760–860px` measure.

---

## 4. Elevation

Letterpress, not floating glass. **No glassmorphism, no heavy drop shadows.**

- `--edge`: `inset 0 0 0 1px var(--rule)` (hairline)
- `--sheen`: `inset 0 1px 0 color-mix(in oklab, var(--paper-bright) 85%, transparent)` (top light)
- `--shadow-card`: `0 1px 1px color-mix(in oklab, var(--ink) 5%, transparent), 0 14px 34px -18px color-mix(in oklab, var(--ink) 16%, transparent)`

Tool card = `--paper-raise` + `--radius` + `--edge` + `--sheen` + `--shadow-card`. Radii: `--radius-sm 7px` · `--radius 11px` · `--radius-lg 16px` · `--radius-pill 999px`.

---

## 5. Motion — the ink language

Everything that animates should feel *drawn*. Curves ease out; nothing bounces.

- `--ease-expo`: `cubic-bezier(0.16, 1, 0.3, 1)` · `--ease-quart`: `cubic-bezier(0.25, 1, 0.5, 1)`
- Durations: `--dur-1 160ms` (state) · `--dur-2 320ms` (transition) · `--dur-3 620ms` (reveal) · `--dur-draw 1300ms` (ink draw)
- **Ink-draw**: lines/edges reveal via `stroke-dasharray` + `stroke-dashoffset` → 0. Bubbles/nodes scale-fade in with a small stagger by index.
- Instruments reveal once on scroll-in (`IntersectionObserver`, run-once), not on every pass.
- Number changes tween; bars transition `width`/`transform` (never animate layout props like `height` on lists, use `transform`).
- **`prefers-reduced-motion`**: no draw, no stagger; content appears at rest, transitions collapse to ≤1ms. State feedback (hover, selection) stays.

---

## 6. Instrument (data-viz) specs

Shared **Tool Card**: header (title · inline info tooltip `ⓘ` · "About this tool" `<details>` disclosure), body, one-line caption beneath. Info is progressive disclosure, **never a modal**.

- **Axes**: single hairline (`--rule-strong`); ticks in `--ink-faint` at `--t-tick`; axis titles in tracked caps `--t-label`. Gridlines `--rule-soft`, sparse.
- **Legend**: inline, direct swatch + label in `--t-label`; interactive legends toggle series.
- **Tooltip / readout**: `--paper-bright`, `--edge`, `--radius-sm`, small; follows cursor or pins to a fixed readout slot.
- **Line chart**: 1.6px strokes in series colors, round caps/joins; hover crosshair + dot; range toggles as a chip group.
- **Scatter**: bubbles = series fill + hairline stroke; radius encodes a third measure (area-true: `r ∝ √value`); quadrant guides in `--rule-soft` with tracked-caps corner labels.
- **Node-link**: nodes filled `--paper-bright`, stroked by kind color, radius by weight; edges `--rule` → series color when incident to selection, width by strength; selected node gets a focus ring.
- **Sliders**: thin track (`--paper-deep`), olive fill, circular thumb with `--edge`; show the numeric value; keyboard operable.
- **Filter chips**: pill row; selected = `--olive` text on `--olive` 12% fill + olive hairline; rest = `--ink-muted`.
- **Numbers**: tabular; one decimal for scores; thousands grouped. **Loading**: a quiet ruled placeholder, never a spinner. **Empty**: a plain sentence.

---

## 7. Accessibility

- Body/heading ink on cream clears WCAG AA (`--ink`, `--ink-soft`, `--olive` all pass on `--paper`). `--ink-faint` is for non-essential ticks only.
- Every instrument is keyboard operable (chips, sliders, nodes, bubbles are real buttons/inputs with focus states) and carries a text alternative (`aria-label`, a data `<table>` behind `.visually-hidden`, or a described summary).
- Visible focus ring: `2px` olive outline, `2px` offset, on `--paper`.
- Honor `prefers-reduced-motion`. Never encode meaning in color alone.
- Hit targets ≥ 40px on touch; tooltips also available on focus, not hover-only.

---

## 8. Do / Don't

**Do**: tint every neutral toward paper; give instruments room; direct-label data; let the essay breathe; make one decisive move per section.

**Don't** (match-and-refuse): side-stripe accent borders; gradient text / `background-clip:text`; glassmorphism; hero-metric templates; identical icon-card grids; nested cards; modals for disclosure; monospace-as-costume; em dashes in copy; pure black or white; animating layout properties.

---

## 9. Content honesty

Instrument data is illustrative (Cepheus is a proposal). Keep a light "illustrative, drawn from cited sources" note near the instruments, and wire every data point's citations to the References list. Never imply live or authoritative figures.
